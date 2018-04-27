/**
 * Created by luwenwe on 2017/10/11.
 */
import React from  'react';
import  { Route,Redirect } from 'react-router-dom';
import { constants } from './global';
import axios from '../config/axiosConfig';

let throttleTime = function (callback, time = 500) {
    let timer = null;
    return function () {
        if (timer) clearTimeout(timer);
        let args = arguments;
        timer = setTimeout(function () {
            callback(...args)
            timer = null;
        }, time)
    }
}

let getConstantArrayValue = function (group, value) {
    let cs = constants[group];
    if (!cs) {
        console.log('found invalid constant: ' + group);
        return -1;
    }
    for (let i = 0; i < cs.length; ++i) {
        if(cs[i][0] === value){
            return cs[i][2];
        }
    }
    return '';
}

let getConstantObjectValue = function (group, name) {
    let cs = constants[group];
    if (!cs) {
        console.log('found invalid constant: ' + group + name);
        return -1;
    }
    for (let i = 0; i < cs.length; ++i) {
        if(cs[i]['code'] === name){
            return cs[i]['description'];
        }
    }
    return -1;
}

let translateSelectSource = function (source) {
    let newSource = []
    if (!source) return [];
    for (let s of source){
        let obj = {id:''+s.code, name: s.description};
        newSource.push(obj);
    }
    return newSource;
};

let findObjectById = function (objectList, id) {
    for (let i = 0; i < objectList.length; ++i) {
        let obj = objectList[i];
        if (obj.id == id) {
            return obj;
        }
    }
    return null;
};

let findObjectIndexById = function (objectList, id) {
    for (let i = 0; i < objectList.length; ++i) {
        let obj = objectList[i];
        if (obj.id == id) {
            return i;
        }
    }
    return null;
}

let exportData = function (view, params) {
    axios({
        'url': this.makeUrl('export'),
        'data': {view: view, params: params},
        'method': 'POST'
    }).then(function (res) {
        if (res.status == 200) {
            React.$alert('success','导出成功');
            return;
        }
        React.$alert('error',res.data);
    }.bind(this));
}

let subStrText = function (val, cutTextCount) {
    if (!val) return '';
    cutTextCount = cutTextCount || 20;
    let newVal = val.length > cutTextCount ? val.substr(0,cutTextCount)+'...' : val;
    return newVal;
}

let createRoute = (routes, temporarily) => {
    return routes.map((route, i)=> {
        if (route.exact) return <Route key={'route_'+i} exact={route.exact ? route.exact : true} path={route.path} render={()=>{return <Redirect to={'/'+route.redirect+'/'} />}}></Route>
        return <Route path={route.path} key={'route_'+i} render={(match)=>{return temporarily[route.key](match,route.routes)}}></Route>
    });
}

let isBlank = (val) => {
    return val === undefined || val === '' || val === null;
}

export {
    throttleTime,
    getConstantArrayValue,
    getConstantObjectValue,
    translateSelectSource,
    findObjectById,
    findObjectIndexById,
    exportData,
    subStrText,
    createRoute,
    isBlank
};