package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.IdentidadeVisual;
import br.gov.go.ppgo.espp.repository.IdentidadeVisualRepository;
import br.gov.go.ppgo.espp.service.AuditoriaService;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
public class IdentidadeVisualController {
    private static final Set<String> CHAVES = Set.of(
            "site-light", "site-dark",
            "admin-light", "admin-dark",
            "brasao-light", "brasao-dark",
            "relatorio-light", "relatorio-dark");

    private final IdentidadeVisualRepository repository;
    private final AuditoriaService auditoria;

    public IdentidadeVisualController(IdentidadeVisualRepository repository, AuditoriaService auditoria) {
        this.repository = repository;
        this.auditoria = auditoria;
    }

    @GetMapping("/identidade-visual/{chave}")
    public ResponseEntity<byte[]> imagem(@PathVariable String chave) {
        validar(chave);
        return repository.findById(chave)
                .map(item -> ResponseEntity.ok()
                        .cacheControl(CacheControl.noCache())
                        .contentType(MediaType.parseMediaType(item.getContentType()))
                        .body(item.getConteudo()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/admin/configuracoes/identidade-visual/{chave}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void salvar(@PathVariable String chave, @RequestPart("arquivo") MultipartFile arquivo, Authentication auth) throws IOException {
        validar(chave);
        String tipo = arquivo.getContentType();
        if (arquivo.isEmpty() || arquivo.getSize() > 3_000_000) {
            throw new IllegalArgumentException("A imagem deve ter no máximo 3 MB.");
        }
        if (!Set.of("image/png", "image/jpeg", "image/webp", "image/svg+xml").contains(tipo)) {
            throw new IllegalArgumentException("Use PNG, JPG, WebP ou SVG.");
        }
        var item = repository.findById(chave).orElseGet(IdentidadeVisual::new);
        item.atualizar(chave, arquivo.getBytes(), tipo, ator(auth));
        repository.save(item);
        auditoria.registrar("CONFIGURACOES", "EDICAO", chave, "Identidade visual", ator(auth), null, Map.of("chave", chave));
    }

    @DeleteMapping("/admin/configuracoes/identidade-visual/{chave}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable String chave, Authentication auth) {
        validar(chave);
        repository.deleteById(chave);
        auditoria.registrar("CONFIGURACOES", "EXCLUSAO", chave, "Identidade visual", ator(auth), null, Map.of("chave", chave));
    }

    private void validar(String chave) {
        if (!CHAVES.contains(chave)) {
            throw new IllegalArgumentException("Imagem inválida.");
        }
    }

    private String ator(Authentication auth) {
        return auth == null ? "sistema" : auth.getName();
    }
}
