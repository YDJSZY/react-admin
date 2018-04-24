import React from 'react';

function tableActionHOC (WrappedComponent) {
    return class NewComponent extends WrappedComponent {
        test = () => {
            alert(9)
        }

        componentDidMount () {
            console.log(1)
        }

        render() {
            return <WrappedComponent {...this.props} test={this.test} />;
        }
    };
}

export default tableActionHOC;