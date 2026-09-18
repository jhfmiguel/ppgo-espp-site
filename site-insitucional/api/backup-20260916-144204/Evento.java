package br.gov.go.ppgo.espp.domain;
import jakarta.persistence.*; import lombok.*; import java.time.*; import java.util.UUID;
@Getter @Setter @Entity @Table(name="ESPP_EVENTO") public class Evento {
 @Id @Column(length=36) private String id; @Column(nullable=false,unique=true,length=120) private String slug; @Column(nullable=false,length=250) private String titulo;
 @Column(name="DATA_INICIO",nullable=false) private LocalDate dataInicio; @Column(name="DATA_FIM") private LocalDate dataFim; @Column(length=100) private String horario; @Column(name="LOCAL_EVENTO",length=300) private String local;
 @Column(nullable=false,length=20) private String modalidade; @Column(nullable=false,length=100) private String categoria; @Column(nullable=false,length=1000) private String resumo; @Lob @Column(nullable=false) private String conteudo;
 @Column(name="IMAGEM_URL",length=1000) private String imagemUrl; @Column(name="IMAGEM_ALT",length=300) private String imagemAlt; @Column(name="INSCRICAO_HREF",length=1000) private String inscricaoHref;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private StatusPublicacao status; @Column(nullable=false,length=150) private String autor; @Column(name="CRIADO_EM",nullable=false) private OffsetDateTime criadoEm; @Column(name="ATUALIZADO_EM",nullable=false) private OffsetDateTime atualizadoEm;
 @PrePersist void insert(){ if(id==null) id=UUID.randomUUID().toString(); var n=OffsetDateTime.now(); criadoEm=n; atualizadoEm=n; } @PreUpdate void update(){ atualizadoEm=OffsetDateTime.now(); }
}