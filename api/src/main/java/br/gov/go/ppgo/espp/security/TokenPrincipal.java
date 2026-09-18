package br.gov.go.ppgo.espp.security;

import java.util.List;

public record TokenPrincipal(
        String identificador,
        String nome,
        List<String> perfis) {

    public TokenPrincipal {
        perfis = perfis == null ? List.of() : List.copyOf(perfis);
    }
}