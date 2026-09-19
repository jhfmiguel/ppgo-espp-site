package br.gov.go.ppgo.espp.domain;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name="ESPP_NEWSLETTER_CAMPANHA")
public class CampanhaNewsletter {
 @Id @Column(length=36) private String id;
 @Column(nullable=false,length=250) private String assunto;
 @Lob @Column(nullable=false) private String conteudo;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private StatusCampanhaNewsletter status;
 @Column(name="TOTAL_DESTINATARIOS",nullable=false) private int totalDestinatarios;
 @Column(name="TOTAL_ENVIADOS",nullable=false) private int totalEnviados;
 @Column(name="TOTAL_FALHAS",nullable=false) private int totalFalhas;
 @Column(name="CRIADO_POR",length=200) private String criadoPor;
 @Column(name="CRIADO_EM",nullable=false) private OffsetDateTime criadoEm;
 @Column(name="ENVIADO_EM") private OffsetDateTime enviadoEm;
 @PrePersist void pre(){if(id==null)id=UUID.randomUUID().toString();if(status==null)status=StatusCampanhaNewsletter.RASCUNHO;if(criadoEm==null)criadoEm=OffsetDateTime.now();}
 public String getId(){return id;} public void setId(String v){id=v;}
 public String getAssunto(){return assunto;} public void setAssunto(String v){assunto=v;}
 public String getConteudo(){return conteudo;} public void setConteudo(String v){conteudo=v;}
 public StatusCampanhaNewsletter getStatus(){return status;} public void setStatus(StatusCampanhaNewsletter v){status=v;}
 public int getTotalDestinatarios(){return totalDestinatarios;} public void setTotalDestinatarios(int v){totalDestinatarios=v;}
 public int getTotalEnviados(){return totalEnviados;} public void setTotalEnviados(int v){totalEnviados=v;}
 public int getTotalFalhas(){return totalFalhas;} public void setTotalFalhas(int v){totalFalhas=v;}
 public String getCriadoPor(){return criadoPor;} public void setCriadoPor(String v){criadoPor=v;}
 public OffsetDateTime getCriadoEm(){return criadoEm;} public void setCriadoEm(OffsetDateTime v){criadoEm=v;}
 public OffsetDateTime getEnviadoEm(){return enviadoEm;} public void setEnviadoEm(OffsetDateTime v){enviadoEm=v;}
}