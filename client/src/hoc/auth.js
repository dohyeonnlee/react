import { Axios } from 'axios';
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action' 

export default function (SpecificComponent, option, adminRout = null) {
// option - 
// null: 아무나 출입가능한 페이지 , 
// true: 로그인한 유저만 출인 가능, 
// false: 로그인한 유저 출입 불가능
    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => { //백엔드에서 처리한 데이터 response에
                console.log(response)
                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option) {
                        props.history.push('/login')
                    }
                } else { //로그인 한 상태
                    if(adminRout && !response.isAdmin){
                        props.history.push('/')
                    } else { //로그인한 유저가 로그인,회원가입 들어가려고할때
                        if(option === false)
                        props.history.push('/')
                    }
                }
            })


        }, [])

        return (
            <SpecificComponent {...props} />
        )
    }

    return AuthenticationCheck
}