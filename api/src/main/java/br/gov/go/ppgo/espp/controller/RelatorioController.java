package br.gov.go.ppgo.espp.controller;

import java.io.ByteArrayOutputStream;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/relatorios")
public class RelatorioController {
    public record Coluna(String chave,String rotulo) {}
    public record RelatorioPdfRequest(String titulo,List<Coluna> colunas,List<Map<String,Object>> linhas,Map<String,String> filtros) {}
    private static final DateTimeFormatter DATA_HORA=DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final float PAGE_W=PDRectangle.A4.getHeight(), PAGE_H=PDRectangle.A4.getWidth(), LEFT=30, RIGHT=30, TABLE_W=PAGE_W-LEFT-RIGHT;

    @PostMapping(value="/pdf",produces=MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> pdf(@RequestBody(required=false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo=gerarPdf(seguro(req));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=espp-relatorio.pdf").contentLength(arquivo.length).contentType(MediaType.APPLICATION_PDF).body(arquivo);
    }

    @PostMapping(value="/xlsx",produces="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> xlsx(@RequestBody(required=false) RelatorioPdfRequest req) throws Exception {
        byte[] arquivo=gerarXlsx(seguro(req));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=espp-relatorio.xlsx").contentLength(arquivo.length).contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(arquivo);
    }

    private RelatorioPdfRequest seguro(RelatorioPdfRequest req){
        if(req==null)return new RelatorioPdfRequest("Relatorio",List.of(),List.of(),Map.of());
        return new RelatorioPdfRequest(vazio(req.titulo())?"Relatorio":req.titulo(),req.colunas()==null?List.of():req.colunas(),req.linhas()==null?List.of():req.linhas(),req.filtros()==null?Map.of():req.filtros());
    }

    private byte[] gerarPdf(RelatorioPdfRequest req) throws Exception {
        try(PDDocument doc=new PDDocument();ByteArrayOutputStream out=new ByteArrayOutputStream()){
            PDType1Font regular=new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font bold=new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDPage page=novaPagina(doc);
            PDPageContentStream cs=new PDPageContentStream(doc,page);
            float y=cabecalho(cs,bold,regular,req);
            if(!req.colunas().isEmpty())y=tabelaCabecalho(cs,bold,req,y);
            int indice=0;
            for(Map<String,Object> item:req.linhas()){
                if(y<55){cs.close();page=novaPagina(doc);cs=new PDPageContentStream(doc,page);y=cabecalho(cs,bold,regular,req);if(!req.colunas().isEmpty())y=tabelaCabecalho(cs,bold,req,y);}
                y=linhaTabela(cs,regular,req,item,y,indice++);
            }
            if(req.linhas().isEmpty()){
                cs.setNonStrokingColor(88,96,105);
                texto(cs,regular,9,LEFT,y-22,"Nenhum registro encontrado para os filtros selecionados.");
            }
            cs.close();
            doc.save(out);
            return out.toByteArray();
        }
    }

    private float cabecalho(PDPageContentStream cs,PDType1Font bold,PDType1Font regular,RelatorioPdfRequest req)throws Exception{
        float y=PAGE_H-30;
        cs.setNonStrokingColor(22,28,37);
        texto(cs,bold,9,LEFT,y,"POLICIA PENAL DO ESTADO DE GOIAS");
        texto(cs,regular,9,LEFT,y-14,"Escola Superior de Policia Penal - ESPP");
        texto(cs,bold,17,LEFT,y-38,cortar(req.titulo(),80));
        texto(cs,regular,8,PAGE_W-190,y,"Gerado em "+DATA_HORA.format(LocalDateTime.now()));
        texto(cs,bold,8,PAGE_W-190,y-13,req.linhas().size()+" registro(s)");
        cs.setStrokingColor(245,196,0);cs.setLineWidth(3);cs.moveTo(LEFT,y-50);cs.lineTo(PAGE_W-RIGHT,y-50);cs.stroke();
        float pos=y-66;
        String f=req.filtros().entrySet().stream().filter(e->e.getKey()!=null&&!vazio(e.getValue())).map(e->e.getKey()+": "+e.getValue()).collect(Collectors.joining(" | "));
        if(!f.isBlank()){
            cs.setNonStrokingColor(246,247,249);cs.addRect(LEFT,pos-24,TABLE_W,27);cs.fill();cs.setNonStrokingColor(22,28,37);
            texto(cs,bold,7,LEFT+5,pos-7,"FILTROS APLICADOS");texto(cs,regular,7.2f,LEFT+5,pos-19,cortar(f,155));pos-=36;
        }
        return pos;
    }

    private float tabelaCabecalho(PDPageContentStream cs,PDType1Font bold,RelatorioPdfRequest req,float y)throws Exception{
        float x=LEFT,w=TABLE_W/Math.max(1,req.colunas().size());
        cs.setNonStrokingColor(231,234,239);cs.addRect(LEFT,y-18,TABLE_W,20);cs.fill();cs.setNonStrokingColor(22,28,37);
        for(Coluna c:req.colunas()){
            String rotulo=c==null?"":(vazio(c.rotulo())?c.chave():c.rotulo());
            texto(cs,bold,7,x+3,y-12,cortar(rotulo==null?"":rotulo.toUpperCase(),Math.max(8,(int)(w/4.2f))));
            cs.setStrokingColor(201,208,218);cs.addRect(x,y-18,w,20);cs.stroke();x+=w;
        }
        return y-20;
    }

    private float linhaTabela(PDPageContentStream cs,PDType1Font regular,RelatorioPdfRequest req,Map<String,Object> item,float y,int indice)throws Exception{
        float x=LEFT,w=TABLE_W/Math.max(1,req.colunas().size());
        if(indice%2==1){cs.setNonStrokingColor(246,247,249);cs.addRect(LEFT,y-17,TABLE_W,19);cs.fill();}
        cs.setNonStrokingColor(22,28,37);
        for(Coluna c:req.colunas()){
            String chave=c==null||c.chave()==null?"":c.chave();Object valor=item==null?null:item.get(chave);
            texto(cs,regular,7.1f,x+3,y-12,cortar(valor==null?"":String.valueOf(valor),Math.max(8,(int)(w/4.2f))));
            cs.setStrokingColor(201,208,218);cs.addRect(x,y-17,w,19);cs.stroke();x+=w;
        }
        return y-19;
    }

    private byte[] gerarXlsx(RelatorioPdfRequest req) throws Exception {
        try(XSSFWorkbook wb=new XSSFWorkbook();ByteArrayOutputStream out=new ByteArrayOutputStream()){
            Sheet sh=wb.createSheet("Relatorio");int r=0;Font bf=wb.createFont();bf.setBold(true);CellStyle bold=wb.createCellStyle();bold.setFont(bf);
            Row row=sh.createRow(r++);row.createCell(0).setCellValue("Polícia Penal do Estado de Goiás");row.getCell(0).setCellStyle(bold);
            sh.createRow(r++).createCell(0).setCellValue("Escola Superior de Polícia Penal - ESPP");row=sh.createRow(r++);row.createCell(0).setCellValue("Relatório: "+req.titulo());row.getCell(0).setCellStyle(bold);
            sh.createRow(r++).createCell(0).setCellValue("Gerado em: "+DATA_HORA.format(LocalDateTime.now()));sh.createRow(r++).createCell(0).setCellValue("Total de registros: "+req.linhas().size());r++;
            if(!req.filtros().isEmpty()){row=sh.createRow(r++);row.createCell(0).setCellValue("Filtros aplicados");row.getCell(0).setCellStyle(bold);for(var e:req.filtros().entrySet())if(e.getKey()!=null&&!vazio(e.getValue())){row=sh.createRow(r++);row.createCell(0).setCellValue(e.getKey());row.createCell(1).setCellValue(e.getValue());}r++;}
            row=sh.createRow(r++);for(int i=0;i<req.colunas().size();i++){Coluna c=req.colunas().get(i);Cell cell=row.createCell(i);cell.setCellValue(c==null?"":String.valueOf(vazio(c.rotulo())?c.chave():c.rotulo()));cell.setCellStyle(bold);}
            for(Map<String,Object> item:req.linhas()){row=sh.createRow(r++);for(int i=0;i<req.colunas().size();i++){Coluna c=req.colunas().get(i);String chave=c==null||c.chave()==null?"":c.chave();Object v=item==null?null:item.get(chave);row.createCell(i).setCellValue(v==null?"":String.valueOf(v));}}
            for(int i=0;i<Math.min(req.colunas().size(),40);i++){sh.autoSizeColumn(i);sh.setColumnWidth(i,Math.min(sh.getColumnWidth(i)+768,18000));}
            wb.write(out);return out.toByteArray();
        }
    }

    private PDPage novaPagina(PDDocument doc){PDPage p=new PDPage(new PDRectangle(PAGE_W,PAGE_H));doc.addPage(p);return p;}
    private void texto(PDPageContentStream cs,PDType1Font f,float size,float x,float y,String s)throws Exception{String valor=limpar(s);cs.beginText();cs.setFont(f,size);cs.newLineAtOffset(x,y);cs.showText(valor);cs.endText();}
    private String cortar(String s,int n){s=limpar(s);return s.length()<=n?s:s.substring(0,Math.max(0,n-3))+"...";}
    private String limpar(String s){return s==null?"":Normalizer.normalize(s,Normalizer.Form.NFD).replaceAll("\\p{M}","").replaceAll("[^\\x20-\\x7E]","-");}
    private boolean vazio(String s){return s==null||s.isBlank();}
}
