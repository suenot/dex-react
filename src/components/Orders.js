import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'

@inject('OrdersStore')
@inject('CreateOrderStore')
@observer
class Orders extends React.Component {
  render() {
    const {OrdersStore, type} = this.props
    return (
      <div>
        <style jsx="true">{`
            .header {
              background: #bebebe;
              width: 100%;
              display: block;
            }
        `}</style>
        <div className="header">{type}</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>user</th>
              <th>price</th>
              <th>amount</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(OrdersStore[type], (order) => {
                return <tr key={order.id} onClick={this.setAll.bind(this, order.price, order.amount)}>
                  <td>{order.id}</td>
                  <td><img width="18" height="18" src={'data:image/png;base64,'+order.icon} /></td>
                  <td onClick={this.setPrice.bind(this, order.price)}>{order.price}</td>
                  <td onClick={this.setAmount.bind(this, order.amount)}>{order.amount}</td>
                  <td>{order.total}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
  setPrice(price, e) {
    e.stopPropagation()
    this.props.CreateOrderStore.setPrice(price)
  }
  setAmount(amount, e) {
    e.stopPropagation()
    this.props.CreateOrderStore.setAmount(amount)
  }
  setAll(price, amount) {
    this.props.CreateOrderStore.setPrice(price)
    this.props.CreateOrderStore.setAmount(amount)
  }
}

export default Orders