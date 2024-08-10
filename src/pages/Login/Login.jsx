import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import {signup,login,resetPass} from '../../config/firebase'


const Login = () => {

  const [currentState, setCurrentState] = useState("Sign up")
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')
  

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(currentState === 'Sign up') {
      signup(userName,email,password)
    } 
   else{
      login(email,password)
    }
  }


  return (
    <div className='login'>
      <img className='logo' src={assets.fk} alt="logo" />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currentState}</h2>
        {currentState === "Sign up" ? <input onChange={(e) =>setUserName(e.target.value)} value={userName}  type="text" placeholder='username' required className="form-input" /> : null }
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='email' required className="form-input" />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='password' required className="form-input" />
        <button type='submit'>{currentState === "Sign up" ? "Create Account" : "Login now"}</button>
        
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        
        <div className="login-forgot">
          {
            currentState === "Sign up" 
            ?   <p className="login-toggle">Already have an account. <span onClick={() => setCurrentState("Login")}>Login here. </span> </p>
            :   <p className="login-toggle">Create  an account. <span onClick={() => setCurrentState("Sign up")}>Click here.</span> </p>
          }
          {
            currentState === 'Login' ? <p className="login-toggle">Forgot Password? . <span onClick={() => resetPass(email)("Sign up")}>Reset here.</span> </p>
                                     : null
          }
        
        
        </div>
      </form>
    </div>
  )
}

export default Login