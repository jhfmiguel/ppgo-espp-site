package br.gov.go.ppgo.espp.security;

import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 * Ponto único de integração com a autenticação institucional da SSP.
 *
 * A validação real será implementada aqui quando o contrato oficial da SSP
 * (endpoint, assinatura/JWKS, introspecção e claims) estiver disponível.
 *
 * Até lá, o modo SSP falha fechado: nenhum token é considerado válido.
 */
@Service
public class SspTokenValidator implements TokenValidator {

    @Override
    public Optional<TokenPrincipal> validate(String token) {
        return Optional.empty();
    }
}