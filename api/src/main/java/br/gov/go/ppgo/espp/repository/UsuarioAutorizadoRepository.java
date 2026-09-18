package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.UsuarioAutorizado;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioAutorizadoRepository extends JpaRepository<UsuarioAutorizado, String> {

    Optional<UsuarioAutorizado> findByIdentificadorInstitucionalIgnoreCaseAndAtivoTrue(
            String identificadorInstitucional);
}