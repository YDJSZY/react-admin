/**
 * Created by luwenwe on 2017/9/30.
 */
import React from "react";
import AlertContainer from 'react-alert'
import axios from '../config/axiosConfig';
import baseConfig from '../config/baseConfig';
const UploadFile = require("uploadFile");
export default class UploadFileModal extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props);
    }
    
    showModal(options,saveFileCallBack) {
        if(!this.uploadFile) {
            this.uploadFile = new UploadFile("fileContainer")
        }
        this.uploadOptions = options;
        this.saveFileCallBack = saveFileCallBack;
        this.uploadFile.removeFile();
        $("#uploadModal").modal("show")
    }

    closeModal = ()=> {
        $("#uploadModal").modal("hide")
    }

    saveFile = ()=> {
        let file = this.uploadFile.getFiles();
        if(!file.length) return;
        let options = this.uploadOptions;
        let url = options.url || "upload/",filename = options.filename,multi = options.multi;
        let formData = new FormData();
        formData.append(filename || "filename", multi ? file : file[0]);
        axios({
            url:baseConfig.apiPrefix+(url),
            method:"post",
            headers: {'Content-Type': undefined},
            data:formData
        }).then((res)=> {
            React.$alert("success","上传成功!");
            this.closeModal();
            this.saveFileCallBack(res);
        }).catch((e)=>{
            React.$alert("error","上传失败!");
            console.error(e);
        })
    }
    
    render() {
        return <div>
            <div className="modal fade" data-effect="zoom" data-tabindex="-1" data-role="dialog" id="uploadModal">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.closeModal}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">上传文件</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <form className="form-horizontal" data-role="form">
                                    <div className="col-sm-12 col-md-12">
                                        <div id="fileContainer"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <span className="pull-right">
                                <button type="button" className="btn btn-warning" onClick={this.closeModal}>取消</button>
                                <button type="button" className="btn btn-primary" onClick={this.saveFile}><i className="fa fa-upload"></i>上传</button>
                            </span>
                            <div style={{clear: "both"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}