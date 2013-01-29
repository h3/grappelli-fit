from modeltranslation.translator import translator, TranslationOptions
from test_modeltranslation.models import ModelTranslationTests


class ModelTranslationTestsOptions(TranslationOptions):
    fields = ('title', 'text')
translator.register(ModelTranslationTests, ModelTranslationTestsOptions)
