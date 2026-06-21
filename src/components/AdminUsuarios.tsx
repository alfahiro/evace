import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Briefcase, 
  GraduationCap, 
  Key, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  RefreshCw, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';
import { Student, Turma } from '../types';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
  associatedId?: string; // Student ID or Professor ID
  email?: string;
  createdAt: string;
}

interface AdminUsuariosProps {
  students: Student[];
  turmas: Turma[];
}

export default function AdminUsuarios({ students, turmas }: AdminUsuariosProps) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'professor' | 'aluno'>('aluno');
  const [formAssociatedId, setFormAssociatedId] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // Load and seed users
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('evace_auth_users');
      let parsed: UserAccount[] = savedAccounts ? JSON.parse(savedAccounts) : [];

      // Check if user "renan" exists; if not, seed him as admin
      const hasRenan = parsed.some(u => u.username.toLowerCase() === 'renan');
      if (!hasRenan) {
        const seeded: UserAccount[] = [
          {
            id: 'seeded-renan-admin',
            username: 'renan',
            password: '88165169',
            name: 'Renan Cabral',
            role: 'admin',
            email: 'renancabralbatista@gmail.com',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-romulo-admin',
            username: 'romulo',
            password: 'admin123',
            name: 'Rômulo Carriello',
            role: 'admin',
            email: 'romulo.carriello@evace.com.br',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-patricia-prof',
            username: 'patricia',
            password: '123',
            name: 'Prof.ª Patrícia Walker',
            role: 'professor',
            associatedId: 'prof-1',
            email: 'patricia.walker@evace.com.br',
            createdAt: new Date().toISOString()
          },
          {
            id: 'seeded-marcos-prof',
            username: 'marcos',
            password: '123',
            name: 'Prof. Dr. Marcos Albuquerque',
            role: 'professor',
            associatedId: 'prof-2',
            email: 'marcos.albuquerque@evace.com.br',
            createdAt: new Date().toISOString()
          }
        ];
        
        // Let's also seed accounts for the preseeded students to make evaluating simple and elegant!
        students.forEach((s, idx) => {
          const defaultUsername = s.name.toLowerCase().split(' ')[0] + (idx + 1);
          seeded.push({
            id: `seeded-student-${s.id}`,
            username: defaultUsername,
            password: '123',
            name: s.name,
            role: 'aluno',
            associatedId: s.id,
            email: s.email,
            createdAt: new Date().toISOString()
          });
        });

        parsed = [...seeded, ...parsed];
        localStorage.setItem('evace_auth_users', JSON.stringify(parsed));
      }
      setUsers(parsed);
    } catch (e) {
      console.error('Error reading/seeding evace_auth_users', e);
    }
  }, [students]);

  // Save implementation
  const saveToStorage = (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('evace_auth_users', JSON.stringify(updatedUsers));
  };

  // Quick feedback timer helper
  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(msg);
      setError('');
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  // Generate accounts for missing students and teachers
  const handleAutoGenerateMissing = () => {
    try {
      const savedProfsStr = localStorage.getItem('evace_professores');
      const savedProfs = savedProfsStr ? JSON.parse(savedProfsStr) : [
        { id: 'prof-1', name: 'Prof.ª Patrícia Walker', cpf: '000.111.222-33', email: 'patricia.walker@evace.com.br' },
        { id: 'prof-2', name: 'Prof. Dr. Marcos Albuquerque', cpf: '444.555.666-77', email: 'marcos.albuquerque@evace.com.br' }
      ];

      const updated = [...users];
      let generatedCount = 0;

      // 1. Sync students
      students.forEach(s => {
        const hasAccount = updated.some(u => u.associatedId === s.id && u.role === 'aluno');
        if (!hasAccount) {
          const baseUser = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
          const finalUsername = `${baseUser.substring(0, 8)}${Math.floor(Math.random() * 90 + 10)}`;
          updated.push({
            id: `gen-stud-${s.id}-${Date.now()}`,
            username: finalUsername,
            password: '123',
            name: s.name,
            role: 'aluno',
            associatedId: s.id,
            email: s.email,
            createdAt: new Date().toISOString()
          });
          generatedCount++;
        }
      });

      // 2. Sync professors
      savedProfs.forEach((p: any) => {
        const hasAccount = updated.some(u => u.associatedId === p.id && u.role === 'professor');
        if (!hasAccount) {
          const baseUser = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace('prof.', '').replace('prof.ª', '').replace('dr.', '');
          const finalUsername = baseUser.substring(0, 10).trim();
          updated.push({
            id: `gen-prof-${p.id}-${Date.now()}`,
            username: finalUsername,
            password: '123',
            name: p.name,
            role: 'professor',
            associatedId: p.id,
            email: p.email,
            createdAt: new Date().toISOString()
          });
          generatedCount++;
        }
      });

      if (generatedCount > 0) {
        saveToStorage(updated);
        showFeedback(`${generatedCount} conta(s) criadas com senha inicial "123"!`);
      } else {
        showFeedback('Todos os alunos e professores cadastrados já possuem login.');
      }
    } catch {
      showFeedback('Erro ao sincronizar cadastros.', true);
    }
  };

  const clearForm = () => {
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('aluno');
    setFormAssociatedId('');
    setFormEmail('');
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = formUsername.trim().toLowerCase();
    if (!trimmedUsername || !formPassword || !formName.trim()) {
      showFeedback('Preencha os campos obrigatórios (Nome, Login e Senha)', true);
      return;
    }

    // Check unique username
    const exists = users.some(u => u.username.toLowerCase() === trimmedUsername && u.id !== editingId);
    if (exists) {
      showFeedback(`O login "${trimmedUsername}" já está em uso por outro usuário.`, true);
      return;
    }

    if (editingId) {
      // Edit mode
      const updated = users.map(u => {
        if (u.id === editingId) {
          return {
            ...u,
            name: formName.trim(),
            username: trimmedUsername,
            password: formPassword,
            role: formRole,
            associatedId: formRole !== 'admin' ? formAssociatedId || undefined : undefined,
            email: formEmail.trim() || undefined
          };
        }
        return u;
      });
      saveToStorage(updated);
      showFeedback('Usuário atualizado com sucesso!');
      clearForm();
      setIsAdding(false);
    } else {
      // Add mode
      const newUser: UserAccount = {
        id: `account_${Date.now()}`,
        name: formName.trim(),
        username: trimmedUsername,
        password: formPassword,
        role: formRole,
        associatedId: formRole !== 'admin' ? formAssociatedId || undefined : undefined,
        email: formEmail.trim() || undefined,
        createdAt: new Date().toISOString()
      };
      
      saveToStorage([newUser, ...users]);
      showFeedback(`Nova conta de acesso (${formRole}) criada com sucesso!`);
      clearForm();
      setIsAdding(false);
    }
  };

  const handleStartEdit = (user: UserAccount) => {
    setEditingId(user.id);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword(user.password);
    setFormRole(user.role);
    setFormAssociatedId(user.associatedId || '');
    setFormEmail(user.email || '');
    setIsAdding(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (name.toLowerCase() === 'renan') {
      showFeedback('A conta de administrador do Renan não pode ser deletada para evitar perda de login.', true);
      return;
    }
    if (confirm(`Deseja realmente remover o acesso de "${name}"?`)) {
      const filtered = users.filter(u => u.id !== id);
      saveToStorage(filtered);
      showFeedback(`Acesso de "${name}" removido.`);
    }
  };

  // Get dynamic list of links depending on role
  const getDisponiblesLinks = () => {
    if (formRole === 'aluno') {
      return students.map(s => ({ id: s.id, name: `${s.name} (Al.)` }));
    } else if (formRole === 'professor') {
      // Load professors from localStorage
      try {
        const savedProfsStr = localStorage.getItem('evace_professores');
        const savedProfs = savedProfsStr ? JSON.parse(savedProfsStr) : [
          { id: 'prof-1', name: 'Prof.ª Patrícia Walker' },
          { id: 'prof-2', name: 'Prof. Dr. Marcos Albuquerque' }
        ];
        return savedProfs.map((p: any) => ({ id: p.id, name: `${p.name} (Prof.)` }));
      } catch {
        return [];
      }
    }
    return [];
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50/50 backdrop-blur-md rounded-3xl border border-slate-200/60 p-6 md:p-8 space-y-6" id="usuarios-management-container">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Key className="w-5.5 h-5.5 text-[#0a4d2c]" />
            <span>Controle de Acessos & Perfis</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Gerencie logins corporativos de coordenadores, professores e alunos. Quem define o perfil é a administração acadêmica.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAutoGenerateMissing}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0a4d2c] rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 border border-emerald-200/40 cursor-pointer"
            title="Gera credenciais automáticas com senha '123' para os alunos e professores cadastrados"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sincronizar Cadastros</span>
          </button>

          <button
            onClick={() => {
              if (isAdding) {
                clearForm();
                setIsAdding(false);
              } else {
                clearForm();
                setIsAdding(true);
              }
            }}
            className="px-4 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAdding ? 'Cancelar Cadastro' : 'Novo Acesso'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUSES */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{success}</span>
        </div>
      )}

      {/* EXPANDABLE CREATION FORM */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">
            {editingId ? 'Editar Credenciais de Acesso' : 'Configurar Nova Conta de Acesso'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Nome Completo *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Geraldo Mendes"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-semibold"
              />
            </div>

            {/* Login */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Login de Usuário *</label>
              <input
                type="text"
                required
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Ex: geraldo.mendes"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-bold font-mono"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Senha de Acesso *</label>
              <input
                type="text"
                required
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Ex: 88165169"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-bold"
              />
            </div>

            {/* Profile Role Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Nível de Perfil *</label>
              <select
                value={formRole}
                onChange={(e) => {
                  setFormRole(e.target.value as any);
                  setFormAssociatedId('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-extrabold uppercase"
              >
                <option value="admin">Coordenação Acadêmica (ADMIN)</option>
                <option value="professor">Professor Docente (PROFESSOR)</option>
                <option value="aluno">Aluno da Instituição (ALUNO)</option>
              </select>
            </div>

            {/* Optional Associated ID (Links Student or Teacher register info) */}
            {formRole !== 'admin' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Vincular ao Cadastro de {formRole === 'aluno' ? 'Alunos' : 'Professores'}
                </label>
                <select
                  value={formAssociatedId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setFormAssociatedId(id);
                    // Autofill name and email if linked!
                    const linked = getDisponiblesLinks().find(l => l.id === id);
                    if (linked) {
                      // Remove suffix prefix tag
                      const cleanedName = linked.name.replace(' (Al.)', '').replace(' (Prof.)', '');
                      if (!formName) setFormName(cleanedName);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50 font-semibold"
                >
                  <option value="">-- Nenhum vínculo (Uso avulso/geral) --</option>
                  {getDisponiblesLinks().map(link => (
                    <option key={link.id} value={link.id}>
                      {link.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">E-mail de Contato (Opcional)</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Ex: renan@gmail.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                clearForm();
                setIsAdding(false);
              }}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0a4d2c] hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              {editingId ? 'Salvar Alterações' : 'Concluir Cadastro'}
            </button>
          </div>
        </form>
      )}

      {/* SEARCH AND COUNTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar contas de acesso..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4d2c] bg-white font-medium"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Admins: {users.filter(u => u.role === 'admin').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Professores: {users.filter(u => u.role === 'professor').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Alunos: {users.filter(u => u.role === 'aluno').length}
          </span>
        </div>
      </div>

      {/* USER LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-slate-200/50 text-slate-400">
            <UserPlus className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
            <p className="text-xs font-bold">Nenhum login corporativo encontrado para o filtro.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 ${
                user.username === 'renan' 
                  ? 'border-emerald-300 bg-emerald-50/5' 
                  : 'border-slate-200/80 hover:border-slate-305'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-900' 
                      : user.role === 'professor'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-[#0a4d2c]'
                  }`}>
                    {user.role === 'admin' && <Shield className="w-4 h-4" />}
                    {user.role === 'professor' && <Briefcase className="w-4 h-4" />}
                    {user.role === 'aluno' && <GraduationCap className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 flex-wrap">
                      <span>{user.name}</span>
                      {user.username === 'renan' && (
                        <span className="text-[8px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.5 rounded uppercase">
                          Você
                        </span>
                      )}
                      <span className={`text-[8.5px] font-black uppercase text-center px-2 py-0.5 rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : user.role === 'professor'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      }`}>
                        {user.role === 'admin' ? 'Coordenador ADM' : user.role === 'professor' ? 'Docente' : 'Discente'}
                      </span>
                    </h4>
                    
                    <div className="mt-2 space-y-1 font-mono text-[10.5px]">
                      <div className="text-slate-500">
                        <span className="font-bold text-slate-700">Login:</span> {user.username}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <span className="font-bold text-slate-700">Senha:</span> 
                        <span className="bg-slate-100 px-1 rounded font-bold text-slate-700 select-all">{user.password}</span>
                      </div>
                      {user.email && (
                        <div className="text-slate-400 text-[10px]">
                          <span className="font-bold text-slate-600">E-mail:</span> {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(user)}
                    className="p-1.5 text-slate-500 hover:text-[#0a4d2c] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Editar Credenciais"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="p-1.5 text-slate-405 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remover Acesso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Linking diagnostics */}
              {user.associatedId ? (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[9px] text-[#0a4d2c] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Vínculo ativo de dados: ID {user.associatedId}</span>
                </div>
              ) : (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Acesso Geral (Sem vínculo de cadastro físico)</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
