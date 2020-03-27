$(document).ready(function () {
    var amountContainer = $('#amountContainer');

    $('[name="payment_method"]').on('change', function () {
        amountContainer.toggle($(this).val() == 1);
    });

    setTimeout(function () {
        $('[name="payment_method"]:checked').trigger('change');
    }, 10);

    $('#created_credit_form').prepare_form_advanced({
        onSuccess           : function () {
            // if ($('[name="payment_method"]:checked').val() == 1) {
                var form = $('#created_credit_form');

                if (typeof request != 'object')
                    request = new $.ajax_prototype({
                        type: 'POST',
                        success: function (data) {
                            if (data.success) {
                                window.location.href = data.data.route;
                            } else {
                                globalApplicationErrors(data, 'created_credit_form')
                            }
                        },
                        url: ''
                    }, '#created_credit_form');

                request.data = form.serialize();

                $.ajax(request);
            // } else {
            //     window.location.href = location.origin + '/account#creditAccountContent';
            // }
        },
        'handlers'          : '#btn_submit_new_credit',
        'disable'           : '#btn_submit_new_credit',
        version_exception   : true
    });
});