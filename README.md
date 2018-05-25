# Políticos CE

Plataforma desenvolvida para disponibilizar os dados dos políticos do legislativo do Ceará de uma forma transparente e livre de influências. Foi um projeto desenvolvido pela equipe Affa para a cadeira de Projeto Integrado 2 do curso de Sistemas e Mídias Digitais da UFC.

### Origem dos dados usados:
- API de Dados Abertos da Câmara dos Deputados
- API de Dados Abertos do Senado Federal
- Politicos API, que usa os dados do TSE

### Equipe Affa é composta por:
- João Paulo Sabino: Programador Front-end
- Mário Silva: Programador Back-end
- Matheus Campelo: Designer de UI e UX
- Matheus Oliveira Costa: Programador Back-end

## Ambiente
- Python 3.6.5
- Flask 0.12.2
- MySQL 5.7.19

## Como executar
### Instale as dependências:
```console
$ pip install -r requirements.txt
```

### Prepare o ambiente
Copie o arquivo `contrib/.env.sample` para a raiz do projeto, renomeie para `.env` e coloque as configurações solicitadas.

### Crie a estrutura básica do banco:
```console
$ python manage.py db migrate
$ python manage.py db upgrade
```

### Carregue os dados para o banco:
```console
$ python manage.py seed
```

### Execute o servidor
```console
$ python manage.py runserver
```
Agora vá para [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## Estrutura do projeto
```
politicos_ce
    /app
        /__init__.py
        /templates          # Templates das páginas
        /static             # Arquivos de css, js e imagens
        models.py           # Modelos das entidade do banco de dados
        views.py            # Rotas da aplicação
    /data_capture
        /federal_senate     # Captação dos dados dos senadores
        /federal_deputies   # Captação dos dados dos dep. federais
        /state_deputies     # Captação dos dados dos dep. estaduais
    /migrations             # Gerada automáticamente
    /whoosh                 # Gerada automáticamente
    seed.py                 # Script que inicializa o banco de dados
    manage.py               # Script de gerenciamento da aplicação
    .env                    # Variáveis da aplicação
    enviroment.yml
    requirements.txt
    README.md
    .gitignore
```
