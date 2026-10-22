import React, { useEffect, useState } from 'react'
import NavBar from './navBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user)
  const [checking, setChecking] = useState(!userData)

  useEffect(() => {
    if (userData) return

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/view`, { withCredentials: true })
        dispatch(addUser(res.data))
      } catch (error) {
        if (error.response?.status === 401) navigate('/login')
        else console.error('Error fetching user:', error)
      } finally {
        setChecking(false)
      }
    }

    fetchUser()
  }, [])

  if (checking) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}
export default Body