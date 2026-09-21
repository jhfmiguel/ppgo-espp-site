package br.gov.go.ppgo.espp.service;

import br.gov.go.ppgo.espp.domain.AuditoriaAlteracao;
import br.gov.go.ppgo.espp.repository.AuditoriaAlteracaoRepository;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {
    private final AuditoriaAlteracaoRepository repository;
    private final JsonMapper jsonMapper;

    public AuditoriaService(AuditoriaAlteracaoRepository repository, JsonMapper jsonMapper) {
        this.repository = repository;
        this.jsonMapper = jsonMapper;
    }

    public void registrar(
            String modulo,
            String acao,
            String entidadeId,
            String titulo,
            String usuario,
            Object antes,
            Object depois) {
        var registro = new AuditoriaAlteracao();
        registro.setModulo(modulo);
        registro.setAcao(acao);
        registro.setEntidadeId(entidadeId);
        registro.setTitulo(titulo);
        registro.setUsuario(usuario == null || usuario.isBlank() ? "desconhecido" : usuario);
        registro.setDadosAntes(json(antes));
        registro.setDadosDepois(json(depois));
        repository.save(registro);
    }

    private String json(Object valor) {
        if (valor == null) return null;
        try {
            return jsonMapper.writeValueAsString(valor);
        } catch (Exception e) {
            return "{\"erro\":\"Não foi possível serializar o estado para auditoria.\"}";
        }
    }
}
