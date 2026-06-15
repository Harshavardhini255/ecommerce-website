"""WSGI config for e-commerce project."""
import os

# Monkey-patch Django's BaseContext.__copy__ for Python 3.14 compatibility
import django.template.context as ctx
_orig_copy = ctx.BaseContext.__copy__
def _patched_copy(self):
    duplicate = object.__new__(self.__class__)
    duplicate.dicts = self.dicts[:]
    return duplicate
ctx.BaseContext.__copy__ = _patched_copy

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
