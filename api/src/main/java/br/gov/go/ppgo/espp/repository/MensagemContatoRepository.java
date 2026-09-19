package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.MensagemContato;
import br.gov.go.ppgo.espp.domain.StatusMensagem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensagemContatoRepository extends JpaRepository<MensagemContato, String> {
    List<MensagemContato> findAllByOrderByCriadoEmDesc();
    long countByStatus(StatusMensagem status);
}