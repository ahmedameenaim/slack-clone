import {combineReducers} from 'redux'
import * as actionsTypes from '../actions/types';


const initialUserState = {
    currentUser: null,
    isLoading: true
}
/* user reducer */
const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionsTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionsTypes.CLEAR_USER:
          return {
              ...state,
              isLoading: false
          }    
        default:
            return state;
    }
}


const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false
}

/* channel reducer */
const channel_reducer = (state = initialChannelState , action) => {
    switch(action.type) {
        case actionsTypes.SET_CURRENT_CHANNEL:
        return {
            ...state,
            currentChannel: action.payload.currentChannel
        }
        case actionsTypes.SET_PRIVATE_CHANNEL:
         return {
             ...state,
             isPrivateChannel: action.payload.isPrivateChannel
         }
        default:
         return state;

    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer
});

export default rootReducer;