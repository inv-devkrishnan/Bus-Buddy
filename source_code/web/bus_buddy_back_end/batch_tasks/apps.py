from django.apps import AppConfig

class BatchTasksConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "batch_tasks"

    def ready(self):
        import batch_tasks.scheduler  # noqa
        batch_tasks.scheduler.ready()
