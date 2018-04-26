import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from '../shadowContainer/shadowContainer';
import axios from '../../config/axiosConfig';
import baseConfig from '../../config/baseConfig'
import PropTypes from 'prop-types';
import { Modal, Icon, Button } from 'antd';

export default class UploadImg extends React.Component{
    static defaultProps = {
        uploadLimitCount: 1,
        multi: false,
        filename: 'filename'
    }

    static propTypes = {
        file: PropTypes.oneOfType(
            [PropTypes.object, PropTypes.array]
        ),
        filename: PropTypes.string,
        updateRecord: PropTypes.func,
        multi: PropTypes.bool,/* 是否支持多文件上传 */
        uploadLimitCount: PropTypes.number /* 限制文件上传个数 */
    }

    constructor(props) {
        super(props);
        this.filelist = [];
        this.state = {
            previewVisible: false,
            currentPreviewFile: null,
            files: [],
            unUpload: true,
            uploading: false
        }
    }

    selectFile = () => {
        this.$inputFileEle.click()
    }

    injustFileType (type, targetFileType) {
        if (type.indexOf('image') !== -1 && targetFileType !== 'image') {
            alert("错误的文件类型");
            return false;
        }/* 没有除图片之外的类型限制 */
        if (targetFileType === 'image' && type.indexOf('image') === -1) {
            alert('错误的文件类型,请上传图片');
            return false;
        }
        return true;
    }

    onSelectFile = (e) => {
        let files = e.target.files;
        let fileType = this.props.fileType;
        let multi = this.props.multi;
        if (files.length === 0) return;
        this.filelist = files;
        if (!multi) {
            let results = this.injustFileType(files[0].type, fileType);
            if (!results) return;
        } else{
            for(let file of files) {
                let results = this.injustFileType(file.type, fileType);
                if(!results) return;
            }
        }/* 判断文件类型是否符合 */
        this.uploadFile();
        return;
        if (window.FileReader) {
            if (!this.props.multi) {
                let oFReader = new FileReader();
                oFReader.onloadend = (e) => {
                    this.props.updateRecord([...this.state.files, {name: files[0].name, fileUrl: e.target.result, type: files[0].type}])
                };
                oFReader.readAsDataURL(files[0]);
            } else{
                let promises = [];
                for (let item of files) {
                    let oFReader = new FileReader();
                    promises.push(
                        new Promise((resolve, reject) => {
                            oFReader.readAsDataURL(item);
                            oFReader.onloadend = (e) => {
                                resolve({name: item.name, fileUrl: e.target.result, type: item.type});
                            };
                        })
                    )
                }
                Promise.all(promises).then((res) => {
                    this.props.updateRecord([...this.state.files,...res]);
                })
            }
        }
        this.setState({
            unUpload: false
        })
    }

    uploadFile = () => {
        let { uploadUrl, filename, multi } = this.props;
        let filelist = this.filelist;
        this.setState({uploading: true});
        let formData = new FormData();
        if (!multi) {
            formData.append(filename, filelist[0]);
        } else {
            for (let file of filelist) {
                formData.append(filename, file);
            }
        }
        setTimeout(() => {
            let res = {
                data:{name:'test.jpg',fileUrl:'http://img4.imgtn.bdimg.com/it/u=3190670314,2062948026&fm=214&gp=0.jpg'}
            }
            if (Array.isArray(res.data)) {
                this.props.updateRecord([...this.state.files, ...res.data]);
            } else {
                this.props.updateRecord([...this.state.files, res.data])
            }
            this.setState({
                uploading: false
            })
        },500)
        return;
        axios({
            url: baseConfig.apiPrefix + uploadUrl,
            method: "POST",
            headers: {'Content-Type': undefined},
            data: formData
        }).then((res) => {/* 后端需返回{name:filename,fileUrl:fileUrl}*/
            if (Array.isArray(res.data)) {
                this.props.updateRecord([...this.state.files, ...res.data]);
            } else {
                this.props.updateRecord([...this.state.files, res.data])
            }
            this.filelist = [];/* 清空选择的文件 */
            React.$alert("success", "上传成功!");
            this.setState({
                unUpload: true,
                uploading: false
            })
        }).catch((e) => {
            this.setState({uploading: false})
            React.$alert("error","上传失败!");
            console.error(e);
        })
    }

    removeImg = (index) => {
        let { files } = this.state;
        files.splice(index, 1);
        this.props.updateRecord(files);
    }

    preview = (file) => {
        this.setState({
            previewVisible: true,
            currentPreviewFile: file
        })
    }

    handleCancel = () => {
        this.setState({
            previewVisible:false
        })
    }

    componentWillReceiveProps (nextProps) {
        //console.log(nextProps)
        let { files } = this.state;
        if (nextProps.multi) {
            files = nextProps.file || [];
        } else {
            files = nextProps.file ? [nextProps.file] : [];
        }
        this.setState({files})
    }

    componentDidMount () {
        let containerEle = ReactDOM.findDOMNode(this.$ContainerEle);
        containerEle.addEventListener("change", this.onSelectFile, false);
        let { file } = this.props;
        let { files } = this.state;
        file ? (!Array.isArray(file) ? files.push[file] : files = file ) : files = [];
        this.setState({files});
    }

    render () {
        let styles = {
            verticalAlign: 'bottom',
            margin: '2px',
            display: 'inline-block',
            cursor: 'pointer',
            width: '100px',
            height: '100px',
            border: '1px dashed #dddddd',
            borderRadius: '2px',
            background: '#F8F8F8',
            padding: '5px',
            textAlign: 'center',
            lineHeight: '90px'
        }
        let { multi, uploadLimitCount, fileType } = this.props;
        let { files, currentPreviewFile, previewVisible, uploading, unUpload } = this.state;
        return <div>
            <div style={styles} onClick={ this.selectFile } ref={(ref) => {
                this.$ContainerEle = ref
            }}>
                <Button type="default" shape="circle" loading={ uploading } icon="upload" size='small' />
                <input type='file' multiple={ multi ? 'multiple' : false} ref={(ref) => {
                    this.$inputFileEle = ref
                }} style={{width: '100%', height: '100%', display: 'none'}}/>
            </div>
            {
                files.length ?
                    files.map((item, index) => {
                        return <div style={styles} key={index}>
                            <ShadowContainer>
                                {
                                    fileType === 'image' ?
                                    <img src={item.fileUrl} style={{width: '100%', height: '100%'}}/>
                                        : <span className="clamp">{ item.name }</span>
                                }
                                <span className='action' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                                {
                                    fileType === 'image' ?
                                    <Icon type="eye" style={{marginRight: '5px'}} onClick={() => {
                                        this.preview(item)
                                    }} />
                                        : null
                                }
                                    <Icon type="delete" onClick={ () => { this.removeImg(index) }}/>
                                </span>
                            </ShadowContainer>
                        </div>
                    })
                    : null
            }
            <Modal visible={ previewVisible } zIndex={ 9999 } footer={ null } onCancel={ this.handleCancel }>
                {
                    currentPreviewFile ? (
                        fileType === 'image' ?
                        <img alt={ currentPreviewFile.name } style={{width: '100%'}} src={currentPreviewFile.fileUrl} />
                            : null
                    )
                    : null
                }
            </Modal>
        </div>
    }
}