$(document).ready(function () {

    var event_handler = $('#event_handler'),
        auth_key = event_handler.attr('data-channel');

    //var pusher = new Pusher(event_handler.attr('data-pusher-key'),{ authEndpoint: event_handler.attr('data-auth-point') });
    var pusher = new Pusher(event_handler.attr('data-pusher-key'), {
        authTransport: 'buffered',
        authEndpoint: location.origin + event_handler.attr('data-auth-point'),
        authDelay: 200,
        cluster: event_handler.attr('data-cluster')
    });

    channel = {
        cart            : pusher.subscribe('private-cart-' + auth_key),
        billing         : pusher.subscribe('private-billing-'  + auth_key),
        contacts        : pusher.subscribe('private-contacts-'  + auth_key),
        domain          : pusher.subscribe('private-domain-'  + auth_key),
        account         : pusher.subscribe('private-account-'  + auth_key),
        ssl             : pusher.subscribe('private-ssl-' + auth_key),
        newsletter      : pusher.subscribe('private-newsletter-' + auth_key),
        notifications   : {
            personal    :  pusher.subscribe('private-notifications-' + auth_key),
            global      :  pusher.subscribe('global-notifications'),
        },
        promotions      : {
            global : pusher.subscribe('global-promotions')
        }
    };

    channel.cart.bind('App\\Events\\Cart\\CartItemWasCreated', function(data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        if('cart_item' in data.msg) {
            cartItems = data.msg['cart_item'];
            if ($.isArray(cartItems)) {
                $.each(cartItems, function (index, value) {
                    $.cart.insert(value.id, value.name, value.sub_name, value.billing.price.total);
                });
            } else {
                if (data.msg['domain_register'])
                    $('[data-fqdn="' + cartItems.name + '"]').attr('data-cart-item-id', cartItems.id).find('.cart-button, .singleButtonTarget').addClass('selected');

                $sub_name = cartItems.sub_name;

                if('sub_name_small' in cartItems)
                    $sub_name = cartItems.sub_name_small;

                $.cart.insert(cartItems.id, cartItems.name, $sub_name, cartItems.billing.price.total);
            }
        }

        $.cart.sideCart.checkVisibility();
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemsWereCreated', function(data) {
        if(data.msg.unique_id == unique_page_identifier)
            return ;

        $.each(data.msg.cart_items, function (index, value) {
            $.cart.insert(value.id, value.name, value.sub_name, value.billing.price.total);
        });

        $.cart.sideCart.checkVisibility();
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasDeleted', function(data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        $.cart.remove(data.msg.cart_item_id);

        if(data.msg.fqdn){
            $('[data-fqdn="' + data.msg.fqdn + '"]').attr('data-cart-item-id', '').find('.selected').removeClass('selected');
        }

        if(data.msg.children_items){
            for (i in data.msg.children_items) {
                $.cart.remove(data.msg.children_items[i]);
            }
        }

        $.cart.sideCart.checkVisibility();
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemWasUpdated', function(data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        updates = data.msg.updates;

        $.each(updates, function (key, info) {
            $.cart.update(info.id, {name:info.name, desc:info.sub_name, price:info.billing.price.total});
        })

        $.cart.sideCart.checkVisibility();
    });

    channel.cart.bind('App\\Events\\Cart\\CartItemNotFound', function(data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        data = data.msg;

        if(typeof data.not_found == 'string'){
            $.cart.remove(data.not_found);
        }else if(typeof data.not_found == 'object') {

        }

        var item = $('.item[data-cart-item-id="' + data.not_found + '"]'),
            domain = $('.tldResults[data-cart-item-id="' + data.not_found + '"], .singleResult[data-cart-item-id="' + data.not_found + '"]');

        if(item.length)
            item.remove();

        if(domain.length)
            domain.find('.cart-button, .singleButtonTarget').removeClass('selected');
    });

    channel.cart.bind('App\\Events\\Cart\\ItemAlreadyInCart', function(data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        data = data.msg;

        var cart_item = data.cart_item,
            item = $('li[data-cart-item-id="' + cart_item.id + '"]'),
            domain = $('[data-fqdn="' + cart_item.name + '"]');

        if(item.length < 1)
            $.cart.insert(cart_item.id, cart_item.name, cart_item.sub_name, cart_item.billing.price.total);

        if(domain.length)
            domain.attr('data-cart-item-id', cart_item.id).find('.cart-button, .singleButtonTarget').addClass('selected');
    });

    channel.notifications.personal.bind('App\\Events\\Notifications\\PersonalNotificationWasCreated', function (data) {
        handle_notifications_create_events(data);
    });

    channel.notifications.global.bind('App\\Events\\Notifications\\GlobalNotificationWasCreated', function (data) {
        handle_notifications_create_events(data);
    });

    channel.notifications.personal.bind('App\\Events\\Notifications\\NotificationWasDeleted', function (data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }


        if (data.msg.notification_id == 'all') {
            $('#notice_cont').empty();
            $('#flashNoticeCont').empty().hide();
            $.notice.dec();
        } else {
            var notice = $('[data-notification-id="' + data.msg.notification_id + '"]');

            if(notice.length < 1)
                return ;

            var list = notice.closest('ul');

            notice.remove();

            if(list.hasClass('notification-list')){
                $.notice.dec();
            }else if(list.find('li').length < 1) {
                list.hide();
            }
        }
    });

    channel.account.bind('App\\Events\\Account\\EmailVerified', function (data) {
        if('notification' in data.msg)
            $.alertHandler('', data.msg.notification.display, alert_box_success);

        var $email_cont = $('#email_item');

        if($email_cont.length){
            $email_cont.find('.secondary-wrapper').hide();
            $email_cont.find('.verified_pressent').hide();
            $email_cont.find('.edit_btn').closest('div').show();

            $('.content_static span[data-about="email"]').set_text(data.msg.saved.display);

            $email_cont.find('.saved').set_text(data.msg.saved.display);
            $email_cont.find('.warning.label').set_text(COMMON_LANG.LABEL.VERIFIED).removeClass('warning').addClass('success');
        }
    });

    channel.promotions.global.bind('App\\Events\\Promotions\\PromotionAutoRenew', function (data) {
        if (typeof countDowns != 'undefined') {
            var promotion_name = (data.msg.name).toString().match(/[0-9]+/g)[0];

            console.log(countDowns[promotion_name], data.msg.soft_end.date, new Date());

            // countDowns[promotion_name] = data.msg.soft_end.date;

            var date                = (data.msg.soft_end.date).toString().replace(/\.[0-9]+/,'').match(/[0-9]+/g),
                new_expiration_date = new Date(Date.UTC(date[0],date[1],date[2],date[3],date[4],date[5]));

            if (typeof countDownShowHandler == 'function') {
                countDownShowHandler(promotion_name, data.msg.soft_end.date);
            }
        }
    });

    channel.promotions.global.bind('App\\Events\\Promotions\\PromotionAutoRemove', function (data) {
        if (typeof countDowns != 'undefined') {
            var promotion_name = (data.msg.name).toString().match(/[0-9]+/g)[0];

            delete countDowns[promotion_name];

            if (typeof countDownHideHandler == 'function') {
                countDownHideHandler(promotion_name);
            }
        }
    });

    channel.billing.bind('App\\Events\\Billing\\DefaultProfileWasUpdated', function (data) {
        if (window.location.href.toString().indexOf('cart') > -1)
            return ;

        $.ajax(
            new $.ajax_prototype({
                'type'      : 'POST',
                'url'       : $reloadVatWidgetUrl,
                'success'   : function (data) {
                    if (data.success) {
                        var billingProfile = data.data.billingProfile,
                            checkedSetting = $('#toolbox-vat [name="Vat"]:checked');

                        if (billingProfile.vat_waived) {
                            $('#vatNotice').hide();
                            $('#vatWaivedNotice').show();
                            $('[name="Vat"]').attr('checked',false).prop('checked', false);


                            /**
                            * Change radio to no vat while keeping notification visible
                            * */
                            if (checkedSetting.val() !== 'no-Vat') {
                                $keepVatNoticesVisible = true;
                                $('#no_Vat').click();
                            }

                            $('#no_Vat').prop('checked', true);

                            $('#no_Vat').disabled(true);
                            $('#with_Vat').disabled(true);

                            $('#toolbox-vat .billing-profile-vat').slideDown();
                        } else {
                            $('#vatNotice').show();
                            $('#vatWaivedNotice').hide();

                            $('#no_Vat').disabled(false);
                            $('#with_Vat').disabled(false);

                            if (checkedSetting.val() === 'no-Vat')
                                $('#toolbox-vat .billing-profile-vat').slideUp();
                            else
                                $('#toolbox-vat .billing-profile-vat').slideDown();
                        }

                        $('.vatNoticeRate').text(billingProfile.rate);
                        $('.vatNoticeCountry').text(billingProfile.country);
                        $('.vatNoticeProfileName').text(((billingProfile.type == 'inv') ? billingProfile.name : $.translate('billing.type.rec')));

                        var profileLink = $('#toolbox-vat .billing-profile-vat a');

                        profileLink.attr('href', profileLink.attr('href').replace(/[0-9]+$/, billingProfile.id));

                        vat.country = data.data.country;
                        vat.quote = data.data.quote;

                        $(document).trigger('vat:changed');
                    }
                }
            })
        );
    });

    channel.notifications.personal.bind('App\\Events\\GDPR\\ArchiveReady', function (data) {
        console.log('ArchiveReady');
        $.alertHandler('',$.translate('gdpr.archive_ready'), alert_box_success);

        $('#archivedInfoBtn').translate('gdpr.archive_buttons.step_2').show();
        // $('#archivedInfoBtn').show();
        $('#downloadWarning').hide();
    });

    /*channel.Account.bind('App\\Events\\User\\UserSignedOut', function (data) {
        location.reload(true);
    });*/

    function handle_notifications_create_events (data) {
        if (data.msg.display_on_screen) {
            $('#flashNoticeCont').show().notice_insert(data);
        }else{
            $('#notice_cont').notice_insert(data);
        }
    }
});