package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.*;
import br.gov.go.ppgo.espp.repository.*;
import br.gov.go.ppgo.espp.service.AnexoMensagemService;
import br.gov.go.ppgo.espp.service.AuditoriaService;
import br.gov.go.ppgo.espp.service.OutlookMailService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import jakarta.validation.constraints.*;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ComunicacaoController {
    private final MensagemContatoRepository mensagens;
    private final HistoricoMensagemRepository historicos;
    private final AssinanteNewsletterRepository assinantes;
    private final AnexoMensagemRepository anexoRepository;
    private final AnexoMensagemService anexoService;
    private final OutlookMailService mail;
    private final Validator validator;
    private final CampanhaNewsletterRepository campanhas;
    private final EnvioNewsletterRepository envios;
    private final AuditoriaService auditoria;
    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}") private String frontendUrl;

    public ComunicacaoController(
            MensagemContatoRepository mensagens,
            HistoricoMensagemRepository historicos,
            AssinanteNewsletterRepository assinantes,
            AnexoMensagemRepository anexoRepository,
            AnexoMensagemService anexoService,
            OutlookMailService mail,
            Validator validator,
            CampanhaNewsletterRepository campanhas,
            EnvioNewsletterRepository envios,
            AuditoriaService auditoria) {
        this.mensagens = mensagens;
        this.historicos = historicos;
        this.assinantes = assinantes;
        this.anexoRepository = anexoRepository;
        this.anexoService = anexoService;
        this.mail = mail;
        this.validator = validator;
        this.campanhas = campanhas;
        this.envios = envios;
        this.auditoria = auditoria;
    }

    public record ContatoReq(
            @NotBlank @Size(max = 200) String nome,
            @NotBlank @Email @Size(max = 320) String email,
            @Size(max = 40) String telefone,
            @NotBlank @Size(max = 250) String assunto,
            @NotBlank @Size(max = 10000) String mensagem) {}

    public record NewsletterReq(
            @NotBlank @Email @Size(max = 320) String email,
            @Size(max = 200) String nome,
            @Size(max = 100) String origem) {}

    public record MensagemAdminReq(
            StatusMensagem status,
            @Size(max = 200) String responsavel,
            @Size(max = 10000) String resposta,
            @Size(max = 10000) String notaInterna,
            Boolean enviarEmail) {}

    public record NewsletterAdminReq(StatusNewsletter status) {}
    public record CampanhaReq(@NotBlank @Size(max=250) String assunto, @NotBlank @Size(max=20000) String conteudo) {}
    public record CampanhaDetalhe(CampanhaNewsletter campanha, List<EnvioNewsletter> envios, boolean emailHabilitado) {}
    public record MensagemDetalhe(
            MensagemContato mensagem,
            List<HistoricoMensagem> historico,
            List<AnexoMensagem> anexos,
            boolean emailHabilitado) {}
    public record ResumoComunicacao(
            long mensagensTotal, long mensagensNovas, long mensagensEmAtendimento,
            long mensagensRespondidas, long assinantesTotal, long assinantesAtivos,
            long assinantesDescadastrados, long assinantesBloqueados) {}

    @PostMapping(value="/api/v1/public/contato", consumes=MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    MensagemContato receberContatoJson(@Valid @RequestBody ContatoReq r) {
        return criarContato(r, List.of());
    }

    @PostMapping(value="/api/v1/public/contato", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    MensagemContato receberContatoMultipart(
            @RequestParam String nome,
            @RequestParam String email,
            @RequestParam(required=false) String telefone,
            @RequestParam String assunto,
            @RequestParam String mensagem,
            @RequestPart(required=false) List<MultipartFile> anexos) {
        var r = new ContatoReq(nome, email, telefone, assunto, mensagem);
        validar(r);
        return criarContato(r, anexos == null ? List.of() : anexos);
    }

    private MensagemContato criarContato(ContatoReq r, List<MultipartFile> arquivos) {
        anexoService.validarQuantidade(arquivos);
        var m = new MensagemContato();
        m.setProtocolo(novoProtocolo());
        m.setNome(r.nome().trim());
        m.setEmail(r.email().trim().toLowerCase(Locale.ROOT));
        m.setTelefone(limpar(r.telefone()));
        m.setAssunto(r.assunto().trim());
        m.setMensagem(r.mensagem().trim());
        m.setStatus(StatusMensagem.NOVA);
        m = mensagens.save(m);
        var h = registrar(m.getId(), TipoInteracaoMensagem.RECEBIMENTO,
                "Mensagem recebida pelo formulário público.", "site");
        for (var arquivo : arquivos) {
            if (arquivo != null && !arquivo.isEmpty()) {
                try {
                    anexoService.salvar(m.getId(), h.getId(), arquivo, DirecaoAnexoMensagem.RECEBIDO);
                } catch (IOException e) {
                    throw new IllegalStateException("Falha ao armazenar anexo.", e);
                }
            }
        }
        try {
            mail.enviarContato(m.getNome(), m.getEmail(), m.getAssunto(), m.getMensagem());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "A mensagem foi registrada, mas o canal de e-mail da ESPP não pôde ser acionado.", e);
        }
        return m;
    }

    @PostMapping("/api/v1/public/newsletter")
    @Transactional
    ResponseEntity<Map<String, Object>> assinar(@Valid @RequestBody NewsletterReq r) {
        String email = r.email().trim().toLowerCase(Locale.ROOT);
        if (assinantes.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O e-mail informado jÃ¡ foi cadastrado anteriormente.");
        }
        var a = new AssinanteNewsletter();
        a.setEmail(email);
        a.setNome(limpar(r.nome()));
        a.setOrigem(r.origem() == null || r.origem().isBlank() ? "site" : r.origem().trim());
        a.setStatus(StatusNewsletter.ATIVO);
        a.setConsentidoEm(OffsetDateTime.now());
        assinantes.save(a);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
    }

    @PostMapping("/api/v1/public/newsletter/descadastrar/{token}")
    @Transactional
    ResponseEntity<Map<String, Object>> descadastrar(@PathVariable String token) {
        var a = assinantes.findByTokenDescadastro(token).orElseThrow(EntityNotFoundException::new);
        a.setStatus(StatusNewsletter.DESCADASTRADO);
        a.setCanceladoEm(OffsetDateTime.now());
        assinantes.save(a);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/api/v1/admin/newsletter/campanhas")
    List<CampanhaNewsletter> listarCampanhas(){ return campanhas.findAllByOrderByCriadoEmDesc(); }

    @PostMapping("/api/v1/admin/newsletter/campanhas")
    @ResponseStatus(HttpStatus.CREATED) @Transactional
    CampanhaNewsletter criarCampanha(
            @Valid @RequestBody CampanhaReq r,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario){
        var c=new CampanhaNewsletter();
        c.setAssunto(r.assunto().trim());
        c.setConteudo(r.conteudo().trim());
        c.setCriadoPor(ator(usuario, auth));
        c = campanhas.save(c);
        auditoria.registrar("NEWSLETTER_CAMPANHAS", "CRIACAO", c.getId(), c.getAssunto(), ator(usuario, auth), null, c);
        return c;
    }

    @PutMapping("/api/v1/admin/newsletter/campanhas/{id}")
    @Transactional
    CampanhaNewsletter atualizarCampanha(
            @PathVariable String id,
            @Valid @RequestBody CampanhaReq r,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        var c = campanhas.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of("assunto", c.getAssunto(), "conteudo", c.getConteudo(), "status", c.getStatus());
        if (c.getStatus() != StatusCampanhaNewsletter.RASCUNHO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Somente campanhas em rascunho podem ser alteradas.");
        }
        c.setAssunto(r.assunto().trim());
        c.setConteudo(r.conteudo().trim());
        c = campanhas.save(c);
        auditoria.registrar("NEWSLETTER_CAMPANHAS", "EDICAO", c.getId(), c.getAssunto(), ator(usuario, auth), antes, c);
        return c;
    }
    @GetMapping("/api/v1/admin/newsletter/campanhas/{id}")
    CampanhaDetalhe buscarCampanha(@PathVariable String id){
        var c=campanhas.findById(id).orElseThrow(EntityNotFoundException::new);
        return new CampanhaDetalhe(c,envios.findByCampanhaIdOrderByEmailAsc(id),mail.isEnabled());
    }

    @PostMapping("/api/v1/admin/newsletter/campanhas/{id}/enviar")
    @Transactional
    CampanhaDetalhe enviarCampanha(
            @PathVariable String id,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario){
        var c=campanhas.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of("status", c.getStatus(), "totalDestinatarios", c.getTotalDestinatarios(), "totalEnviados", c.getTotalEnviados(), "totalFalhas", c.getTotalFalhas());
        if(c.getStatus()!=StatusCampanhaNewsletter.RASCUNHO) throw new ResponseStatusException(HttpStatus.CONFLICT,"A campanha jÃ¡ foi processada.");
        if(!mail.isEnabled()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Microsoft Graph ainda nÃ£o estÃ¡ configurado.");
        var ativos=assinantes.findByStatusOrderByCriadoEmAsc(StatusNewsletter.ATIVO);
        c.setStatus(StatusCampanhaNewsletter.ENVIANDO); c.setTotalDestinatarios(ativos.size()); campanhas.save(c);
        int ok=0,falhas=0;
        for(var a:ativos){
            var e=new EnvioNewsletter();e.setCampanhaId(c.getId());e.setAssinanteId(a.getId());e.setEmail(a.getEmail());
            try{
                String link=frontendUrl.replaceAll("/$","")+"/newsletter/descadastrar?token="+a.getTokenDescadastro();
                mail.enviarNewsletter(a.getEmail(),a.getNome(),c.getAssunto(),c.getConteudo(),link);
                e.setStatus("ENVIADO");e.setEnviadoEm(OffsetDateTime.now());ok++;
            }catch(Exception ex){e.setStatus("FALHA");e.setErro(ex.getMessage()==null?"Falha no envio":ex.getMessage().substring(0,Math.min(1000,ex.getMessage().length())));falhas++;}
            envios.save(e);
        }
        c.setTotalEnviados(ok);c.setTotalFalhas(falhas);c.setEnviadoEm(OffsetDateTime.now());
        c.setStatus(falhas==0?StatusCampanhaNewsletter.ENVIADA:StatusCampanhaNewsletter.FALHA);
        c = campanhas.save(c);
        auditoria.registrar("NEWSLETTER_CAMPANHAS", "EDICAO", c.getId(), c.getAssunto(), ator(usuario, auth), antes, c);
        return new CampanhaDetalhe(c,envios.findByCampanhaIdOrderByEmailAsc(id),mail.isEnabled());
    }
    @GetMapping("/api/v1/admin/mensagens")
    List<MensagemContato> listarMensagens() { return mensagens.findAllByOrderByCriadoEmDesc(); }

    @GetMapping("/api/v1/admin/mensagens/{id}")
    MensagemDetalhe buscarMensagem(@PathVariable String id) {
        var m = mensagens.findById(id).orElseThrow(EntityNotFoundException::new);
        return detalhe(m);
    }

    @PutMapping(value="/api/v1/admin/mensagens/{id}", consumes=MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    MensagemDetalhe atualizarMensagemJson(
            @PathVariable String id, @Valid @RequestBody MensagemAdminReq r,
            Authentication authentication,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        return atualizar(id, r, List.of(), authentication, usuario);
    }

    @PutMapping(value="/api/v1/admin/mensagens/{id}", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    MensagemDetalhe atualizarMensagemMultipart(
            @PathVariable String id,
            @RequestParam(required=false) StatusMensagem status,
            @RequestParam(required=false) String responsavel,
            @RequestParam(required=false) String resposta,
            @RequestParam(required=false) String notaInterna,
            @RequestParam(defaultValue="false") boolean enviarEmail,
            @RequestPart(required=false) List<MultipartFile> anexos,
            Authentication authentication,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        var r = new MensagemAdminReq(status, responsavel, resposta, notaInterna, enviarEmail);
        validar(r);
        return atualizar(id, r, anexos == null ? List.of() : anexos, authentication, usuario);
    }

    private MensagemDetalhe atualizar(
            String id, MensagemAdminReq r, List<MultipartFile> arquivos,
            Authentication authentication, String usuarioCabecalho) {
        var m = mensagens.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of(
                "status", m.getStatus(),
                "responsavel", String.valueOf(m.getResponsavel()),
                "resposta", String.valueOf(m.getResposta()));
        String usuario = ator(usuarioCabecalho, authentication);

        if (r.status() != null && r.status() != m.getStatus()) {
            registrar(id, TipoInteracaoMensagem.ALTERACAO_STATUS,
                    "Status alterado de " + m.getStatus() + " para " + r.status() + ".", usuario);
            m.setStatus(r.status());
        }
        if (r.responsavel() != null) {
            String responsavel = limpar(r.responsavel());
            if (!Objects.equals(responsavel, m.getResponsavel())) {
                m.setResponsavel(responsavel);
                registrar(id, TipoInteracaoMensagem.ATRIBUICAO,
                        responsavel == null ? "Responsável removido." : "Atendimento atribuído a " + responsavel + ".",
                        usuario);
            }
        }
        String nota = limpar(r.notaInterna());
        if (nota != null) registrar(id, TipoInteracaoMensagem.NOTA_INTERNA, nota, usuario);

        String resposta = limpar(r.resposta());
        if (resposta == null && arquivos != null && arquivos.stream().anyMatch(a -> a != null && !a.isEmpty())) {
            throw new IllegalArgumentException("Anexos de resposta exigem uma resposta textual.");
        }
        if (resposta != null) {
            anexoService.validarQuantidade(arquivos);
            var h = registrar(id, TipoInteracaoMensagem.RESPOSTA, resposta, usuario);
            var anexosSalvos = new ArrayList<AnexoMensagem>();
            for (var arquivo : arquivos) {
                if (arquivo != null && !arquivo.isEmpty()) {
                    try {
                        anexosSalvos.add(anexoService.salvar(
                                id, h.getId(), arquivo, DirecaoAnexoMensagem.ENVIADO));
                    } catch (IOException e) {
                        throw new IllegalStateException("Falha ao armazenar anexo.", e);
                    }
                }
            }
            if (Boolean.TRUE.equals(r.enviarEmail())) {
                try {
                    mail.enviarResposta(m.getEmail(), m.getNome(), m.getAssunto(),
                            m.getProtocolo(), resposta, anexosSalvos);
                    h.setDescricao(resposta + "\n\n[E-mail enviado ao solicitante.]");
                    historicos.save(h);
                } catch (Exception e) {
                    throw new IllegalStateException("A resposta nÃ£o foi enviada por e-mail: " + e.getMessage(), e);
                }
            }
            m.setResposta(resposta);
            m.setStatus(StatusMensagem.RESPONDIDA);
            m.setRespondidoEm(OffsetDateTime.now());
            if (m.getResponsavel() == null) m.setResponsavel(usuario);
        }
        m = mensagens.save(m);
        auditoria.registrar("MENSAGENS", "EDICAO", m.getId(), m.getAssunto(), usuario, antes, m);
        return detalhe(m);
    }

    @GetMapping("/api/v1/admin/mensagens/{mensagemId}/anexos/{anexoId}")
    ResponseEntity<ByteArrayResource> baixarAnexo(
            @PathVariable String mensagemId, @PathVariable String anexoId) throws IOException {
        var a = anexoRepository.findById(anexoId).orElseThrow(EntityNotFoundException::new);
        if (!mensagemId.equals(a.getMensagemId())) throw new EntityNotFoundException();
        var resource = new ByteArrayResource(anexoService.ler(a));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(a.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(a.getNomeOriginal()).build().toString())
                .contentLength(a.getTamanho())
                .body(resource);
    }

    @DeleteMapping("/api/v1/admin/mensagens/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void excluirMensagem(
            @PathVariable String id,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        var mensagem = mensagens.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of(
                "protocolo", mensagem.getProtocolo(),
                "nome", mensagem.getNome(),
                "email", mensagem.getEmail(),
                "assunto", mensagem.getAssunto(),
                "status", mensagem.getStatus());
        anexoRepository.deleteByMensagemId(id);
        historicos.deleteAll(historicos.findByMensagemIdOrderByCriadoEmAsc(id));
        mensagens.deleteById(id);
        anexoService.excluirArquivos(id);
        auditoria.registrar("MENSAGENS", "EXCLUSAO", id, mensagem.getAssunto(), ator(usuario, auth), antes, null);
    }

    @GetMapping("/api/v1/admin/newsletter")
    List<AssinanteNewsletter> listarAssinantes() { return assinantes.findAllByOrderByCriadoEmDesc(); }

    @PutMapping("/api/v1/admin/newsletter/{id}")
    @Transactional
    AssinanteNewsletter atualizarAssinante(
            @PathVariable String id,
            @RequestBody NewsletterAdminReq r,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        var a = assinantes.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of("email", a.getEmail(), "status", a.getStatus());
        if (r.status() != null) {
            a.setStatus(r.status());
            a.setCanceladoEm(r.status() == StatusNewsletter.ATIVO ? null : OffsetDateTime.now());
            if (r.status() == StatusNewsletter.ATIVO) a.setConsentidoEm(OffsetDateTime.now());
        }
        a = assinantes.save(a);
        auditoria.registrar("NEWSLETTER_ASSINANTES", "EDICAO", a.getId(), a.getEmail(), ator(usuario, auth), antes, a);
        return a;
    }

    @DeleteMapping("/api/v1/admin/newsletter/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void excluirAssinante(
            @PathVariable String id,
            Authentication auth,
            @RequestHeader(value="X-ESPP-Usuario", required=false) String usuario) {
        var assinante = assinantes.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = Map.of("email", assinante.getEmail(), "nome", String.valueOf(assinante.getNome()), "status", assinante.getStatus());
        for (var envio : envios.findByAssinanteId(id)) {
            envio.setAssinanteId(null);
            envio.setEmail("[removido]");
            envios.save(envio);
        }
        assinantes.deleteById(id);
        auditoria.registrar("NEWSLETTER_ASSINANTES", "EXCLUSAO", id, assinante.getEmail(), ator(usuario, auth), antes, null);
    }

    @GetMapping("/api/v1/admin/comunicacao/resumo")
    ResumoComunicacao resumo() {
        return new ResumoComunicacao(
                mensagens.count(), mensagens.countByStatus(StatusMensagem.NOVA),
                mensagens.countByStatus(StatusMensagem.EM_ATENDIMENTO),
                mensagens.countByStatus(StatusMensagem.RESPONDIDA), assinantes.count(),
                assinantes.countByStatus(StatusNewsletter.ATIVO),
                assinantes.countByStatus(StatusNewsletter.DESCADASTRADO),
                assinantes.countByStatus(StatusNewsletter.BLOQUEADO));
    }

    private MensagemDetalhe detalhe(MensagemContato m) {
        return new MensagemDetalhe(m,
                historicos.findByMensagemIdOrderByCriadoEmAsc(m.getId()),
                anexoService.listar(m.getId()), mail.isEnabled());
    }

    private HistoricoMensagem registrar(
            String mensagemId, TipoInteracaoMensagem tipo, String descricao, String usuario) {
        var h = new HistoricoMensagem();
        h.setMensagemId(mensagemId);
        h.setTipo(tipo);
        h.setDescricao(descricao);
        h.setUsuario(usuario);
        return historicos.save(h);
    }

    private String novoProtocolo() {
        String data = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        for (int i = 0; i < 20; i++) {
            String protocolo = "ESPP-" + data + "-" +
                    String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
            if (mensagens.findAllByOrderByCriadoEmDesc().stream()
                    .noneMatch(m -> protocolo.equals(m.getProtocolo()))) return protocolo;
        }
        return "ESPP-" + data + "-" + System.currentTimeMillis();
    }


    private String ator(String usuario, Authentication autenticacao) {
        if (usuario != null && !usuario.isBlank()) return usuario.trim();
        return autenticacao == null ? "sistema" : autenticacao.getName();
    }

    private <T> void validar(T valor) {
        var violacoes = validator.validate(valor);
        if (!violacoes.isEmpty()) {
            throw new ConstraintViolationException(violacoes);
        }
    }
    private static String limpar(String valor) {
        if (valor == null) return null;
        String v = valor.trim();
        return v.isEmpty() ? null : v;
    }
}
