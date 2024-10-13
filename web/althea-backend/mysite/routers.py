class MedicineRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'backend' and model._meta.model_name == 'medicine':
            return 'medicine'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'backend' and model._meta.model_name == 'medicine':
            return 'medicine'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db == 'medicine':
            return model_name == 'medicine'
        return None  # Allow migrations for other models on the default database
