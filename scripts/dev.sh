#!/bin/bash

# Script para facilitar comandos de desenvolvimento

case "$1" in
  "start")
    echo "Iniciando aplicação..."
    docker compose up -d
    echo "✅ Aplicação iniciada em http://localhost:3000"
    ;;
  "stop")
    echo "Parando aplicação..."
    docker compose down
    echo "Aplicação parada"
    ;;
  "restart")
    echo "Reiniciando aplicação..."
    docker compose down
    docker compose up -d
    echo "Aplicação reiniciada"
    ;;
  "rebuild")
    echo "Reconstruindo aplicação..."
    docker compose down
    docker compose up -d --build
    echo "Aplicação reconstruída"
    ;;
  "shell")
    echo "Entrando no container..."
    docker compose exec outsera-api sh
    ;;
  "test")
    echo "Executando testes..."
    docker compose exec outsera-api npm test
    ;;
  "lint")
    echo "Executando lint..."
    docker compose exec outsera-api npm run lint
    ;;
  *)
    echo "Uso: ./scripts/dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start    - Inicia a aplicação"
    echo "  stop     - Para a aplicação"
    echo "  restart  - Reinicia a aplicação"
    echo "  rebuild  - Reconstrói a aplicação"
    echo "  logs     - Mostra logs em tempo real"
    echo "  shell    - Entra no container"
    echo "  test     - Executa testes"
    echo "  lint     - Executa lint"
    ;;
esac 