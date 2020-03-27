$(document).ready(function(){
    var getter_quote = 0;

    if (!vat['show'])
        getter_quote = 1;
    else
        getter_quote = vat['quote'];

    $(document).on('vat:changed', function () {
        if (!vat['show'])
            getter_quote = 1;
        else
            getter_quote = vat['quote'];

        priceGetter();
    });

    //priceGetter();
    $('#siteAmountForm,#hostingLengthForm').on('change', function () {
        priceGetter();
    });

    $('[name="plan"]').on('change', function () {
        var obj = $(this);

        $('.specs-wrapper').hide();
        obj.closest('li').find('.specs-wrapper').show();

        var amount = obj.attr('data-amount') + 'site';

        $('.unit_price_container.with-discount').removeClass('with-discount');

        var discountFound = false,
            containers = $('.unit_price_container');

        containers.each(function () {
            var obj     = $(this),
                price   = costsTables[obj.attr('data-src')][amount];

            if (price.constructor == Object) {
                discountFound = true;

                var strikethrough = obj.find('.strikethrough');

                if (strikethrough.length < 1) {
                    obj.prepend('<s class="strikethrough"><span class="vat" data-price="0">0</span> €</s>');
                }

                obj.find('.strikethrough .vat').update_vat('price', [price.base], 0);
                obj.find('.vat:not(.strikethrough .vat)').update_vat('price-total', [price.total], 0);
            } else {
                obj.find('.strikethrough').remove();
                obj.find('.vat').update_vat('price-total', [price], 0);
            }
        });

        if (discountFound)
            containers.addClass('with-discount');

    });

    function priceGetter() {
        var amount = $('input[name="plan"]:checked').data('amount'),
            length = $('input[name="length"]:checked').attr('data-length');

        if(!amount || !length)
            return ;

        var cost    = costsTables[length + 'month'][amount + 'site'],
            price   = ((cost.constructor == Object) ? cost.total : cost) * length;

        $('.buy_packet .total-cost').update_vat('price-small-decimals', [price], 0);

    }
});