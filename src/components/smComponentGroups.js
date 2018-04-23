import React from 'react';
import { Popover,Tooltip } from 'antd';
import { connect } from 'react-redux'

export class RenderAvatar extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let {src,title} = this.props;
        var content = <img style={{"width":"100px","height":"100px","borderRadius":"2px"}} src={src} />;
        var _content = <img src={src} style={{"width":"40px","height":"40px","borderRadius":"2px"}} />;
        return <Popover content={content} title={title || ""}>
            {_content}
        </Popover>
    }
}

export class RenderEnabled extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let {flag} = this.props;
        if(flag === true){
            return <div className='btn-icon-round btn-icon-xs btn-success'><i className='fa fa-check'></i></div>
        }
        if(flag === false){
            return <div className='btn-icon-round btn-icon-xs btn-danger'><i className='fa fa-times'></i></div>
        }
    }
}

export class RenderTooltip extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let { title,cutTextCount } = this.props;
        if(!title) return "";
        cutTextCount = cutTextCount || 20;
        var _title = title.length > cutTextCount ? title.substr(0,cutTextCount)+"..." : title;
        return <Tooltip title={title}>
            <span>{_title}</span>
        </Tooltip>
    }
}

export class Explanation extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let { word,style } = this.props;
        let styles = {cursor:"default",...style}
        return <Tooltip title={word}>
            <i className="fa fa-info-circle" style={styles}></i>
        </Tooltip>
    }
}

export class Counter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { value, onIncreaseClick } = this.props;
        return (
            <div>
                <span>{value}</span>
                <button onClick={onIncreaseClick}>Increase</button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        value: state.counter.count
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        onIncreaseClick: () => dispatch({
            type:"increase"
        })
    }
}

// Connected Component
export const Countering = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)


