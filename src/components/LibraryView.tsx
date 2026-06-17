import React, { useState } from 'react';
import { Search, BookOpen, Clock, Tag, X, FileText, CheckCircle2 } from 'lucide-react';
import { mockBooks } from '../data';
import { Book } from '../types';

export default function LibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('Todos');
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const subjects = ['Todos', 'UTI', 'Urgência', 'Dermatologia', 'Metodologia', 'Enfermagem'];

  // Filter books matching query
  const filteredBooks = mockBooks.filter(book => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(term) ||
                          book.authors.toLowerCase().includes(term) ||
                          book.synopsis.toLowerCase().includes(term);
    const matchesSubject = selectedSubject === 'Todos' || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6" id="evace-library-section">
      {/* Search and filter layout */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center">
            <BookOpen className="w-5 h-5 mr-2.5 text-[#0a4d2c]" />
            Biblioteca Digital EVACE
          </h2>
          <p className="text-xs text-gray-400 mt-1">Conecte-se com bibliografias oficiais e e-books exclusivos recomendados para seus cursos.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por livro, autor, palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0a4d2c] focus:ring-1 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 font-bold text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Subject Filter Badge Strip */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none cursor-pointer border transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#0a4d2c] text-white border-[#0a4d2c] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
          <p className="font-semibold text-sm">Nenhum livro cadastrado para essa busca</p>
          <p className="text-xs mt-1 text-gray-400">Tente ajustar seus termos ou redefinir o assunto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map(book => (
            <div 
              key={book.id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Fake Cover graphic representation */}
              <div className={`${book.coverColor} p-6 text-white h-44 relative flex flex-col justify-between overflow-hidden shrink-0`}>
                <div className="absolute top-0 right-0 opacity-10 font-bold text-9xl pointer-events-none -mr-4 -mt-6">
                  {book.subject[0]}
                </div>
                
                {/* Book header details */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    {book.subject}
                  </span>
                  <span className="text-[9px] font-mono opacity-80">{book.year}</span>
                </div>

                {/* Cover title */}
                <h3 className="font-extrabold text-sm tracking-tight leading-snug drop-shadow-sm line-clamp-2">
                  {book.title}
                </h3>

                {/* Pages and indicator details */}
                <div className="flex justify-between items-center text-[10px] opacity-90 font-medium">
                  <span>EVACE Academic</span>
                  <span>{book.pages} páginas</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Autores</span>
                  <p className="text-xs font-semibold text-slate-700 block truncate" title={book.authors}>
                    {book.authors}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                    {book.synopsis}
                  </p>
                </div>

                <button
                  onClick={() => setReadingBook(book)}
                  className="w-full py-2 bg-slate-50 hover:bg-[#0a4d2c] hover:text-white border border-slate-200 hover:border-[#0a4d2c] text-[#0a4d2c] font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer group-hover:bg-[#0a4d2c] group-hover:text-white group-hover:border-[#0a4d2c]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Consultar Acervo / Resumo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Reader Preview Modal */}
      {readingBook && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className={`${readingBook.coverColor} p-5 text-white flex justify-between items-start`}>
              <div className="pr-4">
                <span className="text-[9px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  {readingBook.subject}
                </span>
                <h3 className="text-base font-bold mt-2 leading-snug">{readingBook.title}</h3>
              </div>
              <button 
                onClick={() => setReadingBook(null)}
                className="text-white hover:text-slate-200 p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Ficha Técnica</span>
                <div className="grid grid-cols-3 gap-2 mt-1.5 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-gray-400 block uppercase font-semibold">Publicação</span>
                    <span className="text-xs font-bold text-slate-700">{readingBook.year}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-gray-400 block uppercase font-semibold">Extensão</span>
                    <span className="text-xs font-bold text-slate-700">{readingBook.pages} págs</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-gray-400 block uppercase font-semibold">Idioma</span>
                    <span className="text-xs font-bold text-slate-700">Português</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Sinopse e Diretrizes</span>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {readingBook.synopsis}
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start space-x-2.5 text-[#0a4d2c]">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block">Acesso Disponibilizado</span>
                  <span className="text-[10px] opacity-85 block leading-tight">Este e-book está com leitura imediata autorizada pela biblioteca EVACE usando suas credenciais de portal pós-graduação.</span>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setReadingBook(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-white transition-all"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  alert(`Acessando leitor virtual para "${readingBook.title}". O PDF completo foi carregado no ambiente acadêmico privado!`);
                  setReadingBook(null);
                }}
                className="px-4 py-2 bg-[#0a4d2c] text-white hover:bg-emerald-800 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Abrir Leitor Virtual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
