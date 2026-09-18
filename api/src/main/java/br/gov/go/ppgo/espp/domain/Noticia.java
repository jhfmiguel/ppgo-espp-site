package br.gov.go.ppgo.espp.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.persistence.*;

@Entity
@Table(name = "ESPP_NOTICIA", indexes = {
        @Index(name = "IX_NOTICIA_STATUS_DATA", columnList = "STATUS,DATA_PUBLICACAO")
})
public class Noticia {
    @Id @Column(length = 36) private String id;
    @Column(nullable = false, unique = true, length = 120) private String slug;
    @Column(nullable = false, length = 250) private String titulo;
    @Column(name = "DATA_PUBLICACAO", nullable = false) private LocalDate data;
    @Column(nullable = false, length = 100) private String categoria;
    @Column(nullable = false, length = 1000) private String resumo;
    @Lob @Column(nullable = false) private String conteudo;
    @Column(name = "IMAGEM_URL", length = 1000) private String imagemUrl;
    @Column(name = "IMAGEM_ALT", length = 300) private String imagemAlt;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private StatusPublicacao status;
    @Column(nullable = false, length = 150) private String autor;
    @Column(name = "CRIADO_EM", nullable = false) private OffsetDateTime criadoEm;
    @Column(name = "ATUALIZADO_EM", nullable = false) private OffsetDateTime atualizadoEm;

    @PrePersist void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        OffsetDateTime agora = OffsetDateTime.now();
        criadoEm = agora;
        atualizadoEm = agora;
    }
    @PreUpdate void preUpdate() { atualizadoEm = OffsetDateTime.now(); }

    public String getId(){return id;} public void setId(String v){id=v;}
    public String getSlug(){return slug;} public void setSlug(String v){slug=v;}
    public String getTitulo(){return titulo;} public void setTitulo(String v){titulo=v;}
    public LocalDate getData(){return data;} public void setData(LocalDate v){data=v;}
    public String getCategoria(){return categoria;} public void setCategoria(String v){categoria=v;}
    public String getResumo(){return resumo;} public void setResumo(String v){resumo=v;}
    public String getConteudo(){return conteudo;} public void setConteudo(String v){conteudo=v;}
    public String getImagemUrl(){return imagemUrl;} public void setImagemUrl(String v){imagemUrl=v;}
    public String getImagemAlt(){return imagemAlt;} public void setImagemAlt(String v){imagemAlt=v;}
    public StatusPublicacao getStatus(){return status;} public void setStatus(StatusPublicacao v){status=v;}
    public String getAutor(){return autor;} public void setAutor(String v){autor=v;}
    public OffsetDateTime getCriadoEm(){return criadoEm;} public void setCriadoEm(OffsetDateTime v){criadoEm=v;}
    public OffsetDateTime getAtualizadoEm(){return atualizadoEm;} public void setAtualizadoEm(OffsetDateTime v){atualizadoEm=v;}
}