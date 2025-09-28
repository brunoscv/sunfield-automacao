import React, { useEffect, useState } from 'react'
import './App.css'

type User = {
  id?: number
  fullName: string
  cpfCnpj: string
  email: string
  phone?: string
}

type FileInfo = {
  id: number
  originalFilename: string
  contentType: string
  sizeBytes: number
  createdAt: string
  userId: number
  userName: string
  userCpfCnpj: string
  isPdf: () => boolean
  getFormattedSize: () => string
}

type Matriz = {
  id?: number
  nome: string
  endereco: string
  responsavel: string
  telefone: string
  geracaoKw: number
  porcentagemMatriz: number
  filiais?: Filial[]
  createdAt?: string
  updatedAt?: string
}

type Filial = {
  id?: number
  nome: string
  endereco: string
  responsavel: string
  telefone: string
  porcentagemEnergia: number
  matriz?: Matriz
  matrizId?: number
  createdAt?: string
  updatedAt?: string
}

type AuthState = {
  isAuthenticated: boolean
  user: { username: string; role: string } | null
}

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<FileInfo[]>([])
  const [matrizes, setMatrizes] = useState<Matriz[]>([])
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [form, setForm] = useState<User>({ fullName: '', cpfCnpj: '', email: '', phone: '' })
  const [matrizForm, setMatrizForm] = useState<Matriz>({ 
    nome: '', endereco: '', responsavel: '', telefone: '', geracaoKw: 0, porcentagemMatriz: 0 
  })
  const [filialForm, setFilialForm] = useState<Filial>({ 
    nome: '', endereco: '', responsavel: '', telefone: '', porcentagemEnergia: 0, matrizId: undefined 
  })
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  const load = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const loadFiles = async () => {
    try {
      const res = await fetch('/api/files')
      const data = await res.json()
      setFiles(data)
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error)
    }
  }

  const loadMatrizes = async () => {
    try {
      const res = await fetch('/api/matrizes/with-filiais')
      const data = await res.json()
      setMatrizes(data)
    } catch (error) {
      console.error('Erro ao carregar matrizes:', error)
    }
  }

  const loadFiliais = async () => {
    try {
      const res = await fetch('/api/filiais/with-matriz')
      const data = await res.json()
      setFiliais(data)
    } catch (error) {
      console.error('Erro ao carregar filiais:', error)
    }
  }

  const searchFiles = async (term: string) => {
    try {
      if (!term.trim()) {
        await loadFiles()
        return
      }
      const res = await fetch(`/api/files/search?q=${encodeURIComponent(term)}`)
      const data = await res.json()
      setFiles(data)
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error)
    }
  }

  useEffect(() => { 
    if (auth.isAuthenticated) {
      load() 
      loadFiles()
      loadMatrizes()
      loadFiliais()
    }
  }, [auth.isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      setAuth({
        isAuthenticated: true,
        user: { username: loginForm.username, role: 'Administrador' }
      })
      setLoginForm({ username: '', password: '' })
    } else {
      alert('Credenciais inválidas! Use admin/admin')
    }
  }

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null })
    setActiveTab('dashboard')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? `/api/users/${form.id}` : '/api/users'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      setForm({ fullName: '', cpfCnpj: '', email: '', phone: '' })
      await load()
      setActiveTab('users')
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const submitMatriz = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = matrizForm.id ? 'PUT' : 'POST'
      const url = matrizForm.id ? `/api/matrizes/${matrizForm.id}` : '/api/matrizes'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matrizForm)
      })

      if (!response.ok) {
        const errorText = await response.text()
        alert(`Erro: ${errorText}`)
        return
      }

      setMatrizForm({ nome: '', endereco: '', responsavel: '', telefone: '', geracaoKw: 0, porcentagemMatriz: 0 })
      await loadMatrizes()
      setActiveTab('matrizes')
    } catch (error) {
      console.error('Erro ao salvar matriz:', error)
      alert('Erro ao salvar matriz')
    }
  }

  const submitFilial = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = filialForm.id ? 'PUT' : 'POST'
      const url = filialForm.id ? `/api/filiais/${filialForm.id}` : '/api/filiais'
      
      const filialData = {
        ...filialForm,
        matriz: { id: filialForm.matrizId }
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filialData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        alert(`Erro: ${errorText}`)
        return
      }

      setFilialForm({ nome: '', endereco: '', responsavel: '', telefone: '', porcentagemEnergia: 0, matrizId: undefined })
      await loadFiliais()
      await loadMatrizes()
      setActiveTab('filiais')
    } catch (error) {
      console.error('Erro ao salvar filial:', error)
      alert('Erro ao salvar filial')
    }
  }

  const deleteMatriz = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta matriz?')) return
    
    try {
      const response = await fetch(`/api/matrizes/${id}`, { method: 'DELETE' })
      
      if (!response.ok) {
        const errorText = await response.text()
        alert(`Erro: ${errorText}`)
        return
      }

      await loadMatrizes()
      alert('Matriz excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir matriz:', error)
      alert('Erro ao excluir matriz')
    }
  }

  const deleteFilial = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta filial?')) return
    
    try {
      await fetch(`/api/filiais/${id}`, { method: 'DELETE' })
      await loadFiliais()
      await loadMatrizes()
      alert('Filial excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir filial:', error)
      alert('Erro ao excluir filial')
    }
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !selectedUserId) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', selectedUserId.toString())

    try {
      await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      setFile(null)
      setSelectedUserId(null)
      await loadFiles()
      alert('Arquivo enviado com sucesso!')
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error)
      alert('Erro ao enviar arquivo')
    }
  }

  const deleteFile = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return
    
    try {
      await fetch(`/api/files/${id}`, { method: 'DELETE' })
      await loadFiles()
      alert('Arquivo excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error)
      alert('Erro ao excluir arquivo')
    }
  }

  const viewFile = (file: FileInfo) => {
    if (file.isPdf()) {
      setSelectedFile(file)
      setShowPdfViewer(true)
    } else {
      alert('Visualização disponível apenas para arquivos PDF')
    }
  }

  const downloadFile = async (id: number, filename: string) => {
    try {
      const response = await fetch(`/api/files/${id}/download`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
      alert('Erro ao baixar arquivo')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>⚡ Energia Automation</h1>
            <p>Sistema de Gestão de Energia</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Usuário</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Entrar
            </button>
            
            <div className="login-help">
              <small>Use: admin / admin</small>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            {!sidebarCollapsed && <span className="logo-text">Energia</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Usuários
          </button>
          <button 
            className={`nav-item ${activeTab === 'matrizes' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrizes')}
          >
            🏢 Matrizes
          </button>
          <button 
            className={`nav-item ${activeTab === 'filiais' ? 'active' : ''}`}
            onClick={() => setActiveTab('filiais')}
          >
            🏪 Filiais
          </button>
          <button 
            className={`nav-item ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            📁 Arquivos
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📈 Relatórios
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-name">{auth.user?.username}</span>
                <span className="user-role">{auth.user?.role}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 {!sidebarCollapsed && 'Sair'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h1>{getPageTitle(activeTab)}</h1>
          <div className="top-bar-actions">
            <span className="welcome-text">Bem-vindo, {auth.user?.username}!</span>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total de Usuários</h3>
                  <p className="stat-number">{users.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3>Total de Matrizes</h3>
                  <p className="stat-number">{matrizes.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏪</div>
                <div className="stat-content">
                  <h3>Total de Filiais</h3>
                  <p className="stat-number">{filiais.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-content">
                  <h3>Total de Arquivos</h3>
                  <p className="stat-number">{files.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>Gerenciar Usuários</h2>
                <button className="add-user-btn" onClick={() => setActiveTab('add-user')}>
                  + Novo Usuário
                </button>
              </div>
              
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF/CNPJ</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.fullName}</td>
                        <td>{u.cpfCnpj}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <button 
                            className="action-btn edit"
                            onClick={() => {
                              setForm(u)
                              setActiveTab('edit-user')
                            }}
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add-user' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Novo Usuário</h2>
                <button className="back-btn" onClick={() => setActiveTab('users')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      placeholder="Nome completo"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CPF/CNPJ</label>
                    <input
                      placeholder="CPF/CNPJ"
                      value={form.cpfCnpj}
                      onChange={e => setForm({ ...form, cpfCnpj: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      placeholder="Email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Salvar Usuário
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setForm({ fullName: '', cpfCnpj: '', email: '', phone: '' })
                      setActiveTab('users')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'edit-user' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Editar Usuário</h2>
                <button className="back-btn" onClick={() => setActiveTab('users')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      placeholder="Nome completo"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CPF/CNPJ</label>
                    <input
                      placeholder="CPF/CNPJ"
                      value={form.cpfCnpj}
                      onChange={e => setForm({ ...form, cpfCnpj: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      placeholder="Email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Atualizar Usuário
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setForm({ fullName: '', cpfCnpj: '', email: '', phone: '' })
                      setActiveTab('users')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'matrizes' && (
            <div className="matrizes-section">
              <div className="section-header">
                <h2>Gerenciar Matrizes</h2>
                <button className="add-user-btn" onClick={() => setActiveTab('add-matriz')}>
                  + Nova Matriz
                </button>
              </div>
              
              <div className="matrizes-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Responsável</th>
                      <th>Telefone</th>
                      <th>Geração (kW)</th>
                      <th>% Matriz</th>
                      <th>Filiais</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrizes.map(m => (
                      <tr key={m.id}>
                        <td>{m.nome}</td>
                        <td>{m.responsavel}</td>
                        <td>{m.telefone}</td>
                        <td>{m.geracaoKw} kW</td>
                        <td>{m.porcentagemMatriz}%</td>
                        <td>{m.filiais?.length || 0}</td>
                        <td>
                          <button 
                            className="action-btn edit"
                            onClick={() => {
                              setMatrizForm(m)
                              setActiveTab('edit-matriz')
                            }}
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteMatriz(m.id!)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add-matriz' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Nova Matriz</h2>
                <button className="back-btn" onClick={() => setActiveTab('matrizes')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submitMatriz} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome da Matriz</label>
                    <input
                      placeholder="Nome da matriz"
                      value={matrizForm.nome}
                      onChange={e => setMatrizForm({ ...matrizForm, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Responsável</label>
                    <input
                      placeholder="Nome do responsável"
                      value={matrizForm.responsavel}
                      onChange={e => setMatrizForm({ ...matrizForm, responsavel: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={matrizForm.telefone}
                      onChange={e => setMatrizForm({ ...matrizForm, telefone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      placeholder="Endereço completo"
                      value={matrizForm.endereco}
                      onChange={e => setMatrizForm({ ...matrizForm, endereco: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Geração (kW)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Geração em kW"
                      value={matrizForm.geracaoKw}
                      onChange={e => setMatrizForm({ ...matrizForm, geracaoKw: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Porcentagem da Matriz (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Porcentagem destinada à matriz"
                      value={matrizForm.porcentagemMatriz}
                      onChange={e => setMatrizForm({ ...matrizForm, porcentagemMatriz: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Salvar Matriz
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setMatrizForm({ nome: '', endereco: '', responsavel: '', telefone: '', geracaoKw: 0, porcentagemMatriz: 0 })
                      setActiveTab('matrizes')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'edit-matriz' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Editar Matriz</h2>
                <button className="back-btn" onClick={() => setActiveTab('matrizes')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submitMatriz} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome da Matriz</label>
                    <input
                      placeholder="Nome da matriz"
                      value={matrizForm.nome}
                      onChange={e => setMatrizForm({ ...matrizForm, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Responsável</label>
                    <input
                      placeholder="Nome do responsável"
                      value={matrizForm.responsavel}
                      onChange={e => setMatrizForm({ ...matrizForm, responsavel: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={matrizForm.telefone}
                      onChange={e => setMatrizForm({ ...matrizForm, telefone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      placeholder="Endereço completo"
                      value={matrizForm.endereco}
                      onChange={e => setMatrizForm({ ...matrizForm, endereco: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Geração (kW)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Geração em kW"
                      value={matrizForm.geracaoKw}
                      onChange={e => setMatrizForm({ ...matrizForm, geracaoKw: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Porcentagem da Matriz (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Porcentagem destinada à matriz"
                      value={matrizForm.porcentagemMatriz}
                      onChange={e => setMatrizForm({ ...matrizForm, porcentagemMatriz: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Atualizar Matriz
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setMatrizForm({ nome: '', endereco: '', responsavel: '', telefone: '', geracaoKw: 0, porcentagemMatriz: 0 })
                      setActiveTab('matrizes')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'filiais' && (
            <div className="filiais-section">
              <div className="section-header">
                <h2>Gerenciar Filiais</h2>
                <button className="add-user-btn" onClick={() => setActiveTab('add-filial')}>
                  + Nova Filial
                </button>
              </div>
              
              <div className="filiais-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Matriz</th>
                      <th>Responsável</th>
                      <th>Telefone</th>
                      <th>% Energia</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filiais.map(f => (
                      <tr key={f.id}>
                        <td>{f.nome}</td>
                        <td>{f.matriz?.nome}</td>
                        <td>{f.responsavel}</td>
                        <td>{f.telefone}</td>
                        <td>{f.porcentagemEnergia}%</td>
                        <td>
                          <button 
                            className="action-btn edit"
                            onClick={() => {
                              setFilialForm({ ...f, matrizId: f.matriz?.id })
                              setActiveTab('edit-filial')
                            }}
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteFilial(f.id!)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add-filial' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Nova Filial</h2>
                <button className="back-btn" onClick={() => setActiveTab('filiais')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submitFilial} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matriz</label>
                    <select
                      value={filialForm.matrizId || ''}
                      onChange={e => setFilialForm({ ...filialForm, matrizId: Number(e.target.value) || undefined })}
                      required
                    >
                      <option value="">Selecione uma matriz</option>
                      {matrizes.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nome} - {m.responsavel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nome da Filial</label>
                    <input
                      placeholder="Nome da filial"
                      value={filialForm.nome}
                      onChange={e => setFilialForm({ ...filialForm, nome: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Responsável</label>
                    <input
                      placeholder="Nome do responsável"
                      value={filialForm.responsavel}
                      onChange={e => setFilialForm({ ...filialForm, responsavel: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={filialForm.telefone}
                      onChange={e => setFilialForm({ ...filialForm, telefone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      placeholder="Endereço completo"
                      value={filialForm.endereco}
                      onChange={e => setFilialForm({ ...filialForm, endereco: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Porcentagem de Energia (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Porcentagem de energia"
                      value={filialForm.porcentagemEnergia}
                      onChange={e => setFilialForm({ ...filialForm, porcentagemEnergia: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Salvar Filial
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setFilialForm({ nome: '', endereco: '', responsavel: '', telefone: '', porcentagemEnergia: 0, matrizId: undefined })
                      setActiveTab('filiais')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'edit-filial' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Editar Filial</h2>
                <button className="back-btn" onClick={() => setActiveTab('filiais')}>
                  ← Voltar
                </button>
              </div>
              
              <form onSubmit={submitFilial} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Matriz</label>
                    <select
                      value={filialForm.matrizId || ''}
                      onChange={e => setFilialForm({ ...filialForm, matrizId: Number(e.target.value) || undefined })}
                      required
                      disabled
                    >
                      <option value="">Selecione uma matriz</option>
                      {matrizes.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nome} - {m.responsavel}
                        </option>
                      ))}
                    </select>
                    <small>A matriz não pode ser alterada após a criação</small>
                  </div>
                  <div className="form-group">
                    <label>Nome da Filial</label>
                    <input
                      placeholder="Nome da filial"
                      value={filialForm.nome}
                      onChange={e => setFilialForm({ ...filialForm, nome: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Responsável</label>
                    <input
                      placeholder="Nome do responsável"
                      value={filialForm.responsavel}
                      onChange={e => setFilialForm({ ...filialForm, responsavel: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      placeholder="Telefone"
                      value={filialForm.telefone}
                      onChange={e => setFilialForm({ ...filialForm, telefone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      placeholder="Endereço completo"
                      value={filialForm.endereco}
                      onChange={e => setFilialForm({ ...filialForm, endereco: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Porcentagem de Energia (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Porcentagem de energia"
                      value={filialForm.porcentagemEnergia}
                      onChange={e => setFilialForm({ ...filialForm, porcentagemEnergia: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Atualizar Filial
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setFilialForm({ nome: '', endereco: '', responsavel: '', telefone: '', porcentagemEnergia: 0, matrizId: undefined })
                      setActiveTab('filiais')
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="files-section">
              <div className="section-header">
                <h2>Gerenciar Arquivos</h2>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar arquivos..."
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value)
                      searchFiles(e.target.value)
                    }}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="upload-section">
                <h3>Upload de Arquivo</h3>
                <form onSubmit={upload} className="upload-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Usuário</label>
                      <select
                        value={selectedUserId || ''}
                        onChange={e => setSelectedUserId(Number(e.target.value) || null)}
                        required
                      >
                        <option value="">Selecione um usuário</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} - {u.cpfCnpj}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Arquivo</label>
                      <input
                        type="file"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="upload-btn">
                    📤 Enviar Arquivo
                  </button>
                </form>
              </div>

              <div className="files-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome do Arquivo</th>
                      <th>Usuário</th>
                      <th>Tamanho</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map(f => (
                      <tr key={f.id}>
                        <td>{f.originalFilename}</td>
                        <td>{f.userName}</td>
                        <td>{f.getFormattedSize()}</td>
                        <td>{formatDate(f.createdAt)}</td>
                        <td>
                          <button 
                            className="action-btn view"
                            onClick={() => viewFile(f)}
                          >
                            👁️
                          </button>
                          <button 
                            className="action-btn download"
                            onClick={() => downloadFile(f.id, f.originalFilename)}
                          >
                            📥
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteFile(f.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <div className="section-header">
                <h2>Relatórios</h2>
              </div>
              
              <div className="reports-grid">
                <div className="report-card">
                  <h3>📊 Relatório de Usuários</h3>
                  <p>Visualize estatísticas dos usuários cadastrados</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
                
                <div className="report-card">
                  <h3>📁 Relatório de Arquivos</h3>
                  <p>Análise dos arquivos enviados por período</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
                
                <div className="report-card">
                  <h3>⚡ Relatório de Energia</h3>
                  <p>Análise de consumo e geração de energia</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showPdfViewer && selectedFile && (
        <div className="modal-overlay" onClick={() => setShowPdfViewer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📄 {selectedFile.originalFilename}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPdfViewer(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src={`/api/files/${selectedFile.id}/view`}
                width="100%"
                height="600px"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getPageTitle(tab: string): string {
  const titles: { [key: string]: string } = {
    dashboard: '📊 Dashboard',
    users: '👥 Usuários',
    matrizes: '🏢 Matrizes',
    filiais: '🏪 Filiais',
    files: '📁 Arquivos',
    reports: '📈 Relatórios',
    'add-user': '👥 Novo Usuário',
    'edit-user': '👥 Editar Usuário',
    'add-matriz': '🏢 Nova Matriz',
    'edit-matriz': '🏢 Editar Matriz',
    'add-filial': '🏪 Nova Filial',
    'edit-filial': '🏪 Editar Filial'
  }
  return titles[tab] || '📊 Dashboard'
}

export default App


