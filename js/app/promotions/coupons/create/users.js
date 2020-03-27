$(document).ready(function () {
    var usersFilter                     = $('#users_filter'),
        selectFilterMethod              = $('#selectFilterMethod'),
        filterUsers                     = $('#filterUsers'),
        availableFiltersContainer       = $('#availableFiltersContainer'),
        getUsersBetweenContainer        = $('#getUsersBetweenContainer'),
        getUsersWithSpentTotalContainer = $('#getUsersWithSpentTotalContainer'),
        registrationFiltersContainer    = $('#registrationFiltersContainer'),
        ordersFiltersContainer          = $('#ordersFiltersContainer'),
        amount_from     = $('#amount_from'),
        amount_to       = $('#amount_to'),
        applyChosen     = true;

    $('#all-users-trigger')
        .on('change', function () {
            if ($(this).prop('checked')) {
                selectFilterMethod.hide().find('input').prop('checked', false);
                filterUsers.hide();
                availableFiltersContainer.hide();
                getUsersBetweenContainer.hide();
                getUsersWithSpentTotalContainer.hide();
                registrationFiltersContainer.hide();
                ordersFiltersContainer.hide();
            } else {
                selectFilterMethod.show();
            }
        });

    $('[name="users_selection"]').on('change', function () {
        var obj = $(this);

        if (obj.val() == 'list') {
            filterUsers.show();
            availableFiltersContainer.hide().find('input').prop('checked', false).trigger('change');

            if (applyChosen) {
                usersFilter.apply_chosen({search_contains: true});

                applyChosen = false;
            }
        } else {
            filterUsers.hide();

            if (applyChosen === false)
                usersFilter.chosen_update('');

            availableFiltersContainer.show().find('input').prop('checked', false).trigger('change');
        }
    });

    $('.activate_filters').on('change', function () {
        var obj = $(this),
            target = $(obj.attr('data-target'));

        if (obj.prop('checked')) {
            target.show();
        } else {
            target.hide();
        }

        target.find('[type="radio"]').prop('checked', false).trigger('change');
    });

    $('[name="registration_filter"]').on('change', function () {
        var  value = $('[name="registration_filter"]:checked').val();

        if (!!value && value.toString().toLowerCase().indexOf('between') > -1) {
            getUsersBetweenContainer.show();
        } else {
            getUsersBetweenContainer.hide().find('input').val('').trigger('change');
        }
    });

    $('[name="orders_filter"]').on('change', function () {
        var  value = $('[name="orders_filter"]:checked').val();

        if (!!value && value.toString().toLowerCase().indexOf('total') > -1) {
            getUsersWithSpentTotalContainer.show();
        } else {
            getUsersWithSpentTotalContainer.hide().find('input').val('').trigger('change');
        }
    });

    $('#max_allowed_uses, #max_allowed_uses_per_user, #max_allowed_uses_per_item').on('change', function () {
        var obj = $(this);

        if (parseInt(obj.val()) < 1)
            obj.val(1).change();
    });

    usersFilter.on('change', function () {
        try {
            clearTimeout(usersFilterTimer);
        } catch (er) {}

        usersFilterTimer = setTimeout(function () {
            $('#users_filter_chosen').find('.chosen-choices span').each(function () {
                var obj = $(this);

                obj.text(obj.text().match(/[0-9]+/)[0])
            });
        }, 25)
    });

    amount_from.on('change', function () {
        var obj     = $(this),
            value   = parseFloat(obj.val()),
            upto    = parseFloat(amount_to.val());

        //If value larger than top limit then assign top limit as value
        if (upto && upto < value) {
            obj.val(upto).trigger('change');
        }
    });

    amount_to.on('change', function () {
        var obj     = $(this),
            value   = parseFloat(obj.val()),
            from    = parseFloat(amount_from.val());

        //If value smaller than bottom limit then assign bottom limit as value
        if (from && from > value) {
            obj.val(from).trigger('change');
        }
    });
});

$(window).on('load', function () {
    setTimeout(function () {
        $('#users_filter').trigger('change');
    }, 200);
});