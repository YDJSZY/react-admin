/**
 * Created by Apple on 17/2/6.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { getLocalStorage } from '../untils/global';
const $localStorage = getLocalStorage();

export default class MyMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">
                    <Link to="/manageUsers/">user</Link>
                </span>
            </Menu.Item>
            <Menu.Item key="2">
                <Icon type="edit" />
                <span className="nav-text">
                    <Link to="/tinymce/">tinymce</Link>
                </span>
            </Menu.Item>
        </Menu>;
    }
};
