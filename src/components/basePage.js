import React from 'react';

export default class BasePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataStore:null
        }
        this.loadDataParams = {
            ordering: "-id",
            page: 1,
            page_size: 20,
            dateRangeName:"本月份"
        }
    }

    makeUrl = (url)=> {
        return apiPrefix+url;
    }

    fetchData = (params)=> {
        let requestUrl = this.makeUrl(this.requestUrl);
        let loadDataParams = this.loadDataParams;
        let new_params = {...loadDataParams,...params || {page:1}};
        this.loadDataParams = new_params;
        delete new_params.dateRangeName;
        axios({
            url:requestUrl,
            method:"get",
            params:new_params,
            loading:true
        }).then((res)=>{
            this.parseResponse(res.data,new_params);
        },(e)=>{
            React.$alert("error","数据请求出错");
            hideLoading();
            console.error(e);
        })
    }

    parseResponse(data,params) {
        let dataStore = {
            defaultCurrent:data.currentPage || 1,
            totalRecords:data.count || 0,
            totalPages:data.num_pages || 1,
            pageSize:params.page_size,
            currentPage:params.page,
            results:data.results || []
        }
        this.setState({
            dataStore
        })
    }

    selectChange = (val,prop)=> {
        this.loadDataParams[prop] = val;
        this.fetchData();
    }/*select搜索*/

    search = ()=> {
        this.fetchData();
    }

    keyWordChange = (e)=> {
        this.loadDataParams.search = e.target.value;
    }

    inputEnter = (e)=> {
        if(e.keyCode === 13) {
            this.loadDataParams.search = e.target.value;
            this.search();
        }
    }/*enter搜索*/

    saveFormCallBack = (res,type)=> {
        if(type === "create") {
            this.fetchData();
        }else{
            let dataStore = this.state.dataStore;
            let i = findObjectIndexById(dataStore.results,res.data.id);
            dataStore.results.splice(i,1,res.data);
            this.updateDataStore(dataStore)
        }
    }

    uploadFile(file,key) {
        console.log(file)
        console.log(key)
    }

    dateRangeChange = (dateRange,noReq)=> {
        this.loadDataParams.begin_time = +new Date(dateRange.begin_time);
        this.loadDataParams.end_time = +new Date(dateRange.end_time);
        if(dateRange.dateRangeName == "自定义") return;
        if(noReq) return;
        this.fetchData();
    }/*日期查询范围改变*/

    switchUse = (id,enabled,url,field)=> {
        let obj = {};
        obj[field || "enabled"] = enabled;
        url = url || this.requestUrl;
        axios({
            "url":this.makeUrl(url+"/"+id),
            "method":"PATCH",
            "data":obj
        }).then(function (res) {
            if(res.status >= 200 &&  res.status <= 301) {
                let e = enabled ? "已启用" : "已禁用";
                this.translateResponse(res.data);
                React.$alert("success",e);
                return;
            }
            React.$alert("error","操作失败");
        }.bind(this))
    }

    translateResponse = (data)=> {
        let dataStore = this.state.dataStore;
        let results = dataStore.results;
        let index = findObjectIndexById(results,data.id);
        results.splice(index,1,data);
        this.updateDataStore(dataStore)
    }

    updateDataStore = (dataStore,cb)=> {
        this.setState({dataStore},cb)
    }

    cutPath(path) {/*切割路由*/
        this.currentRoute = path.split("/")[1];
        this.setLocalStorage();
        this.getStorageByCurrentRoute(this.currentRoute);
    }

    getStorageByCurrentRoute(currentRoute) {
        this.currentRouteStorage = $localStorage[currentRoute] ? $localStorage[currentRoute] : ($localStorage[currentRoute] = {});
        this.setSomeParams();
    }/*获取当前路由下的一些参数*/

    setSomeParams() {
        if(this.currentRouteStorage.loadDataParams){
            this.loadDataParams = this.currentRouteStorage.loadDataParams
        } else{
            this.currentRouteStorage.loadDataParams = this.loadDataParams;
        }/*从localstorage获取当前页面的一些请求参数*/
        //console.log(this.currentRouteStorage)
    }

    setLocalStorage() {
        $localStorage.route = this.currentRoute;
        //$localStorage[this.currentRoute].loadDataParams = this.loadDataParams;
        setLocalStorage($localStorage);
    }

    componentWillMount() {
        showLoading();
        // this.routeMessage = this.props.match;/*当前页面的路由信息*/
        //this.cutPath(this.routeMessage.match.path)
    }

    componentWillUnmount() {
        //this.setLocalStorage();
    }

    componentDidMount() {
        this.init();
        this.componentDidMountNext()
    }

    componentDidMountNext() {

    }

    clearQueueAnimStyle = ()=> {
        $(".content").css({transform:"none"});
        this.init();
    }

    createTableCrudModal() {
        if(this.$tableCrudModal){
            this.tableAction = new TableModalAction(this.$tableCrudModal,this.saveFormCallBack);
        }/*默认一个页面一个接口，一个table的增删改查*/
    }

    init() {
        this.createTableCrudModal()
        this.run()
    }

    run() {
        this.fetchData();
    }

    render() {
        return <div>
            {this.props.children ? this.props.children.apply(this) : null}
        </div>
    }
}