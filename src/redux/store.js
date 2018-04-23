import todoApp from './reducers';
import { createStore } from 'redux';

let store = createStore(todoApp);/*createStore函数接受另一个函数作为参数，返回新生成的 Store 对象*/

export default store;