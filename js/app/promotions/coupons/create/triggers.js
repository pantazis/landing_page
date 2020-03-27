$(document).ready(function () {
    var step = $('#triggers_step'),
        triggerTemp = $('#triggers_step .product_form').getOuterHTML().replace(/_[0-9]+/g, '_##enum##').replace(/#[0-9]+/,'###enum##');

    $(document)
        .on('click', '#triggers_step .product_form .add', function (e) {
            e.preventDefault();

            $(this).blur();
            $.coupon_create.copyProductForm(step, triggerTemp);
        })
        .on('click', '#triggers_step .product_form .remove', function (e) {
            e.preventDefault();

            $.coupon_create.removeProductForm($(this).blur());
        });

    $('[name="trigger_target_type"]').on('change', function () {
        var execute = {};

        if ($('[name="trigger_target_type"]:checked').val() == 'previous_order') {
            if ($('#trigger_start').my_dateTimePicker('has-mirror'))
                execute.trigger_start = 'constraints_start';

            if ($('#trigger_end').my_dateTimePicker('has-mirror'))
                execute.trigger_end = 'constraints_end';
        } else {
            if (! $('#trigger_start').my_dateTimePicker('has-mirror'))
                execute.trigger_start = 'constraints_start';

            if (! $('#trigger_end').my_dateTimePicker('has-mirror'))
                execute.trigger_end = 'constraints_end';
        }

        if (! $.isEmptyObject(execute)) {
            for (var i in execute) {
                if (execute.hasOwnProperty(i)) {
                    $('#' + i).my_dateTimePicker('mirror', {
                        'to': '#' + execute[i]
                    });
                }
            }
        }
    });

    $('[name="apply_min_amount_to"]').on('change', function () {
        $('.min_amount_input_containers').hide().find('input').val('');

        $('#' + this.id + '_container').show();

        if (this.value == 'each_tier') {
            minTierAmountIsRequired();
        } else {
            var tierAmounts = $('[name^="trigger_amount_tier_"]');

            $(document).off('change', tierAmounts.selector, setMinAmountValidation);

            tierAmounts.attr('data-validate', tierAmounts.attr('data-validate').replace('required', '').trim());
            tierAmounts.removeAttr('data-override-visibility');
        }
    });

    function minTierAmountIsRequired () {
        var tierAmounts = $('[name^="trigger_amount_tier_"]');

        $(document).on('change', tierAmounts.selector, {}, setMinAmountValidation);
    }

    function setMinAmountValidation () {
        var tierAmounts = $('[name^="trigger_amount_tier_"]');

        try {
            clearTimeout(triggerAmountTimer);
        } catch (e) {}

        triggerAmountTimer = setTimeout(function () {
            var count = tierAmounts.filter(function () {
                return !!this.value;
            }).length;

            if (count > 0) {
                tierAmounts.attr_app('data-validate', ' required').attr('data-override-visibility', true);
            } else {
                tierAmounts.attr('data-validate', tierAmounts.attr('data-validate').replace('required', '').trim());
                tierAmounts.removeAttr('data-override-visibility');
            }
        }, 250);
    }
});