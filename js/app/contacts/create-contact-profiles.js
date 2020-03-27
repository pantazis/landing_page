$(document).ready(function () {
    var formId = 'form-new-contact';

    countryOfCitizenship($('select#contact_country option:selected'), $('select#person_type option:selected').val());

    $('#' + formId + ' select:not(#state_id)').each(function(){
        var obj = $(this);
        obj.apply_chosen(obj.val());
    });

    var state_id_drop_down = $('#' + formId + ' #state_id');

    state_id_drop_down.apply_chosen({
        'value' : state_id_drop_down.val(),
        'par'   : {
            'search_contains' : true
        }
    });

    $('#contact_country').on('change',function() {
        statesManager($(this));
        countryOfCitizenship($('select#contact_country option:selected'), $('select#person_type option:selected').val());
    }).change();

    $('#contact_country').assign_secondary_phone([$('#phone_country'),$('#fax_country')]);

    $(document)
        .on('click','#cancel',function(e){
            e.preventDefault();
            $('#fax_country').chosen_update('');
            $(this).closest('.columns').remove();
        })
        .on('change', '#person_type', function(){
            type = $(this);
            type_value = type.val();

            $('.hide-for-' + type_value).hide();
            $('.show-for-' + type_value).show();

            countryOfCitizenship($('select#contact_country option:selected'), $('select#person_type option:selected').val());

            $('.full-name, .full-name-int').val('').trigger('input');
            $('#organization, #organization_int').val('').trigger('input');
            $('#identity [type="radio"]').prop({'checked':false});
        })
        .on('input', 'input[type="text"]:not(.int-exception)', function () {
            id = $(this).attr('id');
            country = $('#contact_country').val();

            if($('#' + id + '_int').length > 0){
                target = $('#' + id + '_int');
                value = $(this).val();

                if(!$.isEmptyObject(value.match(REG.ASCII.INVERSE.REGEX))){
                    target.closest('.hide').show();
                    target.closest('fieldset').show()
                }else{
                    target.val('').closest('.hide').hide();
                    hideIntFieldset(target.closest('fieldset'));
                }
            }
        })
        .on('input', 'input.addresses', function () {
            target = $('.addresses_int');
            value = $(this).val();
            country = $('#contact_country').val();

            if(!$.isEmptyObject(value.match(REG.ASCII.INVERSE.REGEX))){
                target.closest('.hide').show();
                target.closest('fieldset').show()
            }else{
                target.closest('.hide').hide();
                hideIntFieldset(target.closest('fieldset'));
            }
        })
        .on('input', 'input.full-name', function () {
            int = 0;
            cont = $(this).closest('fieldset');

            if(cont.attr('id') == 'identity'){
                cont_int = $('#owner_int');

                cont.find('.full-name').each(function(){
                    if(REG.ASCII.INVERSE.REGEX.test($(this).val())){
                        ++int
                    }
                });

                if(int > 0){
                    cont_int.find('.full-name-int').closest('.hide').show();
                    cont_int.show();
                }else{
                    cont_int.find('.full-name-int').closest('.hide').hide();
                    hideIntFieldset(cont_int);
                }
            }

        })
        .on('input', 'input#organization', function () {
            if($(this).val().length > 0){
                $('#org_default').show();
            }else{
                $('#org_default').hide();
            }

            target = $('#organization_int');

            if($(this).val().match(REG.ASCII.INVERSE.REGEX)){
                target.closest('.hide').show();
                target.closest('fieldset').show()
            }else{
                target.closest('.hide').hide();
                hideIntFieldset(target.closest('fieldset'));
            }
        });

    $('#identity input,#owner_int input').on('input change',function(){
        org = $('#organization');
        orgInt = $('#organization_int');
        firstName = $('#first_name');
        lastName = $('#last_name');
        firstNameP = $('#first_name_int');
        lastNameP = $('#last_name_int');
        latinPname = $('#latinPName');
        latinPCom = $('#latinPCompany');

        i = 0;
        $('#identity [type="text"]:visible').each(function(){
            if($(this).val() != ''){
                i += 1;
            }
        });

        if(i != 0){
            $('#previewRegistration').show();
            $('.previews').hide();
            setTimeout(function(){
                if($('#org_default').is(':visible') && $('#organization_only').prop('checked')){
                    if(org.val() != '' && org.is(':visible')){
                        $('#previewName').show();
                        $('#namePrev').text(org.val());
                    }else{
                        $('#previewName').hide();
                    }
                    if(orgInt.val() != '' && orgInt.is(':visible')){
                        latinPname.show();
                        $('#nameLatPrev').text(orgInt.val());
                    }else{
                        latinPname.hide();
                    }
                }else{
                    if(firstName.is(':visible') && firstName.val() !='' || lastName.val() !=''){
                        $('#previewName').show();
                        $('#namePrev').text(firstName.val() + ' ' + lastName.val());
                    }else{
                        $('#previewName').hide();
                    }

                    if(firstNameP.is(':visible') && firstNameP.val() !='' || lastNameP.val() !=''){
                        latinPname.show();
                        $('#nameLatPrev').text(firstNameP.val() + ' ' + lastNameP.val());
                    }else{
                        latinPname.hide();
                    }

                    if(org.val() != ''){
                        $('#previewCompany').show();
                        $('#companyPrev').text(org.val());
                    }else{
                        $('#previewCompany').hide();
                    }

                    if(orgInt.val() != '' && orgInt.is(':visible')){
                        latinPCom.show();
                        $('#companyLatPre').text(orgInt.val());
                    }else{
                        latinPCom.hide();
                    }

                    if(latinPname.is(':hidden') && latinPCom.is(':visible')){
                        latinPname.show();
                        $('#nameLatPrev').text($('#namePrev').text());
                    }
                }
            },1);
        }else{
            $('#previewRegistration').hide();
        }
    });

    $('#form-new-contact').prepare_form_advanced({
        onSuccess           : function(){
            $('.form-error').remove();
            var data_cont = {};

            $('#' + formId + ' input:not([type="checkbox"]):not([type="radio"])').each(function () {
                value = $(this).val();

                if (value) {
                    var name = $(this).attr('name');

                    if(!$(this).is('[type="radio"]')) {

                        if(name == 'first_name_leg' || name == 'last_name_leg'){
                            data_cont[name.replace('_leg','_int')] = value;
                        }else{
                            data_cont[name] = value;
                        }

                    }else{
                        if($(this).prop('checked')) {
                            data_cont[name] = $(this).val();
                        }
                    }
                }
            });

            data_cont['country'] = $('#contact_country').val();
            data_cont['phone_country'] = $('#phone_country').val();
            data_cont['type'] = $('#person_type').val();

            if(data_cont['type'] == 'individual'){
                data_cont['title'] = $('[name="title_ind"]:checked').val();
                if ($('select#contact_country option:selected').data('eu') !== 1)
                    data_cont['citizenship_country'] = $('select#contact_country option:selected').val();
            }else{
                data_cont['title'] = $('[name="title_leg"]:checked').val();
            }

            if ($('#fax_country').val() != null && $('#fax_country').val() != 'NaN') {
                data_cont['fax_country'] = $('#fax_country').val();
            }

            if (data_cont['country'] == 'GR') {
                data_cont['state_id'] = $('#state_id').find('option:selected').attr('data-lang');

                if (data_cont['state_id'] < 10) {
                    data_cont['state_id'] = '0' + data_cont['state_id']
                }
            }

            if (typeof contact_obj != 'object')
                contact_obj = new $.ajax_prototype({
                    'type'          : 'post',
                    'url'           : $('#form-new-contact').attr('action'),
                    'contentType'   : 'application/json',
                    'success'       : function (data) {
                        if (data.success === false) {
                            if (data.code == error_codes.validation_error) {
                                $.displayErrors(formId, data.data);
                            } else if (data.code == error_codes.session_error) {
                                $.set_cookie('errorCode', [data.msg, data.success], '/');
                            } else if (data.code == error_codes.token_error) {
                                location.reload();
                            } else if (data.code == error_codes.validation_error) {
                                $.alertHandler(formId, data.msg, alert_box_failure, data.data);
                            } else {
                                $.alertHandler(formId, data.msg, alert_box_failure, data.data);
                            }
                        } else if (data.success === true) {
                            if(typeof isCart != 'undefined' && isCart)
                                $.cart_modals.handlers.cartContactHandler(data);
                            else
                                created = domain.replace('#idp#',data.data.contactId);

                        } else {
                            $.alertHandler(formId, APP_LANG.MESSAGES.SOMETHING_GOES_WRONG, alert_box_warning);
                        }
                    },
                    'complete'      : function () {
                        if(typeof created != 'undefined'){
                            location.href = created;
                        }else{
                            $.enable_form_controls('form-new-contact');
                            $('.submitText').show();
                            $('.loading').hide();
                        }
                    }
                }, 'form-new-contact');

            if(typeof isCart != 'undefined' && isCart)
                data_cont.unique_id = unique_page_identifier;

            if ($('#' + formId + ' [name="agree_terms"]:checked').length) {
                data_cont.data_validity = '1';
                data_cont.processing_approval = '1';
                data_cont.communication_agreement = '1';
            }

            contact_obj.data = JSON.stringify(data_cont);
            $.ajax(contact_obj);
            return false;
        },
        handlers            : '#btn-submit-new-contact',
        disable             : '#btn-submit-new-contact',
        version_exception   : true
    });

    // first_name_int
    // last_name_int

    var $customErrorRules =  {
        'first_name_int' : function () {
            return $('#first_name_int:visible,[name="first_name_int"]:visible,#first_name_int_leg:visible,[name="first_name_int_leg"]:visible');
        },
        'last_name_int' : function () {
            return $('#last_name_int:visible,[name="last_name_int"]:visible,#last_name_int_leg:visible,[name="last_name_int_leg"]:visible');
        }
    };

    $.extend(custom_selectors_apply, $customErrorRules);
    console.log();
});

function hideIntFieldset(fieldset){
    if(fieldset.find('input:visible').length < 1)
        fieldset.hide();
}

function countryOfCitizenship(trigger, entityType)
{
    if (entityType !== undefined)
    {
        console.log(entityType);
        if (entityType === 'individual')
        {
            if (trigger.data('eu') !== 1)
                $('.show-country-citizenship-for-individual').show();
            else
                $('.hide-country-citizenship-for-eu').hide();
        }
        else
        {
            $('.hide-country-citizenship-for-legal').hide();
        }
    }
    else
    {
        $('.hide-country-citizenship-for-legal').hide();
    }
}