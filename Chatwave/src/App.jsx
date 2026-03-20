import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Navbar from "./componants/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ChatPage from "./pages/Chat"

function App() {

const token = localStorage.getItem("token")

return (

<Router>

<Navbar/>   

<Routes>

<Route path="/" element={ token ? <ChatPage/> : <Navigate to="/login"/> } />
<Route path="/login" element={<Login/>} />
<Route path="/signup" element={<Signup/>} />
<Route path="/chat" element={ token ? <ChatPage/> : <Navigate to="/login"/> } />

</Routes>

</Router>

)

}

export default App