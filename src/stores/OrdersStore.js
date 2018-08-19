import { observable, action, computed, autorun, toJS } from 'mobx'
import InfoStore from './InfoStore'
import {sleep} from '../utils'
import Identicon from 'identicon.js'
import _ from 'lodash'

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
    // orders store
    // @observable _asks = {}
    // @observable _bids = {}
    @observable asks = {}
    @observable bids = {}

    // @computed get asks(asks) {
    //   // var asks = _.clone(toJS(this.asks))
    //   var _asks = _.clone(toJS(this._asks))
    //   this._asks = {}
    //   _.forEach(_asks, function(ask, i){
    //     console.log(ask, i)
    //     asks[i] = ask
    //   })
    //   return asks
    // }

    // @computed get asks() {
    //   return this._asks
    // }
    // @computed get bids() {
    //   return this._bids
    // }


    // Опустошитель очереди (Ice bucket)
    async dropQueueCycle() {
      while (true) {
        // dropOldOrders()
        await this.dropQueue()
        await sleep(1000)
        // console.log(ORDERBOOK)
      }
    }
    async dropQueue() {
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
      ASKS = {}
      BIDS = {}
      this.asks = asks
      this.bids = bids
    }
    async getOrdersCycle() {
      while (true) {
        await this.getOrdersOnce()
        await sleep(10000)
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
      console.log(COUNT)
      if (type === 'asks') {
        result = await this.dexContract.methods.willsellInfo(this.tokenAddress, orderPosition).call()
      }
      else {
        result = await this.dexContract.methods.willbuyInfo(this.tokenAddress, orderPosition).call()
      }
      console.log(result)
      return {
        // TODO много лишнего
        id: orderPosition,
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
  console.log(InfoStore.wallet)
  store.getOrdersCycle()
  store.dropQueueCycle()
})
