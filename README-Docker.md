# Infraestrutura Docker para Desenvolvimento

Esta documentação descreve como usar a infraestrutura Docker configurada para desenvolvimento da aplicação Outsera API.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Como usar

### 1. Iniciar a aplicação

Para iniciar a aplicação em modo de desenvolvimento:

```bash
docker compose up -d
```

Este comando irá:
- Construir a imagem Docker da aplicação
- Instalar todas as dependências automaticamente
- Iniciar a aplicação em modo de desenvolvimento com hot reload
- Disponibilizar a aplicação na porta 3000

### 2. Verificar logs

Para acompanhar os logs da aplicação:

```bash
docker compose logs -f outsera-api
```

### 3. Parar a aplicação

Para parar a aplicação:

```bash
docker compose down
```

### 4. Reconstruir a aplicação

Se houver mudanças nas dependências (package.json), reconstrua:

```bash
docker compose down
docker compose up -d --build
```

## Configurações

### Portas
- **3000**: Porta da aplicação NestJS

### Volumes
- O código fonte está mapeado para hot reload
- `node_modules` está isolado em volume para evitar conflitos

### Variáveis de Ambiente
- `NODE_ENV=development`
- `PORT=3000`

## Desenvolvimento

A aplicação está configurada com:
- **Hot Reload**: Mudanças no código são refletidas automaticamente
- **SQLite em memória**: Banco de dados para desenvolvimento
- **TypeORM**: ORM configurado para SQLite
- **NestJS**: Framework principal

## Acessos

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000 (endpoint padrão do NestJS)

## Comandos úteis

```bash
# Entrar no container
docker compose exec outsera-api sh

# Executar testes
docker compose exec outsera-api npm test

# Executar testes e2e
docker compose exec outsera-api npm run test:e2e

# Ver logs em tempo real
docker compose logs -f outsera-api
``` 