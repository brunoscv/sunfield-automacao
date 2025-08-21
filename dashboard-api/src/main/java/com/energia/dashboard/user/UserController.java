package com.energia.dashboard.user;

import com.energia.dashboard.file.FileStorageService;
import com.energia.dashboard.file.UploadedFile;
import com.energia.dashboard.file.UploadedFileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final UserRepository userRepository;
    private final UploadedFileRepository uploadedFileRepository;
    private final FileStorageService fileStorageService;

    public UserController(UserRepository userRepository,
                          UploadedFileRepository uploadedFileRepository,
                          FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.uploadedFileRepository = uploadedFileRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<User> list() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> create(@Valid @RequestBody User user) {
        if (user.getId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @Valid @RequestBody User user) {
        Optional<User> existing = userRepository.findById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        User entity = existing.get();
        entity.setFullName(user.getFullName());
        entity.setCpfCnpj(user.getCpfCnpj());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
        User saved = userRepository.save(entity);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<UploadedFile> uploadPdf(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FileStorageService.StoredFileInfo info = fileStorageService.store(file);

        UploadedFile uf = new UploadedFile();
        uf.setUser(userOpt.get());
        uf.setOriginalFilename(info.getOriginalFilename());
        uf.setStoredFilename(info.getStoredFilename());
        uf.setStoragePath(info.getStoragePath());
        uf.setSizeBytes(info.getSizeBytes());
        uf.setContentType(info.getContentType());

        UploadedFile saved = uploadedFileRepository.save(uf);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}/files")
    public ResponseEntity<List<UploadedFile>> listFiles(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(uploadedFileRepository.findByUserId(id));
    }
}


