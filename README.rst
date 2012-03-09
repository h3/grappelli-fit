Introduction
============

Grappelli-fit provide a compatibility layer for popular Django applications.

This is an early prototype which currently only support two applications, if it works as expected the list of supported apps will grow.

Feel free to contribute your compatibility layers for your favourites Django applications !

* Tested applications: http://code.google.com/p/grappelli-fit/wiki/TestedApps

Currently supported applications
--------------------------------

* django-rosetta: https://github.com/mbi/django-rosetta
* django-modeltranslation: http://code.google.com/p/django-modeltranslation/
* django-fiber (in progress..)
* django-locking (eventually..)

Screenshots
===========

Rosetta
-------

.. figure:: http://i.imgur.com/Jt4Rp.png
    :figwidth: image

    Language selection

.. figure:: http://i.imgur.com/2BAjO.png
    :figwidth: image

    Change form

Modeltranslation
----------------

.. figure:: http://i.imgur.com/QezPx.png
    :figwidth: image

    Change list

.. figure:: http://i.imgur.com/xrKot.png
    :figwidth: image

    Change form

Usage
=====

settings.py
-----------

Grappelli-fit works by overriding templates and static files for differents project, so the installation is pretty straight forward::

    STATICFILES_DIRS = (
       '/path/to/grappelli/static/',
       '/path/to/grappellifit/static/',
    )

    TEMPLATE_DIRS = (
        '/path/to/project/templates/',
        '/path/to/grappelli/templates/',
        '/path/to/grappellifit/templates/',
    )

    INSTALLED_APPS = (
        # ...
        'contrib.grappelli',
        'contrib.grappellifit',
        'django.contrib.admin',
        'modeltranslation',
        'rosetta',
        # ...
    )

Credits
=======

This project was created and is sponsored by:

.. figure:: http://motion-m.ca/media/img/logo.png
    :figwidth: image

Motion Média (http://motion-m.ca)
