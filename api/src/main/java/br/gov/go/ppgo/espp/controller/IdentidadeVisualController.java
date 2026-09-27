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
    private static final Set<String> CONTENT_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/svg+xml");

    private final IdentidadeVisualRepository repository;
    private final AuditoriaService auditoria;

    public IdentidadeVisualController(IdentidadeVisualRepository repository, AuditoriaService auditoria) {
        this.repository = repository;
        this.auditoria = auditoria;
    }

    @GetMapping("/identidade-visual/{chave}")
    public ResponseEntity<byte[]> imagem(@PathVariable String chave) {
        validar(chave);
        try {
            return repository.findById(chave)
                    .filter(this::registroValido)
                    .map(item -> ResponseEntity.ok()
                            .cacheControl(CacheControl.noCache())
                            .contentType(MediaType.parseMediaType(item.getContentType()))
                            .body(item.getConteudo()))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException ex) {
            // Identidade visual é opcional. Um registro legado/corrompido não pode
            // derrubar Configurações nem os relatórios; o frontend usa a imagem padrão
            // quando recebe 404. O próximo upload substitui o registro normalmente.
            return ResponseEntity.notFound().cacheControl(CacheControl.noCache()).build();
        }
    }

    @PutMapping(value = "/admin/configuracoes/identidade-visual/{chave}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void salvar(@PathVariable String chave, @RequestPart("arquivo") MultipartFile arquivo, Authentication auth) throws IOException {
        validar(chave);
        String tipo = normalizarContentType(arquivo.getContentType());
        if (arquivo.isEmpty() || arquivo.getSize() > 3_000_000) {
            throw new IllegalArgumentException("A imagem deve ter no máximo 3 MB.");
        }
        if (!CONTENT_TYPES.contains(tipo)) {
            throw new IllegalArgumentException("Use PNG, JPG, WebP ou SVG.");
        }

        // Evita depender da leitura de um registro legado/corrompido para substituí-lo.
        // delete + flush garante que um novo upload sempre consiga reparar a chave.
        if (repository.existsById(chave)) {
            repository.deleteById(chave);
            repository.flush();
        }
        var item = new IdentidadeVisual();
        item.atualizar(chave, arquivo.getBytes(), tipo, ator(auth));
        repository.saveAndFlush(item);
        auditoria.registrar("CONFIGURACOES", "EDICAO", chave, "Identidade visual", ator(auth), null, Map.of("chave", chave));
    }

    @DeleteMapping("/admin/configuracoes/identidade-visual/{chave}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable String chave, Authentication auth) {
        validar(chave);
        if (repository.existsById(chave)) {
            repository.deleteById(chave);
        }
        auditoria.registrar("CONFIGURACOES", "EXCLUSAO", chave, "Identidade visual", ator(auth), null, Map.of("chave", chave));
    }

    private boolean registroValido(IdentidadeVisual item) {
        return item.getConteudo() != null
                && item.getConteudo().length > 0
                && CONTENT_TYPES.contains(normalizarContentType(item.getContentType()));
    }

    private String normalizarContentType(String tipo) {
        if (tipo == null) return "";
        int separador = tipo.indexOf(';');
        return (separador >= 0 ? tipo.substring(0, separador) : tipo).trim().toLowerCase();
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
