import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  LogOut,
  Star,
  Zap,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const PLANS = [
  { id: 1, name: 'Inicial', price: 50000, daily: 2500, duration: 30, color: '#888888', popular: false },
  { id: 2, name: 'Pro', price: 200000, daily: 12000, duration: 30, color: '#FFC107', popular: true },
  { id: 3, name: 'Elite', price: 500000, daily: 35000, duration: 30, color: '#FFD700', popular: false },
  { id: 4, name: 'VIP', price: 1500000, daily: 120000, duration: 30, color: '#B8860B', popular: false },
];

const TRANSACTIONS = [
  { type: 'income', label: 'Ganancia diaria', amount: 12000, date: 'Hoy, 8:00 AM' },
  { type: 'income', label: 'Bono de referido', amount: 5000, date: 'Ayer, 3:15 PM' },
  { type: 'income', label: 'Ganancia diaria', amount: 12000, date: '20 May, 8:00 AM' },
  { type: 'withdraw', label: 'Retiro Nequi', amount: 50000, date: '18 May, 6:30 PM' },
  { type: 'income', label: 'Ganancia diaria', amount: 12000, date: '18 May, 8:00 AM' },
];

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Perfil() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'inicio' | 'planes' | 'referidos' | 'historial'>('inicio');
  const [copied, setCopied] = useState(false);
  const referralCode = 'VIP-DISNEY-2026';
  const referralLink = `https://disneyinvierte.com/r/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#000000' }}>
      <div
        className="fixed pointer-events-none z-0"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 70%)',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-4"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,193,7,0.1)',
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: '#FFC107' }} />
          <span
            className="font-black text-sm tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFC107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Disney &amp; Pixar
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: 'rgba(255,193,7,0.08)',
            border: '1px solid rgba(255,193,7,0.2)',
            color: '#888888',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FFC107'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888888'; }}
        >
          <LogOut size={13} />
          Salir
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28">

        {/* Balance Card */}
        <div
          className="mt-6 rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)',
            border: '1px solid rgba(255,193,7,0.25)',
            boxShadow: '0 0 40px rgba(255,193,7,0.1)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top right, rgba(255,193,7,0.06) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={12} style={{ color: '#FFC107' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#888888' }}>
                Saldo disponible
              </span>
            </div>
            <div
              className="font-black leading-none mb-4"
              style={{
                fontSize: 'clamp(2rem, 10vw, 3rem)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #B8860B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              $124.000
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <TrendingUp size={14} />, label: 'Ganancia hoy', value: '$12.000' },
                { icon: <DollarSign size={14} />, label: 'Total ganado', value: '$248.000' },
                { icon: <Users size={14} />, label: 'Referidos', value: '3' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 p-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,193,7,0.1)' }}
                >
                  <span style={{ color: '#FFC107' }}>{stat.icon}</span>
                  <span className="font-bold text-sm text-white">{stat.value}</span>
                  <span className="text-xs leading-tight" style={{ color: '#666666' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ActionButton icon={<ArrowUpRight size={18} />} label="Depositar" />
          <ActionButton icon={<ArrowDownLeft size={18} />} label="Retirar" />
        </div>

        {/* Nav Tabs */}
        <div
          className="flex mt-6 rounded-2xl p-1 gap-1"
          style={{ background: '#1A1A1A', border: '1px solid rgba(255,193,7,0.1)' }}
        >
          {(['inicio', 'planes', 'referidos', 'historial'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200"
              style={{
                background: tab === t ? '#FFC107' : 'transparent',
                color: tab === t ? '#000000' : '#888888',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tab === 'inicio' && <TabInicio />}
          {tab === 'planes' && <TabPlanes />}
          {tab === 'referidos' && (
            <TabReferidos copied={copied} onCopy={handleCopy} referralCode={referralCode} />
          )}
          {tab === 'historial' && <TabHistorial />}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,193,7,0.12)',
        }}
      >
        {[
          { icon: <DollarSign size={20} />, label: 'Inicio', id: 'inicio' as const },
          { icon: <Zap size={20} />, label: 'Planes', id: 'planes' as const },
          { icon: <Users size={20} />, label: 'Referidos', id: 'referidos' as const },
          { icon: <TrendingUp size={20} />, label: 'Historial', id: 'historial' as const },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="flex flex-col items-center gap-0.5 transition-all duration-200"
            style={{ color: tab === item.id ? '#FFC107' : '#555555' }}
          >
            {item.icon}
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
      style={{
        background: hovered ? 'rgba(255,193,7,0.15)' : 'rgba(255,193,7,0.08)',
        border: `1px solid ${hovered ? 'rgba(255,193,7,0.5)' : 'rgba(255,193,7,0.2)'}`,
        color: '#FFC107',
        boxShadow: hovered ? '0 0 20px rgba(255,193,7,0.15)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </button>
  );
}

function TabInicio() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,193,7,0.12) 0%, rgba(184,134,11,0.06) 100%)',
          border: '1px solid rgba(255,193,7,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#888888' }}>
              Plan activo
            </div>
            <div className="font-black text-xl" style={{ color: '#FFC107' }}>Pro</div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107' }}
          >
            Activo
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs" style={{ color: '#666666' }}>Ganancia diaria</div>
            <div className="font-bold text-white">$12.000 COP</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: '#666666' }}>Dias restantes</div>
            <div className="font-bold text-white">22 dias</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#666666' }}>
            <span>Progreso</span>
            <span>8/30 dias</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '27%', background: 'linear-gradient(90deg, #FFC107, #FFD700)' }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,193,7,0.1)' }}
      >
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FFC107' }}>
          Avisos
        </div>
        {[
          { icon: <Star size={13} />, text: 'Tu ganancia diaria fue acreditada exitosamente.' },
          { icon: <Users size={13} />, text: 'Un nuevo usuario se unio con tu codigo de referido.' },
          { icon: <Zap size={13} />, text: 'Nuevo plan Elite disponible con mayor rentabilidad.' },
        ].map((n, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}
          >
            <span className="mt-0.5 flex-shrink-0" style={{ color: '#FFC107' }}>{n.icon}</span>
            <span className="text-xs leading-relaxed" style={{ color: '#888888' }}>{n.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabPlanes() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-center mb-1" style={{ color: '#666666' }}>
        Selecciona el plan que mejor se adapte a tu inversion
      </p>
      {PLANS.map((plan) => (
        <button
          key={plan.id}
          onClick={() => setSelected(selected === plan.id ? null : plan.id)}
          className="w-full text-left rounded-2xl p-4 transition-all duration-200"
          style={{
            background: selected === plan.id ? 'rgba(255,193,7,0.08)' : '#1A1A1A',
            border: `1px solid ${selected === plan.id ? 'rgba(255,193,7,0.5)' : 'rgba(255,255,255,0.06)'}`,
            boxShadow: selected === plan.id ? '0 0 20px rgba(255,193,7,0.1)' : 'none',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-base" style={{ color: plan.color }}>{plan.name}</span>
              {plan.popular && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(255,193,7,0.15)', color: '#FFC107' }}
                >
                  Popular
                </span>
              )}
            </div>
            <ChevronRight
              size={16}
              style={{
                color: '#555555',
                transform: selected === plan.id ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs" style={{ color: '#555555' }}>Inversion</div>
              <div className="text-sm font-bold text-white">{formatCOP(plan.price)}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#555555' }}>Diario</div>
              <div className="text-sm font-bold" style={{ color: '#FFC107' }}>{formatCOP(plan.daily)}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#555555' }}>Duracion</div>
              <div className="text-sm font-bold text-white">{plan.duration} dias</div>
            </div>
          </div>
          {selected === plan.id && (
            <button
              className="mt-4 w-full py-3 rounded-xl font-extrabold text-sm transition-all duration-200 active:scale-95"
              style={{ background: '#FFC107', color: '#000000', boxShadow: '0 4px 20px rgba(255,193,7,0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              Activar Plan {plan.name}
            </button>
          )}
        </button>
      ))}
    </div>
  );
}

function TabReferidos({
  copied,
  onCopy,
  referralCode,
}: {
  copied: boolean;
  onCopy: () => void;
  referralCode: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(184,134,11,0.04) 100%)',
          border: '1px solid rgba(255,193,7,0.25)',
        }}
      >
        <div className="text-center mb-4">
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#888888' }}>
            Tu codigo de referido
          </div>
          <div
            className="font-black text-xl tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFC107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {referralCode}
          </div>
        </div>
        <button
          onClick={onCopy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
          style={{
            background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,193,7,0.12)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,193,7,0.3)'}`,
            color: copied ? '#22c55e' : '#FFC107',
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Enlace copiado!' : 'Copiar enlace de referido'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Referidos', value: '3' },
          { label: 'Bono total', value: '$15.000' },
          { label: 'Este mes', value: '$5.000' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-4 rounded-2xl"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,193,7,0.1)' }}
          >
            <span className="font-black text-base" style={{ color: '#FFC107' }}>{s.value}</span>
            <span className="text-xs mt-1" style={{ color: '#666666' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,193,7,0.1)' }}
      >
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FFC107' }}>
          Como funciona
        </div>
        {[
          { step: '1', text: 'Comparte tu enlace con amigos y familiares.' },
          { step: '2', text: 'Ellos se registran e invierten en cualquier plan.' },
          { step: '3', text: 'Tu recibes un bono del 5% sobre su primera inversion.' },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}
          >
            <div
              className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'rgba(255,193,7,0.12)', color: '#FFC107' }}
            >
              {item.step}
            </div>
            <span className="text-xs leading-relaxed" style={{ color: '#888888' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabHistorial() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1A1A1A', border: '1px solid rgba(255,193,7,0.1)' }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FFC107' }}>
          Movimientos recientes
        </span>
      </div>
      {TRANSACTIONS.map((tx, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3.5 border-b last:border-b-0"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              }}
            >
              {tx.type === 'income'
                ? <ArrowUpRight size={16} style={{ color: '#22c55e' }} />
                : <ArrowDownLeft size={16} style={{ color: '#ef4444' }} />}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{tx.label}</div>
              <div className="text-xs" style={{ color: '#555555' }}>{tx.date}</div>
            </div>
          </div>
          <div
            className="font-bold text-sm"
            style={{ color: tx.type === 'income' ? '#22c55e' : '#ef4444' }}
          >
            {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
