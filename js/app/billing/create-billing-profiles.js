$(document).ready(function() {
    var form = $('#form-new-billing-profile'),
        formId = form.attr('id'),
        country = form.find('#billing_country'),
        initial_country = country.val();

    country.on('change',function() {
        countryChanged();
    });

    form.prepare_form_advanced({
        onSuccess           : function () {
            performAjaxRequest();
        },
        handlers            : '#btn-submit',
        disable             : '#btn-submit',
        version_exception   : true
    });

    function countryChanged(){
        form.find('.form-error').addClass('hide').removeClass('form-error');
        form.removeClass('has-error');
        form.find('.has-error').removeClass('has-error');
        form.find('.error').removeClass('error');
        form.find('.help-block').remove();

        country = form.find('#billing_country');
        containerNotGrVat = form.find('.notGRvat');
        containerNotEuVat = form.find('.notEUvat');

        if(country.find("option:selected").attr('data-eu')){
            $(containerNotEuVat).removeClass('hide');
            //$(containerNotEuVat).find('input,select').each(function(){
            //    $(this).renameAttr('data-validation-no','data-validation');
            //});

            if(country.is('select')){
                $('#beforeVat').val(country.find('option:selected').attr('data-vat'));
            }

            if(country.find('option:selected').attr('data-vat') == 'EL'){
                $(containerNotGrVat).addClass('hide');
            } else {
                $(containerNotGrVat).removeClass('hide');
            }
        }else {
            $(containerNotGrVat).removeClass('hide');

            $(containerNotEuVat).addClass('hide');
        }
    }

    function performAjaxRequest(){
        var getExtendedInfo = false;
        var data_cont = {};
        data_cont.country = country.val();
        data_cont._token = form.find('input[name*="_token"]').val();
        data_cont.unique_id = unique_page_identifier;
        if (country.find("option:selected").attr('data-eu')){
            data_cont.vat = form.find('#vat').val();
            if(country.find('option:selected').attr('data-vat') != 'EL'){
                getExtendedInfo = true;
            }
        } else {
            getExtendedInfo = true;
        }
        if (getExtendedInfo){
            data_cont.name = form.find('#name').val();
            data_cont.zip = form.find('#zip').val();
            data_cont.state = form.find('#state').val();
            data_cont.city = form.find('#city').val();
            data_cont.address = form.find('#address').val();
        }
        if ($('#is_default').prop('checked') == true){
            data_cont.is_default = '1';
        }

        if (form.find('[name="agree_terms"]:checked').length) {
            data_cont.data_validity = '1';
            data_cont.processing_approval = '1';
            data_cont.communication_agreement = '1';
        }

        if(typeof editObj != "object"){
            editObj = new $.ajax_prototype({
                'type'          : 'post',
                'url'           : form.attr('action'),
                'contentType'   : 'application/json',
                'success'       : function(data){
                    if (data.success === false) {
                        if (data.code == error_codes.validation_error) {
                            $.displayErrors(formId,data.data);
                        } else if (data.code == error_codes.session_error) {
                            $.set_cookie('errorCode',[data.msg,data.success],'/');
                        } else if(data.code == error_codes.token_error){
                            $.set_cookie('errorCode',[data.msg,data.success],'/');
                        } else{
                            $.alertHandler(formId, data.msg, alert_box_failure, data.data);
                            return false;
                        }
                    } else if (data.success === true) {
                        if (!isCart) {
                            create = data.data.BillingProfileId
                        } else {
                            if(country.val() == 'GR')
                                var name = form.find('#beforeVat').val() + form.find('#vat').val();
                            else
                                name = form.find('#name').val();

                            var handler = $('#billingProfileHandler');
                            handler.append('<option value="' + data.data.BillingProfileId + '">' + name + '</option>');

                            form.find('input:visible').val('');
                            $('#is_default').prop('checked', false);
                            country.chosen_update(initial_country).change();
                            $.cart_modals.close(form.closest('.custom-modal'));

                            handler.chosen_update(data.data.BillingProfileId).change();
                        }
                    } else {
                        $.alertHandler(formId, data.msg, alert_box_warning);
                        return false;
                    }
                },
                'complete'  : function () {
                    if(typeof create != 'undefined'){
                        location.replace(editLink.replace('#idp#', create));
                    }else {
                        $.enable_form_controls(formId);
                        $('.submitText').show();
                        $('.loading').hide();
                    }
                }
            }, formId);
        }

        editObj.data = JSON.stringify(data_cont);
        $.ajax(editObj);
        return false;
    }
});