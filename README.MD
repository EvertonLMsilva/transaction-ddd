## Projeto molde-transaction

Este projeto foi inicializado sem nenhum padrão, com todas logicas apenas no arquivo app.
A ideia central é refatorar o código ultilizando:
- boas praticas
- padrões de projeto 
- design de projeto e código

### Setup do projeto

Neste projeto foi adicionado um container para banco de dados com postgres.

#### Montando container.
Na pasta raiz do projeto, abra seu terminal e rode este comando.

```
docker-composer up -d
```

Você pode usar o PgAdmin para monitorar seu banco de dados.

## Banco de dados

Ao montar o container deverá conter em seu banco de dados os seguintes parametros.

#### Schema
- transactions_bank

#### Tables
- clients
- accounts
- transactions