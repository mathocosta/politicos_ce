# Políticos CE

## Ambiente
* Python 3.6.5
* Flask 0.12.2
* MySQL 5.7.19

## Como executar
### Instale as dependências:
```console
$ pip install -r requirements.txt
```

### Prepare o ambiente
Basicamente copie o arquivo `contrib/.env.sample` para a raiz do projeto, renomeie para `.env` e coloque as configurações solicitadas.

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
        /templates
            /base.html
            /index.html
            /politician_list.html
            /politician.html
        /static
            /css
            /js
            /libs
            /res
    /data_capture
        /federal_senate
        /federal_deputies
        /state_deputies
    /migrations             # Gerada automáticamente
    /whoosh                 # Gerada automáticamente
    seed.py
    manage.py
    setup.cfg
    enviroment.yml
    requirements.txt
    README.md
    .gitignore
```
