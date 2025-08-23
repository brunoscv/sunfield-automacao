# Dashboard UI - Energia Solar

Um dashboard administrativo moderno e responsivo para a empresa de energia solar, desenvolvido em React com TypeScript.

## 🚀 Funcionalidades

### Sistema de Autenticação
- **Login**: Tela de autenticação com validação de credenciais
- **Credenciais padrão**: `admin` / `admin`
- **Logout**: Botão de sair na sidebar

### Dashboard Principal
- **Cards de estatísticas**: Total de usuários, arquivos, projetos ativos e faturamento
- **Layout responsivo**: Adaptável para diferentes tamanhos de tela
- **Animações suaves**: Transições e efeitos visuais

### Gerenciamento de Usuários
- **Lista de usuários**: Tabela com informações completas
- **Adicionar usuário**: Formulário para cadastro de novos usuários
- **Editar usuário**: Modificação de dados existentes
- **Excluir usuário**: Remoção com confirmação

### 🆕 Gerenciamento de Arquivos (NOVO!)
- **Lista completa de arquivos**: Visualização de todos os arquivos com informações do usuário
- **Sistema de busca avançada**: Busca por nome do arquivo, usuário ou CPF/CNPJ
- **Upload de PDF**: Envio de documentos para usuários específicos
- **Visualização inline de PDFs**: Modal responsivo para visualizar documentos
- **Download de arquivos**: Botão para baixar qualquer tipo de arquivo
- **Exclusão de arquivos**: Remoção segura com confirmação
- **Informações detalhadas**: Nome, usuário, tamanho, data de criação
- **Atualização automática**: Lista se atualiza após upload/exclusão

### Relatórios
- **Relatório de Usuários**: Estatísticas sobre cadastros
- **Relatório de Arquivos**: Análise de uploads
- **Relatório Financeiro**: Dados de faturamento e projetos

## 🎨 Design e Identidade Visual

### Cores Principais
- **Azul Primário**: `#1e40af` - Cor principal da marca
- **Azul Secundário**: `#3b82f6` - Elementos de destaque
- **Azul Claro**: `#dbeafe` - Fundos e bordas
- **Branco**: `#ffffff` - Fundos principais
- **Preto**: `#0f172a` - Textos e elementos escuros

### Características Visuais
- **Gradientes**: Sidebar com gradiente azul
- **Sombras**: Efeitos de profundidade
- **Bordas arredondadas**: Design moderno e suave
- **Ícones**: Emojis para melhor identificação visual
- **Tipografia**: Fonte Segoe UI para melhor legibilidade

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + CSS3 customizado
- **Backend**: Spring Boot + H2 (dev) / PostgreSQL (prod)
- **Build**: Vite para desenvolvimento rápido
- **Proxy**: Configurado para comunicação com API

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar expandida
- **Tablet**: Sidebar colapsável
- **Mobile**: Sidebar oculta com navegação otimizada

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- Backend Java rodando na porta 8080

### Instalação
```bash
cd dashboard-ui
npm install
```

### Desenvolvimento
```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:5173`

### Build de Produção
```bash
npm run build
```

## 🔧 Configuração

### Proxy da API
O Vite está configurado para fazer proxy das requisições `/api` para `http://localhost:8080`:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

### Variáveis CSS
As cores e estilos podem ser facilmente personalizados editando as variáveis CSS no arquivo `App.css`:

```css
:root {
  --primary-blue: #1e40af;
  --secondary-blue: #3b82f6;
  --light-blue: #dbeafe;
  /* ... outras variáveis */
}
```

## 📁 Estrutura do Projeto

```
dashboard-ui/
├── src/
│   ├── ui/
│   │   ├── App.tsx          # Componente principal
│   │   └── App.css          # Estilos do dashboard
│   └── main.tsx             # Ponto de entrada
├── vite.config.ts            # Configuração do Vite
└── package.json              # Dependências
```

## 🔐 Segurança

### Autenticação
- Sistema de login simulado (para demonstração)
- Em produção, integrar com backend de autenticação
- Sessões gerenciadas no estado da aplicação

### Validação
- Validação de formulários no frontend
- Sanitização de inputs
- Validação de tipos de arquivo

## 🆕 Funcionalidades Avançadas de Arquivos

### 🔍 Sistema de Busca Inteligente
- **Busca em tempo real** por múltiplos critérios
- **Filtros automáticos** por nome, usuário ou CPF/CNPJ
- **Interface intuitiva** com botões de busca e limpeza
- **Resultados instantâneos** sem necessidade de refresh

### 📄 Visualizador de PDF Profissional
- **Modal responsivo** que se adapta a qualquer tela
- **Visualização inline** sem necessidade de download
- **Controles intuitivos** para fechar e download
- **Overlay elegante** com fundo escuro

### 📊 Gestão Completa de Arquivos
- **Cards informativos** com todas as informações relevantes
- **Ações contextuais** por tipo de arquivo
- **Atualização automática** após operações
- **Feedback visual** para todas as ações

### 🎯 Ações por Tipo de Arquivo
- **PDFs**: Visualizar (👁️) + Download (⬇️) + Excluir (🗑️)
- **Outros arquivos**: Download (⬇️) + Excluir (🗑️)
- **Hover effects** para melhor experiência do usuário

## 🚧 Funcionalidades Futuras

- [ ] Integração com sistema de autenticação real
- [ ] Dashboard com gráficos e métricas
- [ ] Sistema de notificações
- [ ] Temas personalizáveis
- [ ] Exportação de relatórios
- [ ] Sistema de permissões por usuário
- [ ] Logs de auditoria
- [ ] Backup automático de dados
- [ ] **Preview de outros tipos de arquivo** (imagens, documentos)
- [ ] **Categorização e tags** para arquivos
- [ ] **Versionamento de documentos**
- [ ] **Assinatura digital** de PDFs
- [ ] **Compartilhamento** de arquivos entre usuários

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste localmente
5. Envie um pull request

## 📄 Licença

Este projeto é parte do sistema Energia Automation e está sob a licença da empresa.

---

**Desenvolvido para Energia Solar** ⚡

**✨ Novas funcionalidades de arquivos implementadas com sucesso!**
