import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import Identicon from 'identicon.js'
import _ from 'lodash'
import dex from './contracts/bursa_ropsten'
import Info from './components/Info'
import Orders from './components/Orders'
import Sell from './components/Sell'
import {sleep} from './utils'

import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'


const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
@inject('Store')
@observer
class App extends React.PureComponent {
  @observable count = 0
  @observable layouts = JSON.parse(JSON.stringify(originalLayouts))
  @observable tokenDecimals = 18
  @observable tokenName = '-'
  @observable tokenSymbol = '-'
  @observable orderbook = {
    'asks': {},
    'bids': {}
  }
  @observable web3 = undefined
  @observable wallet = undefined
  @observable balanceWEI = undefined
  @observable balanceETH = undefined
  @observable dexContract = undefined
  @observable dexAddress = undefined
  @observable tokenAddress = '0xafe5a978c593fe440d0c5e4854c5bd8511e770a4'
  @observable rebateAddress = undefined
  @observable tokenBalanceWEI = undefined
  @observable tokenBalanceTKN = undefined
  @observable depositWEI = undefined
  @observable depositETH = undefined
  @observable approvedWEI = undefined
  @observable approvedTKN = undefined

  constructor(props) {
    super(props);

    this.state = {
      // layouts: JSON.parse(JSON.stringify(originalLayouts)),
      // tokenDecimals: 18,
      // tokenName: '-',
      // tokenSymbol: '-',
      // asks: {},
      // orderbook: {
      //   'asks': {},
      //   'bids': {}
      // },
      // bids: {},
      // web3: undefined
    };
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
            <Orders orders={this.orderbook.asks} header="ASKS" />
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0, minW: 2, minH: 3 }}>
             <Orders orders={this.orderbook.bids} header="BIDS" />
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
            {Store.birds}
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0, minW: 2, minH: 3 }}>
            {Store.wallet}
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
  async componentWillMount() {
    var ORDERBOOK = {
      'bids': {},
      'asks': {}
    }
    this.web3 = await dex._init()
    this.wallet = await dex._wallet(this.web3)
    this.props.Store.wallet = this.wallet
    this.rebateAddress = this.wallet
    this.balanceWEI = await this.web3.eth.getBalance(this.wallet)
    this.balanceETH = this.web3.utils.fromWei(this.balanceWEI)
    this.dexContract = new this.web3.eth.Contract(dex.abi, dex.address)
    this.dexAddress = dex.address
    this.tokenContract = new this.web3.eth.Contract(dex.abi, this.tokenAddress)
    try {
      // not all erc20 has got public var "decimals"
      this.tokenDecimals = await this.tokenContract.methods.decimals().call()
      // this.setState({ tokenDecimals })
    } catch(err) { console.log(err) }
    this.tokenBalanceWEI = await this.tokenContract.methods.balanceOf(this.wallet).call()
    this.tokenBalanceTKN = this.tokenBalanceWEI / Math.pow(10, this.state.tokenDecimals)
    try {
      // not all erc20 has got public var "name"
      this.tokenName = await this.tokenContract.methods.name().call()
      // this.setState({ tokenName })
    } catch(err) { console.log(err) }
    try {
      // not all erc20 has got public var "symbol"
      this.tokenSymbol = await this.tokenContract.methods.symbol().call()
      // this.setState({ tokenSymbol })
    } catch(err) { console.log(err) }
    this.depositWEI = await this.dexContract.methods.balanceOf(this.wallet).call()
    this.depositETH = this.web3.utils.fromWei(this.depositWEI)
    this.approvedWEI = await this.dexContract.methods.balanceApprovedForToken(this.tokenAddress, this.wallet).call()
    this.approvedTKN = this.web3.utils.fromWei(this.approvedWEI)
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
      var orderbook = this.orderbook
      _.forEach(ORDERBOOK['asks'], function(order, i){
        orderbook['asks'][i] = order
      })
      _.forEach(ORDERBOOK['bids'], function(order, i){
        orderbook['bids'][i] = order
      })
      // orderbook['asks'] = _.orderBy(orderbook['asks'], ['priceNumber'], ['asc'])
      ORDERBOOK = {asks: {}, bids: {}}
      // this.setState({ orderbook })
      this.orderbook = orderbook
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
      if (type === 'asks')
        var result = await this.dexContract.methods.willsellInfo(this.tokenAddress, orderPosition).call()
      else // bids
        var result = await this.dexContract.methods.willbuyInfo(this.tokenAddress, orderPosition).call()
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