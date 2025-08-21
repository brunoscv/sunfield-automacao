package com.energia.dashboard.file;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final UploadedFileRepository uploadedFileRepository;

    public FileController(UploadedFileRepository uploadedFileRepository) {
        this.uploadedFileRepository = uploadedFileRepository;
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
}


