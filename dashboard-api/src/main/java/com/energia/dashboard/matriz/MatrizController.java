package com.energia.dashboard.matriz;

import com.energia.dashboard.filial.FilialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matrizes")
@Validated
public class MatrizController {

    private final MatrizRepository matrizRepository;
    private final FilialRepository filialRepository;

    public MatrizController(MatrizRepository matrizRepository, FilialRepository filialRepository) {
        this.matrizRepository = matrizRepository;
        this.filialRepository = filialRepository;
    }

    @GetMapping
    public List<Matriz> list() {
        return matrizRepository.findAll();
    }

    @GetMapping("/with-filiais")
    public List<Matriz> listWithFiliais() {
        return matrizRepository.findAllWithFiliais();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matriz> get(@PathVariable Long id) {
        return matrizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/with-filiais")
    public ResponseEntity<Matriz> getWithFiliais(@PathVariable Long id) {
        Matriz matriz = matrizRepository.findByIdWithFiliais(id);
        if (matriz == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(matriz);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Matriz>> search(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(matrizRepository.findAll());
        }
        List<Matriz> matrizes = matrizRepository.searchMatrizes(q.trim());
        return ResponseEntity.ok(matrizes);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> create(@Valid @RequestBody Matriz matriz) {
        if (matriz.getId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ID deve ser nulo para criação");
        }

        // Validar porcentagem da matriz
        if (matriz.getPorcentagemMatriz().compareTo(BigDecimal.valueOf(100)) > 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem da matriz não pode ser maior que 100%");
        }

        if (matriz.getPorcentagemMatriz().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem da matriz deve ser maior que zero");
        }

        Matriz saved = matrizRepository.save(matriz);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Matriz matriz) {
        Optional<Matriz> existing = matrizRepository.findById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Validar porcentagem da matriz
        if (matriz.getPorcentagemMatriz().compareTo(BigDecimal.valueOf(100)) > 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem da matriz não pode ser maior que 100%");
        }

        if (matriz.getPorcentagemMatriz().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem da matriz deve ser maior que zero");
        }

        // Verificar se a soma das porcentagens das filiais não excede o disponível
        BigDecimal porcentagemFiliais = filialRepository.sumPorcentagemByMatrizId(id);
        if (porcentagemFiliais != null) {
            BigDecimal porcentagemDisponivel = BigDecimal.valueOf(100).subtract(matriz.getPorcentagemMatriz());
            if (porcentagemFiliais.compareTo(porcentagemDisponivel) > 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("A porcentagem da matriz não pode ser alterada pois excederia o total de 100% " +
                              "considerando as filiais já cadastradas (" + porcentagemFiliais + "%)");
            }
        }

        Matriz entity = existing.get();
        entity.setNome(matriz.getNome());
        entity.setEndereco(matriz.getEndereco());
        entity.setResponsavel(matriz.getResponsavel());
        entity.setTelefone(matriz.getTelefone());
        entity.setGeracaoKw(matriz.getGeracaoKw());
        entity.setPorcentagemMatriz(matriz.getPorcentagemMatriz());

        Matriz saved = matrizRepository.save(entity);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!matrizRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Verificar se há filiais associadas
        List<com.energia.dashboard.filial.Filial> filiais = filialRepository.findByMatrizId(id);
        if (!filiais.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Não é possível excluir a matriz pois existem " + filiais.size() + " filiais associadas");
        }

        matrizRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/resumo")
    public ResponseEntity<?> getResumo(@PathVariable Long id) {
        Optional<Matriz> matrizOpt = matrizRepository.findById(id);
        if (!matrizOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Matriz matriz = matrizOpt.get();
        BigDecimal porcentagemFiliais = filialRepository.sumPorcentagemByMatrizId(id);
        if (porcentagemFiliais == null) {
            porcentagemFiliais = BigDecimal.ZERO;
        }

        MatrizResumo resumo = new MatrizResumo();
        resumo.setMatriz(matriz);
        resumo.setPorcentagemTotalFiliais(porcentagemFiliais);
        resumo.setPorcentagemDisponivel(BigDecimal.valueOf(100).subtract(matriz.getPorcentagemMatriz()).subtract(porcentagemFiliais));
        resumo.setQuantidadeFiliais(filialRepository.findByMatrizId(id).size());

        return ResponseEntity.ok(resumo);
    }

    // Classe interna para resumo
    public static class MatrizResumo {
        private Matriz matriz;
        private BigDecimal porcentagemTotalFiliais;
        private BigDecimal porcentagemDisponivel;
        private int quantidadeFiliais;

        // Getters and Setters
        public Matriz getMatriz() { return matriz; }
        public void setMatriz(Matriz matriz) { this.matriz = matriz; }

        public BigDecimal getPorcentagemTotalFiliais() { return porcentagemTotalFiliais; }
        public void setPorcentagemTotalFiliais(BigDecimal porcentagemTotalFiliais) { this.porcentagemTotalFiliais = porcentagemTotalFiliais; }

        public BigDecimal getPorcentagemDisponivel() { return porcentagemDisponivel; }
        public void setPorcentagemDisponivel(BigDecimal porcentagemDisponivel) { this.porcentagemDisponivel = porcentagemDisponivel; }

        public int getQuantidadeFiliais() { return quantidadeFiliais; }
        public void setQuantidadeFiliais(int quantidadeFiliais) { this.quantidadeFiliais = quantidadeFiliais; }
    }
}