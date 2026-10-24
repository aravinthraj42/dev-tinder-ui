import { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'

const initialForm = {
  firstName: '',
  lastName: '',
  gender: '',
  phoneNumber: '',
  age: '',
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [isNewUser, setIsNewUser] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialForm)

  // Set to true right before we dispatch, so the guard below
  // doesn't hijack the navigation we do in the handlers.
  const justAuthenticated = useRef(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleModeToggle = () => {
    setIsNewUser((prev) => !prev)
    setError(null)
    setFormData((prev) => ({ ...prev, password: '' }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      )
      justAuthenticated.current = true
      dispatch(addUser(response.data.user))
      navigate('/', { replace: true })
    } catch (err) {
      justAuthenticated.current = false
      if (err.response?.status === 401) {
        setError('Invalid credentials')
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        { ...formData, age: Number(formData.age) },
        { withCredentials: true }
      )
      justAuthenticated.current = true
      dispatch(addUser(response.data.user))
      navigate('/profile', { replace: true })
    } catch (err) {
      justAuthenticated.current = false
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Already logged in and just visiting /login -> send home.
  // Skipped right after login/signup so the handlers control the destination.
  if (user && !justAuthenticated.current) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300/60">
        {/* Header */}
        <div className="px-8 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-content shadow-lg">
            💻
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Dev <span className="text-primary">Tinder</span>
          </h1>

          <p className="mt-2 text-sm text-base-content/60">
            {isNewUser
              ? 'Create your account and connect with developers.'
              : 'Welcome back! Sign in to continue.'}
          </p>
        </div>

        <form className="card-body gap-4" onSubmit={isNewUser ? handleSignup : handleLogin}>
          {error && (
            <div role="alert" className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          {/* Signup fields */}
          {isNewUser && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    name="firstName"
                    className="input w-full focus:input-primary"
                    placeholder="First name"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    name="lastName"
                    className="input w-full focus:input-primary"
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                <select
                  name="gender"
                  className="select w-full focus:select-primary"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </fieldset>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone Number</legend>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="input w-full focus:input-primary"
                    placeholder="10-digit number"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                    required
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    type="number"
                    name="age"
                    className="input w-full focus:input-primary"
                    placeholder="Your age"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </fieldset>
              </div>
            </>
          )}

          {/* Email */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Address</legend>
            <input
              type="email"
              name="email"
              className="input w-full focus:input-primary"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              name="password"
              className="input w-full focus:input-primary"
              placeholder="Enter your password"
              autoComplete={isNewUser ? 'new-password' : 'current-password'}
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
            {isNewUser && (
              <p className="mt-1 text-xs text-base-content/50">Use at least 8 characters.</p>
            )}
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary mt-3 w-full text-base shadow-md transition-transform hover:scale-[1.01]"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                {isNewUser ? 'Creating account...' : 'Signing in...'}
              </>
            ) : isNewUser ? (
              'Create Account'
            ) : (
              'Login'
            )}
          </button>

          {/* Toggle mode */}
          <div className="divider text-xs text-base-content/40">OR</div>

          <p className="text-center text-sm text-base-content/70">
            {isNewUser ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={handleModeToggle}
              className="btn btn-link btn-sm ml-1 px-1 text-primary no-underline hover:underline"
            >
              {isNewUser ? 'Login' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login