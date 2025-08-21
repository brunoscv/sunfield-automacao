package com.energia.service;

import com.energia.gui.MainWindow;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

/**
 * Serviço principal para automação de download de contas de energia
 */
public class EnergiaService {
    
    private static final Logger logger = LoggerFactory.getLogger(EnergiaService.class);
    
    private final MainWindow mainWindow;
    private WebDriver driver;
    private WebDriverWait wait;
    private boolean shouldStop = false;
    
    // Configurações padrão
    private static final int TIMEOUT_SECONDS = 30;
    private static final String DOWNLOAD_DIR = System.getProperty("user.home") + File.separator + "Downloads" + File.separator + "Energia";
    
    public EnergiaService(MainWindow mainWindow) {
        this.mainWindow = mainWindow;
        setupWebDriver();
    }
    
    private void setupWebDriver() {
        try {
            mainWindow.logMessage("Configurando WebDriver...");
            
            // Configurar Chrome WebDriver
            WebDriverManager.chromedriver().setup();
            
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");
            
            // Configurar diretório de download
            options.addArguments("--download.default_directory=" + DOWNLOAD_DIR.replace("\\", "/"));
            options.addArguments("--download.prompt_for_download=false");
            options.addArguments("--download.directory_upgrade=true");
            options.addArguments("--safebrowsing.enabled=true");
            
            // Desabilitar notificações
            options.addArguments("--disable-notifications");
            
            driver = new ChromeDriver(options);
            wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
            
            // Criar diretório de download se não existir
            createDownloadDirectory();
            
            mainWindow.logMessage("WebDriver configurado com sucesso");
            
        } catch (Exception e) {
            mainWindow.logMessage("ERRO ao configurar WebDriver: " + e.getMessage());
            throw new RuntimeException("Falha ao configurar WebDriver", e);
        }
    }
    
    private void createDownloadDirectory() {
        try {
            Path downloadPath = Paths.get(DOWNLOAD_DIR);
            if (!Files.exists(downloadPath)) {
                Files.createDirectories(downloadPath);
                mainWindow.logMessage("Diretório de download criado: " + DOWNLOAD_DIR);
            }
        } catch (IOException e) {
            mainWindow.logMessage("AVISO: Não foi possível criar diretório de download: " + e.getMessage());
        }
    }
    
    public void downloadLatestBill(String siteUrl, String email, String cpf, String birthDate) {
        try {
            mainWindow.logMessage("Iniciando processo de download...");
            mainWindow.updateProgress("Acessando site...", -1);
            
            // 1. Acessar o site
            driver.get(siteUrl);
            mainWindow.logMessage("Site acessado: " + siteUrl);
            
            if (shouldStop) return;
            
            // 2. Localizar e preencher campos de login
            mainWindow.updateProgress("Realizando login...", 25);
            performLogin(email, cpf, birthDate);
            
            if (shouldStop) return;
            
            // 3. Navegar para área de downloads
            mainWindow.updateProgress("Navegando para área de downloads...", 50);
            navigateToDownloads();
            
            if (shouldStop) return;
            
            // 4. Baixar a conta mais recente
            mainWindow.updateProgress("Baixando conta mais recente...", 75);
            downloadLatestInvoice();
            
            if (shouldStop) return;
            
            // 5. Finalizar
            mainWindow.updateProgress("Download concluído com sucesso!", 100);
            mainWindow.logMessage("Processo de download concluído com sucesso!");
            
        } catch (Exception e) {
            mainWindow.logMessage("ERRO durante o processo: " + e.getMessage());
            logger.error("Erro durante download", e);
            throw new RuntimeException("Falha no processo de download", e);
        } finally {
            cleanup();
        }
    }
    
    private void performLogin(String email, String cpf, String birthDate) {
        try {
            mainWindow.logMessage("Iniciando login...");
    
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
    
            // 1️⃣ Fechar banner inicial
            try {
                WebElement closeBtn = wait.until(
                    ExpectedConditions.elementToBeClickable(By.cssSelector(".pm__close"))
                );
                closeBtn.click();
                mainWindow.logMessage("Banner fechado com sucesso!");
                Thread.sleep(1000);
            } catch (TimeoutException te) {
                JavascriptExecutor js = (JavascriptExecutor) driver;
                js.executeScript(
                    "document.querySelectorAll('.pm__modal, .pm__overlay').forEach(e => e.remove());"
                );
                mainWindow.logMessage("Nenhum banner de entrada detectado.");
            }
    
            // 2️⃣ Aceitar LGPD
            acceptLgpdIfPresent();
    
            // 3️⃣ Preencher CPF/CNPJ
            try {
                WebElement cpfField = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.id("identificador-otp"))
                );
                cpfField.clear();
                cpfField.sendKeys(cpf);
                mainWindow.logMessage("CPF/CNPJ preenchido");
    
                WebElement cpfButton = wait.until(
                    ExpectedConditions.elementToBeClickable(By.id("envia-identificador-otp"))
                );
                cpfButton.click();
                mainWindow.logMessage("Botão 'Entrar (CPF)' clicado");
                Thread.sleep(2000);
    
            } catch (TimeoutException e) {
                mainWindow.logMessage("Campo CPF/CNPJ não encontrado. Pulando esta etapa.");
            }
    
            // 4️⃣ Preencher Email ou Data de Nascimento dinamicamente
            try {
                WebElement nextField = wait.until(
                    ExpectedConditions.presenceOfElementLocated(By.id("senha-identificador"))
                );
    
                String type = nextField.getAttribute("type");
                String clazz = nextField.getAttribute("class");
    
                if ("email".equalsIgnoreCase(type)) {
                    nextField.clear();
                    nextField.sendKeys(email);
                    mainWindow.logMessage("Campo de email preenchido");
    
                } else if ("text".equalsIgnoreCase(type) && clazz.contains("date-format")) {
                    nextField.clear();
                    nextField.sendKeys(birthDate);
                    mainWindow.logMessage("Campo de data de nascimento preenchido");
    
                } else {
                    mainWindow.logMessage("Campo encontrado, mas não é reconhecido: type=" + type + ", class=" + clazz);
                }
    
                WebElement sendButton = wait.until(
                    ExpectedConditions.elementToBeClickable(By.id("envia-identificador"))
                );
                sendButton.click();
                mainWindow.logMessage("Botão de envio clicado");
    
                Thread.sleep(2000);
    
            } catch (TimeoutException e) {
                mainWindow.logMessage("Nenhum campo de email/data encontrado nesta etapa. Pulando.");
            }
    
            mainWindow.logMessage("Login finalizado com sucesso!");
    
        } catch (Exception e) {
            mainWindow.logMessage("ERRO no login: " + e.getMessage());
            throw new RuntimeException("Falha no processo de login", e);
        }
    } 

    private void navigateToDownloads() {
        try {
            mainWindow.logMessage("Navegando para área de downloads...");
            
            // Aguardar página carregar após login
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
            
            // Tentar diferentes seletores para área de downloads
            WebElement downloadLink = findElementByMultipleSelectors(
                By.xpath("//a[contains(text(), 'Download') or contains(text(), 'Downloads') or contains(text(), 'Faturas')]"),
                By.xpath("//a[contains(@href, 'download') or contains(@href, 'fatura')]"),
                By.cssSelector("a[href*='download'], a[href*='fatura']"),
                By.className("download"),
                By.id("downloads")
            );
            
            if (downloadLink == null) {
                throw new RuntimeException("Link para área de downloads não encontrado");
            }
            
            downloadLink.click();
            mainWindow.logMessage("Link de downloads clicado");
            
            // Aguardar página de downloads carregar
            Thread.sleep(3000);
            
            mainWindow.logMessage("Área de downloads acessada com sucesso");
            
        } catch (Exception e) {
            mainWindow.logMessage("ERRO ao navegar para downloads: " + e.getMessage());
            throw new RuntimeException("Falha ao acessar área de downloads", e);
        }
    }
    
    private void downloadLatestInvoice() {
        try {
            mainWindow.logMessage("Localizando conta mais recente...");
            
            // Aguardar página carregar
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
            
            // Tentar diferentes seletores para links de download
            List<WebElement> downloadLinks = driver.findElements(By.cssSelector("a[href*='.pdf'], a[href*='download']"));
            
            if (downloadLinks.isEmpty()) {
                // Tentar outros seletores
                downloadLinks = driver.findElements(By.xpath("//a[contains(@href, '.pdf') or contains(@onclick, 'download')]"));
            }
            
            if (downloadLinks.isEmpty()) {
                throw new RuntimeException("Nenhum link de download encontrado na página");
            }
            
            mainWindow.logMessage("Encontrados " + downloadLinks.size() + " links de download");
            
            // Pegar o primeiro link (assumindo que é o mais recente)
            WebElement latestLink = downloadLinks.get(0);
            String downloadUrl = latestLink.getAttribute("href");
            
            if (downloadUrl == null || downloadUrl.trim().isEmpty()) {
                // Tentar clicar diretamente no link
                latestLink.click();
                mainWindow.logMessage("Link clicado para download");
            } else {
                // Navegar diretamente para a URL de download
                driver.get(downloadUrl);
                mainWindow.logMessage("Navegando para URL de download: " + downloadUrl);
            }
            
            // Aguardar download iniciar
            Thread.sleep(5000);
            
            mainWindow.logMessage("Download iniciado com sucesso");
            
        } catch (Exception e) {
            mainWindow.logMessage("ERRO ao baixar conta: " + e.getMessage());
            throw new RuntimeException("Falha ao baixar conta", e);
        }
    }
    
    private WebElement findElementByMultipleSelectors(By... selectors) {
        for (By selector : selectors) {
            try {
                List<WebElement> elements = driver.findElements(selector);
                if (!elements.isEmpty()) {
                    return elements.get(0);
                }
            } catch (Exception e) {
                // Continuar para o próximo seletor
            }
        }
        return null;
    }
    
    private void cleanup() {
        try {
            if (driver != null) {
                driver.quit();
                mainWindow.logMessage("WebDriver encerrado");
            }
        } catch (Exception e) {
            mainWindow.logMessage("AVISO: Erro ao encerrar WebDriver: " + e.getMessage());
        }
    }
    
    public void stop() {
        shouldStop = true;
        mainWindow.logMessage("Solicitação de parada recebida...");
        cleanup();
    }
    
    public String getDownloadDirectory() {
        return DOWNLOAD_DIR;
    }

    private void acceptLgpdIfPresent() {
        try {
            mainWindow.logMessage("Verificando formulário LGPD...");
    
            // Esperar se o container LGPD aparecer
            WebElement lgpdContainer = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("lgpd_n"))
            );
    
            if (lgpdContainer.isDisplayed()) {
                mainWindow.logMessage("Formulário LGPD detectado. Aceitando...");
    
                // Marcar checkbox
                WebElement checkBox = lgpdContainer.findElement(By.id("aviso_aceite"));
                if (!checkBox.isSelected()) {
                    checkBox.click();
                    mainWindow.logMessage("Checkbox LGPD marcado");
                }
    
                // Clicar no botão enviar
                WebElement acceptButton = lgpdContainer.findElement(By.id("lgpd_accept"));
                acceptButton.click();
                mainWindow.logMessage("Botão de aceite LGPD clicado");
    
                // Esperar sumir da tela
                wait.until(ExpectedConditions.invisibilityOf(lgpdContainer));
                Thread.sleep(1000);
    
                mainWindow.logMessage("LGPD aceito com sucesso!");
            }
        } catch (TimeoutException e) {
            mainWindow.logMessage("Nenhum formulário LGPD encontrado.");
        } catch (Exception e) {
            mainWindow.logMessage("ERRO ao aceitar LGPD: " + e.getMessage());
        }
    }
    
}
