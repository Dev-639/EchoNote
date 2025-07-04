import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';


export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUser] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json();
                if (res.ok) {
                    setUser(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUser((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include', 
                
            });
            const data = await res.json();
            if (res.ok) {
                setUser((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowModal(false);
            }
            else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md w-auto'>
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User Image</Table.HeadCell>
                            <Table.HeadCell>User Name</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body className='divide-y' key={user._id}>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                                <img src={user.profilePicture} alt={user.username} className='w-20 h-10 rounded-full object-cover bg-gray-500' />
                            </Table.Cell>
                            <Table.Cell>
                                <Link
                                    className='font-medium text-gray-900 dark:text-white'
                                    to={`/post/${user.slug}`}
                                >
                                    {user.username}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-500' />) : (<FaTimes className='text-red-500' />)}</Table.Cell>
                            <Table.Cell>
                                <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                    setUserIdToDelete(user._id);
                                    setShowModal(true);
                                }}>Delete</span>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                        ))}
                    </Table>
                    {
                        showMore && (
                            <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show More</button>
                        )
                    }
                </>
            ) : (
                <p>You have no posts yet.</p>
            )}
            <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Arey you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure.</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
