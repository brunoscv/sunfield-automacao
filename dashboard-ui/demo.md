# 🚀 Demonstração do Dashboard

## Como Testar o Sistema

### 1. Iniciar o Backend
```bash
# Na pasta raiz do projeto
cd dashboard-api
mvn spring-boot:run
```

O backend estará rodando em `http://localhost:8080`

### 2. Iniciar o Frontend
```bash
# Em outro terminal, na pasta dashboard-ui
cd dashboard-ui
npm run dev
```

O dashboard estará disponível em `http://localhost:5173`

### 3. Testar o Sistema de Login
- **URL**: `http://localhost:5173`
- **Usuário**: `admin`
- **Senha**: `admin`

### 4. Funcionalidades para Testar

#### Dashboard Principal
- ✅ Visualizar cards de estatísticas (incluindo total de arquivos)
- ✅ Sidebar colapsável
- ✅ Navegação entre abas

#### Gerenciamento de Usuários
- ✅ Listar usuários existentes
- ✅ Adicionar novo usuário
- ✅ Editar usuário existente
- ✅ Excluir usuário (com confirmação)

#### 🆕 Gerenciamento de Arquivos (NOVO!)
- ✅ **Lista de arquivos**: Visualizar todos os arquivos com informações do usuário
- ✅ **Busca avançada**: Buscar por nome do arquivo, usuário ou CPF/CNPJ
- ✅ **Upload de PDF**: Envio de documentos para usuários específicos
- ✅ **Visualização de PDF**: Clique no ícone 👁️ para visualizar PDFs inline
- ✅ **Download de arquivos**: Botão ⬇️ para download
- ✅ **Exclusão de arquivos**: Botão 🗑️ para remover arquivos
- ✅ **Informações detalhadas**: Nome, usuário, tamanho, data de criação

#### Upload de Arquivos
- ✅ Selecionar usuário
- ✅ Fazer upload de PDF
- ✅ Validação de arquivo
- ✅ **Recarregamento automático** da lista após upload

#### Relatórios
- ✅ Visualizar cards de relatórios
- ✅ Interface preparada para funcionalidades futuras

### 5. Fluxo de Teste Recomendado

1. **Login**: Acesse com admin/admin
2. **Dashboard**: Verifique os cards de estatísticas (agora mostra total de arquivos)
3. **Usuários**: Navegue para a aba de usuários
4. **Adicionar**: Crie um novo usuário de teste
5. **Editar**: Modifique os dados do usuário criado
6. **Arquivos**: Navegue para a aba de arquivos
7. **Upload**: Faça upload de um PDF para o usuário criado
8. **Listagem**: Verifique se o arquivo aparece na lista
9. **Busca**: Teste a funcionalidade de busca
10. **Visualização**: Clique no ícone 👁️ para visualizar o PDF
11. **Download**: Teste o download do arquivo
12. **Exclusão**: Teste a exclusão de arquivos
13. **Relatórios**: Explore a aba de relatórios
14. **Responsividade**: Teste em diferentes tamanhos de tela

### 6. Dados de Exemplo

#### Usuário de Teste
```json
{
  "fullName": "João Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao.silva@email.com",
  "phone": "(11) 99999-9999"
}
```

#### Arquivo de Teste
- Tipo: PDF
- Tamanho: Qualquer arquivo PDF válido
- Usuário: Selecionar um usuário existente

### 7. Verificações de Funcionalidade

#### ✅ Sistema de Login
- [ ] Tela de login aparece primeiro
- [ ] Validação de credenciais funciona
- [ ] Redirecionamento após login
- [ ] Botão de logout funciona

#### ✅ Navegação
- [ ] Sidebar expande/colapsa
- [ ] Abas funcionam corretamente
- [ ] Breadcrumbs e navegação funcionam
- [ ] Responsividade em mobile

#### ✅ CRUD de Usuários
- [ ] Listagem funciona
- [ ] Criação funciona
- [ ] Edição funciona
- [ ] Exclusão funciona
- [ ] Validações funcionam

#### 🆕 Gerenciamento de Arquivos (NOVO!)
- [ ] **Lista de arquivos** carrega corretamente
- [ ] **Busca por texto** funciona (arquivo, usuário, CPF/CNPJ)
- [ ] **Upload de PDF** funciona e atualiza a lista
- [ ] **Visualização de PDF** abre no modal
- [ ] **Download de arquivos** funciona
- [ ] **Exclusão de arquivos** funciona com confirmação
- [ ] **Informações do usuário** aparecem corretamente
- [ ] **Contadores atualizados** no dashboard

#### ✅ Upload de Arquivos
- ✅ Seleção de usuário funciona
- ✅ Upload de PDF funciona
- ✅ Validações funcionam
- ✅ Feedback visual funciona
- ✅ **Lista atualiza automaticamente**

### 8. Funcionalidades Avançadas de Arquivos

#### 🔍 Sistema de Busca
- Busca por nome do arquivo
- Busca por nome do usuário
- Busca por CPF/CNPJ
- Busca em tempo real
- Botão para limpar busca

#### 📄 Visualizador de PDF
- Modal responsivo
- Visualização inline do PDF
- Botões de download e fechar
- Overlay com fundo escuro

#### 📊 Informações Detalhadas
- Nome original do arquivo
- Usuário proprietário
- Tamanho formatado (B, KB, MB)
- Data e hora de criação
- Tipo de conteúdo

#### 🎯 Ações por Arquivo
- **Visualizar**: Para PDFs (ícone 👁️)
- **Download**: Para todos os arquivos (ícone ⬇️)
- **Excluir**: Para todos os arquivos (ícone 🗑️)

### 9. Problemas Comuns e Soluções

#### Backend não inicia
```bash
# Verificar se a porta 8080 está livre
netstat -an | findstr :8080

# Verificar logs do Maven
mvn clean install
```

#### Frontend não conecta com API
```bash
# Verificar se o backend está rodando
curl http://localhost:8080/api/users
curl http://localhost:8080/api/files

# Verificar console do navegador para erros CORS
```

#### Erro de build
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### Arquivos não aparecem
```bash
# Verificar console H2
http://localhost:8080/h2-console

# Verificar logs do Spring Boot
# Verificar se as tabelas foram criadas
```

#### PDF não visualiza
- Verificar se o arquivo é realmente um PDF válido
- Verificar console do navegador para erros
- Verificar se o endpoint `/api/files/{id}/view` está funcionando

### 10. Logs e Debug

#### Backend (Spring Boot)
- Logs aparecem no terminal onde foi executado
- Verificar erros de conexão com banco
- Verificar erros de CORS
- Verificar logs de upload e download

#### Frontend (React)
- Console do navegador (F12)
- Network tab para ver requisições
- Console para erros JavaScript
- Verificar requisições para `/api/files`

### 11. URLs Importantes para Teste

| Endpoint | URL | Descrição |
|----------|-----|-----------|
| **Listar arquivos** | `GET /api/files` | Lista todos os arquivos com info do usuário |
| **Arquivos por usuário** | `GET /api/files/user/{id}` | Lista arquivos de um usuário específico |
| **Buscar arquivos** | `GET /api/files/search?q={termo}` | Busca arquivos por termo |
| **Visualizar PDF** | `GET /api/files/{id}/view` | Visualiza PDF inline |
| **Download** | `GET /api/files/{id}/download` | Download do arquivo |
| **Info do arquivo** | `GET /api/files/{id}` | Informações do arquivo |
| **Excluir arquivo** | `DELETE /api/files/{id}` | Remove arquivo |

### 12. Próximos Passos

Após testar todas as funcionalidades:

1. **Integração com banco real**: Configurar PostgreSQL/MySQL
2. **Autenticação real**: Implementar JWT ou OAuth
3. **Validações**: Adicionar validações mais robustas
4. **Testes**: Implementar testes automatizados
5. **Deploy**: Configurar para produção
6. **Funcionalidades futuras**:
   - [ ] Preview de outros tipos de arquivo
   - [ ] Categorização de arquivos
   - [ ] Versionamento de documentos
   - [ ] Assinatura digital
   - [ ] Backup automático

---

**🎯 Objetivo**: Verificar que todas as funcionalidades básicas estão funcionando corretamente, especialmente as **novas funcionalidades de gerenciamento de arquivos**.
