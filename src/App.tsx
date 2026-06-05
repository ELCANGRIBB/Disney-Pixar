import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import UnderConstruction from './pages/UnderConstruction';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/recargar" element={<UnderConstruction />} />
        <Route path="/retiros" element={<UnderConstruction />} />
        <Route path="/historial-recargas" element={<UnderConstruction />} />
        <Route path="/historial-retiros" element={<UnderConstruction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
