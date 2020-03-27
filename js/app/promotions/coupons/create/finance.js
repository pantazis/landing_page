$(document).ready(function () {
    var discountAmountContainer = $('#discountAmountContainer'),
        discountTiersContainer = $('#discountTiersContainer'),
        triggerAmountNotice = $('#triggerAmountNotice');

    $('[name="apply_to"]')
        .on('change', function () {
            if ($(this).val() == 'apply_to_all') {
                discountAmountContainer.show().find('input').val('').attr('data-override-visibility', true);
                discountTiersContainer.hide().find('input').removeAttr('data-override-visibility');
            } else {
                discountAmountContainer.hide().find('input').removeAttr('data-override-visibility');
                discountTiersContainer.show().find('input').val('').attr('data-override-visibility', true);
            }
        })
        .one('change', function () {
            $('#discountTypeContainer').show();
        });

    $('[name="discount_type"]').on('change', function () {
        if ($(this).val() == 'fixed')
            discountAmountContainer.find('.inline').translate('misc.amount');
        else
            discountAmountContainer.find('.inline').translate('misc.percentage');
    });

    $('#amount, #tier_1, #tier_2, #tier_3, #tier_4, #tier_5, #tier_6').on('change', function () {
        var obj = $(this);

        if (parseInt(obj.val()) <= 0)
            obj.val(0.01);
    });

    $(document)
        .on('change', '[name="apply_min_amount_to"]', function () {
            triggerAmountNotice.hide();
        })
        .on('change', '#trigger_amount', function () {
            var obj = $(this);

            if (obj.val() > 0)
                triggerAmountNotice.show().find('span').text(obj.val() + $.html_encoder.decode('&euro;'));
            else
                triggerAmountNotice.hide();
        })
        .on('change', '[name^="trigger_amount_tier_"]', function () {
            var limits = [];

            $('[name^="trigger_amount_tier_"]').each(function () {
                if (this.value)
                    limits.push(this.value);
            });

            if (limits.length < 1)
                triggerAmountNotice.hide();
            else {
                limits = $.unique(limits);

                if (limits.length == 1)
                    triggerAmountNotice.show().find('span').text(limits[0] + $.html_encoder.decode('&euro;'));
                else
                    triggerAmountNotice.show().find('span').text(Math.min.apply(null, limits) + $.html_encoder.decode('&euro;') + $.html_encoder.decode('&dash;') + Math.max.apply(null, limits) + $.html_encoder.decode('&euro;'));

            }
        });
});