import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function (state ={}, action) {
    switch (action.type) { //다른 타입 받을때마다(LOGIN_USER) 다르게 조치
        case LOGIN_USER: //... ->spread operator 그대로 가져옴
            return { ...state, loginSuccess: action.payload};
            break;

        case REGISTER_USER:
            return {...state, register: action.payload }
            break;
        
        case AUTH_USER:
            return {...state, userData: action.payload }
            break;
    
        default:
            return state;
    }
}