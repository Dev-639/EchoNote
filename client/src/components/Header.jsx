import { Navbar, TextInput, Button, Dropdown, Avatar } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { signOutSuccess } from '../redux/user/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'

export default function Header() {
    const navigate=useNavigate();
    const path=useLocation().pathname;
    const location=useLocation();
    const dispatch=useDispatch();
    const { currentUser }= useSelector((state)=> state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] =useState('');

    console.log(searchTerm);
    

    useEffect(() => {
        
        const urlParams=new URLSearchParams(location.search);
        const searchTermFromUrl= urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }

    }, [location.search])
    

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

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='text-white px-2 py-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-500 rounded-lg'>
                    EchoNote
                </span>
            </Link>
            <form onSubmit={handleSubmit} >
                <TextInput type='text' placeholder='Search' rightIcon={AiOutlineSearch} className='hidden lg:inline' onChange={(e)=>setSearchTerm(e.target.value)} />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-4 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheme())}>
                    {theme==='light' ? <FaMoon/> : <FaSun/>}
                </Button>
                {currentUser ? (
                    <Dropdown 
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar 
                        alt='user'
                        img={currentUser.profilePicture}
                        rounded
                        />
                    }>
                    <Dropdown.Header>
                    <span className='block text-sm'>@{currentUser.username}</span>
                    <span className='block text-sm font-medium truncate'>@{currentUser.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider/>
                    <Link to="/Signin">
                        <Dropdown.Item onClick={handleSignout} >Sign out</Dropdown.Item>
                    </Link>
                    </Dropdown.Header>

                    </Dropdown>
                ) : (
                    <Link to="/Signin">
                    <Button gradientDuoTone='tealToLime'>
                    Sign In
                    </Button>
                    </Link>
                )}
                    <Navbar.Toggle />
                    </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
        </Navbar>
    )
}
