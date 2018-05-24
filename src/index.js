/**
 * Created by luwenwei on 17/2/5.
 */
import React from 'react'
import ReactDom from 'react-dom'
import { HashRouter } from 'react-router-dom'
import axios from './config/axiosConfig'
import App from './app'
import { setMyInfo,setConstants } from './untils/global'
import './styles/main.css'
import './styles/someReset.css'
import { Provider } from 'react-redux'
import store from './redux/store'

async function init() {
    /*let myInfo = await axios.get('/myinfo.json/');
    setMyInfo(myInfo.data);
    let constants = await axios.get('/constants.json/');
    setConstants(constants.data);*/
    ReactDom.render((
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    ), document.getElementById('root'))
}
init()

if (module.hot) {
    module.hot.accept()
}

