import { Button, Textarea } from 'flowbite-react';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);

  };

  const handleSave=async()=>{
    try {
        const res=await fetch(`/api/comment//editComment/${comment._id}`,{
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: editedContent
            })
        });
        if(res.ok){
            setIsEditing(false);
            onEdit(comment, editedContent);
        }
    } catch (error) {
        console.log(error.message);
        
    }
  }


  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture || '/default-avatar.png'}
          alt={user?.username || 'anonymous'}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
            <>
          <Textarea 
            className="w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className='flex justify-end gap-2 text-xs' >
            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' 
            onClick={handleSave}
            >Save</Button>
            <Button 
            onClick={()=> setIsEditing(false)}
            outline type='button' size='sm' gradientDuoTone='purpleToBlue' >Cancel</Button>
          </div>    
          </>
        ) : (
          <p className="text-gray-500 pb-2 dark:text-white">{comment.content}</p>
        )}

        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`hover:text-blue-500 ${currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
            }`}
          >
            <FaThumbsUp className="text-sm" />
          </button>

          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              `${comment.numberOfLikes} ${
                comment.numberOfLikes === 1 ? 'Like' : 'Likes'
              }`}
          </p>

          {currentUser &&
            (currentUser._id === comment.userId || currentUser.isAdmin) && (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-blue-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(comment._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}