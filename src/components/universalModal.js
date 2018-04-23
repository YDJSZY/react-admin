import React from 'react';

export default class UniversalModal extends React.Component{
    constructor(props) {
        super(props)
    }

    show() {
        $(this.$modal).modal("show")
    }

    confirmAction = ()=> {
        let res = this.props.confirmAction();
        if(res) $(this.$modal).modal("hide")
    }

    render() {
        let {dismissText,confirmText,modalTitle,size} = this.props;
        return <div className="modal fade" ref={(ref) => { this.$modal = ref; }} data-backdrop="static" data-effect="zoom" data-tabindex="-1" data-role="dialog">
            <div className={"modal-dialog modal-" + size}>
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" data-aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">{modalTitle}</h4>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <span className="pull-right">
                            <button type="button" className="btn btn-warning" data-dismiss="modal">{dismissText}</button>
                            <button type="button" className="btn btn-success" onClick={this.confirmAction}>{confirmText}</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    }
}

UniversalModal.defaultProps = {
    modalTitle:'标题',
    dismissText:'取消',
    confirmText:'保存',
    size:'md'
}