package br.gov.go.ppgo.espp.controller;

import br.gov.go.ppgo.espp.domain.IdentidadeVisual;
import br.gov.go.ppgo.espp.repository.IdentidadeVisualRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
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

    private static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private final IdentidadeVisualRepository identidadeVisual;

    public RelatorioController(IdentidadeVisualRepository identidadeVisual) {
        this.identidadeVisual = identidadeVisual;
    }

    @PostMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> pdf(@RequestBody(required = false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo = gerarPdf(seguro(req));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=espp-relatorio.pdf")
                .contentLength(arquivo.length).contentType(MediaType.APPLICATION_PDF).body(arquivo);
    }

    @PostMapping(value = "/xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> xlsx(@RequestBody(required = false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo = gerarXlsx(seguro(req));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=espp-relatorio.xlsx")
                .contentLength(arquivo.length)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(arquivo);
    }

    private RelatorioPdfRequest seguro(RelatorioPdfRequest r) {
        if (r == null) return new RelatorioPdfRequest("Relatório", List.of(), List.of(), Map.of());
        return new RelatorioPdfRequest(vazio(r.titulo()) ? "Relatório" : r.titulo(),
                r.colunas() == null ? List.of() : r.colunas(), r.linhas() == null ? List.of() : r.linhas(),
                r.filtros() == null ? Map.of() : r.filtros());
    }

    private byte[] gerarPdf(RelatorioPdfRequest r) {
        try (PDDocument documento = new PDDocument(); ByteArrayOutputStream saida = new ByteArrayOutputStream()) {
            PDFont normal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont negrito = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDImageXObject logo = carregarLogo(documento);
            String filtros = filtrosTexto(r.filtros());
            String[] cabecalhos = r.colunas().stream().map(c -> vazio(c.rotulo()) ? c.chave() : c.rotulo()).toArray(String[]::new);
            float[] larguras = new float[cabecalhos.length];
            java.util.Arrays.fill(larguras, 100f);
            PdfTabela tabela = new PdfTabela(documento, normal, negrito, logo, r.titulo(), filtros, cabecalhos, larguras, r.linhas().size());
            tabela.iniciar();
            for (Map<String, Object> item : r.linhas()) {
                String[] valores = r.colunas().stream().map(c -> {
                    Object v = item == null ? null : item.get(c.chave());
                    return v == null ? "" : String.valueOf(v);
                }).toArray(String[]::new);
                tabela.linha(valores);
            }
            tabela.finalizar();
            documento.save(saida);
            return saida.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("Não foi possível gerar o PDF.", ex);
        }
    }

    private PDImageXObject carregarLogo(PDDocument documento) throws IOException {
        Optional<byte[]> bytes;
        try {
            bytes = identidadeVisual.findById("relatorio-light").map(IdentidadeVisual::getConteudo)
                    .filter(v -> v != null && v.length > 0);
        } catch (RuntimeException ex) {
            bytes = Optional.empty();
        }
        if (bytes.isEmpty()) return null;
        return PDImageXObject.createFromByteArray(documento, bytes.get(), "logo-relatorio-espp");
    }

    private String filtrosTexto(Map<String, String> filtros) {
        String texto = filtros.entrySet().stream().filter(e -> e.getKey() != null && !vazio(e.getValue()))
                .map(e -> e.getKey() + ": " + e.getValue()).collect(Collectors.joining(" | "));
        return texto.isBlank() ? "Sem filtros adicionais." : texto;
    }

    private byte[] gerarXlsx(RelatorioPdfRequest req) throws Exception {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream saida = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Relatório");
            sheet.createFreezePane(0, 5);

            CellStyle tituloStyle = workbook.createCellStyle();
            Font tituloFont = workbook.createFont();
            tituloFont.setBold(true); tituloFont.setFontHeightInPoints((short) 16); tituloStyle.setFont(tituloFont);
            CellStyle metaStyle = workbook.createCellStyle();
            Font metaFont = workbook.createFont(); metaFont.setFontHeightInPoints((short) 10); metaStyle.setFont(metaFont);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont(); headerFont.setBold(true); headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN); headerStyle.setBorderTop(BorderStyle.THIN);

            Row tituloRow = sheet.createRow(0);
            Cell tituloCell = tituloRow.createCell(0);
            tituloCell.setCellValue("Polícia Penal do Estado de Goiás - ESPP"); tituloCell.setCellStyle(tituloStyle);
            Row subtituloRow = sheet.createRow(1);
            Cell subtitulo = subtituloRow.createCell(0); subtitulo.setCellValue(req.titulo()); subtitulo.setCellStyle(tituloStyle);
            Row filtrosRow = sheet.createRow(2);
            Cell filtrosCell = filtrosRow.createCell(0); filtrosCell.setCellValue(filtrosTexto(req.filtros())); filtrosCell.setCellStyle(metaStyle);
            Row geradoRow = sheet.createRow(3);
            Cell geradoCell = geradoRow.createCell(0);
            geradoCell.setCellValue("Gerado em: " + DATA_HORA.format(LocalDateTime.now(ZONA)) + " | Registros: " + req.linhas().size());
            geradoCell.setCellStyle(metaStyle);

            Row header = sheet.createRow(4);
            for (int i = 0; i < req.colunas().size(); i++) {
                Coluna c = req.colunas().get(i); Cell cell = header.createCell(i);
                cell.setCellValue(c == null ? "" : String.valueOf(vazio(c.rotulo()) ? c.chave() : c.rotulo())); cell.setCellStyle(headerStyle);
            }
            int rowIndex = 5;
            for (Map<String, Object> item : req.linhas()) {
                Row row = sheet.createRow(rowIndex++);
                for (int i = 0; i < req.colunas().size(); i++) {
                    Coluna c = req.colunas().get(i); Object v = item == null ? null : item.get(c.chave());
                    row.createCell(i).setCellValue(v == null ? "" : String.valueOf(v));
                }
            }
            if (!req.linhas().isEmpty() && !req.colunas().isEmpty()) {
                sheet.setAutoFilter(new CellRangeAddress(4, Math.max(4, rowIndex - 1), 0, req.colunas().size() - 1));
            }
            for (int i = 0; i < req.colunas().size(); i++) {
                sheet.autoSizeColumn(i); sheet.setColumnWidth(i, Math.min(sheet.getColumnWidth(i) + 768, 60 * 256));
            }
            workbook.write(saida); return saida.toByteArray();
        }
    }

    private boolean vazio(String s) { return s == null || s.isBlank(); }

    private static final class PdfTabela {
        private static final float MARGEM = 36f, ALTURA_LINHA = 16f, ALTURA_CABECALHO = 22f;
        private static final float TEAL_R=7f/255f,TEAL_G=94f/255f,TEAL_B=86f/255f,GOLD_R=245f/255f,GOLD_G=196f/255f,GOLD_B=0f;
        private static final float TEXT_R=31f/255f,TEXT_G=41f/255f,TEXT_B=55f/255f,MUTED_R=91f/255f,MUTED_G=105f/255f,MUTED_B=122f/255f;
        private static final float BORDER_R=214f/255f,BORDER_G=220f/255f,BORDER_B=228f/255f,SOFT_R=248f/255f,SOFT_G=250f/255f,SOFT_B=252f/255f;
        private final PDDocument documento; private final PDFont normal,negrito; private final PDImageXObject logo;
        private final String titulo,filtros; private final String[] cabecalhos; private final float[] larguras; private final int totalRegistros;
        private PDPage pagina; private PDPageContentStream conteudo; private float y; private int paginaNumero,linhaNumero;

        PdfTabela(PDDocument documento,PDFont normal,PDFont negrito,PDImageXObject logo,String titulo,String filtros,String[] cabecalhos,float[] larguras,int totalRegistros){
            this.documento=documento;this.normal=normal;this.negrito=negrito;this.logo=logo;this.titulo=titulo;this.filtros=filtros;
            this.cabecalhos=new String[cabecalhos.length+1];this.cabecalhos[0]="Nº";System.arraycopy(cabecalhos,0,this.cabecalhos,1,cabecalhos.length);
            float[] numeradas=new float[larguras.length+1];numeradas[0]=28f;System.arraycopy(larguras,0,numeradas,1,larguras.length);this.larguras=ajustarLarguras(numeradas);this.totalRegistros=totalRegistros;
        }
        void iniciar()throws IOException{novaPagina();}
        void linha(String[] valores)throws IOException{if(y<32f+ALTURA_LINHA)novaPagina();float x=MARGEM,baseY=y-ALTURA_LINHA+4f;if(linhaNumero%2!=0){conteudo.setNonStrokingColor(SOFT_R,SOFT_G,SOFT_B);conteudo.addRect(MARGEM,baseY,larguraTabela(),ALTURA_LINHA);conteudo.fill();}conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);caixa(x,baseY,larguras[0],ALTURA_LINHA);escrever(Integer.toString(linhaNumero+1),x+4f,y-9f,normal,7.5f);x+=larguras[0];for(int i=0;i<valores.length;i++){caixa(x,baseY,larguras[i+1],ALTURA_LINHA);escrever(fit(valores[i],normal,7.5f,larguras[i+1]-8f),x+4f,y-9f,normal,7.5f);x+=larguras[i+1];}linhaNumero++;y-=ALTURA_LINHA;}
        void finalizar()throws IOException{if(conteudo!=null){desenharRodape(true);conteudo.close();}}
        private void novaPagina()throws IOException{if(conteudo!=null){desenharRodape(false);conteudo.close();}pagina=new PDPage(new PDRectangle(PDRectangle.A4.getHeight(),PDRectangle.A4.getWidth()));documento.addPage(pagina);conteudo=new PDPageContentStream(documento,pagina);paginaNumero++;y=pagina.getMediaBox().getHeight()-8f;desenharCabecalhoInstitucional();desenharResumoRelatorio();desenharCabecalhoTabela();}
        private void desenharCabecalhoInstitucional()throws IOException{float topo=y,larguraUtil=pagina.getMediaBox().getWidth()-(MARGEM*2f),linhaAmarelaY=topo-58f,tituloY=linhaAmarelaY+20f;if(logo!=null){float escala=Math.min(250f/logo.getWidth(),68f/logo.getHeight()),w=logo.getWidth()*escala,h=logo.getHeight()*escala;conteudo.drawImage(logo,MARGEM,tituloY-20f,w,h);}else{conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);escrever("POLICIA PENAL DO ESTADO DE GOIAS - ESPP",MARGEM,tituloY,negrito,10f);}String ta=fit(titulo,negrito,16f,larguraUtil),tituloX=pagina.getMediaBox().getWidth()-MARGEM-larguraTexto(ta,negrito,16f);conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);escrever(ta,tituloX,tituloY,negrito,16f);conteudo.setNonStrokingColor(GOLD_R,GOLD_G,GOLD_B);conteudo.addRect(MARGEM,linhaAmarelaY,larguraUtil,3f);conteudo.fill();y=topo-66f;}
        private void desenharResumoRelatorio()throws IOException{if(filtros==null||filtros.isBlank()||"Sem filtros adicionais.".equalsIgnoreCase(filtros.trim()))return;float larguraUtil=pagina.getMediaBox().getWidth()-(MARGEM*2f),altura=24f,caixaY=y-altura+4f;conteudo.setNonStrokingColor(SOFT_R,SOFT_G,SOFT_B);conteudo.addRect(MARGEM,caixaY,larguraUtil,altura);conteudo.fill();conteudo.setStrokingColor(BORDER_R,BORDER_G,BORDER_B);conteudo.setLineWidth(.45f);conteudo.addRect(MARGEM,caixaY,larguraUtil,altura);conteudo.stroke();conteudo.setNonStrokingColor(MUTED_R,MUTED_G,MUTED_B);escrever("FILTROS",MARGEM+10f,y-9f,negrito,7f);conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);escrever(fit(filtros,normal,7.5f,larguraUtil-80f),MARGEM+58f,y-9f,normal,7.5f);y-=altura+12f;}
        private void desenharCabecalhoTabela()throws IOException{float x=MARGEM,baseY=y-ALTURA_CABECALHO+4f;conteudo.setNonStrokingColor(TEAL_R,TEAL_G,TEAL_B);conteudo.addRect(MARGEM,baseY,larguraTabela(),ALTURA_CABECALHO);conteudo.fill();conteudo.setNonStrokingColor(GOLD_R,GOLD_G,GOLD_B);conteudo.addRect(MARGEM,baseY+ALTURA_CABECALHO-2f,larguraTabela(),2f);conteudo.fill();conteudo.setNonStrokingColor(1f,1f,1f);for(int i=0;i<cabecalhos.length;i++){escrever(fit(cabecalhos[i],negrito,7.5f,larguras[i]-8f),x+4f,y-9f,negrito,7.5f);x+=larguras[i];}conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);y-=ALTURA_CABECALHO;}
        private void desenharRodape(boolean exibirTotal)throws IOException{float largura=pagina.getMediaBox().getWidth(),linhaY=27f;conteudo.setStrokingColor(GOLD_R,GOLD_G,GOLD_B);conteudo.setLineWidth(.8f);conteudo.moveTo(MARGEM,linhaY);conteudo.lineTo(largura-MARGEM,linhaY);conteudo.stroke();conteudo.setNonStrokingColor(MUTED_R,MUTED_G,MUTED_B);escrever("Gerado em "+DATA_HORA.format(LocalDateTime.now(ZONA))+" | "+totalRegistros+" registro(s)",MARGEM,14f,normal,6.8f);if(exibirTotal){String t="Total: "+totalRegistros;escrever(t,largura-MARGEM-larguraTexto(t,negrito,16f),34f,negrito,16f);}String p="Página "+paginaNumero;escrever(p,largura-MARGEM-larguraTexto(p,normal,6.8f),14f,normal,6.8f);conteudo.setNonStrokingColor(TEXT_R,TEXT_G,TEXT_B);}
        private static float[] ajustarLarguras(float[] pesos){float soma=0f;for(float p:pesos)soma+=p;float escala=(PDRectangle.A4.getHeight()-(MARGEM*2f))/soma;float[] a=new float[pesos.length];for(int i=0;i<pesos.length;i++)a[i]=pesos[i]*escala;return a;}
        private float larguraTabela(){float l=0f;for(float v:larguras)l+=v;return l;}
        private void escrever(String texto,float x,float y,PDFont fonte,float tamanho)throws IOException{conteudo.beginText();conteudo.setFont(fonte,tamanho);conteudo.newLineAtOffset(x,y);conteudo.showText(sanitizar(texto));conteudo.endText();}
        private void caixa(float x,float y,float largura,float altura)throws IOException{conteudo.setStrokingColor(BORDER_R,BORDER_G,BORDER_B);conteudo.setLineWidth(.35f);conteudo.addRect(x,y,largura,altura);conteudo.stroke();}
        private static String fit(String valor,PDFont fonte,float tamanho,float largura)throws IOException{String texto=sanitizar(valor==null?"":valor);if(texto.isBlank())return "-";if(larguraTexto(texto,fonte,tamanho)<=largura)return texto;String atual=texto;while(atual.length()>1&&larguraTexto(atual+"...",fonte,tamanho)>largura)atual=atual.substring(0,atual.length()-1);return atual.trim()+"...";}
        private static float larguraTexto(String texto,PDFont fonte,float tamanho)throws IOException{return fonte.getStringWidth(texto)/1000f*tamanho;}
        private static String sanitizar(String valor){return valor.replace('–','-').replace('—','-').replace('“','"').replace('”','"').replace('’','\'');}
    }
}
