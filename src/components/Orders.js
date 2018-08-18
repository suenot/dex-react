import React from 'react'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'

@inject('OrdersStore')
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
        <div class="header">{type}</div>
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
                return <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><img width="18" height="18" src={'data:image/png;base64,'+order.icon} /></td>
                  <td>{order.price}</td>
                  <td>{order.amount}</td>
                  <td>{order.total}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Orders