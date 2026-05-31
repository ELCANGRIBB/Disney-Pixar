import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Play } from 'lucide-react';

interface LevelCardProps {
  title: string;
  badge?: string;
  hierarchy?: string;
  timeCommitment?: string;
  monthlyIncome: string;
  dailyIncome: string;
  yearlyIncome?: string;
  taskPayment?: string;
  dailyTasks: number;
  investment: string;
  isFree?: boolean;
  isLocked?: boolean;
  onAction?: () => void;
}

export default function Niveles() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handlePasantia = () => {
    setSelectedLevel('PASANTÍA');
  };

  const handleRecargar = () => {
    navigate('/recargar');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#000000' }}>
      <div className="relative z-10 px-4 pt-6 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="font-black text-3xl mb-2"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 40%, #B8860B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Niveles
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>
            Elige tu plan y comienza a generar ingresos
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col gap-4 max-w-lg mx-auto">

          {/* CARD 1: PASANTÍA (Green Theme) */}
          <LevelCard
            title="PASANTÍA"
            badge="GRATIS"
            hierarchy="Intern"
            monthlyIncome="$20,000"
            dailyIncome="$5,000"
            taskPayment="$1,000"
            dailyTasks={5}
            investment="¡GRATIS!"
            isFree
            onAction={handlePasantia}
          />

          {/* CARD 2: J1 (Golden Yellow Theme) */}
          <LevelCard
            title="J1"
            timeCommitment="365 días"
            monthlyIncome="$180,000"
            dailyIncome="$6,000"
            yearlyIncome="$2,190,000"
            dailyTasks={5}
            investment="$150,000"
            onAction={handleRecargar}
          />

          {/* CARD 3: J2 (Golden Yellow Theme) */}
          <LevelCard
            title="J2"
            timeCommitment="365 días"
            monthlyIncome="$480,000"
            dailyIncome="$16,000"
            yearlyIncome="$5,840,000"
            dailyTasks={10}
            investment="$480,000"
            onAction={handleRecargar}
          />

          {/* CARD 4: J3 (Golden Yellow Theme) */}
          <LevelCard
            title="J3"
            timeCommitment="365 días"
            monthlyIncome="$1,260,000"
            dailyIncome="$42,000"
            yearlyIncome="$15,330,000"
            dailyTasks={15}
            investment="$1,300,000"
            onAction={handleRecargar}
          />

          {/* CARD 5: J4 (Locked Theme) */}
          <LevelCard
            title="J4"
            timeCommitment="365 días"
            monthlyIncome="$5,040,000"
            dailyIncome="$168,000"
            yearlyIncome="$61,320,000"
            dailyTasks={30}
            investment="$4,700,000"
            isLocked
          />
        </div>

        {/* Selected Level Indicator */}
        {selectedLevel && (
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#888888' }}>
              Nivel seleccionado: <span style={{ color: '#22C55E', fontWeight: 'bold' }}>{selectedLevel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LevelCard({
  title,
  badge,
  hierarchy,
  timeCommitment,
  monthlyIncome,
  dailyIncome,
  yearlyIncome,
  taskPayment,
  dailyTasks,
  investment,
  isFree = false,
  isLocked = false,
  onAction,
}: LevelCardProps) {
  const themeColor = isFree ? '#22C55E' : '#EAB308';
  const glowColor = isFree ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)';

  return (
    <div
      className="rounded-3xl p-5 transition-all duration-300"
      style={{
        background: isLocked ? '#0a0a0a' : '#1A1A1A',
        border: `1px solid ${isLocked ? 'rgba(255,255,255,0.1)' : (isFree ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 179, 8, 0.4)')}`,
        boxShadow: isLocked ? 'none' : `0 0 30px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.03)`,
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-4">
        {/* Title + Badge */}
        <div className="flex items-center gap-2">
          <h2
            className="font-black text-xl"
            style={{ color: themeColor }}
          >
            {title}
          </h2>
          {badge && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: themeColor,
                color: '#FFFFFF',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Hierarchy / Time Commitment */}
        <div className="text-right">
          {hierarchy && (
            <>
              <p className="text-xs" style={{ color: '#888888' }}>Jerarquía:</p>
              <p className="text-sm font-bold" style={{ color: themeColor }}>{hierarchy}</p>
            </>
          )}
          {timeCommitment && (
            <>
              <p className="text-xs" style={{ color: '#888888' }}>Tiempo de compromiso:</p>
              <p className="text-sm font-bold" style={{ color: themeColor }}>{timeCommitment}</p>
            </>
          )}
        </div>
      </div>

      {/* Data Rows */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Monthly Income */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
            INGRESOS MENSUALES
          </span>
          <span className="text-lg font-black mt-1" style={{ color: themeColor }}>
            {monthlyIncome}
          </span>
        </div>

        {/* Daily Income */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
            INGRESOS DIARIOS
          </span>
          <span className="text-lg font-black mt-1" style={{ color: themeColor }}>
            {dailyIncome}
          </span>
        </div>

        {/* Third Column - varies */}
        <div className="flex flex-col">
          {taskPayment ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
                PAGO POR TAREA
              </span>
              <span className="text-lg font-black mt-1" style={{ color: themeColor }}>
                {taskPayment}
              </span>
            </>
          ) : yearlyIncome ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
                INGRESOS ANUALES
              </span>
              <span className="text-lg font-black mt-1" style={{ color: themeColor }}>
                {yearlyIncome}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: '#888888' }}>Tareas Diarias:</span>
          <span className="text-xs font-bold text-white">{dailyTasks}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: '#888888' }}>
            {isFree ? 'Inversión:' : 'Monto de inversión:'}
          </span>
          <span className="text-xs font-bold" style={{ color: themeColor }}>
            {investment}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {isLocked ? (
        <div
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Lock size={16} style={{ color: '#666666' }} />
          <span className="font-bold text-sm" style={{ color: '#666666' }}>
            No disponible
          </span>
        </div>
      ) : isFree ? (
        <button
          onClick={onAction}
          className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
          }}
        >
          <Play size={16} fill="#FFFFFF" />
          Iniciar ahora
        </button>
      ) : (
        <button
          onClick={onAction}
          className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
            color: '#000000',
            boxShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
          }}
        >
          <CreditCard size={16} />
          Recargar
        </button>
      )}
    </div>
  );
}
