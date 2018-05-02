/**
 * Created by luwenwe on 2017/9/11.
 */
import React from "react";
import moment from 'moment';
import { DatePicker, InputNumber, Modal, Form, Input, Switch, Radio, Upload, Icon, Checkbox, Cascader } from 'antd';
import SelectComponent from './select';
import axios from '../config/axiosConfig';
import {constants} from '../untils/global';
import baseConfig from '../config/baseConfig';
import { translateSelectSource } from '../untils/commonMethods';
import UploadImg from './uploadImg/uploadImg';
import immutable from 'immutable';
const modalTitleObj = { create: '新增', edit: '编辑' };
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
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
            modalType: '',
            fileList: [],
            record: {},
            modalTitle: '',
            formModel: []
        };
        this.dataModel = props.model;
    }

    open (record, type) {
        let formModel = immutable.fromJS(this.dataModel);
        record = immutable.fromJS(record);
        this.setState({
            formModel,
            visible: true,
            record: record.toJS(),
            modalType: type,
            modalTitle: modalTitleObj[type]
        })
    }

    hide = () => {
        this.setState({
            visible: false
        })
    }

    validateForm (record) {
        let errors = [];
        let formModel = immutable.fromJS(this.dataModel);
        let _formModel = formModel;
        formModel.map((_model, index) => {
            let model = _model.toJS();
            let key = model.realKey || model.key;/* 先找出key */
            if (model.type === "date") {
                record[model.key] = record[model.key] ? moment(record[model.key]._d || record[model.key]).format(model.config.format) : void 0;
            }
            if (model.validate) {
                let hasError = false;
                for (let rule of model.validate) {
                    if (!rule.rule(record[key], record)) {/* 验证不通过 */
                        _formModel = _formModel.setIn([index, 'error'], rule.message)
                        errors.push(rule.message);
                        hasError = true;
                        break;
                    }
                }
            }
        })
        console.log(_formModel.toJS())
        this.setState({formModel: _formModel})
        if(errors.length) {
            React.$alert('error', '表单填写有误，请检查后再提交');
            return "error";
        }
        return "right";
    }

    beforeSaveForm(record) {
        return record;
    }

    saveForm = () => {
        let record = {...this.state.record};
        record = this.beforeSaveForm(record);
        if (this.validateForm(record) === "error") return;
        let method,url = this.props.requestUrl,type = this.state.modalType;
        if (type === "create") {
            method = "POST";
        } else {
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

    valueChange = (value, key) => {
        let record = this.state.record;
        record[key] = value;
        this.setState({record})
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

    onCheckboxChange = (value, key) => {
        let record = this.state.record;
        record[key] = value;
        this.setState({record});
    }

    onCascaderChange = (value, key) => {
        console.log(value)
        let record = this.state.record;
        record[key] = value;
        this.setState({record});
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
        let { record, modalTitle, visible, formModel = [] } = this.state;
        let source = this.props.source;
        return  <Modal title={ modalTitle }
                   visible={ visible }
                   onOk={this.saveForm}
                   onCancel={this.hide}
                    >
            <Form className="table-form-edit">
                {
                    formModel.map((_model, index) => {
                        let model = _model.toJS();
                        let tpl;
                        let key = model.realKey || model.key;
                        if (model.edit === false) return null;
                        if (typeof model.edit === 'function') {
                            if (!model.edit(record)) return null;
                        }
                        switch (model.type) {
                            case 'text':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <Input value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) }} />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'password':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <Input type="password" value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) }} />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'textarea':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <TextArea value={ record[key] } placeholder={ model.placehoder } autosize onChange={ (e) => { this.inputChange(e, key) }} />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'switch':
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    <Switch checked={ record[key] } onChange={ (val) => { this.switchChange(val, key) }} />
                                </FormItem>
                                break;
                            case 'radio':
                                let radioSource = source[model.source] || [];
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <RadioGroup onChange={ (e) => { this.radioOnChange(e, key) }} value={ record[key] }>
                                        {
                                            radioSource.map((item, index) => {
                                                return <Radio value={ item.value } key={ index }>{ item.text }</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'select':
                                let selectSource = source[model.source] || [];/* select下拉资源 */
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
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
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'upload':
                                let { uploadUrl, filename, multi, fileType } = model.options;
                                let updateRecord = (val) =>{
                                    if (!multi) {
                                        record[model.key] = val.pop();
                                    } else {
                                        record[model.key] = val;
                                    }
                                    this.setState({record})
                                }
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <UploadImg file={ record[model.key] } fileType={ fileType } filename={ filename } multi={ multi } updateRecord={ updateRecord } uploadUrl={ uploadUrl } />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'date':
                                let date = record[model.key] ? moment(record[model.key]).format(model.config.format || "YYYY-MM-DD") : null;
                                let value = date ? moment(date) : null;
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <DatePicker
                                        value={value} style={{ width:"100%"}} placeholder={model.placeholder} showTime={model.config.showTime || false} format={model.config.format || "YYYY-MM-DD"} onChange={(e) => {this.dateChange(e,model.key,model.config.format)}}>
                                    </DatePicker>
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'checkbox':
                                let checkboxSource = source[model.source] || [];
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <CheckboxGroup options={ checkboxSource } value={ record[model.key] } onChange={ (value) => { this.onCheckboxChange(value, key) }} />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'cascader':
                                let cascaderSource = source[model.source] || [];
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <Cascader options={ cascaderSource } value={ record[model.key] }
                                              onChange={ (value) => { this.onCascaderChange(value, key) }}
                                              placeholder={ model.placeholder || '请选择'}
                                              showSearch={ true } changeOnSelect={ true } expandTrigger="hover"
                                    />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
                            case 'number':
                                let min = model.min;
                                let max = model.max;
                                let step = model.step;
                                let formatter = model.formatter;/* 指定输入框展示值的格式 function(value: number | string): string*/
                                let parser = model.parser;/* 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 function( string): number*/
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    <InputNumber min={ min } max={ max } style={{ width: '100%' }}
                                                step={ step }
                                                value={ record[model.key] }
                                                formatter={ formatter }
                                                parser = { parser }
                                                onChange={ (value) => { this.valueChange(value, key) }}
                                                placeholder={ model.placeholder}
                                    />
                                    {
                                        model.error ? <div className="form-error-text"><span>{ model.error }</span></div> : null
                                    }
                                </FormItem>
                                break;
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