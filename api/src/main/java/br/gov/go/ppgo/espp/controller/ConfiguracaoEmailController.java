package br.gov.go.ppgo.espp.controller;
import br.gov.go.ppgo.espp.service.*; import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/admin/configuracoes/email")
public class ConfiguracaoEmailController {
 private final ConfiguracaoEmailService service; private final SmtpConnectionTester tester;
 public ConfiguracaoEmailController(ConfiguracaoEmailService s,SmtpConnectionTester t){service=s;tester=t;}
 @GetMapping public ConfiguracaoEmailService.View buscar(){return service.buscar();}
 @PutMapping public ConfiguracaoEmailService.View salvar(@Valid @RequestBody Req r,Authentication a){return service.salvar(new ConfiguracaoEmailService.Cmd(r.host(),r.porta(),r.remetente(),r.destinatario(),r.senha(),r.autenticacao(),r.starttls()),a==null?"sistema":a.getName());}
 @PostMapping("/testar") public Resultado testar() throws Exception {var c=service.envio().orElseThrow(()->new IllegalStateException("Salve a configuração SMTP antes de executar o teste."));tester.testar(c);return new Resultado(true,"Conexão SMTP validada com sucesso.");}
 public record Req(@NotBlank @Size(max=255)String host,@NotNull @Min(1) @Max(65535)Integer porta,@NotBlank @Email String remetente,@NotBlank @Email String destinatario,@Size(max=1024)String senha,boolean autenticacao,boolean starttls){}
 public record Resultado(boolean sucesso,String mensagem){}
}