/**
 * Created by Apple on 17/2/6.
 */
import React from 'react';
import { model } from './model';
import DataTable from '../../components/dataTable';
import TableCrudModal from '../../components/tableCrudModal';
import Custom from '../../untils/custom';
export default class Extend extends Custom{
    constructor(props) {
        super(props);
        this.requestUrl = 'data.json/';
        this.dataModel = model.getFields(this);
        this.loadDataParams = {
            
        };
        this.tableModalConfig = {
            model:this.dataModel,
            requestUrl: 'data.json'
        };
    }

    render () {
        let dataStore = this.state.dataStore;
        let dataModel = this.dataModel;
        return <section className="content" key="animation">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h5 className="panel-title-text">
                        <span className="parent-menu-title">用户管理</span>
                        <span className="separator">/</span>
                        <span className="children-menu-title">用户</span>
                    </h5>
                </div>
                <div className="panel-body" style={{paddingTop: 0}}>
                    <div className="row" style={{marginBottom: '15px'}}>
                        <form className="form-inline filter-form" style={{margin:0}}>
                            <div className="form-group">
                                <input type="text" style={{display:'none'}} />
                                <input className="form-control" type="text" onKeyUp={this.inputEnter} onChange={this.keyWordChange} id="quickSearch" placeholder="搜索"/>
                            </div>
                            <div className="form-group">
                                <a className="btn btn-default" onClick={this.search}>
                                    <i className="fa fa-search"></i>
                                </a>
                            </div>
                        </form>
                    </div>
                    <DataTable
                        dataStore={dataStore}
                        dataModel={dataModel}
                        gotoPage={this.fetchData}
                        ref={(ref) => { this.$dataTable = ref; }}
                    />
                    <TableCrudModal config={this.tableModalConfig} ref={(ref) => { this.$tableCrudModal = ref; }}>

                    </TableCrudModal>
                </div>
            </div>
        </section>;
    }
}