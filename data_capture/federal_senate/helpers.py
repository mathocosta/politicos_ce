# -*- coding: utf-8 -*-
"""Funções auxiliares usadas em mais de um módulo."""

import requests
from bs4 import BeautifulSoup


def get_proposition_url(id, type_description):
    """Obtém a URL do documento da proposição.

    Args:
        id (int): Identificador da proposição
        type_description (str): O tipo da proposição escrito completo

    Returns:
        str: URL do documento
    """
    print("id: {0} type: {1}".format(id, type_description))
    r = requests.get(
        "http://legis.senado.leg.br/dadosabertos/materia/textos/{}".format(id))

    soup = BeautifulSoup(r.content, 'xml')

    url = ''

    if soup.Materia.Textos is not None:
        texts = soup.Materia.Textos.find_all("Texto")

        for t in texts:
            if t.DescricaoTipoTexto.text.upper() in type_description.upper():
                url = t.UrlTexto.text
                break

    return url


def make_excerpt(text):
    """Reduz o tamanho do texto da ementa

    Args:
        text (str): Ementa completa

    Returns:
        str: Ementa processada
    """

    excerpt = text

    if (len(text) > 110):
        excerpt = text[:110]
        excerpt += '...'

    return excerpt
