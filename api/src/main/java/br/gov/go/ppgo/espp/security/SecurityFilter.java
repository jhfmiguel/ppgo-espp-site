package br.gov.go.ppgo.espp.security;

import br.gov.go.ppgo.espp.domain.UsuarioAutorizado;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenValidator tokenValidator;
    private final AuthorizationService authorizationService;
    private final String authMode;

    public SecurityFilter(
            TokenValidator tokenValidator,
            AuthorizationService authorizationService,
            @Value("${app.auth.mode:local}") String authMode) {
        this.tokenValidator = tokenValidator;
        this.authorizationService = authorizationService;
        this.authMode = authMode == null ? "ssp" : authMode.trim().toLowerCase();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if ("local".equals(authMode)) {
            return true;
        }

        String path = request.getRequestURI();
        return path.startsWith("/api/v1/public/")
                || "/actuator/health".equals(path)
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = extractBearerToken(request);

        if (token == null) {
            unauthorized(response, "Token de acesso ausente.");
            return;
        }

        var principal = tokenValidator.validate(token);

        if (principal.isEmpty()) {
            SecurityContextHolder.clearContext();
            unauthorized(response, "Token de acesso inválido ou expirado.");
            return;
        }

        var authorizedUser = authorizationService.findAuthorizedUser(
                principal.get().identificador());

        if (authorizedUser.isEmpty()) {
            SecurityContextHolder.clearContext();
            forbidden(response, "Usuário autenticado, porém sem autorização para o painel administrativo.");
            return;
        }

        UsuarioAutorizado user = authorizedUser.get();
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getPerfil().name()));

        var authentication = new UsernamePasswordAuthenticationToken(
                user.getIdentificadorInstitucional(),
                null,
                authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        try {
            filterChain.doFilter(request, response);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private String extractBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            return null;
        }

        String token = authorization.substring(BEARER_PREFIX.length()).trim();
        return token.isEmpty() ? null : token;
    }

    private void unauthorized(HttpServletResponse response, String message)
            throws IOException {
        writeError(response, HttpStatus.UNAUTHORIZED, message);
    }

    private void forbidden(HttpServletResponse response, String message)
            throws IOException {
        writeError(response, HttpStatus.FORBIDDEN, message);
    }

    private void writeError(
            HttpServletResponse response,
            HttpStatus status,
            String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"status\":" + status.value()
                        + ",\"error\":\"" + status.getReasonPhrase()
                        + "\",\"message\":\"" + escapeJson(message) + "\"}");
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}