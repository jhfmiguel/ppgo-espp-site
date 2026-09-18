package br.gov.go.ppgo.espp.security;

import br.gov.go.ppgo.espp.domain.UsuarioAutorizado;
import br.gov.go.ppgo.espp.repository.UsuarioAutorizadoRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final UsuarioAutorizadoRepository usuarios;

    public AuthorizationService(UsuarioAutorizadoRepository usuarios) {
        this.usuarios = usuarios;
    }

    public Optional<UsuarioAutorizado> findAuthorizedUser(String institutionalId) {
        if (institutionalId == null || institutionalId.isBlank()) {
            return Optional.empty();
        }

        return usuarios.findByIdentificadorInstitucionalIgnoreCaseAndAtivoTrue(
                institutionalId.trim());
    }
}