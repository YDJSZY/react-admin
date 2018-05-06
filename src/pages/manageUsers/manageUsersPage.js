/**
 * Created by Apple on 17/2/6.
 */
import React from 'react';
import { model } from './model';
import { Card, Button, Form, Input, Icon, Table, Radio, InputNumber } from 'antd';
import DataTable from '../../components/dataTable';
import TableCrudModal from '../../components/tableCrudModal';
import Custom from '../../untils/custom';
import tableActionHoc from '../../hoc/tableActionHoc';
import DateRange from '../../components/dateRange';
import TinymceComponent from '../../components/tinymce/tinymce';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
}
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginButtom: '15px'
}

export default class ManageUsers extends Custom{
    constructor(props) {
        super(props);
        this.requestUrl = 'data.json/';
        this.tags = [
            {value: 'clother', text: '衣服'},
            {value: 'shoe', text: '鞋子'}
        ];
        this.dataModel = model.getFields(this).filter((m) => { return m.show });/* 当某些列并不需要显示时 */
        this.tableModalConfig = {
            model: this.dataModel,
            requestUrl: 'data.json'
        };
        this.state.$source = {}
    }

    componentWillMount () {
        setTimeout(() => {
            this.setState({
                $source: {
                    tags: [
                        {value: 'clother', text: '衣服'},
                        {value: 'shoe', text: '鞋子'}
                    ],
                    sexType: [
                        {code: 1, text: '男生'},
                        {code: 2, text: '女生'}
                    ],
                    category: [
                        {
                            type: '男生',
                            data: [
                                {code: 1, text: '小明'},
                                {code: 2, text: '小天'}
                            ]
                        },
                        {
                            type: '女生',
                            data: [
                                {code: 3, text: '小婷'},
                                {code: 4, text: '小莲'}
                            ]
                        }
                    ],
                    hobbies: [
                        {value: 1, label: '篮球'},
                        {value: 2, label: '足球'},
                        {value: 3, label: '绣花'},
                        {value: 4, label: '听歌'}
                    ],
                    citys: [{
                        value: 1,
                        label: '浙江',
                        children: [{
                            value: 1,
                            label: '杭州',
                            children: [{
                                value: 1,
                                label: '西湖',
                            }],
                        }],
                    }, {
                        value: 2,
                        label: '江苏',
                        children: [{
                            value: 1,
                            label: '南京',
                            children: [{
                                value: 1,
                                label: '中华门',
                            }],
                        }],
                    }]
                }
            })
        },500)
    }

    searchPlatform = (keyword,cb) => {
        console.log(keyword)
        let { $source } = this.state;
        $source.userPlatform = [];
        this.setState({
            $source
        });
        setTimeout(() => {
            let userPlatform = [
                {id:1, name: 'PC'},
                {id:2, name: 'mobile'}
            ];
            $source.userPlatform = userPlatform;
            this.setState({
                $source
            });
            cb();
        }, 1000);
    }

    onRadioChange = (val) => {

    }

    render () {
        let dataModel = this.dataModel;
        let paginationConfig = this.state.paginationConfig;
        let tableDataSource = this.state.tableDataSource || [];
        return <Card title="用户管理" style={{ width: '100%' }}>
            <Form layout="inline" onSubmit={this.handleSubmit} className="filter-form">
                <FormItem>
                    <DateRange dateRangeName={this.loadDataParams.dateRangeName}
                        cacheParams={this.loadDataParams}
                        onDateRangeChange={this.dateRangeChange}>
                    </DateRange>
                </FormItem>
                <FormItem>
                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="搜索" />
                </FormItem>
                <FormItem>
                    <Button type='primary' onClick={ this.search }>搜索</Button>
                </FormItem>
                <FormItem style={{ float: 'right'}}>
                    <Button type='primary' onClick={ () => { this.tableAction.create() }}>新增</Button>
                </FormItem>
            </Form>
            <div className="data-table">
                <Table
                    scroll={{ x: 1800 }}
                    dataSource={ tableDataSource } columns={ dataModel } rowKey="id"
                    pagination={ paginationConfig } onChange={ this.tableOnChange }
                />
            </div>
            <TableCrudModal { ...this.tableModalConfig } source={ this.state.$source } ref={(ref) => { this.$tableCrudModal = ref; }}>
                {
                    (record, model, parent) => {
                        switch (model.key) {
                            case 'radioTest':
                                return (
                                    <FormItem label={ model.title } {...formItemLayout} className={ model.required ? 'required' : '' }>
                                        <RadioGroup onChange={ (e) => { parent.radioOnChange(e, model.key) }} value={ record[model.key] }>
                                            <Radio style={ radioStyle } value={1}>
                                                固定值
                                                {
                                                    record.radioTest === 1 ? <Input placeholder="固定值" style={{marginLeft: '10px'}} onChange={ (e) => { parent.inputChange(e, 'confirmVal') }} value={ record.confirmVal }/> : null
                                                }
                                                {
                                                    model.error ? <div className="form-error-text" style={{top: '50%'}}><span>{ model.error }</span></div> : null
                                                }
                                            </Radio>
                                            <Radio style={ radioStyle } value={2}>
                                                随机值
                                                {
                                                    record.radioTest === 2 ? <span><InputNumber value={ record.minVal } placeholder="最小值" onChange={ (value) => { parent.valueChange(value, 'minVal') }} style={{marginLeft: '10px', width: '100px', display: 'inline-block'}}/>
                                                        <InputNumber placeholder="最大值" onChange={ (value) => { parent.valueChange(value, 'maxVal') }} value={ record.maxVal } style={{marginLeft: '10px', width: '100px', display: 'inline-block'}} />
                                                    </span> : null
                                                }
                                                {
                                                    model.error ? <div className="form-error-text" style={{top: '50%'}}><span>{ model.error }</span></div> : null
                                                }
                                            </Radio>
                                        </RadioGroup>
                                    </FormItem>
                                )
                        }
                    }
                }
            </TableCrudModal>
        </Card>;
    }
}