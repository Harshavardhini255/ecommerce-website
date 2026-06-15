"""WSGI config for e-commerce project."""
import os

# Monkey-patch Django's BaseContext.__copy__ for Python 3.14 compatibility
import django.template.context as ctx

def _patched_base_copy(self):
    """Replace copy(super()) with proper instance creation for Python 3.14."""
    cls = self.__class__
    duplicate = cls.__new__(cls)
    for key in self.__dict__:
        val = self.__dict__[key]
        if key == 'dicts':
            object.__setattr__(duplicate, key, val[:])
        else:
            object.__setattr__(duplicate, key, val)
    return duplicate

ctx.BaseContext.__copy__ = _patched_base_copy

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
