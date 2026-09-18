package br.gov.go.ppgo.espp.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name = "ESPP_ATO_NORMATIVO")
public class AtoNormativo {
    @Id @Column(length = 36) private String id;
    @Column(nullable = false, length = 100) private String tipo;
    @Column(nullable = false, length = 100) private String numero;
    @Column(nullable = false, length = 300) private String titulo;
    @Column(nullable = false, length = 2000) private String ementa;
    @Column(nullable = false, length = 20) private String situacao;
    @Column(nullable = false) private Integer ano;
    @Column(name = "DATA_ATO", nullable = false) private LocalDate data;
    @Column(length = 1000) private String href;
    @Column(name = "ANEXO_NOME", length = 300) private String anexoNome;
    @Column(name = "ANEXO_URL", length = 1000) private String anexoUrl;
    @Column(name = "ANEXO_TAMANHO") private Long anexoTamanho;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private StatusPublicacao status;
    @Column(nullable = false, length = 150) private String autor;
    @Column(name = "CRIADO_EM", nullable = false) private OffsetDateTime criadoEm;
    @Column(name = "ATUALIZADO_EM", nullable = false) private OffsetDateTime atualizadoEm;

    @PrePersist void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (ano == null && data != null) ano = data.getYear();
        OffsetDateTime agora = OffsetDateTime.now();
        criadoEm = agora; atualizadoEm = agora;
    }
    @PreUpdate void preUpdate() {
        if (data != null) ano = data.getYear();
        atualizadoEm = OffsetDateTime.now();
    }

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getTipo(){return tipo;} public void setTipo(String v){tipo=v;}
    public String getNumero(){return numero;} public void setNumero(String v){numero=v;}
    public String getTitulo(){return titulo;} public void setTitulo(String v){titulo=v;}
    public String getEmenta(){return ementa;} public void setEmenta(String v){ementa=v;}
    public String getSituacao(){return situacao;} public void setSituacao(String v){situacao=v;}
    public Integer getAno(){return ano;} public void setAno(Integer v){ano=v;}
    public LocalDate getData(){return data;} public void setData(LocalDate v){data=v;}
    public String getHref(){return href;} public void setHref(String v){href=v;}
    public String getAnexoNome(){return anexoNome;} public void setAnexoNome(String v){anexoNome=v;}
    public String getAnexoUrl(){return anexoUrl;} public void setAnexoUrl(String v){anexoUrl=v;}
    public Long getAnexoTamanho(){return anexoTamanho;} public void setAnexoTamanho(Long v){anexoTamanho=v;}
    public StatusPublicacao getStatus(){return status;} public void setStatus(StatusPublicacao v){status=v;}
    public String getAutor(){return autor;} public void setAutor(String v){autor=v;}
    public OffsetDateTime getCriadoEm(){return criadoEm;} public void setCriadoEm(OffsetDateTime v){criadoEm=v;}
    public OffsetDateTime getAtualizadoEm(){return atualizadoEm;} public void setAtualizadoEm(OffsetDateTime v){atualizadoEm=v;}
}