@app.route('/generate_trading_signals', methods=['GET'])
def generate_trading_signals():
    try:
        # Logging
        logging.info("Endpoint '/generate_trading_signals' was called.")

        # Calculate warmup period of data
        data_window_hours = 12
        nb_entries = (12 * 60 // 5) + 2 # 146 entries, the plus 2 is just to be safe    
        docs = (db.collection(COLLECTION_NAME)
                .order_by('createdAt', direction='DESCENDING')
                .limit(nb_entries)
                .stream())

        # Setup the data frame
        df = core_utils.prepare_df(docs)

        # Compute TI
        # Check the values on https://dexscreener.com/polygon/0x5b41eedcfc8e0ae47493d4945aa1ae4fe05430ff
        df = core_utils.compute_technical_indicators(df)
        
        # Get last position
        position_docs = (db.collection('positions')
            .order_by('timestamp', direction='DESCENDING')
            .limit(1)
            .stream())

        current_position = None 
        for position_doc in position_docs:
            position_type = position_doc_data.get('positionType')
            if not position_type:
                raise ValueError("No positionType found or it has no value.")
            print(position_type)
            current_position = position_doc_data.get('positionType')

        # Call the live trading function. Returns buy, sell or hold
        signal = live_trade_macd_only(
            simulation_df=df,
            current_position=current_position,
            lookback_period=20,
            sideways_threshold=0.02,
            velocity_window=5,
            velocity_threshold=0.01
        )

        signalAndMetaData = addMetaDataToSignal(signal, df)

        print(f"Trading Signal and meta data: {signalAndMetaData}")

        # Add a result to the 'signals' collection
        db.collection('signals_137_0xae81fac689a1b4b1e06e7ef4a2ab4cd8ac0a087d').add(signalAndMetaData)

        return jsonify({
            'status': 'success',
        }), 200

    except Exception as e:
        logging.error(f"Error in '/generate_trading_signals': {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500   