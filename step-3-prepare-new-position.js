const executeOpenLongPosition = async (signal) => {
  try {
    // Get quote token from signal
    const quoteToken = getQuoteToken(signal); // USDT

    // Buy base token
    const { priceQuotePerAmountOutTokenBN, tokenAddresses } = await acquireBaseToken(signal);

    // Use the close price as the base token price
    const quoteTokenPrice = truncateToDecimals(quoteToken.tokenOHLC.close, quoteToken.token.decimals).toString();
    const quoteTokenPriceBN = ethers.utils.parseUnits(quoteTokenPrice, quoteToken.token.decimals)
    
    // Calculate stop loss for long position
    const stopLossPriceBN = calculateLongPositionStopLoss(quoteToken, quoteTokenPriceBN);

    // Add new position to MongoDB
    const updatedPosition = buildUpdatedPosition(signal, PositionType.OPEN_LONG_POSITION, priceQuotePerAmountOutTokenBN.toString(), stopLossPriceBN.toString());
    await addNewOpenPositionToMongoDB(updatedPosition);

    return { success: true, error: 'Open long position successful' };
  } catch (error) {
    console.error('Open long position operation failed:', error);
    return { success: false, error: error };
  }

};