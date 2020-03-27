$(document).ready(function () {
    $('.step-button').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        $('.step').hide();
        $('#' + obj.attr('data-target')).show();

        obj.addClass('active');

        activatePrevious(obj.prev());
        deActivateNext(obj.next());
    });

    $('#trigger_start').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'before' : '#trigger_end',
        'mirror' : {
            'to' : '#constraints_start'
        }
    });

    $('#trigger_end').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'after' : '#trigger_start',
        'mirror' : {
            'to' : '#constraints_end'
        }
    });

    $('#constraints_start').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'before' : '#constraints_end'
    });

    $('#constraints_end').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'after' : '#constraints_start'
    });

    $('#registered_from').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'before' : '#registered_to'
    });

    $('#registered_to').my_dateTimePicker({
        date        : new Date(),
        with_time   : true,
        buttons     : [
            {
                classes     : 'today-button',
                text        : 'Today',
                callback    : 'today'
            },
            {
                classes     : 'now-button',
                text        : 'Now',
                callback    : 'now'
            }
        ],
        'after' : '#registered_from'
    });

    $('.step-buttons .button:not(#couponSubmit):not(.secondary)').on('click', function (e) {
        e.preventDefault();

        $('.step-button.active').next('.step-button').click();

        scrollToStep();
    });

    $('.step-buttons .button.secondary').on('click', function (e) {
        e.preventDefault();

        $('.step-button.active').prev('.step-button').click();

        scrollToStep();
    });

    $(document)
        .on('change', '[name*="category_prompt"]', function () {
            var obj = $(this),
                product_form = obj.closest('.product_form'),
                category_container = product_form.find('.category_container'),
                action_prompt = product_form.find('.action_prompt');

            product_form.find('.select_category').chosen_update('');
            clearProductListing(product_form);

            if (obj.val() == 'specify') {
                category_container.show();
            } else {
                category_container.hide();
            }

            action_prompt.hide().find('[type="radio"]').prop('checked', false);

            var action = product_form.find('.action_container').hide().find('.select_action');
            action.find('option:not(.permanent)').remove();
            action.chosen_update('');
        })
        .on('change', '.select_category', function () {
            var obj = $(this),
                product_form = obj.closest('.product_form'),
                product_prompt = product_form.find('.product_prompt'),
                product_container = product_form.find('.product_container'),
                select_product = product_container.find('.select_product'),
                action_prompt = product_form.find('.action_prompt');

            if (obj.val() != 'currently_active') {
                product_prompt.show().find('[type="radio"]').prop('checked', false);
                clearActionListing(product_form);

                select_product.find('option:not(.permanent)').remove();

                if (!!obj.val()) {
                    $.each(triggers.product_categories[obj.val()].products, function (key, value) {
                        select_product.append('<option value="' + value.id + '">' + value.name + '</option>');
                    });
                    select_product.chosen_update('');
                }
            } else {
                clearProductListing(product_form);
                action_prompt.show().find('[type="radio"]').prop('checked', false);
            }

            product_container.hide();
        })
        .on('change', '[name*="product_prompt"]', function () {
            var obj = $(this),
                product_form = obj.closest('.product_form'),
                product_container = product_form.find('.product_container');

            if (obj.val() == 'specify') {
                product_container.show();

                product_form.find('.select_action, .action_prompt').hide();
            } else {
                loadActionListBasedOnCategory(obj);
                product_container.hide().find('select').chosen_update('');
            }
        })
        .on('change', '.select_product', function () {
            loadActionListBasedOnCategory($(this));
        })
        .on('change', '[name*="action_prompt"]', function () {
            var obj = $(this),
                product_form = obj.closest('.product_form'),
                action_container = product_form.find('.action_container');

            if (obj.val() == 'specify') {
                action_container.show().find('select').chosen_update('');
            } else {
                action_container.hide();
            }
        });

    $('#coupon_create_form').prepare_form_advanced({
        outer_handlers : '#couponSubmit',
        disable : '#couponSubmit',
        version_exception : true,
        onSuccess: function (form) {
            $('#couponSubmit').removeClass('disabled');

            return $.coupon_create.submit(form)
        }
    }).off('onError').on('onError', function () {
        var form = $(this);

        form.handle_errors();

        $('[data-target="' + form.find('.error:first').closest('.step').attr('id') + '"]').click();

        form.find_errors(1000);
    });



    var merge = {
        copyProductForm : copyProductForm,
        removeProductForm : removeProductForm
    };

    if ('coupon_create' in $)
        $.extend($.coupon_create, merge);
    else
        $.extend({'coupon_create' : merge});

    function clearProductListing (product_form) {
        var product_prompt = product_form.find('.product_prompt'),
            product_container = product_form.find('.product_container');

        product_prompt.hide().find('[type="radio"]').prop('checked', false);

        product_container.hide();
    }

    function loadActionListBasedOnCategory (obj) {
        var product_form = obj.closest('.product_form'),
            select_category = product_form.find('.select_category'),
            category = select_category.find('option:selected').text().trim().toLowerCase().replace(/\s/g,'_'),
            select_action = product_form.find('.select_action');

        if (category in category_actions) {
            product_form.find('.action_prompt').show();

            select_action.find('option:not(.permanent)').remove();

            for (var i in category_actions[category]) {
                if (category_actions[category].hasOwnProperty(i)) {
                    select_action.append('<option value="' + triggers.product_actions[category_actions[category][i]]['id'] + '">' + triggers.product_actions[category_actions[category][i]]['name'] + '</option>');
                }
            }

            select_action.chosen_update('');
        }
    }

    function clearActionListing (product_form) {
        var action_prompt = product_form.find('.action_prompt'),
            action_container = product_form.find('.action_container');

        action_prompt.hide().find('[type="radio"]').prop('checked', false);

        action_container.hide();
    }



    function copyProductForm (container, template) {
        container.find('.product_form:last').after(template.replace(/##enum##/g, container.find('.product_form').length + 1));
        container.find('.product_form .remove').show();

        container.find('.product_form:last select').apply_chosen('');

        $('#triggerCombinationMethod').show();
    }

    function removeProductForm (obj) {
        var container = obj.closest('.product_form'),
            fieldset = container.closest('fieldset'),
            next = container.next('.product_form');

        if (next.length)
            container = moveNextToPrevious(next);

        container.remove();

        var removes = fieldset.find('.product_form .remove');

        if (removes.length == 1) {
            removes.hide();
            $('#triggerCombinationMethod').hide();
        }
    }

    function moveNextToPrevious (current){
        var form = [];

        current.find('[name^="trigger_category_prompt"]:checked');
        current.find('[name^="trigger_product_prompt"]:checked');
        current.find('[name^="trigger_action_prompt"]:checked');
        current.find('input:not(.chosen-container input), select').each(function () {
            var obj = $(this),
                target = $('#' + obj.attr('id').replace(/[0-9]+$/, function (num) {
                    return parseInt(num) - 1
                }));

            if (obj.is('input')) {
                if (obj.prop('checked'))
                    target.click();
            } else {
                var val = obj.val();

                if (val)
                    target.chosen_update(val).change();
            }
        });

        var next = current.next('.product_form');

        if (next.length)
            return moveNextToPrevious(next);

        return current;
    }

    function activatePrevious (obj) {
        if (obj.length < 1)
            return ;

        obj.addClass('active');

        activatePrevious(obj.prev());
    }

    function deActivateNext(obj) {
        if (obj.length < 1)
            return ;

        obj.removeClass('active');

        deActivateNext(obj.next());
    }

    function scrollToStep () {
        $(window).scrollTop($('.step:visible').offset().top);
    }

});

$(window).on('load', function () {
    $('#trigger_minimum_duration, #constraints_minimum_duration, .select_category, .select_product, .select_action, #users_filter').each(function () {
        var obj = $(this);

        obj.apply_chosen(obj.val());
    });
});