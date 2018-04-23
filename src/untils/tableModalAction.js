/**
 * Created by luwenwei on 17/11/4.
 */
import ReactDOM from "react-dom";
export default class TableModalAction{
    constructor(modal,saveFormCallBack) {
        this.modal = modal;
        this.modalElement = ReactDOM.findDOMNode(modal);
        this.modal.saveFormCallBack = saveFormCallBack
    }
    
    create() {
        var record = this.beforeCreate();
        this.modal.open(record,"create",this.modalElement);
    }

    beforeCreate() {
        return {};
    }

    edit(record) {
        var record = this.beforeEdit(record);
        this.modal.open(record,"edit",this.modalElement);
    }

    beforeEdit(record) {
        return record;
    }
}