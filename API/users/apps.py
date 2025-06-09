from django.apps import AppConfig
from django.db.models.signals import post_migrate


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        from .signals import create_initial_data

        # Connect the signal to the post_migrate signal
        post_migrate.connect(create_initial_data, sender=self)