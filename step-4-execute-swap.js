const express = require('express');
const logger = require('../logs/logger');
const router = express.Router();
const ERC20ABI = require('../abi/erc20.json');
const { createERC20Contract } = require('../services/blockchainService');
const { getQuickswapPosV3RouterContract } = require('../services/quickswapService');
const { prepareTransactionOptions } = require('./helpers');
const { selectedConfig } = require('../config/config');
const ethers = require('ethers');

router.post('/swap', async (req, res) => {
  // Log request 
  logger.log({ level: 'info', message: 'API Request', routePath: '/api/quickswap/swap', method: 'POST', statusCode: "Pending..." });

  // Get provider and wallet
  const provider = req.provider;
  const wallet = req.wallet;
  const quickswapPosV3RouterContract = getQuickswapPosV3RouterContract(wallet);

  try {
    const { amountIn, amountOutMinimum, tokenIn, tokenOut, tokenInDecimals, recipient } = req.body;

    // Input validation
    if (isNaN(amountIn) || isNaN(amountOutMinimum) || !tokenIn || !tokenOut || !Number.isInteger(tokenInDecimals) || !recipient) {
      return res.status(400).json({
        status: 400,
        message: 'Missing or invalid required parameters: amountIn, amountOutMinimum, tokenIn, tokenOut, tokenInDecimals, recipient',
        txResponse: null,
        txReceipt: null
      });
    }

    // Create Contract instance
    const baseTokenContract = createERC20Contract(tokenIn, ERC20ABI);

    // Convert amountIn to BigNumber
    const amountInBN = ethers.BigNumber.from(amountIn);

    // Verify balance
    const balance = await baseTokenContract.balanceOf(wallet.address);
    console.log("Wallet address: ", wallet.address);
    console.log(`Balance: ${balance.toString()}`);
    if (balance.lt(amountInBN)) {
      return res.status(400).json({
        status: 400,
        message: `Balance is less than the amount to be swapped. Balance: ${balance.toString()}, AmountIn: ${amountInBN.toString()}`,
        txResponse: null,
        txReceipt: null
      });
    }

    // Setup tx options
    const approveMethodName = 'approve'; 
    const approveMethodArgs = [quickswapPosV3RouterContract.address, amountIn]; 
    const approveTransactionOverrides = {};
    const approveTxOptions = await prepareTransactionOptions(baseTokenContract, approveMethodName, approveMethodArgs, provider, approveTransactionOverrides);
    
    // Approve the router to spend tokens
    const approveTx = await baseTokenContract.connect(wallet).approve(quickswapPosV3RouterContract.address, amountIn, approveTxOptions);
    await approveTx.wait(selectedConfig.nbBlocksToConfirm); 

    // Verify allowance
    const allowanceBN = await baseTokenContract.allowance(wallet.address, quickswapPosV3RouterContract.address);
    if (allowanceBN.lt(amountInBN)) {
      return res.status(400).json({
        status: 400,
        message: `Allowance is less than the amount to be supplied. Allowance: ${allowanceBN.toString()}, AmountIn: ${amountInBN.toString()}`,
        txResponse: null,
        txReceipt: null
      });
    }

    // Prepare the swap parameters
    const params = {
        tokenIn,
        tokenOut,
        recipient,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
        amountIn: amountIn,
        amountOutMinimum: amountOutMinimum,
        limitSqrtPrice: 0
    };

    // Setup tx options
    const methodName = 'exactInputSingle'; 
    const methodArgs = [params]; 
    const transactionOverrides = {};
    const txOptions = await prepareTransactionOptions(quickswapPosV3RouterContract, methodName, methodArgs, provider, transactionOverrides);

    // Execute the swap
    const txResponse = await quickswapPosV3RouterContract.connect(wallet).exactInputSingle(params, txOptions);
    const txReceipt = await txResponse.wait(selectedConfig.nbBlocksToConfirm); 

    // Log transaction success
    logger.log({ level: 'info', message: 'API request successful', routePath: '/api/quickswap/swap', method: 'GET', statusCode: 200 });

    // Send response 
    res.json({
      status: 200,
      message: 'Swap transaction returned successfully. Please check the transaction response.',
      txResponse: txResponse,
      txReceipt: txReceipt
    });
  } catch (error) {
    console.error('Swap transaction failed:', error);
    logger.log({ level: 'error', message: error.message, routePath: '/api/quickswap/swap', method: 'POST', statusCode: 500 });
    return res.status(500).json({
      status: 500,
      message: error.message,
      txResponse: null,
      txReceipt: null
    });
  }
});

module.exports = router;
