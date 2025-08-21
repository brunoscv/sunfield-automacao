import React, { useEffect, useState } from 'react'

type User = {
  id?: number
  fullName: string
  cpfCnpj: string
  email: string
  phone?: string
}

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<User>({ fullName: '', cpfCnpj: '', email: '', phone: '' })
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const load = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ fullName: '', cpfCnpj: '', email: '', phone: '' })
    await load()
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !file) return
    const fd = new FormData()
    fd.append('file', file)
    await fetch(`/api/users/${selectedUserId}/upload`, { method: 'POST', body: fd })
    setFile(null)
    alert('Upload concluído')
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Energia Dashboard</h1>
      <section style={{ marginBottom: '2rem' }}>
        <h2>Novo usuário</h2>
        <form onSubmit={submit} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <input placeholder="Nome completo" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          <input placeholder="CPF/CNPJ" value={form.cpfCnpj} onChange={e => setForm({ ...form, cpfCnpj: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <button type="submit" style={{ gridColumn: '1 / span 2' }}>Salvar</button>
        </form>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Usuários</h2>
        <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Nome</th>
              <th align="left">CPF/CNPJ</th>
              <th align="left">Email</th>
              <th align="left">Telefone</th>
              <th align="left">Ações</th>
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
                  <button onClick={() => setSelectedUserId(u.id!)}>Selecionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Upload de PDF</h2>
        <form onSubmit={upload}>
          <div style={{ marginBottom: 8 }}>
            <label>Usuário selecionado: {selectedUserId ?? 'nenhum'}</label>
          </div>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          <button type="submit" disabled={!selectedUserId || !file}>Enviar</button>
        </form>
      </section>
    </div>
  )
}


