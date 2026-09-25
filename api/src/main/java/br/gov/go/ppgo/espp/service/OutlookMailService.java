package br.gov.go.ppgo.espp.service;

import br.gov.go.ppgo.espp.domain.AnexoMensagem;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Properties;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class OutlookMailService {
    private final ConfiguracaoEmailService configuracao;
    private final AnexoMensagemService anexos;

    public OutlookMailService(ConfiguracaoEmailService configuracao, AnexoMensagemService anexos) {
        this.configuracao = configuracao;
        this.anexos = anexos;
    }

    public boolean isEnabled() { return configuracao.envio().isPresent(); }

    public void enviarContato(String nome, String email, String assunto, String mensagem) throws Exception {
        var c = exigirConfiguracao();
        var sender = sender(c);
        MimeMessage mail = sender.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(mail, false, StandardCharsets.UTF_8.name());
        h.setFrom(c.remetente(), "ESPP - Polícia Penal do Estado de Goiás");
        h.setTo(c.destinatario());
        h.setReplyTo(email);
        h.setSubject("[ESPP] " + assunto);
        h.setText("Nova mensagem enviada pelo formulário público da ESPP.\n\nNome: " + nome + "\nE-mail para resposta: " + email + "\nAssunto: " + assunto + "\n\nMensagem:\n" + mensagem, false);
        sender.send(mail);
    }

    public void enviarResposta(String destinatario,String nome,String assuntoOriginal,String protocolo,String resposta,List<AnexoMensagem> arquivos) throws Exception {
        var c=exigirConfiguracao(); var sender=sender(c);
        MimeMessage mail=sender.createMimeMessage(); boolean multipart=arquivos!=null&&!arquivos.isEmpty();
        MimeMessageHelper h=new MimeMessageHelper(mail,multipart,StandardCharsets.UTF_8.name());
        h.setFrom(c.remetente(),"ESPP - Polícia Penal do Estado de Goiás"); h.setTo(destinatario);
        h.setReplyTo(c.remetente()); h.setSubject("Re: "+assuntoOriginal+" ["+protocolo+"]");
        h.setText("Olá, "+nome+".\n\n"+resposta+"\n\nProtocolo: "+protocolo+"\n\nEscola Superior de Polícia Penal do Estado de Goiás",false);
        if(multipart) for(var a:arquivos) h.addAttachment(a.getNomeOriginal(),new org.springframework.core.io.ByteArrayResource(anexos.ler(a)),a.getContentType());
        sender.send(mail);
    }

    public void enviarNewsletter(String destinatario,String nome,String assunto,String conteudo,String urlDescadastro) throws Exception {
        var c=exigirConfiguracao(); var sender=sender(c); MimeMessage mail=sender.createMimeMessage();
        MimeMessageHelper h=new MimeMessageHelper(mail,false,StandardCharsets.UTF_8.name());
        h.setFrom(c.remetente(),"ESPP - Polícia Penal do Estado de Goiás"); h.setTo(destinatario); h.setSubject(assunto);
        String html="<p>Olá"+(nome==null||nome.isBlank()?"":", "+esc(nome))+".</p><div>"+esc(conteudo).replace("\n","<br>")+"</div><hr><p style=\"font-size:12px\">Você recebeu esta mensagem por estar inscrito na newsletter da ESPP. <a href=\""+esc(urlDescadastro)+"\">Descadastrar meu e-mail</a>.</p>";
        h.setText(html,true); sender.send(mail);
    }

    private ConfiguracaoEmailService.Envio exigirConfiguracao(){return configuracao.envio().orElseThrow(()->new IllegalStateException("Configure o SMTP no painel administrativo antes de enviar e-mails."));}
    private JavaMailSenderImpl sender(ConfiguracaoEmailService.Envio c){JavaMailSenderImpl s=new JavaMailSenderImpl();s.setHost(c.host());s.setPort(c.porta());s.setUsername(c.remetente());s.setPassword(c.senha());Properties p=s.getJavaMailProperties();p.put("mail.smtp.auth",Boolean.toString(c.autenticacao()));p.put("mail.smtp.starttls.enable",Boolean.toString(c.starttls()));p.put("mail.smtp.starttls.required",Boolean.toString(c.starttls()));p.put("mail.smtp.connectiontimeout","10000");p.put("mail.smtp.timeout","10000");p.put("mail.smtp.writetimeout","10000");return s;}
    private static String esc(String v){if(v==null)return "";return v.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("\"","&quot;").replace("'","&#39;");}
}