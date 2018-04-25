/**
 * Created by luwenwei on 17/9/3.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Select, Spin } from 'antd';
import { throttleTime } from '../untils/commonMethods';
const { Option, OptGroup } = Select;

export default class SelectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue,
            fetching: false
        };
        this.serverSearchThrottleTime = throttleTime(this.serverSearch)
    }

    selectChange = (selectValue) => {
        let model = this.props.model;
        this.props.onSelect(selectValue, model);
        if (this.props.serverSearch) {
            this.setState({
                defaultValue: selectValue
            })
        }
    }

    onSearch = (keyword) => {
        if (!this.props.serverSearch) return false;/* 是否是服务端搜索 */
        this.setState({
            fetching: true
        });
        this.serverSearchThrottleTime(keyword);
    }
    
    serverSearch = (keyword) => {
        this.props.searchData(keyword, () => {
            this.setState({
                fetching: false
            });
        });
    }

    filterOption = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    
    componentWillReceiveProps (nextProps) {
    }

    render() {
        let { source=[], serverSearch, group } = this.props;
        let fetching = this.state.fetching;
        return (
            <Select
            mode={ this.props.mode }/* 模式：单选或者多选'multiple' */
            defaultValue={ this.props.defaultValue }
            value={ serverSearch ? this.state.defaultValue : this.props.value }
            allowClear={ this.props.allowClear === false ? this.props.allowClear : true }
            showSearch
            filterOption={ serverSearch ? false : this.filterOption }
            optionFilterProp="'value'"
            style={ this.props.style }
            placeholder={ this.props.placeholder || '请选择' }
            onChange={ this.selectChange }
            onSearch={ this.onSearch }
            notFoundContent={ serverSearch ? (fetching ? <Spin size="small" /> : null) : '无数据'}
            ref={(ref) => { this.$selectRef = ref; }}>
            {
                group ? source.map((item, index) => {
                    return <OptGroup label={ item.type } key={'_'+index}>
                        {
                            item.data.map((item, index) => {
                                return <Option key={'_'+index} value={ item[this.props.optionValue || 'id'] }>{ item[this.props.optionText || 'name'] }</Option>
                            })
                        }
                    </OptGroup>
                }) : source.map((item, index) => {
                return <Option key={'_'+index} value={ item[this.props.optionValue || 'id'] }>{ item[this.props.optionText || 'name'] }</Option>
            })}
        </Select>)
    }
}