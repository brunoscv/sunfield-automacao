package com.energia.dashboard.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${file.storage.location:uploads}") String location) throws IOException {
        this.rootLocation = Paths.get(location).toAbsolutePath().normalize();
        Files.createDirectories(this.rootLocation);
    }

    public StoredFileInfo store(MultipartFile file) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file.pdf" : file.getOriginalFilename());
        String extension = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf('.')) : "";
        String storedFilename = UUID.randomUUID().toString() + extension;
        Path destination = this.rootLocation.resolve(storedFilename);

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        StoredFileInfo info = new StoredFileInfo();
        info.setOriginalFilename(originalFilename);
        info.setStoredFilename(storedFilename);
        info.setStoragePath(destination.toString());
        info.setSizeBytes(file.getSize());
        info.setContentType(file.getContentType());
        return info;
    }

    public static class StoredFileInfo {
        private String originalFilename;
        private String storedFilename;
        private String storagePath;
        private long sizeBytes;
        private String contentType;

        public String getOriginalFilename() { return originalFilename; }
        public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
        public String getStoredFilename() { return storedFilename; }
        public void setStoredFilename(String storedFilename) { this.storedFilename = storedFilename; }
        public String getStoragePath() { return storagePath; }
        public void setStoragePath(String storagePath) { this.storagePath = storagePath; }
        public long getSizeBytes() { return sizeBytes; }
        public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
    }
}


