import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { useSelector } from 'react-redux';


export default function DashSidebar() {
    const location=useLocation();
    const [tab, setTab]=useState('');
    const dispatch=useDispatch();
    const {currentUser}=useSelector((state)=>state.user);
    useEffect (()=>{
        const urlParams =new URLSearchParams(location.search)
        const tabFromUrl=urlParams.get('tab')
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    }, [location.search]);
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
    <div>
            <Sidebar className='max-h-screen md:h-screen w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                  {
                    currentUser && currentUser.isAdmin && (
                      <Link to='/darshboard?tab=dash'>
                        <Sidebar.Item active={tab==='dash' || !tab}
                        icon={HiChartPie}
                        as='div'
                        >
                          Dashboard
                        </Sidebar.Item>
                        
                      
                      </Link>
                    )
                  }
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                            as={Link}
                            to="/dashboard?tab=profile"
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={currentUser.isAdmin?'Admin':'User'}
                            labelColor="dark"
                        >
                            Profile
                        </Sidebar.Item>
                        {currentUser.isAdmin && 
                        <Sidebar.Item
                        as={Link}
                        to="/dashboard?tab=posts"
                        active={tab === 'posts'}
                        icon={HiDocumentText}
                        >
                            Post
                        </Sidebar.Item>
                        }

                        {currentUser.isAdmin && 
                        <Sidebar.Item
                        as={Link}
                        to="/dashboard?tab=users"
                        active={tab === 'users'}
                        icon={HiOutlineUserGroup}
                        >
                            Users
                        </Sidebar.Item>
                        }
                        
                        {currentUser.isAdmin && 
                        <Sidebar.Item
                        as={Link}
                        to="/dashboard?tab=comments"
                        active={tab === 'comments'}
                        icon={HiAnnotation}
                        >
                            Comments
                        </Sidebar.Item>
                        }

                    <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignout} className='cursor-pointer'>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    </div>
  )
}
