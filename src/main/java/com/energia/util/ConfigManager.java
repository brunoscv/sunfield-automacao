package com.energia.util;

import java.io.*;
import java.util.Properties;

/**
 * Gerenciador de configurações da aplicação
 */
public class ConfigManager {
    
    private static final String CONFIG_FILE = "energia-config.properties";
    private static Properties properties;
    
    static {
        properties = new Properties();
        loadConfig();
    }
    
    /**
     * Carrega as configurações do arquivo
     */
    public static void loadConfig() {
        try {
            File configFile = new File(CONFIG_FILE);
            if (configFile.exists()) {
                try (FileInputStream fis = new FileInputStream(configFile)) {
                    properties.load(fis);
                }
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar configurações: " + e.getMessage());
        }
    }
    
    /**
     * Salva as configurações no arquivo
     */
    public static void saveConfig() {
        try {
            try (FileOutputStream fos = new FileOutputStream(CONFIG_FILE)) {
                properties.store(fos, "Configurações da aplicação Energia Automation");
            }
        } catch (IOException e) {
            System.err.println("Erro ao salvar configurações: " + e.getMessage());
        }
    }
    
    /**
     * Obtém uma propriedade de configuração
     */
    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
    
    /**
     * Obtém uma propriedade de configuração com valor padrão
     */
    public static String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }
    
    /**
     * Define uma propriedade de configuração
     */
    public static void setProperty(String key, String value) {
        properties.setProperty(key, value);
    }
    
    /**
     * Remove uma propriedade de configuração
     */
    public static void removeProperty(String key) {
        properties.remove(key);
    }
    
    /**
     * Verifica se uma propriedade existe
     */
    public static boolean hasProperty(String key) {
        return properties.containsKey(key);
    }
}
