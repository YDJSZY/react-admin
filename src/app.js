/**
 * Created by luwenwei on 17/8/29.
 */
import MyMenu from './components/nav';
import Main from './route/index';
import React from 'react';
import AlertContainer from 'react-alert';
import FadeLoader from './components/fakeLoader';
import { myInfo } from './untils/global';
import store from './redux/store';
import { Layout } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            myInfo
        }
        this.alertOptions = {
            offset: 14,
            position: 'top right',
            theme: 'light',
            time: 5000,
            transition: 'scale'
        }
        React.$alert = this.alert.bind(this);
    }

    alert(type,mes) {
        this.$alert.show(mes, {
            type: type
        })
    }

    clearQueueAnimStyle = ()=> {
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

    render() {
        //let { username } = this.state.myInfo;
        return <Layout>
                <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                    <div className="logo app-name">
                        <h3>React Admin</h3>
                    </div>
                    <MyMenu />
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                            <Main />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
    }
}

