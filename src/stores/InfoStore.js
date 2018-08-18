import { observable, action, computed, autorun } from 'mobx'
import dex from '../contracts/bursa_ropsten'
import Web3 from 'web3'

class InfoStore {
  @observable web3 = undefined
  @observable wallet = undefined
  @observable balanceWEI = undefined
  @observable balanceETH = undefined
  @observable dexContract = undefined
  @observable dexAddress = undefined
  @observable tokenAddress = '0xafe5a978c593fe440d0c5e4854c5bd8511e770a4'
  @observable tokenDecimals = 18
  @observable tokenName = '-'
  @observable tokenSymbol = '-'
  @observable tokenBalanceWEI = undefined
  @observable tokenBalanceTKN = undefined
  @observable rebateAddress = undefined
  @observable depositWEI = undefined
  @observable depositETH = undefined
  @observable approvedWEI = undefined
  @observable approvedTKN = undefined

  @action async init() {
    this.web3 = await dex._init()
    this.wallet = await dex._wallet(this.web3)
    this.rebateAddress = this.wallet
    this.balanceWEI = await this.web3.eth.getBalance(this.wallet)
    this.balanceETH = this.web3.utils.fromWei(this.balanceWEI)
    this.dexContract = new this.web3.eth.Contract(dex.abi, dex.address)
    this.dexAddress = dex.address
    this.tokenContract = new this.web3.eth.Contract(dex.abi, this.tokenAddress)
    try {
      // not all erc20 has got public var "decimals"
      this.tokenDecimals = await this.tokenContract.methods.decimals().call()
    } catch(err) { console.log(err) }
    this.tokenBalanceWEI = await this.tokenContract.methods.balanceOf(this.wallet).call()
    this.tokenBalanceTKN = this.tokenBalanceWEI / Math.pow(10, this.tokenDecimals)
    try {
      // not all erc20 has got public var "name"
      this.tokenName = await this.tokenContract.methods.name().call()
    } catch(err) { console.log(err) }
    try {
      // not all erc20 has got public var "symbol"
      this.tokenSymbol = await this.tokenContract.methods.symbol().call()
    } catch(err) { console.log(err) }
    this.depositWEI = await this.dexContract.methods.balanceOf(this.wallet).call()
    this.depositETH = this.web3.utils.fromWei(this.depositWEI)
    this.approvedWEI = await this.dexContract.methods.balanceApprovedForToken(this.tokenAddress, InfoStore.wallet).call()
    this.approvedTKN = this.web3.utils.fromWei(this.approvedWEI)
  }
}

const store = window.InfoStore = new InfoStore()

export default store

autorun(() => {
  store.init()
})