import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Lock } from 'lucide-react';

export default function Login() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 4,
      size: 4 + Math.random() * 4,
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: 0.005 + Math.random() * 0.01,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.abs(star.opacity)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#000000' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full float-up"
          style={{
            left: `${particle.left}%`,
            bottom: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 193, 7, 0.4) 50%, transparent 100%)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col min-h-screen px-4 py-6">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm">Volver</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-black mb-2"
              style={{ color: '#FFD700' }}
            >
              Bienvenido
            </h1>
            <p className="text-gray-400 text-sm">Inicia sesion en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: '#B8860B' }} />
              <input
                type="tel"
                placeholder="Numero de telefono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: '#B8860B' }} />
              <input
                type="password"
                placeholder="Contrasena"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 193, 7, 0.2)',
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                color: '#000000',
                boxShadow: '0 0 20px rgba(255, 193, 7, 0.3)',
              }}
            >
              Iniciar Sesion
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#FFC107' }}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
