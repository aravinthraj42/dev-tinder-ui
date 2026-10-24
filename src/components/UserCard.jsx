
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeFeed } from '../utils/feedSlice'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'    

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    
        const handleSendRequest = async (status, userId) => {
            try{
            const response = await axios.post(`${API_BASE_URL}/request/send/${status}/${userId}`, {}, {withCredentials: true})
            console.log(response)
             dispatch(removeFeed(userId))
            } catch (error) {
                console.error(error)
            }
         }   
    return (
        <div className="card bg-base-300 w-96 shadow-sm">
            <figure>
                <img
                    src={user?.profileUrl}
                    alt="photo" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{user?.firstName} {user?.lastName}</h2>
                <p>{user?.about}</p>
                <div className="card-actions justify-center my-4">
                    <button className="btn btn-primary" onClick={()=>{handleSendRequest('ignored', user._id)}} >Ignore</button>
                    <button className="btn btn-secondary" onClick={()=>{handleSendRequest('interested', user._id)}}>Send Request</button>
                </div>
            </div>
        </div>

    );
}

export default UserCard