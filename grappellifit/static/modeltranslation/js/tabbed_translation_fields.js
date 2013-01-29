(function ($) {
    
    var langs = [],
        fields = {};

    var GRP_ROW = '.grp-row',
        GRP_BREADCRUMBS = '#grp-breadcrumbs',
        GRP_PAGE_TOOLS = '#grp-page-tools',
        GRP_FOOTER = 'footer.grp-submit-row ul',
        GRP_ADD_HANDLER = '.grp-add-handler';

    var modeltranslation = function(){
        this.langs  = ['en']
        this.fields = {en:[]};
        return this;
    };
    
    modeltranslation.prototype.dom = {
        fields: 'input[type=text], input[type=file], textarea',
        translatedFields: '.modeltranslation'
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
                $self.fields[lang].push({ name: name, el: $(el) });
            }
        });

        if (!$('.grp-modeltranslation').get(0)) {
            $self.createMainSwitch();
        }

        $self.create();
    }; // load

    modeltranslation.prototype.create = function() {
        var $self = this;
        var firstLang = $self.langs[0];

        $.each($self.fields, function(lang, fields) {
            $.each(fields, function(x, field){
                var base_field_id = '#id_'+ field.name +'_'+ firstLang;
                var base_field = $(base_field_id);
                var prev = field.el.prev().get(0);
                if (!prev || (prev && prev.nodeName != 'INPUT')) {
                    var p = field.el.parents(GRP_ROW);
                    field.el.parents('.grp-row').addClass('grp-modeltranslation-'+ lang);
                }
                var label = field.el.parents(GRP_ROW).find('label[for="'+ field.el.attr('id') +'"]');
                label.text(label.text().replace(/\ \[.+\]/, ''));
            });
        });
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

        // We insert the big footer menu only if there is more than one language activated.
        // The smaller top menu is still displayed for informational purpose only.
        // It indicate the active language being edited, but it also indicate
        // that modeltranslation is activated for this model.
        if ($self.langs.length > 1) {
            var ft = $self.mainSwitch.clone().find('a').addClass('grp-button').end();
            $self.footerSwitch= $('<li class="grp-float-left"></li>').append(ft);
            $self.footerSwitch.appendTo($(GRP_FOOTER));
        }

        $('.grp-modeltranslation a').each(function(x, a){
            var a = $(a);
            a.bind('click', function(e) {
                e.preventDefault();
                if (!a.parent().hasClass('active')) {
                    $self.activate(a.data('lang'));
                }
                return false;
            });
        });

    };

    modeltranslation.prototype.activate = function(activateLang) {
        var $self = this;
        for (var x in $self.langs) {
            var lang = $self.langs[x];
            if (lang != activateLang) {
                $('.grp-modeltranslation-'+ lang).hide();
            }
            else {
                $('.grp-modeltranslation-'+ lang).show();
            }
        }
        $self.changed(activateLang);
    };

    modeltranslation.prototype.changed = function(changedLang){
        $('.grp-modeltranslation a[data-lang="'+ changedLang +'"]')
            .parent().addClass('active')
                .siblings().removeClass('active');
    };

    $(function(){
        var mt = new modeltranslation();
        mt.load('body');
        mt.activate(mt.langs[0]);

        $(GRP_ADD_HANDLER).bind('click.modeltranslation', function(){
            group = $(this).parents('.grp-group');
            setTimeout(function(){
                mt.load(group.find('.grp-items > .grp-module:last').prev());
                var lang = $('.grp-modeltranslation li.active a').data('lang');
                mt.activate(lang);
            }, 200);
        });
    });

}(django.jQuery || jQuery || $));
