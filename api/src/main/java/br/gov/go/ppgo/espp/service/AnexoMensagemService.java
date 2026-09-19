package br.gov.go.ppgo.espp.service;

import br.gov.go.ppgo.espp.domain.AnexoMensagem;
import br.gov.go.ppgo.espp.domain.DirecaoAnexoMensagem;
import br.gov.go.ppgo.espp.repository.AnexoMensagemRepository;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AnexoMensagemService {
    public static final long MAX_BYTES = 8L * 1024 * 1024;
    public static final int MAX_ARQUIVOS = 5;

    private static final Set<String> TIPOS = Set.of(
            "application/pdf", "image/jpeg", "image/png", "image/webp");

    private final Path raiz;
    private final AnexoMensagemRepository repositorio;

    public AnexoMensagemService(
            @Value("${app.storage.attachments-dir}") String dir,
            AnexoMensagemRepository repositorio) {
        this.raiz = Paths.get(dir).toAbsolutePath().normalize();
        this.repositorio = repositorio;
    }

    public List<AnexoMensagem> listar(String mensagemId) {
        return repositorio.findByMensagemIdOrderByCriadoEmAsc(mensagemId);
    }

    public void validarQuantidade(List<MultipartFile> arquivos) {
        long quantidade = arquivos == null ? 0 : arquivos.stream()
                .filter(Objects::nonNull)
                .filter(a -> !a.isEmpty())
                .count();
        if (quantidade > MAX_ARQUIVOS) {
            throw new IllegalArgumentException("Sao permitidos no maximo 5 anexos por interacao.");
        }
    }

    public AnexoMensagem salvar(
            String mensagemId,
            String historicoId,
            MultipartFile arquivo,
            DirecaoAnexoMensagem direcao) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio.");
        }
        if (arquivo.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("Cada anexo pode ter no maximo 8 MB.");
        }

        byte[] conteudo = arquivo.getBytes();
        String tipoDeclarado = Optional.ofNullable(arquivo.getContentType())
                .orElse("").toLowerCase(Locale.ROOT);
        String tipoReal = detectarTipo(conteudo);

        if (!TIPOS.contains(tipoReal) || !tipoCompativel(tipoDeclarado, tipoReal)) {
            throw new IllegalArgumentException("Conteudo do anexo nao corresponde a um formato permitido.");
        }

        String original = Optional.ofNullable(arquivo.getOriginalFilename()).orElse("anexo");
        original = sanitizarNomeOriginal(original);

        String extensao = switch (tipoReal) {
            case "application/pdf" -> ".pdf";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException("Formato de anexo nao permitido.");
        };

        String nome = UUID.randomUUID() + extensao;
        Path pasta = raiz.resolve(mensagemId).normalize();
        if (!pasta.startsWith(raiz)) throw new SecurityException("Caminho invalido.");
        Files.createDirectories(pasta);

        Path destino = pasta.resolve(nome).normalize();
        if (!destino.startsWith(pasta)) throw new SecurityException("Caminho invalido.");
        Files.write(destino, conteudo, StandardOpenOption.CREATE_NEW);

        var a = new AnexoMensagem();
        a.setMensagemId(mensagemId);
        a.setHistoricoId(historicoId);
        a.setNomeOriginal(original);
        a.setNomeArquivo(nome);
        a.setContentType(tipoReal);
        a.setTamanho(conteudo.length);
        a.setDirecao(direcao);

        registrarLimpezaEmRollback(destino);

        try {
            return repositorio.save(a);
        } catch (RuntimeException e) {
            excluirSilenciosamente(destino);
            throw e;
        }
    }

    public byte[] ler(AnexoMensagem anexo) throws IOException {
        Path pasta = raiz.resolve(anexo.getMensagemId()).normalize();
        Path arquivo = pasta.resolve(anexo.getNomeArquivo()).normalize();
        if (!pasta.startsWith(raiz) || !arquivo.startsWith(pasta)) {
            throw new SecurityException("Caminho invalido.");
        }
        return Files.readAllBytes(arquivo);
    }

    public void excluirArquivos(String mensagemId) {
        Path pasta = raiz.resolve(mensagemId).normalize();
        if (!pasta.startsWith(raiz) || !Files.exists(pasta)) return;
        try (var stream = Files.walk(pasta)) {
            stream.sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.deleteIfExists(p); } catch (IOException ignored) {}
            });
        } catch (IOException ignored) {}
    }


    private static void registrarLimpezaEmRollback(Path arquivo) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    excluirSilenciosamente(arquivo);
                }
            }
        });
    }

    private static void excluirSilenciosamente(Path arquivo) {
        try {
            Files.deleteIfExists(arquivo);
            Path pasta = arquivo.getParent();
            if (pasta != null && Files.isDirectory(pasta)) {
                try (var stream = Files.list(pasta)) {
                    if (stream.findAny().isEmpty()) {
                        Files.deleteIfExists(pasta);
                    }
                }
            }
        } catch (IOException ignored) {
            // A falha de limpeza nao pode mascarar a excecao original da transacao.
        }
    }
    private static String sanitizarNomeOriginal(String nome) {
        String base;
        try {
            base = Paths.get(nome).getFileName().toString();
        } catch (InvalidPathException e) {
            base = "anexo";
        }
        base = base.replaceAll("[\\p{Cntrl}\\\\/:*?\"<>|]", "_").trim();
        if (base.isBlank()) base = "anexo";
        return base.length() > 240 ? base.substring(0, 240) : base;
    }

    private static boolean tipoCompativel(String declarado, String real) {
        if (declarado == null || declarado.isBlank() || "application/octet-stream".equals(declarado)) {
            return true;
        }
        if ("image/jpeg".equals(real)) {
            return "image/jpeg".equals(declarado) || "image/jpg".equals(declarado);
        }
        return real.equals(declarado);
    }

    private static String detectarTipo(byte[] b) {
        if (b.length >= 5 && b[0] == '%' && b[1] == 'P' && b[2] == 'D' && b[3] == 'F' && b[4] == '-') {
            return "application/pdf";
        }
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (b.length >= 8 &&
                (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G' &&
                (b[4] & 0xFF) == 0x0D && (b[5] & 0xFF) == 0x0A &&
                (b[6] & 0xFF) == 0x1A && (b[7] & 0xFF) == 0x0A) {
            return "image/png";
        }
        if (b.length >= 12 &&
                b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' &&
                b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return "image/webp";
        }
        return "";
    }
}
