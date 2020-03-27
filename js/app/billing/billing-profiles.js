$(document).ready(function() {
    defaultButtonHandler = function(data){
        $.commonDefaultRequestHandler(data, [error_codes.billing_set_default_not_allowed]);

        if(data.success){
            var vat = data.data.result.vat_settings;

            if(vat.vat_waived){
                $('[value="no-Vat"],[value="sid-no-Vat"]').prop('checked', true);
                $('[name="Vat"],[name="sid-Vat"]').disabled(true);
                $('.billing-profile-vat').show().find('.vat-widget-notice').hide().filter('#vatWaivedNotice').show()
            }else{
                $('[name="Vat"],[name="sid-Vat"]').disabled(false);
                $('.vat-widget-notice').hide();
                $('#vatNotice').show();

                if($('[value="no-Vat"]').prop('checked')){
                    $('.billing-profile-vat').hide();
                }else{
                    $('.billing-profile-vat').show();
                }
            }

            $('.vatNoticeRate').text(vat.rate);
            $('.vatNoticeCountry').text(vat.country);
            $('.vatNoticeProfileName').text(vat.name);

            $('.billing-profile-vat a').attr('href', vat.route);
        }
    };

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasUpdated', function(data) {
        $.responsive_tables.initiate();
    });

    channel.billing.bind('App\\Events\\Billing\\BillingProfileWasAdded', function() {
        $.responsive_tables.initiate();
    });

    channel.billing.bind('App\\Events\\Billing\\InvoiceProfileWasDeleted', function(data) {
        $.responsive_tables.initiate();

        if(typeof data.msg == 'string')
            $.alertHandler('', data.msg, alert_box_warning);
        else if('error' in data.msg)
            $.alertHandler('', data.msg.error, alert_box_warning);
    });
});