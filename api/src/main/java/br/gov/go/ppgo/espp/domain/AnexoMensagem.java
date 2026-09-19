package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ESPP_MENSAGEM_ANEXO", indexes = {
        @Index(name = "IX_ESPP_MSG_ANEXO_MSG", columnList = "MENSAGEM_ID,CRIADO_EM")
})
public class AnexoMensagem {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "MENSAGEM_ID", nullable = false, length = 36)
    private String mensagemId;

    @Column(name = "HISTORICO_ID", length = 36)
    private String historicoId;

    @Column(name = "NOME_ORIGINAL", nullable = false, length = 500)
    private String nomeOriginal;

    @Column(name = "NOME_ARQUIVO", nullable = false, length = 500)
    private String nomeArquivo;

    @Column(name = "CONTENT_TYPE", nullable = false, length = 200)
    private String contentType;

    @Column(nullable = false)
    private long tamanho;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DirecaoAnexoMensagem direcao;

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
    public String getHistoricoId() { return historicoId; }
    public void setHistoricoId(String v) { historicoId = v; }
    public String getNomeOriginal() { return nomeOriginal; }
    public void setNomeOriginal(String v) { nomeOriginal = v; }
    public String getNomeArquivo() { return nomeArquivo; }
    public void setNomeArquivo(String v) { nomeArquivo = v; }
    public String getContentType() { return contentType; }
    public void setContentType(String v) { contentType = v; }
    public long getTamanho() { return tamanho; }
    public void setTamanho(long v) { tamanho = v; }
    public DirecaoAnexoMensagem getDirecao() { return direcao; }
    public void setDirecao(DirecaoAnexoMensagem v) { direcao = v; }
    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime v) { criadoEm = v; }
}