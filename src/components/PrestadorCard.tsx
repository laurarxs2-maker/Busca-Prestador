import { Phone, MessageCircle, MapPin, Info, Building2 } from 'lucide-react';
import { Badge } from './Badge';
import type { Prestador } from '../types/prestador';
import { onlyDigits, toWhatsappNumber } from '../lib/utils';

interface PrestadorCardProps {
  prestador: Prestador;
}

export function PrestadorCard({ prestador }: PrestadorCardProps) {
  const telLink = prestador.telefones[0] ? `tel:+55${onlyDigits(prestador.telefones[0])}` : null;
  const whatsNumber = toWhatsappNumber(prestador.whatsapp);
  const whatsLink = whatsNumber
    ? `https://wa.me/${whatsNumber}?text=${encodeURIComponent(
        `Olá! Encontrei ${prestador.nome} no portal e gostaria de mais informações.`,
      )}`
    : null;

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-navy-700 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-100">{prestador.nome}</h3>
        <Badge variant="uf">{prestador.uf}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prestador.especialidades.map((esp) => (
          <Badge key={esp} variant="especialidade">
            {esp}
          </Badge>
        ))}
        {prestador.tiposAtendimento.map((tipo) => (
          <Badge key={tipo} variant="tipo">
            {tipo}
          </Badge>
        ))}
      </div>

      {prestador.unidades.length > 0 && (
        <div className="mt-3 flex items-start gap-2 text-sm text-slate-300">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <span>{prestador.unidades.join(' · ')}</span>
        </div>
      )}

      {prestador.telefones.length > 0 && (
        <div className="mt-1.5 flex items-start gap-2 text-sm text-slate-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <span>{prestador.telefones.join(' · ')}</span>
        </div>
      )}

      {prestador.obs && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-300 ring-1 ring-inset ring-amber-400/20">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{prestador.obs}</span>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
        {telLink && (
          <a
            href={telLink}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-navy-600 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-navy-500"
          >
            <Phone className="h-4 w-4" />
            Ligar
          </a>
        )}
        {whatsLink && (
          <a
            href={whatsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
