package com.energia.dashboard.filial;

import com.energia.dashboard.matriz.Matriz;
import com.energia.dashboard.matriz.MatrizRepository;
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
@RequestMapping("/api/filiais")
@Validated
public class FilialController {

    private final FilialRepository filialRepository;
    private final MatrizRepository matrizRepository;

    public FilialController(FilialRepository filialRepository, MatrizRepository matrizRepository) {
        this.filialRepository = filialRepository;
        this.matrizRepository = matrizRepository;
    }

    @GetMapping
    public List<Filial> list() {
        return filialRepository.findAll();
    }

    @GetMapping("/with-matriz")
    public List<Filial> listWithMatriz() {
        return filialRepository.findAllWithMatriz();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filial> get(@PathVariable Long id) {
        return filialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/with-matriz")
    public ResponseEntity<Filial> getWithMatriz(@PathVariable Long id) {
        Filial filial = filialRepository.findByIdWithMatriz(id);
        if (filial == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(filial);
    }

    @GetMapping("/by-matriz/{matrizId}")
    public ResponseEntity<List<Filial>> getByMatriz(@PathVariable Long matrizId) {
        if (!matrizRepository.existsById(matrizId)) {
            return ResponseEntity.notFound().build();
        }
        List<Filial> filiais = filialRepository.findByMatrizId(matrizId);
        return ResponseEntity.ok(filiais);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Filial>> search(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(filialRepository.findAll());
        }
        List<Filial> filiais = filialRepository.searchFiliais(q.trim());
        return ResponseEntity.ok(filiais);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> create(@Valid @RequestBody Filial filial) {
        if (filial.getId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ID deve ser nulo para criação");
        }

        if (filial.getMatriz() == null || filial.getMatriz().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Matriz é obrigatória");
        }

        // Verificar se a matriz existe
        Optional<Matriz> matrizOpt = matrizRepository.findById(filial.getMatriz().getId());
        if (!matrizOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Matriz não encontrada");
        }

        Matriz matriz = matrizOpt.get();

        // Validar porcentagem da filial
        if (filial.getPorcentagemEnergia().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem de energia deve ser maior que zero");
        }

        // Verificar se a soma das porcentagens não excede 100%
        BigDecimal porcentagemFiliaisExistentes = filialRepository.sumPorcentagemByMatrizId(matriz.getId());
        if (porcentagemFiliaisExistentes == null) {
            porcentagemFiliaisExistentes = BigDecimal.ZERO;
        }

        BigDecimal porcentagemTotal = matriz.getPorcentagemMatriz()
                .add(porcentagemFiliaisExistentes)
                .add(filial.getPorcentagemEnergia());

        if (porcentagemTotal.compareTo(BigDecimal.valueOf(100)) > 0) {
            BigDecimal porcentagemDisponivel = BigDecimal.valueOf(100)
                    .subtract(matriz.getPorcentagemMatriz())
                    .subtract(porcentagemFiliaisExistentes);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem excede o limite. Disponível: " + porcentagemDisponivel + "%");
        }

        filial.setMatriz(matriz);
        Filial saved = filialRepository.save(filial);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Filial filial) {
        Optional<Filial> existing = filialRepository.findById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Filial entity = existing.get();

        // Validar porcentagem da filial
        if (filial.getPorcentagemEnergia().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem de energia deve ser maior que zero");
        }

        // Verificar se a soma das porcentagens não excede 100% (excluindo a filial atual)
        BigDecimal porcentagemFiliaisExistentes = filialRepository.sumPorcentagemByMatrizId(entity.getMatriz().getId());
        if (porcentagemFiliaisExistentes == null) {
            porcentagemFiliaisExistentes = BigDecimal.ZERO;
        }
        
        // Subtrair a porcentagem atual da filial
        porcentagemFiliaisExistentes = porcentagemFiliaisExistentes.subtract(entity.getPorcentagemEnergia());

        BigDecimal porcentagemTotal = entity.getMatriz().getPorcentagemMatriz()
                .add(porcentagemFiliaisExistentes)
                .add(filial.getPorcentagemEnergia());

        if (porcentagemTotal.compareTo(BigDecimal.valueOf(100)) > 0) {
            BigDecimal porcentagemDisponivel = BigDecimal.valueOf(100)
                    .subtract(entity.getMatriz().getPorcentagemMatriz())
                    .subtract(porcentagemFiliaisExistentes);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Porcentagem excede o limite. Disponível: " + porcentagemDisponivel + "%");
        }

        entity.setNome(filial.getNome());
        entity.setEndereco(filial.getEndereco());
        entity.setResponsavel(filial.getResponsavel());
        entity.setTelefone(filial.getTelefone());
        entity.setPorcentagemEnergia(filial.getPorcentagemEnergia());

        Filial saved = filialRepository.save(entity);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!filialRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        filialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/energia-calculada")
    public ResponseEntity<?> getEnergiaCalculada(@PathVariable Long id) {
        Optional<Filial> filialOpt = filialRepository.findById(id);
        if (!filialOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Filial filial = filialOpt.get();
        BigDecimal energiaRecebida = filial.getEnergiaRecebidaKw();

        FilialEnergiaInfo info = new FilialEnergiaInfo();
        info.setFilial(filial);
        info.setEnergiaRecebidaKw(energiaRecebida);
        info.setGeracaoTotalMatrizKw(filial.getMatriz().getGeracaoKw());

        return ResponseEntity.ok(info);
    }

    // Classe interna para informações de energia
    public static class FilialEnergiaInfo {
        private Filial filial;
        private BigDecimal energiaRecebidaKw;
        private BigDecimal geracaoTotalMatrizKw;

        // Getters and Setters
        public Filial getFilial() { return filial; }
        public void setFilial(Filial filial) { this.filial = filial; }

        public BigDecimal getEnergiaRecebidaKw() { return energiaRecebidaKw; }
        public void setEnergiaRecebidaKw(BigDecimal energiaRecebidaKw) { this.energiaRecebidaKw = energiaRecebidaKw; }

        public BigDecimal getGeracaoTotalMatrizKw() { return geracaoTotalMatrizKw; }
        public void setGeracaoTotalMatrizKw(BigDecimal geracaoTotalMatrizKw) { this.geracaoTotalMatrizKw = geracaoTotalMatrizKw; }
    }
}