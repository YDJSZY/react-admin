import { combineReducers } from 'redux';

function todos(state = {}, action) {
    switch (action.type) {
        case 'AGE':
            return Object.assign({}, state, {age:action.text})
        default:
            return state
    }
}

function dodos(state = {}, action) {
    switch (action.type) {
        case 'USERNAME':
            return Object.assign({}, state, {username:action.text})
        default:
            return state
    }
}

function counter(state = { count: 0 }, action) {
    const count = state.count;
    switch (action.type) {
        case 'increase':
            return { count: count + 1 }
        default:
            return state
    }
}
const todoApp = combineReducers({
    dodos,
    todos,
    counter
})

export default todoApp