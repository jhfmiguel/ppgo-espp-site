package br.gov.go.ppgo.espp.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.List;
@Configuration public class SecurityConfig {
 @Bean SecurityFilterChain chain(HttpSecurity h) throws Exception { return h.csrf(c->c.disable()).cors(Customizer.withDefaults()).authorizeHttpRequests(a->a.requestMatchers("/api/v1/public/**","/actuator/health").permitAll().requestMatchers("/api/v1/admin/**").hasRole("ADMIN").anyRequest().denyAll()).httpBasic(Customizer.withDefaults()).build(); }
 @Bean UserDetailsService users(@Value("${app.admin.user}") String u,@Value("${app.admin.password}") String p){ var enc=new BCryptPasswordEncoder(); return new InMemoryUserDetailsManager(User.withUsername(u).password(enc.encode(p)).roles("ADMIN").build()); }
 @Bean CorsConfigurationSource cors(@Value("${app.frontend-url}") String url){ var c=new CorsConfiguration(); c.setAllowedOrigins(List.of(url)); c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); c.setAllowedHeaders(List.of("Authorization","Content-Type")); var s=new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/api/**",c); return s; }
}