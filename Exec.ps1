$ErrorActionPreference = 'Stop'

# Garantir execução a partir da pasta do projeto
Set-Location -Path $PSScriptRoot

npm start
exit $LASTEXITCODE
