# Automação de Energia - Download de Contas

Este projeto implementa uma automação para baixar automaticamente as contas de energia mais recentes do site da companhia elétrica.

## Funcionalidades

- ✅ Interface gráfica intuitiva
- ✅ Automação web usando Selenium
- ✅ Download automático da conta mais recente
- ✅ Log detalhado de todas as operações
- ✅ Configuração persistente de credenciais
- ✅ Suporte a diferentes estruturas de site

## Pré-requisitos

- Java 11 ou superior
- Maven 3.6 ou superior
- Google Chrome instalado
- Conexão com internet

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd energia-automation
```

### 2. Compile o projeto
```bash
mvn clean compile
```

### 3. Execute a aplicação
```bash
mvn exec:java -Dexec.mainClass="com.energia.Main"
```

Ou compile e execute o JAR:
```bash
mvn clean package
java -jar target/energia-automation-1.0.0.jar
```

## Como Usar

### 1. Configuração Inicial
- Abra a aplicação
- Preencha a URL do site da companhia elétrica
- Digite seu email de cadastro
- Digite seu CPF ou CNPJ

### 2. Execução
- Clique em "Iniciar Download"
- A aplicação irá:
  - Abrir o Chrome automaticamente
  - Acessar o site informado
  - Realizar login com suas credenciais
  - Navegar para a área de downloads
  - Baixar a conta mais recente

### 3. Acompanhamento
- Monitore o progresso na barra de progresso
- Acompanhe os detalhes no log de atividades
- Os arquivos são salvos em: `~/Downloads/Energia/`

## Estrutura do Projeto

```
src/main/java/com/energia/
├── Main.java                 # Classe principal
├── gui/
│   └── MainWindow.java      # Interface gráfica
├── service/
│   └── EnergiaService.java  # Lógica de automação
└── util/
    └── ConfigManager.java   # Gerenciamento de configurações
```

## Tecnologias Utilizadas

- **Java 11**: Linguagem principal
- **Selenium WebDriver**: Automação web
- **Swing**: Interface gráfica
- **Maven**: Gerenciamento de dependências
- **WebDriverManager**: Gerenciamento automático de drivers
- **Logback**: Sistema de logging

## Configurações Avançadas

### Personalização de Seletores
O sistema tenta automaticamente diferentes seletores para encontrar elementos na página. Se necessário, você pode personalizar os seletores editando a classe `EnergiaService.java`.

### Diretório de Download
Por padrão, os arquivos são salvos em `~/Downloads/Energia/`. Para alterar, modifique a constante `DOWNLOAD_DIR` na classe `EnergiaService`.

### Timeouts
Os timeouts padrão são de 30 segundos. Para alterar, modifique a constante `TIMEOUT_SECONDS`.

## Solução de Problemas

### Erro: "Campos de login não encontrados"
- Verifique se a URL está correta
- Confirme se o site não mudou de estrutura
- Tente acessar manualmente o site primeiro

### Erro: "WebDriver não configurado"
- Verifique se o Chrome está instalado
- Confirme se há conexão com internet
- Tente executar como administrador

### Download não inicia
- Verifique se as credenciais estão corretas
- Confirme se o site não está com manutenção
- Verifique se não há captcha ou verificação adicional

## Logs

Os logs são salvos em:
- Console: Durante a execução
- Arquivo: `logs/energia-automation.log`

## Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Suporte

Para suporte ou dúvidas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

## Roadmap

- [ ] Leitura automática de PDFs
- [ ] Integração com banco de dados
- [ ] Agendamento de downloads
- [ ] Suporte a múltiplas contas
- [ ] Interface web
- [ ] Notificações por email

## Dashboard (API + UI)

Este repositório inclui uma Dashboard web para gerenciar usuários e enviar PDFs manualmente, salvando-os em disco para análise futura.

- API Spring Boot: `dashboard-api`
- Frontend React (Vite + TypeScript): `dashboard-ui`
- Banco de dados PostgreSQL: via `docker-compose.yml`

### Subir com Docker

1. Instale o Docker Desktop
2. Na raiz do projeto, execute:
```
docker compose up -d --build
```

Serviços:
- API: `http://localhost:8080`
- Postgres: `localhost:5432` (db: energia / user: postgres / pass: )
- Uploads persistidos no volume `uploads` (montado em `/data/uploads` no container da API)

### Rodar API localmente (sem Docker)

1. Suba o Postgres rapidamente com Docker:
```
docker run -e POSTGRES_DB=energia -e POSTGRES_USER=energia -e POSTGRES_PASSWORD=energia -p 5432:5432 -d postgres:14
```
2. Em `dashboard-api`:
```
mvn spring-boot:run
```
Variáveis de ambiente suportadas:
- `DB_URL` (padrão `jdbc:postgresql://localhost:5432/energia`)
- `DB_USER` (padrão `energia`)
- `DB_PASSWORD` (padrão `energia`)
- `FILE_STORAGE_LOCATION` (padrão `uploads` na raiz do projeto)

Endpoints principais:
- GET `/api/users` — listar usuários
- POST `/api/users` — criar usuário
- GET `/api/users/{id}` — obter usuário
- PUT `/api/users/{id}` — atualizar usuário
- DELETE `/api/users/{id}` — remover usuário
- POST `/api/users/{id}/upload` — upload de PDF (multipart `file`)
- GET `/api/users/{id}/files` — listar arquivos do usuário
- GET `/api/files/{fileId}/download` — baixar arquivo

### Rodar UI (desenvolvimento)

1. Em `dashboard-ui`:
```
npm install
npm run dev
```
2. Acesse `http://localhost:5173`. O Vite faz proxy de `/api` para `http://localhost:8080`.