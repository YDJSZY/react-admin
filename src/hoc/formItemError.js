import React from 'react'
let showError = (error) => {
    return <div className="form-error-text">
        <span>{ error }</span>
    </div>
}

let formItemError = (formItem, error) => {
    return (
        <span>
            { formItem }
            { showError(error) }
        </span>
    )
}

export default formItemError