$(document).ready(function () {
    var check = '<i class="check icon-checkmark"></i>',
        unavail = '<i class="unavail icon-cross3"></i>',
        success_status = '<div class="label success align-left">' + $.translate('coupons.create.status.active') + '</div>',
        warning_status = '<div class="label warning align-left">' + $.translate('coupons.create.status.warning') + '</div>',
        accountLink = '<a href="' + $urls['userDashboard'] + '" title="##text##" target="_blank">##text##</a>',
        trigger_display = $('.trigger_display').getOuterHTML().replace(/"[0-9]+"/g, '##index##').replace(/#[0-9]+/g, '###index##'),
        constraint_display = $('.constraint_display').getOuterHTML().replace(/"[0-9]+"/g, '##index##').replace(/#[0-9]+/g, '###index##'),
        allSelectedProducts = $('#allSelectedProducts');

    $('#coupon_create_form').on('change date:updated', function (e) {
        var source = $(e.target),
            source_id = source.attr('id'),
            shift = source_id;

        if (source.is('[type="radio"]'))
            shift = source.attr('name');

        if (shift) {
            switch (shift) {
                case 'manual_code':
                case 'greek_title':
                case 'english_title':
                case 'greek_description':
                case 'english_description':
                case 'comment':
                case 'trigger_amount':
                case 'max_allowed_uses':
                case 'max_allowed_uses_per_user':
                case 'max_allowed_uses_per_item':
                    var value = source.val();

                    if (value) {
                        switch (shift) {
                            case 'trigger_amount':
                                value += $.html_encoder.decode('&euro;');
                                break;
                        }

                        $('[data-for="' + shift + '"]').text(value);
                    }

                    break;
                case 'auto-code-trigger':
                    if (source.prop('checked'))
                        $('#manual_code').val(source.val()).change();
                    break;
                case 'trigger_target_type':
                case 'trigger_target_method':
                    $('[data-for="' + shift + '"]').text(source.next('span').text());
                    break;
                case 'trigger_minimum_duration':
                case 'constraints_minimum_duration':
                    $('[data-for="' + shift + '"]').text(source.find('option:selected').text());
                    break;
                case 'trigger_start':
                case 'trigger_end':
                    var period = [],
                        trigger_start = $('#trigger_start').val(),
                        trigger_end = $('#trigger_end').val();

                    if (trigger_start)
                        period.push($.translate('coupons.create.from') + ' ' + trigger_start);

                    if (trigger_end)
                        period.push($.translate('coupons.create.from') + ' ' + trigger_end);

                    updateStatusDisplay($('#status-trigger'));

                    $('[data-for="trigger_validity_period"]').text(period.join(' - '));
                    break;
                case 'apply_min_amount_to':
                    $('.min_length_result').hide().find('[data-for]').text(0 + $.html_encoder.decode('&euro;'));
                    $('#' + $('[name="apply_min_amount_to"]:checked').attr('id') + '_result').show();
                    break;
                case 'trigger_amount_tier_1':
                case 'trigger_amount_tier_2':
                case 'trigger_amount_tier_3':
                case 'trigger_amount_tier_4':
                case 'trigger_amount_tier_5':
                case 'trigger_amount_tier_6':
                    $('[name^="trigger_amount_tier_"]').each(function () {
                        $('[data-for="' + this.name + '"]').text(((this.value) ? this.value : 0) + $.html_encoder.decode('&euro;'));
                    });
                    break;
                case 'constraints_start':
                case 'constraints_end':
                    var period = [],
                        constraints_start = $('#constraints_start').val(),
                        constraints_end = $('#constraints_end').val();

                    if (constraints_start)
                        period.push($.translate('coupons.create.from') + ' ' + constraints_start);

                    if (constraints_end)
                        period.push($.translate('coupons.create.from') + ' ' + constraints_end);

                    $('[data-for="constraint_validity_period"]').text(period.join(' - '));
                    break;
                case 'all-users-trigger':
                    $('[data-for="selectedUsers"]').translate('coupons.create.all_users');
                    $('#userFiltersContainer').hide();
                    break;
                case 'users_filter':
                    var display = [],
                        list = [],
                        selections = source.find('option:selected');

                    if (!!source.val() === false) {
                        $('[data-for="selectedUsers"]').translate('coupons.create.all_users');
                        $('#seeAllSelectedUsers').hide();
                        break;
                    }

                    for (var i = 0; i < 2; i++) {
                        if (selections[i]) {
                            var obj = $(selections[i]);

                            display.push(accountLink.replace('##userid##', obj.val()).replace(/##text##/g, obj.text()));
                        }
                    }

                    display = display.join(', ');

                    if (selections.length > 2) {
                        display += ' ...';

                        selections.each(function () {
                            var obj = $(this);

                            list.push('<li>' + accountLink.replace('##userid##', obj.val()).replace(/##text##/g, obj.text()) + '</li>');
                        });

                        $('#seeAllSelectedUsers').show();
                    } else {
                        $('#seeAllSelectedUsers').hide();
                    }


                    $('[data-for="selectedUsers"]').html(display);
                    $('#allUsersList').html(list.join(''));
                    break;
                case 'users_selection':
                    var obj = $('[name="users_selection"]:checked'),
                        userFiltersContainer = $('#userFiltersContainer');

                    $('[data-for="selectedUsers"]').translate('coupons.create.all_users');

                    if (obj.val() == 'list')
                        userFiltersContainer.hide();
                    else
                        userFiltersContainer.show().find('[data-for]').text($.html_encoder.decode('&ndash;'));
                    break;
                case 'registration_filter':
                    (function () {
                        var obj = $('[name="registration_filter"]:checked');

                        var $text;

                        if (obj.val() == 'new')
                            $text = $.translate('coupons.create.users.filters.registration.new');
                        else if (obj.val() == 'old')
                            $text = $.translate('coupons.create.users.filters.registration.old');
                        else
                            $text = $.html_encoder.decode('&ndash;');

                        $('[data-for="registration-filters"]').text($text);
                    })();
                    break;
                case 'registered_from':
                case 'registered_to':
                    (function () {
                        var display = [],
                            registered_from = $('[name="registered_from"]'),
                            registered_to   = $('[name="registered_to"]');

                        if (registered_from.val())
                            display.push($.translate('coupons.create.from') + ' ' + registered_from.val());

                        if (registered_to.val())
                            display.push($.translate('coupons.create.to') + ' ' + registered_to.val());

                        $('[data-for="registration-filters"]').text(display.join(' - '));
                    })();
                    break;
                case 'amount_from':
                case 'amount_to':
                    (function () {
                        var display = [],
                            amount_from = $('[name="amount_from"]'),
                            amount_to = $('[name="amount_to"]');

                        if (amount_from.val())
                            display.push($.translate('coupons.create.from') + ' ' + amount_from.val() + $.html_encoder.decode('&euro;'));

                        if (amount_to.val())
                            display.push($.translate('coupons.create.to') + ' ' + amount_to.val() + $.html_encoder.decode('&euro;'));

                        $('[data-for="order-filters"]').text(display.join(' - '));
                    })();
                    break;
                case 'orders_filter':
                    (function () {
                        var obj = $('[name="orders_filter"]:checked');

                        var $text;

                        if (obj.val() == 'never')
                            $text = $.translate('coupons.create.users.filters.orders.never');
                        else
                            $text = $.html_encoder.decode('&ndash;');

                        $('[data-for="order-filters"]').text($text);
                    })();
                    break;
                case 'combine_offer':
                case 'combine_coupons':
                case 'trigger_on_user_custom_price':
                    $('[data-for="' + shift + '"]').html((source.prop('checked') ? check : unavail));
                    break;
                case 'discount_type':
                    $('[data-for^="tier_"]').each(function () {
                        var obj = $(this),
                            regExp = new RegExp(/[0-9]/);

                        if (regExp.test(obj.text())) {
                            obj.text(obj.text().replace(/€|%/, (source.val() == 'fixed' ? $.html_encoder.decode('&euro;') : $.html_encoder.decode('&percnt;'))))
                        }
                    });

                    $('[data-for="' + shift + '"]').text(source.next('span').text());
                    break;
                case 'apply_to':
                    $('[data-for^="tier_"]').text($.html_encoder.decode('&ndash;'));
                    break;
                case 'amount':
                    var value = source.val();

                    $('[id^="tier_"]').val('');

                    if (value) {
                        if ($('[name="discount_type"]:checked').val() == 'fixed')
                            value += $.html_encoder.decode('&euro;');
                        else
                            value += $.html_encoder.decode('&percnt;');
                    } else
                        value = $.html_encoder.decode('&ndash;');

                    $('[data-for^="tier_"]').text(value);
                    break;
                case 'tier_1':
                case 'tier_2':
                case 'tier_3':
                case 'tier_4':
                case 'tier_5':
                case 'tier_6':
                    var value = source.val();

                    $('#amount').val('');

                    if (value) {
                        if ($('[name="discount_type"]:checked').val() == 'fixed')
                            value += $.html_encoder.decode('&euro;');
                        else
                            value += $.html_encoder.decode('&percnt;');
                    } else
                        value = $.html_encoder.decode('&ndash;');

                    $('[data-for="' + shift + '"]').text(value);
                    break;
                case 'status-trigger':
                    updateStatusDisplay(source);
                    break;
            }
        }
    });

    $('#seeAllSelectedUsers').on('click', function (e) {
        e.preventDefault();

        $('#allSelectedUsers').modal_open();
    });

    var merge = {
        submit : submitCoupon
    };

    if ('coupon_create' in $)
        $.extend($.coupon_create, merge);
    else
        $.extend({'coupon_create' : merge});

    $('#couponSubmit').on('click', function (e) {
        e.preventDefault();

        // var trigger_start = $('#trigger_start').val();
        //
        // var data = {
        //     //General
        //     'code'                          : $('#manual_code').val(),
        //     'active'                        : (($('#status-trigger').prop('checked') || !trigger_start) ? 1 : 0),
        //     'greek_title'                   : $('#greek_title').val(),
        //     'greek_description'             : $('#greek_description').val(),
        //     'english_title'                 : $('#english_title').val(),
        //     'english_description'           : $('#english_description').val(),
        //     'comment'                       : $('#comment').val(),
        //
        //     //Triggers
        //     'trigger_coupon_type'           : (($('[name="trigger_target_type"]:checked').val() == 'previous_order') ? 1 : 2),
        //     'trigger_valid_from'            : trigger_start,
        //     'trigger_valid_to'              : $('#trigger_end').val(),
        //     'trigger_min_length'            : $('#trigger_minimum_duration').val(),
        //     'trigger_amount'                : $('#trigger_amount').val(),
        //     'trigger_catalog_operator'      : $('[name="trigger_target_method"]:checked').val(),
        //     'trigger_catalog'               : [],
        //
        //     //Constraints
        //     'constraint_valid_from'         : $('#constraints_start').val(),
        //     'constraint_valid_to'           : $('#constraints_end').val(),
        //     'constraint_min_length'         : $('#constraints_minimum_duration').val(),
        //     'constraint_catalog'            : [],
        //
        //     //Users
        //     'max_use_global'                : $('#max_allowed_uses').val(),
        //     'max_use_per_user'              : $('#max_allowed_uses_per_user').val(),
        //     'max_use_per_item'              : $('#max_allowed_uses_per_item').val(),
        //
        //     'allow_on_offer'                : $('#combine_offer').prop('checked'),
        //     'allow_on_coupon'               : $('#combine_coupons').prop('checked'),
        //     'trigger_on_user_custom_price'  : $('#trigger_on_user_custom_price').prop('checked'),
        //
        //     //Finance
        //     'amount'                        : {
        //         'discount_type' : $('[name="discount_type"]:checked').val(),
        //         'tier'          : []
        //     }
        // };
        //
        // if ($('[name="apply_to"]:checked').val() == 'apply_to_all') {
        //     var amount = $('#amount').val();
        //
        //     for (var i = 0; i < 6; i++) {
        //         data.amount.tier.push(amount)
        //     }
        // } else {
        //     $('.tier_amount').each(function () {
        //         data.amount.tier.push($(this).val());
        //     });
        // }
        //
        // $('#triggers_step .product_form').each(function () {
        //     var obj = $(this),
        //         select_category = obj.find('.select_category').val(),
        //         select_product = obj.find('.select_product').val(),
        //         select_action = obj.find('.select_action').val();
        //
        //     if (!!select_category || !!select_product || !!select_action) {
        //         data.trigger_catalog.push({
        //             'category_id'   : select_category,
        //             'product_id'    : ((!!select_product) ? select_product : []),
        //             'action_id'     : ((!!select_action) ? select_action : [])
        //         })
        //     }
        //
        // });
        //
        // $('#constraints_step .product_form').each(function () {
        //     var obj = $(this),
        //         select_category = obj.find('.select_category').val(),
        //         select_product = obj.find('.select_product').val(),
        //         select_action = obj.find('.select_action').val();
        //
        //     if (!!select_category || !!select_product || !!select_action) {
        //         data.constraint_catalog.push({
        //             'category_id'   : select_category,
        //             'product_id'    : ((!!select_product) ? select_product : []),
        //             'action_id'     : ((!!select_action) ? select_action : [])
        //         })
        //     }
        //
        // });
        //
        // if ($('#all-users-trigger').prop('checked')) {
        //     data.all_users = true;
        // } else {
        //     var userFilters = $('[name="users_selection"]:checked'),
        //         value = null;
        //
        //     if (userFilters.length < 1) {
        //         data.all_users = true;
        //     } else {
        //         if (userFilters.val() == 'list') {
        //             value = $('#users_filter').val();
        //
        //             if (!! value)
        //                 data.users = value;
        //             else
        //                 data.all_users = true;
        //         } else {
        //             var filters = {},
        //                 activeFilters = $('#users_step .activate_filters:checked');
        //
        //             if (activeFilters.length < 1)
        //                 data.all_users = true;
        //             else {
        //                 activeFilters.each(function () {
        //                     var obj = $(this),
        //                         filter = null,
        //                         limits = {};
        //
        //                     if (obj.attr('name').indexOf('registration') > -1) {
        //                         filter = $('[name="registration_filter"]:checked').val();
        //
        //                         if (! filter)
        //                             return true;
        //
        //                         if (filter.toLowerCase().indexOf('between') > -1) {
        //                             var registered_from = $('[name="registered_from"]').val(),
        //                                 registered_to = $('[name="registered_to"]').val();
        //
        //                             if (!! registered_from)
        //                                 limits['from'] = registered_from;
        //
        //                             if (!! registered_to)
        //                                 limits['to'] = registered_to;
        //
        //                             if (! $.isEmptyObject(limits))
        //                                 filters[filter] = limits;
        //                         } else {
        //                             filters[filter] = true;
        //                         }
        //                     } else {
        //                         filter = $('[name="orders_filter"]:checked').val();
        //
        //                         if (! filter)
        //                             return true;
        //
        //                         if (filter.toLowerCase().indexOf('total') > -1) {
        //                             var amount_from = $('[name="amount_from"]').val(),
        //                                 amount_to = $('[name="amount_to"]').val();
        //
        //                             if (!! amount_from)
        //                                 limits['from'] = amount_from;
        //
        //                             if (!! amount_to)
        //                                 limits['to'] = amount_to;
        //
        //                             if (! $.isEmptyObject(limits))
        //                                 filters[filter] = limits;
        //                         } else {
        //                             filters[filter] = true;
        //                         }
        //                     }
        //                 });
        //
        //                 if (! $.isEmptyObject(filters))
        //                     data.filter_users = filters;
        //                 else
        //                     data.all_users = true;
        //             }
        //         }
        //     }
        //
        // }
        //
        // console.log(JSON.stringify(data));
    });

    $(document)
        .on('change', '#triggers_step .product_form', function () {
            try {
                clearTimeout(display_trigger_changes_timer);
            } catch (er) {}

            display_trigger_changes_timer = setTimeout(function () {
                displayTriggerChanges();
            }, 250);
        })
        .on('change', '#constraints_step .product_form', function () {
            try {
                clearTimeout(display_constraint_changes_timer);
            } catch (er) {}

            display_constraint_changes_timer = setTimeout(function () {
                displayConstraintChanges();
            }, 250);
        })
        .on('click', '#triggers_step .add', function (e) {
            e.preventDefault();

            try {
                clearTimeout(clone_trigger_display_timer);
            } catch (er) {}

            clone_trigger_display_timer = setTimeout(function () {
                cloneTriggerDisplay();
            }, 250);
        })
        .on('click', '#triggers_step .remove', function (e) {
            e.preventDefault();

            try {
                clearTimeout(remove_trigger_display_timer);
            } catch (er) {}

            remove_trigger_display_timer = setTimeout(function () {
                removeTriggerDisplay();
            }, 250);
        })
        .on('click', '#constraints_step .add', function (e) {
            e.preventDefault();

            try {
                clearTimeout(clone_constraint_display_timer);
            } catch (er) {}

            clone_constraint_display_timer = setTimeout(function () {
                cloneConstraintDisplay();
            }, 250);
        })
        .on('click', '#constraints_step .remove', function (e) {
            e.preventDefault();

            try {
                clearTimeout(remove_constraint_display_timer);
            } catch (er) {}

            remove_constraint_display_timer = setTimeout(function () {
                removeConstraintDisplay();
            }, 250);

        })
        .on('click', '.more-products', function (e) {
            e.preventDefault();

            var obj = $(this),
                allProducts = $('#allProducts');

            allProducts.html('');

            $('#' + obj.attr('data-target') + ' option:selected:not(:disabled)').each(function () {
                allProducts.append('<li>' + $(this).text() + '</li>');
            });

            allSelectedProducts.modal_open();
        })
        .on('change', '.select_product', function () {
            var multipleFound = false;

            $('.select_product').each(function () {
                var obj = $(this);

                if (obj.val() && obj.val().length > 1) {
                    multipleFound = true;
                    return false;
                }
            });

            if (multipleFound)
                $('#multipleProductsNotice').show();
            else
                $('#multipleProductsNotice').hide();
        });

    function updateStatusDisplay (source) {
        var status = '';

        if (source.prop('checked'))
            status = success_status;
        else {
            var trigger_start = $('#trigger_start');

            if (trigger_start.val()) {
                status = warning_status;
                $('#couponActivationDateContainer').show().find('#couponActivationDate').text(trigger_start.val());
            } else {
                status = success_status;
                $('#couponActivationDateContainer').hide();
            }
        }

        $('[data-for="' + source.attr('id') + '"]').html(status);
    }

    function cloneTriggerDisplay () {
        for (var i = ($('.trigger_display').length + 1) ; i <= $('#triggers_step .product_form').length; i++) {
            $('.trigger_display:last').after(trigger_display.replace(/##index##/g, i))
        }

        displayTriggerChanges();
    }

    function removeTriggerDisplay () {
        for (var i = $('.trigger_display').length; i > $('#triggers_step .product_form').length; i--) {
            $('.trigger_display:last').remove();
        }

        displayTriggerChanges();
    }

    function cloneConstraintDisplay () {
        for (var i = ($('.constraint_display').length + 1) ; i <= $('#constraints_step .product_form').length; i++) {
            $('.constraint_display:last').after(constraint_display.replace(/##index##/g, i))
        }

        displayConstraintChanges();
    }

    function removeConstraintDisplay () {
        for (var i = $('.constraint_display').length; i > $('#constraints_step .product_form').length; i--) {
            $('.constraint_display:last').remove();
        }

        displayConstraintChanges();
    }

    function displayTriggerChanges () {
        populateDisplay('triggers_step', 'trigger_display');
    }

    function displayConstraintChanges () {
        populateDisplay('constraints_step', 'constraint_display');
    }

    function populateDisplay (step, displays) {
        var index = 1;

        $('#' + step + ' .product_form').each(function () {

            var obj = $(this),
                display = $('.' + displays + '[data-index="' + index + '"]');

            display.find('[data-for]').each(function () {
                $(this).text($.html_encoder.decode('&ndash;'));
            });

            if (obj.find(':input').serialize()) {
                obj.find('input:checked').each(function () {
                    var input = $(this);
                    display.find('[data-for="' + input.attr('name').replace(/_[0-9]+$/,'') + '"]').text(input.closest('label').text().trim());
                });

                obj.find('select').each(function () {
                    var select = $(this),
                        text = [];

                    select.find('option:selected:not(:disabled)').each(function () {
                        var obj = $(this);

                        if (text.join(', ').length < 50)
                            text.push(obj.text().trim());
                    });

                    text = text.join(', ');

                    if (select.attr('multiple')) {
                        if (select.hasClass('select_product')) {
                            if (text.length > 50) {
                                text = text.slice(0, 50) + '...';
                                display.find('.more-products-container').show().find('.more-products').attr('data-target', select.attr('id'));
                            } else {
                                display.find('.more-products-container').hide();
                            }
                        }
                    }

                    if (text)
                        display.find('[data-for="' + select.attr('id').replace(/_[0-9]+$/,'') + '"]').text(text);
                    else
                        display.find('[data-for="' + select.attr('id').replace(/_[0-9]+$/,'') + '"]').text($.html_encoder.decode('&ndash;'));
                });

                display.show();
                index++;
            } else {
                display.hide();
            }
        })
    }
    
    function submitCoupon (form) {
        return (function () {
            var data = {},
                trigger_start = $('#trigger_start').val();

            serializeGeneral();
            serializeTriggers();
            serializeConstraints();
            serializeUsers();
            serializeFinances();

            function serializeGeneral () {
                var tmp = {
                    'code'                          : $('#manual_code').val(),
                    'active'                        : ($('#status-trigger').prop('checked') || !trigger_start),
                    'greek_title'                   : $('#greek_title').val(),
                    'greek_description'             : $('#greek_description').val(),
                    'english_title'                 : $('#english_title').val(),
                    'english_description'           : $('#english_description').val(),
                    'comment'                       : $('#comment').val()
                };

                $.extend(data,tmp);
            }

            function serializeTriggers () {
                var trigger_amount = $('#trigger_amount').val(),
                    tmp = {
                    'trigger_coupon_type'           : (($('[name="trigger_target_type"]:checked').val() == 'previous_order') ? 1 : 2),
                    'trigger_valid_from'            : trigger_start,
                    'trigger_valid_to'              : $('#trigger_end').val(),
                    'trigger_min_length'            : $('#trigger_minimum_duration').val(),
                    'trigger_amount'                : {
                        'tier' : {}
                    },
                    'trigger_catalog_operator'      : (($('[name="trigger_target_method"]:checked').val() == 'and') ? 1 : 2),
                    'trigger_catalog'               : []
                };

                $.extend(data,tmp);

                $('#triggers_step .product_form').each(function () {
                    var obj = $(this),
                        select_category = obj.find('.select_category').val(),
                        select_product = obj.find('.select_product').val(),
                        select_action = obj.find('.select_action').val();

                    if (!!select_category || !!select_product || !!select_action) {
                        data.trigger_catalog.push({
                            'category_id'   : select_category,
                            'product_id'    : ((!!select_product) ? select_product : []),
                            'action_id'     : ((!!select_action) ? select_action : [])
                        })
                    }
                });

                if ($('[name="apply_min_amount_to"]:checked').val() == 'all') {
                    for (var i = 0; i < 6; i++) {
                        data.trigger_amount.tier[i] = trigger_amount;
                    }
                } else {
                    $('[name^="trigger_amount_tier_"]').each(function (index) {
                        data.trigger_amount.tier[index] = this.value;
                    });
                }
            }

            function serializeConstraints () {
                var tmp = {
                    'constraint_valid_from'         : $('#constraints_start').val(),
                    'constraint_valid_to'           : $('#constraints_end').val(),
                    'constraint_min_length'         : $('#constraints_minimum_duration').val(),
                    'constraint_catalog'            : []
                };

                $.extend(data,tmp);

                $('#constraints_step .product_form').each(function () {
                    var obj = $(this),
                        select_category = obj.find('.select_category').val(),
                        select_product = obj.find('.select_product').val(),
                        select_action = obj.find('.select_action').val();

                    if (!!select_category || !!select_product || !!select_action) {
                        data.constraint_catalog.push({
                            'category_id'   : select_category,
                            'product_id'    : ((!!select_product) ? select_product : []),
                            'action_id'     : ((!!select_action) ? select_action : [])
                        })
                    }

                });
            }

            function serializeUsers () {
                var tmp = {
                    'max_use_global'                : $('#max_allowed_uses').val(),
                    'max_use_per_user'              : $('#max_allowed_uses_per_user').val(),
                    'max_use_per_item'              : $('#max_allowed_uses_per_item').val(),
                    'allow_on_offer'                : $('#combine_offer').prop('checked'),
                    'allow_on_coupon'               : $('#combine_coupons').prop('checked'),
                    'trigger_on_user_custom_price'  : $('#trigger_on_user_custom_price').prop('checked')
                };

                $.extend(data,tmp);

                if ($('#all-users-trigger').prop('checked')) {
                    data.all_users = true;
                } else {
                    var userFilters = $('[name="users_selection"]:checked'),
                        value = null;

                    if (userFilters.length < 1) {
                        data.all_users = true;
                    } else {
                        data.all_users = false;

                        if (userFilters.val() == 'list') {
                            value = $('#users_filter').val();

                            if (!! value)
                                data.users = value;
                            else
                                data.all_users = true;
                        } else {
                            var filters = {},
                                activeFilters = $('#users_step .activate_filters:checked');

                            if (activeFilters.length < 1)
                                data.all_users = true;
                            else {
                                activeFilters.each(function () {
                                    var obj = $(this),
                                        filter = null,
                                        limits = {};

                                    if (obj.attr('name').indexOf('registration') > -1) {
                                        filter = $('[name="registration_filter"]:checked').val();

                                        if (! filter)
                                            return true;

                                        if (filter.toLowerCase().indexOf('between') > -1) {
                                            var registered_from = $('[name="registered_from"]').val(),
                                                registered_to = $('[name="registered_to"]').val();

                                            if (!! registered_from)
                                                limits['from'] = registered_from;

                                            if (!! registered_to)
                                                limits['to'] = registered_to;

                                            if (! $.isEmptyObject(limits))
                                                filters[filter] = limits;
                                        } else {
                                            filters[filter] = true;
                                        }
                                    } else {
                                        filter = $('[name="orders_filter"]:checked').val();

                                        if (! filter)
                                            return true;

                                        if (filter.toLowerCase().indexOf('total') > -1) {
                                            var amount_from = $('[name="amount_from"]').val(),
                                                amount_to = $('[name="amount_to"]').val();

                                            if (!! amount_from)
                                                limits['from'] = amount_from;

                                            if (!! amount_to)
                                                limits['to'] = amount_to;

                                            if (! $.isEmptyObject(limits))
                                                filters[filter] = limits;
                                        } else {
                                            filters[filter] = true;
                                        }
                                    }
                                });

                                if (! $.isEmptyObject(filters))
                                    data.filter_users = filters;
                                else
                                    data.all_users = true;
                            }
                        }
                    }

                }
            }

            function serializeFinances () {
                var tmp = {
                    'amount'                        : {
                        'discount_type' : $('[name="discount_type"]:checked').val(),
                        'tier'          : []
                    }
                };

                $.extend(data,tmp);

                if ($('[name="apply_to"]:checked').val() == 'apply_to_all') {
                    var amount = $('#amount').val();

                    for (var i = 0; i < 6; i++) {
                        data.amount.tier.push(amount)
                    }
                } else {
                    $('.tier_amount').each(function () {
                        data.amount.tier.push($(this).val());
                    });
                }
            }

            console.log(data);

            $.ajax(
                new $.ajax_prototype({
                    'type'      : 'POST',
                    'data'      : data,
                    'success'   : function (data) {
                        console.log(data);
                    }
                }, form.attr('id'))
            );
        })()
    }
});

$(window).on('load', function () {
    $('#trigger_start, #trigger_end, #constraints_start, #constraints_end').each(function () {
        var obj = $(this);

        if (obj.val())
            obj.trigger('change');
    });
});