package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.AuditoriaAlteracao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaAlteracaoRepository extends JpaRepository<AuditoriaAlteracao, String> {
    List<AuditoriaAlteracao> findTop500ByOrderByCriadoEmDesc();
}
