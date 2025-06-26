import { useEffect, useRef, useState } from 'react'
import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/user/userSlice';
import { Alert } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch=useDispatch();
  const [imageFile, setImageFile] =useState(null);
  const [imageFileUrl, setImageFileUrl] =useState(null);
  const [imageFileUploadSuccess, setImageFileUploadSucess]= useState(false);
  const[updateUserSuccess, setUpdateUserSuccess]= useState(null);
  const[updateUserError, setUpdateUserError]= useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress]= useState(null);
  const[ showModal, setShowModal]=useState(null);
  const[formData, setFormData]=useState({});
  const filePickerReference=useRef();


  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);


  const uploadImage= async()=>{
    setImageFileUploadSucess(true);
    console.log("Uploading.... image")
    if(!imageFile) return;
    const data=new FormData();
    data.append("file",imageFile);
    data.append("upload_preset", "first_upload_on_cloudinary");
    data.append("cloud_name","dzyvsskmr");
    const res= await fetch(`https://api.cloudinary.com/v1_1/dzyvsskmr/image/upload`,{
      method: "POST",
      body: data
    })
    const uploadedImageUrl=await res.json();
    const imageUrl = uploadedImageUrl.secure_url;
    console.log(uploadedImageUrl);
    setImageFileUploadSucess(false);
    setFormData({...formData, profilePicture :imageUrl});
  }


  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if(imageFileUploadSuccess) return;
    if(Object.keys(formData).length===0){
      return;
    }
    try {
      dispatch(updateStart());
      const token = currentUser.token;
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
        },
        credentials :'include',
        body: JSON.stringify(formData),
      });
      const data=await res.json();
      console.log(data);
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's Profile Updated Successfully.");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }


  const handleDeleteUser=async()=>{
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res= await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data=await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
     dispatch(deleteUserFailure(error.message)); 
    }
  }

  const handleSignout=async()=>{
    try{
      const res=await fetch('/api/user/signout',{
        method:'POST',   
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signOutSuccess());
      }
    }
    catch(error){
      console.log(error.message);
    }
  }


  return (
    <div className="w-full flex justify-center p-3">
  <div className="w-full max-w-sm">
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerReference} hidden />
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>{filePickerReference.current.click()}}>
        <img
          src={imageFileUrl || currentUser.profilePicture}
          alt='user'
          className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
        />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email' 
          defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
        <Button type='submit' gradientDuoTone='cyanToBlue' outline disabled={loading || imageFileUploadSuccess}>
            {loading ?'Loading...':'Update'}
        </Button>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
            <Button tyoe='button' gradientDuoTone='cyanToBlue' className='w-full'>
              Create a post
            </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer' onClick={()=>{setShowModal(true)}}>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={()=>{setShowModal(false)}} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Arey you sure you want to delete your account?
          </h3>
          <div className='flex justify-center gap-4'>
          <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure.</Button>    
          <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
          </div>
        </div>
        </Modal.Body>
      </Modal>
    </div>
    </div>
  )
}
