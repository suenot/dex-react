import { observable, action, computed, autorun } from 'mobx'

class CreateOrderStore {
    @observable buy = {
        price: 1,
        amount: 1,
        minAmount: 0.1,
        unencumbered: 0,
        result: undefined,
        orders: [],
        rebateAddress: '0x94964bdf167cd9729df470ca75f56c087eaefda8'
    }

    @observable sell = {
        price: 1,
        amount: 1,
        minAmount: 0.1,
        unencumbered: 0,
        result: undefined,
        orders: [],
        rebateAddress: '0x94964bdf167cd9729df470ca75f56c087eaefda8'
    }

    @action setPrice(price) {
        this['buy'].price = price
        this['sell'].price = price
    }

    @action setAmount(amount) {
        this['buy'].amount = amount
        this['sell'].amount = amount
    }
}

const store = window.CreateOrderStore = new CreateOrderStore()

export default store