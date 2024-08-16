import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom';

const Login = (props) => {

    const host = "http://localhost:5000";

    const [credentials, setCredentials] = useState({
        email:"",
        password:""
    })

    let navigate = useNavigate();

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();

        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password})
          });

          const json = await response.json();
          console.log(json);
          if(json.success){
            //Save the auth token an redirect
            localStorage.setItem('token',json.authToken);
            navigate('/');
            props.showAlert("Login Successful","success");
          }
          else{
            props.showAlert(json.error,"danger");
          }
    }

  return (
    <form onSubmit={handleSubmit}>
    <div className="mb-3 row">
    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input type="text" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange}/>
    </div>
  </div>
  <div className="mb-3 row">
    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange}/>
    </div>
  </div>

  <button className="btn btn-primary">Login</button>
    </form>
  )
}

export default Login
