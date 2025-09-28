package com.energia.dashboard.matriz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatrizRepository extends JpaRepository<Matriz, Long> {

    List<Matriz> findByNomeContainingIgnoreCase(String nome);

    List<Matriz> findByResponsavelContainingIgnoreCase(String responsavel);

    @Query("SELECT m FROM Matriz m WHERE " +
           "LOWER(m.nome) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.responsavel) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.endereco) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Matriz> searchMatrizes(@Param("searchTerm") String searchTerm);

    @Query("SELECT m FROM Matriz m LEFT JOIN FETCH m.filiais WHERE m.id = :id")
    Matriz findByIdWithFiliais(@Param("id") Long id);

    @Query("SELECT m FROM Matriz m LEFT JOIN FETCH m.filiais")
    List<Matriz> findAllWithFiliais();
}