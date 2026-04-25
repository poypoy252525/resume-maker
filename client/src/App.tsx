import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NewResume from './pages/NewResume'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resumes/new" element={<NewResume />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
