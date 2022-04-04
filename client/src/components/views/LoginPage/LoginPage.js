import React, {useState} from 'react'
//import axios from 'axios'
import {useDispatch} from 'react-redux';
import {loginUser } from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';


function LoginPage(props) {
  const dispatch = useDispatch("");
  
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault(); //하지않을경우 submit할때마다 페이지 자체가 새로고침

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body)) //redux사용할경우
     .then(response => {
        if(response.payload.loginSuccess){ //로그인 성공시 '/'root페이지로 이동
          props.history.push('/');   //현재 버전에서는 사용법다름 navigate
        } else{
          alert('Error');
        }
     })

  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
      }}>
        <form style={{ display:'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}
        >
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <br />
          <button type="submit">
            login
          </button>
        </form>

    </div>
  )
}

export default withRouter(LoginPage)