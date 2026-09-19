package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.AnexoMensagem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnexoMensagemRepository extends JpaRepository<AnexoMensagem, String> {
    List<AnexoMensagem> findByMensagemIdOrderByCriadoEmAsc(String mensagemId);
    void deleteByMensagemId(String mensagemId);
}