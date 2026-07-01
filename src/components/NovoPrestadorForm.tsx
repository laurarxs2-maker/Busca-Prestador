import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Send, Info } from 'lucide-react';
import type { PrestadorRaw } from '../types/prestador';
import { isSubmitConfigured, submitPrestador } from '../services/submitPrestador';

const EMPTY: PrestadorRaw = {
  nome: '',
  uf: '',
  telefones: '',
  whatsapp: '',
  tipoAtendimento: '',
  especialidade: '',
  unidade: '',
  obs: '',
};

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-navy-800 px-3.5 py-2.5 text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  textarea?: boolean;
}

function Field({ label, value, onChange, placeholder, required, hint, textarea }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
        {required && <span className="ml-1 text-brand-400">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

interface NovoPrestadorFormProps {
  onSaved?: () => void;
}

export function NovoPrestadorForm({ onSaved }: NovoPrestadorFormProps) {
  const [form, setForm] = useState<PrestadorRaw>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const configured = isSubmitConfigured();

  const set = (patch: Partial<PrestadorRaw>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.uf.trim()) {
      setStatus('error');
      setErrorMsg('Preencha ao menos o nome e a UF.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      await submitPrestador({
        ...form,
        uf: form.uf.trim().toUpperCase(),
      });
      setStatus('success');
      setForm(EMPTY);
      onSaved?.();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar.');
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl px-4">
      {!configured && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            O envio ainda não está conectado à planilha. Publique o Apps Script e defina a variável
            <code className="mx-1 rounded bg-black/30 px-1">VITE_SHEETS_WEBAPP_URL</code>
            para ativar o cadastro.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-navy-700 p-5 shadow-card sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Nome do prestador"
              required
              value={form.nome}
              onChange={(v) => set({ nome: v })}
              placeholder="Ex: Hospital Israelita Albert Einstein"
            />
          </div>
          <Field
            label="UF"
            required
            value={form.uf}
            onChange={(v) => set({ uf: v })}
            placeholder="Ex: SP"
          />
          <Field
            label="Telefones"
            value={form.telefones}
            onChange={(v) => set({ telefones: v })}
            placeholder="(11) 0000-0000 / (11) 0000-0001"
            hint="Separe vários por / ou vírgula."
          />
          <Field
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(v) => set({ whatsapp: v })}
            placeholder="(11) 90000-0000"
          />
          <Field
            label="Tipo de atendimento"
            value={form.tipoAtendimento}
            onChange={(v) => set({ tipoAtendimento: v })}
            placeholder="Ex: Consulta, Check-up, Exames"
          />
          <Field
            label="Especialidade"
            value={form.especialidade}
            onChange={(v) => set({ especialidade: v })}
            placeholder="Ex: Cardiologia"
          />
          <Field
            label="Unidade / Bairro"
            value={form.unidade}
            onChange={(v) => set({ unidade: v })}
            placeholder="Ex: Itaim, Alphaville, Morumbi"
            hint="Separe vários por vírgula."
          />
          <div className="sm:col-span-2">
            <Field
              label="Observações"
              value={form.obs}
              onChange={(v) => set({ obs: v })}
              placeholder="Ex: Ramal direto 8540"
              textarea
            />
          </div>
        </div>

        {status === 'success' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-400/25 bg-brand-500/10 p-3 text-sm text-brand-200">
            <CheckCircle2 className="h-4 w-4" />
            Prestador enviado com sucesso!
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <AlertTriangle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={status === 'sending' || !configured}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar prestador
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
