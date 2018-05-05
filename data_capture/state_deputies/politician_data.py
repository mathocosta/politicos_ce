

def political_data_parser(dataset):
    """Obtém os dados básicos dos polícos"""

    result = list()
    for d in dataset:
        result.append({
            'registered_id': d['id'],
            'civil_name': d['name'],
            'parliamentary_name': d['alternative_names'][-1]['name'],
            'party': d['political_parties'][-1]['political_party']['siglum'],
            'hometown': d['place_of_birth'],
            'scholarity': d['education']['name'],
            'occupation': d['occupation']['name'],
            'position': 'state-deputy'
        })

    return result
