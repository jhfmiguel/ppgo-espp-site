package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.AuditoriaAlteracao;
import br.gov.go.ppgo.espp.repository.AuditoriaAlteracaoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuditoriaController {
    private final AuditoriaAlteracaoRepository auditoria;

    public AuditoriaController(AuditoriaAlteracaoRepository auditoria) {
        this.auditoria = auditoria;
    }

    @GetMapping("/api/v1/admin/auditoria")
    List<AuditoriaAlteracao> listar() {
        return auditoria.findTop500ByOrderByCriadoEmDesc();
    }
}
