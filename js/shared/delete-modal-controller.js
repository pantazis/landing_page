$(document).ready(function () {
    $('.modal_confirm').on('click', function (e) {
        e.preventDefault();
        var obj = $(this);

        if(typeof confirm_obj != 'object'){
            confirm_obj = new $.ajax_prototype({
                'type': 'POST',
                'success': function (data) {
                    deleteRequestCallback(data);
                }
            });
        }
        confirm_obj.url = obj.closest('.reveal-modal').attr('data-action');
        confirm_obj.data = obj.closest('form').serialize();
        $.ajax(confirm_obj);
    });
    $('.modal_cancel').on('click',function(e){
        e.preventDefault();
        $('#deleteModal').modal_close();
    });
});

function deleteRequestCallback(data){
    if (data.success == true) {
        deleteSuccess(data.code);
    } else if (data.success == false) {
        deleteErrorHandler(data.msg, data.code);
    } else {
        $.alertHandler('', data.msg, alert_box_warning);
    }
}

function deleteSuccess(code){
    if ($('.resp-table:not(.invoices-all)').length) {
        $('#deleteModal').modal_close();
        $.responsive_tables.row_delete();
    }else{
        $('#infoModal').modal_open();
    }
}

function deleteErrorHandler(msg, code){
    if (code == error_codes.session_error) {
        $.set_cookie('errorCode', [msg, false], '/');
    } else if (code == error_codes.token_error) {
        location.reload();
    } else {
        $.alertHandler('', msg, alert_box_failure);
    }
}