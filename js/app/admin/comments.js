$(document).ready(function () {
    $('#newComment, #cancel_comment').on('click', function (e){
        e.preventDefault();
        var form = $('#newCommentForm').toggleClass('active');

        form.find('textarea').val('');
        form.find('[type="checkbox"]').prop('checked', false);
    });

    $('#admin_comment_form').prepare_form_advanced({
        'handlers'          : '#submit_comment',
        'disable'           : '#submit_comment',
        version_exception   : true,
        'onSuccess'         : function () {
            if(typeof comment_obj != 'object')
                comment_obj = new $.ajax_prototype({
                    type    : 'POST',
                    url     : '/comments',
                    success : function(data){
                        if(data.success){
                            var form = $('#newCommentForm').removeClass('active');

                            form.find('textarea').val('');
                            form.find('[type="checkbox"]').prop('checked', false);

                            $('#commentsCont').prepend($('#comment-temp').html().replace('##id##', data.data.id)
                                .replace('##initiated_by##', data.data.initiated_by)
                                .replace('##created_at##', data.data.created_at)
                                .replace('##comment##', data.data.comment.replace(/\n/g,'<br>'))
                            );


                            if(!$.isEmptyObject(data.data.attributes)) {
                                var attributes = data.data.attributes,
                                    comment = $('#commentsCont').find('.item:first')
                                if('important' in attributes){
                                    comment.addClass('important');}
                            }
                        }else{
                            globalApplicationErrors(data,'');
                        }
                    }
                }, 'admin_comment_form');

            comment_obj.data = $('#admin_comment_form').serialize();

            $.ajax(comment_obj);
        }
    });

    $(document).on('click', '.delete_btn', function (e){
        e.preventDefault();


        var comment = $(this).closest('[data-comment-id]');
        comment.hide();

        if(typeof delete_comment != 'obj')
            delete_comment = new $.ajax_prototype({
                'type'  : 'POST',
                'data'  : {
                    '_token' : $('[name="_token"]').val()
                },
                success : function(data){
                    if(data.success){
                        comment.remove();
                    }else{
                        globalApplicationErrors(data,'');
                        comment.show();
                    }
                }
            });

        delete_comment.url = '/comments/' + comment.attr('data-comment-id') + '/delete';

        $.ajax(delete_comment);
    });
});