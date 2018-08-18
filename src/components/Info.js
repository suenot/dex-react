import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('InfoStore')
@observer
class Info extends React.Component {
  render() {
    const {InfoStore} = this.props
    return (
      <div>
        <p>wallet: {InfoStore.wallet}</p>
        <p>balanceWEI: {InfoStore.balanceWEI} WEI</p>
        <p>balanceETH: {InfoStore.balanceETH} ETH</p>
        <p>dexAddress: {InfoStore.dexAddress}</p>
        <p>tokenAddress: {InfoStore.tokenAddress}</p>
        <p>tokenDecimals: {InfoStore.tokenDecimals}</p>
        <p>tokenBalanceWEI: {InfoStore.tokenBalanceWEI}</p>
        <p>tokenBalanceTKN: {InfoStore.tokenBalanceTKN}</p>
        <p>tokenName: {InfoStore.tokenName}</p>
        <p>tokenSymbol: {InfoStore.tokenSymbol}</p>
        <p>depositWEI: {InfoStore.depositWEI}</p>
        <p>depositETH: {InfoStore.depositETH}</p>
        <p>approvedWEI: {InfoStore.approvedWEI}</p>
        <p>approvedTKN: {InfoStore.approvedTKN}</p>
      </div>
    )
  }
}

export default Info