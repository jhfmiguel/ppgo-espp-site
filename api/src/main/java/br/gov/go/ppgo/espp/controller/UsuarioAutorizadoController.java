package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.PerfilAcesso;
import br.gov.go.ppgo.espp.domain.UsuarioAutorizado;
import br.gov.go.ppgo.espp.repository.UsuarioAutorizadoRepository;
import br.gov.go.ppgo.espp.service.AuditoriaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/usuarios-autorizados")
public class UsuarioAutorizadoController {

    private final UsuarioAutorizadoRepository usuarios;
    private final AuditoriaService auditoria;

    public UsuarioAutorizadoController(
            UsuarioAutorizadoRepository usuarios,
            AuditoriaService auditoria) {
        this.usuarios = usuarios;
        this.auditoria = auditoria;
    }

    @GetMapping
    public List<UsuarioAutorizado> listar() {
        return usuarios.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioAutorizado criar(
            @Valid @RequestBody UsuarioReq req,
            Authentication auth,
            @RequestHeader(value = "X-ESPP-Usuario", required = false) String operador) {
        UsuarioAutorizado usuario = new UsuarioAutorizado();
        aplicar(usuario, req);

        try {
            usuario = usuarios.save(usuario);
            auditoria.registrar(
                    "USUARIOS_AUTORIZADOS", "CRIACAO", usuario.getId(),
                    usuario.getIdentificadorInstitucional(), ator(operador, auth), null, usuario);
            return usuario;
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Identificador institucional já autorizado.",
                    ex);
        }
    }

    @PutMapping("/{id}")
    public UsuarioAutorizado atualizar(
            @PathVariable String id,
            @Valid @RequestBody UsuarioReq req,
            Authentication auth,
            @RequestHeader(value = "X-ESPP-Usuario", required = false) String operador) {
        UsuarioAutorizado usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autorizado não encontrado."));

        var antes = new UsuarioSnapshot(
                usuario.getId(),
                usuario.getIdentificadorInstitucional(),
                usuario.getNome(),
                usuario.getPerfil(),
                usuario.isAtivo());
        aplicar(usuario, req);

        try {
            usuario = usuarios.save(usuario);
            auditoria.registrar(
                    "USUARIOS_AUTORIZADOS", "EDICAO", usuario.getId(),
                    usuario.getIdentificadorInstitucional(), ator(operador, auth), antes, usuario);
            return usuario;
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Identificador institucional já autorizado.",
                    ex);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revogar(
            @PathVariable String id,
            Authentication auth,
            @RequestHeader(value = "X-ESPP-Usuario", required = false) String operador) {
        UsuarioAutorizado usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autorizado não encontrado."));
        var antes = new UsuarioSnapshot(
                usuario.getId(),
                usuario.getIdentificadorInstitucional(),
                usuario.getNome(),
                usuario.getPerfil(),
                usuario.isAtivo());
        usuario.setAtivo(false);
        usuario = usuarios.save(usuario);
        auditoria.registrar(
                "USUARIOS_AUTORIZADOS", "EDICAO", usuario.getId(),
                usuario.getIdentificadorInstitucional(), ator(operador, auth), antes, usuario);
    }

    private String ator(String operador, Authentication auth) {
        if (operador != null && !operador.isBlank()) return operador.trim();
        return auth == null ? "sistema" : auth.getName();
    }

    private record UsuarioSnapshot(
            String id,
            String identificadorInstitucional,
            String nome,
            PerfilAcesso perfil,
            boolean ativo) {}

    private void aplicar(UsuarioAutorizado usuario, UsuarioReq req) {
        usuario.setIdentificadorInstitucional(req.identificadorInstitucional().trim());
        usuario.setNome(req.nome() == null ? null : req.nome().trim());
        usuario.setPerfil(req.perfil());
        usuario.setAtivo(req.ativo());
    }

    public record UsuarioReq(
            @NotBlank @Size(max = 200) String identificadorInstitucional,
            @Size(max = 200) String nome,
            @NotNull PerfilAcesso perfil,
            boolean ativo) {
    }
}