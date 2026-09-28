package br.gov.go.ppgo.espp.config;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    ProblemDetail notFound() {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Registro não encontrado.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> bodyValidation(MethodArgumentNotValidException exception) {
        String mensagem = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .orElse("Dados inválidos.");
        return erroValidacao(mensagem);
    }

    @ExceptionHandler({ConstraintViolationException.class, HandlerMethodValidationException.class})
    ResponseEntity<Map<String, String>> validation(Exception exception) {
        if (exception instanceof ConstraintViolationException cve) {
            String mensagem = cve.getConstraintViolations().stream()
                    .findFirst()
                    .map(violacao -> violacao.getPropertyPath() + ": " + violacao.getMessage())
                    .orElse("Dados inválidos.");
            return erroValidacao(mensagem);
        }
        return erroValidacao("Dados inválidos.");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    ResponseEntity<Map<String, String>> missingParameter(MissingServletRequestParameterException exception) {
        return erroValidacao("Parâmetro obrigatório ausente: " + exception.getParameterName() + ".");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<Map<String, String>> uploadTooLarge() {
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
                .body(Map.of("erro", "O arquivo enviado excede o tamanho máximo permitido."));
    }

    private ResponseEntity<Map<String, String>> erroValidacao(String mensagem) {
        return ResponseEntity.badRequest().body(Map.of("erro", mensagem));
    }
}
