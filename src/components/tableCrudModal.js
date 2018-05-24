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
import formItemError from '../hoc/formItemError';
const modalTitleObj = { create: '新增', edit: '编辑' };
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
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
            React.$alert('error', '表单填写有误，请检查后再提交.');
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
                    maskClosable={ false }
                    width={ 620 }
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
                        if (model.custom) return this.props.children(record, model, this)
                        switch (model.type) {
                            case 'text':
                                let inputNode = <Input value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) } } />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(inputNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'password':
                                let passwordNode = <Input type="password" value={ record[key] } placeholder={ model.placehoder } onChange={ (e) => { this.inputChange(e, key) } } />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(passwordNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'textarea':
                                let textareaNode = <TextArea value={ record[key] } placeholder={ model.placehoder } autosize onChange={ (e) => { this.inputChange(e, key) }} />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(textareaNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'switch':
                                let switchNode = <Switch checked={ record[key] } onChange={ (val) => { this.switchChange(val, key) }} />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout}>
                                    {
                                        formItemError(switchNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'radio':
                                let radioSource = source[model.source] || [];
                                let radioNode = <RadioGroup onChange={ (e) => { this.radioOnChange(e, key) }} value={ record[key] }>
                                    {
                                        radioSource.map((item, index) => {
                                            return <Radio value={ item.value } key={ index }>{ item.text }</Radio>
                                        })
                                    }
                                </RadioGroup>
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(radioNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'select':
                                let selectSource = source[model.source] || [];/* select下拉资源 */
                                let selectNode =  <SelectComponent
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
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(selectNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'upload':
                                let { uploadUrl, filename, multi, fileType } = model.options
                                let updateRecord = (val) =>{
                                    if (!multi) {
                                        record[model.key] = val.pop();
                                    } else {
                                        record[model.key] = val;
                                    }
                                    this.setState({record})
                                }
                                let uploadNode = <UploadImg file={ record[model.key] } fileType={ fileType } filename={ filename } multi={ multi } updateRecord={ updateRecord } uploadUrl={ uploadUrl } />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(uploadNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'date':
                                let date = record[model.key] ? moment(record[model.key]).format(model.config.format || "YYYY-MM-DD") : null;
                                let value = date ? moment(date) : null;
                                let datePickerNode = <DatePicker
                                    value={value} style={{ width:"100%"}} placeholder={model.placeholder} showTime={model.config.showTime || false} format={model.config.format || "YYYY-MM-DD"} onChange={(e) => {this.dateChange(e,model.key,model.config.format)}}>
                                </DatePicker>
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(datePickerNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'checkbox':
                                let checkboxSource = source[model.source] || []
                                let checkboxNode = <CheckboxGroup options={ checkboxSource } value={ record[model.key] } onChange={ (value) => { this.onCheckboxChange(value, key) }} />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(checkboxNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'cascader':
                                let cascaderSource = source[model.source] || [];
                                let cascaderNode = <Cascader options={ cascaderSource } value={ record[model.key] }
                                    onChange={ (value) => { this.onCascaderChange(value, key) }}
                                    placeholder={ model.placeholder || '请选择'}
                                    showSearch={ true } changeOnSelect={ true } expandTrigger="hover"
                                />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(cascaderNode, model.error)
                                    }
                                </FormItem>
                                break;
                            case 'number':
                                let min = model.min;
                                let max = model.max;
                                let step = model.step;
                                let formatter = model.formatter;/* 指定输入框展示值的格式 function(value: number | string): string*/
                                let parser = model.parser;/* 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 function( string): number*/
                                let numberNode = <InputNumber min={ min } max={ max } style={{ width: '100%' }}
                                    step={ step }
                                    value={ record[model.key] }
                                    formatter={ formatter }
                                    parser = { parser }
                                    onChange={ (value) => { this.valueChange(value, key) }}
                                    placeholder={ model.placeholder}
                                />
                                tpl = <FormItem label={ model.title } key={ key } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                    {
                                        formItemError(numberNode, model.error)
                                    }
                                </FormItem>
                                break;
                        }
                        return tpl;
                    })
                }
                { }
            </Form>
        </Modal>
    }
}