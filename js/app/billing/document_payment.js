$(document).ready(function () {
    var form = $('#no_credit_payment_form:visible, #credit_payment_form:visible');

    $('#no_credit_payment_form [name="pay_method"]').on('change', function () {
        var checked = $('[name="pay_method"]:checked');

        if(checked.val() != 3){
            $('#payment_total').text($paymentSettings.total['none'].display);
        }else{
            $('#payment_total').text('0,0');
        }
    });

    $('[name="pay_method"]').on('change', function () {
        $('.payment_method_containers.active').removeClass('active');

        $(this).closest('.payment_method_containers').addClass('active');
    });

    $('#submitOrder').on('click', function (e) {
        e.preventDefault();

        form.validate_form();
    });

    form.prepare_form_advanced({
        onSuccess           : function () {
            $('#submitOrder').addClass('requestTrigger');

            if(typeof pay_obj != 'object')
                pay_obj = new $.ajax_prototype({
                    type        : 'POST',
                    timeout     : 120000,
                    success     : function (data) {
                        if(data.success){
                            if (data.data.constructor == Object && 'route' in data.data) {
                                if('open_tab' in data.data)
                                    open_tab = data.data.route;
                                else
                                    redirectLink = data.data.route;
                            } else {
                                var summaryContainer = $('[id="checkout-summary"]');

                                $('#paymentForms').hide();
                                summaryContainer.show();
                                $('#paymentStatusHeader').text($.translate('DOCUMENTS.PAYMENTS.STATUS_HEADER.BANK'));
                                $('#paymentStatus').text($.translate('DOCUMENTS.PAYMENTS.STATUS.PENDING'));

                                $('#statusIcon').removeClass('icon-cross').addClass('icon-warning').closest('div').next('.msg').find('span').text($.translate('DOCUMENTS.PAYMENTS.MSG.PENDING'));

                                $('#bankNoticeHeader').text($.translate('DOCUMENTS.PAYMENTS.BANK_NOTICE.PENDING'));
                                $('#creditCardSuggestion, #paymentFooter').hide();

                                if(data.data.constructor == Object && ('amount' in data.data))
                                    $('#paymentAmount').text(data.data.amount);

                                if ('remittance_code' in data.data) {
                                    $('.remittanceContainer').html(data.data.remittance_code).closest('li').show();
                                }
                            }
                        } else {
                            globalApplicationErrors(data);
                        }
                    },
                    url         : urls['pay'],
                    complete    : function () {
                        if(typeof open_tab  != 'undefined'){
                            $.set_cookie('open_tab', true, '/', open_tab);
                        }else if(typeof redirectLink != 'undefined'){
                            window.location.href = redirectLink;
                        }else {
                            $.enable_form_controls();
                            $('.submitText').show();
                            $('.loading').hide();
                        }
                    }
                });

            form = $('#no_credit_payment_form:visible, #credit_payment_form:visible');

            var payment_method  = form.find('[name="pay_method"]:checked').val(),
                use_cr_adj      = form.find('[name="use_cr_adj"]:checked').val(),
                credit_limit    = form.find('[name="use_cr_limit"]:checked').val();


            pay_obj.data = {'_token' : form.find('[name="_token"]').val()};

            if(payment_method != 3)
                pay_obj.data.payment_method = payment_method;
            else
                pay_obj.data.use_cr_adj = 1;

            if(typeof use_cr_adj != 'undefined' && use_cr_adj.length)
                pay_obj.data.use_cr_adj = 1;

            if(typeof credit_limit != 'undefined' && credit_limit.length)
                pay_obj.data.use_cr_limit = 1;

            $.ajax(pay_obj);
        },
        version_exception   : true,
        trigger             : [
            {
                'item'  : form,
                'event' : 'change',
                'callback'  : function () {
                    var credit_payment = form.find('[name="use_cr_adj"]'),
                        credit_limit = form.find('[name="use_cr_limit"]'),
                        payment_total = $('#payment_total'),
                        payment_method_list = $('#payment_method_list'),
                        payment_required = true;

                    if(credit_limit.prop('checked')){
                        payment_total.text($paymentSettings.total.credit_limit.display);
                        payment_required = $paymentSettings.total.credit_limit.payment_required;
                    }else if(credit_payment.prop('checked')){
                        payment_total.text($paymentSettings.total.credit.display);
                        payment_required = $paymentSettings.total.credit.payment_required;
                    }else{
                        payment_total.text($paymentSettings.total.none.display);
                        payment_required = $paymentSettings.total.none.payment_required;
                    }

                    if(payment_required)
                        payment_method_list.removeClass('disabled-options');
                    else
                        payment_method_list.addClass('disabled-options');
                }
            },
            {
                'item'  : '#credit_limit',
                'event' : 'change',
                'callback'  : function () {
                    if($(this.item).prop('checked'))
                        $('#credit_payment').prop('checked', true);
                }
            },
            {
                'item'  : '#credit_payment',
                'event' : 'change',
                'callback'  : function () {
                    if(!$(this.item).prop('checked'))
                        $('#credit_limit').prop('checked', false);

                }
            }
        ]
    });
});