import  { Switch } from 'react-router-dom';
import React from "react";
import Bundle from './bundle.js';
import routes from './routes';
import { getLocalStorage } from '../untils/global';
import { createRoute } from '../untils/commonMethods';
const $localStorage = getLocalStorage();
const currentRoute = $localStorage.route;
const exactRoute = currentRoute || "manageUsers";
let temporarily = {};
for(let route of routes){
    temporarily[route.key] = (match,childRoutes) =>{
        let folder = route.key;
        let pageName = route.key + "Page";
        return (
            <Bundle load={require('bundle-loader?lazy&name=[name]!../pages/'+folder+'/'+pageName+'.js')}>
                {(Component) => <Component match={match} childRoutes={childRoutes}/>}
            </Bundle>
        )
    }
}

export default class Main extends React.Component {
    render() {
        return <Switch>
            {
                createRoute(routes,temporarily)
            }
        </Switch>
    }
}

