import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate } from 'react-router-dom';

export default function PostCreate() {
const [imageFileUploadSuccess, setImageFileUploadSucess]= useState(false);
const [imageUploadError, setImageUploadError] = useState(null);
const [file, setFile] = useState(null);
const [formData, setFormData] = useState({});
const navigate=useNavigate();
const [publishError, setPublishError] = useState(null);
const uploadImage= async()=>{
  setImageFileUploadSucess(true);
  setImageUploadError(false); 
  console.log("Uploading.... image");
    try {
        if(!file){
          setImageUploadError("Please select an image..");
          setImageFileUploadSucess(false);
          return;
        }
        const data=new FormData();
        data.append("file",file);
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
        setFormData({...formData, image :imageUrl});
        
    } catch (error) {
      setImageUploadError("Error occured while uploading image.")
    }
    
} 
    const handleSubmit=async(e)=>{
      e.preventDefault();
      try {
        const res=await fetch('/api/post/create',{
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data=await res.json();
        if(!res.ok){
          setPublishError(data.message);
          return;
        }
        if(res.ok){
          setPublishError(null);
          navigate(`/post/${data.slug}`);
        }
        
      } catch (error) {
        setPublishError("Something went wrong.");
      }

    }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={uploadImage}
            disabled={imageFileUploadSuccess}
          >
            Upload
          </Button> 
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-20 object-contain'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  )
}
