# Configuração da Aplicação

## Arquivo de Configuração

Crie um arquivo chamado `energia-config.properties` na raiz do projeto com o seguinte conteúdo:

```properties
# Configurações da Aplicação Energia Automation

# URL do site da companhia elétrica
# Exemplo: https://www.energia.com.br ou https://portal.energia.com.br
site.url=https://exemplo.com.br

# Credenciais do usuário
# Email usado para cadastro no site
user.email=seu.email@exemplo.com

# CPF ou CNPJ (apenas números ou com formatação)
user.cpf=123.456.789-00
# OU
# user.cnpj=12.345.678/0001-90

# Configurações avançadas (opcionais)
# Diretório de download personalizado
# download.directory=C:\\Users\\Usuario\\Downloads\\Energia

# Timeout em segundos para operações web
# timeout.seconds=30

# Modo headless (sem abrir navegador visível)
# headless.mode=false

# Configurações de proxy (se necessário)
# proxy.host=
# proxy.port=
# proxy.username=
# proxy.password=
```

## Exemplos de Configuração para Diferentes Companhias

### Companhia A
```properties
site.url=https://www.companhiaa.com.br/portal
user.email=cliente@email.com
user.cpf=123.456.789-00
```

### Companhia B
```properties
site.url=https://portal.companhiab.com.br
user.email=usuario@email.com
user.cnpj=12.345.678/0001-90
```

### Companhia C
```properties
site.url=https://www.companhiac.com.br/area-cliente
user.email=energia@email.com
user.cpf=987.654.321-00
```

## Personalização de Seletores

Se o site da sua companhia elétrica tiver uma estrutura diferente, você pode personalizar os seletores editando a classe `EnergiaService.java`.

### Exemplo de Personalização

```java
// Para um campo de email com ID específico
WebElement emailField = driver.findElement(By.id("usuario_email"));

// Para um campo de CPF com nome específico
WebElement cpfField = driver.findElement(By.name("documento"));

// Para um botão de login com classe específica
WebElement loginButton = driver.findElement(By.className("btn-entrar"));
```

## Configurações de Segurança

### Armazenamento de Credenciais
- As credenciais são salvas localmente no arquivo `energia-config.properties`
- Este arquivo NÃO deve ser compartilhado ou enviado por email
- Considere usar variáveis de ambiente para maior segurança

### Exemplo com Variáveis de Ambiente
```properties
site.url=${ENERGIA_SITE_URL}
user.email=${ENERGIA_USER_EMAIL}
user.cpf=${ENERGIA_USER_CPF}
```

## Configurações de Rede

### Proxy Corporativo
Se sua empresa usar proxy:
```properties
proxy.host=proxy.empresa.com
proxy.port=8080
proxy.username=usuario
proxy.password=senha
```

### Firewall
- Certifique-se de que o Chrome pode acessar sites externos
- Verifique se não há bloqueios de firewall corporativo
- Considere executar como administrador se necessário

## Configurações de Performance

### Timeouts
```properties
# Timeout para carregamento de páginas
timeout.seconds=30

# Timeout para download
download.timeout=60
```

### Modo Headless
```properties
# Executar sem abrir navegador visível
headless.mode=true
```

## Logs e Debug

### Nível de Log
```properties
# Nível de detalhamento dos logs
log.level=DEBUG
# Opções: DEBUG, INFO, WARN, ERROR
```

### Diretório de Logs
```properties
# Diretório para arquivos de log
log.directory=logs
```

## Backup e Restauração

### Backup de Configuração
```bash
# Windows
copy energia-config.properties energia-config.properties.backup

# Linux/Mac
cp energia-config.properties energia-config.properties.backup
```

### Restauração
```bash
# Windows
copy energia-config.properties.backup energia-config.properties

# Linux/Mac
cp energia-config.properties.backup energia-config.properties
```

## Validação de Configuração

Após criar o arquivo de configuração, a aplicação irá:
1. Carregar as configurações automaticamente
2. Validar se todos os campos obrigatórios estão preenchidos
3. Testar a conectividade com o site
4. Salvar as configurações para uso futuro

## Suporte

Se encontrar problemas com a configuração:
1. Verifique se a URL está correta e acessível
2. Confirme se as credenciais estão corretas
3. Teste o acesso manual ao site primeiro
4. Verifique os logs da aplicação
5. Consulte a documentação da companhia elétrica
