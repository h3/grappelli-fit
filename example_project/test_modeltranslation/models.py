from django.db import models
from django.utils.translation import ugettext_lazy as _


class ModelTranslationTests(models.Model):
    title = models.CharField(_('title'), max_length=255, blank=True)
    text = models.TextField(_('text'), blank=True)
