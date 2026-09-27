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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/relatorios")
public class RelatorioController {
    public record Coluna(String chave,String rotulo) {}
    public record RelatorioPdfRequest(String titulo,List<Coluna> colunas,List<Map<String,Object>> linhas,Map<String,String> filtros) {}
    private static final DateTimeFormatter DATA_HORA=DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @PostMapping(value="/pdf",produces=MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> pdf(@RequestBody RelatorioPdfRequest req) throws Exception {
        byte[] bytes=gerar(req);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=espp-relatorio.pdf").contentType(MediaType.APPLICATION_PDF).body(bytes);
    }

    private byte[] gerar(RelatorioPdfRequest req) throws Exception {
        List<Coluna> colunas=req.colunas()==null?List.of():req.colunas();
        List<Map<String,Object>> linhas=req.linhas()==null?List.of():req.linhas();
        Map<String,String> filtros=req.filtros()==null?Map.of():req.filtros();
        RelatorioPdfRequest seguro=new RelatorioPdfRequest(req.titulo()==null?"Relatorio":req.titulo(),colunas,linhas,filtros);
        try(PDDocument doc=new PDDocument();ByteArrayOutputStream out=new ByteArrayOutputStream()){
            PDType1Font regular=new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font bold=new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDPage page=novaPagina(doc);
            float y=cabecalho(doc,page,bold,regular,seguro);
            PDPageContentStream cs=new PDPageContentStream(doc,page,PDPageContentStream.AppendMode.APPEND,true,true);
            if(!colunas.isEmpty())y=tabelaCabecalho(cs,bold,seguro,y);
            int linha=0;
            for(Map<String,Object> item:linhas){
                if(y<55){
                    cs.close();page=novaPagina(doc);y=cabecalho(doc,page,bold,regular,seguro);
                    cs=new PDPageContentStream(doc,page,PDPageContentStream.AppendMode.APPEND,true,true);
                    if(!colunas.isEmpty())y=tabelaCabecalho(cs,bold,seguro,y);
                }
                if(linha++%2==1){cs.setNonStrokingColor(246,247,249);cs.addRect(30,y-16,782,18);cs.fill();}
                float x=30,w=782f/Math.max(1,colunas.size());cs.setNonStrokingColor(22,28,37);
                for(Coluna c:colunas){Object valor=item==null?null:item.get(c.chave());texto(cs,regular,7.2f,x+3,y-11,cortar(valor==null?"":String.valueOf(valor),Math.max(10,(int)(w/4.5f))));cs.setStrokingColor(201,208,218);cs.addRect(x,y-16,w,18);cs.stroke();x+=w;}y-=18;
            }
            if(linhas.isEmpty()){cs.setNonStrokingColor(88,96,105);texto(cs,regular,9,30,y-22,"Nenhum registro encontrado para os filtros selecionados.");}
            cs.close();doc.save(out);return out.toByteArray();
        }
    }

    private PDPage novaPagina(PDDocument doc){PDPage p=new PDPage(PDRectangle.A4);p.setRotation(90);doc.addPage(p);return p;}

    private float cabecalho(PDDocument doc,PDPage p,PDType1Font bold,PDType1Font regular,RelatorioPdfRequest req)throws Exception{
        try(PDPageContentStream cs=new PDPageContentStream(doc,p,PDPageContentStream.AppendMode.APPEND,true,true)){
            cs.transform(new org.apache.pdfbox.util.Matrix(0,1,-1,0,PDRectangle.A4.getHeight(),0));
            float y=565;texto(cs,bold,9,30,y,"POLICIA PENAL DO ESTADO DE GOIAS");texto(cs,regular,9,30,y-14,"Escola Superior de Policia Penal - ESPP");texto(cs,bold,17,30,y-35,req.titulo());texto(cs,regular,8,650,y,"Gerado em "+DATA_HORA.format(LocalDateTime.now()));texto(cs,bold,8,650,y-13,req.linhas().size()+" registro(s)");cs.setStrokingColor(245,196,0);cs.setLineWidth(3);cs.moveTo(30,y-46);cs.lineTo(812,y-46);cs.stroke();float pos=y-61;
            if(!req.filtros().isEmpty()){cs.setNonStrokingColor(246,247,249);cs.addRect(30,pos-23,782,25);cs.fill();texto(cs,bold,7,35,pos-7,"FILTROS APLICADOS");String f=req.filtros().entrySet().stream().filter(e->e.getValue()!=null&&!e.getValue().isBlank()).map(e->e.getKey()+": "+e.getValue()).collect(Collectors.joining(" | "));texto(cs,regular,7.5f,35,pos-18,cortar(f,140));pos-=34;}
            return pos;
        }
    }

    private float tabelaCabecalho(PDPageContentStream cs,PDType1Font bold,RelatorioPdfRequest req,float y)throws Exception{float x=30,w=782f/Math.max(1,req.colunas().size());cs.setNonStrokingColor(231,234,239);cs.addRect(30,y-17,782,19);cs.fill();cs.setNonStrokingColor(22,28,37);for(Coluna c:req.colunas()){texto(cs,bold,7,x+3,y-11,cortar(c.rotulo()==null?c.chave():c.rotulo().toUpperCase(),Math.max(10,(int)(w/4.5f))));cs.setStrokingColor(201,208,218);cs.addRect(x,y-17,w,19);cs.stroke();x+=w;}return y-19;}
    private void texto(PDPageContentStream cs,PDType1Font f,float size,float x,float y,String s)throws Exception{cs.beginText();cs.setFont(f,size);cs.newLineAtOffset(x,y);cs.showText(limpar(s));cs.endText();}
    private String cortar(String s,int n){s=limpar(s);return s.length()<=n?s:s.substring(0,Math.max(0,n-3))+"...";}
    private String limpar(String s){return s==null?"":Normalizer.normalize(s,Normalizer.Form.NFD).replaceAll("\\p{M}","").replaceAll("[^\\x20-\\x7E]","-");}
}
