import React, { useState, useEffect } from 'react';
import { Professor } from '../types';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  FileText, 
  X, 
  UserCheck, 
  Briefcase,
  Smartphone,
  CreditCard,
  MapPin,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import EvaceLogo from './EvaceLogo';

// Let's seed a beautiful realistic default professor inspired by the user's PDF attachment
const SEEDED_PROFESSOR: Professor = {
  id: 'prof_01',
  name: 'PATRICIA WALKER',
  cpf: '079.823.927-17',
  rg: '10709625-7',
  rgOrgao: 'DETRAN',
  rgEmissao: '12/10/2004',
  naturalidade: 'RIO DE JANEIRO',
  dataNasc: '04/12/1976',
  nomeMae: 'REGINA MARIA FRANCISCO WALKER',
  nomePai: 'EDISON DA CUNHA WALKER',
  graduacao: 'NUTRIÇÃO',
  posGraduacao: 'TERAPIA NUTRICIONAL; NEFROLOGIA E NUTRIÇÃO RENAL; ORTOMOLECULAR, FUNCIONAL E FITOTERAPIA',
  titulacao: 'Especialista',
  endereco: 'RUA SEBASTIÃO DUARTE MONTEIRO',
  numero: '641',
  bairro: 'LEDA – BARRA DE SÃO JOÃO',
  cep: '28880-000',
  cidade: 'CASIMIRO DE ABREU',
  estado: 'RJ',
  telFixo: '',
  telCel: '(22) 99866-0078',
  telCel2: '',
  email: 'nutripatriciawalker@gmail.com',
  chavePix: 'CELULAR (22) 99866-0078',
  banco: 'BRADESCO',
  agencia: '0883',
  conta: '0551132-1'
};

export default function AdminProfessores() {
  const [professores, setProfessores] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('evace_professores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [SEEDED_PROFESSOR];
      }
    }
    return [SEEDED_PROFESSOR];
  });

  const [selectedProfId, setSelectedProfId] = useState<string>(
    professores[0]?.id || ''
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Professor | null>(null);

  // Form input fields state
  const [formData, setFormData] = useState<Omit<Professor, 'id'>>({
    name: '',
    cpf: '',
    rg: '',
    rgOrgao: '',
    rgEmissao: '',
    naturalidade: '',
    dataNasc: '',
    nomeMae: '',
    nomePai: '',
    graduacao: '',
    posGraduacao: '',
    titulacao: 'Especialista',
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: 'RJ',
    telFixo: '',
    telCel: '',
    telCel2: '',
    email: '',
    chavePix: '',
    banco: '',
    agencia: '',
    conta: ''
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('evace_professores', JSON.stringify(professores));
    if (professores.length > 0 && !professores.some(p => p.id === selectedProfId)) {
      setSelectedProfId(professores[0].id);
    }
  }, [professores]);

  // Selected professor object
  const selectedProf = professores.find(p => p.id === selectedProfId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenAdd = () => {
    setEditingProf(null);
    setFormData({
      name: '',
      cpf: '',
      rg: '',
      rgOrgao: '',
      rgEmissao: '',
      naturalidade: '',
      dataNasc: '',
      nomeMae: '',
      nomePai: '',
      graduacao: '',
      posGraduacao: '',
      titulacao: 'Especialista',
      endereco: '',
      numero: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: 'RJ',
      telFixo: '',
      telCel: '',
      telCel2: '',
      email: '',
      chavePix: '',
      banco: '',
      agencia: '',
      conta: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prof: Professor) => {
    setEditingProf(prof);
    setFormData({ ...prof });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Por favor, insira pelo menos o nome do professor.");
      return;
    }

    if (editingProf) {
      const updatedList = professores.map(p => 
        p.id === editingProf.id ? { ...formData, id: editingProf.id } : p
      );
      setProfessores(updatedList);
    } else {
      const newProf: Professor = {
        ...formData,
        id: `prof_${Date.now()}`
      };
      setProfessores(prev => [...prev, newProf]);
      setSelectedProfId(newProf.id);
    }

    setIsFormOpen(false);
    setEditingProf(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente remover este professor do sistema? Esta ação apagará a respectiva ficha cadastral.")) {
      const filtered = professores.filter(p => p.id !== id);
      setProfessores(filtered);
      if (selectedProfId === id && filtered.length > 0) {
        setSelectedProfId(filtered[0].id);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="professores-workspace">
      
      {/* Print CSS specific rule to print exclusively #printable-professor-sheet and nothing else */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          /* Hide everything under body */
          body * {
            visibility: hidden !important;
          }
          /* Hide non-printable app layers completely */
          .no-print, .no-print *, header, footer, aside, button, nav, #header-bar, #evace-primary-footer, #professores-workspace-left-tab {
            display: none !important;
            visibility: hidden !important;
          }
          /* Force printable sheet container to render only */
          #printable-professor-sheet, #printable-professor-sheet * {
            visibility: visible !important;
          }
          #printable-professor-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            min-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          /* Make table borders high contrast black */
          table, th, td, tr, div {
            border-color: #000000 !important;
            color: #000000 !important;
          }
          /* Keep text clean without rounded card background shading */
          .official-heading-strip {
            background-color: #e5e5e5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      {/* LEFT COLUMN: list and management panel */}
      <div className="lg:col-span-4 space-y-6 no-print" id="professores-workspace-left-tab">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-800">
                Professores Cadastrados
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Gere e imprima fichas oficiais
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Adicionar novo professor"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {professores.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-xs font-semibold">Nenhum professor cadastrado</p>
              </div>
            ) : (
              professores.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => setSelectedProfId(prof.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedProfId === prof.id
                      ? 'bg-emerald-50/70 border-emerald-500/30'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs font-extrabold text-slate-700 truncate uppercase">
                      {prof.name || 'Sem nome'}
                    </h3>
                    <p className="text-[10px] font-mono font-medium text-slate-400 mt-0.5">
                      CPF: {prof.cpf || 'Não informado'}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold mt-1 bg-slate-100 text-slate-600">
                      {prof.titulacao}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEdit(prof)}
                      className="p-1 px-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Editar cadastro"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prof.id)}
                      className="p-1 px-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Excluir professor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Instructions widget */}
        <div className="bg-gradient-to-br from-emerald-950/90 to-[#0e3b23] text-white p-5 rounded-2xl shadow-xs border border-emerald-900/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Emissão de Ficha de Cadastro
          </h4>
          <p className="text-xs text-emerald-200/90 leading-relaxed font-medium">
            Selecione qualquer professor cadastrado na lista para visualizar a ficha de dados preenchida. Use o botão <strong>Imprimir</strong> no cabeçalho ou o ícone da impressora para gerar o documento A4 oficial diretamente para sua impressora ou PDF.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Print preview and active sheet viewport */}
      <div className="lg:col-span-8 flex flex-col items-center">
        {selectedProf ? (
          <div className="w-full flex flex-col items-center">
            
            {/* Top Toolbar */}
            <div className="w-full max-w-[210mm] no-print mb-4 flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200/40">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Ficha Geral de {selectedProf.name}
              </span>
            </div>

            {/* A4 Sheet Container */}
            <div 
              id="printable-professor-sheet"
              className="relative w-full max-w-[210mm] min-h-[297mm] bg-white p-8 md:p-12 text-black shadow-sm border border-slate-300/60 font-sans text-[12px] flex flex-col justify-between"
              style={{ fontFamily: '"Calibri", "Candara", "Segoe UI", Arial, sans-serif' }}
            >
              <button
                onClick={handlePrint}
                title="Imprimir Ficha"
                className="absolute top-6 right-6 no-print p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-all cursor-pointer shadow-xs border border-slate-200/50 hover:border-emerald-200 active:scale-90 flex items-center justify-center z-10"
              >
                <Printer className="w-5 h-5" />
              </button>

              <div>
                {/* School Seal/Logo */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="w-36 h-auto flex flex-col items-center">
                    <EvaceLogo variant="dark" showText={true} size="md" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">
                    cursos e treinamentos
                  </span>
                </div>

                {/* Main Heading Text */}
                <div className="text-center mb-4">
                  <h1 className="text-xs font-bold text-slate-700 italic">
                    Programa de Pós-Graduação Lato Sensu
                  </h1>
                </div>

                {/* Gray Row Sub Header */}
                <div className="official-heading-strip text-center bg-[#f2f2f2] border border-black py-1.5 mb-4 rounded-xs">
                  <h2 className="text-xs font-black tracking-wider text-slate-800">
                    FICHA DE CADASTRO DO PROFESSOR E/OU ORIENTADOR
                  </h2>
                </div>

                {/* TABLE FORM CONTAINER */}
                <div className="border border-black flex flex-col divide-y divide-black">
                  
                  {/* Row 1: Nome & CPF */}
                  <div className="flex divide-x divide-black">
                    <div className="w-3/4 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Nome do(a) Professor(a)</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.name || '____________________________________________________'}
                      </span>
                    </div>
                    <div className="w-1/4 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">CPF</span>
                      <span className="text-xs font-bold font-mono text-black mt-0.5">
                        {selectedProf.cpf || '____.____.____-__'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: RG, Orgão Expedidor & Data de Emissão */}
                  <div className="flex divide-x divide-black">
                    <div className="w-1/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">RG Número</span>
                      <span className="text-xs font-bold font-mono text-black mt-0.5">
                        {selectedProf.rg || '___________'}
                      </span>
                    </div>
                    <div className="w-1/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Orgão Expedidor</span>
                      <span className="text-xs font-bold text-black uppercase mt-0.5">
                        {selectedProf.rgOrgao || 'DETRAN/RJ'}
                      </span>
                    </div>
                    <div className="w-1/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Data de Emissão</span>
                      <span className="text-xs font-bold font-mono text-black mt-0.5">
                        {selectedProf.rgEmissao || '____/____/____'}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Naturalidade & Data de Nasc */}
                  <div className="flex divide-x divide-black">
                    <div className="w-2/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Naturalidade</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.naturalidade || '__________________'}
                      </span>
                    </div>
                    <div className="w-1/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Data de Nasc.</span>
                      <span className="text-xs font-bold font-mono text-black mt-0.5">
                        {selectedProf.dataNasc || '____/____/____'}
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Mãe & Pai */}
                  <div className="flex divide-x divide-black">
                    <div className="w-1/2 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Nome da Mãe</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.nomeMae || '_____________________________________'}
                      </span>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Nome do Pai</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.nomePai || '_____________________________________'}
                      </span>
                    </div>
                  </div>

                  {/* Row 5: Graduação */}
                  <div className="p-2 flex flex-col min-h-[46px] justify-between">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Graduação</span>
                    <span className="text-xs font-bold text-black uppercase mt-0.5">
                      {selectedProf.graduacao || '__________________________________________________________________________'}
                    </span>
                  </div>

                  {/* Row 6: Pós-Graduação */}
                  <div className="p-2 flex flex-col min-h-[46px] justify-between">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Pós-Graduação</span>
                    <span className="text-xs font-bold text-black uppercase leading-tight mt-0.5">
                      {selectedProf.posGraduacao || '__________________________________________________________________________'}
                    </span>
                  </div>

                  {/* Row 7: Titulação Checkmarks */}
                  <div className="p-3">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide block mb-2">Titulação</span>
                    <div className="flex items-center space-x-12 select-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-black flex items-center justify-center font-bold text-xs bg-white text-black">
                          {selectedProf.titulacao === 'Doutor' ? 'X' : ''}
                        </div>
                        <span className="text-xs font-bold text-slate-800">Doutor</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-black flex items-center justify-center font-bold text-xs bg-white text-black">
                          {selectedProf.titulacao === 'Mestre' ? 'X' : ''}
                        </div>
                        <span className="text-xs font-bold text-slate-800">Mestre</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-black flex items-center justify-center font-bold text-xs bg-white text-black">
                          {selectedProf.titulacao === 'Especialista' ? 'X' : ''}
                        </div>
                        <span className="text-xs font-bold text-slate-800">Especialista</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 8: Endereço & Nº */}
                  <div className="flex divide-x divide-black">
                    <div className="w-5/6 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Endereço (Rua/Avenida)</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.endereco || '____________________________________________________'}
                      </span>
                    </div>
                    <div className="w-1/6 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Nº</span>
                      <span className="text-xs font-bold text-black uppercase text-center mt-0.5">
                        {selectedProf.numero || '___'}
                      </span>
                    </div>
                  </div>

                  {/* Row 9: Bairro & CEP */}
                  <div className="flex divide-x divide-black">
                    <div className="w-2/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Bairro</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.bairro || '__________________________________'}
                      </span>
                    </div>
                    <div className="w-1/3 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">CEP</span>
                      <span className="text-xs font-bold font-mono text-black mt-0.5">
                        {selectedProf.cep || '_____-___'}
                      </span>
                    </div>
                  </div>

                  {/* Row 10: Cidade & Estado */}
                  <div className="flex divide-x divide-black">
                    <div className="w-4/5 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Cidade</span>
                      <span className="text-xs font-bold text-black uppercase truncate mt-0.5">
                        {selectedProf.cidade || '__________________'}
                      </span>
                    </div>
                    <div className="w-1/5 p-2 flex flex-col min-h-[46px] justify-between">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Estado</span>
                      <span className="text-xs font-bold text-black uppercase text-center mt-0.5">
                        {selectedProf.estado || 'RJ'}
                      </span>
                    </div>
                  </div>

                  {/* Row 11: Telefones para Contato */}
                  <div className="p-3">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide block mb-2">Telefones para Contato</span>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-700">Tel.Fixo ( )</span>
                        <span className="text-xs font-bold font-mono border-b border-black min-w-[120px] inline-block h-5">
                          {selectedProf.telFixo || ''}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-emerald-900">Cel. ( X )</span>
                        <span className="text-xs font-bold font-mono border-b border-black min-w-[150px] inline-block h-5">
                          {selectedProf.telCel || ''}
                        </span>
                      </div>

                      {selectedProf.telCel2 && (
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-700">Cel. ( )</span>
                          <span className="text-xs font-bold font-mono border-b border-black min-w-[150px] inline-block h-5">
                            {selectedProf.telCel2}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 12: E-mail & PIX */}
                  <div className="p-3 flex flex-col min-h-[46px] justify-between">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">E-mail</span>
                    <span className="text-xs font-bold text-blue-800 lowercase font-mono mt-0.5">
                      {selectedProf.email || '______________________________________'}
                    </span>
                  </div>

                  {/* Row 13: Banking, PIX & UNIFIP Credentials */}
                  <div className="p-3 bg-slate-50/10">
                    <div className="mb-2">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide block">CHAVE PIX</span>
                      <span className="text-xs font-black text-rose-900 mt-0.5 select-all">
                        {selectedProf.chavePix || '_________________________________________'}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-slate-300">
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-2">
                        Dados Bancários (Professor UNIFIP)
                      </span>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border-r border-slate-200/50 pr-2">
                          <span className="text-[8px] font-bold text-slate-500 uppercase block">Banco</span>
                          <span className="text-xs font-black text-slate-900 uppercase">
                            {selectedProf.banco || '___________'}
                          </span>
                        </div>
                        <div className="border-r border-slate-200/50 pr-2">
                          <span className="text-[8px] font-bold text-slate-500 uppercase block">Agência</span>
                          <span className="text-xs font-black text-slate-900 font-mono">
                            {selectedProf.agencia || '_____'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-500 uppercase block">Conta</span>
                          <span className="text-xs font-black text-slate-900 font-mono">
                            {selectedProf.conta || '_______________'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div> {/* End Table Form Container */}

              </div>

              {/* Legal verification footnote */}
              <div className="mt-8 text-center text-[10px] text-slate-400 font-semibold border-t border-slate-200/60 pt-4">
                documentação oficial corporativa fip - evace pós-graduação
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full text-center py-20 bg-white/70 rounded-2xl border border-slate-200/50 no-print">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-bold">Selecione ou adicione um professor para ver sua respectiva Ficha de Cadastro.</p>
          </div>
        )}
      </div>

      {/* LIGHTBOX DIALOG: ADD/EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide">
                    {editingProf ? 'Editar Ficha do Professor' : 'Preencher Ficha de Cadastro'}
                  </h3>
                  <p className="text-[10px] text-emerald-200 font-medium">
                    Preencha os campos para gerar o documento A4
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 px-2 rounded-lg bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900/80 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">
              
              {/* Group 1: Dados Pessoais */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block"></span>
                  1. Dados Pessoais do Docente
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Nome Completo</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: REGINA WALKER"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="Ex: 000.000.000-00"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">RG Número</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      placeholder="Ex: 000000000"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Órgão Expedidor</label>
                    <input
                      type="text"
                      name="rgOrgao"
                      value={formData.rgOrgao}
                      onChange={handleInputChange}
                      placeholder="Ex: DETRAN/RJ"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Data de Emissão</label>
                    <input
                      type="text"
                      name="rgEmissao"
                      value={formData.rgEmissao}
                      onChange={handleInputChange}
                      placeholder="Ex: 15/08/2012"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Naturalidade</label>
                    <input
                      type="text"
                      name="naturalidade"
                      value={formData.naturalidade}
                      onChange={handleInputChange}
                      placeholder="Ex: RIO DE JANEIRO"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Data de Nascimento</label>
                    <input
                      type="text"
                      name="dataNasc"
                      value={formData.dataNasc}
                      onChange={handleInputChange}
                      placeholder="Ex: 04/12/1976"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Nome da Mãe</label>
                    <input
                      type="text"
                      name="nomeMae"
                      value={formData.nomeMae}
                      onChange={handleInputChange}
                      placeholder="Nome da Mãe por extenso"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Nome do Pai</label>
                    <input
                      type="text"
                      name="nomePai"
                      value={formData.nomePai}
                      onChange={handleInputChange}
                      placeholder="Nome do Pai por extenso"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Formação Acadêmica */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block"></span>
                  2. Formação e Habilitação Acadêmica
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Graduação</label>
                    <input
                      type="text"
                      name="graduacao"
                      value={formData.graduacao}
                      onChange={handleInputChange}
                      placeholder="Ex: FARMÁCIA, BIOQUÍMICA"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Titulação Máxima</label>
                    <select
                      name="titulacao"
                      value={formData.titulacao}
                      onChange={handleInputChange}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 cursor-pointer"
                    >
                      <option value="Especialista">Especialista</option>
                      <option value="Mestre">Mestre</option>
                      <option value="Doutor">Doutor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Pós-Graduação (Especializações / Mestrados / Doutorados)</label>
                  <textarea
                    name="posGraduacao"
                    value={formData.posGraduacao}
                    onChange={handleInputChange}
                    placeholder="Ex: TERAPIA NUTRICIONAL; ESTÉTICA AVANÇADA; NEFROLOGIA; etc."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase resize-none"
                  />
                </div>
              </div>

              {/* Group 3: Localização e Contato */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block"></span>
                  3. Endereço e Canais de Contato
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Rua/Avenida (Logradouro)</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Ex: RUA SEBASTIÃO DUARTE MONTEIRO"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Número</label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      placeholder="Ex: 641"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Bairro</label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      placeholder="Ex: LEDA - BARRA DE SÃO JOÃO"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="Ex: 28880-000"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Ex: CASIMIRO DE ABREU"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Estado (UF)</label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      placeholder="Ex: RJ"
                      maxLength={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Celular principal</label>
                    <input
                      type="text"
                      name="telCel"
                      value={formData.telCel}
                      onChange={handleInputChange}
                      placeholder="Ex: (22) 99866-0078"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ex: docencia@gmail.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono lowercase"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Financeiro e Pix */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block"></span>
                  4. Dados Bancários e Chave Pix
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Chave Pix</label>
                    <input
                      type="text"
                      name="chavePix"
                      value={formData.chavePix}
                      onChange={handleInputChange}
                      placeholder="Ex: CELULAR (22) 99866-0078"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Banco</label>
                    <input
                      type="text"
                      name="banco"
                      value={formData.banco}
                      onChange={handleInputChange}
                      placeholder="Ex: BANCO BRADESCO"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Agência</label>
                    <input
                      type="text"
                      name="agencia"
                      value={formData.agencia}
                      onChange={handleInputChange}
                      placeholder="Ex: 0883"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Conta Corrente</label>
                    <input
                      type="text"
                      name="conta"
                      value={formData.conta}
                      onChange={handleInputChange}
                      placeholder="Ex: 0551132-1"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Salvar Cadastro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
