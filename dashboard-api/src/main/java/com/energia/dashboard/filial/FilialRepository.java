package com.energia.dashboard.filial;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FilialRepository extends JpaRepository<Filial, Long> {

    List<Filial> findByMatrizId(Long matrizId);

    List<Filial> findByNomeContainingIgnoreCase(String nome);

    List<Filial> findByResponsavelContainingIgnoreCase(String responsavel);

    @Query("SELECT f FROM Filial f WHERE " +
           "LOWER(f.nome) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.responsavel) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.endereco) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Filial> searchFiliais(@Param("searchTerm") String searchTerm);

    @Query("SELECT f FROM Filial f JOIN FETCH f.matriz WHERE f.id = :id")
    Filial findByIdWithMatriz(@Param("id") Long id);

    @Query("SELECT f FROM Filial f JOIN FETCH f.matriz")
    List<Filial> findAllWithMatriz();

    @Query("SELECT SUM(f.porcentagemEnergia) FROM Filial f WHERE f.matriz.id = :matrizId")
    BigDecimal sumPorcentagemByMatrizId(@Param("matrizId") Long matrizId);
}