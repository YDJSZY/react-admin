/**
 * Created by luwenwei on 17/9/3.
 */
import React from 'react';
import { Button, Divider } from 'antd';
import { getConstantObjectValue, isBlank } from '../../untils/commonMethods';
import { renderAvatar, renderEnabled, renderTooltip } from '../../untils/renderData';
import moment from 'moment';
let model = {
    getFields:function (context) {
        let self = context;
        return [
            {
                title: 'ID',
                key: 'id',
                sorter: true,/*服务端排序*/
                show: false,
                dataIndex: 'id'
            },
            {
                title: '用户名',
                key: 'username',
                dataIndex: 'username',
                width: 120,
                edit: (record) => {
                    if (record.password == '123456') return false;
                    return true;
                },
                type: 'text',
                show: true,
                placehoder: '用户名',
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ]
            }
            ,
            {
                title: '密码',
                key: 'password',
                dataIndex: 'password',
                width: 120,
                show: true,
                use: true,
                sorter: true,
                edit:true,
                required:true,
                type:'password',
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ]
            },
            {
                title: '联系方式',
                key: 'phone',
                dataIndex: 'phone',
                width: 150,
                show: true,
                use: true,
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ]
            },
            {
                title: '年龄',
                key: 'age',
                dataIndex: 'age',
                edit: true,
                type: 'number',
                formatter: (value) => {
                    return value + '岁'
                },
                width: 120,
                show: true,
                use: true,
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !(val > 120);
                        },
                        message: '年龄不能大于120'
                    }
                ]
            },
            {
                title: '性别',
                key: 'sex',
                width: 120,
                dataIndex: 'sex',
                edit: (record) => {
                    if (record.password == '123456') return false;
                    return true;
                },
                show: true,
                placeholder: '必选',
                type: 'select',
                optionValue: 'code',
                optionText: 'text',
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ],
                source: 'sexType',
                /*render: function (val) {
                    return getConstantObjectValue('SexType',val)
                },*/
            },
            {
                title: '分类',
                key: 'category',
                dataIndex: 'category',
                edit: true,
                width: 120,
                show: true,
                placeholder: '必选',
                type: 'select',
                optionValue: 'code',
                optionText: 'text',
                group: true,
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ],
                source: 'category',
                /*render: function (val) {
                    return getConstantObjectValue('SexType',val)
                },*/
            },
            {
                title: '活跃度',
                key: 'activity',
                dataIndex: 'activity',
                width: 120,
                show: true
            },
            {
                title: '来源平台',
                key: 'platform',
                dataIndex: 'platform',
                width: 150,
                show: true,
                /*render: function (val) {
                    return getConstantObjectValue('UserPlatform', val);
                },*/
                edit:true,
                type: 'select',
                defaultValue: '_platform',
                serverSearch: true,
                source: 'userPlatform',
                searchData: self.searchPlatform,
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ]
            },
            {
                title: '标签',
                key: 'tags',
                dataIndex: 'tags',
                width: 120,
                show: true,
                edit: true,
                type: 'radio',
                source: 'tags',
                render: function (val) {
                    return val;
                },
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '请选择标签'
                    }
                ],
            },
            {
                title: '关注',
                key: 'enabled',
                dataIndex: 'enabled',
                width: 120,
                show: true,
                edit: true,
                type:'switch',
                render: function (val) {
                    return renderEnabled(val);
                }
            },
            {
                title: '创建时间',
                key: 'created',
                dataIndex: 'created',
                width: 250,
                show: true,
                edit: true,
                type:'date',
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ],
                config: {

                },
                render: function (val) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: '描述',
                key: 'description',
                dataIndex: 'description',
                width: 120,
                show: true,
                edit: true,
                type:'textarea',
                required:true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '用户名不能为空'
                    }
                ]
            },
            {
                title: '爱好',
                key: 'hobby',
                dataIndex: 'hobby',
                required: true,
                width: 120,
                show: true,
                edit: true,
                type: 'checkbox',
                source: 'hobbies'
            },
            {
                title: '城市',
                key: 'city',
                dataIndex: 'city',
                required: true,
                width: 120,
                show: true,
                edit: true,
                type: 'cascader',
                source: 'citys'
            },
            {
                title: '头像',
                key: 'headimg',
                dataIndex: 'headimg',
                width: 120,
                show: true,
                edit: true,
                type: 'upload',
                uploadBtnText: '上传头像',
                render: (val,record) =>{
                    return renderAvatar(val);
                },
                options: {
                    fileType: 'image',
                    multi: true,
                    key: 'headimg',
                    callBack: function (file) {
                        self.uploadFile(file,this.key);
                    }
                },
                required: true,
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '请上传头像'
                    }
                ]
            },
            {
                title: '领取奖励',
                key: 'radioTest',
                dataIndex: 'radioTest',
                required: true,
                width: 150,
                show: true,
                edit: true,
                custom: true,
                type: 'cascader',
                validate: [
                    {
                        rule: (val) => {
                            return !isBlank(val);
                        },
                        message: '不能为空'
                    }
                ]
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 170,
                show: true,
                eyeWatch: false,
                render: (text, record) => {
                    return <span>
                        <Button type='primary' size='small' style={{ fontSize: '12px'}} onClick={() => { self.tableAction.edit(record); }}>编辑</Button>
                        <Divider type="vertical" />
                        <a href={'#/orderRecord/?user='+record.id} target='_blank'>
                            <Button type='primary' size='small' style={{ fontSize: '12px'}}>
                                拼单记录
                            </Button>
                        </a>
                    </span>;
                }
            }
        ];
    }
}

export { model };