$(document).ready(function () {
    var notification_temp = $('#notification_temp').html();

    $('#delete_all').on('click', function (e) {
        e.preventDefault();

        var obj = $(this).hide(),
            notices = $('.notifyer [data-id], [data-notification-id]').hide();
        $.notice.dec();

        $('#no_notice').show();

        $.ajax({
            timeout : 30000,
            data    : {
                _token      : $('[name="_token"]').val(),
                unique_id   : unique_page_identifier
            },
            type    : 'POST',
            url     : delete_all_action_url,
            success : function (data) {
                if (data.success) {
                    notices.remove()
                } else {
                    handle_bulk_delete_notice_error(notices, obj);
                }
            },
            error   : function (e) {
                handle_bulk_delete_notice_error(notices, obj);
                globalErrorsHandler(e);
            }
        });
    });

    $(document).on('click', '.actions .delete', function () {
        var current_notice = $(this).closest('li').hide(),
            notice_id = current_notice.attr('data-id');

        if($(this).closest('ul').find('li').length == 1){
            $('#no_notice').show();
            $('#delete_all').hide();
        }

        var widget_notice = $('[data-notification-id="' + notice_id + '"]').hide();
        $.notice.dec();

        $.ajax({
            timeout : 30000,
            data    : {
                _token      : $('[name="_token"]').val(),
                unique_id   : unique_page_identifier
            },
            type    : 'POST',
            url     : delete_action_url.replace('##id##', notice_id),
            error   : function (e) {
                handle_delete_notice_error(current_notice, widget_notice);
                globalErrorsHandler(e);
            },
            success : function (data) {
                if (data.success) {
                    current_notice.remove();
                } else {
                    handle_delete_notice_error(current_notice, widget_notice);
                }
            }
        });
    });

    channel.notifications.personal.bind('App\\Events\\Notifications\\PersonalNotificationWasCreated', function (data) {
        if (window.location.pathname.match(/\/archived$/) != null) {
            return ;
        }

        var parameters = JSON.parse(data.msg.parameters),
            date = (typeof data.msg.date == 'object') ? data.msg.date.date : data.msg.date;

        $('ul.notifyer').prepend(notification_temp.replace('##id##', data.msg.notification_id).replace('##date##', date).replace('##label##', APP_LANG.MISC[notification_ids[data.msg.notification_template_id]]).replace('##title##', parameters['subject']).replace('##msg##', parameters['body']))

        $('#no_notice').hide();
        $('#delete_all').show();
    });

    channel.notifications.personal.bind('App\\Events\\Notifications\\NotificationWasDeleted', function (data) {
        if(data.msg.unique_id == unique_page_identifier){
            return ;
        }

        if (window.location.pathname.match(/\/archived$/) != null) {
            return ;
        }

        if (data.msg.notification_id == 'all') {
            $('ul.notifyer').empty();
        } else {
            $('li[data-id="' + data.msg.notification_id+ '"]').remove();
        }

        if ($('li[data-id]').length == 0) {
            $('#no_notice').show();
            $('#delete_all').hide();
        }
    });

    function handle_delete_notice_error (current_notice, widget_notice) {
        current_notice.show();
        widget_notice.show();
        $.notice.inc();

        if($(this).closest('ul').find('li').length == 1){
            $('#no_notice').hide();
            $('#delete_all').show();
        }
    }

    function handle_bulk_delete_notice_error (notices, obj) {
        notices.show();
        obj.show();
        $('#no_notice').hide();
        $.notice.inc();
    }
});