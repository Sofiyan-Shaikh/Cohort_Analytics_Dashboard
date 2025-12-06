"""
WSGI config for cohort_analytics_dashboards project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Use production settings on Render
settings_module = os.environ.get('DJANGO_SETTINGS_MODULE', 'cohort_analytics_dashboards.settings')
if os.environ.get('RENDER'):
    settings_module = 'cohort_analytics_dashboards.settings_prod'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
