
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'



const Login = () => {
const navigate = useNavigate()
const [email, setEmail] = useState("aravinthraj42@gmail.com")
const [password, setPassword] = useState("Aravinth@1234#") 
const [error, setError] = useState(null)
const dispatch = useDispatch()

const handlelogin =async () =>{
    try{
        const payload = {
            email,
            password
        }
     const response = await axios.post(`${API_BASE_URL}/login`, payload, { withCredentials: true })
     if(response.data.status === 200){
        // const token = response.data.token;
        // cookieStore.set({ name: 'token', value: token, path: '/' });
       dispatch(addUser(response.data.user))
       navigate("/")
     }else{
        setError("Invalid Credentials")
         console.log("Login failed", response.data)
     }
    }catch(err){
        setError("An error occurred during login")
        console.log("An error occurred during login:", err.message)
    }
}
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card bg-base-100 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Dev Tinder Login</h2>
                    <p className="text-red-500">{error}</p>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Email</legend>
                        <input type="text" className="input" placeholder="Enter Your Email here" 
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                        />

                        <legend className="fieldset-legend">Password </legend>
                        <input type="password" className="input" placeholder="Enter Your Password here"
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                        />

                    </fieldset>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary" onClick={handlelogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
