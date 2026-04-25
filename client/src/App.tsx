import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import BuilderLayout from './layouts/BuilderLayout'
import Home from './pages/Home'
import NewResume from './pages/NewResume'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Marketing/Public Routes */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        
        {/* App/Builder Workspace Routes */}
        <Route 
          path="/resumes/new" 
          element={
            <BuilderLayout>
              <NewResume />
            </BuilderLayout>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
