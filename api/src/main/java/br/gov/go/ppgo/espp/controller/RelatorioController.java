package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.IdentidadeVisual;
import br.gov.go.ppgo.espp.repository.IdentidadeVisualRepository;
import java.io.ByteArrayOutputStream;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/relatorios")
public class RelatorioController {
    public record Coluna(String chave, String rotulo) {}
    public record RelatorioPdfRequest(String titulo, List<Coluna> colunas, List<Map<String, Object>> linhas, Map<String, String> filtros) {}

    private static final DateTimeFormatter DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final float PAGE_W = PDRectangle.A4.getHeight();
    private static final float PAGE_H = PDRectangle.A4.getWidth();
    private static final float LEFT = 36f;
    private static final float RIGHT = 36f;
    private static final float TABLE_W = PAGE_W - LEFT - RIGHT;
    private static final float LOGO_MAX_W = 250f;
    private static final float LOGO_MAX_H = 54f;

    private final IdentidadeVisualRepository identidadeVisual;

    public RelatorioController(IdentidadeVisualRepository identidadeVisual) {
        this.identidadeVisual = identidadeVisual;
    }

    @PostMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> pdf(@RequestBody(required = false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo = gerarPdf(seguro(req));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=espp-relatorio.pdf")
                .contentLength(arquivo.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(arquivo);
    }

    @PostMapping(value = "/xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> xlsx(@RequestBody(required = false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo = gerarXlsx(seguro(req));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=espp-relatorio.xlsx")
                .contentLength(arquivo.length)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(arquivo);
    }

    private RelatorioPdfRequest seguro(RelatorioPdfRequest r) {
        if (r == null) return new RelatorioPdfRequest("Relatório", List.of(), List.of(), Map.of());
        return new RelatorioPdfRequest(
                vazio(r.titulo()) ? "Relatório" : r.titulo(),
                r.colunas() == null ? List.of() : r.colunas(),
                r.linhas() == null ? List.of() : r.linhas(),
                r.filtros() == null ? Map.of() : r.filtros());
    }

    private byte[] gerarPdf(RelatorioPdfRequest r) throws Exception {
        try (PDDocument d = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDType1Font normal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            Optional<byte[]> logo = logoRelatorio();
            PDPage p = novaPagina(d);
            PDPageContentStream cs = new PDPageContentStream(d, p);
            float y = cabecalho(d, cs, bold, normal, r, logo);
            if (!r.colunas().isEmpty()) y = tabelaCabecalho(cs, bold, r, y);
            int i = 0;
            for (Map<String, Object> item : r.linhas()) {
                if (y < 58) {
                    rodape(cs, normal);
                    cs.close();
                    p = novaPagina(d);
                    cs = new PDPageContentStream(d, p);
                    y = cabecalho(d, cs, bold, normal, r, logo);
                    if (!r.colunas().isEmpty()) y = tabelaCabecalho(cs, bold, r, y);
                }
                y = linhaTabela(cs, normal, r, item, y, i++);
            }
            if (r.linhas().isEmpty()) {
                setFill(cs, 88, 96, 105);
                texto(cs, normal, 9, LEFT, y - 22, "Nenhum registro encontrado para os filtros selecionados.");
            }
            rodape(cs, normal);
            cs.close();
            d.save(out);
            return out.toByteArray();
        }
    }

    private float cabecalho(PDDocument doc, PDPageContentStream cs, PDType1Font bold, PDType1Font normal,
                            RelatorioPdfRequest r, Optional<byte[]> logo) throws Exception {
        float top = PAGE_H - 18;
        if (logo.isPresent()) {
            try {
                PDImageXObject img = PDImageXObject.createFromByteArray(doc, logo.get(), "logo-relatorio-espp");
                float escala = Math.min(LOGO_MAX_W / img.getWidth(), LOGO_MAX_H / img.getHeight());
                float w = img.getWidth() * escala;
                float h = img.getHeight() * escala;
                cs.drawImage(img, LEFT, top - h, w, h);
            } catch (RuntimeException ignored) {
                identidadeTexto(cs, bold, normal, top);
            }
        } else {
            identidadeTexto(cs, bold, normal, top);
        }

        float titleY = PAGE_H - 86;
        setFill(cs, 22, 28, 37);
        texto(cs, bold, 17, LEFT, titleY, cortar(r.titulo(), 82));
        texto(cs, normal, 8, PAGE_W - 196, titleY + 3, "Gerado em " + DATA_HORA.format(LocalDateTime.now()));
        texto(cs, bold, 8, PAGE_W - 196, titleY - 10, r.linhas().size() + " registro(s)");

        setStroke(cs, 245, 196, 0);
        cs.setLineWidth(3);
        cs.moveTo(LEFT, titleY - 15);
        cs.lineTo(PAGE_W - RIGHT, titleY - 15);
        cs.stroke();

        float pos = titleY - 31;
        String filtros = r.filtros().entrySet().stream()
                .filter(e -> e.getKey() != null && !vazio(e.getValue()))
                .map(e -> e.getKey() + ": " + e.getValue())
                .collect(Collectors.joining(" | "));
        if (!filtros.isBlank()) {
            setFill(cs, 246, 247, 249);
            cs.addRect(LEFT, pos - 27, TABLE_W, 30);
            cs.fill();
            setFill(cs, 22, 28, 37);
            texto(cs, bold, 7, LEFT + 6, pos - 8, "FILTROS APLICADOS");
            texto(cs, normal, 7.2f, LEFT + 6, pos - 20, cortar(filtros, 155));
            pos -= 39;
        }
        return pos;
    }

    private void identidadeTexto(PDPageContentStream cs, PDType1Font bold, PDType1Font normal, float top) throws Exception {
        setFill(cs, 22, 28, 37);
        texto(cs, bold, 9, LEFT, top - 13, "POLICIA PENAL DO ESTADO DE GOIAS");
        texto(cs, normal, 9, LEFT, top - 27, "Escola Superior de Policia Penal - ESPP");
    }

    private float tabelaCabecalho(PDPageContentStream cs, PDType1Font bold, RelatorioPdfRequest r, float y) throws Exception {
        int total = r.colunas().size() + 1;
        float w = TABLE_W / Math.max(1, total);
        float x = LEFT;
        setFill(cs, 34, 94, 63);
        cs.addRect(LEFT, y - 19, TABLE_W, 21);
        cs.fill();
        setFill(cs, 255, 255, 255);
        texto(cs, bold, 7, x + 4, y - 12, "Nº");
        x += w;
        for (Coluna c : r.colunas()) {
            String rot = c == null ? "" : (vazio(c.rotulo()) ? c.chave() : c.rotulo());
            texto(cs, bold, 7, x + 4, y - 12, cortar(rot == null ? "" : rot.toUpperCase(), Math.max(8, (int) (w / 4.2f))));
            x += w;
        }
        return y - 21;
    }

    private float linhaTabela(PDPageContentStream cs, PDType1Font normal, RelatorioPdfRequest r,
                              Map<String, Object> item, float y, int idx) throws Exception {
        int total = r.colunas().size() + 1;
        float w = TABLE_W / Math.max(1, total);
        if (idx % 2 == 1) {
            setFill(cs, 246, 247, 249);
            cs.addRect(LEFT, y - 18, TABLE_W, 20);
            cs.fill();
        }
        float x = LEFT;
        setFill(cs, 22, 28, 37);
        texto(cs, normal, 7.1f, x + 4, y - 12, String.valueOf(idx + 1));
        setStroke(cs, 216, 221, 228);
        cs.addRect(x, y - 18, w, 20);
        cs.stroke();
        x += w;
        for (Coluna c : r.colunas()) {
            String chave = c == null || c.chave() == null ? "" : c.chave();
            Object v = item == null ? null : item.get(chave);
            setFill(cs, 22, 28, 37);
            texto(cs, normal, 7.1f, x + 4, y - 12,
                    cortar(v == null ? "" : String.valueOf(v), Math.max(8, (int) (w / 4.2f))));
            setStroke(cs, 216, 221, 228);
            cs.addRect(x, y - 18, w, 20);
            cs.stroke();
            x += w;
        }
        return y - 20;
    }

    private void rodape(PDPageContentStream cs, PDType1Font normal) throws Exception {
        setStroke(cs, 220, 224, 230);
        cs.setLineWidth(.6f);
        cs.moveTo(LEFT, 35);
        cs.lineTo(PAGE_W - RIGHT, 35);
        cs.stroke();
        setFill(cs, 95, 103, 112);
        texto(cs, normal, 6.8f, LEFT, 22, "Policia Penal do Estado de Goias - Escola Superior de Policia Penal - ESPP");
    }

    private Optional<byte[]> logoRelatorio() {
        try {
            return identidadeVisual.findById("relatorio-light")
                    .or(() -> identidadeVisual.findById("relatorio-dark"))
                    .map(IdentidadeVisual::getConteudo)
                    .filter(bytes -> bytes != null && bytes.length > 0);
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    private byte[] gerarXlsx(RelatorioPdfRequest req) throws Exception {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sh = wb.createSheet("Relatório");
            int lastCol = Math.max(1, req.colunas().size());
            Font titleFont = wb.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            Font boldFont = wb.createFont();
            boldFont.setBold(true);
            Font whiteBold = wb.createFont();
            whiteBold.setBold(true);
            whiteBold.setColor(IndexedColors.WHITE.getIndex());

            CellStyle title = wb.createCellStyle(); title.setFont(titleFont);
            CellStyle bold = wb.createCellStyle(); bold.setFont(boldFont);
            CellStyle header = wb.createCellStyle();
            header.setFont(whiteBold);
            header.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            header.setBorderBottom(BorderStyle.THIN);
            header.setBorderTop(BorderStyle.THIN);
            header.setBorderLeft(BorderStyle.THIN);
            header.setBorderRight(BorderStyle.THIN);

            int rowIndex = 0;
            Row row = sh.createRow(rowIndex++);
            row.createCell(0).setCellValue("Polícia Penal do Estado de Goiás"); row.getCell(0).setCellStyle(bold);
            sh.createRow(rowIndex++).createCell(0).setCellValue("Escola Superior de Polícia Penal - ESPP");
            row = sh.createRow(rowIndex++);
            row.createCell(0).setCellValue(req.titulo()); row.getCell(0).setCellStyle(title);
            if (lastCol > 0) sh.addMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, lastCol));
            sh.createRow(rowIndex++).createCell(0).setCellValue("Gerado em: " + DATA_HORA.format(LocalDateTime.now()));
            sh.createRow(rowIndex++).createCell(0).setCellValue("Total de registros: " + req.linhas().size());
            rowIndex++;

            if (!req.filtros().isEmpty()) {
                row = sh.createRow(rowIndex++);
                row.createCell(0).setCellValue("Filtros aplicados"); row.getCell(0).setCellStyle(bold);
                for (var e : req.filtros().entrySet()) {
                    if (e.getKey() != null && !vazio(e.getValue())) {
                        row = sh.createRow(rowIndex++);
                        row.createCell(0).setCellValue(e.getKey()); row.getCell(0).setCellStyle(bold);
                        row.createCell(1).setCellValue(e.getValue());
                    }
                }
                rowIndex++;
            }

            row = sh.createRow(rowIndex++);
            Cell numero = row.createCell(0); numero.setCellValue("Nº"); numero.setCellStyle(header);
            for (int i = 0; i < req.colunas().size(); i++) {
                Coluna c = req.colunas().get(i);
                Cell cell = row.createCell(i + 1);
                cell.setCellValue(c == null ? "" : String.valueOf(vazio(c.rotulo()) ? c.chave() : c.rotulo()));
                cell.setCellStyle(header);
            }
            int n = 1;
            for (Map<String, Object> item : req.linhas()) {
                row = sh.createRow(rowIndex++);
                row.createCell(0).setCellValue(n++);
                for (int i = 0; i < req.colunas().size(); i++) {
                    Coluna c = req.colunas().get(i);
                    String chave = c == null || c.chave() == null ? "" : c.chave();
                    Object v = item == null ? null : item.get(chave);
                    row.createCell(i + 1).setCellValue(v == null ? "" : String.valueOf(v));
                }
            }
            for (int i = 0; i <= Math.min(req.colunas().size(), 40); i++) {
                sh.autoSizeColumn(i);
                sh.setColumnWidth(i, Math.min(sh.getColumnWidth(i) + 768, 18000));
            }
            sh.createFreezePane(0, Math.max(0, rowIndex - req.linhas().size() - 1));
            wb.write(out);
            return out.toByteArray();
        }
    }

    private PDPage novaPagina(PDDocument d) {
        PDPage p = new PDPage(new PDRectangle(PAGE_W, PAGE_H));
        d.addPage(p);
        return p;
    }

    private void texto(PDPageContentStream cs, PDType1Font f, float size, float x, float y, String s) throws Exception {
        cs.beginText(); cs.setFont(f, size); cs.newLineAtOffset(x, y); cs.showText(limpar(s)); cs.endText();
    }
    private void setFill(PDPageContentStream cs, int r, int g, int b) throws Exception { cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f); }
    private void setStroke(PDPageContentStream cs, int r, int g, int b) throws Exception { cs.setStrokingColor(r / 255f, g / 255f, b / 255f); }
    private String cortar(String s, int n) { s = limpar(s); return s.length() <= n ? s : s.substring(0, Math.max(0, n - 3)) + "..."; }
    private String limpar(String s) { return s == null ? "" : Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "").replaceAll("[^\\x20-\\x7E]", "-"); }
    private boolean vazio(String s) { return s == null || s.isBlank(); }
}
