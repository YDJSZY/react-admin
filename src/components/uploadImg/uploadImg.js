import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from '../shadowContainer/shadowContainer';
import axios from '../../config/axiosConfig';
import baseConfig from '../../config/baseConfig'
import propTypes from 'prop-types';
import { Modal } from 'antd';

export default class UploadImg extends React.Component{
    static propTypes = {
        imgUrl:propTypes.string,
        filename:propTypes.string,
        updateRecord:propTypes.func,
        multi:propTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            previewVisible:false
        }
    }

    selectFile =()=> {
        this.$inputFileEle.click()
    }

    onSelectFile =(e)=> {
        let files = e.target.files;
        if(files.length === 0) return;
        if(files[0].type.indexOf("image") === -1){
            alert("请上传图片");
            return;
        }
        this.uploadImg(files);
        if(window.FileReader) {
            var oFReader = new FileReader();
            oFReader.onloadend = (e)=> {
                this.props.updateRecord(e.target.result)
            };
            oFReader.readAsDataURL(files[0]);
        }
    }

    uploadImg(files) {
        let { uploadUrl,filename,multi } = this.props;
        let formData = new FormData();
        formData.append(filename || "filename", multi ? files : files[0]);
        axios({
            url:baseConfig.apiPrefix + uploadUrl,
            method:"POST",
            headers: {'Content-Type': undefined},
            data:formData
        }).then((res)=> {
            this.props.updateRecord(res.data.filename)
            React.$alert("success", "上传成功!");
        }).catch((e)=>{
            React.$alert("error","上传失败!");
            console.error(e);
        })
    }

    removeImg =()=> {
        this.props.updateRecord(undefined)
    }

    preview =()=> {
        this.setState({
            previewVisible:true
        })
    }

    handleCancel =()=> {
        this.setState({
            previewVisible:false
        })
    }

    componentDidMount() {
        let containerEle = ReactDOM.findDOMNode(this.$ContainerEle);
        containerEle.addEventListener("change",this.onSelectFile,false)
    }

    render() {
        let styles = {
            cursor:'pointer',
            width:'100%',
            height:'100%',
            border:'1px dashed #dddddd',
            borderRadius:'2px',
            background: '#F8F8F8',
            padding:'5px',
            textAlign:'center',
            lineHeight:'90px'
        }
        let { imgUrl } = this.props;
        return <div style={styles} onClick={this.selectFile} ref={(ref)=>{this.$ContainerEle = ref}}>
            <input type='file' ref={(ref)=>{this.$inputFileEle = ref}} style={{width:'100%',height:'100%',display:'none'}} />
            {
                imgUrl ? <ShadowContainer>
                        <img src={imgUrl} style={{width:'100%',height:'100%'}} />
                        <span className='action'>
                            <i className='fa fa-eye' style={{marginRight:'5px'}} onClick={this.preview}></i>
                            <i className='fa fa-trash' onClick={this.removeImg}></i>
                        </span>
                    </ShadowContainer>
                    : <i className='fa fa-plus' style={{fontSize:'20px'}}></i>
            }
            <Modal visible={this.state.previewVisible} zIndex={9999} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={imgUrl} />
            </Modal>
        </div>
    }
}