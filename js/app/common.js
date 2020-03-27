/**
 * Common Backend Javascripts
 */
$(document).ready(function() {
    $("main").css('min-height',($("main").height()-parseInt($("#footer").css('padding-top')) + "px")); // It sets the main section's height to a constant value.

    $('#btnStatusSuspend,#btnStatusActivate').on('click',function(e){
        e.preventDefault();
        $('#suspendConfirm').attr({'data-action':$(this).attr('href')}).modal_open();
    });
    $('#suspendConfirm #gen_mod_submit').on('click',function(e){
        e.preventDefault();
        status_con.url = $('#suspendConfirm').attr('data-action');
        $.ajax(status_con);
    });
    $('#suspendConfirm .cancel').on('click',function(e){
        e.preventDefault();
        $('#suspendConfirm').modal_close();
    });

    if($('#suspendConfirm').length){
        status_con = new $.ajax_prototype({
            'type'      : 'post',
            'success'   : function(data){
                adminSussUserReqCall(data);
            },
            'data'      : $('#suspendConfirm form').serialize()
        });
    }

    if($('.content_form').length){
        $(document).on('keypress',function(e){
            if(e.keyCode == 27){
                e.preventDefault();
                $('.button.cancel:visible').click();
            }
        });
    }

    $('#country').on('change',function(){
        value = $(this).val();
        $('.required_country').each(function(){
            country = $(this);
            input = country.closest('.row').find('.columns:last input');
            if(input.val() == ''){
                country.chosen_update(value).change();
            }
        });
    });

    $('.switch:not(.exception)').on('click',function(){
        closeLine($('.item.opened'));
    });

    //Handle all delete modal on backend
    $(document).on('click', '.button.delete', function (e) {
        e.preventDefault();

        modal = $('#deleteModal').attr({'data-action':$(this).attr('href')});

        modal.modal_open();
        if(typeof info_text != 'undefined'){
            name = $(this).closest('.responsiveTableRow').attr('data-name');
            if(name != 'null'){
                name = '<strong>' + name + '</strong>';
            }else{
                name = '';
            }

            id = '<strong>' + $(this).closest('.responsiveTableRow').attr('data-id') + '</strong>';
            modal.find('#target').html(info_text.replace('#namep#',name).replace('#idp#',id));
        }
        $(this).blur();
    });

    $('#errorDomains').find('.closeMessage').on('click', function (e) {
        e.preventDefault();

        $('#errorDomains').slideUp('default');
    });
});

function makeHoverable(edit){
    $('.item:has(' + edit+ ')').removeClass('non-hover');
}

function adminSussUserReqCall(data){
    if(data.success == true) {
        suspend = $('#btnStatusSuspend').closest('li');
        activate = $('#btnStatusActivate').closest('li');
        if (data.data == 'active') {
            $('.username').addClass('success').removeClass('alert warning');
            $('#suspendConfirm #modal_notice').text(COMMON_LANG.CONFIRMS.USER_STATUS.ACTIVE.replace('%%USERNAME%%',$('.content_static [data-about="name"]').text()));
            suspend.show();
            activate.hide();
        } else {
            $('.username').addClass('alert').removeClass('success warning');
            $('#suspendConfirm #modal_notice').text(COMMON_LANG.CONFIRMS.USER_STATUS.SUSPEND.replace('%%USERNAME%%',$('.content_static [data-about="name"]').text()));
            suspend.hide();
            activate.show();
        }
    }else{
        if(data.code == error_codes.user_status_not_found){
            $.alertHandler('', data.msg, alert_box_failure);
        }else{
            globalApplicationErrors(data);
        }
    }
    $('#suspendConfirm').modal_close();
}