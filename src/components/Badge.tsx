import type { ReactNode } from 'react';

type BadgeVariant = 'especialidade' | 'tipo' | 'uf' | 'neutral';

const variants: Record<BadgeVariant, string> = {
  especialidade: 'bg-brand-500/15 text-brand-300 ring-brand-400/25',
  tipo: 'bg-sky-500/15 text-sky-300 ring-sky-400/25',
  uf: 'bg-white/10 text-slate-200 ring-white/15',
  neutral: 'bg-white/5 text-slate-300 ring-white/10',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
}

export function Badge({ children, variant = 'neutral', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {icon}
      {children}
    </span>
  );
}
