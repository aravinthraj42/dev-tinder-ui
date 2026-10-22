import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { removeUser } from '../utils/userSlice'

const closeDropdown = () => document.activeElement?.blur()

const NavBar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true })
      dispatch(removeUser())
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="navbar bg-base-200 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Dev Tinder</Link>
      </div>

      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome,</p>
                <p className="font-semibold text-base-content">{user.firstName}</p>
              </div>

              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={user.profileUrl || '/default-avatar.png'}
                  />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" onClick={closeDropdown}>Profile</Link>
              </li>
              <li>
                <Link to="/settings" onClick={closeDropdown}>Settings</Link>
              </li>
              <li>
                <button onClick={() => { closeDropdown(); handleLogout() }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar