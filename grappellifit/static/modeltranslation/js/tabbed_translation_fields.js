(function ($) {
    $(function() {
        $.modeltranslation = (function() {
            var mt = {
                languages: [],
                options: {
                    fieldTypes: 'input[type=text], input[type=file], textarea'
                },

                init: function(opts) {
                    $self = this;
                    $self.options = $.extend(this.options, opts)
                    $self.fields = $self._getTranslatedFields();

                    // Discover languages
                    $.each($self.fields, function (name, languages) {
                        $.each(languages, function (lang, el) {
                            if ($.inArray(lang, mt.languages) < 0) {
                                mt.languages.push(lang);
                            }return;
                        });return;
                    });

                    // TODO: +cookie
                    $self.defaultLanguage = mt.languages[0];
                    $self._tweakUI();
                    $self._createMainSwitch();

                    // Adding new inlines, rebinding events
                    $('.grp-add-handler').bind('click.modeltranslation', function(){
                        group = $(this).parents('.grp-group > .grp-module:last').prev();
                        setTimeout(function(){
                            console.log(group.length);
                            $self._tweakUI(group);
                        }, 200);
                    });
                },

                // Inserts a select box to select language globally
                _createMainSwitch: function() {
                    var $self = this,
                        li = $('<li class="grp-float-left" />')
                                    .insertAfter('.grp-fixed-footer ul:first > li:first-child');
                        select = $('<select />').appendTo(li)

                    // Build options
                    $.each(mt.languages, function (i, language) {
                        var attrs = language == $self.defaultLanguage && ' selected' || '';
                        select.append($('<option value="' + language + '"'+ attrs +'>' + language + '</option>'));
                    });

                    // Changed callback
                    var switchlang = function (e) {
                        $.each($self.fields, function(i, field){
                            $.each(field, function(x, langinput){
                                var input = $(langinput),
                                    id = input.attr('id'),
                                    oldlang = id.slice(-2),
                                    row = input.parents('.grp-row'),
                                    tr = input.parents('.grp-tr');

                                if (row.length > 0) {
                                    if (oldlang != select.val()) { row.hide(); }
                                    else { row.show(); }
                                }
                                else {
                                    // INLINE !
                                    var td = $('.grp-td.'+ input.attr('name').match(/.*set-\d+-(.*)/i)[1]);
                                    console.log(oldlang, select.val())
                                    console.log(td)
                                    if (oldlang != select.val()) { td.hide(); }
                                    else { td.show(); }
                                    //console.log('inline', row, langinput)
                                }
                            });
                        });
                    };
                    select.on('change', switchlang);
                    select.on('keyup', switchlang);
                },

                _cleanLabel: function(l) {
                    // Removes the "[lang]" tags
                    l.text(l.text().replace(/\[\w+\]/, ''));
                },

                _tweakUI: function(parentnode) {
                    var parentnode = $(parentnode || 'body');
                    $.each($self.fields, function(i, field){
                        $.each(field, function(x, langinput){
                            var input = $(langinput, parentnode),
                                id = input.attr('id'),
                                lang = id.slice(-2),
                                label = $('label[for="'+ id +'"]', parentnode),
                                row = input.parents('.grp-row'),
                                tr = input.parents('.grp-tr');

                            if (!input.hasClass('modeltranslation-default')) {
                                input.css('background-color', '#ffffda');
                            }

                            if (row.length > 0) {
                                if (lang != $self.defaultLanguage) { row.hide(); }
                                else { row.addClass('lang-default'); }
                            }
                            else {
                                var td = input.parents('.grp-td');
                                var th = $('.grp-th.'+ input.attr('name').match(/.*set-\d+-(.*)/i)[1].replace('_', '-'), parentnode);
                                $self._cleanLabel(th);
                                if (lang != $self.defaultLanguage) { td.hide(); th.hide(); }
                                else { td.addClass('lang-default'); }
                            }

                            $self._cleanLabel(label);
                        });
                    });
                },

                //// Create change list tabbing
                //_createChangelistTabs: function() {
                //    var translations = this._getTranslatedFields()
                //    var tabs = []
                //    var container = $('<div class="modeltranslation-switcher-container ui-tabs ui-widget ui-widget-content ui-corner-all"></div>').css('margin-bottom', 6)
                //    var tabs = $('<ul class="modeltranslation-switcher ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"></ul>').appendTo(container)
                //    $.each(this.options.languages, function(i, lang) {
                //        $('<li class="required ui-state-default ui-corner-top"><a></a></li>')
                //            .css({float: 'left'}).appendTo(tabs)
                //            .find('a').bind('click.modeltranslation', function(){
                //                var l = $(this).attr('href').replace('#', '')
                //                $('.translated-field:not(.translation-'+ l +')').hide()
                //                $('.translation-'+ l).show()
                //                $(this).parent().addClass('ui-tabs-selected').siblings().removeClass('ui-tabs-selected')
                //            }).attr('href', '#'+lang).text(lang)
                //    })

                //    // Insert toolbar only if there is translated fields
                //    if (tabs.find('li').length) {
                //        // Tweak table header
                //        $('.changelist-results').find('thead th').each(function(i, t){
                //            var th    = $(t)
                //            var label = $.trim(th.find('a').text())
                //            if (/\[\w{2}\]/.test(label)) {
                //                match = label.match(/\[(\w{2})\]/)
                //                if (match.length > 1) {
                //                    th.addClass('translated-field translation-'+ match[1])
                //                        .find('a').text(label.replace(/\ \[.+\]/, ''))
                //                }
                //            }
                //        })

                //        // Tweak rows
                //        var fields = $('.modeltranslation')
                //            .filter(this.options.fieldTypes).each(function(i, f){
                //                var field = $(f)
                //                $(f).parent().addClass('translated-field translation-'+ $(f).attr('id').slice(-2))
                //            })

                //        // hide innactive translations
                //        $('.translated-field:not(.translation-'+ this.options.languages[0] +')').hide()

                //        tabs.find('li:first').addClass('ui-tabs-selected')
                //        return container.insertBefore('#changelist-form')
                //    }
                //},

                //_createTabularInlineTabs: function($parent) {
                //    var container, tabs_container, tabs_list, default_lang,
                //        translations = $self._getTranslatedFields($parent),
                //        tabs = [];
                //    if ($parent) {
                //        container = $($parent).find('.group.tabular');
                //    }
                //    else {
                //        container = $('.group.tabular');
                //    }
                //    if (container.length) {
                //        tabs_container = $('<div class="modeltranslation-switcher-container"></div>');
                //        tabs_list = $('<ul class="modeltranslation-switcher"></ul>').appendTo(tabs_container);
                //        tabs_shim = $('<div style="display:none;" />').appendTo(tabs_container); // can't use real tabs, so we fake them

                //        tabs_container.insertAfter(container.find('> .tools'));
                //        //tabs_container.appendTo(container.find('.thead'));
                //
                //        $.each(mt.languages, function (i, lang) {
                //            if (i == 0) {
                //                default_lang = lang;
                //            }
                //            var id = 'tab_'+ container.attr('id').replace('set-group', lang);
                //            $('<li><a href="#' + id + '">' + lang + '</a></li>')
                //                .appendTo(tabs_list)
                //                .find('a').bind('click', function() {
                //                    var id = $(this).attr('href').replace('#', '');
                //                    $.each(mt.languages, function (i, lang) {
                //                        var el = $('.'+ id.slice(0, -2) + lang)
                //                        if (id.slice(-2) != lang) {
                //                            el.hide();
                //                        }
                //                        else {
                //                            el.show();
                //                        }
                //                    });
                //                    return false;
                //                });
                //            $('<div id="'+ id +'" />').appendTo(tabs_shim);
                //        });

                //        container.find('.thead .th').each(function(i, th){
                //            th = $(th);
                //            var classes = th.attr('class').split(' ');
                //            // Remove language and brackets from field label, they are
                //            // displayed in the tab already.
                //            if (th.html()) {
                //                th.html(th.html().replace(/\ \[.+\]/, ''));
                //            }
                //            $.each(classes, function(x, classname){
                //                if ($.inArray(classname.slice(-2), mt.languages) > -1 && classname.slice(-3, -2) == '-') {
                //                    var c = "tab_"+ container.attr('id').replace('set-group', classname.slice(-2));
                //                    th.addClass(c);
                //                    if (classname.slice(-2) != default_lang) {
                //                        th.hide();
                //                    }
                //                }
                //            });
                //            
                //        });

                //        tabs_container.tabs();
                //        tabs.push(tabs_container);
                //        $.each(translations, function (name, languages) {
                //            $.each(languages, function(lang, el){
                //                var p = $(el).parent();
                //                var classname = container.attr('id').replace('set-group', lang);
                //                if (p.hasClass('td')) {
                //                    p.addClass('tab_'+classname);
                //                }
                //                if (lang != default_lang) {
                //                    p.hide();
                //                }
                //            });

                //        });
                //        return tabs;
                //    }
                //},

                //// Create change form tabbing
                //_createInlineTabs: function($parent) {
                //    var tabs = [],
                //        translations = this._getTranslatedFields($parent);
                //    $.each(translations, function (name, languages) {
                //        var tabs_container = $('<div class="modeltranslation-switcher-container"></div>'),
                //          tabs_list = $('<ul class="modeltranslation-switcher"></ul>'),
                //          insertion_point;
                //        tabs_container.append(tabs_list);
                //        $.each(languages, function (lang, el) {
                //            if (!$(el).parent().hasClass('.td') && !$(el).parent().hasClass('.grp-td')) {
                //                var container = $(el).closest('.row, .grp-row'),
                //                  label = $('label', container),
                //                  field_label = container.find('label'),
                //                  id = 'tab_' + [name, lang].join('_'),
                //                  panel, tab;
                //                // Remove language and brackets from field label, they are
                //                // displayed in the tab already.
                //                if (field_label.html()) {
                //                    field_label.html(field_label.html().replace(/\ \[.+\]/, ''));
                //                }
                //                if (!insertion_point) {
                //                    insertion_point = {
                //                        'insert': container.prev().length ? 'after' : container.next().length ? 'prepend' : 'append',
                //                        'el': container.prev().length ? container.prev() : container.parent()
                //                    };
                //                }
                //                container.find('script').remove();
                //                panel = $('<div id="' + id + '"></div>').append(container);
                //                tab = $('<li' + (label.hasClass('required') ? ' class="required"' : '') + '><a href="#' + id + '">' + lang + '</a></li>');
                //                tabs_list.append(tab);
                //                tabs_container.append(panel);
                //            }
                //        });
                //        console.log(insertion_point, '')
                //        insertion_point.el[insertion_point.insert](tabs_container);
                //        tabs_container.tabs();
                //        tabs.push(tabs_container);
                //    });
                //    this._createTabularInlineTabs($parent);
                //    return tabs;
                //},
                
                _getTranslatedFields: function($parent) {
                    /** Returns a grouped set of all text based model translation fields.
                     * The returned datastructure will look something like this:
                     * {
                     *   'title': {
                     *     'en': HTMLInputElement,
                     *     'fr': HTMLInputElement
                     *   },
                     *   'body': {
                     *     'en': HTMLTextAreaElement,
                     *     'fr': HTMLTextAreaElement
                     *   }
                     * }
                     */
                    var fields,
                        out    = {},
                        langs  = [];
                    if ($parent) {
                        fields = $($parent).find('.modeltranslation').filter(this.options.fieldTypes);
                    }
                    else {
                        fields = $('.modeltranslation').filter(this.options.fieldTypes);
                    }
                    //onAfterAdded
                    
                    fields.each(function (i, el) {
                        var name = $(el).attr('name').split('_'),
                            lang = name.pop();
                        name = name.join('_');
                        langs.push(lang);
                        if (!/__prefix__/.test(name)) {
                            if (!out[name]) { out[name] = {} }
                            out[name][lang] = el;
                        }
                    })
                    this.options.languages = $.unique(langs.sort());
                    return out;
                }
            }
            return mt;
        }());
        $.modeltranslation.init();
    })
}(django.jQuery || jQuery || $));
