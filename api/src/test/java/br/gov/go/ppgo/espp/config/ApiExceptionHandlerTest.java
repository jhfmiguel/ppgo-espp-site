package br.gov.go.ppgo.espp.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ApiExceptionHandlerTest.ValidationController.class)
@Import(ApiExceptionHandler.class)
class ApiExceptionHandlerTest {

    private final MockMvc mvc;

    ApiExceptionHandlerTest(MockMvc mvc) {
        this.mvc = mvc;
    }

    @Test
    void deveRetornar400ComMensagemParaBodyInvalido() throws Exception {
        mvc.perform(post("/__test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"email\":\"invalido\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").isNotEmpty());
    }

    @RestController
    static class ValidationController {
        @PostMapping("/__test/validation")
        Object validar(@Valid @RequestBody Payload payload) {
            return payload;
        }
    }

    record Payload(@NotBlank String nome, @Email String email) {}
}
