import React from 'react'
import _ from 'lodash'

export default ({ orders, header }) => (
    <div>
      <h3>{header}</h3>
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
            _.map(orders, (order) => {
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
