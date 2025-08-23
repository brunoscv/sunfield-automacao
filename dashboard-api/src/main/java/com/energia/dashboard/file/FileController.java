package com.energia.dashboard.file;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final UploadedFileRepository uploadedFileRepository;

    public FileController(UploadedFileRepository uploadedFileRepository) {
        this.uploadedFileRepository = uploadedFileRepository;
    }

    @GetMapping
    public ResponseEntity<List<FileInfoDTO>> listAllFiles() {
        List<FileInfoDTO> files = uploadedFileRepository.findAllFilesWithUserInfo();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileInfoDTO>> listFilesByUser(@PathVariable Long userId) {
        List<FileInfoDTO> files = uploadedFileRepository.findFilesByUserIdWithUserInfo(userId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FileInfoDTO>> searchFiles(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(uploadedFileRepository.findAllFilesWithUserInfo());
        }
        List<FileInfoDTO> files = uploadedFileRepository.searchFiles(q.trim());
        return ResponseEntity.ok(files);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UploadedFile> getFileInfo(@PathVariable Long id) {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findById(id);
        if (!fileOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fileOpt.get());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<FileSystemResource> download(@PathVariable Long id) throws Exception {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findById(id);
        if (!fileOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        UploadedFile meta = fileOpt.get();
        File file = new File(meta.getStoragePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = meta.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = Files.probeContentType(file.toPath());
            if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(file.length())
                .body(new FileSystemResource(file));
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<FileSystemResource> viewFile(@PathVariable Long id) throws Exception {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findById(id);
        if (!fileOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        UploadedFile meta = fileOpt.get();
        File file = new File(meta.getStoragePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = meta.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = Files.probeContentType(file.toPath());
            if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        // Para PDFs, retornar inline para visualização no navegador
        if (contentType.contains("pdf")) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + meta.getOriginalFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(file.length())
                    .body(new FileSystemResource(file));
        }

        // Para outros tipos de arquivo, retornar como download
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(file.length())
                .body(new FileSystemResource(file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        Optional<UploadedFile> fileOpt = uploadedFileRepository.findById(id);
        if (!fileOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        UploadedFile meta = fileOpt.get();
        File file = new File(meta.getStoragePath());
        
        // Deletar arquivo físico
        if (file.exists()) {
            file.delete();
        }
        
        // Deletar registro do banco
        uploadedFileRepository.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }
}


