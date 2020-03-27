$(document).ready(function () {
    var notification_list = $('#notice_cont');

    $.fn.extend({
        'notice_insert' : function (data) {
            var obj = $(this);

            obj.show().append(notice_insert(data));

            if (obj.hasClass('notification-list')) {
                $.notice.inc();
            }
        }
    });

    $.extend({
       notice : {
           insert : function (data){
               notice_insert(data);
           },
           inc : function () {
               notification_list.closest('li').find('.badge').text(get_active_items().length);

               $('#empty_notices').hide();
               $('#go_to_notices, #notice_badge').show();
           },
           dec : function () {
               var notices = get_active_items().length;
               notification_list.closest('li').find('.badge').text(notices);

               if(!notices) {
                   $('#empty_notices').show();
                   $('#go_to_notices, #notice_badge').hide();
               }
           }
       }
    });

    $(document).on('click', '.remove_notice', function () {
        var obj = $(this),
            notice = obj.closest('li'),
            list = obj.closest('ul');

        notice.hide();

        if(list.hasClass('notification-list')){
            $.notice.dec();
        }else if (list.find('li').length == 1) {
            list.hide();
        }

        remove_notice_request(notice, list);
    });

    function notice_insert (data) {
        if (data.msg.display_on_screen) {
            parameters = JSON.parse(data.msg.raw_text);
        }else{
            parameters = {
                subject : APP_LANG.MISC[notification_ids[data.msg.notification_template_id]],
                body    : JSON.parse(data.msg.parameters)['subject']
            };

        }

        parameters.notification_id = data.msg.notification_id;

        return create_notification(parameters);
    }

    function create_notification (parameters){
        notice = '<li data-notification-id="' + parameters.notification_id + '">' +
            '<div class="product">' + parameters.subject + '<br />' + parameters.body + '</div>' +
            '<a href="#" class="remove_notice">close</a>' +
            '</li>';

        return notice;
    }

    function remove_notice_request (notice, list) {
        if( typeof notice_obj != 'object'){
            notice_obj = new $.ajax_prototype({
                data        : {
                    '_token' : $('[name="_token"]').val(),
                    unique_id : unique_page_identifier
                },
                type        : 'POST',
                success     : function (data) {
                    var notice = $('[data-notification-id="' + this.url.match(/[0-9]+$/)+'"]'),
                        list = notice.closest('ul');

                    if (data.success) {
                        notice.remove();

                        if (list.hasClass('notification-list')) {
                            $.notice.dec();
                        }else if(list.find('li').length == 0) {
                            list.hide();
                        }
                    }else{
                        notice_remove_failed(notice, list);
                        globalApplicationErrors(data, '');
                    }
                },
                error       : function (response) {
                    notice_remove_failed(notice, list);
                    globalApplicationErrors(response, '');
                },
                complete    : function () {}
            });
        }

        notice_obj.url = notice_delete.replace('##id##', notice.attr('data-notification-id'));
        $.ajax(notice_obj);
    }

    function notice_remove_failed (notice, list) {
        notice.show();
        if (list.hasClass('notification-list')) {
            $.notice.inc();
        } else {
            list.show();
        }
    }

    function get_active_items () {
        return notification_list.find('li').filter(function () {
            return $(this).css('display') != 'none'
        })
    }
});