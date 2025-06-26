import React, { useState } from 'react'
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import OAuth  from '../components/OAuth';

export default function Signin() {
  const [formData, setFormData]=useState({});
  const {loading, error:errorMessage}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleChange=(e)=>{ 
    setFormData({...formData, [e.target.id]: e.target.value.trim() });
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password ){
      return dispatch(signInFailure("Please fill out all the fields"));
    }
    try {
      dispatch(signInStart());
      const res=await fetch('/api/auth/signin' ,{
        method :'POST',
        headers :{'Content-Type': 'application/json'},
        credentials: 'include',
        body :JSON.stringify(formData),
      })
      const data=await res.json();
      console.log(res.ok);
      if(!data.success){
        return dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data.user));
        navigate('/');
      }
    } catch (error) {         
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row p-3 max-w-3xl mx-auto gap-5'>
        {/* left */}
        <div className='flex-1 mt-20'>
          <Link to="/" className='font-bold dark:text-white text-5xl'>
            <span className='px-2 py-1 text-white bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-500 rounded-lg'>
              EchoNote
            </span>
          </Link>
          <p className='text-sm mt-5'>✨ EchoNote – Where every voice finds its story. Share, explore, and connect through seamless blogging.</p>
        </div>
        {/* Right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              
              <div>
              <Label value='Your Email' />
                <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
              </div>

              <div>
              <Label value='Your Password' />
                <TextInput type='password' placeholder='**********' id='password' onChange={handleChange}/>
              </div>
              <Button gradientDuoTone='tealToLime' type='submit' disabled={loading}>
                {
                loading?(
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>
                ):'Log in'
                }
              </Button>
              <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
          <span>Don't have an account?</span>
          <Link to="/signup" className='text-blue-400'>
            Sign Up
          </Link>
          </div>
          {
            errorMessage&&(
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>)
          }
        </div>
      </div>
    </div>
  )
}
