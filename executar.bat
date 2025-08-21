@echo off
echo ========================================
echo    Automação de Energia - Download
echo ========================================
echo.

REM Verificar se o Java está instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Java nao encontrado!
    echo Por favor, instale o Java 11 ou superior.
    echo Consulte o arquivo INSTALACAO.md para instrucoes.
    pause
    exit /b 1
)

REM Verificar se o Maven está instalado
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Maven nao encontrado!
    echo Por favor, instale o Maven 3.6 ou superior.
    echo Consulte o arquivo INSTALACAO.md para instrucoes.
    pause
    exit /b 1
)

echo Java e Maven encontrados. Iniciando aplicacao...
echo.

REM Compilar o projeto
echo Compilando o projeto...
mvn clean compile
if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao!
    pause
    exit /b 1
)

echo.
echo Compilacao concluida com sucesso!
echo.

REM Executar a aplicação
echo Iniciando a aplicacao...
mvn exec:java -Dexec.mainClass="com.energia.Main"

echo.
echo Aplicacao encerrada.
pause
