# 🚀 Como Executar o Dashboard Completo

## 📋 Pré-requisitos

- **Java 11+** instalado
- **Node.js 16+** instalado
- **Maven** instalado (ou usar o wrapper)
- **Git** para clonar o repositório

## 🏗️ Estrutura do Projeto

```
energia-automation/
├── dashboard-api/          # Backend Java (Spring Boot)
├── dashboard-ui/           # Frontend React (TypeScript)
└── README.md
```

## 🚀 Passo a Passo para Executar

### 1. Preparar o Ambiente

```bash
# Clonar o repositório (se ainda não tiver)
git clone <url-do-repositorio>
cd energia-automation

# Verificar se Java está instalado
java -version

# Verificar se Node.js está instalado
node --version
npm --version

# Verificar se Maven está instalado
mvn --version
```

### 2. Executar o Backend (API)

```bash
# Navegar para a pasta da API
cd dashboard-api

# Limpar e compilar o projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run
```

**✅ Backend rodando em:** `http://localhost:8080`

**🔍 Console H2 disponível em:** `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:energia`
- Username: `sa`
- Password: (deixar vazio)

### 3. Executar o Frontend (Dashboard)

```bash
# Abrir novo terminal
# Navegar para a pasta do frontend
cd dashboard-ui

# Instalar dependências (se necessário)
npm install

# Executar em modo desenvolvimento
npm run dev
```

**✅ Frontend rodando em:** `http://localhost:5173`

### 4. Acessar o Dashboard

1. Abrir o navegador
2. Acessar: `http://localhost:5173`
3. Fazer login com:
   - **Usuário:** `admin`
   - **Senha:** `admin`

## 🧪 Testando o Sistema

### Funcionalidades Básicas

1. **✅ Login**: Sistema de autenticação funcionando
2. **✅ Dashboard**: Cards de estatísticas visíveis
3. **✅ Sidebar**: Navegação entre abas funcionando
4. **✅ Usuários**: CRUD completo funcionando
5. **✅ Upload**: Sistema de arquivos funcionando
6. **✅ Responsivo**: Funciona em diferentes tamanhos de tela

### Teste de Upload

1. Criar um usuário na aba "Usuários"
2. Ir para aba "Arquivos"
3. Selecionar o usuário criado
4. Fazer upload de um arquivo PDF
5. Verificar se aparece na lista

## 🔧 Configurações

### Backend (Spring Boot)

- **Porta:** 8080
- **Banco:** H2 (desenvolvimento) / PostgreSQL (produção)
- **Perfil ativo:** `dev` (desenvolvimento)
- **Logs:** DEBUG (desenvolvimento)

### Frontend (React)

- **Porta:** 5173
- **Proxy API:** `/api` → `http://localhost:8080`
- **Build tool:** Vite
- **TypeScript:** Ativado

## 🚨 Solução de Problemas

### Backend não inicia

```bash
# Verificar se a porta 8080 está livre
netstat -an | findstr :8080

# Verificar logs do Maven
mvn clean install

# Verificar versão do Java
java -version
```

### Frontend não conecta com API

```bash
# Verificar se o backend está rodando
curl http://localhost:8080/api/users

# Verificar console do navegador (F12)
# Verificar se há erros CORS
```

### Erro de build

```bash
# Limpar cache do Maven
mvn clean

# Limpar cache do npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Banco de dados não conecta

```bash
# Verificar console H2
http://localhost:8080/h2-console

# Verificar logs do Spring Boot
# Verificar se as tabelas foram criadas
```

## 🌐 URLs Importantes

| Serviço | URL | Descrição |
|----------|-----|-----------|
| **Dashboard** | `http://localhost:5173` | Interface principal |
| **API Backend** | `http://localhost:8080` | Serviços REST |
| **Console H2** | `http://localhost:8080/h2-console` | Banco de dados |
| **API Users** | `http://localhost:8080/api/users` | Endpoint de usuários |

## 📱 Teste de Responsividade

1. **Desktop**: Layout completo com sidebar expandida
2. **Tablet**: Sidebar colapsável
3. **Mobile**: Sidebar oculta, navegação otimizada

## 🔄 Perfis de Execução

### Desenvolvimento (padrão)
```bash
# Usa H2 em memória, logs DEBUG
mvn spring-boot:run
```

### Produção
```bash
# Usa PostgreSQL, logs INFO
mvn spring-boot:run -Dspring.profiles.active=prod
```

## 📊 Monitoramento

### Logs do Backend
- Terminal onde foi executado o `mvn spring-boot:run`
- Logs SQL, requisições HTTP, erros

### Logs do Frontend
- Console do navegador (F12)
- Network tab para requisições
- Console para erros JavaScript

## 🎯 Próximos Passos

Após confirmar que tudo está funcionando:

1. **Integração com banco real**: Configurar PostgreSQL
2. **Autenticação real**: Implementar JWT
3. **Validações**: Adicionar validações robustas
4. **Testes**: Implementar testes automatizados
5. **Deploy**: Configurar para produção

---

**🎉 Dashboard funcionando perfeitamente!**

Para dúvidas ou problemas, verificar:
- Logs do backend no terminal
- Console do navegador (F12)
- Configurações de porta e banco de dados
