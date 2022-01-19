const DexAggregator = artifacts.require("./contracts/DexAggregator.sol")
const wethABI = require("./WETH.json")
const usdcABI = require("./USDC.json")

contract("dex aggregator", () => {
    let aggregator
    let deployer = "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

    before(async () => {
        aggregator = await DexAggregator.deployed();
    })

    describe("get UNISWAP rate for given amount", () => {
        it("get usdc amounts out given input amount of 10 weth", async () => {
            let swapAmount = web3.utils.toBN(10 * 10**18)
            const results = await aggregator.uniRate([WETH, USDC], swapAmount)
            console.log("for 10 weth you receive",( results / 10**6).toString(), "usdc" )
        }) 
    })   
    
    describe("get SUSHISWAP rate for given amount", () => {
        it("get usdc amounts out given input amount of 10 weth", async () => {
            let swapAmount = web3.utils.toBN(10 * 10**18)
            const results = await aggregator.sushiRate([WETH, USDC], swapAmount)
            console.log("for 10 weth you receive",( results / 10**6).toString(), "usdc" )
        })
    })

    describe("calculate best rate 0 is uniswap 1 is sushiswap", () => {
        it("calculates best rate for 10 weth - either uniswap or sushiswap", async () => {
            let swapAmount = web3.utils.toBN(10 * 10**18)
            const results = await aggregator.getHighestAmountOut([WETH, USDC], swapAmount)
            console.log(results[0].toString(), results[1].toString())
        })
    })

    describe("swapping", () => {
        let wethContract, usdcContract, swapAmount
        let initialWETH, initialUSDC

        before(async () => {

            swapAmount = web3.utils.toBN(16 * 10**18)
            wethContract = new web3.eth.Contract(wethABI, WETH)
            usdcContract = new web3.eth.Contract(usdcABI, USDC)
        })
        it("initial balances", async () => {
            initialWETH = await wethContract.methods.balanceOf(deployer).call()
            initialUSDC = await usdcContract.methods.balanceOf(deployer).call()
            console.log("user initial usdc balance: ",initialUSDC / 10**6)
            console.log("user initial weth balance: ",initialWETH / 10**18)
        })
        it("swap in reverse direction", async () => {
            const newBalance = await usdcContract.methods.balanceOf(deployer).call()
            await usdcContract.methods.approve(aggregator.address, newBalance).send({from: deployer})
            await aggregator.usdcToWeth(newBalance /2)
        })
    })
})