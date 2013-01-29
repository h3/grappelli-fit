try:
    from os import environ
    import imp
    i = imp.find_module(environ["DJANGO_SETTINGS_MODULE"])
    imp.load_module(environ["DJANGO_SETTINGS_MODULE"])
except:
    import sys
    from os.path import dirname, abspath, join
    PROJECT_ROOT = dirname(__file__)
    sys.path.insert(0, abspath(join(PROJECT_ROOT, '../')))
    sys.path.insert(0, abspath(join(PROJECT_ROOT, '../../grappellifit/')))
    import example_project
    from example_project.envs.local import *
