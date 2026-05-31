import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export default function Recargar() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#000000' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/niveles')}
        className="absolute top-6 left-6 flex items-center gap-2 transition-all duration-300 hover:opacity-70"
        style={{ color: '#FFC107' }}
      >
        <ArrowLeft size={24} />
        <span className="text-sm font-semibold">Volver</span>
      </button>

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
          Recargar
        </h1>

        <p className="text-sm mb-8" style={{ color: '#888888' }}>
          Esta pagina esta en construccion
        </p>

        {/* Decorative Element */}
        <div
          className="rounded-2xl p-6 max-w-sm mx-auto"
          style={{
            background: '#1A1A1A',
            border: '1px solid rgba(255,193,7,0.2)',
            boxShadow: '0 0 30px rgba(255,193,7,0.08)',
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>
            Estamos trabajando para traerte la mejor experiencia de recarga.
            Muy pronto podras realizar recargas de forma segura y rapida.
          </p>
        </div>
      </div>
    </div>
  );
}
