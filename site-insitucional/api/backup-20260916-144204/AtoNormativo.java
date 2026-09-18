package br.gov.go.ppgo.espp.domain;
import jakarta.persistence.*; import lombok.*; import java.time.*; import java.util.UUID;
@Getter @Setter @Entity @Table(name="ESPP_ATO_NORMATIVO") public class AtoNormativo {
 @Id @Column(length=36) private String id; @Column(nullable=false,length=100) private String tipo; @Column(nullable=false,length=100) private String numero; @Column(nullable=false,length=300) private String titulo; @Column(nullable=false,length=2000) private String ementa;
 @Column(nullable=false,length=20) private String situacao; @Column(nullable=false) private Integer ano; @Column(name="DATA_ATO",nullable=false) private LocalDate data; @Column(length=1000) private String href;
 @Column(name="ANEXO_NOME",length=300) private String anexoNome; @Column(name="ANEXO_URL",length=1000) private String anexoUrl; @Column(name="ANEXO_TAMANHO") private Long anexoTamanho;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private StatusPublicacao status; @Column(nullable=false,length=150) private String autor; @Column(name="CRIADO_EM",nullable=false) private OffsetDateTime criadoEm; @Column(name="ATUALIZADO_EM",nullable=false) private OffsetDateTime atualizadoEm;
 @PrePersist void insert(){ if(id==null) id=UUID.randomUUID().toString(); if(ano==null&&data!=null) ano=data.getYear(); var n=OffsetDateTime.now(); criadoEm=n; atualizadoEm=n; } @PreUpdate void update(){ if(data!=null) ano=data.getYear(); atualizadoEm=OffsetDateTime.now(); }
}