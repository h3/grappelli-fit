(function ($) {
    
    var langs = [],
        fields = {};

    var GRP_ROW = '.grp-row';
    var GRP_BREADCRUMBS = '#grp-breadcrumbs';
    var GRP_PAGE_TOOLS = '#grp-page-tools';

    var modeltranslation = function(){
        this.langs  = ['en']
        this.fields = {en:[]};
        return this;
    };
    
    modeltranslation.prototype.dom = {
        fields: 'input[type=text], input[type=file], textarea',
        translatedFields: '.modeltranslation',
    };

    modeltranslation.prototype.load = function($parent) {
        var $self = this;
        $self.parent = $($parent || 'body');

        var domFields = $self.parent.find($self.dom.translatedFields);

        domFields.each(function (i, el) {
            var name = $(el).attr('name').split('_'), lang = name.pop();
            name = name.join('_');

            if ($self.langs.indexOf(lang) == -1) {
                $self.langs.push(lang);
            }

            if (!$self.fields[lang]) {
                $self.fields[lang] = [];
            }

            if (!/__prefix__/.test(name)) {
                $self.fields[lang].push({
                    name: name, el: $(el)
                });
            }
        });
        $self.create();

    }; // load

    modeltranslation.prototype.create = function() {
        var $self = this;
        var firstLang = $self.langs[0];

        $.each($self.fields, function(lang, fields) {
            // We move translated field below their respective base fields
            if (lang != firstLang) {
                $.each(fields, function(x, field){
                    var base_field = $('#id_'+ field.name +'_'+ firstLang);
                    var p = field.el.parents(GRP_ROW);
                    field.el.hide().insertAfter(base_field);
                    p.remove();
                });
            }
            // We remove language brackets from base fields' labels
            else {
                $.each(fields, function(x, field){
                    var label = field.el.parents(GRP_ROW).find('label[for="'+ field.el.attr('id') +'"]');
                    label.text(label.text().replace(/\ \[.+\]/, ''));
                });
            }
        });

        $self.createMainSwitch();
    };

    modeltranslation.prototype.createMainSwitch = function() {
        var $self = this;
        $self.mainSwitch = $([
            '<nav class="grp-modeltranslation">',
                '<header style="display:none"><h1>Language</h1></header>',
                '<ul></ul>',
            '</nav>'
        ].join(''));

        var ul = $self.mainSwitch.find('ul');

        for (var x in $self.langs) {
            var l = $self.langs[x];
            $('<li'+ (x==0 && ' class="active"' || '') +'><a href="javascript://" data-lang="'+ l +'">'+ l +'</a></li>').appendTo(ul);
        }        

        $self.mainSwitch.insertAfter($(GRP_PAGE_TOOLS).get(0) && GRP_PAGE_TOOLS || GRP_BREADCRUMBS);

        var footerSwitch = $self.mainSwitch.clone()
                            .find('a').addClass('grp-button').end();
        var test = $('<li class="grp-float-left"></li>').append(footerSwitch);

        $('footer.grp-submit-row ul').append(test);

        $self.mainSwitch.find('a').each(function(x, a){
            var a = $(a);
            a.bind('click', function(e) {
                e.preventDefault();
                if (!a.parent().hasClass('active')) {
                    a.parent().addClass('active').siblings().removeClass('active');
                    $self.activate(a.data('lang'));
                }
                return false;
            });
        });

    };

    modeltranslation.prototype.activate = function(activateLang) {
        var $self = this;
        $.each($self.fields, function(lang, fields) {
            // We hide all fields that aren't this lang
            if (lang != activateLang) {
                $.each(fields, function(x, field){
                    field.el.hide();
                });
            }
            // We show all fields that are this lang
            else {
                $.each(fields, function(x, field){
                    field.el.show();
                });
            }
        });
    };

    $(function(){
        var mt = new modeltranslation();
        mt.load('body');
    });

}(django.jQuery || jQuery || $));


//(function ($) {
//
//    $(function() {
//
//        var dom = {
//            add_handler: $('.add-item .add-handler'),
//        };
//
//        var page = {
//            is_changelist: $('body').hasClass('grp-change-list'),
//            is_changeform: $('body').hasClass('grp-change-form'),
//        };
//
//        $.modeltranslation = (function() {
//            var mt = {
//                languages: [],
//                options: {
//                    fieldTypes: 'input[type=text], input[type=file], textarea'
//                }
//            }
//
//            
//            mt.init = function(opts) {
//                /* Initialize modeltranslation toolbars
//                 * @opts     Options [optional]
//                 */
//                $self = this;
//                $self.options = $.extend(this.options, opts)
//
//                if (page.is_changeform) {
//
//                    var tabs, group,
//                        fields = $self._getTranslatedFields();
//
//                    // Discover languages
//                    $.each(fields, function (name, languages) {
//                        $.each(languages, function (lang, el) {
//                            if ($.inArray(lang, mt.languages) < 0) {
//                                mt.languages.push(lang);
//                            }
//                        });
//                    });
//
//                    tabs = mt._createInlineTabs();
//
//                    //$self._createMainSwitch(tabs, fields);
//
//                    // Adding new inlines, rebinding events
//                    dom.add_handler.bind('click.modeltranslation', function(){
//                        group = $($self).parents('.grp-group');
//                        setTimeout(function(){
//                            $self._createInlineTabs(group.find('.items > .module:last').prev());
//                        }, 200);
//                    });
//                }
//                else if (page.is_changelist) {
//                    console.log('wtf', $('body').hasClass('grp-change-list'))
//                    tabs = mt._createChangelistTabs();
//                }
//            };
//
//
//            // Inserts a select box to select language globally
//            mt._createMainSwitch = function(tabs, fields) {
//                var $self = this,
//                    grouped_translations = fields,
//                    select = $('<select>');
//
//                $.each(mt.languages, function (i, language) {
//                    select.append($('<option value="' + i + '">' + language + '</option>'));
//                });
//                select.change(function (e) {
//                    $.each(tabs, function (i, tab) {
//                        tab.tabs('select', parseInt(select.val()));
//                    });
//                });
//                $('#content h1').append('&nbsp;').append(select);
//            };
//
//            // Create change list tabbing
//            mt._createChangelistTabs = function() {
//                var translations = this._getTranslatedFields()
//                var tabs = []
//                var container = $('<div class="modeltranslation-switcher-container ui-widget"></div>').css('margin-bottom', 6)
//                var tabs = $('<ul class="modeltranslation-switcher ui-helper-reset ui-helper-clearfix"></ul>').appendTo(container)
//                console.log('createChangelistTabs')
//                $.each(this.options.languages, function(i, lang) {
//                    $('<li class="required ui-state-default ui-corner-top"><a></a></li>')
//                        .css({float: 'left'}).appendTo(tabs)
//                        .find('a').bind('click.modeltranslation', function(){
//                            var l = $(this).attr('href').replace('#', '')
//                            $('.translated-field:not(.translation-'+ l +')').hide()
//                            $('.translation-'+ l).show()
//                            $(this).parent().addClass('ui-tabs-selected').siblings().removeClass('ui-tabs-selected')
//                        }).attr('href', '#'+lang).text(lang)
//                })
//
//                // Insert toolbar only if there is translated fields
//                if (tabs.find('li').length) {
//                    // Tweak table header
//                    $('.grp-changelist-results').find('thead th').each(function(i, t){
//                        var th    = $(t)
//                        var label = $.trim(th.find('a').text())
//                        if (/\[\w{2}\]/.test(label)) {
//                            match = label.match(/\[(\w{2})\]/)
//                            if (match.length > 1) {
//                                th.addClass('translated-field translation-'+ match[1])
//                                    .find('a').text(label.replace(/\ \[.+\]/, ''))
//                            }
//                        }
//                    })
//
//                    // Tweak rows
//                    var fields = $('.modeltranslation')
//                        .filter(this.options.fieldTypes).each(function(i, f){
//                            var field = $(f)
//                            $(f).parent().addClass('translated-field translation-'+ $(f).attr('id').slice(-2))
//                        })
//
//                    // hide innactive translations
//                    $('.translated-field:not(.translation-'+ this.options.languages[0] +')').hide()
//
//                    tabs.find('li:first').addClass('ui-tabs-selected')
//                    return container.insertBefore('#changelist-form')
//                }
//            };
//
//            mt._createTabularInlineTabs = function($parent) {
//                var container, tabs_container, tabs_list, default_lang,
//                    translations = $self._getTranslatedFields($parent),
//                    tabs = [];
//                if ($parent) {
//                    container = $($parent).find('.grp-group.tabular');
//                }
//                else {
//                    container = $('.grp-group.tabular');
//                }
//                if (container.length) {
//                    tabs_container = $('<div class="modeltranslation-switcher-container"></div>');
//                    tabs_list = $('<ul class="modeltranslation-switcher"></ul>').appendTo(tabs_container);
//                    tabs_shim = $('<div style="display:none;" />').appendTo(tabs_container); // can't use real tabs, so we fake them
//
//                    tabs_container.insertAfter(container.find('> .grp-tools'));
//                    //tabs_container.appendTo(container.find('.thead'));
//            
//                    $.each(mt.languages, function (i, lang) {
//                        if (i == 0) {
//                            default_lang = lang;
//                        }
//                        var id = 'tab_'+ container.attr('id').replace('set-group', lang);
//                        $('<li><a href="#' + id + '">' + lang + '</a></li>')
//                            .appendTo(tabs_list)
//                            .find('a').bind('click', function() {
//                                var id = $(this).attr('href').replace('#', '');
//                                $.each(mt.languages, function (i, lang) {
//                                    var el = $('.'+ id.slice(0, -2) + lang)
//                                    if (id.slice(-2) != lang) {
//                                        el.hide();
//                                    }
//                                    else {
//                                        el.show();
//                                    }
//                                });
//                                return false;
//                            });
//                        $('<div id="'+ id +'" />').appendTo(tabs_shim);
//                    });
//
//                    container.find('.grp-row').each(function(i, th){
//                        th = $(th);
//                        var classes = th.attr('class').split(' ');
//                        // Remove language and brackets from field label, they are
//                        // displayed in the tab already.
//                        if (th.html()) {
//                            th.html(th.html().replace(/\ \[.+\]/, ''));
//                        }
//                        $.each(classes, function(x, classname){
//                            if ($.inArray(classname.slice(-2), mt.languages) > -1 && classname.slice(-3, -2) == '-') {
//                                var c = "tab_"+ container.attr('id').replace('set-group', classname.slice(-2));
//                                th.addClass(c);
//                                if (classname.slice(-2) != default_lang) {
//                                    th.hide();
//                                }
//                            }
//                        });
//                        
//                    });
//
//                    tabs_container.tabs();
//                    tabs.push(tabs_container);
//                    $.each(translations, function (name, languages) {
//                        $.each(languages, function(lang, el){
//                            var p = $(el).parent();
//                            var classname = container.attr('id').replace('set-group', lang);
//                            if (p.hasClass('td')) {
//                                p.addClass('tab_'+classname);
//                            }
//                            if (lang != default_lang) {
//                                p.hide();
//                            }
//                        });
//
//                    });
//                    return tabs;
//                }
//            };
//
//            // Create change form tabbing
//            mt._createInlineTabs = function($parent) {
//                var tabs = [],
//                    translations = mt._getTranslatedFields($parent);
//
//                $.each(translations, function (name, languages) {
//                    var tabs_container = $('<div class="modeltranslation-switcher-container"></div>'),
//                      tabs_list = $('<ul class="modeltranslation-switcher"></ul>'),
//                      insertion_point;
//                    tabs_container.append(tabs_list);
//                    $.each(languages, function (lang, el) {
//                        if (!$(el).parent().hasClass('.td')) {
//                            var container = $(el).closest('.grp-row'),
//                              label = $('label', container),
//                              field_label = container.find('label'),
//                              id = 'tab_' + [name, lang].join('_'),
//                              panel, tab;
//                            // Remove language and brackets from field label, they are
//                            // displayed in the tab already.
//                            if (field_label.html()) {
//                                field_label.html(field_label.html().replace(/\ \[.+\]/, ''));
//                            }
//                            if (!insertion_point) {
//                                console.log('IP')
//                                insertion_point = {
//                                    'insert': container.prev().length ? 'after' : container.next().length ? 'prepend' : 'append',
//                                    'el': container.prev().length ? container.prev() : container.parent()
//                                };
//                            }
//                            console.log(insertion_point)
//                            container.find('script').remove();
//                            panel = $('<div id="' + id + '"></div>').append(container);
//                            tab = $('<li' + (label.hasClass('required') ? ' class="required"' : '') + '><a href="#' + id + '">' + lang + '</a></li>');
//                            tabs_list.append(tab);
//                            tabs_container.append(panel);
//                        }
//                    });
//                    insertion_point.el[insertion_point.insert](tabs_container);
//                    tabs_container.tabs();
//                    tabs.push(tabs_container);
//                });
//                mt._createTabularInlineTabs($parent);
//                return tabs;
//            };
//                
//            mt._getTranslatedFields = function($parent) {
//                /** Returns a grouped set of all text based model translation fields.
//                 * The returned datastructure will look something like this:
//                 * {
//                 *   'title': {
//                 *     'en': HTMLInputElement,
//                 *     'fr': HTMLInputElement
//                 *   }
//                 * }
//                 */
//                var fields,
//                    out    = {},
//                    langs  = [];
//                if ($parent) {
//                    fields = $($parent).find('.modeltranslation').filter(this.options.fieldTypes);
//                }
//                else {
//                    fields = $('.modeltranslation').filter(this.options.fieldTypes);
//                }
//
//                fields.each(function (i, el) {
//                    var name = $(el).attr('name').split('_'),
//                        lang = name.pop();
//                    name = name.join('_');
//                    langs.push(lang);
//                    if (!/__prefix__/.test(name)) {
//                        if (!out[name]) { out[name] = {}; }
//                        out[name][lang] = el;
//                    }
//                })
//                
//                mt.options.languages = $.unique(langs.sort());
//
//                return out;
//            };
//
//            return mt;
//        }());
//        $.modeltranslation.init();
//    })
//}(django.jQuery || jQuery || $));
