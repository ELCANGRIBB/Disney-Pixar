import { useState } from 'react';
import { Copy, Check, Home, Zap, Play, Users, User } from 'lucide-react';

export default function Perfil() {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  const userId = '3207408336';
  const phoneNumber = '3207408336';
  const invitationLink = 'https://myyaguar.pro/user/register?ref=MTkxNT...';
  const appName = 'MyYaguar';

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#000000' }}>
      <div className="relative z-10 px-4 pt-6">
        {/* Content Area */}
        <div>
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(15,15,15,0.6) 100%)',
                  border: '1px solid rgba(255,193,7,0.15)',
                }}
              >
                <div className="text-xs font-semibold mb-2" style={{ color: '#888888' }}>
                  INFORMACIÓN DEL PERFIL
                </div>
                <div className="text-sm text-white">
                  Bienvenido a {appName}. Tu ID de usuario es: <span style={{ color: '#FFC107' }}>{userId}</span>
                </div>
              </div>
            </div>
          )}
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
          isActive={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        />

        {/* Levels */}
        <NavItem
          icon={<Zap size={24} />}
          label="Niveles"
          isActive={activeTab === 'levels'}
          onClick={() => setActiveTab('levels')}
        />

        {/* Tasks - Center Active Button */}
        <div className="flex flex-col items-center gap-1 relative">
          <button
            onClick={() => setActiveTab('tasks')}
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
            style={{ color: activeTab === 'tasks' ? '#FFC107' : '#999999' }}
          >
            Tareas
          </span>
        </div>

        {/* Team */}
        <NavItem
          icon={<Users size={24} />}
          label="Equipo"
          isActive={activeTab === 'team'}
          onClick={() => setActiveTab('team')}
        />

        {/* Profile */}
        <NavItem
          icon={<User size={24} />}
          label="Yo"
          isActive={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
      </nav>
    </div>
  );
}

function NavItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
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
