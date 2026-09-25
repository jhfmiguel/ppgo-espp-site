package br.gov.go.ppgo.espp.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import org.hibernate.type.NumericBooleanConverter;

@Entity
@Table(name = "ESPP_CONFIGURACAO_EMAIL")
public class ConfiguracaoEmail {
    @Id private Long id;
    @Column(nullable=false,length=255) private String host;
    @Column(nullable=false) private Integer porta;
    @Column(nullable=false,length=320) private String remetente;
    @Column(nullable=false,length=320) private String destinatario;
    @Column(name="SENHA_CRIPTOGRAFADA",nullable=false,length=2048) private String senhaCriptografada;
    @Convert(converter=NumericBooleanConverter.class) @Column(nullable=false) private boolean autenticacao;
    @Convert(converter=NumericBooleanConverter.class) @Column(nullable=false) private boolean starttls;
    @Column(name="ATUALIZADO_EM",nullable=false) private OffsetDateTime atualizadoEm;

    @PrePersist @PreUpdate void timestamps(){ atualizadoEm=OffsetDateTime.now(); }
    public ConfiguracaoEmail(){ this.id=1L; }
    public void atualizar(String host,Integer porta,String remetente,String destinatario,String senha,boolean autenticacao,boolean starttls){
        this.id=1L; this.host=host; this.porta=porta; this.remetente=remetente; this.destinatario=destinatario;
        this.senhaCriptografada=senha; this.autenticacao=autenticacao; this.starttls=starttls;
    }
    public Long getId(){return id;} public String getHost(){return host;} public Integer getPorta(){return porta;}
    public String getRemetente(){return remetente;} public String getDestinatario(){return destinatario;}
    public String getSenhaCriptografada(){return senhaCriptografada;} public boolean isAutenticacao(){return autenticacao;}
    public boolean isStarttls(){return starttls;} public OffsetDateTime getAtualizadoEm(){return atualizadoEm;}
}