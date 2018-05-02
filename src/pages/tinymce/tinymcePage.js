/**
 * Created by luwenwei on 18/5/2.
 */
import React from 'react';
import TinymceComponent from '../../components/tinymce/tinymce';
import { Card, Button } from 'antd';

export default class TinymcePage extends React.Component {
    constructor(props) {
        super(props);
        this.tinymceRef;
        this.state = {
            content: 'fuck'
        }
    }

    setTinymceContent = () => {
        this.setState({
            content: 'helllo'
        })
    }

    getTinymceContent = () => {
        let content = this.tinymceRef.getTinymceContent();
        console.log(content);
    }

    render () {
        return (
            <Card title="富文本编辑器" style={{ width: '100%' }}>
                <Button type='primary' onClick={ () => { this.setTinymceContent()} }>设置内容</Button>
                <Button type='primary' onClick={ () => { this.getTinymceContent()} }>打印内容</Button>
                <TinymceComponent ref={ (ref) => { this.tinymceRef = ref }} tinyMceId="tinymceDemo" content={ this.state.content } />
            </Card>
        )
    }
}