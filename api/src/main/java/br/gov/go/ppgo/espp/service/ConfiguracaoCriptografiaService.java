package br.gov.go.ppgo.espp.service;
import java.nio.*; import java.nio.charset.StandardCharsets; import java.security.*; import java.util.Base64;
import javax.crypto.Cipher; import javax.crypto.spec.*;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
@Service
public class ConfiguracaoCriptografiaService {
 private static final int NONCE=12,TAG=128;
 private static final String LOCAL="RVNQUC1MT0NBTC1ERVYtS0VZLTIwMjYtMTIzNDU2Nzg=";
 private final String chave; private final SecureRandom random=new SecureRandom();
 public ConfiguracaoCriptografiaService(@Value("${espp.config.encryption-key:}") String c,@Value("${app.auth.mode:local}") String modo){
   String v=c==null?"":c.trim(); this.chave=v.isBlank()&&"local".equalsIgnoreCase(modo)?LOCAL:v;
 }
 public String criptografar(String texto){ if(texto==null||texto.isBlank()) throw new IllegalArgumentException("A senha SMTP não pode ser vazia.");
   try{byte[] n=new byte[NONCE];random.nextBytes(n);Cipher c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.ENCRYPT_MODE,chave(),new GCMParameterSpec(TAG,n));byte[] x=c.doFinal(texto.getBytes(StandardCharsets.UTF_8));return Base64.getEncoder().encodeToString(ByteBuffer.allocate(n.length+x.length).put(n).put(x).array());}catch(GeneralSecurityException e){throw new IllegalStateException("Não foi possível proteger a senha SMTP.",e);}
 }
 public String descriptografar(String valor){try{byte[] d=Base64.getDecoder().decode(valor);ByteBuffer b=ByteBuffer.wrap(d);byte[] n=new byte[NONCE];b.get(n);byte[] x=new byte[b.remaining()];b.get(x);Cipher c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.DECRYPT_MODE,chave(),new GCMParameterSpec(TAG,n));return new String(c.doFinal(x),StandardCharsets.UTF_8);}catch(Exception e){throw new IllegalStateException("Não foi possível ler a senha SMTP protegida.",e);}}
 private SecretKeySpec chave(){if(chave.isBlank())throw new IllegalStateException("Defina ESPP_CONFIG_ENCRYPTION_KEY antes de cadastrar a senha SMTP.");byte[] b=Base64.getDecoder().decode(chave);if(b.length!=32)throw new IllegalStateException("ESPP_CONFIG_ENCRYPTION_KEY deve representar exatamente 32 bytes.");return new SecretKeySpec(b,"AES");}
}