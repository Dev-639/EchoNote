import React, { useState } from 'react'
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function Signup() {
  const navigate=useNavigate();
  const [formData, setFormData]=useState({});
  const [loading, setLoading]=useState(false);
  const [error, setError] =useState(null);
  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim() });
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password ){
      return setError("Please fill out all the fields");
    }
    setLoading(true);
    setError(null);
    try { 
      const res=await fetch('/api/auth/signup' ,{
        method :'POST',
        headers :{'Content-Type': 'application/json'},
        body :JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success===false){
        setLoading(false);
        return setError(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/signin');
      }
    } catch (error) { 
      setLoading(false);
      console.log('Response:', error.message);
      return setError(error.message);
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row p-3 max-w-3xl mx-auto gap-5'>
        {/* left */}
        <div className='flex-1 mt-20'>
          <Link to="/" className='font-bold dark:text-white text-5xl'>
            <span className='px-2 py-1 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
              Dev's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>This is a demo website. You can Sign Up through Email and Password or through Google.</p>
        </div>
        {/* Right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
              <Label value='Your Username' />
                <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
              </div>

              <div>
              <Label value='Your Email' />
                <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
              </div>

              <div>
              <Label value='Your Password' />
                <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
              </div>
              <Button gradientDuoTone='tealToLime' type='submit' disabled={loading}>
                {
                loading?(
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>
                ):'Sign Up'
                }
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
          <span>Have an account?</span>
          <Link to="/signin" className='text-blue-400'>
            Sign In
          </Link>
          </div>
          {
            error&&(
            <Alert className='mt-5' color='failure'>
              {error}
            </Alert>)
          }
        </div>
      </div>
    </div>
  )
}
