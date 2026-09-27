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
 public record Coluna(String chave,String rotulo){}
 public record RelatorioPdfRequest(String titulo,List<Coluna> colunas,List<Map<String,Object>> linhas,Map<String,String> filtros){}
 private static final DateTimeFormatter DATA_HORA=DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
 private static final float PAGE_W=PDRectangle.A4.getHeight(),PAGE_H=PDRectangle.A4.getWidth(),LEFT=30,RIGHT=30,TABLE_W=PAGE_W-LEFT-RIGHT;
 @PostMapping(value="/pdf",produces=MediaType.APPLICATION_PDF_VALUE)
 public ResponseEntity<byte[]> pdf(@RequestBody(required=false) RelatorioPdfRequest req)throws Exception{byte[] a=gerarPdf(seguro(req));return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=espp-relatorio.pdf").contentLength(a.length).contentType(MediaType.APPLICATION_PDF).body(a);}
 @PostMapping(value="/xlsx",produces="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
 public ResponseEntity<byte[]> xlsx(@RequestBody(required=false) RelatorioPdfRequest req)throws Exception{byte[] a=gerarXlsx(seguro(req));return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=espp-relatorio.xlsx").contentLength(a.length).contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(a);}
 private RelatorioPdfRequest seguro(RelatorioPdfRequest r){if(r==null)return new RelatorioPdfRequest("Relatorio",List.of(),List.of(),Map.of());return new RelatorioPdfRequest(vazio(r.titulo())?"Relatorio":r.titulo(),r.colunas()==null?List.of():r.colunas(),r.linhas()==null?List.of():r.linhas(),r.filtros()==null?Map.of():r.filtros());}
 private byte[] gerarPdf(RelatorioPdfRequest r)throws Exception{try(PDDocument d=new PDDocument();ByteArrayOutputStream out=new ByteArrayOutputStream()){PDType1Font normal=new PDType1Font(Standard14Fonts.FontName.HELVETICA),bold=new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);PDPage p=novaPagina(d);PDPageContentStream cs=new PDPageContentStream(d,p);float y=cabecalho(cs,bold,normal,r);if(!r.colunas().isEmpty())y=tabelaCabecalho(cs,bold,r,y);int i=0;for(Map<String,Object> item:r.linhas()){if(y<55){cs.close();p=novaPagina(d);cs=new PDPageContentStream(d,p);y=cabecalho(cs,bold,normal,r);if(!r.colunas().isEmpty())y=tabelaCabecalho(cs,bold,r,y);}y=linhaTabela(cs,normal,r,item,y,i++);}if(r.linhas().isEmpty()){setFill(cs,88,96,105);texto(cs,normal,9,LEFT,y-22,"Nenhum registro encontrado para os filtros selecionados.");}cs.close();d.save(out);return out.toByteArray();}}
 private float cabecalho(PDPageContentStream cs,PDType1Font bold,PDType1Font normal,RelatorioPdfRequest r)throws Exception{float y=PAGE_H-30;setFill(cs,22,28,37);texto(cs,bold,9,LEFT,y,"POLICIA PENAL DO ESTADO DE GOIAS");texto(cs,normal,9,LEFT,y-14,"Escola Superior de Policia Penal - ESPP");texto(cs,bold,17,LEFT,y-38,cortar(r.titulo(),80));texto(cs,normal,8,PAGE_W-190,y,"Gerado em "+DATA_HORA.format(LocalDateTime.now()));texto(cs,bold,8,PAGE_W-190,y-13,r.linhas().size()+" registro(s)");setStroke(cs,245,196,0);cs.setLineWidth(3);cs.moveTo(LEFT,y-50);cs.lineTo(PAGE_W-RIGHT,y-50);cs.stroke();float pos=y-66;String f=r.filtros().entrySet().stream().filter(e->e.getKey()!=null&&!vazio(e.getValue())).map(e->e.getKey()+": "+e.getValue()).collect(Collectors.joining(" | "));if(!f.isBlank()){setFill(cs,246,247,249);cs.addRect(LEFT,pos-24,TABLE_W,27);cs.fill();setFill(cs,22,28,37);texto(cs,bold,7,LEFT+5,pos-7,"FILTROS APLICADOS");texto(cs,normal,7.2f,LEFT+5,pos-19,cortar(f,155));pos-=36;}return pos;}
 private float tabelaCabecalho(PDPageContentStream cs,PDType1Font bold,RelatorioPdfRequest r,float y)throws Exception{float x=LEFT,w=TABLE_W/Math.max(1,r.colunas().size());setFill(cs,231,234,239);cs.addRect(LEFT,y-18,TABLE_W,20);cs.fill();for(Coluna c:r.colunas()){setFill(cs,22,28,37);String rot=c==null?"":(vazio(c.rotulo())?c.chave():c.rotulo());texto(cs,bold,7,x+3,y-12,cortar(rot==null?"":rot.toUpperCase(),Math.max(8,(int)(w/4.2f))));setStroke(cs,201,208,218);cs.addRect(x,y-18,w,20);cs.stroke();x+=w;}return y-20;}
 private float linhaTabela(PDPageContentStream cs,PDType1Font normal,RelatorioPdfRequest r,Map<String,Object> item,float y,int idx)throws Exception{float x=LEFT,w=TABLE_W/Math.max(1,r.colunas().size());if(idx%2==1){setFill(cs,246,247,249);cs.addRect(LEFT,y-17,TABLE_W,19);cs.fill();}for(Coluna c:r.colunas()){setFill(cs,22,28,37);String chave=c==null||c.chave()==null?"":c.chave();Object v=item==null?null:item.get(chave);texto(cs,normal,7.1f,x+3,y-12,cortar(v==null?"":String.valueOf(v),Math.max(8,(int)(w/4.2f))));setStroke(cs,201,208,218);cs.addRect(x,y-17,w,19);cs.stroke();x+=w;}return y-19;}
 private void setFill(PDPageContentStream cs,int r,int g,int b)throws Exception{cs.setNonStrokingColor(r/255f,g/255f,b/255f);}
 private void setStroke(PDPageContentStream cs,int r,int g,int b)throws Exception{cs.setStrokingColor(r/255f,g/255f,b/255f);}
 private byte[] gerarXlsx(RelatorioPdfRequest req)throws Exception{try(XSSFWorkbook wb=new XSSFWorkbook();ByteArrayOutputStream out=new ByteArrayOutputStream()){Sheet sh=wb.createSheet("Relatorio");int r=0;Font bf=wb.createFont();bf.setBold(true);CellStyle bold=wb.createCellStyle();bold.setFont(bf);Row row=sh.createRow(r++);row.createCell(0).setCellValue("Polícia Penal do Estado de Goiás");row.getCell(0).setCellStyle(bold);sh.createRow(r++).createCell(0).setCellValue("Escola Superior de Polícia Penal - ESPP");row=sh.createRow(r++);row.createCell(0).setCellValue("Relatório: "+req.titulo());row.getCell(0).setCellStyle(bold);sh.createRow(r++).createCell(0).setCellValue("Gerado em: "+DATA_HORA.format(LocalDateTime.now()));sh.createRow(r++).createCell(0).setCellValue("Total de registros: "+req.linhas().size());r++;if(!req.filtros().isEmpty()){row=sh.createRow(r++);row.createCell(0).setCellValue("Filtros aplicados");row.getCell(0).setCellStyle(bold);for(var e:req.filtros().entrySet())if(e.getKey()!=null&&!vazio(e.getValue())){row=sh.createRow(r++);row.createCell(0).setCellValue(e.getKey());row.createCell(1).setCellValue(e.getValue());}r++;}row=sh.createRow(r++);for(int i=0;i<req.colunas().size();i++){Coluna c=req.colunas().get(i);Cell cell=row.createCell(i);cell.setCellValue(c==null?"":String.valueOf(vazio(c.rotulo())?c.chave():c.rotulo()));cell.setCellStyle(bold);}for(Map<String,Object> item:req.linhas()){row=sh.createRow(r++);for(int i=0;i<req.colunas().size();i++){Coluna c=req.colunas().get(i);String chave=c==null||c.chave()==null?"":c.chave();Object v=item==null?null:item.get(chave);row.createCell(i).setCellValue(v==null?"":String.valueOf(v));}}for(int i=0;i<Math.min(req.colunas().size(),40);i++){sh.autoSizeColumn(i);sh.setColumnWidth(i,Math.min(sh.getColumnWidth(i)+768,18000));}wb.write(out);return out.toByteArray();}}
 private PDPage novaPagina(PDDocument d){PDPage p=new PDPage(new PDRectangle(PAGE_W,PAGE_H));d.addPage(p);return p;}
 private void texto(PDPageContentStream cs,PDType1Font f,float size,float x,float y,String s)throws Exception{cs.beginText();cs.setFont(f,size);cs.newLineAtOffset(x,y);cs.showText(limpar(s));cs.endText();}
 private String cortar(String s,int n){s=limpar(s);return s.length()<=n?s:s.substring(0,Math.max(0,n-3))+"...";}
 private String limpar(String s){return s==null?"":Normalizer.normalize(s,Normalizer.Form.NFD).replaceAll("\\p{M}","").replaceAll("[^\\x20-\\x7E]","-");}
 private boolean vazio(String s){return s==null||s.isBlank();}
}
