/**
 * Created by luwenwei on 2017/9/13.
 */
import baseConfig from '../config/baseConfig';
let myInfo,$localStorage,localStorageName = baseConfig.localStorageName;
let constants = {
    boolean:[
        {id:"true",name:"是"},
        {id:"false",name:"否"}
    ]
}
let setMyInfo = function (data) {
    return myInfo = data;
}

let setConstants = function (data) {
    return constants = {...constants,...data};
}

let getLocalStorage = function () {
    if(!window.localStorage.hasOwnProperty(localStorageName)){
        let storage = {};
        setLocalStorage(storage);
    }
    if(!window.localStorage.getItem(localStorageName)) return {};
    return JSON.parse(window.localStorage.getItem(localStorageName));
}

let setLocalStorage = function (storage) {
    try {
        window.localStorage.setItem(localStorageName,JSON.stringify(storage));
    }catch (e){
        console.debug(e)
    }
}

export {myInfo,constants,setMyInfo,setConstants,getLocalStorage,setLocalStorage}