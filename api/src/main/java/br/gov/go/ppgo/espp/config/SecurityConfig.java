package br.gov.go.ppgo.espp.config;

import br.gov.go.ppgo.espp.security.SecurityFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityFilter securityFilter,
            @Value("${app.auth.mode:development}") String authMode) throws Exception {
        boolean development = "development".equalsIgnoreCase(authMode)
                || "local".equalsIgnoreCase(authMode);

        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers("/api/v1/public/**", "/actuator/health", "/error").permitAll();
                    if (development) {
                        // Desenvolvimento local: a sessão e as permissões do painel são validadas pelo Next.
                        // Não há usuário/senha HTTP Basic nem senha gerada pelo Spring.
                        authorize.requestMatchers("/api/v1/admin/**").permitAll();
                    } else {
                        authorize.requestMatchers(
                                        "/api/v1/admin/mensagens/**",
                                        "/api/v1/admin/newsletter/**",
                                        "/api/v1/admin/comunicacao/**",
                                        "/api/v1/admin/noticias/**",
                                        "/api/v1/admin/eventos/**")
                                .hasAnyRole("ADMIN", "COMUNICACAO");
                        authorize.requestMatchers("/api/v1/admin/**").hasRole("ADMIN");
                    }
                    authorize.anyRequest().denyAll();
                })
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.frontend-url}") String frontendUrl) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "X-ESPP-Usuario"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
