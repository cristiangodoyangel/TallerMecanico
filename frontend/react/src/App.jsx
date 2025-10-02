import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import Dashboard from './pages/Dashboard';
import NuevaOrden from './pages/NuevaOrden';
import ListaOrdenes from './pages/ListaOrdenes';
import Busqueda from './pages/Busqueda';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nueva-orden" element={<NuevaOrden />} />
            <Route path="/ordenes" element={<ListaOrdenes />} />
            <Route path="/buscar" element={<Busqueda />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
