import { useNavigate } from 'react-router-dom';
import { Home, Zap, Play, Users, User } from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24" style={{ background: '#000000' }}>
      <div className="relative z-10 px-4 pt-6">
        {/* Content Area */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1
              className="font-black text-3xl mb-3"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 40%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Perfil
            </h1>
            <p className="text-sm" style={{ color: '#888888' }}>
              Bienvenido a tu perfil
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,193,7,0.1)',
        }}
      >
        {/* Home */}
        <NavItem
          icon={<Home size={24} />}
          label="Inicio"
          onClick={() => navigate('/inicio')}
        />

        {/* Levels */}
        <NavItem
          icon={<Zap size={24} />}
          label="Niveles"
          onClick={() => navigate('/niveles')}
        />

        {/* Tasks - Center Active Button */}
        <div className="flex flex-col items-center gap-1 relative">
          <button
            onClick={() => navigate('/tareas')}
            className="relative flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              marginTop: '-32px',
            }}
          >
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: 'conic-gradient(from 0deg, rgba(255,193,7,0.5), rgba(255,215,0,0.7), rgba(255,193,7,0.5))',
                boxShadow: '0 0 30px rgba(255,193,7,0.4)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#000000' }}
              >
                <Play
                  size={28}
                  fill="#FFC107"
                  style={{ color: '#FFC107' }}
                />
              </div>
            </div>
          </button>
          <span
            className="text-xs font-semibold mt-1"
            style={{ color: '#999999' }}
          >
            Tareas
          </span>
        </div>

        {/* Team */}
        <NavItem
          icon={<Users size={24} />}
          label="Equipo"
          onClick={() => navigate('/equipo')}
        />

        {/* Profile */}
        <NavItem
          icon={<User size={24} />}
          label="Yo"
          onClick={() => navigate('/perfil')}
          isActive
        />
      </nav>
    </div>
  );
}

function NavItem({
  icon,
  label,
  onClick,
  isActive = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition-all duration-200 py-2"
    >
      <div style={{ color: isActive ? '#FFC107' : '#999999' }}>
        {icon}
      </div>
      <span
        className="text-xs font-semibold"
        style={{ color: isActive ? '#FFC107' : '#999999' }}
      >
        {label}
      </span>
    </button>
  );
}
