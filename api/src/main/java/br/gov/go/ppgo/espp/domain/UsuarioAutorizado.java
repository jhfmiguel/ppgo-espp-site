package br.gov.go.ppgo.espp.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "ESPP_USUARIO_AUTORIZADO")
public class UsuarioAutorizado {

    @Id
    @Column(name = "ID", nullable = false, length = 36)
    private String id;

    @Column(name = "IDENTIFICADOR_INSTITUCIONAL", nullable = false, unique = true, length = 200)
    private String identificadorInstitucional;

    @Column(name = "NOME", length = 200)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "PERFIL", nullable = false, length = 30)
    private PerfilAcesso perfil;

    @Column(name = "ATIVO", nullable = false)
    private Integer ativo = 1;

    @Column(name = "CRIADO_EM", nullable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "ATUALIZADO_EM", nullable = false)
    private OffsetDateTime atualizadoEm;

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        OffsetDateTime agora = OffsetDateTime.now(ZoneOffset.UTC);
        criadoEm = agora;
        atualizadoEm = agora;
    }

    @PreUpdate
    void preUpdate() {
        atualizadoEm = OffsetDateTime.now(ZoneOffset.UTC);
    }

    public String getId() {
        return id;
    }

    public String getIdentificadorInstitucional() {
        return identificadorInstitucional;
    }

    public void setIdentificadorInstitucional(String identificadorInstitucional) {
        this.identificadorInstitucional = identificadorInstitucional;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public PerfilAcesso getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilAcesso perfil) {
        this.perfil = perfil;
    }

    public boolean isAtivo() {
        return ativo != null && ativo == 1;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo ? 1 : 0;
    }

    public OffsetDateTime getCriadoEm() {
        return criadoEm;
    }

    public OffsetDateTime getAtualizadoEm() {
        return atualizadoEm;
    }
}