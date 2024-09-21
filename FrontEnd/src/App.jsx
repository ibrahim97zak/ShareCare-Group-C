import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import ProfileDetails from './components/ProfileDetails'

const routes =(
  <Router>
  <Routes>
    <Route path="/signUp" element={<RegisterForm />} />
    <Route path='login' element={<LoginForm />} />
    <Route path='/ProfileDetails'element={<ProfileDetails />} />
  </Routes>
</Router>
)
const App = ()=> {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
