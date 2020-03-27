$(document).ready(function(){
    form = $('#missing_data_form');

    // var state_id = $('#state_id');
    // state_id.apply_chosen(state_id.val());
    // console.log($('#contact_type').data('type'));
    // console.log($('#country').data('eu'));

    missingCountryOfCitizenship();

    form.find('select').each(function () {
        var obj = $(this);

        if($('#' + obj.attr('id') + '_chosen').length < 1){
            obj.apply_chosen(obj.val());
        }
    });

    $(document).on('change', form.find('input, select'),function(){
        setTimeout(function(){
            form.display_form_errors(true);
        },10);
    });

    nonGrLocStates = $('input#state');

    $('select#country').on('change',function(){
        obj = $(this);

        country = obj.val();
        if(country == 'GR' || country == 'CY'){
            $('#contact_int').show();
            if(country == 'GR'){
                $('#state_int').closest('.row').parents('.row').eq(0).hide();
            }else{
                $('#state_int').closest('.row').parents('.row').eq(0).show();
            }
        }else{
            $('#contact_int').hide();
        }
        if(country == 'GR'){
            $('#state_input').hide();
            $('#state_id').chosen_update('').closest('.row').show();
        }else{
            $('#state').val('');
            $('#state_input').show();
            $('#state_id').closest('.row').hide();
        }

        missingCountryOfCitizenship();
    });

    $('select#contact_type').on('change',function(){
        var val  = $(this).val();
        $('.hide-for-' + val).hide();
        $('.show-for-' + val).show();

        name_int = $('#name_int');

        if(val == 'legal'){
            $('#owner_int').show();
            $(name_int.parents('.row')[1]).show();

            if(name_int.val()){
                name_int.attr('disabled',true);
            }else{
                name_int.removeAttr('disabled');
            }

        }else if(val == 'individual'){
            $('#owner_int').show();

            name_int.attr('disabled',true);
            if(name_int.val()){
                $(name_int.parents('.row')[1]).show();
            }else{
                $(name_int.parents('.row')[1]).hide();
            }
        }

        missingCountryOfCitizenship();

    }).apply_chosen('');

    form.prepare_form_advanced({
        onSuccess           : function(){
            if(typeof missin_data_obj != 'object'){
                missin_data_obj = new $.ajax_prototype({
                    'type'      : 'post',
                    'url'       : form.attr('action'),
                    'success'   : function(data){
                        if (data.success) {
                            isReloading = true;
                            location.reload(true);
                        } else {
                            error_handling(data);
                        }
                    },
                    'complete'  : function () {
                        if (typeof isReloading != 'undefined')
                            return ;

                        $.enable_form_controls(form.attr('id'));
                        $('.submitText').show();
                        $('.loading').hide();
                    }
                });
            }

            missin_data_obj.data = collect_data(form);
            $.ajax(missin_data_obj);
        },
        handlers            : '#btn-submit',
        disabled            : '#btn-submit',
        version_exception   : true
    });

    form.display_form_errors(function () {
        $('#gdprAgreementCont').show();
    });

    function error_handling(data) {
        if(data.code == error_codes.validation_error){
            $.alertHandler($('#missing_data_form').attr('id'),data.msg,alert_box_failure,data.data);
            if($.isPlainObject(data.data) && 'title' in data.data){
                $('#titleContainer').after(helperBlock.replace('errorMessage',data.data['title']));
            }

        }else if(data.code == error_codes.contact_individual_name_mismatch) {
            $('[for*="first_name_int"]:visible, [for*="last_name_int"]:visible').addClass('error');
            $('[name*="first_name_int"]:visible, [name*="last_name_int"]:visible').addClass('error').after(helperBlock.replace('errorMessage',((data.data != null) ? data.data : data.msg)));
        }else{
            globalApplicationErrors(data);
        }
        form.find_errors();

        $('#btn-submit').removeClass('disabled');
    }

    function collect_data(form) {
        var data = {};

        form.find('input:visible:not([type="radio"]):not(.chosen-container input),select').each(function(){
            var obj = $(this),
                value = obj.val();

            var name = obj.attr('name').replace('_leg','').replace('_ind','');

            if(value != '' && value != null){
                if(name == 'country' && !obj.is('select')){
                    data[name] = obj.attr('data-country-iso2');
                }else if(name == 'citizenship_country' && !obj.is('select')){
                    data[name] = obj.attr('data-citizenship_country-iso2');
                }else if(name == 'type' && !obj.is('select')){
                    data[name] = obj.attr('data-type');
                }else if(name == 'state_id' && obj.is('select')){
                    data['state_id'] = obj.find('option:selected').attr('data-lang');
                    if(data['state_id'] < 10){
                        data['state_id'] = '0'+data['state_id'];
                    }
                }else{
                    data[name] = value;
                }
            }
        });

        if($('#contact_type').val() == 'legal' || $('#contact_type').attr('data-type') == 'legal'){
            data['title'] = $('[name="title_leg"]:checked').val();
        }
        data['_token'] = $('[name="_token"]').val();

        if ($('[name="agree_terms"]:checked').length) {
            data.data_validity = '1';
            data.processing_approval = '1';
            data.communication_agreement = '1';
        }

        return data;
    }
});

function missingCountryOfCitizenship()
{
    var contactEntity;
    var countryOfResidenceIsEu;

    if ($('#contact_type').data('input-type') === 'text')
        contactEntity = $('#contact_type').data('type');
    else
        contactEntity = $('#contact_type option:selected').data('type');

    if ($('#country').data('input-type') === 'text')
        countryOfResidenceIsEu = $('#country').data('eu');
    else
        countryOfResidenceIsEu = $('#country option:selected').data('eu');

    if (contactEntity === 'individual')
    {
        if (countryOfResidenceIsEu !== 1)
            $('.show-country-citizenship-for-individual').show();
        else
            $('.hide-country-citizenship-for-eu').hide();
    }
    else
    {
        $('.hide-country-citizenship-for-legal').hide();
    }
}