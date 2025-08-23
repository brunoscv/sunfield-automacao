package com.energia.dashboard.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    
    List<UploadedFile> findByUserId(Long userId);
    
    @Query("SELECT new com.energia.dashboard.file.FileInfoDTO(" +
           "f.id, f.originalFilename, f.contentType, f.sizeBytes, f.createdAt, " +
           "u.id, u.fullName, u.cpfCnpj) " +
           "FROM UploadedFile f " +
           "JOIN f.user u " +
           "ORDER BY f.createdAt DESC")
    List<FileInfoDTO> findAllFilesWithUserInfo();
    
    @Query("SELECT new com.energia.dashboard.file.FileInfoDTO(" +
           "f.id, f.originalFilename, f.contentType, f.sizeBytes, f.createdAt, " +
           "u.id, u.fullName, u.cpfCnpj) " +
           "FROM UploadedFile f " +
           "JOIN f.user u " +
           "WHERE u.id = :userId " +
           "ORDER BY f.createdAt DESC")
    List<FileInfoDTO> findFilesByUserIdWithUserInfo(@Param("userId") Long userId);
    
    @Query("SELECT new com.energia.dashboard.file.FileInfoDTO(" +
           "f.id, f.originalFilename, f.contentType, f.sizeBytes, f.createdAt, " +
           "u.id, u.fullName, u.cpfCnpj) " +
           "FROM UploadedFile f " +
           "JOIN f.user u " +
           "WHERE LOWER(f.originalFilename) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(u.cpfCnpj) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY f.createdAt DESC")
    List<FileInfoDTO> searchFiles(@Param("searchTerm") String searchTerm);
}


