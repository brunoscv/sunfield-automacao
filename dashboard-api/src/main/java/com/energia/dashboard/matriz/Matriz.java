package com.energia.dashboard.matriz;

import com.energia.dashboard.filial.Filial;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matrizes", indexes = {
        @Index(name = "idx_matrizes_nome", columnList = "nome")
})
public class Matriz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @DecimalMin(value = "0.01", message = "Geração deve ser maior que zero")
    @Digits(integer = 10, fraction = 2)
    @Column(name = "geracao_kw", nullable = false, precision = 12, scale = 2)
    private BigDecimal geracaoKw;

    @NotNull
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "100.00")
    @Digits(integer = 3, fraction = 2)
    @Column(name = "porcentagem_matriz", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentagemMatriz;

    @OneToMany(mappedBy = "matriz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Filial> filiais = new ArrayList<>();

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

    public BigDecimal getGeracaoKw() {
        return geracaoKw;
    }

    public void setGeracaoKw(BigDecimal geracaoKw) {
        this.geracaoKw = geracaoKw;
    }

    public BigDecimal getPorcentagemMatriz() {
        return porcentagemMatriz;
    }

    public void setPorcentagemMatriz(BigDecimal porcentagemMatriz) {
        this.porcentagemMatriz = porcentagemMatriz;
    }

    public List<Filial> getFiliais() {
        return filiais;
    }

    public void setFiliais(List<Filial> filiais) {
        this.filiais = filiais;
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
    public BigDecimal getPorcentagemFiliais() {
        return BigDecimal.valueOf(100).subtract(porcentagemMatriz);
    }

    public BigDecimal getGeracaoMatrizKw() {
        return geracaoKw.multiply(porcentagemMatriz).divide(BigDecimal.valueOf(100));
    }

    public BigDecimal getGeracaoFiliaisKw() {
        return geracaoKw.multiply(getPorcentagemFiliais()).divide(BigDecimal.valueOf(100));
    }
}