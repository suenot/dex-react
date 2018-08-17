import { observable, action, computed, autorun } from 'mobx'

class Store {
  @observable birds = ['Nightingale', 'Pigeon']
  @observable count = 0
  // @observable layouts = JSON.parse(JSON.stringify(originalLayouts))
  @observable tokenDecimals = 18
  @observable tokenName = '-'
  @observable tokenSymbol = '-'
  @observable orderbook = {
    'asks': {},
    'bids': {}
  }
  @observable web3 = undefined
  @observable wallet = undefined
  @observable balanceWEI = undefined
  @observable balanceETH = undefined
  @observable dexContract = undefined
  @observable dexAddress = undefined
  @observable tokenAddress = '0xafe5a978c593fe440d0c5e4854c5bd8511e770a4'
  @observable rebateAddress = undefined
  @observable tokenBalanceWEI = undefined
  @observable tokenBalanceTKN = undefined
  @observable depositWEI = undefined
  @observable depositETH = undefined
  @observable approvedWEI = undefined
  @observable approvedTKN = undefined
}

const store = window.store = new Store()

export default store

// autorun(() => {
//   console.log(store.birds)
// })