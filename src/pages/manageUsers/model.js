/**
 * Created by luwenwei on 17/9/3.
 */
import React from 'react';
import { getConstantObjectValue } from '../../untils/commonMethods'
import { renderAvatar,renderEnabled,renderTooltip } from '../../untils/renderData';
import moment from 'moment';
let model = {
    getFields:function (context) {
        let self = context;
        return [
            {
                title: 'ID',
                key: 'id',
                sorter:true,/*服务端排序*/
                show:true,
            },
            {
                title: '用户名',
                key: 'username',
                show: true,
            },{
                title: '昵称',
                key: 'nickname',
                show: true,
                use: true,
                sorter: true,
                edit:true,
                required:true,
                type:'text',
            },{
                title: '联系方式',
                key: 'phone',
                show: true,
                use: true
            },
            {
                title: '性别',
                key: 'sex',
                edit:true,
                show: true,
                placeholder:'必选',
                type:'select',
                required:true,
                validate: function (record) {
                    if(!record[this.key]) return 'required';
                },
                source:'SexType',
                render: function (val) {
                    return getConstantObjectValue('SexType',val)
                },
            },
            {
                title: '活跃度',
                key: 'activity',
                show: true
            },
            {
                title: '来源平台',
                key: 'platform',
                show: true,
                render: function (val) {
                    return getConstantObjectValue('UserPlatform', val);
                },
                edit:true,
                type: 'select',
                source: 'UserPlatform'
            },
            {
                title: '标签',
                key: 'tags',
                show: true,
                edit:true,
                type:'text',
                render: function (val) {
                    return val.join();
                }
            },
            {
                title: '关注',
                key: 'enabled',
                show: true,
                type:'switch',
                render: function (val) {
                    return renderEnabled(val);
                }
            },
            {
                title: '创建时间',
                key: 'created',
                show: true,
                render: function (val) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: '头像',
                key: 'headimg',
                show: true,
                edit:true,
                type:'img',
                uploadBtnText:'上传头像',
                render: (val,record) =>{
                    return renderAvatar(val)
                },
                options: {
                    key: 'headimg',
                    callBack: function (file) {
                        self.uploadFile(file,this.key)
                    }
                }
            },
            {
                title: '操作',
                key: 'action',
                show: true,
                eyeWatch: false,
                style:{width:'20px'},
                render: (text, record, dataTableRef) => {
                    return <span>
                        <button className='btn btn-primary btn-xs' onClick={()=>{self.tableAction.edit(record)}}>编辑</button>
                        <span className='seperate-line'></span>
                        <a className='btn btn-xs btn-info' href={'#/orderRecord/?user='+record.id} target='_blank'>拼单记录</a>
                    </span>;
                }
            }
        ];
    }
}

export {model};