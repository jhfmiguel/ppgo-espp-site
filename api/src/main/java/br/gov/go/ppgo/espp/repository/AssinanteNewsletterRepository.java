package br.gov.go.ppgo.espp.repository;

import br.gov.go.ppgo.espp.domain.AssinanteNewsletter;
import br.gov.go.ppgo.espp.domain.StatusNewsletter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssinanteNewsletterRepository extends JpaRepository<AssinanteNewsletter, String> {
    Optional<AssinanteNewsletter> findByEmailIgnoreCase(String email);
    List<AssinanteNewsletter> findAllByOrderByCriadoEmDesc();
    long countByStatus(StatusNewsletter status);
    List<AssinanteNewsletter> findByStatusOrderByCriadoEmAsc(StatusNewsletter status);
    Optional<AssinanteNewsletter> findByTokenDescadastro(String tokenDescadastro);
}