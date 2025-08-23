package com.energia.dashboard.file;

import java.time.OffsetDateTime;

public class FileInfoDTO {
    private Long id;
    private String originalFilename;
    private String contentType;
    private long sizeBytes;
    private OffsetDateTime createdAt;
    private Long userId;
    private String userName;
    private String userCpfCnpj;

    public FileInfoDTO() {}

    public FileInfoDTO(Long id, String originalFilename, String contentType, long sizeBytes, 
                      OffsetDateTime createdAt, Long userId, String userName, String userCpfCnpj) {
        this.id = id;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userName = userName;
        this.userCpfCnpj = userCpfCnpj;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserCpfCnpj() { return userCpfCnpj; }
    public void setUserCpfCnpj(String userCpfCnpj) { this.userCpfCnpj = userCpfCnpj; }

    // Método para formatar o tamanho do arquivo
    public String getFormattedSize() {
        if (sizeBytes < 1024) {
            return sizeBytes + " B";
        } else if (sizeBytes < 1024 * 1024) {
            return String.format("%.1f KB", sizeBytes / 1024.0);
        } else {
            return String.format("%.1f MB", sizeBytes / (1024.0 * 1024.0));
        }
    }

    // Método para verificar se é PDF
    public boolean isPdf() {
        return contentType != null && contentType.toLowerCase().contains("pdf");
    }
}
