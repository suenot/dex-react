import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {Provider} from 'mobx-react'
import InfoStore from './stores/InfoStore'
import CreateOrderStore from './stores/CreateOrderStore'

const Root = (
    <Provider InfoStore={InfoStore} CreateOrderStore={CreateOrderStore}>
        <App />
    </Provider>
)

ReactDOM.render(Root, document.getElementById('root'))
registerServiceWorker()
