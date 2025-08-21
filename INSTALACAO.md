# Instruções de Instalação - Windows

## 1. Instalar Java 11 ou Superior

### Opção A: Baixar do site oficial
1. Acesse: https://adoptium.net/
2. Baixe o Eclipse Temurin JDK 11 ou superior para Windows
3. Execute o instalador e siga as instruções
4. Adicione o Java ao PATH do sistema

### Opção B: Usar Chocolatey (recomendado)
```powershell
# Abra PowerShell como administrador
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Java
choco install openjdk11
```

### Verificar instalação do Java
```powershell
java -version
javac -version
```

## 2. Instalar Maven

### Opção A: Baixar manualmente
1. Acesse: https://maven.apache.org/download.cgi
2. Baixe o arquivo binário (apache-maven-x.x.x-bin.zip)
3. Extraia para `C:\Program Files\Apache\maven`
4. Adicione `C:\Program Files\Apache\maven\bin` ao PATH

### Opção B: Usar Chocolatey
```powershell
choco install maven
```

### Verificar instalação do Maven
```powershell
mvn -version
```

## 3. Instalar Google Chrome

Se ainda não tiver o Chrome instalado:
```powershell
choco install googlechrome
```

## 4. Compilar e Executar o Projeto

### Compilar
```powershell
mvn clean compile
```

### Executar
```powershell
mvn exec:java -Dexec.mainClass="com.energia.Main"
mvn exec:java
```

### Ou criar JAR executável
```powershell
mvn clean package
java -jar target/energia-automation-1.0.0.jar
```

## 5. Solução de Problemas Comuns

### "Java não é reconhecido"
- Verifique se o Java está no PATH
- Reinicie o terminal após instalar
- Use o caminho completo: `C:\Program Files\Java\bin\java.exe`

### "Maven não é reconhecido"
- Verifique se o Maven está no PATH
- Reinicie o terminal após instalar
- Use o caminho completo: `C:\Program Files\Apache\maven\bin\mvn.cmd`

### Erro de permissão
- Execute o PowerShell como administrador
- Verifique se tem permissões de escrita no diretório do projeto

### Erro de dependências
- Verifique conexão com internet
- Limpe cache do Maven: `mvn dependency:purge-local-repository`

## 6. Estrutura de Diretórios Esperada

```
energia-automation/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── energia/
│       └── resources/
├── target/
├── pom.xml
├── README.md
└── INSTALACAO.md
```

## 7. Comandos Úteis

```powershell
# Limpar projeto
mvn clean

# Compilar
mvn compile

# Executar testes
mvn test

# Criar JAR
mvn package

# Instalar no repositório local
mvn install

# Ver dependências
mvn dependency:tree
```

## 8. Suporte

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme se as versões são compatíveis
3. Verifique os logs de erro
4. Abra uma issue no repositório
