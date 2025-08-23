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

type AuthState = {
  isAuthenticated: boolean
  user: { username: string; role: string } | null
}

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<FileInfo[]>([])
  const [form, setForm] = useState<User>({ fullName: '', cpfCnpj: '', email: '', phone: '' })
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
    }
  }, [auth.isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de login - em produção seria uma chamada para API
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
    setUsers([])
    setFiles([])
    setActiveTab('dashboard')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setForm({ fullName: '', cpfCnpj: '', email: '', phone: '' })
      await load()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !file) return
    try {
      const fd = new FormData()
      fd.append('file', file)
      await fetch(`/api/users/${selectedUserId}/upload`, { method: 'POST', body: fd })
      setFile(null)
      setSelectedUserId(null)
      alert('Upload concluído')
      await loadFiles() // Recarregar lista de arquivos
    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  const deleteFile = async (fileId: number) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return
    
    try {
      await fetch(`/api/files/${fileId}`, { method: 'DELETE' })
      await loadFiles() // Recarregar lista de arquivos
      alert('Arquivo excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error)
    }
  }

  const viewFile = (fileInfo: FileInfo) => {
    setSelectedFile(fileInfo)
    setShowPdfViewer(true)
  }

  const downloadFile = (fileId: number, filename: string) => {
    window.open(`/api/files/${fileId}/download`, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">⚡</div>
              <h1>Energia Solar</h1>
            </div>
            <p>Dashboard Administrativo</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Usuário</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                placeholder="Digite seu usuário"
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                placeholder="Digite sua senha"
              />
            </div>
            <button type="submit" className="login-btn">
              Entrar
            </button>
          </form>
          <div className="login-footer">
            <p>Use: admin / admin</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            {!sidebarCollapsed && <h2>Energia Solar</h2>}
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
            <div className="user-avatar">👤</div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <p className="username">{auth.user?.username}</p>
                <p className="user-role">{auth.user?.role}</p>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h1>{getPageTitle(activeTab)}</h1>
          <div className="header-actions">
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
                <div className="stat-icon">📁</div>
                <div className="stat-content">
                  <h3>Total de Arquivos</h3>
                  <p className="stat-number">{files.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>Projetos Ativos</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Faturamento</h3>
                  <p className="stat-number">R$ 0</p>
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
                          <button 
                            className="action-btn delete"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este usuário?')) {
                                // Implementar exclusão
                              }
                            }}
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

          {activeTab === 'files' && (
            <div className="files-section">
              <div className="section-header">
                <h2>Gerenciar Arquivos</h2>
                <button className="add-user-btn" onClick={() => setActiveTab('upload-file')}>
                  + Novo Upload
                </button>
              </div>

              {/* Busca de arquivos */}
              <div className="search-section">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar por nome do arquivo, usuário ou CPF/CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button 
                    className="search-btn"
                    onClick={() => searchFiles(searchTerm)}
                  >
                    🔍 Buscar
                  </button>
                  <button 
                    className="clear-search-btn"
                    onClick={() => {
                      setSearchTerm('')
                      loadFiles()
                    }}
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Lista de arquivos */}
              <div className="files-list-container">
                <h3>Arquivos ({files.length})</h3>
                {files.length === 0 ? (
                  <div className="no-files">
                    <p>Nenhum arquivo encontrado.</p>
                  </div>
                ) : (
                  <div className="files-grid">
                    {files.map(f => (
                      <div key={f.id} className="file-card">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <h4>{f.originalFilename}</h4>
                          <p>{f.userCpfCnpj}</p>
                    
                        </div>
                        <div className="file-actions">
                          <button 
                            className="action-btn view"
                            onClick={() => viewFile(f)}
                          >
                            👀
                          </button>
                          <button 
                            className="action-btn download"
                            onClick={() => downloadFile(f.id, f.originalFilename)}
                          >
                            ⬇️
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteFile(f.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload-file' && (
            <div className="form-section">
              <div className="section-header">
                <h2>Upload de Arquivo</h2>
                <button className="back-btn" onClick={() => setActiveTab('files')}>
                  ← Voltar
                </button>
              </div>
              
              <div className="upload-section">
                <h3>Upload de PDF</h3>
                <form onSubmit={upload} className="upload-form">
                  <div className="form-group">
                    <label>Selecionar Usuário</label>
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
                    <label>Arquivo PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={e => setFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={!selectedUserId || !file}
                    >
                      Enviar Arquivo
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setActiveTab('files')}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
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
                  <h3>Relatório de Usuários</h3>
                  <p>Gere relatórios detalhados sobre usuários cadastrados</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
                <div className="report-card">
                  <h3>Relatório de Arquivos</h3>
                  <p>Visualize estatísticas de uploads e arquivos</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
                <div className="report-card">
                  <h3>Relatório Financeiro</h3>
                  <p>Análise de faturamento e projetos</p>
                  <button className="report-btn">Gerar Relatório</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedFile && (
        <div className="pdf-modal-overlay" onClick={() => setShowPdfViewer(false)}>
          <div className="pdf-modal" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>{selectedFile.originalFilename}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPdfViewer(false)}
              >
                ✕
              </button>
            </div>
            <div className="pdf-modal-content">
              <iframe
                src={`/api/files/${selectedFile.id}/view`}
                title={selectedFile.originalFilename}
                width="100%"
                height="600px"
                frameBorder="0"
              />
            </div>
            <div className="pdf-modal-footer">
              <button 
                className="download-btn"
                onClick={() => downloadFile(selectedFile.id, selectedFile.originalFilename)}
              >
                ⬇️ Download
              </button>
              <button 
                className="close-btn"
                onClick={() => setShowPdfViewer(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getPageTitle(tab: string): string {
  switch (tab) {
    case 'dashboard': return 'Dashboard'
    case 'users': return 'Gerenciar Usuários'
    case 'add-user': return 'Novo Usuário'
    case 'edit-user': return 'Editar Usuário'
    case 'files': return 'Gerenciar Arquivos'
    case 'upload-file': return 'Upload de Arquivo'
    case 'reports': return 'Relatórios'
    default: return 'Dashboard'
  }
}


