# Auto Trading Agent

**Short Description:** Fully automated trading system.

**Trading Types:** Currently supports long and short positions.

**Smart Contract support:**

QuickswapV3: [https://polygonscan.com/address/0xf5b509bb0909a69b1c207e495f687a596c168e12](https://polygonscan.com/address/0xf5b509bb0909a69b1c207e495f687a596c168e12)
AaveV3: [https://polygonscan.com/address/0x794a61358d6845594f94dc1db02a252b5b4814ad](https://polygonscan.com/address/0x794a61358d6845594f94dc1db02a252b5b4814ad)

**Test Wallet (No longer in use):**
[https://polygonscan.com/address/0x7fdd111d9b39f9ae07f9075bea74cf44ba4e70a2](https://polygonscan.com/address/0x7fdd111d9b39f9ae07f9075bea74cf44ba4e70a2)

## 1. OHLC data aggregation

Short Description: Pricing data aggregation and persistence

Runtime Environment: The Graph
Query Language(s): GraphQL
Deployment Type: 3rd party API

## 2. Technical Analysis

Short Description: Technical indicators (MACD, RSI, ATR, VWAP etc.) plus trading strategy calculations and signal generation (buy, sell, hold)

Runtime Environment: Python/Flask
Language(s): Python3.10
Libraries/Frameworks: Pandas, pandas-ta (Pandas Technical Analysis)
Deployment Type: Dockerized Container (Google Cloud Platform)

## 3. Signal Handling

Short Description: Conversion of signals to trades (long, short, hold) and capital allocation

Runtime Environment: Javascript/Node.js
Language(s): Javascript
Libraries/Frameworks: ethers.js
Local Testing: Jest
Deployment Type: Serverless (Google Cloud Platform)

## 4. Trading API

Short Description: Crypto wallet management and on-chain smart contract communication

Runtime Environment: Javascript/Node.js
Language(s): Javascript
Libraries/Frameworks: ethers.js
Local Testing: Jest
Deployment Type: Serverless (Google Cloud Platform)
3rd Party RPC integration: Infura

## 5. Backtesting

Runtime Environment: Python/Flask
Language(s): Python3.10
Libraries/Frameworks: Pandas, pandas-ta (Pandas Technical Analysis)
Deployment Type: Local instance

## Cloud Hosting

Google Cloud Platform

- Serverless functions (Firebase)
- NoSQL Storage (Firestore)
- Pub/Sub (Google Cloud Platform)

## Local Development Tools

Hardhat

Firebase CLI Tools

Firebase Emulator

nodemon

## Code Repository

github
