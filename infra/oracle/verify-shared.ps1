param(
    [string]$ContainerName = "faria-miguel-oracle-1",
    [string]$Password = "espp"
)

$ErrorActionPreference = "Stop"

Write-Host "Validando ESPP no Oracle compartilhado $ContainerName/FREEPDB1..."

$sql = @"
WHENEVER SQLERROR EXIT SQL.SQLCODE;
SET HEADING ON FEEDBACK ON PAGESIZE 200 LINESIZE 200;
SELECT USER AS CONNECTED_USER,
       SYS_CONTEXT('USERENV','CURRENT_SCHEMA') AS CURRENT_SCHEMA
FROM DUAL;
SELECT COUNT(*) AS USER_TABLES FROM USER_TABLES;
SELECT COUNT(*) AS LIQUIBASE_CHANGELOG_TABLES
FROM USER_TABLES
WHERE TABLE_NAME = 'DATABASECHANGELOG';
EXIT;
"@

$sql | docker exec -i $ContainerName bash -lc "sqlplus -s ESPP/$Password@//localhost:1521/FREEPDB1"
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao validar o schema ESPP no Oracle compartilhado."
}

Write-Host "ESPP conectado ao schema ESPP no Oracle compartilhado."
