package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ESPP_NEWSLETTER_ASSINANTE", indexes = {
        @Index(name = "IX_ESPP_NEWSLETTER_STATUS", columnList = "STATUS")
})
public class AssinanteNewsletter {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(length = 200)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusNewsletter status;

    @Column(nullable = false, length = 100)
    private String origem;

    @Column(name = "CONSENTIDO_EM", nullable = false)
    private OffsetDateTime consentidoEm;

    @Column(name = "CANCELADO_EM")
    private OffsetDateTime canceladoEm;

    @Column(name = "TOKEN_DESCADASTRO", nullable = false, unique = true, length = 36)
    private String tokenDescadastro;

    @Column(name = "CRIADO_EM", nullable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "ATUALIZADO_EM", nullable = false)
    private OffsetDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (tokenDescadastro == null) tokenDescadastro = UUID.randomUUID().toString();
        if (status == null) status = StatusNewsletter.ATIVO;
        var agora = OffsetDateTime.now();
        criadoEm = agora;
        atualizadoEm = agora;
        if (consentidoEm == null) consentidoEm = agora;
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = OffsetDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String v) { id = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getNome() { return nome; }
    public void setNome(String v) { nome = v; }
    public StatusNewsletter getStatus() { return status; }
    public void setStatus(StatusNewsletter v) { status = v; }
    public String getOrigem() { return origem; }
    public void setOrigem(String v) { origem = v; }
    public OffsetDateTime getConsentidoEm() { return consentidoEm; }
    public void setConsentidoEm(OffsetDateTime v) { consentidoEm = v; }
    public OffsetDateTime getCanceladoEm() { return canceladoEm; }
    public void setCanceladoEm(OffsetDateTime v) { canceladoEm = v; }
    public String getTokenDescadastro() { return tokenDescadastro; }
    public void setTokenDescadastro(String v) { tokenDescadastro = v; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime v) { criadoEm = v; }
    public OffsetDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(OffsetDateTime v) { atualizadoEm = v; }
}