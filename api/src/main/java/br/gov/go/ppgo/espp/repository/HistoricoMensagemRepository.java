package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.HistoricoMensagem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoMensagemRepository extends JpaRepository<HistoricoMensagem, String> {
    List<HistoricoMensagem> findByMensagemIdOrderByCriadoEmAsc(String mensagemId);
}