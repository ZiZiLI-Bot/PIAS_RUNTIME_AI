def success(data, message):
    return {
        'success': True,
        'message': message,
        'data': data
    }


def error(data, message):
    return {
        'success': False,
        'message': message,
        'data': data
    }
