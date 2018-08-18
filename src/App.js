import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import Identicon from 'identicon.js'
import _ from 'lodash'
import dex from './contracts/bursa_ropsten'
import Info from './components/Info'
import Orders from './components/Orders'
import CreateOrder from './components/CreateOrder'
import {sleep} from './utils'

import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'


const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
@inject('InfoStore')
@observer
class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
    }
  }

  static get defaultProps() {
    return {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 30
    };
  }

  resetLayout() {
    this.setState({ layouts: {} });
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
  }
  
  render() {
    // TODO
    // const { orderbook, wallet, balanceWEI, balanceETH, dexAddress, tokenAddress, tokenDecimals, tokenBalanceWEI,
    // tokenBalanceTKN, tokenName, tokenSymbol, depositWEI, depositETH, approvedWEI, approvedTKN, web3, rebateAddress} = this.state
    // // var asks = orderbook.asks
    const {InfoStore} = this.props
    const infoOptions = {
      wallet: this.wallet,
      balanceWEI: this.balanceWEI,
      balanceETH: this.balanceETH,
      dexAddress: this.dexAddress,
      tokenAddress: this.tokenAddress,
      tokenDecimals: this.tokenDecimals,
      tokenBalanceWEI: this.tokenBalanceWEI,
      tokenBalanceTKN: this.tokenBalanceTKN,
      tokenName: this.tokenName,
      tokenSymbol: this.tokenSymbol,
      depositWEI: this.depositWEI,
      depositETH: this.depositETH,
      approvedWEI: this.approvedWEI,
      approvedTKN: this.approvedTKN
    }
    // const sellOptions = {web3, wallet, tokenAddress, rebateAddress}
    const {Store} = this.props
    return (
      <div>
        <style jsx="true">{`
            .react-grid-item {
              background: #eee
            }
        `}</style>
        <button onClick={() => this.resetLayout()}>Reset Layout</button>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          draggableCancel="input,textarea"
          draggableHandle=".header"
        >
          <div key="1" data-grid={{ w: 2, h: 3, x: 0, y: 0, minW: 2, minH: 3 }}>
            <Info {...infoOptions} />
          </div>
          <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0, minW: 2, minH: 3 }}>
            <Orders orders={InfoStore.orderbook.asks} header="ASKS" />
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0, minW: 2, minH: 3 }}>
             <Orders orders={InfoStore.orderbook.bids} header="BIDS" />
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
            <CreateOrder />
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0, minW: 2, minH: 3 }}>
            5
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
  async componentWillMount() {
    const {InfoStore} = this.props
    var ORDERBOOK = {
      'bids': {},
      'asks': {}
    }
    InfoStore.web3 = await dex._init()
    InfoStore.wallet = await dex._wallet(InfoStore.web3)
    InfoStore.wallet = InfoStore.wallet
    InfoStore.rebateAddress = InfoStore.wallet
    InfoStore.balanceWEI = await InfoStore.web3.eth.getBalance(InfoStore.wallet)
    InfoStore.balanceETH = InfoStore.web3.utils.fromWei(InfoStore.balanceWEI)
    InfoStore.dexContract = new InfoStore.web3.eth.Contract(dex.abi, dex.address)
    InfoStore.dexAddress = dex.address
    InfoStore.tokenContract = new InfoStore.web3.eth.Contract(dex.abi, InfoStore.tokenAddress)
    try {
      // not all erc20 has got public var "decimals"
      InfoStore.tokenDecimals = await InfoStore.tokenContract.methods.decimals().call()
      // InfoStore.setState({ tokenDecimals })
    } catch(err) { console.log(err) }
    InfoStore.tokenBalanceWEI = await InfoStore.tokenContract.methods.balanceOf(InfoStore.wallet).call()
    InfoStore.tokenBalanceTKN = InfoStore.tokenBalanceWEI / Math.pow(10, InfoStore.tokenDecimals)
    try {
      // not all erc20 has got public var "name"
      InfoStore.tokenName = await InfoStore.tokenContract.methods.name().call()
      // InfoStore.setState({ tokenName })
    } catch(err) { console.log(err) }
    try {
      // not all erc20 has got public var "symbol"
      InfoStore.tokenSymbol = await InfoStore.tokenContract.methods.symbol().call()
      // InfoStore.setState({ tokenSymbol })
    } catch(err) { console.log(err) }
    InfoStore.depositWEI = await InfoStore.dexContract.methods.balanceOf(InfoStore.wallet).call()
    InfoStore.depositETH = InfoStore.web3.utils.fromWei(InfoStore.depositWEI)
    InfoStore.approvedWEI = await InfoStore.dexContract.methods.balanceApprovedForToken(InfoStore.tokenAddress, InfoStore.wallet).call()
    // InfoStore.approvedTKN = InfoStore.web3.utils.fromWei(this.approvedWEI)
    // TODO
    // asks
    // var getAsks = async () => {

    // }
    // await getAsks()
    // this.setState({
    //   web3,
    //   wallet,
    //   balanceWEI,
    //   balanceETH,
    //   dexContract,
    //   dexAddress,
    //   tokenAddress,
    //   tokenBalanceWEI,
    //   tokenBalanceTKN,
    //   depositWEI,
    //   depositETH,
    //   approvedWEI,
    //   approvedTKN
    // })

    // Опустошитель очереди (Ice bucket)
    const dropQueue = () => {
      // var orderbook = this.state.orderbook
      const {InfoStore} = this.props
      var orderbook = InfoStore.orderbook
      _.forEach(ORDERBOOK['asks'], function(order, i){
        orderbook['asks'][i] = order
      })
      _.forEach(ORDERBOOK['bids'], function(order, i){
        orderbook['bids'][i] = order
      })
      // orderbook['asks'] = _.orderBy(orderbook['asks'], ['priceNumber'], ['asc'])
      ORDERBOOK = {asks: {}, bids: {}}
      // this.setState({ orderbook })
      InfoStore.orderbook = orderbook
      // TODO как-то отказаться от форса?
      this.forceUpdate()
    }
    const dropQueueCycle = async function() {
      while (true) {
        // dropOldOrders()
        dropQueue()
        await sleep(200)
        // console.log(ORDERBOOK)
      }
    }
    dropQueueCycle()

    // LOAD ORDERBOOK in GLOBAL VAR
    const getOrder = async (orderPosition, type) => {
      const {InfoStore} = this.props
      if (type === 'asks')
        var result = await InfoStore.dexContract.methods.willsellInfo(InfoStore.tokenAddress, orderPosition).call()
      else // bids
        var result = await InfoStore.dexContract.methods.willbuyInfo(InfoStore.tokenAddress, orderPosition).call()
      return {
        // TODO много лишнего
        id: orderPosition,
        user: result[0].toString(),
        icon: new Identicon(result[0].toString(), 18).toString(),
        price: InfoStore.web3.utils.fromWei(result[1]),
        priceNumber: parseFloat( InfoStore.web3.utils.fromWei(result[1]) ),
        priceWEI: result[1],
        priceWEINumber: parseFloat(result[1]),
        amount: InfoStore.web3.utils.fromWei(result[2]),
        amountNumber: parseFloat( InfoStore.web3.utils.fromWei(result[2]) ),
        amountWEI: result[2],
        amountWEINumber: parseFloat(result[2]),
        total: InfoStore.web3.utils.fromWei(result[1]) * InfoStore.web3.utils.fromWei(result[2])
      }
    }
    const getAsksOnce = async function() {
      for (var i=1;i<200;i++) {
        var order = await getOrder(i, 'asks')
        if ( order.user !== '0x0000000000000000000000000000000000000000' && order.priceNumber !== 0 && order.amountNumber !== 0 ) {
          ORDERBOOK['asks'][order.id] = order
        }
      }
    }
    const getBidsOnce = async function() {
      for (var i=1;i<200;i++) {
        var order = await getOrder(i, 'bids')
        if ( order.user !== '0x0000000000000000000000000000000000000000' && order.priceNumber !== 0 && order.amountNumber !== 0 ) {
          ORDERBOOK['bids'][order.id] = order
        }
      }
    }
    const getOrdersOnce = async function() {
      await Promise.all([getAsksOnce(), getBidsOnce()])
    }
    const getOrdersCycle = async function() {
      while (true) {
        await getOrdersOnce()
        await sleep(1000)
      }
    }
    getOrdersCycle()
  }
}

// module.exports = App;

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}

export default App