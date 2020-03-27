/*
 * cookies_api
 * Connects with the api and set or unset a cookie.
 * The token must already be set before the function is called.
 */

$(document).ready(function () {
    
    Date.prototype.stdTimezoneOffset = function () {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };

    Date.prototype.isDstObserved = function () {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    };

    Date.prototype.setTimezone = function (timezoneOffset) {
        var localTime = this.getTime(),
            localOffset = this.getTimezoneOffset() * 60000,
            utc = localTime + localOffset,
            offset = utc + (3600000*timezoneOffset);

        return this.setTime(offset);
    };

    Date.prototype.checkOfset = function (offset) {
        return ((this.isDstObserved()) ? (offset + 1) : offset);
    };

    Array.prototype.removeIndex = function (index) {
        try {
            return this.filter(function(v,i) {
                return i != index
            })
        } catch (e) {}
    };

    if (typeof Object.prototype.array_except == 'undefined') {
        Object.defineProperty(Object.prototype, 'array_except', {
            value: function (key) {
                var keyType = typeof key;

                if (keyType == 'string' || keyType == 'number') {
                    try {
                        delete this[key]
                    } catch (e) {
                    }
                } else if (keyType == 'object') {
                    if (key.constructor == Array) {
                        for (var i in key) {
                            if (key.hasOwnProperty(i)) {
                                try {
                                    delete this[key[i]]
                                } catch (e) {
                                }
                            }
                        }
                    }
                }

                return this;
            },
            enumerable: false, // this is actually the default
        });
    }

    var observers       = {},
        isIdle          = false,
        $modal_opening  = false,
        $modal_opened   = false;

    /* close the box message */
    $(".closeMessage").on('click',function(e){
        e.preventDefault();
        clearTimeout(timeOut);
        $("#alertContainer").slideUp(400);
    });
    $('.modal_cancel').on('click',function(e){
        e.preventDefault();
        var obj = $(this);

        if(obj.hasClass('disabled'))
            return ;

        obj.closest('.reveal-modal').modal_close();
    });
    $('.close-reveal-mymodal').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.reveal-modal').modal_close();
    });

    $('#CartOrder .modal_cancel').on('click', function (e) {
       e.preventDefault();

        clearInterval(checkoutTimer);
    });

    alert = {
        formid          : null,
        mssg            : null,
        alert           : null,
        data            : null,
        element         : null,
        outerShutter    : null,
        control         : true
    };

    //If the page unloads disables all the display messages.
    $(window).bind('beforeunload', function(){
        alert['control'] = false;
    });

    $.fn.extend({
        renameAttr              : function ( name, newName, removeData ) {
            var val;
            return this.each(function() {
                val = jQuery.attr( this, name );
                jQuery.attr( this, newName, val );
                jQuery.removeAttr( this, name );
                // remove original data
                if (removeData !== false){
                    jQuery.removeData( this, name.replace('data-','') );
                }
            });
        },
        modal_open              : function (callback) {
            var obj = $(this),
                visible_modals = $('.reveal-modal:visible:not(.my_modals)');

            if (obj.length < 1) {
                if(visible_modals.length)
                    visible_modals.modal_close();

                return;
            }

            obj.trigger('modal:opening');


            $modal_opening  = true;
            $modal_opened   = true;

            if(visible_modals.length)
                visible_modals.modal_close();

            obj.foundation('reveal','open');

            if(typeof callback == 'function')
                callback(obj);

            setTimeout(function(){
                $('.reveal-modal-bg').show();
            },250);

            if($.getSizeClassification('medium_up') && (!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)))
                disableBodyScroll();


            if($.getSizeClassification('medium_up') && (!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null))) {
                setTimeout(function () {
                    $('body').css({
                        'overflow-y': 'hidden',
                        'position': 'fixed'
                    });
                }, 200);

                $('body').css({
                    'overflow-y': 'hidden',
                    'position': 'fixed'
                });
            }


            if ($.getSizeClassification('medium_down')) {
                if (obj.offset().top + obj.height() >= $(window).height()) {
                    obj.css({
                        'height'        : '100%',
                        'overflow-y'    : 'scroll',
                        'position'      : 'fixed'
                    });

                    setTimeout(function () {
                        obj.css('top', '0px');
                    }, 400);
                }
            } else {
                if (obj.offset().top + obj.height() >= $(window).height()) {
                    obj.addClass('modal-with-scroll');
                    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                    {
                        setTimeout(function () {
                            obj.css({
                                'position'  : 'fixed',
                                'top'       : ''
                            });
                        }, 400);
                    }
                }
            }

            $modal_opening = false;

            obj.my_modal('whiten');


            obj.trigger('modal:opened');
            return obj;
        },
        modal_close             : function (callback) {
            var obj = $(this);

            obj.trigger('modal:closing');

            obj.find('.reveal-password:has(.icon-eye)').click();
            obj.each(function(){
                $(this).foundation('reveal','close');
            });

            if($.getSizeClassification('medium_up'))
                enableBodyScroll();

            $('body').css({
                'overflow-y'    : '',
                'position'      : 'initial'
            });
            obj.css({
                'position'  : '',
                'top'       : '',
                'height'    : '',
                'overflow'  : ''
            }).removeClass('modal-with-scroll');

            $modal_opened = false;

            if (typeof callback == 'function')
                callback();

            obj.trigger('modal:closed');
            return obj;
        },
        assign_secondary_phone  : function (targets) {
            /*
                Get the country controller and assign an event on change.
                On change, change the value of target to the value of the controller.
                The targets must be input fields and must me empty in order for the country to change.
                The target's id + '_country' must provide the country's id.
            */
            $(this).on('change',function(){
                var controller = $(this),
                    id = '',
                    input = null;

                $.each(targets,function(){
                    input = $('#' + $(this).attr('id').replace('_country', ''));
                    //id = input.attr('id') + '_country';
                    if(!input.val()){
                        $(this).chosen_update(controller.val());
                    }

                });
            });
        },
        /**
         * Get disabled property or set/unset disabled property.
         * @param enable
         * @returns {*}
         */
        disabled                : function (enable) {
            if(typeof enable == 'boolean'){
                if(enable){
                    $(this).attr('disabled',true);
                }else{
                    $(this).removeAttr('disabled');
                }
            }else{
                return $(this).prop('disabled');
            }

            return $(this);
        },
        /**
         * Get checked property or set/unset checked property.
         * @param enable
         * @returns {*}
         */
        checked                 : function (enable) {
            if(typeof enable == 'boolean'){
                $(this).prop('checked', enable);
            }else{
                return $(this).prop('checked');
            }

            return $(this);
        },
        apply_chosen            : function (properties) {
            if(typeof properties != 'undfined' && properties == null)
                properties = '';

            if (!$.isTouch()) {
                $(this).each(function(){
                    var value = null;

                    if(!$(this).is('select')){
                        return ;
                    }

                    if (properties.constructor == Object) {
                        if ('value' in properties) {
                            value = (properties['value'] ? properties['value'] : '');
                            if (!('disable_search' in properties['par'] && 'disable_search_threshold' in properties['par'])) {
                                properties.par['disable_search_threshold'] = 10;
                            }
                            if ($(this).find('option').length < 9) {
                                properties['par']['disable_search'] = true
                            }

                            if('events' in properties['par']){
                                obj = $(this);
                                $.each(properties['par'].events, function ($key, $event){
                                    obj.on($event.name, function (){
                                        $event.event();
                                    })
                                });

                                delete properties['par'].events;
                            }

                            $(this).chosen(properties['par']);
                        } else {
                            if (!'disable_search' in properties && !'disable_search_threshold' in properties) {
                                properties['disable_search_threshold'] = 10;
                            }

                            if ($(this).find('option').length < 9) {
                                properties['disable_search'] = true
                            }

                            if('events' in properties){
                                var obj = $(this);
                                $.each(properties.events, function ($key, $event){
                                    obj.on($event.name, function (){
                                        $event.event();
                                    })
                                });

                                delete properties.events;
                            }

                            $(this).chosen(properties);
                        }
                    } else if (typeof properties == 'string' || typeof properties == 'number') {
                        value = (properties ? properties : '');
                        if ($(this).find('option').length < 9) {
                            $(this).chosen({'disable_search': true});
                        } else {
                            $(this).chosen();
                        }
                    } else {
                        if ($(this).find('option').length < 9) {
                            $(this).chosen({'disable_search': true});
                        } else {
                            $(this).chosen();
                        }
                    }

                    if(value == null){
                        value = $(this).attr('value');


                        if(!value)
                            value = $(this).find('option:selected').length ? $(this).val() : '' ;
                    }


                    $(this).find('.placeholder').remove();

                    $(this).chosen_update(value);
                });
            }

            return this;
        },
        chosen_update           : function (value) {
            var obj = $(this);

            if($.isArray(value)){
                obj.find('option').removeAttr('selected').prop('selected',false);
                $.each(value,function(key,val){
                    obj.find('option[value="' + val + '"]').prop('selected',true);
                });
                obj.trigger('chosen:updated');
            }else{
                if(value) {
                    obj.find('option').removeAttr('selected').prop('selected', false);
                    obj.find('option[value="' + value + '"]').prop('selected', true).trigger('chosen:updated');
                }else{
                    obj.val('').trigger('chosen:updated');
                }
            }

            return this;
        },
        chosen_disable          : function (properties) {

            if(typeof properties == 'undefined'){
                properties = {
                    value : ''
                };
            }

            if(! properties.hasOwnProperty('value')){
                properties.value = ''
            }

            $(this).each(function(){
                $(this).attr({'disabled':true}).val(properties.value).trigger('chosen:updated');
            });
        },
        chosen_enable           : function (properties) {
            var obj = $(this);

            if(typeof properties == 'undefined'){
                properties = {
                    value : ''
                };
            }

            if(! properties.hasOwnProperty('value')){
                properties.value = ''
            }

            obj.each(function(){
                $(this).attr({'disabled':false}).val(properties.value).trigger('chosen:updated');
            });

            return obj;
        },
        chosen_option           : function (properties) {
            if(typeof properties != 'object'){
                throw new Error("Properties is not defined");
            }

            if(typeof properties.action == 'undefined'){
                throw new Error("No action selected");
            }

            if(typeof properties.selector_string == 'undefined' && typeof properties.option_obj == 'undefined'){
                throw new Error("Option is not defined");
            }

            var obj = $(this),
                option = null;

            if(typeof properties.selector_string != 'undefined'){
                option = obj.find(properties.selector_string);
            }else{
                option = properties.option_obj;
            }

            switch (properties.action){
                case 'disable':{
                    option.attr({'disabled':!option.prop('disabled')});
                    obj.chosen_update();
                }
            }

            return obj;
        },
        chosen_append           : function (text, value, properties) {
            $(this).each(function () {
                var obj = $(this),
                    current_val = obj.val() ? obj.val() : '';

                if(properties.where)
                    obj.find(properties.where).append('<option value="' + value + '">' + text + '</option>');
                else
                    obj.append('<option value="' + value + '">' + text + '</option>');

                if(properties['own-value'])
                    obj.chosen_update(current_val);
                else
                    obj.trigger('chosen:updated');
            })
        },
        getOuterHTML            : function () {
            return $(this)[0].outerHTML;
        },
        translate               : function (path, population, replace) {
            var obj = $(this),
                $text = trans(path, population);

            if(typeof replace == 'object')
                $.each(replace, function ($target, $value) {
                    $regex = new RegExp('##' + $target + '##','g');
                    $text = $text.replace($regex, $value);
                });


            if ($.htmlLookUp($text))
                obj.html($text);
            else
                obj.text($text);

            return obj;
        },
        statuses_update         : function ($class, $text, $origin) {
            if(typeof $origin == 'undefined')
                $origin = 'label';
            
            $class = $origin + ' ' + $class;
            
            $(this).attr('class', $class).text($text);
            return this;
        },
        activation              : function (status, callback) {
            if(typeof status == 'string'){
                if(status == 'toggle'){
                    $(this).toogleClass('active');
                }
            }else if (typeof status == 'boolean') {
                if (status) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            }

            if(typeof callback == 'function')
                callback(this);
        },
        attr_app                : function (attr,val) {
            var obj = $(this);
            if(typeof attr == 'string'){
                if(val){
                    var attr_used = obj.attr(attr);

                    if(!attr_used){
                        attr_used = '';
                    }

                    obj.attr(attr, attr_used + val);
                }
            }else if(typeof attr == 'object'){
                $.each(attr,function(name,value){
                    obj.attr_app(name,value);
                })
            }

            return obj;
        },
        attr_pre                : function (attr,val) {
            var obj = $(this);

            if (obj.length > 1) {
                obj.each(function () {
                    $(this).attr_pre(attr,val);
                });
            } else {
                if (typeof attr == 'string') {
                    if (val) {
                        if (obj.length > 1) {
                            obj.each(function () {
                                var item = $(this),
                                    attr_used = item.attr(attr);

                                if (!attr_used) {
                                    attr_used = '';
                                }

                                item.attr(attr, val + attr_used);
                            });
                        } else {
                            var attr_used = obj.attr(attr);

                            if (!attr_used) {
                                attr_used = '';
                            }

                            obj.attr(attr, val + attr_used);
                        }
                    }
                } else if (typeof attr == 'object') {
                    $.each(attr, function (name, value) {
                        obj.attr_pre(name, value);
                    })
                }
            }

            return obj;
        },
        setUpAllViewsTabHandler : function () {
            var tabsContainer = $(this);

            $(document)
                .on('click', '#' + tabsContainer.attr('id') + ' .tab-title:not(.active) a', function (e) {
                    e.preventDefault();

                    tabsContainer.find('.accordion [aria-expanded].active').removeClass('active');

                    tabsContainer.find('.accordion [href="' + $(this).attr('href') + '"]').addClass('active');
                })
                .on('click', '#' + tabsContainer.attr('id') + ' .accordion [aria-expanded]', function (e) {
                    e.preventDefault();

                    var obj = $(this);

                    if (! obj.hasClass('active')) {
                        tabsContainer.find('.accordion [aria-expanded].active').removeClass('active');

                        obj.addClass('active');

                        tabsContainer.find('.tab-title').removeClass('active').find('[href="' + obj.attr('href') + '"]').closest('.tab-title').addClass('active');
                    } else {
                        obj.removeClass('active');
                        tabsContainer.find('.tab-title').removeClass('active');
                        tabsContainer.find('.tab-title:first').addClass('active');
                    }
                });

            var timmerName = tabsContainer.attr('id') + '_timer';
            window[timmerName] = null;

            $(window).on('resize', function () {
                if (window[timmerName] != null)
                    clearTimeout(window[timmerName]);

                window[timmerName] = setTimeout(function () {
                    if ($.getSizeClassification('large_up')) {
                        if (tabsContainer.find('.content.active').length < 1) {
                            tabsContainer.find('.content:first').addClass('active').show();
                            tabsContainer.find('.accordion [aria-expanded]:first').addClass('active');
                        }
                    }
                }, 10);
            });
        },
        noUiSlider              : function () {
            try {
                return this[0].noUiSlider;
            } catch (e) {
                return this;
            }
        }
    });

    $.extend({
        /**
         * Set cookie locally.
         * @param name
         * @param value
         * @param url
         * @param redirect
         */
        set_cookie              : function (name,value,url,redirect) {
            Cookies.set(name, value,{path: url});

            if(typeof redirect != 'undefined'){
                location.href = redirect;
            }else{
                setTimeout(function(){
                    location.reload();
                },100);
            }
        },
        cookieHandler           : function (name, callback) {
            if (typeof name != 'string')
                return ;

            if (typeof callback != 'function')
                return ;

            if (Cookies.get(name)) {
                try {
                    callback(Cookies.get(name));
                } catch (err) {}

                Cookies.remove(name);
            }

        },
        /**
         * Get the correct window size without counting the scrollbar width.
         * @returns {*}
         */
        windowSize              : function () {
            $('body').append('<div id="scrollContainer"><p id="scrollObject"></p></div>');
            $('#scrollContainer').css({'position':'absolute','top':'0px','left':'0px','visibility':'hidden','width':'200px','height':'150px','overflow':'hidden'});
            $('#scrollObject').css({'width':'100%','height':'200px'});
            var w1 = $('#scrollObject').outerWidth();
            $('#scrollContainer').css({'overflow':'scroll'});
            var w2 = $('#scrollObject').outerWidth();
            if (w1 == w2) w2 = $('#scrollContainer').outerWidth();
            $('#scrollContainer').remove();
            return $(window).width() + (w1 - w2);
        },
        /**
         * Find the size classification of the current view as well find the classification of a requested size.
         * @param look_up
         * @returns {*}
         */
        getSizeClassification   : function (look_up) {
            if(typeof look_up != 'undefined'){
                if(typeof look_up == 'string') {
                    switch (look_up) {
                        case 'small' :
                            return $.windowSize() <= width_threshold.small.upper;
                        case 'medium' :
                            return $.windowSize() > width_threshold.medium.lower - 1 && $.windowSize() < width_threshold.medium.upper + 1;
                        case 'large' :
                            return $.windowSize() > width_threshold.large.lower - 1 && $.windowSize() < width_threshold.large.upper + 1;
                        case 'xlarge' :
                            return $.windowSize() >= width_threshold.x_large.lower;
                        case 'medium_down' :
                            return $.windowSize() <= width_threshold.medium.upper;
                        case 'medium_up' :
                            return $.windowSize() >= width_threshold.medium.lower;
                        case 'large_down' :
                            return $.windowSize() < width_threshold.large.upper;
                        case 'large_up' :
                            return $.windowSize() > width_threshold.large.lower;
                        default :
                            throw new Error("The given classification does not match our list.");
                    }
                }else if(typeof look_up == 'number'){
                    if(look_up <= width_threshold.small.upper) {
                        return 'small'
                    }else if(look_up > width_threshold.medium.lower - 1 && look_up < width_threshold.medium.upper + 1) {
                        return 'medium'
                    }else if(look_up > width_threshold.large.lower - 1 && look_up < width_threshold.large.upper + 1) {
                        return 'large'
                    }else if(look_up >= width_threshold.x_large.lower) {
                        return 'xlarge'
                    }
                }else {
                    throw new Error("Invalid lookup type.");
                }
            }else{
                throw new Error("Classification must be a valid string.");
            }
        },
        isTouch                 : function () {
            return !!('ontouchstart' in window);
        },
        /**
         * Set cookie with laravel.
         * @param name
         * @param val
         * @param action
         * @param token
         */
        cookie_api              : function (name, val, action, token) {
            $.ajax({
                url: baseUrl + '/api/user/set-cookie',
                method: 'POST',
                data: {
                    _token: token,
                    cName: name,
                    cValue: val,
                    cAction: action
                },
                error   : function (e) {
                    globalErrorsHandler(e);
                }
            });
        },
        ajax_prototype          : function (parameters, formId, expansion_properties) {
            if(typeof formId != 'undefined' && formId !== false && formId != null)
                formId = formId.replace(/^#/,'');

            var instance    = this,
                exception   = ['success', 'presuccesscallback', 'postsuccesscallback', 'error', 'preerrorcallback', 'posterrorcallback'];

            // instance.headers        = {
            //     'x-dnhost'  : 000
            // };
            instance.cache          = true;
            instance.ifModified     = false;
            instance.processData    = true;
            instance.async          = true;
            instance.crossDomain    = false;
            instance.dataType       = 'json';
            instance.timeout        = 30000;
            instance.beforeSend     = function () {
                defaultBeforeSendAjaxAction(formId);
            };
            instance.error          = function (e) {
                globalErrorsHandler(e);
            };
            instance.complete       = function () {
                $.enable_form_controls(formId);
                $('.submitText').show();
                $('.loading:not(.always_visible)').hide();
            };

            if(typeof parameters == 'object'){
                $.each($.array.except.key(parameters, exception),function(key,value){
                    if (key == 'complete') {
                        $.enable_form_controls(formId);
                    }

                    if(key.indexOf('callback') > -1){
                        var callbackName = key;

                        key = key.replace('pre', '').replace('post', '').replace('callback', '');

                        var main = instance[key];

                        if (callbackName.indexOf('pre') > -1)
                            instance[key] = function () {
                                value(instance);
                                main();
                            };

                        if (callbackName.indexOf('post') > -1)
                            instance[key] = function () {
                                main();
                                value(instance);
                            };
                    }else{
                        if (key != 'success') {
                            instance[key] = value;
                        }
                    }
                });
            }

            if(typeof expansion_properties == 'object'){
                $.each(expansion_properties,function(key,value){
                    if (key == 'complete') {
                        $.enable_form_controls(formId);
                    }

                    var $temp       = instance[key];

                    instance[key]   = function () {
                        try {
                            $temp();
                            value(instance);
                        }
                        catch(err) {}
                    }
                });
            }

            /**
             *Assigning a function in the ajax objects requires direct access to the object to abstract set data traversing
             */

            instance.success        = function (data) {
                try {
                    if('presuccesscallback' in parameters)
                        parameters['presuccesscallback'](instance, data);

                    parameters['success'](data, instance);

                    if('postsuccesscallback' in parameters)
                        parameters['postsuccesscallback'](instance, data);
                }
                catch(err) {}

            };

            if('error' in parameters || 'preerrorcallback' in parameters || 'posterrorcallback' in parameters)
                instance.error      = function (e) {
                    if('preerrorcallback' in parameters)
                        parameters['preerrorcallback'](instance);

                    if('error' in parameters)
                        parameters['error'](e);
                    else
                        globalErrorsHandler(e);

                    if('posterrorcallback' in parameters)
                        parameters['posterrorcallback'](instance);
                }

            var tmp = instance.beforeSend;

            instance.beforeSend = function (instance) {
                if(typeof tmp == 'function')
                    tmp(instance);

                $('input').blur();
            }
        },
        ajax_variable_prototype : function (properties, flavor) {
            return ajax_cart_prototype (properties, flavor);
        },
        ajax_get_flavor         : function (properties, flavor) {
            var tmp = ajax_cart_prototype (properties, flavor);

            return tmp();
        },
        compare_two_strings     : function (stringA, stringB, strict) {
            if(!stringA || !stringB){
                return false;
            }
            if(!strict){
                stringA = stringA.toLowerCase();
                stringB = stringB.toLowerCase();
            }

            return stringA == stringB;
        },
        translate               : function (path, population, replace){
            var $text = trans(path, population);

            if(typeof replace == 'object')
                $.each(replace, function ($target, $value) {
                    $regex = new RegExp('##' + $target + '##','g');
                    $text = $text.replace($regex, $value);
                });

            return $text;
        },
        idle                    : function (callback, time) {
            if(typeof time == 'string'){
                if(time in $idle_times)
                    time = $idle_times[time];
                else
                    time = $idle_times.common;
            }else if (typeof time == 'number'){
                time = parseInt(time);
            }else{
                return ;
            }

            if(typeof callback != 'function')
                return ;

            inactivityTime(callback, time);
        },
        isIdle                  : function (state) {
            if(typeof state == 'boolean')
                isIdle = state;

            return isIdle;
        },
        htmlLookUp              : function (text) {
            return /<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/.test(text);
        },
        keys                    : function (obj){
            return Object.keys(obj);
        },
        observers               : {
            //JS MUTATION OBSERVERS
            register : function (name, callback) {
                try {
                    observers[name] = new MutationObserver(callback);
                } catch (er){};
            },
            observe : function (name, node, config){
                /*
                    Observer api configuration list
                    childList
                    attributes
                    characterData
                    subtree
                    attributeOldValue
                    characterDataOldValue
                    attributeFilter
                */
                try {
                    if(!(node instanceof HTMLElement))
                        node = node[0]

                    observers[name].observe(node, config);
                } catch (er){};
            }
        },
        array                   : {
            except            : {
                key     : function (data, except) {
                    temp = {};

                    $.each(data, function (key, keyValue){
                        if($.inArray(key, except) == -1)
                            temp[key] = keyValue;
                    });

                    return temp;
                }
            }
        },
        isMobile                : function () {
            var md;

            try {
                md = $.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null);
            } catch (er) {
                md = false
            }

            return ($.isTouch() || md);
        },
        isReleaseDate           : function (year, month, day, hour, minute, second, strict) {
            var now = new Date(),
                release = new Date(Date.UTC(year, (month-1), day, hour, minute, second));

            if (typeof strict != 'undefined' && strict === true)
                return (now == release);
            else
                return (now >= release);
        },
        is_guest                : function () {
            return $userGroup == 'guest';
        },
        is_user                 : function () {
            return $userGroup == 'user';
        },
        is_admin                : function () {
            return $userGroup == 'admin';
        },
        disable_gdpr_mopdal     : function (data) {
            var  modal = $('#gdpr_approval_modal');

            if (modal.length ) {
                $('#gdpr_approval_modal .disabled').removeClass('disabled');

                var modal_bg = $('.reveal-modal-bg');

                modal_bg.css('z-index', modal_bg.attr('data-init-index'));

                if (data.code != error_codes.password_mismatch && data.code != error_codes.general_gdpr_approval_is_missing)
                    modal.modal_close();
            }
        },
        activateOverlayLoader   : activateOverlayLoader,
        deactivateOverlayLoader : deactivateOverlayLoader,
    });

    $referenceLinks = $('.reference_link');

    if($referenceLinks.length)
        $referenceLinks.on('click', function (e){
            e.preventDefault();

            $(this).closest('form').submit();
        });

    $(document)
        .on('click','#reloadbtn',function(e){
            e.preventDefault();
            location.reload();
        })
        .on('click', '.reveal-modal-bg', function(e){
            var modal = $('.reveal-modal.open');

            modal.find('.reveal-password:has(.icon-eye)').click();

            options = modal.attr('data-options');
            if(modal.length && (typeof options == 'undefined' || options.indexOf('close_on_background_click:false') < 0)){
                enableBodyScroll();
            }
        })
        .on('click', '#nav-icons .tabTrigger', function (e) {
            e.preventDefault();

            var $target = $(this).attr('href');

            $('[href="' + $target+ '"]:not(.tabTrigger):first').click();

            window.location.hash = $target;
        })
        .on('click', '.with-inner-list.with-click .head', function (e) {
            var obj = $(this).closest('.with-click'),
                ul = obj.find('ul'),
                initial = ul.css('max-height');

            $(obj.parents()[0]).find('.with-inner-list.with-click ul').css('max-height','0');

            if (initial == null || parseInt(initial) == 0)
                obj.find('ul').css('max-height', '15rem');
            else
                obj.find('ul').css('max-height', '0');
        })
        .on('click', function (e) {
            var target = $(e.target);

            if (target.is('.with-inner-list.with-click') || $('.with-inner-list.with-click').has(e.target).length > 0) {
                var clickSource = $(target.closest('.with-click').parents()[0]);

                $(':has(> .with-inner-list.with-click)').filter(function (i,a) { return !$(a).is(clickSource)}).find('ul').css('max-height','0');
            } else {
                $('.with-inner-list.with-click ul').css('max-height','0');
            }
        })
        .keyup(function(e) {
            if (e.keyCode == 27 && $modal_opened) {
                $('body').css({
                    'overflow-y'    : '',
                    'position'      : 'initial'
                });
                $('.reveal-modal.modal-with-scroll').css({
                    'position'  : '',
                    'top'       : '',
                    'height'    : '',
                    'overflow'  : ''
                }).removeClass('modal-with-scroll');

                $modal_opened = false;
            }
        });

    $(window).on('resize', function () {
        if (typeof modalRebuildTimer != 'undefined' && modalRebuildTimer != null)
            clearTimeout(modalRebuildTimer);

        if (! $modal_opening) {
            modalRebuildTimer = setTimeout(function () {
                var modal = $('.reveal-modal.open');

                if (modal.length) {
                    var currentWidthClass = $.getSizeClassification($.windowSize());

                    if (currentWidthClass != widthClass) {
                        widthClass = currentWidthClass;

                        if ($.getSizeClassification('medium_down')) {
                            if (modal.offset().top + modal.height() >= $(window).height()) {
                                modal.css({
                                    'height'        : '100%',
                                    'overflow-y'    : 'scroll',
                                    'position'      : 'fixed',
                                    'top'           : '0px'
                                });

                                modal.removeClass('modal-with-scroll');
                            }
                        } else {
                            if (modal.offset().top + modal.height() >= $(window).height())
                                modal.css({
                                    'postion'   : 'fixed',
                                    'top'       : '',
                                    'height'    : '',
                                    'overflow'  : ''
                                }).addClass('modal-with-scroll');
                        }
                    }
                }

                modalRebuildTimer = null;
            }, 250);

        }
    });

    var widthClass = $.getSizeClassification($.windowSize());

    $('.close-reveal-modal.modal-cancel').on('click', function () {
        $('body').css({
            'overflow-y'    : '',
            'position'      : 'initial'
        });

        var modal = $(this).closest('.reveal-modal');

        setTimeout(function () {
            modal.css({
                'position'  : '',
                'top'       : '',
                'height'    : '',
                'overflow'  : ''
            });
        }, 300);
    });

    /*
     The following script checks if there is a cookie carrying an error message and if it is, displays it.
     */
    $.cookieHandler('errorCode', function (value) {
        var msg = value;

        setTimeout(function(){
            if(msg.match(/false/) != null){
                $.alertHandler('', msg.replace(/,false/,''), alert_box_failure);
            }else if(msg.match(/true/) == null){
                $.alertHandler('', msg, alert_box_warning);
            }$
        },100);
    });
    // if(Cookies.get('errorCode')){
    //     msg = Cookies.get('errorCode');
    //     setTimeout(function(){
    //         if(msg.match(/false/) != null){
    //             $.alertHandler('', msg.replace(/,false/,''), alert_box_failure);
    //         }else if(msg.match(/true/) == null){
    //             $.alertHandler('', msg, alert_box_warning);
    //         }$
    //     },100);
    //     Cookies.remove("errorCode");
    // }


    $.cookieHandler('openPref', function (value) {
        setTimeout(function(){
            $('[href="#preferencesContent"]:first').click();
        },100);
    });
    // if(Cookies.get('openPref')){
    //     setTimeout(function(){
    //         $('[href="#preferencesContent"]:first').click();
    //     },100);
    //     Cookies.remove("openPref");
    // }

    ;( function ( factory ) {
        factory( $ );
    }( function ( $ ){
        $.fn.addBack = $.fn.addBack || $.fn.andSelf;

        $.fn.extend({

            actual : function ( method, options ){
                var $target = this.eq( 0 );
                var fix, restore;

                var tmp   = [];
                var style = '';
                var $hidden;

                fix = function (){
                    // get all hidden parents
                    $hidden = $target.parents().addBack().filter( ':hidden' );
                    style   += 'visibility: hidden !important; display: block !important; ';

                    // save the origin style props
                    // set the hidden el css to be got the actual value later
                    $hidden.each( function (){
                        // Save original style. If no style was set, attr() returns undefined
                        var $this     = $( this );
                        var thisStyle = $this.attr( 'style' );

                        tmp.push( thisStyle );
                        // Retain as much of the original style as possible, if there is one
                        $this.attr( 'style', thisStyle ? thisStyle + ';' + style : style );
                    });
                };

                restore = function (){
                    // restore origin style values
                    $hidden.each( function ( i ){
                        var $this = $( this );
                        var _tmp  = tmp[ i ];

                        if( _tmp === undefined ){
                            $this.removeAttr( 'style' );
                        }else{
                            $this.attr( 'style', _tmp );
                        }
                    });
                };


                fix();

                // get the actual value with user specific methed
                // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
                // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
                var actual = $target[ method ]();

                restore();
                // IMPORTANT, this plugin only return the value of the first element

                return actual;
            }
        });
    }));

    function ajax_cart_prototype (properties, flavor) {
        return function (formId) {
            if(typeof formId != 'string')
                formId = false;
            
            if(typeof flavor == 'string' && flavor in $.request_flavors && 'properties' in $.request_flavors[flavor])
                properties = $.request_flavors[flavor].properties;

            return create_ajax_cart_prototype (properties, flavor, formId);
        }
    }

    function create_ajax_cart_prototype (properties, flavor, formId){
        var expansion   = {},
            parameters  = {};

        if(flavor in $.request_flavors) {
            if (typeof flavor == 'string' && 'expansion' in $.request_flavors[flavor])
                expansion = $.request_flavors[flavor].expansion;

            if (typeof flavor == 'string' && 'parameters' in $.request_flavors[flavor])
                parameters = $.request_flavors[flavor].parameters;
        }

        properties = $.extend(properties, expansion);

        var $prototype = new $.ajax_prototype(properties, formId, parameters);

        return $prototype;
    }

    var inactivityTime = function (callback, time) {
        var t;

        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;

        function execute() {
            callback();
        }

        function resetTimer() {
            clearTimeout(t);

            if($.isIdle())
                return;

            t = setTimeout(execute, time)
        }

        resetTimer();
    };
});

function default_error_function(){
    $.alertHandler('', APP_LANG.MESSAGES.ERROR, alert_box_warning);
}

function defaultBeforeSendAjaxAction(formid, disableLoader){
    if($("#alertContainer").is(':visible')) {
        killDisplays(true);
    }

    if(typeof disableLoader == 'undefined' || disableLoader === false){
        show_clicked_btns_loader ();
    }

    if(typeof formid != 'undefined' && formid !== false && $('.reveal-modal-bg').length < 1 && formid != null) {
        activateFormDim();
    }
}

function activateFormDim () {
    $('body').append('<div id="formDim" style="position:absolute; top:0; background-color: rgba(28, 29, 30, 0.7); z-index: 999999; display:block;"></div>');
    $('#formDim').css({'width': $(document).outerWidth(), 'height': $(document).outerHeight()});
}

function deactivateFormDim () {
    $('#formDim').remove();
}

function activateOverlayLoader () {
    var active = $('form > :not(:disabled)');

    active.addClass('loaderDisabled').disabled(true);
    var globalOverlayLoader = $('.global-overlay-loader');

    if (globalOverlayLoader.length < 1) {
        $('body').append('<div class="global-overlay-loader"><div class="loading"><span class="spinner"></span></div></div>');

        globalOverlayLoader = $('.global-overlay-loader');
    }

    globalOverlayLoader.show().find('.loading').show();
}

function deactivateOverlayLoader () {
    $('.global-overlay-loader').hide();
    $('.loaderDisabled').disabled(false).removeClass('loaderDisabled');
}

/**
 * When a submit button is clicked show the hidden loader.
 */
function show_clicked_btns_loader (){
    var loader = $('.loader_cont'),
        active_element = $(document.activeElement);

    if($.isTouch()){
        if(active_element.is('body')){
            active_element = $('.requestTrigger:first');
        }
    }

    $('.requestTrigger').removeClass('requestTrigger');


    active_element.blur();

    if(loader.length && !active_element.is('body')) {
        if(active_element.is('.loader_cont')){
            loader = active_element;
        }else if(active_element.closest('form').length){
            loader = active_element.closest('form').find('.loader_cont');
        }else{
            loader = active_element.find('form').find('.loader_cont');
        }

        loader = loader.filter(':visible');
        loader.find('.submitText').hide();
        loader.find('.loading').show();
    }
}

function disableBodyScroll(){
    $('body').on('touchmove', function(e){ e.preventDefault(); });

    if(!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)){
        current_top= $(window).scrollTop();
        $('body').css({ 'position': 'fixed', 'overflow-y':'scroll', 'width':'100%', 'top': - current_top});
    }
}


function disableBodyScrollModalScroll(modal){
    if(!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)){
        current_top= $(window).scrollTop();
        $('body').css({ 'position': 'fixed', 'overflow-y':'hidden', 'width':'100%', 'top': - current_top});
        modal.css({ 'overflow-y':'auto'});
    }
}

function enableBodyScroll(){
    $('body').off('touchmove');

    if($('body').css('position') == 'fixed'){
        $('body').css({'position': 'static', 'overflow-y': 'auto', 'width': '100%'});
        if(!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)) {
            window.scrollTo(0, current_top);
        }
    }
}

function checkIfLocationIsBackend(location){
    return (/http[s]?:[/]{2}(my|admin)/).test(location)
}

function trans (string, population) {
    string = string.toUpperCase();

    var translation = window['TRANS'],
        strings = string.replace(/^TRANS\./, '').split('.'),
        key_not_found = false;

    $.each(strings, function (key, value) {
        if(value in translation){
            translation = translation[value];
        }else{
            key_not_found = true;
            return false
        }
    });

    if(key_not_found)
        return '';

    if(population){
        if(population == 1){
            return translation[1];
        }else{
            return translation[2];
        }
    }else{
        if(translation.constructor == Object && population === 0 && 2 in translation)
            return translation[2];

        return translation;
    }
}

// function inviteCheckoutTimeout () {
//     var obj = $('#inviteCheckoutTimeout');
//
//     obj.text(10);
//     checkoutTimer = setInterval(function () {
//         var val = parseInt(obj.text()) - 1;
//
//         obj.text(val);
//
//         if(val == 0){
//             var callback = window[obj.attr('data-callback')];
//
//             if(typeof callback == 'function')
//                 callback();
//
//             $('#CartOrder').modal_close();
//             clearInterval(checkoutTimer);
//         }
//     },1000)
// }


/**
 * Create a loader that covers the hole page.
 */
function appendPageCoverLoader (cover_modals) {
    if ($('#pageLoader').length < 1)
        $('body').append('<div id="pageLoader" style="width:100%; height:100%; background-color:rgba(28, 29, 30, 0.7); position:fixed; top:0"><div style="position: relative; margin-left: 50%; margin-right: 50%; height: 100%; top: 50%;"><div class="loading"><span class="spinner bigger"></span></div></div></div>');

    if (typeof cover_modals != 'undefined' && cover_modals === true)
        $('#pageLoader').css('z-index',100)
}

function create_length_string (key) {
    return ((key < 12) ? (key + ' ' + trans('length.month', key)) : ((key/12) + ' ' + trans('length.year', (key/12))))
}
