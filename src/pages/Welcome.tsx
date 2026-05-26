import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles } from 'lucide-react';

export default function Welcome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 relative">
          <Star
            size={80}
            className="pulse-gold"
            fill="#FFD700"
            style={{ color: '#FFD700', filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))' }}
          />
          <Sparkles
            size={24}
            className="absolute -top-2 -right-2 twinkle"
            style={{ color: '#FFC107' }}
          />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MyYaguar
        </h1>

        <p className="text-gray-400 mb-8 max-w-md">
          Tu plataforma financiera de confianza
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
              color: '#000000',
              boxShadow: '0 0 20px rgba(255, 193, 7, 0.3)',
            }}
          >
            Iniciar Sesion
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
            style={{
              background: 'transparent',
              color: '#FFD700',
              border: '2px solid #FFD700',
            }}
          >
            Registrarse
          </Link>
        </div>

        <Link
          to="/perfil"
          className="mt-8 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
