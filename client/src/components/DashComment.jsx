    import React, { useEffect, useState } from 'react'
    import { useSelector } from 'react-redux'
    import { Button, Table, Modal } from 'flowbite-react';
    import { Link } from 'react-router-dom';
    import { HiOutlineExclamationCircle } from 'react-icons/hi';
    import { FaCheck, FaTimes } from 'react-icons/fa';


    export default function DashComment() {
        const { currentUser } = useSelector((state) => state.user);
        const [comments, setComments] = useState([]);
        const [showMore, setShowMore] = useState(true);
        const [commentsToDelete, setCommentsToDelete] = useState('');
        const [showModal, setShowModal] = useState(false);
        const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
        useEffect(() => {
            const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);
        useEffect(() => {
            const fetchComments = async () => {
                try {
                    const res = await fetch(`/api/comment/getcomments`)
                    const data = await res.json();
                    if (res.ok) {
                        setComments(data.comments);
                        if (data.comments.length < 9) {
                            setShowMore(false);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            if (currentUser.isAdmin) {
                fetchComments();
            }
        }, [currentUser._id]);
        const handleShowMore = async () => {
            const startIndex = comments.length;
            try {
                const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
                const data = await res.json();
                if (res.ok) {
                    setComments((prev) => [...prev, ...data.comments]);
                    if (data.comments.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        const handleDeleteComment = async () => {
            setShowModal(false);
            try {
                const res = await fetch(`/api/comment/deleteComment/${commentsToDelete}`, {
                    method: 'DELETE',
                    
                });
                const data = await res.json();
                if (res.ok) {
                    setComments((prev) => prev.filter((comment) => comment._id !== commentsToDelete));
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
                {currentUser.isAdmin && comments.length > 0 ? (
                    <div className="overflow-x-auto max-w-6xl mx-auto">
                        <Table hoverable className='shadow-md w-auto'>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment content</Table.HeadCell>
                                <Table.HeadCell>Number of likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {comments.map((comment) => (
                                <Table.Body className='divide-y' key={comment._id}>
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell>
                                    {new Date(comment.updatedAt).toLocaleDateString()}
                                </Table.Cell>
                                <Table.Cell className="max-w-xs break-words whitespace-pre-wrap">
                                    {comment.content}
                                </Table.Cell>
                                <Table.Cell>
                                    {comment.numberOfLikes}
                                </Table.Cell>
                                <Table.Cell>
                                    {comment.postId}
                                </Table.Cell>
                                <Table.Cell>
                                        {comment.userId}
                                </Table.Cell>
                                <Table.Cell>
                                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {
                                        setCommentsToDelete(comment._id);
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
                    </div>
                ) : (
                    <p>You have no comments yet.</p>
                )}
                <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Arey you sure you want to delete this post?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure.</Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
