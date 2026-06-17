import React, { useState } from 'react';
import { Calendar, Plus, PlusCircle, Trash2, MapPin, Clock, Sparkles, BookOpen, Layers } from 'lucide-react';
import { AgendaEvent, Turma } from '../types';

interface AdminAgendaAulasProps {
  events: AgendaEvent[];
  turmas: Turma[];
  onAddEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function AdminAgendaAulas({
  events,
  turmas,
  onAddEvent,
  onDeleteEvent
}: AdminAgendaAulasProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 - 12:00');
  const [type, setType] = useState<'aula' | 'prova' | 'seminario' | 'entrega'>('aula');
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [location, setLocation] = useState('Google Meet / Auditório');
  const [description, setDescription] = useState('');
  const [confirmDeleteEventId, setConfirmDeleteEventId] = useState<string | null>(null);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddEvent({
      title: title.trim(),
      date,
      time,
      type,
      turmaId: selectedTurmaId || undefined,
      location: location.trim(),
      description: description.trim()
    });

    // Reset fields
    setTitle('');
    setDate('');
    setTime('08:00 - 12:00');
    setType('aula');
    setSelectedTurmaId('');
    setLocation('Google Meet / Auditório');
    setDescription('');
    setShowAddForm(false);
  };

  const getClassName = (id?: string) => {
    if (!id) return 'Sem turma vinculada';
    return turmas.find(t => t.id === id)?.title || 'Turma Geral';
  };

  const sortedEvents = [...events].sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6" id="admin-agenda-view">
      {/* Schedule controller headers */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#0a4d2c]" />
              Agendamento & Calendário de Aulas
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Gerencie cronogramas de encontros síncronos, datas de avaliações, prazos e workshops da pós-graduação.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Agendar Encontro</span>
          </button>
        </div>

        {/* Collapsible Encontro/Class Register Form */}
        {showAddForm && (
          <form 
            onSubmit={handleCreateEvent}
            className="border border-emerald-100 bg-emerald-50/10 rounded-xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200"
          >
            <h3 className="text-xs font-extrabold text-[#0a4d2c] uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-[#0a4d2c]" /> Marcar Nova Atividade / Aula
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-none">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Título do Encontro *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aula de Ventilação Pulmonar Avançada"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Data de Realização *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c] text-slate-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Horário (Início - Fim)</label>
                <input
                  type="text"
                  placeholder="Ex: 08:00 às 17:00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Categoria do Encontro</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="aula">Encontro Presencial (Aula)</option>
                  <option value="prova">Avaliação / Prova Modular</option>
                  <option value="seminario">Seminário / Defesa TCC</option>
                  <option value="entrega">Prazo de Entrega das Notas/Relatórios</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block font-bold">Vincular Turma</label>
                <select
                  value={selectedTurmaId}
                  onChange={(e) => setSelectedTurmaId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="">Apenas Alerta Geral (Sem turma específica)</option>
                  {turmas.map(t => (
                    <option key={t.id} value={t.id}>[{t.category}] {t.title.slice(0,30)}...</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block">Localidade / Sala Acadêmica</label>
                <input
                  type="text"
                  placeholder="Ex: Google Meet / Laboratório de Práticas"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">Informações Adicionais para Alunos</label>
              <textarea
                placeholder="Detalhes adicionais, pré-requisitos, jaleco, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0a4d2c]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-all font-semibold"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Registrar Encontro
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Structured Events Schedule Grid */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-gray-400 text-xs">
            <Calendar className="w-12 h-12 stroke-1 text-gray-300 mx-auto mb-2" />
            Nenhuma aula ou atividade agendada até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedEvents.map(event => {
              const dParts = event.date.split('-');
              const fDate = dParts.length === 3 ? `${dParts[2]}/${dParts[1]}/${dParts[0]}` : event.date;

              return (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        event.type === 'aula' ? 'bg-blue-50 text-blue-700' :
                        event.type === 'prova' ? 'bg-rose-50 text-rose-700' :
                        event.type === 'seminario' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {event.type === 'aula' ? 'Aula Regular' :
                         event.type === 'prova' ? 'Avaliação' :
                         event.type === 'seminario' ? 'Seminário' : 'Entrega'}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-xs pr-8 leading-snug">
                        {event.title}
                      </h4>
                    </div>

                    {confirmDeleteEventId === event.id ? (
                      <div className="absolute top-3 right-4 flex items-center space-x-1 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 animate-in fade-in zoom-in-95 duration-150 z-20">
                        <span className="text-[9px] font-bold text-red-700 whitespace-nowrap">Excluir?</span>
                        <button
                          onClick={() => {
                            onDeleteEvent(event.id);
                            setConfirmDeleteEventId(null);
                          }}
                          className="px-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[8px] rounded uppercase cursor-pointer"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmDeleteEventId(null)}
                          className="px-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[8px] rounded uppercase cursor-pointer"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteEventId(event.id)}
                        className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        title="Deletar da Programação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-[#0a4d2c] font-semibold flex items-center leading-none">
                    <Layers className="w-3.5 h-3.5 mr-1" />
                    {getClassName(event.turmaId)}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-600 border-t border-slate-50 pt-2.5">
                    <span className="flex items-center font-mono font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                      {fDate}
                    </span>
                    <span className="flex items-center font-mono">
                      <Clock className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                      {event.time}
                    </span>
                    {event.location && (
                      <span className="flex items-center text-slate-600 bg-slate-100/50 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3 text-[#0a4d2c] mr-1 shrink-0" />
                        <span className="truncate max-w-[120px]">{event.location}</span>
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-[10px] text-gray-400 font-medium bg-slate-50/50 p-2 rounded-lg leading-relaxed border border-slate-50">
                      {event.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
