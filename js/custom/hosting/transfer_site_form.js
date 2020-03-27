$(document).ready(function () {
    var form = $('#transferSiteForm');

    $(document).on('click', '.add', function (e) {
        e.preventDefault();

        var obj = $(this),
            cont = obj.closest('.row');

        var found = $('.add').length;

        if (obj.hasClass('success')) {
            if (found < 5) {
                cont.after(cont.getOuterHTML().replace(/dom_[0-9]+/g,'dom_' + (parseInt(cont.find('input').attr('id').match(/[0-9]+/)) + 1)));

                obj.removeClass('success').addClass('alert').text($.html_encoder.decode('&minus;'));

                if (found == 4)
                    $('.add').removeClass('success').addClass('alert').text($.html_encoder.decode('&minus;'));
            }
        } else {
            if (found > 1)
                cont.remove();

            $('.add:last').removeClass('alert').addClass('success').text($.html_encoder.decode('&plus;'));
        }

        obj.blur();
    });

    $('[name="transfer-site-from"]').on('change', function () {
        var obj = $('[name="transfer-site-from"]:checked');

        if (obj.val() == 'ftp') {
            $('#port_cont').show();
            $('#url_cont').removeClass('medium-12').addClass('medium-10');
        } else {
            $('#port_cont').hide();
            $('#url_cont').removeClass('medium-10').addClass('medium-12');
        }

        $('#originName').text(obj.next('label').text());
    });

    form.prepare_form_advanced({
        handlers : '#transfer-siteBtn',
        disable : '#transfer-siteBtn',
        version_exception : true,
        onSuccess: function (form) {
            var formId = form.attr('id'),
                transferFrom = $('[name="transfer-site-from"]:checked').val(),
                pass = $('#transfer_password'),
                data = {
                    'name'              : $('#contact_name').val(),
                    'email'             : $('#contact_email').val(),
                    'origin'            : transferFrom,
                    'url'               : $('#url').val(),
                    'username'          : $('#transfer_username').val(),
                    'password'          : pass.attr('type', 'text').val(),
                    'additional_info'   : $('#additional_info').val(),
                    'transfer_message'  : $('#transfer_message').val(),
                    'domains'           : [],
                };

            if (app_env != 'local')
                data['g-recaptcha-response'] = grecaptcha.getResponse();

            if ($('[name="gdpr_communications_agreement"]:checked').length)
                data['gdpr_communications_agreement'] = '1';

            pass.attr('type', 'password');

            if (transferFrom == 'ftp')
                data.port = $('#port').val();

            $('[name^="dom_"]').each(function () {
                data.domains.push(this.value);
            });

            $.ajax(
                new $.ajax_prototype({
                    'type'      : 'POST',
                    'data'      : data,
                    'success'   : function (data) {
                        if (data.success) {
                            $('html, body').animate({scrollTop: form.scrollTop()});
                            form.remove();
                            $('#new_transfer_request').show();

                            $(window).scrollTop()
                        } else {
                            if (data.code == error_codes.validation_error && 'domains' in data.data) {
                                if (typeof data.data.domains != 'string') {
                                    for (var i in data.data.domains) {
                                        if (data.data.domains.hasOwnProperty(i)) {
                                            data.data['dom_' + i] = data.data.domains[i];
                                        }
                                    }

                                    delete data.data.domains;
                                }
                            }

                            globalApplicationErrors(data, formId, {
                                'name'              : function (){ return form.find('#contact_name')},
                                'email'             : function (){ return form.find('#contact_email')},
                                'origin'            : function (){ return form.find('[name="transfer-site-from"]')},
                                'url'               : function (){ return form.find('#url')},
                                'username'          : function (){ return form.find('#transfer_username')},
                                'password'          : function (){ return form.find('#transfer_password')},
                                'additional_info'   : function (){ return form.find('#additional_info')},
                                'transfer_message'  : function (){ return form.find('#transfer_message')},
                                'port'              : function (){ return form.find('#port')},
                                'domains'           : function (){ return form.find('#dom_cont')},
                                'dom_0'             : function (){ return form.find('[name^="dom_"]:eq(0)')},
                                'dom_1'             : function (){ return form.find('[name^="dom_"]:eq(1)')},
                                'dom_2'             : function (){ return form.find('[name^="dom_"]:eq(2)')},
                                'dom_3'             : function (){ return form.find('[name^="dom_"]:eq(3)')},
                                'dom_4'             : function (){ return form.find('[name^="dom_"]:eq(4)')},
                            });

                            form.find_errors();
                        }
                    }
                }, formId)
            );
        }
    })
});