import React, { Component } from "react";
import DexContract from "./contracts/DexAggregator.json";
import USDCAbi from "./contracts/USDC.json";
import WETHAbi from "./contracts/WETH.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      web3: null,
      accounts: null,
      usdc: "",
      weth: 0,
      convToWETH: 0,
      dexAddress: null,
      balUSDC: 0,
      balWETH: 0,
    };

    this.getUSDC = this.getUSDC.bind(this);
    this.swapper = this.swapper.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const DexContractDeployedNetwork = DexContract.networks[networkId];
      this.DexContractInstance = new web3.eth.Contract(
        DexContract.abi,
        DexContractDeployedNetwork && DexContractDeployedNetwork.address
      );

      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

      this.usdcInstance = new web3.eth.Contract(USDCAbi, USDC);
      this.wethInstance = new web3.eth.Contract(WETHAbi, WETH);

      let USDCBalance = await this.usdcInstance.methods
        .balanceOf("0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8")
        .call();
      USDCBalance = USDCBalance / 10 ** 6;

      let WETHBalance = await this.wethInstance.methods
        .balanceOf("0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8")
        .call();
      WETHBalance = WETHBalance / 10 ** 18;

      this.setState({
        web3: web3,
        accounts: accounts,
        dexAddress: DexContractDeployedNetwork.address,
        balUSDC: USDCBalance,
        balWETH: WETHBalance,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  componentDidUpdate = async () => {
    let USDCBalance = await this.usdcInstance.methods
      .balanceOf("0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8")
      .call();
    USDCBalance = USDCBalance / 10 ** 6;

    let WETHBalance = await this.wethInstance.methods
      .balanceOf("0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8")
      .call();
    WETHBalance = WETHBalance / 10 ** 18;

    this.setState({ balUSDC: USDCBalance, balWETH: WETHBalance });
  };

  async swapper(evt) {
    evt.preventDefault();
    this.setState({ loading: true });
    const unlockedAcc = "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8";
    let swapAmount = this.state.web3.utils.toBN(this.state.usdc * 10 ** 6);
    let res = await this.usdcInstance.methods
      .approve(this.state.dexAddress, swapAmount)
      .send({ from: unlockedAcc });
    console.log(res);
    let result = await this.DexContractInstance.methods
      .usdcToWeth(swapAmount)
      .send({ from: unlockedAcc, gas: 3000000 })
      .on("error", function (error) {
        console.log(error);
      });
    alert("SWAP SUCCESSFULL!");
    this.setState({ usdc: "", convToWETH: 0, loading: false });
    //console.log(result);
  }

  async getUSDC(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    let swapAmount = this.state.web3.utils.toBN(evt.target.value * 10 ** 6);
    // console.log(swapAmount);
    let val = await this.DexContractInstance.methods
      .getHighestAmountOut([USDC, WETH], swapAmount)
      .call();
    this.setState({
      convToWETH: val[1] / 10 ** 18,
    });
  }

  render() {
    if (!this.state.web3) {
      return (
        <div className="App-spinner d-flex justify-content-center">
          <div className="spinloader spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <div className="card app-card shadow">
          <form>
            <div className="mb-3">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="0.0"
                onChange={this.getUSDC}
                name="usdc"
                value={this.state.usdc}
                aria-describedby="USDC-balance"
              />
              <div className="form-text" id="USDC-balance">
                Balance: {this.state.balUSDC} USDC
              </div>
            </div>

            <div className="mb-3">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Amount in WETH"
                name="weth"
                readOnly
                value={this.state.convToWETH}
                aria-describedby="WETH-balance"
              />
              <div className="form-text" id="WETH-balance">
                Balance: {this.state.balWETH} WETH
              </div>
            </div>

            <div className="d-grid mx-auto">
              <button onClick={this.swapper} className="btn btn-primary btn-lg" type="button">
                {this.state.loading ? (
                  <span>
                    <span
                      className="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>  Swapping...</span>{" "}
                  </span>
                ) : (
                  <span>Swap</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
