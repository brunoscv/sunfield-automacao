package com.energia;

import com.energia.gui.MainWindow;
import com.energia.service.EnergiaService;
import com.energia.util.ConfigManager;

import javax.swing.*;
import java.awt.*;

/**
 * Classe principal da aplicação de automação de energia
 */
public class Main {
    
    public static void main(String[] args) {
        // Configurar look and feel do sistema
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            try {
                // Fallback para look and feel padrão se o do sistema falhar
                UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
            } catch (Exception ex) {
                System.err.println("Erro ao configurar look and feel: " + ex.getMessage());
            }
        }
        
        // Executar interface gráfica na thread de eventos
        SwingUtilities.invokeLater(() -> {
            try {
                // Carregar configurações
                ConfigManager.loadConfig();
                
                // Criar e exibir janela principal
                MainWindow mainWindow = new MainWindow();
                mainWindow.setVisible(true);
                
                // Centralizar a janela na tela
                Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
                Dimension windowSize = mainWindow.getSize();
                int x = (screenSize.width - windowSize.width) / 2;
                int y = (screenSize.height - windowSize.height) / 2;
                mainWindow.setLocation(x, y);
                
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, 
                    "Erro ao inicializar a aplicação: " + e.getMessage(),
                    "Erro", JOptionPane.ERROR_MESSAGE);
                System.exit(1);
            }
        });
    }
}
