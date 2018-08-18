import { observable, action, computed, autorun } from 'mobx'
import InfoStore from './InfoStore'

var ORDERBOOK = {
  'bids': {},
  'asks': {}
}

class OrdersStore {
    @observable precision = 8
    @observable orders = {
        'asks': [],
        'bids': []
    }
    @computed get asks() {
        return this.orders.asks.map((order) => {
            return {
                'id': String(order[0], order[1]),
                'price': order[0].toFixed(this.precision),
                'amount': order[1].toFixed(this.precision),
                'total': (order[0]*order[1]).toFixed(this.precision)
            }
        })
    }
    @computed get bids() {
        return this.orders.asks.map((order) => {
            return {
                'id': String(order[0], order[1]),
                'price': order[0].toFixed(this.precision),
                'amount': order[1].toFixed(this.precision),
                'total': (order[0]*order[1]).toFixed(this.precision)
            }
        })
    }
}

const store = window.OrdersStore = new OrdersStore()

export default store