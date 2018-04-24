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
        this.dataModel = model.getFields(this);
        this.tableModalConfig = {
            model:this.dataModel,
            requestUrl: 'data.json'
        };
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
                    dataSource={ tableDataSource } columns={ dataModel } rowKey="id"
                    pagination={ paginationConfig } onChange={ this.tableOnChange }
                />
            </div>
        </Card>;
    }
}