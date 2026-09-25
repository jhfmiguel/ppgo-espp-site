package br.gov.go.ppgo.espp.service;
import java.util.Properties; import org.springframework.mail.javamail.JavaMailSenderImpl; import org.springframework.stereotype.Component;
@Component public class SmtpConnectionTester {
 public void testar(ConfiguracaoEmailService.Envio c){JavaMailSenderImpl s=new JavaMailSenderImpl();s.setHost(c.host());s.setPort(c.porta());s.setUsername(c.remetente());s.setPassword(c.senha());Properties p=s.getJavaMailProperties();p.put("mail.smtp.auth",Boolean.toString(c.autenticacao()));p.put("mail.smtp.starttls.enable",Boolean.toString(c.starttls()));p.put("mail.smtp.starttls.required",Boolean.toString(c.starttls()));p.put("mail.smtp.connectiontimeout","10000");p.put("mail.smtp.timeout","10000");s.testConnection();}
}