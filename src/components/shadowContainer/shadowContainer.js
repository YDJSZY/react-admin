import React from 'react';
import './style.css';

export default class ShadowContainer extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        let children = this.props.children;
        return <div className='shadow-container'>
            {children.map((c)=>{
                if(c.type === 'span') return null;
                return c;
            })}
            <div className='shadow' onClick={(e)=>{e.stopPropagation()}}>
                {children.map((c)=>{
                    if(c.type === 'span') return c;
                    return null;
                })}
            </div>
        </div>
    }
}