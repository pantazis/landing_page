$(document).ready(function () {
    var my_modals = {};

    var style = [
        'position: fixed;',
        'top: 0;',
        'height: 100%;',
        'width: 100%;',
        'background-color: rgba(28, 29, 30, 0.7);',
        'z-index: 100;',
        'display: none;'
    ];

    var modalResizeEvents = {};
    var modalResizeCounter = {};

    var modalTemplate   = '<div id="##id##_bgCover" class="my_bgCover##cover_classes##" style="##bgStyle##"></div>'
            + '<div id="##id##" class="my_modals reveal-modal tiny##modal_classes##"></div>',
        closeIcon       = '<a class="close-reveal-mymodal modal_cancel" aria-label="Close">&#215;</a>';

    var queue = {};

    $.fn.extend({
        my_modal : function (action, callback) {
            if (typeof action != 'string')
                throw 'Invalid Action';

            var obj         = $(this),
                modal_id    = obj.attr('id'),
                modal_cover = $('#' + modal_id + '_bgCover');



            switch (action) {
                case 'open'     :
                    var previousVisible = $('.my_bgCover:visible');

                    var wh = $(window).height(),
                        mh = obj.height(),
                        mtop = 0;

                    if (wh >= mh)
                        mtop = (wh-mh)/2;

                    if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                        obj.css('position', 'absolute');
                        mtop += window.pageYOffset;

                        if ($.getSizeClassification('small')) {
                            mtop = window.pageYOffset;
                            // mtop = 0;
                        }
                    }

                    if (previousVisible.length)
                        previousVisible.my_modal('close', function () {
                            obj.css({'top':mtop + 'px'});
                            modal_cover.show();
                        });
                    else {
                        obj.css({'top':mtop + 'px'});
                        modal_cover.show();
                    }

                    if (typeof callback == 'function')
                        callback();

                    pinDisplay();

                    modalResizeEvents[modal_id] = function () {
                        try {
                            clearTimeout(modalResizeCounter[modal_id])
                        } catch (er) {}

                        modalResizeCounter[modal_id] = setTimeout(function () {
                            repositionModalOnWindow(obj);

                            if ('callbacks' in my_modals[modal_id] && 'resize' in my_modals[modal_id].callbacks)
                                my_modals[modal_id].callbacks.resize();
                        }, 100);
                    };

                    window.addEventListener('resize', modalResizeEvents[obj.attr('id')], false);

                    whitenCloseIcon(obj);
                    break;
                case 'close'    :
                    obj.css('top', '-9999999px');
                    modal_cover.hide();

                    if (typeof callback == 'function')
                        callback();

                    unpinDisplay();

                    window.removeEventListener('resize', modalResizeEvents[obj.attr('id')]);
                    break;
                case 'whiten'   :
                    whitenCloseIcon(obj);
                    break;
            }

            return this;
        }
    });

    $.extend({
        my_modals : {
            insert          : function (properties) {
                modalCreator(properties);

                return true;
            },
            pinDisplay      : function () {
                if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                    return;
                }

                pinDisplay()
            },
            unpinDisplay    : function () {
                unpinDisplay()
            }
        }
    });

    function queueFunction (callback,properties) {
        return {
            'callback'     : callback,
            'properties'   : properties
        };
    }

    function addToQueue (my_queue, callback, properties) {
        try {
            queue[my_queue].push(new queueFunction(callback, properties));
        } catch (er) {
            queue[my_queue] = [];
            queue[my_queue].push(new queueFunction(callback, properties));
        }
    }

    //Initialize modal
    //Insert template, content and hook events
    function modalCreator (properties) {
        insertNewModal(properties);

        my_modals[properties.id] = {
            modal       : $('#' + properties.id),
            modal_bg    : $('#' + properties.id + '_bgCover'),
        };

        insertContentToModal(properties);

        if (! my_modals[properties.id].modal_bg.hasClass('dismiss_click')) {
            my_modals[properties.id].modal_bg.on('click', function (e) {
                e.preventDefault();

                if (my_modals[properties.id].modal.is(e.target) || my_modals[properties.id].modal.find(e.target).length)
                    return ;

                my_modals[properties.id].modal.my_modal('close');
            });
        }

        if ('callbacks' in properties)
            my_modals[properties.id].callbacks = properties.callbacks;

        if ('close_icon' in  properties) {
            my_modals[properties.id].modal.find('.close-reveal-mymodal').on('click', function (e) {
                e.preventDefault();

                my_modals[properties.id].modal.my_modal('close');
            });
        }
    }

    //Insert Modal template and Populate properties
    //If you want to make modal spin should be done here
    function insertNewModal (properties) {
        if (properties.id in my_modals)
            throw 'Modal already created';

        if (properties.constructor != Object || Object.keys(properties).length < 1)
            throw 'Invalid properties';

        if (! ('id' in properties))
            throw 'Id is missing';

        if (! ('cover_classes' in properties))
            properties.cover_classes = '';
        else if (properties.cover_classes.constructor == Array)
            properties.cover_classes =  properties.cover_classes.join(' ');

        if ('disable' in properties) {
            if ('bg_click_close' in properties.disable)
                properties.cover_classes += ' dismiss_click';
        }

        var bgStyle = style;

        $('body').append(modalTemplate
            .replace(/##bgStyle##/g, bgStyle.join(' ').trim())
            .replace(/##id##/g, properties.id)
            .replace(/##cover_classes##/g,  ' ' + properties.cover_classes)
            .replace(/##modal_classes##/g, (('modal_classes' in properties && properties.modal_classes) ? ' ' + properties.modal_classes : ''))
        );
    }

    //Insert Modal's content
    function insertContentToModal (properties) {
        if ('content' in properties && properties.content.constructor  == Array) {

            properties.content = JSON.stringify(properties.content);

            for (i in my_modal_classes) {
                if (my_modal_classes.hasOwnProperty(i)) {
                    properties.content = properties.content.replace(new RegExp('##' + i + '##','g'), my_modal_classes[i]);
                }
            }
            properties.content = JSON.parse(properties.content);

            for (i in properties.content) {
                if (properties.content.hasOwnProperty(i)) {
                    var element = convertStringToElement(properties.content[i], properties.id);

                    // my_modals[properties.id].modal.css({'position': 'fixed', 'top': '203px', 'visibility': 'visible'})[0].appendChild(element);
                    my_modals[properties.id].modal.css({'position': 'fixed', 'top': '-900px', 'display': 'block', 'visibility': 'visible'})[0].appendChild(element);
                }
            }
        }

        for (i in queue[properties.id]) {
            if (queue[properties.id].hasOwnProperty(i))
                queue[properties.id][i].callback(queue[properties.id][i].properties);
        }

        queue[properties.id] = [];

        if ('close_icon' in properties)
            $('#' + properties.id).append(closeIcon);
    }

    //Convert strings to modals
    function convertStringToElement (elementString, queue, tempElement) {
        var elementSplit;

        if (typeof tempElement == 'undefined')
            tempElement = null;

        if (typeof elementString == 'string')
            elementSplit = JSON.parse(elementString);
        else
            elementSplit = elementString;

        for (i in elementSplit) {
            if (elementSplit.hasOwnProperty(i)) {
                var elementToCreate, element = null;

                if (typeof elementSplit[i] == 'string') {
                    try {
                        elementToCreate = elementSplit[i].match(valid_elements)[1]
                    } catch (er) {
                        throw 'Invalid element structure: "' + elementSplit[i] + '"';
                    }

                    element = document.createElement(elementToCreate);

                    try {
                        var attributes      = elementSplit[i].match(/{.+}/),
                            text            = ((attributes != null) ? elementSplit[i].replace(attributes[0],'').match(/\[.+]/) : elementSplit[i].match(/\[.+]/));

                        if (attributes != null) {
                            attributes = attributes[0].replace(/{|}/g, '').split(',');

                            for (i in attributes) {
                                if (attributes.hasOwnProperty(i)) {
                                    var attribute = attributes[i].split('=');

                                    if (attribute[0] == 'style') {
                                        var cssAttributes = attribute[1].replace(/:\s+/g,':').replace(/;/g,'').trim().split(' ');

                                        var selector = '#' + queue + ' ';

                                        if (element.id)
                                            selector += '#' + element.id;

                                        if (element.className)
                                            selector += '.' + element.className.replace(/\s+/g,' ').replace(/\s/g,'.');

                                        addToQueue(queue, queuedStyle, {
                                            'selector'  : selector,
                                            'style'     : cssAttributes
                                        });
                                    } else
                                        element.setAttribute(attribute[0], attribute[1]);
                                }
                            }
                        }

                        if (text != null) {
                            text[0] = text[0].replace(/\[|]/g, '');

                            if (text[0].match(/^trans/))
                                text[0] = $.translate(text[0].replace(/^trans/g, '').replace(/\(|\)/g, ''));

                            element.appendChild(document.createTextNode(text[0]));
                        }
                    } catch (er) {
                        console.log(er);
                    }

                    if (element != null) {
                        if (tempElement == null) {
                            tempElement = element;
                        } else {
                            tempElement.appendChild(element);
                        }
                    }
                }else{
                    var parent = tempElement;

                    if (tempElement.lastElementChild != null)
                        parent = tempElement.lastElementChild;

                    element = convertStringToElement(elementSplit[i], queue, parent);

                    if (tempElement.lastElementChild == null)
                        tempElement = element;
                    else
                        tempElement.lastElementChild = element;
                }
            }
        }

        return tempElement;
    }

    //Disable body scroll
    function pinDisplay () {
        $('html,body').on('touchmove', function(e){ e.preventDefault(); });

        if(!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)){
            current_top= $(window).scrollTop();
            $('body').css({ 'position': 'fixed', 'overflow-y':'scroll', 'width':'100%', 'top': - current_top});
        }
    }

    //Enable body scroll
    function unpinDisplay () {
        $('html,body').off('touchmove');

        if($('body').css('position') == 'fixed'){
            $('body').css({'position': 'static', 'overflow-y': 'auto', 'width': '100%'});
            if(!$.isTouch() || ($.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)) {
                window.scrollTo(0, current_top);
            }
        }
    }

    function queuedStyle (data) {
        var element = document.querySelector(data.selector);

        for(c in data.style) {
            if(data.style.hasOwnProperty(c)) {
                var rule = data.style[c].split(':');

                element.style[rule[0]] = rule[1];
            }
        }
    }

    function repositionModalOnWindow (modal) {
        if ($.getSizeClassification('small')) {
            modal.css('top','0px');
        } else {
            var wh = $(window).height(),
                mh = modal.height(),
                mtop = 0;

            if (wh >= mh)
                mtop = (wh-mh)/2;

            if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                mtop += window.pageYOffset;
            }

            modal.css('top', mtop+'px');
        }
    }

    function whitenCloseIcon (modal) {
        if (modal.find('.lead').css('color') == 'rgb(255, 255, 255)')
            modal.find('.custom-close-modal, .close-reveal-mymodal').css('color', 'white');
    }
});