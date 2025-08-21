package com.energia.gui;

import com.energia.service.EnergiaService;
import com.energia.util.ConfigManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

/**
 * Janela principal da aplicação
 */
public class MainWindow extends JFrame {
    
    private JTextField emailField;
    private JTextField cpfField;
    private JTextField birthDateField;
    private JTextField urlField;
    private JTextArea logArea;
    private JButton startButton;
    private JButton stopButton;
    private JButton configButton;
    private JProgressBar progressBar;
    
    private EnergiaService energiaService;
    private boolean isRunning = false;
    
    public MainWindow() {
        initializeComponents();
        setupLayout();
        setupEventHandlers();
        loadSavedCredentials();
        
        setTitle("Automação de Energia - Download de Contas");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(700, 600);
        setResizable(false);
    }
    
    private void initializeComponents() {
        emailField = new JTextField(30);
        cpfField = new JTextField(30);
        birthDateField = new JTextField(30);
        urlField = new JTextField(30);
        logArea = new JTextArea(15, 60);
        startButton = new JButton("Iniciar Download");
        stopButton = new JButton("Parar");
        configButton = new JButton("Configurações");
        progressBar = new JProgressBar();
        
        // Configurar área de log
        logArea.setEditable(false);
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        JScrollPane scrollPane = new JScrollPane(logArea);
        
        // Configurar botões
        stopButton.setEnabled(false);
        progressBar.setStringPainted(true);
        progressBar.setString("Pronto");
    }
    
    private void setupLayout() {
        setLayout(new BorderLayout());
        
        // Painel principal com padding
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        // Painel de configurações
        JPanel configPanel = createConfigPanel();
        mainPanel.add(configPanel, BorderLayout.NORTH);
        
        // Painel de controles
        JPanel controlPanel = createControlPanel();
        mainPanel.add(controlPanel, BorderLayout.CENTER);
        
        // Painel de log
        JPanel logPanel = createLogPanel();
        mainPanel.add(logPanel, BorderLayout.SOUTH);
        
        add(mainPanel);
    }
    
    private JPanel createConfigPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Configurações de Acesso"));
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.anchor = GridBagConstraints.WEST;
        
        // URL do site
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(new JLabel("URL do Site:"), gbc);
        gbc.gridx = 1; gbc.gridy = 0;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        panel.add(urlField, gbc);
        
        // Email
        gbc.gridx = 0; gbc.gridy = 1;
        gbc.weightx = 0.0;
        panel.add(new JLabel("Email:"), gbc);
        gbc.gridx = 1; gbc.gridy = 1;
        gbc.weightx = 1.0;
        panel.add(emailField, gbc);
        
        // CPF/CNPJ
        gbc.gridx = 0; gbc.gridy = 2;
        gbc.weightx = 0.0;
        panel.add(new JLabel("CPF/CNPJ:"), gbc);
        gbc.gridx = 1; gbc.gridy = 2;
        gbc.weightx = 1.0;
        panel.add(cpfField, gbc);
        
        // Data de nascimento
        gbc.gridx = 0; gbc.gridy = 3;
        gbc.weightx = 0.0;
        panel.add(new JLabel("Data de Nascimento:"), gbc);
        gbc.gridx = 1; gbc.gridy = 3;
        gbc.weightx = 1.0;
        panel.add(birthDateField, gbc);
        
        return panel;
    }
    
    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Controles"));
        
        // Painel de botões
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        buttonPanel.add(startButton);
        buttonPanel.add(stopButton);
        buttonPanel.add(configButton);
        
        panel.add(buttonPanel, BorderLayout.NORTH);
        
        // Barra de progresso
        JPanel progressPanel = new JPanel(new BorderLayout());
        progressPanel.setBorder(new EmptyBorder(10, 0, 0, 0));
        progressPanel.add(progressBar, BorderLayout.CENTER);
        
        panel.add(progressPanel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createLogPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Log de Atividades"));
        
        JScrollPane scrollPane = new JScrollPane(logArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private void setupEventHandlers() {
        startButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                startDownload();
            }
        });
        
        stopButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                stopDownload();
            }
        });
        
        configButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showConfigDialog();
            }
        });
    }
    
    private void startDownload() {
        if (isRunning) {
            return;
        }
        
        // Validar campos
        if (urlField.getText().trim().isEmpty() || 
            emailField.getText().trim().isEmpty() || 
            cpfField.getText().trim().isEmpty() ||
            birthDateField.getText().trim().isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "Por favor, preencha todos os campos obrigatórios.",
                "Validação", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        // Salvar credenciais
        saveCredentials();
        
        // Iniciar processo
        isRunning = true;
        startButton.setEnabled(false);
        stopButton.setEnabled(true);
        progressBar.setString("Iniciando...");
        progressBar.setIndeterminate(true);
        
        // Limpar log
        logArea.setText("");
        
        // Executar em thread separada
        new Thread(() -> {
            try {
                energiaService = new EnergiaService(this);
                energiaService.downloadLatestBill(
                    urlField.getText().trim(),
                    emailField.getText().trim(),
                    cpfField.getText().trim(),
                    birthDateField.getText().trim()
                );
            } catch (Exception e) {
                logMessage("ERRO: " + e.getMessage());
                SwingUtilities.invokeLater(() -> {
                    JOptionPane.showMessageDialog(MainWindow.this,
                        "Erro durante o download: " + e.getMessage(),
                        "Erro", JOptionPane.ERROR_MESSAGE);
                });
            } finally {
                SwingUtilities.invokeLater(() -> {
                    isRunning = false;
                    startButton.setEnabled(true);
                    stopButton.setEnabled(false);
                    progressBar.setIndeterminate(false);
                    progressBar.setString("Concluído");
                });
            }
        }).start();
    }
    
    private void stopDownload() {
        if (energiaService != null) {
            energiaService.stop();
        }
        isRunning = false;
        startButton.setEnabled(true);
        stopButton.setEnabled(false);
        progressBar.setIndeterminate(false);
        progressBar.setString("Interrompido");
        logMessage("Download interrompido pelo usuário.");
    }
    
    private void showConfigDialog() {
        // TODO: Implementar diálogo de configurações avançadas
        JOptionPane.showMessageDialog(this,
            "Configurações avançadas serão implementadas em versões futuras.",
            "Configurações", JOptionPane.INFORMATION_MESSAGE);
    }
    
    private void loadSavedCredentials() {
        String savedUrl = ConfigManager.getProperty("site.url");
        String savedEmail = ConfigManager.getProperty("user.email");
        String savedCpf = ConfigManager.getProperty("user.cpf");
        String savedBirthDate = ConfigManager.getProperty("user.birthDate");
        
        if (savedUrl != null) urlField.setText(savedUrl);
        if (savedEmail != null) emailField.setText(savedEmail);
        if (savedCpf != null) cpfField.setText(savedCpf);
        if (savedBirthDate != null) birthDateField.setText(savedBirthDate);
    }
    
    private void saveCredentials() {
        ConfigManager.setProperty("site.url", urlField.getText().trim());
        ConfigManager.setProperty("user.email", emailField.getText().trim());
        ConfigManager.setProperty("user.cpf", cpfField.getText().trim());
        ConfigManager.setProperty("user.birthDate", birthDateField.getText().trim());
        ConfigManager.saveConfig();
    }
    
    // Métodos públicos para comunicação com o serviço
    public void logMessage(String message) {
        SwingUtilities.invokeLater(() -> {
            logArea.append("[" + java.time.LocalTime.now().toString() + "] " + message + "\n");
            logArea.setCaretPosition(logArea.getDocument().getLength());
        });
    }
    
    public void updateProgress(String message, int progress) {
        SwingUtilities.invokeLater(() -> {
            progressBar.setString(message);
            if (progress >= 0) {
                progressBar.setIndeterminate(false);
                progressBar.setValue(progress);
            } else {
                progressBar.setIndeterminate(true);
            }
        });
    }
    
    public void setDownloadPath(String path) {
        // TODO: Implementar seleção de diretório de download
    }
}
