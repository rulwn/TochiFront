import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Nav from './components/Nav/Navbar'

function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
