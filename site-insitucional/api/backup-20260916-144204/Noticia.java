package br.gov.go.ppgo.espp.domain;
import jakarta.persistence.*; import lombok.*; import java.time.*; import java.util.UUID;
@Getter @Setter @Entity @Table(name="ESPP_NOTICIA",indexes={@Index(name="IX_NOTICIA_STATUS_DATA",columnList="STATUS,DATA_PUBLICACAO")})
public class Noticia {
 @Id @Column(length=36) private String id; @Column(nullable=false,unique=true,length=120) private String slug; @Column(nullable=false,length=250) private String titulo;
 @Column(name="DATA_PUBLICACAO",nullable=false) private LocalDate data; @Column(nullable=false,length=100) private String categoria; @Column(nullable=false,length=1000) private String resumo;
 @Lob @Column(nullable=false) private String conteudo; @Column(name="IMAGEM_URL",length=1000) private String imagemUrl; @Column(name="IMAGEM_ALT",length=300) private String imagemAlt;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private StatusPublicacao status; @Column(nullable=false,length=150) private String autor;
 @Column(name="CRIADO_EM",nullable=false) private OffsetDateTime criadoEm; @Column(name="ATUALIZADO_EM",nullable=false) private OffsetDateTime atualizadoEm;
 @PrePersist void insert(){ if(id==null) id=UUID.randomUUID().toString(); var n=OffsetDateTime.now(); criadoEm=n; atualizadoEm=n; } @PreUpdate void update(){ atualizadoEm=OffsetDateTime.now(); }
}