from dev import *

VIRTUALENV_NAME = "grappellifit_test_env"

DEBUG = True
TEMPLATE_DEBUG = True

SOUTH_TESTS_MIGRATE = True

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'CACHE+' + SECRET_KEY
    }
}
