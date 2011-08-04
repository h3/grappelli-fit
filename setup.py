# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name='grappellifit',
    version='0.1.0',
    description='A Grappelli compatibility layer for popular Django apps',
    author='Maxime Haineault (Motion Média)',
    author_email='max@motion-m.ca',
    url='http://code.google.com/p/grappelli-fit/',
    download_url='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Framework :: Django',
    ]
)

