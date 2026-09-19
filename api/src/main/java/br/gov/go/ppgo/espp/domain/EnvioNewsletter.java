package br.gov.go.ppgo.espp.domain;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name="ESPP_NEWSLETTER_ENVIO")
public class EnvioNewsletter {
 @Id @Column(length=36) private String id;
 @Column(name="CAMPANHA_ID",nullable=false,length=36) private String campanhaId;
 @Column(name="ASSINANTE_ID",length=36) private String assinanteId;
 @Column(nullable=false,length=320) private String email;
 @Column(nullable=false,length=20) private String status;
 @Column(length=1000) private String erro;
 @Column(name="ENVIADO_EM") private OffsetDateTime enviadoEm;
 @PrePersist void pre(){if(id==null)id=UUID.randomUUID().toString();}
 public String getId(){return id;} public void setId(String v){id=v;}
 public String getCampanhaId(){return campanhaId;} public void setCampanhaId(String v){campanhaId=v;}
 public String getAssinanteId(){return assinanteId;} public void setAssinanteId(String v){assinanteId=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getErro(){return erro;} public void setErro(String v){erro=v;}
 public OffsetDateTime getEnviadoEm(){return enviadoEm;} public void setEnviadoEm(OffsetDateTime v){enviadoEm=v;}
}