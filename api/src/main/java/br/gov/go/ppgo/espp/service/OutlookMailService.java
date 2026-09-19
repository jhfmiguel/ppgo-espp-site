package br.gov.go.ppgo.espp.service;

import br.gov.go.ppgo.espp.domain.AnexoMensagem;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

@Service
public class OutlookMailService {
    private final JsonMapper json;
    private final HttpClient http = HttpClient.newHttpClient();
    private final boolean enabled;
    private final String tenantId;
    private final String clientId;
    private final String clientSecret;
    private final String from;
    private final AnexoMensagemService anexos;

    public OutlookMailService(
            JsonMapper json,
            AnexoMensagemService anexos,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.tenant-id:}") String tenantId,
            @Value("${app.mail.client-id:}") String clientId,
            @Value("${app.mail.client-secret:}") String clientSecret,
            @Value("${app.mail.from:}") String from) {
        this.json = json;
        this.anexos = anexos;
        this.enabled = enabled;
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.from = from;
    }

    public boolean isEnabled() { return enabled; }

    public void enviarResposta(
            String destinatario,
            String nome,
            String assuntoOriginal,
            String protocolo,
            String resposta,
            List<AnexoMensagem> arquivos) throws Exception {
        validarConfiguracao();
        String token = token();

        var message = new LinkedHashMap<String, Object>();
        message.put("subject", "Re: " + assuntoOriginal + " [" + protocolo + "]");
        message.put("body", Map.of(
                "contentType", "HTML",
                "content", corpoHtml(nome, protocolo, resposta)));
        message.put("toRecipients", List.of(Map.of(
                "emailAddress", Map.of("address", destinatario))));

        if (arquivos != null && !arquivos.isEmpty()) {
            var lista = new ArrayList<Map<String, Object>>();
            long total = 0;
            for (var a : arquivos) {
                total += a.getTamanho();
                // sendMail JSON tem limite prático de requisição; para anexos grandes
                // o sistema preserva o arquivo, mas exige upload session do Graph.
                if (a.getTamanho() > 2_500_000 || total > 2_500_000) {
                    throw new IllegalArgumentException(
                            "Para envio por e-mail, os anexos da resposta devem totalizar até 2,5 MB. " +
                            "Arquivos recebidos continuam aceitando até 8 MB.");
                }
                lista.add(Map.of(
                        "@odata.type", "#microsoft.graph.fileAttachment",
                        "name", a.getNomeOriginal(),
                        "contentType", a.getContentType(),
                        "contentBytes", Base64.getEncoder().encodeToString(anexos.ler(a))));
            }
            message.put("attachments", lista);
        }

        var payload = Map.of("message", message, "saveToSentItems", false);
        String url = "https://graph.microsoft.com/v1.0/users/" +
                UriUtils.encodePathSegment(from, StandardCharsets.UTF_8) + "/sendMail";
        var req = HttpRequest.newBuilder(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(payload)))
                .build();
        var resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() != 202) {
            throw new IllegalStateException("Microsoft Graph recusou o envio: HTTP " + resp.statusCode());
        }
    }

    public void enviarNewsletter(String destinatario, String nome, String assunto, String conteudo, String urlDescadastro) throws Exception {
        validarConfiguracao();
        String accessToken = token();
        String html = "<p>Olá" + (nome == null || nome.isBlank() ? "" : ", " + esc(nome)) + ".</p>" +
                "<div>" + esc(conteudo).replace("\n", "<br>") + "</div>" +
                "<hr><p style=\"font-size:12px\">Você recebeu esta mensagem por estar inscrito na newsletter da ESPP. " +
                "<a href=\"" + esc(urlDescadastro) + "\">Descadastrar meu e-mail</a>.</p>";
        var message = new LinkedHashMap<String,Object>();
        message.put("subject", assunto);
        message.put("body", Map.of("contentType","HTML","content",html));
        message.put("toRecipients", List.of(Map.of("emailAddress",Map.of("address",destinatario))));
        var payload = Map.of("message",message,"saveToSentItems",false);
        String url = "https://graph.microsoft.com/v1.0/users/" +
                UriUtils.encodePathSegment(from, StandardCharsets.UTF_8) + "/sendMail";
        var req = HttpRequest.newBuilder(URI.create(url))
                .header("Authorization","Bearer "+accessToken).header("Content-Type","application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(payload))).build();
        var resp = http.send(req,HttpResponse.BodyHandlers.ofString());
        if(resp.statusCode()!=202) throw new IllegalStateException("Microsoft Graph recusou o envio: HTTP "+resp.statusCode());
    }

    private String token() throws Exception {
        String form = "client_id=" + enc(clientId) +
                "&scope=" + enc("https://graph.microsoft.com/.default") +
                "&client_secret=" + enc(clientSecret) +
                "&grant_type=client_credentials";
        var req = HttpRequest.newBuilder(
                        URI.create("https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();
        var resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() != 200) {
            throw new IllegalStateException("Falha ao autenticar no Microsoft Entra: HTTP " + resp.statusCode());
        }
        JsonNode node = json.readTree(resp.body());
        String token = node.path("access_token").asText();
        if (token.isBlank()) throw new IllegalStateException("Microsoft Entra não retornou access_token.");
        return token;
    }

    private void validarConfiguracao() {
        if (!enabled) throw new IllegalStateException("Envio de e-mail está desabilitado.");
        if (tenantId.isBlank() || clientId.isBlank() || clientSecret.isBlank() || from.isBlank()) {
            throw new IllegalStateException("Configuração do Microsoft Graph está incompleta.");
        }
    }

    private static String enc(String v) {
        return UriUtils.encodeQueryParam(v, StandardCharsets.UTF_8);
    }

    private static String corpoHtml(String nome, String protocolo, String resposta) {
        return "<p>Olá, " + esc(nome) + ".</p>" +
                "<p>" + esc(resposta).replace("\n", "<br>") + "</p>" +
                "<p><strong>Protocolo:</strong> " + esc(protocolo) + "</p>" +
                "<p>Escola Superior da Polícia Penal do Estado de Goiás</p>";
    }

    private static String esc(String v) {
        if (v == null) return "";
        return v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}