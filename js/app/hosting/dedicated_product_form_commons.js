$(document).ready(function () {
    $('[name="vendor_monthly_fee"], [name="vendor_setup_fee"]').on('change', function () {
        $('#pricingButtonCont').show();
    });

    $('#getPricing').on('click', function (e) {
        e.preventDefault();

        $.activateOverlayLoader();

        var monthlyFeeCont  = $('#vendor_monthly_fee_container'),
            setUpFeeCont    = $('#vendor_setup_fee_container'),
            monthlyFee      = monthlyFeeCont.find('#vendor_monthly_fee'),
            setUpFee        = setUpFeeCont.find('#vendor_setup_fee').val();

        monthlyFeeCont.find('.help-block').remove();
        monthlyFeeCont.find('.error').removeClass('invalid error');

        monthlyFee.element();

        if (monthlyFee.hasClass('error')) {
            setTimeout(function () {
                $.deactivateOverlayLoader();
            }, 200);

            return;
        }

        var data = {
            '_token'                : $('[name="_token"]').val(),
            'vendor_monthly_fee'    : monthlyFee.val(),
            'vendor_setup_fee'      : (setUpFee.length ? setUpFee : 0),
        };

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : urls['pricing'],
                'data'                  : data,
                'success'               : function (data) {
                    if (data.success) {
                        for (var i in data.data) {
                            if (data.data.hasOwnProperty(i)) {
                                $('#monthly_fee_' + i).val(data.data[i]['monthly_fee']).trigger('change');
                                $('#setup_fee_' + i).val(data.data[i]['setup_fee']).trigger('change');
                            }
                        }

                        $('#pricingButtonCont').hide();
                    } else {
                        globalApplicationErrors(data, 'createDediForm');
                    }
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    });

    $('#overwriteVendorSKUCheck').on('change', function () {
        if ($(this).checked()) {
            $.activateOverlayLoader();

            setTimeout(function () {
                $('#vendor_sku').removeClass('error').closest('#vendor_sku_container').find('.help-block').remove();
            }, 200);

            setTimeout(function () {
                $.deactivateOverlayLoader();
            }, 300);

            vendorProductNotFound = false;
        } else {
            $('#vendor_sku').vendor_parsers('info');
            vendorProductNotFound = true;
        }
    });
});