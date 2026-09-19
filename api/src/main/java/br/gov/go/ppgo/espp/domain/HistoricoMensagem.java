package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ESPP_MENSAGEM_HISTORICO", indexes = {
        @Index(name = "IX_ESPP_MSG_HIST_MSG_DATA", columnList = "MENSAGEM_ID,CRIADO_EM")
})
public class HistoricoMensagem {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "MENSAGEM_ID", nullable = false, length = 36)
    private String mensagemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoInteracaoMensagem tipo;

    @Lob
    @Column(nullable = false)
    private String descricao;

    @Column(name = "USUARIO", length = 200)
    private String usuario;

    @Column(name = "CRIADO_EM", nullable = false)
    private OffsetDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (criadoEm == null) criadoEm = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String v) { id = v; }
    public String getMensagemId() { return mensagemId; }
    public void setMensagemId(String v) { mensagemId = v; }
    public TipoInteracaoMensagem getTipo() { return tipo; }
    public void setTipo(TipoInteracaoMensagem v) { tipo = v; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String v) { descricao = v; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String v) { usuario = v; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime v) { criadoEm = v; }
}