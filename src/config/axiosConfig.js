/**
 * Created by luwenwe on 2017/10/11.
 */
import axios from 'axios';
var hasError;
axios.defaults.timeout = 5000;// 超时时间
// http请求拦截器
axios.interceptors.request.use((config) => {
    if(config.loading){
    }
    return config;
}, (error) => {
    console.debug(error);
    return Promise.reject(error);
})
// http响应拦截器
axios.interceptors.response.use((res) => {// 响应成功关闭loading
    if(res.config.loading){
    }
    return res;
}, (error) => {
    if(error.response.status == 401 || error.response.status == 403) {
        if(!hasError) {
            alert("登录已经失效，请重新登录。");
            hasError = true;
        }
        window.location.pathname = "/accounts/login/";
        return error;
    }
    /*if (error.status == 404) {
        $location.path("/404/");
    }
    if (error.status == 500) {
        $location.path("/500/");
    }*/
    return Promise.reject(error);
})

export default axios;