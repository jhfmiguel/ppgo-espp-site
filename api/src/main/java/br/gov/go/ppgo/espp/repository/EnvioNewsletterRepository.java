package br.gov.go.ppgo.espp.repository;
import br.gov.go.ppgo.espp.domain.EnvioNewsletter;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EnvioNewsletterRepository extends JpaRepository<EnvioNewsletter,String>{
 List<EnvioNewsletter> findByCampanhaIdOrderByEmailAsc(String campanhaId);
 List<EnvioNewsletter> findByAssinanteId(String assinanteId);
}