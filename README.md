## Dex Aggregator app that allows us to swap USDC for WETH at a cheaper price on either Uniswap or Sushiswap

---

### Technology Stack & Tools

* [Solidity](https://docs.soliditylang.org/en/v0.8.2/) (For writing Smart Contracts)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (For writing tests)
* [Truffle](https://trufflesuite.com/) (Development Framework for our Smart Contracts)
* [Ganache](https://trufflesuite.com/ganache/) (Our Local Development Blockchain)
* [Infura](https://infura.io/) as a node provider

---

### Requirements For Initial Setup

* [Node.js](https://nodejs.org/en/) v16.13.1 and [NPM](https://www.npmjs.com/) package manager
* [Truffle](https://trufflesuite.com/) v5.4.28
* [Ganache cli](https://github.com/trufflesuite/ganache)
* [Infura](https://infura.io/) endpoint for the Ethereum mainnet

---

### Setting Up

1. Clone/Download this Repository  
2. Install Dependencies:  
`npm install`
3. Start Ganache and Fork the ethereum mainnet:  
```
ganache-cli --fork yourInfuraEndpoint --unlock 0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8 --networkId 999 -p 7545
```
4. Deploy Smart Contracts  
`truffle migrate --reset`
5. Run tests  
`truffle test test/test.js`
6. Run the app
`cd client`
`npm start`

---

## How the app works on a high level:

* ![diagram](https://i.postimg.cc/K8TCvYtT/11.png)

