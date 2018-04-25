/**
 * Created by Apple on 17/2/6.
 */
import React from 'react';
import { model } from './model';
import { Card, Button, Form, Input, Icon, Table } from 'antd';
import DataTable from '../../components/dataTable';
import TableCrudModal from '../../components/tableCrudModal';
import Custom from '../../untils/custom';
import tableActionHoc from '../../hoc/tableActionHoc';
import DateRange from '../../components/dateRange';
const FormItem = Form.Item;

export default class ManageUsers extends Custom{
    constructor(props) {
        super(props);
        this.requestUrl = 'data.json/';
        this.tags = [
            {value: 'clother', text: '衣服'},
            {value: 'shoe', text: '鞋子'}
        ];
        this.dataModel = model.getFields(this);
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
                    ]
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
                    <Button type='primary' onClick={this.search}>搜索</Button>
                </FormItem>
            </Form>
            <div className="data-table">
                <Table
                    scroll={{ x: 1300 }}
                    dataSource={ tableDataSource } columns={ dataModel } rowKey="id"
                    pagination={ paginationConfig } onChange={ this.tableOnChange }
                />
            </div>
            <TableCrudModal { ...this.tableModalConfig } source={ this.state.$source } ref={(ref) => { this.$tableCrudModal = ref; }}></TableCrudModal>
        </Card>;
    }
}