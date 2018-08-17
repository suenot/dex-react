import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {Provider} from 'mobx-react'
import Store from './stores/store'

const Root = (
    <Provider Store={Store}>
        <App />
    </Provider>
)

ReactDOM.render(Root, document.getElementById('root'))
registerServiceWorker()
