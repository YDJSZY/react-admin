/**
 * Created by luwenwei on 17/9/19.
 */
import React from 'react';
import { Popover,Tooltip } from 'antd';
let renderAvatar = function (src,title) {
    let content = <img style={{"width":"100px","height":"100px","borderRadius":"2px"}} src={src} />;
    let _content = <img src={src} style={{"width":"40px","height":"40px","borderRadius":"2px"}} />;
    return <Popover content={content} title={title || ""}>
            {_content}
        </Popover>
}

let renderEnabled = function (flag) {
    if(flag === true){
        return <div className='btn-icon-round btn-icon-xs btn-success'><i className='fa fa-check'></i></div>
    }
    if(flag === false){
        return <div className='btn-icon-round btn-icon-xs btn-danger'><i className='fa fa-times'></i></div>
    }
}

let renderTooltip = function (title,cutTextCount) {
    if(!title) return "";
    cutTextCount = cutTextCount || 20;
    let _title = title.length > cutTextCount ? title.substr(0,cutTextCount)+"..." : title;
    return <Tooltip title={title}>
                <span>{_title}</span>
            </Tooltip>
}

export { renderAvatar,renderEnabled,renderTooltip }