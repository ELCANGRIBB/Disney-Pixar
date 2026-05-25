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
      {/* Background gradient accent */}
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center top, rgba(255,193,7,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-4 pt-6">
        {/* Profile Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,26,0.8) 0%, rgba(15,15,15,0.8) 100%)',
            border: '1px solid rgba(255,193,7,0.2)',
          }}
        >
          {/* Background Image Section */}
          <div className="relative h-40 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
              }}
            />
          </div>

          {/* User ID Circle and Phone - Overlapping */}
          <div className="relative px-6 pb-8">
            {/* Golden Circle with ID - Positioned to overlap background */}
            <div className="flex justify-center -mt-20 mb-4 relative z-20">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255,193,7,0.6), rgba(255,215,0,0.8), rgba(255,193,7,0.6))',
                  boxShadow: '0 0 40px rgba(255,193,7,0.4), inset 0 0 30px rgba(255,193,7,0.2)',
                }}
              >
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ background: '#000000' }}
                >
                  <div className="text-center">
                    <div
                      className="font-black text-2xl leading-tight"
                      style={{ color: '#FFD700' }}
                    >
                      {userId}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span
                className="font-bold text-sm"
                style={{ color: '#FFC107' }}
              >
                {phoneNumber}
              </span>
            </div>

            {/* Invitation Link Section */}
            <div className="space-y-3">
              <div
                className="text-xs font-black text-center tracking-widest"
                style={{ color: '#B8860B' }}
              >
                ENLACE DE INVITACIÓN
              </div>

              {/* Copy Input Container */}
              <div className="flex gap-2">
                <div
                  className="flex-1 flex items-center px-4 py-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,193,7,0.3)',
                  }}
                >
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: '#888888' }}
                  >
                    {invitationLink}
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 flex items-center gap-2 active:scale-95"
                  style={{
                    background: copied
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                    color: copied ? 'white' : '#000000',
                    boxShadow: copied
                      ? '0 0 20px rgba(34,197,94,0.3)'
                      : '0 0 20px rgba(255,193,7,0.3)',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span className="hidden sm:inline">OK</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
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
