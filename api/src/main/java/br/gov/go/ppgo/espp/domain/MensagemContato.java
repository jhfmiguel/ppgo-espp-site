package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ESPP_MENSAGEM_CONTATO", indexes = {
        @Index(name = "IX_ESPP_MSG_STATUS_CRIADO", columnList = "STATUS,CRIADO_EM"),
        @Index(name = "IX_ESPP_MSG_PROTOCOLO", columnList = "PROTOCOLO")
})
public class MensagemContato {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 30)
    private String protocolo;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, length = 320)
    private String email;

    @Column(length = 40)
    private String telefone;

    @Column(nullable = false, length = 250)
    private String assunto;

    @Lob
    @Column(nullable = false)
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusMensagem status;

    @Column(name = "RESPONSAVEL", length = 200)
    private String responsavel;

    @Lob
    @Column(name = "RESPOSTA")
    private String resposta;

    @Column(name = "RESPONDIDO_EM")
    private OffsetDateTime respondidoEm;

    @Column(name = "CRIADO_EM", nullable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "ATUALIZADO_EM", nullable = false)
    private OffsetDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (status == null) status = StatusMensagem.NOVA;
        var agora = OffsetDateTime.now();
        criadoEm = agora;
        atualizadoEm = agora;
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String v) { id = v; }
    public String getProtocolo() { return protocolo; }
    public void setProtocolo(String v) { protocolo = v; }
    public String getNome() { return nome; }
    public void setNome(String v) { nome = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String v) { telefone = v; }
    public String getAssunto() { return assunto; }
    public void setAssunto(String v) { assunto = v; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String v) { mensagem = v; }
    public StatusMensagem getStatus() { return status; }
    public void setStatus(StatusMensagem v) { status = v; }
    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String v) { responsavel = v; }
    public String getResposta() { return resposta; }
    public void setResposta(String v) { resposta = v; }
    public OffsetDateTime getRespondidoEm() { return respondidoEm; }
    public void setRespondidoEm(OffsetDateTime v) { respondidoEm = v; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime v) { criadoEm = v; }
    public OffsetDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(OffsetDateTime v) { atualizadoEm = v; }
}