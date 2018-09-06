import { observable, action, computed, autorun, toJS } from 'mobx'
import InfoStore from './InfoStore'
import {sleep} from '../utils'
import Identicon from 'identicon.js'
import _ from 'lodash'


function dynamicSort(property) {
  var sortOrder = 1

  if(property[0] === "-") {
      sortOrder = -1
      property = property.substr(1)
  }

  return function (a,b) {
      if(sortOrder == -1){
          return b[property].localeCompare(a[property])
      }else{
          return a[property].localeCompare(b[property])
      }
  }
}

// var ORDERBOOK = {
//   'bids': {},
//   'asks': {}
// }
var BIDS = {}
var ASKS = {}
var COUNT = 0

class OrdersStore {
    // from info store
    @computed get web3() {
      return InfoStore.web3
    }
    @computed get dexContract() {
      return InfoStore.dexContract
    }
    @computed get tokenAddress() {
      return InfoStore.tokenAddress
    }
    @observable asks = {}
    @observable bids = {}

    // Опустошитель очереди (Ice bucket)
    async dropQueueCycle() {
      // var testCount = 0
      // while (testCount < 3) {
      while (true) {
        // testCount += 1
        // dropOldOrders()
        await this.dropQueue()
        await sleep(5000)
        // console.log(ORDERBOOK)
      }
    }
    @action async dropQueue() {
      var asks = this.asks
      var bids = this.bids
      _.forEach(ASKS, function(order, i){
        asks[i] = order
      })
      _.forEach(BIDS, function(order, i){
        bids[i] = order
      })
      // TODO SORT
      // asks = _.object( _.orderBy(asks, ['priceNumber'], ['asc']) )
      // var bids = _.keyBy(_.orderBy(bids, ['price'], ['desc']), 'id')

      ASKS = {}
      BIDS = {}
      this.asks = asks
      this.bids = bids
    }
    async getOrdersCycle() {
      while (true) {
        await this.getOrdersOnce()
        await sleep(100000000)
      }
    }
    async getOrdersOnce() {
      if (this.dexContract && this.web3 && this.tokenAddress) await Promise.all([this.getAsksOnce(), this.getBidsOnce()])
    }
    async getAsksOnce() {
      var n = parseFloat(await this.dexContract.methods.willsellFindSpot(this.tokenAddress).call())
      for (var i=1;i<n;i++) {
        var order = await this.getOrder(i, 'asks')
        if ( order.user !== '0x0000000000000000000000000000000000000000' && order.priceNumber !== 0 && order.amountNumber !== 0 ) {
          this.asks[order.id] = order
        }
      }
    }
    async getBidsOnce() {
      var n = parseFloat(await this.dexContract.methods.willbuyFindSpot(this.tokenAddress).call())
      for (var i=1;i<n;i++) {
        var order = await this.getOrder(i, 'bids')
        if ( order.user !== '0x0000000000000000000000000000000000000000' && order.priceNumber !== 0 && order.amountNumber !== 0 ) {
          this.bids[order.id] = order
        }
      }
    }
    async getOrder(orderPosition, type) {
      var result
      COUNT++
      // console.log(COUNT)
      if (type === 'asks') {
        result = await this.dexContract.methods.willsellInfo(this.tokenAddress, orderPosition).call()
      }
      else {
        result = await this.dexContract.methods.willbuyInfo(this.tokenAddress, orderPosition).call()
      }
      // console.log(result)
      return {
        // TODO много лишнего
        id: orderPosition.toString(),
        user: result[0].toString(),
        icon: new Identicon(result[0].toString(), 18).toString(),
        price: this.web3.utils.fromWei(result[1]),
        priceNumber: parseFloat( this.web3.utils.fromWei(result[1]) ),
        priceWEI: result[1],
        priceWEINumber: parseFloat(result[1]),
        amount: this.web3.utils.fromWei(result[2]),
        amountNumber: parseFloat( this.web3.utils.fromWei(result[2]) ),
        amountWEI: result[2],
        amountWEINumber: parseFloat(result[2]),
        total: this.web3.utils.fromWei(result[1]) * this.web3.utils.fromWei(result[2])
      }
    }
}

const store = window.OrdersStore = new OrdersStore()

export default store

autorun(() => {
  // console.log(InfoStore.wallet)
  store.getOrdersCycle()
  store.dropQueueCycle()
})
