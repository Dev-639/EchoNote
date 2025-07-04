import React from 'react'
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export default function OAuth() {
    const auth=getAuth(app);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleGoogleClick=async(e)=>{
        const provider=new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account'})
        try {
            const resultsFromGoogle=await signInWithPopup(auth, provider);
            const res=await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.imageUrl,
                }),                
            })
            const data=await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Button type='button' gradientDuoTone='tealToLime' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
