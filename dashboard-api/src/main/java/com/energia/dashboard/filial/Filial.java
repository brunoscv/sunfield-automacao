package com.energia.dashboard.filial;

import com.energia.dashboard.matriz.Matriz;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "filiais", indexes = {
        @Index(name = "idx_filiais_matriz", columnList = "matriz_id"),
        @Index(name = "idx_filiais_nome", columnList = "nome")
})
public class Filial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "matriz_id", nullable = false)
    private Matriz matriz;

    @NotBlank
    @Size(max = 150)
    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @NotBlank
    @Size(max = 200)
    @Column(name = "endereco", nullable = false, length = 200)
    private String endereco;

    @NotBlank
    @Size(max = 150)
    @Column(name = "responsavel", nullable = false, length = 150)
    private String responsavel;

    @Size(max = 20)
    @Column(name = "telefone", length = 20)
    private String telefone;

    @NotNull
    @DecimalMin(value = "0.01", message = "Porcentagem deve ser maior que zero")
    @DecimalMax(value = "100.00", message = "Porcentagem não pode ser maior que 100%")
    @Digits(integer = 3, fraction = 2)
    @Column(name = "porcentagem_energia", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentagemEnergia;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Matriz getMatriz() {
        return matriz;
    }

    public void setMatriz(Matriz matriz) {
        this.matriz = matriz;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public BigDecimal getPorcentagemEnergia() {
        return porcentagemEnergia;
    }

    public void setPorcentagemEnergia(BigDecimal porcentagemEnergia) {
        this.porcentagemEnergia = porcentagemEnergia;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Métodos utilitários
    public BigDecimal getEnergiaRecebidaKw() {
        if (matriz != null && matriz.getGeracaoKw() != null) {
            return matriz.getGeracaoKw()
                    .multiply(porcentagemEnergia)
                    .divide(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
}