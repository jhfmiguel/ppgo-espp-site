package br.gov.go.ppgo.espp.config;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    ProblemDetail notFound() {
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "Registro não encontrado.");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Map<String, String>> validation(ConstraintViolationException exception) {
        String mensagem = exception.getConstraintViolations().stream()
                .findFirst()
                .map(violacao -> violacao.getPropertyPath() + ": " + violacao.getMessage())
                .orElse("Dados inválidos.");

        return ResponseEntity.badRequest().body(Map.of("erro", mensagem));
    }
}