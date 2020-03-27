$(document).ready(function () {
    var extendable = {
        queue  : {
            tableCallback           : tableCallback,
            newExecuteActionHandler : newExecuteActionHandler,
            known                   : {
                addClassModification    : addClassModification,
                linkToText              : linkToText,
                protectFieldWarning     : protectFieldWarning
            }
        }
    };

    if ('responsiveTables' in $)
        $.extend($.responsiveTables, extendable);
    else
        $.extend({'responsiveTables' : extendable});

    /**
     * Create a queue list
     * @param callbackName
     */
    function tableCallback (callbackName) {
        var list = [],
            name = callbackName;

        this.add = function (callback,properties) {
            if(typeof callback == 'object'){
                if((callback.__proto__.constructor.toString()).indexOf(tableCallback) > -1){
                    list.push(new tableFunction(callback,'tableCallback'));
                    return;
                }
            }

            if(typeof callback == 'function')
                list.push(new tableFunction(callback,properties));
        };

        this.fire = function () {
            for (i in list) {
                if (list[i].properties == 'tableCallback')
                    list[i].callback.fire();
                else if (list.hasOwnProperty(i) && 'callback' in list[i] && typeof list[i].callback == 'function' && typeof list[i].properties == 'object')
                    list[i].callback(list[i].properties);
            }
        };

        this.pending = function () {
            return list.length > 0;
        };

        this.getList = function () {
            return list;
        };
    }

    /**
     * Build a queued callback
     * @param callback
     * @param properties
     * @returns {{callback: *, properties: *}}
     */
    function tableFunction (callback,properties) {
        return {
            'callback'     : callback,
            'properties'   : properties
        };
    }

    /**
     * Queue preconfigured callbacks
     * @param $actions
     * @param data
     * @param lastRow
     */
    function newExecuteActionHandler ($actions, data, lastRow) {
        if($actions.constructor == Array){
            $.each($actions, function (key, action) {
                newExecuteActionHandler (action, data, lastRow);
            });

            return ;
        }

        var $conditionsMet  = true,
            selector        = '';

        $.each($actions.condition, function (key, condition){
            var conditionSplit  = condition.split('='),
                conditionField  = conditionSplit[0],
                conditionValue  = conditionSplit[1];

            switch(conditionField){
                case 'id':
                    conditionField = 'data-id';
                    break;
            }

            selector += '[' + conditionField + '="' + conditionValue + '"] ';
        });

        selector = selector.trim();

        if($conditionsMet){
            switch($actions.perform){
                case 'remove'           : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.closest('li').remove();
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
                case 'addClass'         : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.addClass(data.class);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        'class'     : $actions.class
                    });
                    break;
                }
                case 'removeClass'      : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.removeClass(data.class);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        'class'     : $actions.class
                    });
                    break;
                }
                case 'setText'          : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length){
                            var submitText = target.find('.submitText');

                            if($.htmlLookUp($actions.text)){
                                if(submitText.length)
                                    submitText.html($actions.text);
                                else
                                    target.html($actions.text);
                            }else{
                                if(submitText.length)
                                    submitText.text($actions.text);
                                else
                                    target.text($actions.text);
                            }
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        text        : $actions.text
                    });
                    break;
                }
                case 'appendText'       : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target),
                            text    = target.text() + $actions.text;

                        if (target.length) {
                            if ($.htmlLookUp(text))
                                target.html(text);
                            else
                                target.text(text);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        text        : $actions.text
                    });
                    break;
                }
                case 'addAttr'          : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.attr(data.attrName, data.attrValue);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        attrName    : $actions.attrName,
                        attrValue   : $actions.attrValue
                    });
                    break;
                }
                case 'changeHref'       : {
                    actionsDo.add(function (data) {
                        var obj     = $(data.selector),
                            target  = obj.find(data.target);

                        if(target.length)
                            target.attr('href', data.attrValue);
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        attrValue   : $actions.href
                    });
                    break;
                }
                case 'addIdProtect'     : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            template    = $(data.template).html();

                        if(target.length){
                            var idprotect = 'id_protect_' + obj.attr('data-id');

                            target.append(template);
                            target.find('.id_icon').attr('data-dropdown', idprotect);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        template    : $actions.template
                    });
                    break;
                }
                case 'addContent'       : {
                    var parameters = {
                        selector    : selector,
                        target      : $actions.target,
                        template    : $actions.template
                    };

                    if('position' in $actions){
                        parameters.position = $actions.position;
                    }

                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            template    = $(data.template).html();

                        if(target.length){
                            if('position' in data){
                                if(data.position == 'before')
                                    target.prepend(template);
                                else
                                    target.append(template);
                            }else {
                                target.append(template);
                            }
                        }
                    },parameters);
                    break;
                }
                case 'removeElement'    : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length)
                            target.remove();
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
                case 'fixDropDown'      : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target),
                            dropDown    = data.dropDown;


                        if(target.length){
                            target.find('[data-dropdown]').attr('data-dropdown', dropDown);
                            target.find('.f-dropdown').attr('id', dropDown);
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        dropDown    : $actions.dropDown
                    });
                    break;
                }
                case 'createLink'       : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length){
                            target.each(function () {
                                var obj = $(this);

                                obj.html('<a href="' + data.link + '">' + obj.text() + '</a>');
                            });
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target,
                        link        : $actions.link
                    });
                    break;
                }
                case 'linkToText'       : {
                    actionsDo.add(function (data) {
                        var obj         = $(data.selector),
                            target      = obj.find(data.target);

                        if(target.length){
                            target.each(function () {
                                var obj = $(this);

                                obj.text(obj.text().trim());
                            });
                        }
                    },{
                        selector    : selector,
                        target      : $actions.target
                    });
                    break;
                }
            }
        }
    }


    /*Known callbacks START*/
        function addClassModification (row, config) {
            row.find(config.selector).addClass(config.class);
        }

        function linkToText (row, field) {
            var $field = row.find('[data-attr="' + field + '"]');

            $field.text($field.find('a').text());
        }

        function protectFieldWarning ($config, div, foundDivs, foundAnchors) {
            var found = [foundDivs, foundAnchors];

            $.each(found, function (key, value) {
                var elements = value;

                elements = elements.replace(/^:/,'').split(':');
                elements.pop();

                if(elements.length)
                    elements = ':' + elements.join(':');
                else
                    elements = '';

                found[key] = elements;
            });

            if($config.length == 1 && div.length == 1){
                var divId = div.attr('id');

                found[0] += ':not([id="' + divId + '"])';
                found[1] += ':not([data-dropdown="' + divId + '"])';
            }else{
                $.each($config, function (key, value){
                    var $protect    = value.replace('protect_', ''),
                        target      = div.filter('[id*="' + $protect + '"]');

                    if(target.length){
                        divId = target.attr('id');

                        found[0] += ':not([id="' + divId + '"])';
                        found[1] += ':not([data-dropdown="' + divId + '"])';
                    }
                });
            }

            return found;
        }
    /*Known callbacks END*/
});

$(window).on('load', function () {

});