/**
 * Created by luwenwei on 17/8/29.
 */
import MyMenu from './components/nav';
import Main from './route/index';
import React from 'react';
import FadeLoader from './components/fakeLoader';
import { myInfo } from './untils/global';
import store from './redux/store';
import { Layout, Icon, message } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            myInfo,
            collapsed: false
        }
        React.$alert = this.alert.bind(this);
    }

    alert (type, mes, duration = 5, onClose) {
        message[type](mes, duration, onClose)
    }

    clearQueueAnimStyle = () => {
        $(".content").css({transform:"none"})
    }

    componentDidMount() {
        store.subscribe(()=>{
            let username = store.getState().username;
            let myInfo = this.state.myInfo;
            myInfo.username = username;
            this.setState({myInfo})
        })
    }

    toggleMenu = () => {
        let collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }

    render() {
        let { collapsed } = this.state;
        return <Layout style={{ height: '100%'}}>
            <Sider
                style={{ overflow: 'auto', height: '100vh' }}
                trigger={null}
                collapsible
                collapsed={ collapsed }
            >
                <div className="logo app-name">
                    <h3>React Admin</h3>
                </div>
                <MyMenu />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div style={{ marginLeft: '15px', cursor: 'pointer', width: '14px', height: '14px' }} onClick={this.toggleMenu}>
                        <Icon
                            className="trigger"
                            type={ collapsed ? 'menu-unfold' : 'menu-fold'}
                        />
                    </div>
                </Header>
                <Content style={{ margin: '15px 15px', overflow: 'initial' }}>
                    <div className="app-content" style={{ background: '#fff' }}>
                        <Main />
                    </div>
                </Content>
            </Layout>
        </Layout>
    }
}

