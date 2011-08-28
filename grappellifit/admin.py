from django.conf import settings

if 'modeltranslation' in settings.INSTALLED_APPS:
    from modeltranslation.admin import TranslationAdmin as TranslationAdminBase
    from contrib.modeltranslation.admin import TranslationTabularInline as TranslationTabularInlineBase
    from contrib.modeltranslation.admin import TranslationStackedInline as TranslationStackedInlineBase
    from contrib.modeltranslation.admin import TranslationGenericTabularInline as TranslationGenericTabularInlineBase
    from contrib.modeltranslation.admin import TranslationGenericStackedInline as TranslationGenericStackedInlineBase

    MODEL_TRANSLATION_JS = (
        '%smodeltranslation/js/force_jquery.js' % settings.STATIC_URL,
        'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js',
        '%smodeltranslation/js/tabbed_translation_fields.js' % settings.STATIC_URL,
    )
    MODEL_TRANSLATION_CSS = {
        'screen': ('%smodeltranslation/css/tabbed_translation_fields.css' % settings.STATIC_URL,),
    }

    class TranslationAdmin(TranslationAdminBase):
        class Media:
            js = MODEL_TRANSLATION_JS
            css = MODEL_TRANSLATION_CSS

    class TranslationTabularInline(TranslationTabularInlineBase):
        class Media:
            js = MODEL_TRANSLATION_JS
            css = MODEL_TRANSLATION_CSS

    class TranslationStackedInline(TranslationStackedInlineBase):
        class Media:
            js = MODEL_TRANSLATION_JS
            css = MODEL_TRANSLATION_CSS

    class TranslationGenericTabularInline(TranslationGenericTabularInlineBase):
        class Media:
            js = MODEL_TRANSLATION_JS
            css = MODEL_TRANSLATION_CSS

    class TranslationGenericStackedInline(TranslationGenericStackedInlineBase):
        class Media:
            js = MODEL_TRANSLATION_JS
            css = MODEL_TRANSLATION_CSS

