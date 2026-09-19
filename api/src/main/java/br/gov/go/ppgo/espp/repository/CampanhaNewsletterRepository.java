package br.gov.go.ppgo.espp.repository;
import br.gov.go.ppgo.espp.domain.CampanhaNewsletter;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CampanhaNewsletterRepository extends JpaRepository<CampanhaNewsletter,String>{
 List<CampanhaNewsletter> findAllByOrderByCriadoEmDesc();
}