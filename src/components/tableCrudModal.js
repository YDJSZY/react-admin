/**
 * Created by luwenwe on 2017/9/11.
 */
import React from "react";
import moment from 'moment';
import { DatePicker } from 'antd';
import Switch from 'rc-switch';
import '../../node_modules/rc-switch/assets/index.css'
import SelectComponent from './select';
import axios from '../config/axiosConfig';
import {constants} from '../untils/global';
import baseConfig from '../config/baseConfig';
import { InputComponent } from './formComponents';
import { translateSelectSource } from '../untils/commonMethods';
import UploadImg from './uploadImg/uploadImg';
const modalTitleObj = {"create":"新增","edit":"编辑"}

export default class TableCrudModal extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            modalType:"",
            fileList:[],
            record:{},
            modalTitle:"",
            selectSource:props.config.selectSource || {}
        };
        this.model = props.config.model;
    }

    open(record,type,tableCrudModalElement) {
        this.$tableCrudModalElement = tableCrudModalElement;
        this.setState({
            record:{...record},
            modalType:type,
            modalTitle:modalTitleObj[type]
        },function () {
            $(tableCrudModalElement).modal("show");
        })
    }

    hide() {
        $(this.$tableCrudModalElement).modal("hide");
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
        let method,url = this.props.config.requestUrl,type = this.state.modalType;
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

    inputChange =(record)=> {
        this.setState({record})
    }/*监听表单填写*/

    switchChange =(val,key)=> {
        let record = this.state.record;
        record[key] = val;
        this.setState({record})
    }

    selectChange =(e,key)=> {
        let record = this.state.record;
        record[key] = e || "";
        this.setState({record})
    }

    dateChange =(e,key,format)=> {
        let record = this.state.record;
        if(!e) {
            record[key] = ""/*若没填写日期*/
        }else{
            record[key] = moment(e._d,format || "YYYY-MM-DD");/*格式化*/
        }
        this.setState({record});
    }

    showUploadFile =(options)=> {
        this.$uploadFileModal.showModal(options,(res)=>{
            let record = this.state.record;
            record[options.key] = res.data.filename;
            this.setState({record});
        }/*上传回调*/)
    }/*上传文件*/

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectSource !== this.props.selectSource){
            this.setState({selectSource:nextProps.selectSource})
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        let record = this.state.record;
        let modalTitle = this.state.modalTitle;
        let model = this.model;
        return  <div className="modal fade" data-backdrop="static" data-effect="zoom" data-tabindex="-1" data-role="dialog" id="tableCrudModal">
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
                                {
                                    model.map((model,index)=>{
                                        let tpl;
                                        if(!model.edit) return null;
                                        switch (model.type) {
                                            case 'text':
                                                var config = {key:model.key,type:"text",dataSource:record,placeholder:model.placeholder,callBack:this.inputChange};
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
                                            case 'number':
                                                var config = {key:model.key,type:"text",dataSource:record,placeholder:model.placeholder,callBack:this.inputChange};
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
                                            case 'switch':
                                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                                    <div className="form-group">
                                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                                            {model.title}
                                                        </label>
                                                        <div className="col-sm-8 col-md-8 col-xs-8" style={{height:"34px",lineHeight:"34px"}}>
                                                            <Switch checked={record[model.key] || false} onChange={(e) => {this.switchChange(e,model.key)}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                break;
                                            case 'select':
                                                let val = model.value ? record[model.value] : (record[model.key] ? record[model.key] : record[model.key] === 0 ? 0 : "");
                                                let selectSource = this.props.config.selectSource || {}
                                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                                    <div className="form-group">
                                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                                            {model.title}
                                                        </label>
                                                        <div className="col-sm-8 col-md-8 col-xs-8" style={{height:"34px",lineHeight:"34px"}}>
                                                            <SelectComponent
                                                                searchData={model.searchData}
                                                                serverSearch={model.serverSearch}
                                                                mode={model.mode}
                                                                style={{width:"100%"}}
                                                                value={''+val}
                                                                allowClear={model.allowClear}
                                                                placeholder={model.placeholder || "请选择"}
                                                                onSelect={(e) => {this.selectChange(e,model.key)}}
                                                                source={selectSource[model.source] || translateSelectSource(constants[model.source]) || []}>
                                                            </SelectComponent>
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
                                                let { uploadUrl,filename,multi } = model.options;
                                                let updateRecord = (val)=>{
                                                    record[model.key] = val;
                                                    this.setState({record})
                                                }
                                                tpl = <div className="col-sm-6 col-md-6 col-xs-12" key={"_"+model.key}>
                                                    <div className="form-group">
                                                        <label htmlFor={"id_"+model.key} className="col-sm-3 col-md-3 col-xs-3 control-label">
                                                            {model.title}
                                                        </label>
                                                        <div className="col-sm-8 col-md-8 col-xs-8">
                                                            <div style={{width:'100px',height:'100px'}}>
                                                                <UploadImg imgUrl={record[model.key]} filename={filename} multi={multi} updateRecord={updateRecord} uploadUrl={uploadUrl} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                break;
                                        }
                                        return tpl;
                                    })
                                }
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
        </div>
    }
}