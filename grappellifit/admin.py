from django.conf import settings
from modeltranslation.admin import TranslationAdmin as TranslationAdminBase


class TranslationAdmin(TranslationAdminBase):
    class Media:
        js = (
            '%smodeltranslation/js/force_jquery.js' % settings.STATIC_URL,
            'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js',
            '%smodeltranslation/js/tabbed_translation_fields.js' % settings.STATIC_URL,
        )
        css = {
            'screen': ('%smodeltranslation/css/tabbed_translation_fields.css' % settings.STATIC_URL,),
        }

