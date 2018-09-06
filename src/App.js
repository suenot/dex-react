import React from "react"
import { WidthProvider, Responsive } from "react-grid-layout"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import _ from 'lodash'
import Info from './components/Info'
import Orders from './components/Orders'
import CreateOrder from './components/CreateOrder'
import HeikinAshi from './components/charts/HeikinAshi'
import Crocodile from './components/charts/Crocodile'

import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'


const ResponsiveReactGridLayout = WidthProvider(Responsive)
const originalLayouts = getFromLS("layouts") || {}

@inject('InfoStore')
@observer
class App extends React.Component {
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
    }
  }

  resetLayout() {
    this.setState({ layouts: {} })
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts)
    this.setState({ layouts })
  }
  
  render() {
    const {InfoStore} = this.props
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
            <Info />
          </div>
          <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0, minW: 2, minH: 3 }}>
            <Orders type="asks" />
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0, minW: 2, minH: 3 }}>
            <Orders type="bids" />
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
            <CreateOrder type="sell" />
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
            <CreateOrder type="buy" />
          </div>
        </ResponsiveReactGridLayout>
      </div>
    )
  }
}

function getFromLS(key) {
  let ls = {}
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {}
    } catch (e) {}
  }
  return ls[key]
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    )
  }
}

export default App