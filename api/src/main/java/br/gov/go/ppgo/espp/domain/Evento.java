package br.gov.go.ppgo.espp.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name = "ESPP_EVENTO")
public class Evento {
    @Id @Column(length = 36) private String id;
    @Column(nullable = false, unique = true, length = 120) private String slug;
    @Column(nullable = false, length = 250) private String titulo;
    @Column(name = "DATA_INICIO", nullable = false) private LocalDate dataInicio;
    @Column(name = "DATA_FIM") private LocalDate dataFim;
    @Column(length = 100) private String horario;
    @Column(name = "LOCAL_EVENTO", length = 300) private String local;
    @Column(nullable = false, length = 20) private String modalidade;
    @Column(nullable = false, length = 100) private String categoria;
    @Column(nullable = false, length = 1000) private String resumo;
    @Lob @Column(nullable = false) private String conteudo;
    @Column(name = "IMAGEM_URL", length = 1000) private String imagemUrl;
    @Column(name = "IMAGEM_ALT", length = 300) private String imagemAlt;
    @Column(name = "INSCRICAO_HREF", length = 1000) private String inscricaoHref;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private StatusPublicacao status;
    @Column(nullable = false, length = 150) private String autor;
    @Column(name = "CRIADO_EM", nullable = false) private OffsetDateTime criadoEm;
    @Column(name = "ATUALIZADO_EM", nullable = false) private OffsetDateTime atualizadoEm;

    @PrePersist void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        OffsetDateTime agora = OffsetDateTime.now();
        criadoEm = agora; atualizadoEm = agora;
    }
    @PreUpdate void preUpdate(){atualizadoEm=OffsetDateTime.now();}

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getSlug(){return slug;} public void setSlug(String v){slug=v;}
    public String getTitulo(){return titulo;} public void setTitulo(String v){titulo=v;}
    public LocalDate getDataInicio(){return dataInicio;} public void setDataInicio(LocalDate v){dataInicio=v;}
    public LocalDate getDataFim(){return dataFim;} public void setDataFim(LocalDate v){dataFim=v;}
    public String getHorario(){return horario;} public void setHorario(String v){horario=v;}
    public String getLocal(){return local;} public void setLocal(String v){local=v;}
    public String getModalidade(){return modalidade;} public void setModalidade(String v){modalidade=v;}
    public String getCategoria(){return categoria;} public void setCategoria(String v){categoria=v;}
    public String getResumo(){return resumo;} public void setResumo(String v){resumo=v;}
    public String getConteudo(){return conteudo;} public void setConteudo(String v){conteudo=v;}
    public String getImagemUrl(){return imagemUrl;} public void setImagemUrl(String v){imagemUrl=v;}
    public String getImagemAlt(){return imagemAlt;} public void setImagemAlt(String v){imagemAlt=v;}
    public String getInscricaoHref(){return inscricaoHref;} public void setInscricaoHref(String v){inscricaoHref=v;}
    public StatusPublicacao getStatus(){return status;} public void setStatus(StatusPublicacao v){status=v;}
    public String getAutor(){return autor;} public void setAutor(String v){autor=v;}
    public OffsetDateTime getCriadoEm(){return criadoEm;} public void setCriadoEm(OffsetDateTime v){criadoEm=v;}
    public OffsetDateTime getAtualizadoEm(){return atualizadoEm;} public void setAtualizadoEm(OffsetDateTime v){atualizadoEm=v;}
}