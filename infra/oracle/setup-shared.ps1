param(
    [string]$ContainerName = "faria-miguel-oracle-1",
    [string]$Password = "espp"
)

$ErrorActionPreference = "Stop"

Write-Host "Criando/validando schema ESPP em $ContainerName/FREEPDB1..."

$escapedPassword = $Password.Replace('"', '""')
$sql = @"
WHENEVER SQLERROR EXIT SQL.SQLCODE;
ALTER SESSION SET CONTAINER = FREEPDB1;
DECLARE
  user_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM DBA_USERS WHERE USERNAME = 'ESPP';
  IF user_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE USER ESPP IDENTIFIED BY "$escapedPassword"';
  ELSE
    EXECUTE IMMEDIATE 'ALTER USER ESPP IDENTIFIED BY "$escapedPassword" ACCOUNT UNLOCK';
  END IF;
  EXECUTE IMMEDIATE 'GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE, CREATE TRIGGER TO ESPP';
  EXECUTE IMMEDIATE 'ALTER USER ESPP QUOTA UNLIMITED ON USERS';
END;
/
EXIT;
"@

$sql | docker exec -i $ContainerName bash -lc "sqlplus -s / as sysdba"
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao criar/validar o schema ESPP no Oracle compartilhado."
}

Write-Host "Schema ESPP pronto para uso em localhost:1521/FREEPDB1."
