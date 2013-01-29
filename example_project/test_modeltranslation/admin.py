from django.conf import settings
from django.contrib import admin

from test_modeltranslation.models import ModelTranslationTests

from grappellifit.admin import TranslationAdmin


class ModelTranslationTestsAdmin(TranslationAdmin):
    pass
admin.site.register(ModelTranslationTests, ModelTranslationTestsAdmin)
