import * as actionsTypes from './types';

/* user actions */
export const setUser = user => {
    return {
        type: actionsTypes.SET_USER,
        payload: {
            currentUser: user
        }

    }
}

export const clearUser = () => {
    return {
        type: actionsTypes.CLEAR_USER,
        
    }
}


/* channel actions*/

export const setCurrentChannel = (channel) => {
    return {
        type: actionsTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}