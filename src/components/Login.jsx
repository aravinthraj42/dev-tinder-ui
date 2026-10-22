import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      )
      // The effect above handles the redirect once the user is in Redux
      dispatch(addUser(response.data.user))
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials')
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card bg-base-100 w-96 shadow-sm">
        <form className="card-body" onSubmit={handleLogin}>
          <h2 className="card-title">Dev Tinder Login</h2>
          {error && <p className="text-red-500">{error}</p>}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              className="input"
              placeholder="Enter your email here"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input"
              placeholder="Enter your password here"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </fieldset>

          <div className="card-actions justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login