# Políticos CE

## Ambiente
* Python 3.6.5
* Flask 0.12.2
* MySQL 5.7.19

## Como executar
### Instale as dependências:
```console
$ pip install -r requeriments.txt
```

### Prepare o ambiente
Basicamente mova o arquivo `contrib/.env.sample` para o root, renomeie para `.env` e coloque as configurações solicitadas.

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
nome_do_projeto
    /app
        /__init__.py
        /module_one
            /__init__.py
            ...
        /templates
            /404.html
            /module_one
        /static
            /style.css
            /scripts.js
    /data_capture
    /migrations             # Obs.: Gerada automáticamente
    manage.py
    setup.cfg
    requeriments.txt
    README.md
    .gitignore
```
