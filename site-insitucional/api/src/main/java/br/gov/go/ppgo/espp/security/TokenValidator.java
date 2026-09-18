package br.gov.go.ppgo.espp.security;

import java.util.Optional;

public interface TokenValidator {

    Optional<TokenPrincipal> validate(String token);
}