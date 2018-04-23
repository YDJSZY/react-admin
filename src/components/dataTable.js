/**
 * Created by luwenwe on 2017/9/11.
 */
import React from "react";
import {findObjectIndexById} from '../untils/commonMethods';
import propTypes from 'prop-types';

export default class DataTable extends React.Component {
    static defaultProps = {
        
    }

    static propTypes = {
        dataStore:propTypes.object,/*表格数据源*/
        dataModel:propTypes.array,/*数据字段描述*/
        updateDataStore:propTypes.func,/*更新数据源*/
        gotoPage:propTypes.func,/*翻页*/
        getExpandedRowTpl:propTypes.func/*表格展开*/
    }

    constructor(props) {
        super(props);
        this.state = {
            switchTdCache:{}
        }
    }

    expandedRow(record) {
        record.$showDetail = !record.$showDetail;
        let dataStore = this.props.dataStore;
        let index = findObjectIndexById(dataStore.results,record.id);
        dataStore.results[index] = record;
        this.props.updateDataStore(dataStore);/*打开或者关闭*/
    }/*每一行可以打开子行*/

    setSwitchTdCache() {
        let switchTdCache = this.state.switchTdCache || {};
        for(let model of this.props.dataModel){
            switchTdCache[model.key] = model.show || false;
        }
        this.setState({switchTdCache})
    }/*给那个小眼睛提供数据{key:true || false}*/

    switchTdCacheChange = (switchTdCache)=> {
        this.setState({switchTdCache})
    }

    dataModelChange = (dataModel) => {
        this.setState({dataModel})
    }/*表头拖拽组件回调*/

    componentWillReceiveProps(nextProps) {

    }

    componentWillMount() {
        this.setSwitchTdCache();
    }

    componentDidMount() {
    }
    
    render() {
        let {dataModel,dataStore} = this.props;
        let switchTdCache = this.state.switchTdCache;
        return <div>
          
        </div>
    }
}