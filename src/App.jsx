import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Request from './components/Request'
import { Provider } from 'react-redux'
import appStore from './utils/appstore'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import Settings from './components/Settings'
import Connections from './components/Connections'
import Feed from './components/Feed'

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
         
          <Route path="/" element={<Body />}>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
            
          
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/request" element={<Request />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App