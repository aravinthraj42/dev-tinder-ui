import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

const Profile = () => {
    const user = useSelector((state) => state.user)
  return (
    <div>
      <h1>Profile Page</h1>
      <EditProfile {...user} />
    </div>
  )
}

export default Profile
