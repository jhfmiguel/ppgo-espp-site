package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ESPP_AUDITORIA_ALTERACAO", indexes = {
        @Index(name = "IX_ESPP_AUDIT_DATA", columnList = "CRIADO_EM"),
        @Index(name = "IX_ESPP_AUDIT_MODULO", columnList = "MODULO,CRIADO_EM")
})
public class AuditoriaAlteracao {
    @Id @Column(length = 36) private String id;
    @Column(nullable = false, length = 50) private String modulo;
    @Column(nullable = false, length = 30) private String acao;
    @Column(name = "ENTIDADE_ID", length = 36) private String entidadeId;
    @Column(length = 300) private String titulo;
    @Column(nullable = false, length = 200) private String usuario;
    @Lob @Column(name = "DADOS_ANTES") private String dadosAntes;
    @Lob @Column(name = "DADOS_DEPOIS") private String dadosDepois;
    @Column(name = "CRIADO_EM", nullable = false) private OffsetDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (criadoEm == null) criadoEm = OffsetDateTime.now();
    }

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getModulo(){return modulo;} public void setModulo(String v){modulo=v;}
    public String getAcao(){return acao;} public void setAcao(String v){acao=v;}
    public String getEntidadeId(){return entidadeId;} public void setEntidadeId(String v){entidadeId=v;}
    public String getTitulo(){return titulo;} public void setTitulo(String v){titulo=v;}
    public String getUsuario(){return usuario;} public void setUsuario(String v){usuario=v;}
    public String getDadosAntes(){return dadosAntes;} public void setDadosAntes(String v){dadosAntes=v;}
    public String getDadosDepois(){return dadosDepois;} public void setDadosDepois(String v){dadosDepois=v;}
    public OffsetDateTime getCriadoEm(){return criadoEm;} public void setCriadoEm(OffsetDateTime v){criadoEm=v;}
}
