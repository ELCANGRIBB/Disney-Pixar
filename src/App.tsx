import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Inicio from './pages/Inicio';
import Niveles from './pages/Niveles';
import Tareas from './pages/Tareas';
import Equipo from './pages/Equipo';
import Recargar from './pages/Recargar';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/niveles" element={<Niveles />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/recargar" element={<Recargar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
