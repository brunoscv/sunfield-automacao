# Script PowerShell para executar a Automação de Energia
# Execute como administrador se necessário

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Automação de Energia - Download" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Java está instalado
try {
    $javaVersion = java -version 2>&1
    Write-Host "✓ Java encontrado:" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Gray
} catch {
    Write-Host "✗ ERRO: Java não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Java 11 ou superior." -ForegroundColor Yellow
    Write-Host "Consulte o arquivo INSTALACAO.md para instruções." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se o Maven está instalado
try {
    $mavenVersion = mvn -version 2>&1
    Write-Host "✓ Maven encontrado:" -ForegroundColor Green
    Write-Host $mavenVersion[0] -ForegroundColor Gray
} catch {
    Write-Host "✗ ERRO: Maven não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Maven 3.6 ou superior." -ForegroundColor Yellow
    Write-Host "Consulte o arquivo INSTALACAO.md para instruções." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Java e Maven encontrados. Iniciando aplicação..." -ForegroundColor Green
Write-Host ""

# Compilar o projeto
Write-Host "Compilando o projeto..." -ForegroundColor Yellow
try {
    mvn clean compile
    if ($LASTEXITCODE -ne 0) {
        throw "Falha na compilação"
    }
} catch {
    Write-Host "✗ ERRO: Falha na compilação!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "✓ Compilação concluída com sucesso!" -ForegroundColor Green
Write-Host ""

# Executar a aplicação
Write-Host "Iniciando a aplicação..." -ForegroundColor Yellow
try {
    mvn exec:java -Dexec.mainClass="com.energia.Main"
} catch {
    Write-Host "✗ ERRO ao executar a aplicação:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Aplicação encerrada." -ForegroundColor Cyan
Read-Host "Pressione Enter para sair"
