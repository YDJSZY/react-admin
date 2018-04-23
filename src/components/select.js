/**
 * Created by luwenwei on 17/9/3.
 */
import React from "react";
import ReactDOM from "react-dom";
import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';
let timer = null;

export default class SelectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectValue:props.value
        };
    }

    selectChange =(selectValue)=> {
        var model = this.props.model;
        var ele = ReactDOM.findDOMNode(this.$selectRef);
        this.props.onSelect(selectValue,model);
        var selectPlaceholder = $(ele).find(".ant-select-selection__placeholder");
        selectPlaceholder.hide();
        if(selectValue === undefined){
            selectPlaceholder.show();
            selectValue = null;
        }
        this.setState({selectValue});
    }

    searchData =(keyword)=> {
        if(!this.props.serverSearch) return false;
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            this.props.searchData(keyword)
        },500)
    }

    filterOption =(input, option)=> {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.value !== this.props.value){
            this.setState({
                selectValue:nextProps.value
            })
        }
    }

    render() {
        let { source=[],serverSearch } = this.props;
        return <Select
            mode={this.props.mode}
            value={this.state.selectValue}
            allowClear={this.props.allowClear === false ? this.props.allowClear : true}
            showSearch
            onFocus={this.searchData}
            filterOption={serverSearch ? false : this.filterOption}
            optionFilterProp="'value'"
            style={this.props.style}
            placeholder={this.props.placeholder || '请选择'}
            onChange={this.selectChange}
            onSearch={this.searchData}
            ref={(ref) => { this.$selectRef = ref; }}>
            {source.map((item,index)=>{
                return <Select.Option key={'_'+index} value={item[this.props.optionValue || 'id']}>{item.name}</Select.Option>
            })}
        </Select>
    }
}