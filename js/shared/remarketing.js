$(document).ready(function () {
    var cookies = {
        add_remarketing_items       : 'add_remarketing_items',
        update_remarketing_items    : 'update_remarketing_items',
        remarketing_login           : 'remarketing_login',
        remarketing_register        : 'remarketing_register'
    };

    $.fn.extend({
        sendSelectContentForThisUrl : function () {
            if (app_env != 'local') {
                var obj = $(this),
                    target = obj.attr('href').split('/');

                target = target[target.length - 1];
                target = target.toLowerCase().replace(/-/g,'_');

                sendSelectContentForThisUrl(target);
            }

            return this;
        }
    });

    $.extend({
        sendSelectContentForThisUrl         : function (url) {
            if (app_env != 'local') {
                var target = url.split('/');

                target = target[target.length - 1];
                target = target.toLowerCase().replace(/-/g,'_');

                sendSelectContentForThisUrl(target);
            }
        },
        getNewTabRemarketingCookie          : function () {
            var target = location.href.split('/');

            target = target[target.length - 1];
            target = target.toLowerCase().replace(/-/g,'_');

            var cookie_name = 'new_tab_remarketing_' + target;

            return Cookies.get(cookie_name);
        },
        removeNewTabRemarketingCookie       : function () {
            var target = location.href.split('/');

            target = target[target.length - 1];
            target = target.toLowerCase().replace(/-/g,'_');

            var cookie_name = 'new_tab_remarketing_' + target;

            Cookies.remove(cookie_name);
        },
        sendAddToCartRemarketingEvent       : function (items) {
            sendAddToCartRemarketingEvent(items);
        },
        sendRemoveFromCartRemarketingEvent  : function (items) {
            sendRemoveFromCartRemarketingEvent(items);
        },
        setAddToCartConfiguredCart          : function (items) {
            Cookies.set(cookies.add_remarketing_items, JSON.stringify(items),{path: '/'});
        },
        getAddToCartConfiguredCart          : function () {
            var addToCartItems = Cookies.get(cookies.add_remarketing_items);

            if (addToCartItems) {
                sendAddToCartRemarketingEvent(JSON.parse(addToCartItems));
                Cookies.remove(cookies.add_remarketing_items);
            }
        },
        updateItemInAnalytics               : function (items) {
            updateItemInAnalytics(items);
        },
        setUpdateConfiguredCart             : function (items) {
            Cookies.set(cookies.update_remarketing_items, JSON.stringify(items),{path: '/'});
        },
        getUpdateConfiguredCart             : function () {
            var updateItems = Cookies.get(cookies.update_remarketing_items);

            if (updateItems) {
                updateItemInAnalytics(JSON.parse(updateItems));
                Cookies.remove(cookies.update_remarketing_items);
            }
        },
        getCurrentCartForAnalytics          : function () {
            getCurrentCartForAnalytics();
        },
        sendRegisterEvent                   : function () {
            if (app_env == 'local')
                return ;

            sendRegisterEvent();
        },
        sendLoginEvent                      : function () {
            if (app_env == 'local')
                return ;

            sendLoginEvent();
        },
        setRegisterEventCookie              : function () {
            if (app_env == 'local')
                return ;

            Cookies.set(cookies.remarketing_register, true,{path: '/'});
        },
        setLoginEventCookie                 : function () {
            if (app_env == 'local')
                return ;

            Cookies.set(cookies.remarketing_login, true,{path: '/'});
        },
        getRegisterEventCookie              : function () {
            if (app_env == 'local')
                return ;

            if (Cookies.get(cookies.remarketing_register)) {
                sendRegisterEvent();

                Cookies.remove(cookies.remarketing_register);
            }
        },
        getLoginEventCookie                 : function () {
            if (app_env == 'local')
                return ;

            if (Cookies.get(cookies.remarketing_login)) {
                sendLoginEvent();

                Cookies.remove(cookies.remarketing_login);
            }
        },
        sendUsetoolbar                      : function () {
            if (app_env == 'local')
                return ;

            usetoolbar();
        },
        sendUsevat                          : function () {
            if (app_env == 'local')
                return ;

            usevat();
        }
    });

    function sendAddToCartRemarketingEvent (items, callback) {
        if (app_env != 'local' && items.length) {
            gtag('event', 'add_to_cart', {
                'items': items
            });

            if (typeof callback == 'function') {
                callback();
            }
        }
    }

    function sendRemoveFromCartRemarketingEvent (items, callback) {
        if (app_env != 'local' && items.length) {
            gtag('event', 'remove_from_cart', {
                'items': items
            });

            if (typeof callback == 'function') {
                callback();
            }
        }
    }

    function updateItemInAnalytics (items) {
        if ('remove' in items && 'add' in items)
            sendRemoveFromCartRemarketingEvent(items.remove, function () {
                sendAddToCartRemarketingEvent(items.add);
            })
    }

    function sendSelectContentForThisUrl (target) {
        var data = {
            '_token' : $('[name="_token"]').val(),
            'target' : target
        };

        $.ajax(
            new $.ajax_prototype(
                {
                    url     : urls.getRemarketingItems,
                    type    : 'POST',
                    data    : data,
                    success : function (data) {
                        if (data.success) {
                            if (data.data.view_item.length) {
                                gtag('event', 'select_content', {
                                    "content_type": "product",
                                    "items": data.data.view_item
                                });
                            }
                        }
                    }
                }
            )
        );
    }

    function sendCheckoutProgressEvent (items, callback) {
        if (app_env != 'local' && items.length) {
            gtag('event', 'checkout_progress', {
                'items': items
            });

            if (typeof callback == 'function') {
                callback();
            }
        }
    }

    function sendRegisterEvent (callback) {
        gtag('event', 'register', {
            'event_category'    : 'users',
            'event_action'      : 'register'
        });

        gtag('event', 'conversion', {'send_to': 'AW-858474282/8MQXCMH-mXsQqo6tmQM'});

        fbq('track', 'CompleteRegistration');

        if (typeof callback == 'function')
            callback();
    }
    
    function sendLoginEvent (callback) {
        gtag('event', 'login', {
            'event_category'    : 'users',
            'event_action'      : 'login'
        });

        if (typeof callback == 'function')
            callback();
    }

    function getCurrentCartForAnalytics (successCallback) {
        $.ajax(
            new $.ajax_prototype({
                'url'       : '/cart/analytics/items',
                'type'      : 'POST',
                'data'      : {
                    '_token' : $('[name="_token"]').val()
                },
                'success'   : function (data) {
                    if (data.success) {
                        if (typeof successCallback == 'function') {
                            successCallback(data);
                        } else {
                            sendCheckoutProgressEvent(data.data.remarketing_items);
                        }
                    }
                }
            })
        )
    }

    function usetoolbar() {
        gtag('event', 'usetoolbar', {'event_category': 'tools', 'event_action': 'click',  'event_label': 'usetoolbar'});
    }

    function usevat() {
        gtag('event', 'usevat', {'event_category': 'tools','event_action': 'click',  'event_label': 'usevat'});
    }
});