$(document).ready(function () {
    var configuration_form = $('#configurator_form');

    configuration_form.prepare_form_advanced({
        onSuccess           : function(){
            if(configuration_form.hasClass('order_form'))
                $.packet.order();
            else
                $.packet.update();
        },
        handlers     		: configuration_form.hasClass('order_form') ? '.order.server.validate' : '.update.server.validate',
        outer_handlers     	: configuration_form.hasClass('order_form') ? '.immediate.order.validate' : '.update.order.validate',
        // disable     		: '.immediate.order.validate, .order.server.validate, .update.order.validate, .update.server.validate',
        version_exception   : true
    });

    $('.next').on('click', function () {
        next_tab = $('.tab-title.active').next().find('a');

        $('html, body').animate({
            scrollTop: next_tab.offset().top - 10
        }, 500, function () {
            next_tab.click();
        });
    });

    $('.configuration_tab [name="ram"]')
        .on('change', function () {
            var obj = $(this);

            if(obj.attr('data-sku') == '24_gb_ecc' || obj.attr('data-sku') == '32_gb_ecc'){
                $('[data-sku="2_x_amd_opteron_1.8_ghz"]').click();
                $('[data-sku="1_x_amd_opteron_1.8_ghz"]').disabled(true);
            }else{
                $('[data-sku="1_x_amd_opteron_1.8_ghz"]').disabled(false);
            }
        })
        .on('click', function () {
            var obj = $(this);

            if(obj.attr('data-sku') == '24_gb_ecc' || obj.attr('data-sku') == '32_gb_ecc'){
                if($('[data-sku="1_x_amd_opteron_1.8_ghz"]').is(':checked')){
                    $('#warning_ram').show();

                    hideRamWarning = setInterval(function () {
                        $('#warning_ram').hide();
                    }, 10000)
                }
            }else{
                $('#warning_ram').hide();

                if(typeof hideRamWarning != 'undefined'){
                    clearInterval(hideRamWarning);
                }
            }
        });

    $('.configuration_tab [name="os"]').on('change', function () {
        var obj     = $(this),
            sku     = obj.attr('data-sku'),
            target  = $('[data-sku="cpanel_dedi"]');

        target.disabled(typeof sku != 'undefined' && sku == 'windows_2012_r2_standard_edition');

        if (typeof sku != 'undefined' && sku == 'windows_2012_r2_standard_edition')
            target.attr('checked',false);
    });

    $('.configuration_tab [name="cp_dedicated"]').on('change', function () {
        var obj     = $(this),
            sku     = obj.attr('data-sku'),
            target  = $('[data-sku="windows_2012_r2_standard_edition"]');

        target.disabled(typeof sku != 'undefined' && sku == 'cpanel_dedi');

        if (typeof sku != 'undefined' && sku == 'cpanel_dedi')
            target.attr('checked',false);
    });

    $('.closeInfo').on('click', function (e) {
        e.preventDefault();

        $(this).closest('.info_cont').hide();

        if(typeof hideRamWarning != 'undefined'){
            clearInterval(hideRamWarning);
        }
    });

    $('[name="ram"]:checked, [name="os"]:checked').change();
});