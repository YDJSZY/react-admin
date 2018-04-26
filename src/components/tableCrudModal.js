/**
 * Created by luwenwe on 2017/9/11.
 */
import React from "react";
import moment from 'moment';
import { DatePicker, Modal, Form, Input, Switch, Radio, Upload, Icon } from 'antd';
import SelectComponent from './select';
import axios from '../config/axiosConfig';
import {constants} from '../untils/global';
import baseConfig from '../config/baseConfig';
import { translateSelectSource } from '../untils/commonMethods';
import UploadImg from './uploadImg/uploadImg';
const modalTitleObj = { create: '新增', edit: '编辑' };
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
}

export default class TableCrudModal extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            modalType: "",
            fileList: [],
            record: {},
            modalTitle: ""
        };
        this.model = props.model;
    }

    open (record, type) {
        this.setState({
            visible: true,
            record: {...record},
            modalType: type,
            modalTitle: modalTitleObj[type]
        })
    }

    hide = () => {
        this.setState({
            visible: false
        })
    }

    validateForm(record) {
        let errors = [],hasRequired,str = '';
        for(let model of this.model){
            if(model.type === "date"){
                record[model.key] = record[model.key] ? moment(record[model.key]._d || record[model.key]).format(model.config.format) : void 0;
            }
            if(model.required){
                if(model.validate){
                    let validateResult = model.validate(record)
                    if(validateResult) errors.push(validateResult);
                }else if(!record[model.key]){
                    errors.push("required");
                }
            }
        }
        for(let e of errors){
            if(e === "required"){
                hasRequired = true;
                continue;
            }
            str = str + e + ";";
        }
        if(hasRequired) str+="必填项不能为空;";
        if(str.length) {
            React.$alert("error",str);
            return "error";
        }
        return "right";
    }

    beforeSaveForm(record) {
        return record;
    }

    saveForm =()=> {
        let record = {...this.state.record};
        record = this.beforeSaveForm(record);
        if(this.validateForm(record) === "error") return;
        let method,url = this.props.requestUrl,type = this.state.modalType;
        if(type === "create"){
            method = "POST";
        }else{
            method = "PUT";
            url+="/"+record.id;
        }
        axios({
            url:baseConfig.apiPrefix+url,
            method:method,
            data:record
        }).then((res)=>{
            React.$alert("success","操作成功!");
            this.saveFormCallBack(res,type);
            this.hide();
        }).catch((e)=>{
            React.$alert("error","操作失败!");
            console.error(e)
        })
    }

    saveFormCallBack() {

    }

    inputChange = (e, key) => {
        let record = this.state.record;
        record[key] = e.target.value
        this.setState({record})
    }/*监听表单填写*/

    switchChange = (val, key) => {
        let record = this.state.record;
        record[key] = val;
        this.setState({record})
    }

    radioOnChange = (e, key) => {
        let record = this.state.record;
        record[key] = e.target.value;
        this.setState({record})
    }

    selectChange = (e, key) => {
        let record = this.state.record;
        record[key] = e || '';
        console.log(record[key])
        this.setState({record})
    }

    dateChange = (e, key, format) => {
        let record = this.state.record;
        if (!e) {
            record[key] =''/* 若没填写日期 */
        } else {
            record[key] = moment(e._d,format || "YYYY-MM-DD");/* 格式化 */
        }
        this.setState({record});
    }

    showUploadFile = (options) => {
        this.$uploadFileModal.showModal(options,(res) => {
            let record = this.state.record;
            record[options.key] = res.data.filename;
            this.setState({record});
        }/*上传回调*/)
    }/*上传文件*/

    componentWillReceiveProps (nextProps) {
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        let { record, modalTitle, visible } = this.state;
        let source = this.props.source;
        let model = this.model;
        return  <Modal title={ modalTitle }
                   visible={ visible }
                   onOk={this.saveForm}
                   onCancel={this.hide}
                    >
            <Form>
                {
                    model.map((model,index)=>{
                        let tpl;
                        let key = model.realKey || model.key;
                        if(!model.edit) return null;
                        switch (model.type) {
                            case 'text':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <Input value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) }} />
                                </FormItem>
                                break;
                            case 'password':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <Input type="password" value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) }} />
                                </FormItem>
                                break;
                            case 'textarea':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <TextArea value={ record[key] } placeholder={ model.placehoder } autosize onChange={ (e) => { this.inputChange(e, key) }} />
                                </FormItem>
                                break;
                            case 'switch':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <Switch checked={ record[key] } onChange={ (val) => { this.switchChange(val, key) }} />
                                </FormItem>
                                break;
                            case 'radio':
                                let radioSource = source[model.source] || [];
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <RadioGroup onChange={ (e) => { this.radioOnChange(e, key) }} value={ record[key] }>
                                        {
                                            radioSource.map((item, index) => {
                                                return <Radio value={ item.value } key={ index }>{ item.text }</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem>
                                break;
                            case 'select':
                                let selectSource = source[model.source] || [];/* select下拉资源 */
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <SelectComponent
                                        group={ model.group }
                                        searchData={ model.searchData } /* 服务端搜索函数 */
                                        serverSearch={ model.serverSearch }/* 是否支持服务端搜索 */
                                        mode={ model.mode }
                                        style={{ width:"100%" }}
                                        defaultValue={ record[model.defaultValue] } /* 如果是服务端搜索，后端应该要多提供一个字段表示选中的值，供前端展示*/
                                        value={ record[key] }
                                        optionValue={ model.optionValue } /* 选中下拉option的值是哪个字段值 */
                                        optionText={ model.optionText } /* 下拉option显示的是哪个字段的值 */
                                        allowClear={ model.allowClear }
                                        placeholder={ model.placeholder || "请选择"}
                                        onSelect={(e) => { this.selectChange(e, key) }}
                                        source={ selectSource }>
                                    </SelectComponent>
                                </FormItem>
                                break;
                            case 'upload':
                                let { uploadUrl,filename,multi } = model.options;
                                let updateRecord = (val) =>{
                                    if (!multi) {
                                        record[model.key] = val.pop();
                                    } else {
                                        record[model.key] = val;
                                    }
                                    this.setState({record})
                                }
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <UploadImg file={ record[model.key] } filename={ filename } multi={ multi } updateRecord={ updateRecord } uploadUrl={ uploadUrl } />
                                </FormItem>
                                break;
                            /*
                            case 'select':
                                let val = model.value ? record[model.value] : (record[model.key] ? record[model.key] : record[model.key] === 0 ? 0 : "");
                                let selectSource = this.props.selectSource || {}
                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                    <div className="form-group">
                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                            {model.title}
                                        </label>
                                        <div className="col-sm-8 col-md-8 col-xs-8" style={{height:"34px",lineHeight:"34px"}}>

                                        </div>
                                    </div>
                                </div>
                                break;
                            case 'textarea':
                                var config = {key:model.key,type:"textarea",dataSource:record,placeholder:model.placeholder,callBack:this.inputChange};
                                if(model.required && !record[model.key]) config.className = "warning-border";
                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                    <div className="form-group">
                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                            {model.title}
                                        </label>
                                        <div className="col-sm-8 col-md-8 col-xs-8">
                                            <InputComponent config={config} />
                                        </div>
                                    </div>
                                </div>
                                break;
                            case 'date':
                                let date = record[model.key] ? moment(record[model.key]).format(model.config.format || "YYYY-MM-DD") : null;
                                let value = date ? moment(date) : null;
                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key} style={{height:"49px"}}>
                                    <div className="form-group">
                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                            {model.title}
                                        </label>
                                        <div className="col-sm-8 col-md-8 col-xs-8">
                                            <DatePicker
                                                value={value} style={{width:"100%",height:"34px"}} placeholder={model.placeholder} showTime={model.config.showTime || false} format={model.config.format || "YYYY-MM-DD"} onChange={(e) => {this.dateChange(e,model.key,model.config.format)}}>
                                            </DatePicker>
                                        </div>
                                    </div>
                                </div>
                                break;
                            case 'img':
                                
                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                    <div className="form-group">
                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                            {model.title}
                                        </label>
                                        <div className="col-sm-8 col-md-8 col-xs-8">
                                            <div style={{width:'100px',height:'100px'}}>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                break;*/
                        }
                        return tpl;
                    })
                }
            </Form>
        </Modal>
        /*<div className="modal fade" data-backdrop="static" data-effect="zoom" data-tabindex="-1" data-role="dialog" id="tableCrudModal">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" data-aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">{modalTitle}</h4>
                    </div>
                    <div className="modal-body">
                        <form className="form-horizontal" data-role="form" id="editForm">
                            <div className="row">
                                
                            </div>
                            <div className="row">
                                {
                                    this.props.children ? this.props.children(record) : null
                                }
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <span className="pull-right">
                            <button type="button" className="btn btn-warning" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-success" onClick={this.saveForm}>保存</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>*/
    }
}