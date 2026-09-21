package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.*;
import br.gov.go.ppgo.espp.repository.*;
import br.gov.go.ppgo.espp.service.AuditoriaService;
import br.gov.go.ppgo.espp.service.SlugService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class ConteudoController {
    private final NoticiaRepository noticias;
    private final EventoRepository eventos;
    private final AtoNormativoRepository atos;
    private final SlugService slug;
    private final AuditoriaService auditoria;

    public ConteudoController(
            NoticiaRepository noticias,
            EventoRepository eventos,
            AtoNormativoRepository atos,
            SlugService slug,
            AuditoriaService auditoria) {
        this.noticias = noticias;
        this.eventos = eventos;
        this.atos = atos;
        this.slug = slug;
        this.auditoria = auditoria;
    }

    public record NoticiaReq(
            @NotBlank String titulo,
            @NotNull LocalDate data,
            @NotBlank String categoria,
            @NotBlank String resumo,
            @NotBlank String conteudo,
            String imagemUrl,
            String imagemAlt,
            @NotNull StatusPublicacao status) {}

    public record EventoReq(
            @NotBlank String titulo,
            @NotNull LocalDate dataInicio,
            LocalDate dataFim,
            String horario,
            String local,
            @NotBlank String modalidade,
            @NotBlank String categoria,
            @NotBlank String resumo,
            @NotBlank String conteudo,
            String imagemUrl,
            String imagemAlt,
            String inscricaoHref,
            @NotNull StatusPublicacao status) {}

    public record AtoReq(
            @NotBlank String tipo,
            @NotBlank String numero,
            @NotBlank String titulo,
            @NotBlank String ementa,
            @NotBlank String situacao,
            @NotNull LocalDate data,
            String href,
            String anexoNome,
            String anexoUrl,
            Long anexoTamanho,
            @NotNull StatusPublicacao status) {}

    @GetMapping("/api/v1/public/noticias")
    List<Noticia> pubNoticias() {
        return noticias.findByStatusOrderByDataDesc(StatusPublicacao.PUBLICADO);
    }

    @GetMapping("/api/v1/public/noticias/{s}")
    Noticia pubNoticia(@PathVariable String s) {
        return noticias.findBySlug(s)
                .filter(n -> n.getStatus() == StatusPublicacao.PUBLICADO)
                .orElseThrow(EntityNotFoundException::new);
    }

    @GetMapping("/api/v1/public/eventos")
    List<Evento> pubEventos() {
        return eventos.findByStatusOrderByDataInicioDesc(StatusPublicacao.PUBLICADO);
    }

    @GetMapping("/api/v1/public/eventos/{s}")
    Evento pubEvento(@PathVariable String s) {
        return eventos.findBySlug(s)
                .filter(e -> e.getStatus() == StatusPublicacao.PUBLICADO)
                .orElseThrow(EntityNotFoundException::new);
    }

    @GetMapping("/api/v1/public/atos-normativos")
    List<AtoNormativo> pubAtos() {
        return atos.findByStatusOrderByDataDesc(StatusPublicacao.PUBLICADO);
    }

    @GetMapping("/api/v1/admin/noticias")
    List<Noticia> noticias() {
        return noticias.findAllByOrderByDataDesc();
    }

    @PostMapping("/api/v1/admin/noticias")
    @ResponseStatus(HttpStatus.CREATED)
    Noticia cria(@Valid @RequestBody NoticiaReq r, Authentication a) {
        var n = new Noticia();
        noticia(n, r);
        n.setSlug(slug.unico(r.titulo(), noticias::existsBySlug));
        n.setAutor(a.getName());
        n = noticias.save(n);
        auditoria.registrar("NOTICIAS", "CRIACAO", n.getId(), n.getTitulo(), a.getName(), null, n);
        return n;
    }

    @PutMapping("/api/v1/admin/noticias/{id}")
    Noticia edita(@PathVariable String id, @Valid @RequestBody NoticiaReq r, Authentication a) {
        var n = noticias.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new NoticiaSnapshot(n);
        if (!n.getTitulo().equals(r.titulo())) {
            n.setSlug(slug.unico(r.titulo(), noticias::existsBySlug));
        }
        noticia(n, r);
        n = noticias.save(n);
        auditoria.registrar("NOTICIAS", "EDICAO", n.getId(), n.getTitulo(), a.getName(), antes, n);
        return n;
    }

    @DeleteMapping("/api/v1/admin/noticias/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delN(@PathVariable String id, Authentication a) {
        var n = noticias.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new NoticiaSnapshot(n);
        noticias.delete(n);
        auditoria.registrar("NOTICIAS", "EXCLUSAO", id, n.getTitulo(), a.getName(), antes, null);
    }

    @GetMapping("/api/v1/admin/eventos")
    List<Evento> eventos() {
        return eventos.findAllByOrderByDataInicioDesc();
    }

    @PostMapping("/api/v1/admin/eventos")
    @ResponseStatus(HttpStatus.CREATED)
    Evento cria(@Valid @RequestBody EventoReq r, Authentication a) {
        var e = new Evento();
        evento(e, r);
        e.setSlug(slug.unico(r.titulo(), eventos::existsBySlug));
        e.setAutor(a.getName());
        e = eventos.save(e);
        auditoria.registrar("EVENTOS", "CRIACAO", e.getId(), e.getTitulo(), a.getName(), null, e);
        return e;
    }

    @PutMapping("/api/v1/admin/eventos/{id}")
    Evento edita(@PathVariable String id, @Valid @RequestBody EventoReq r, Authentication a) {
        var e = eventos.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new EventoSnapshot(e);
        if (!e.getTitulo().equals(r.titulo())) {
            e.setSlug(slug.unico(r.titulo(), eventos::existsBySlug));
        }
        evento(e, r);
        e = eventos.save(e);
        auditoria.registrar("EVENTOS", "EDICAO", e.getId(), e.getTitulo(), a.getName(), antes, e);
        return e;
    }

    @DeleteMapping("/api/v1/admin/eventos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delE(@PathVariable String id, Authentication a) {
        var e = eventos.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new EventoSnapshot(e);
        eventos.delete(e);
        auditoria.registrar("EVENTOS", "EXCLUSAO", id, e.getTitulo(), a.getName(), antes, null);
    }

    @GetMapping("/api/v1/admin/atos-normativos")
    List<AtoNormativo> atos() {
        return atos.findAllByOrderByDataDesc();
    }

    @PostMapping("/api/v1/admin/atos-normativos")
    @ResponseStatus(HttpStatus.CREATED)
    AtoNormativo cria(@Valid @RequestBody AtoReq r, Authentication a) {
        var x = new AtoNormativo();
        ato(x, r);
        x.setAutor(a.getName());
        x = atos.save(x);
        auditoria.registrar("ATOS_NORMATIVOS", "CRIACAO", x.getId(), x.getTitulo(), a.getName(), null, x);
        return x;
    }

    @PutMapping("/api/v1/admin/atos-normativos/{id}")
    AtoNormativo edita(@PathVariable String id, @Valid @RequestBody AtoReq r, Authentication a) {
        var x = atos.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new AtoSnapshot(x);
        ato(x, r);
        x = atos.save(x);
        auditoria.registrar("ATOS_NORMATIVOS", "EDICAO", x.getId(), x.getTitulo(), a.getName(), antes, x);
        return x;
    }

    @DeleteMapping("/api/v1/admin/atos-normativos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delA(@PathVariable String id, Authentication a) {
        var x = atos.findById(id).orElseThrow(EntityNotFoundException::new);
        var antes = new AtoSnapshot(x);
        atos.delete(x);
        auditoria.registrar("ATOS_NORMATIVOS", "EXCLUSAO", id, x.getTitulo(), a.getName(), antes, null);
    }

    private void noticia(Noticia n, NoticiaReq r) {
        n.setTitulo(r.titulo());
        n.setData(r.data());
        n.setCategoria(r.categoria());
        n.setResumo(r.resumo());
        n.setConteudo(r.conteudo());
        n.setImagemUrl(r.imagemUrl());
        n.setImagemAlt(r.imagemAlt());
        n.setStatus(r.status());
    }

    private void evento(Evento e, EventoReq r) {
        e.setTitulo(r.titulo());
        e.setDataInicio(r.dataInicio());
        e.setDataFim(r.dataFim());
        e.setHorario(r.horario());
        e.setLocal(r.local());
        e.setModalidade(r.modalidade());
        e.setCategoria(r.categoria());
        e.setResumo(r.resumo());
        e.setConteudo(r.conteudo());
        e.setImagemUrl(r.imagemUrl());
        e.setImagemAlt(r.imagemAlt());
        e.setInscricaoHref(r.inscricaoHref());
        e.setStatus(r.status());
    }

    private void ato(AtoNormativo x, AtoReq r) {
        x.setTipo(r.tipo());
        x.setNumero(r.numero());
        x.setTitulo(r.titulo());
        x.setEmenta(r.ementa());
        x.setSituacao(r.situacao());
        x.setData(r.data());
        x.setAno(r.data().getYear());
        x.setHref(r.href());
        x.setAnexoNome(r.anexoNome());
        x.setAnexoUrl(r.anexoUrl());
        x.setAnexoTamanho(r.anexoTamanho());
        x.setStatus(r.status());
    }

    private record NoticiaSnapshot(
            String id, String slug, String titulo, LocalDate data, String categoria,
            String resumo, String conteudo, String imagemUrl, String imagemAlt,
            StatusPublicacao status, String autor) {
        NoticiaSnapshot(Noticia n) {
            this(n.getId(), n.getSlug(), n.getTitulo(), n.getData(), n.getCategoria(),
                    n.getResumo(), n.getConteudo(), n.getImagemUrl(), n.getImagemAlt(),
                    n.getStatus(), n.getAutor());
        }
    }

    private record EventoSnapshot(
            String id, String slug, String titulo, LocalDate dataInicio, LocalDate dataFim,
            String horario, String local, String modalidade, String categoria, String resumo,
            String conteudo, String imagemUrl, String imagemAlt, String inscricaoHref,
            StatusPublicacao status, String autor) {
        EventoSnapshot(Evento e) {
            this(e.getId(), e.getSlug(), e.getTitulo(), e.getDataInicio(), e.getDataFim(),
                    e.getHorario(), e.getLocal(), e.getModalidade(), e.getCategoria(), e.getResumo(),
                    e.getConteudo(), e.getImagemUrl(), e.getImagemAlt(), e.getInscricaoHref(),
                    e.getStatus(), e.getAutor());
        }
    }

    private record AtoSnapshot(
            String id, String tipo, String numero, String titulo, String ementa, String situacao,
            Integer ano, LocalDate data, String href, String anexoNome, String anexoUrl,
            Long anexoTamanho, StatusPublicacao status, String autor) {
        AtoSnapshot(AtoNormativo x) {
            this(x.getId(), x.getTipo(), x.getNumero(), x.getTitulo(), x.getEmenta(), x.getSituacao(),
                    x.getAno(), x.getData(), x.getHref(), x.getAnexoNome(), x.getAnexoUrl(),
                    x.getAnexoTamanho(), x.getStatus(), x.getAutor());
        }
    }
}
