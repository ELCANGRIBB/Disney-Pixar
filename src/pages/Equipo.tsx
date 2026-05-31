import { Construction } from 'lucide-react';

export default function Equipo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#000000' }}>
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,193,7,0.2) 0%, rgba(255,215,0,0.1) 100%)',
              border: '2px solid rgba(255,193,7,0.3)',
            }}
          >
            <Construction size={40} style={{ color: '#FFC107' }} />
          </div>
        </div>
        <h1
          className="font-black text-3xl mb-3"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 40%, #B8860B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Equipo
        </h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Esta pagina esta en construccion
        </p>
      </div>
    </div>
  );
}
