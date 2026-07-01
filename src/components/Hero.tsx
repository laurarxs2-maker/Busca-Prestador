import { Search, HeartPulse, X, ListFilter, PlusCircle } from 'lucide-react';

export type View = 'buscar' | 'novo';

interface HeroProps {
  view: View;
  onViewChange: (view: View) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function Hero({ view, onViewChange, search, onSearchChange }: HeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-navy-950 via-navy-800 to-brand-900">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-200">
            <HeartPulse className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-widest">Portal Prestador</span>
          </div>

          <nav className="flex rounded-xl border border-white/10 bg-white/5 p-1 text-sm">
            <button
              type="button"
              onClick={() => onViewChange('buscar')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                view === 'buscar' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ListFilter className="h-4 w-4" />
              Buscar
            </button>
            <button
              type="button"
              onClick={() => onViewChange('novo')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                view === 'novo' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Novo prestador
            </button>
          </nav>
        </div>

        {view === 'buscar' ? (
          <>
            <h1 className="mt-6 text-2xl font-bold text-white sm:text-4xl">
              Encontre prestadores de saúde
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Busque por nome, especialidade ou unidade. Filtre por UF, tipo de atendimento e bairro
              para encontrar hospitais, clínicas, laboratórios e consultórios.
            </p>

            <div className="relative mt-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ex: Cardiologia, Fleury, Itaim, Check-up..."
                className="w-full rounded-2xl border border-white/10 bg-navy-800/80 py-3.5 pl-12 pr-12 text-base text-slate-100 shadow-lg outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/25"
                aria-label="Busca global"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
                  aria-label="Limpar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold text-white sm:text-4xl">Cadastrar novo prestador</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Preencha os dados abaixo. O registro é enviado para a planilha e passa a aparecer na busca.
            </p>
          </>
        )}
      </div>
    </header>
  );
}
