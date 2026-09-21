package br.gov.go.ppgo.espp.service;

import br.gov.go.ppgo.espp.domain.AuditoriaAlteracao;
import br.gov.go.ppgo.espp.repository.AuditoriaAlteracaoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {
    private final AuditoriaAlteracaoRepository repository;
    private final ObjectMapper objectMapper;

    public AuditoriaService(AuditoriaAlteracaoRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
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
            return objectMapper.writeValueAsString(valor);
        } catch (JsonProcessingException e) {
            return "{\"erro\":\"Não foi possível serializar o estado para auditoria.\"}";
        }
    }
}
