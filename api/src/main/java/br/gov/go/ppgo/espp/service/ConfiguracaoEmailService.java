package br.gov.go.ppgo.espp.service;
import br.gov.go.ppgo.espp.domain.ConfiguracaoEmail; import br.gov.go.ppgo.espp.repository.ConfiguracaoEmailRepository;
import java.util.*; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service
public class ConfiguracaoEmailService {
 private static final long ID=1L; private final ConfiguracaoEmailRepository repo; private final ConfiguracaoCriptografiaService crypto; private final AuditoriaService audit;
 private final String hostPadrao; private final int portaPadrao; private final String remetentePadrao; private final String destinatarioPadrao;
 public ConfiguracaoEmailService(ConfiguracaoEmailRepository r,ConfiguracaoCriptografiaService c,AuditoriaService a,@Value("${spring.mail.host:smtp.gmail.com}")String h,@Value("${spring.mail.port:587}")int p,@Value("${spring.mail.username:}")String rem,@Value("${espp.contato.destinatario:}")String dest){repo=r;crypto=c;audit=a;hostPadrao=h;portaPadrao=p;remetentePadrao=norm(rem);destinatarioPadrao=norm(dest);}
 @Transactional(readOnly=true) public View buscar(){return repo.findById(ID).map(this::view).orElse(new View(hostPadrao,portaPadrao,remetentePadrao,destinatarioPadrao,true,true,false));}
 @Transactional public View salvar(Cmd c,String ator){if(c.host()==null||c.host().isBlank()||c.porta()==null||c.porta()<1||c.porta()>65535||c.remetente()==null||c.remetente().isBlank()||c.destinatario()==null||c.destinatario().isBlank())throw new IllegalArgumentException("Preencha corretamente a configuração SMTP.");
   ConfiguracaoEmail e=repo.findById(ID).orElseGet(ConfiguracaoEmail::new);Object antes=repo.findById(ID).map(this::snapshot).orElse(null);String senha=e.getSenhaCriptografada();
   if(c.senha()!=null&&!c.senha().isBlank())senha=crypto.criptografar(c.senha()); else if(senha==null||senha.isBlank())throw new IllegalArgumentException("Informe a senha SMTP no primeiro cadastro.");
   e.atualizar(c.host().trim(),c.porta(),c.remetente().trim(),c.destinatario().trim(),senha,c.autenticacao(),c.starttls());e=repo.save(e);audit.registrar("CONFIGURACOES","EDICAO","1","Configuração de e-mail SMTP",ator,antes,snapshot(e));return view(e);
 }
 @Transactional(readOnly=true) public Optional<Envio> envio(){return repo.findById(ID).map(e->new Envio(e.getHost(),e.getPorta(),e.getRemetente(),e.getDestinatario(),crypto.descriptografar(e.getSenhaCriptografada()),e.isAutenticacao(),e.isStarttls()));}
 private View view(ConfiguracaoEmail e){return new View(e.getHost(),e.getPorta(),e.getRemetente(),e.getDestinatario(),e.isAutenticacao(),e.isStarttls(),e.getSenhaCriptografada()!=null&&!e.getSenhaCriptografada().isBlank());}
 private Object snapshot(ConfiguracaoEmail e){return Map.of("host",e.getHost(),"porta",e.getPorta(),"remetente",e.getRemetente(),"destinatario",e.getDestinatario(),"autenticacao",e.isAutenticacao(),"starttls",e.isStarttls(),"senhaConfigurada",e.getSenhaCriptografada()!=null&&!e.getSenhaCriptografada().isBlank());}
 private String norm(String v){return v==null?"":v.trim();}
 public record Cmd(String host,Integer porta,String remetente,String destinatario,String senha,boolean autenticacao,boolean starttls){}
 public record View(String host,Integer porta,String remetente,String destinatario,boolean autenticacao,boolean starttls,boolean senhaConfigurada){}
 public record Envio(String host,Integer porta,String remetente,String destinatario,String senha,boolean autenticacao,boolean starttls){}
}