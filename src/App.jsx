import { useState } from 'react'
import './App.css'
import Gallery from './components/Gallery'

function App() {
    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <span className="nav-logo">Mi Sitio</span>
                    <div className="nav-links">
                        <a href="#header">Inicio</a>
                        <a href="#gallery">Galería</a>
                    </div>
                </div>
            </nav>

            <div id="header" style={{ paddingTop: '80px' }}>
                <h1>Vite + React - Galería</h1>
            </div>

            {/* Gallery Component Integration */}
            <Gallery />
            <p className="read-the-docs">
                Click a las imágenes para agrandarlas
            </p>
        </>
    )
}

export default App
