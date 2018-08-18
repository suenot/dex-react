import { observable, action, computed, autorun } from 'mobx'

class CreateOrderStore {
    @observable price = 1
    @observable amount = 1
    @observable minAmount = 1
    @observable unencumbered = 0
    @observable result = 0
    @observable orders = 0
    @observable rebateAddress = 0
}

const store = window.CreateOrderStore = new CreateOrderStore()

export default store