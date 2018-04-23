/**
 * Created by Apple on 17/2/6.
 */
import cs from 'classnames'//引入classnames依赖库
import React from 'react';
import { BrowserRouter as StaticRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { getLocalStorage } from '../untils/global';
const $localStorage = getLocalStorage();
const currentRoute = $localStorage.route;

export default class MyMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">
                    <Link to="/manageUsers/">用户</Link>
                </span>
            </Menu.Item>
        </Menu>
    }
};
