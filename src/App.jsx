import React from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App
