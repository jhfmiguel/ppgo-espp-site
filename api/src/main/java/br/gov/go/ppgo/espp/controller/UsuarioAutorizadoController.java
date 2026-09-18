package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.PerfilAcesso;
import br.gov.go.ppgo.espp.domain.UsuarioAutorizado;
import br.gov.go.ppgo.espp.repository.UsuarioAutorizadoRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/usuarios-autorizados")
public class UsuarioAutorizadoController {

    private final UsuarioAutorizadoRepository usuarios;

    public UsuarioAutorizadoController(UsuarioAutorizadoRepository usuarios) {
        this.usuarios = usuarios;
    }

    @GetMapping
    public List<UsuarioAutorizado> listar() {
        return usuarios.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioAutorizado criar(@Valid @RequestBody UsuarioReq req) {
        UsuarioAutorizado usuario = new UsuarioAutorizado();
        aplicar(usuario, req);

        try {
            return usuarios.save(usuario);
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
            @Valid @RequestBody UsuarioReq req) {
        UsuarioAutorizado usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autorizado não encontrado."));

        aplicar(usuario, req);

        try {
            return usuarios.save(usuario);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Identificador institucional já autorizado.",
                    ex);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revogar(@PathVariable String id) {
        UsuarioAutorizado usuario = usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autorizado não encontrado."));
        usuario.setAtivo(false);
        usuarios.save(usuario);
    }

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