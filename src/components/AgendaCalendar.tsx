import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, PlusCircle, Trash2, CheckCircle2, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { mockAgendaEvents } from '../data';
import { AgendaEvent } from '../types';

export default function AgendaCalendar() {
  const [events, setEvents] = useState<AgendaEvent[]>(mockAgendaEvents);
  const [filterType, setFilterType] = useState<string>('Todos');
  
  // Custom event creation states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-06-22');
  const [newTime, setNewTime] = useState('08:00 - 12:00');
  const [newType, setNewType] = useState<'aula' | 'prova' | 'seminario' | 'entrega'>('aula');
  const [newLoc, setNewLoc] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const eventTypes = ['Todos', 'aula', 'prova', 'seminario', 'entrega'];

  const filteredEvents = events.filter(ev => {
    return filterType === 'Todos' || ev.type === filterType;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: AgendaEvent = {
      id: `custom_${Date.now()}`,
      title: newTitle,
      date: newDate,
      time: newTime,
      type: newType,
      location: newLoc || 'Sala Virtual Google Meet',
      description: newDesc
    };

    setEvents([...events, added]);
    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewLoc('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'aula':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'prova':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'seminario':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'entrega':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const translateType = (type: string) => {
    switch (type) {
      case 'aula': return 'Aula Presencial/Remota';
      case 'prova': return 'Avaliação Modular';
      case 'seminario': return 'Seminário de Pesquisa';
      case 'entrega': return 'Entrega de Trabalho/TCC';
      default: return type;
    }
  };

  return (
    <div className="space-y-6" id="evace-agenda-section">
      {/* Search and control bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2.5 text-[#0a4d2c]" />
              Cronograma de Atividades e Aulas
            </h2>
            <p className="text-xs text-gray-400 mt-1">Acompanhe as próximas aulas presenciais, avaliações, prazos e datas de TCC.</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar Compromisso</span>
          </button>
        </div>

        {/* Type filtering layout */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Filtrar por:</span>
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-all ${
                filterType === type
                  ? 'bg-[#0a4d2c] text-white border-[#0a4d2c] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type === 'Todos' ? 'Todos os Compromissos' : translateType(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduler Form Drawer / Collapsible card */}
      {showAddForm && (
        <form 
          onSubmit={handleAddEvent}
          className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-md space-y-4 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Agendar Novo Evento de Estudos</span>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-gray-400 hover:text-slate-600 text-xs font-bold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Título do Compromisso *</label>
              <input
                type="text"
                required
                placeholder="Ex: Grupo de Estudo TCC"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Tipo de Compromisso</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50 text-slate-700"
              >
                <option value="aula">Aula</option>
                <option value="prova">Avaliação</option>
                <option value="seminario">Seminário</option>
                <option value="entrega">Entrega de Trabalho</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Data do Compromisso</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50 text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Horário</label>
              <input
                type="text"
                placeholder="Ex: 08:30 - 11:45"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Localização / Link</label>
              <input
                type="text"
                placeholder="Ex: Executivo / Sala 3"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50"
              />
            </div>

            <div className="space-y-1 md:col-span-3">
              <label className="text-[11px] font-bold text-slate-600 block">Descrição adicional</label>
              <textarea
                placeholder="Ex: Revisar os slides do Módulo 3 sobre Ventilação Pulmonar."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] bg-slate-50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              Confirmar Agendamento Acadêmico
            </button>
          </div>
        </form>
      )}

      {/* Events List Display */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-gray-400">
            <CalendarIcon className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
            <p className="font-semibold text-sm">Nenhum compromisso marcado para este filtro</p>
            <p className="text-xs mt-1 text-gray-400">Aproveite para criar o seu próprio cronograma clicando em "Adicionar Compromisso".</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const dateParts = event.date.split('-');
            const formattedDate = dateParts.length === 3 
              ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
              : event.date;

            return (
              <div 
                key={event.id}
                className="bg-white border border-slate-100 rounded-xl hover:border-slate-200 shadow-xs hover:shadow-xs transition-colors p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center space-x-4">
                  {/* Date Badge */}
                  <div className="bg-[#0a4d2c]/5 border border-[#0a4d2c]/10 px-3 py-2 rounded-lg text-center shrink-0 w-20">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Data</span>
                    <span className="text-xs font-extrabold text-[#0a4d2c] block mt-0.5">{formattedDate.slice(0, 5)}</span>
                    <span className="text-[9px] text-[#0a4d2c] font-mono block leading-none">{formattedDate.slice(6)}</span>
                  </div>

                  {/* Info details */}
                  <div className="space-y-1.5 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeStyle(event.type)}`}>
                        {translateType(event.type)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">ID: {event.id.slice(0, 8)}</span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm tracking-tight leading-snug">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {event.time}
                      </span>
                      <span className="flex items-center block truncate max-w-[280px]" title={event.location}>
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {event.location}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mt-1.5 font-medium">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center justify-end border-t md:border-t-0 border-slate-50 pt-3 md:pt-0 shrink-0">
                  {event.id.startsWith('custom_') ? (
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Compromisso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="bg-emerald-50 text-[#0a4d2c]/70 p-2 rounded-lg text-[10px] font-bold flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 text-[#0a4d2c]" />
                      <span>Oficial EVACE</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
