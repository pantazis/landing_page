$(document).ready(function () {
    $('#uploadForm').dropzone({
        'url'                       : urls['upload'],
        'method'                    : 'post',
        'addRemoveLinks'            : true,
        'createImageThumbnails'     : true,
        'init'                      : function () {
            var myDropzone = this;

            myDropzone
                .on("removedfile", function(file) {
                    if(file.name in $fileList){
                        var files           = $('.dz-preview'),
                            adminApprove    = $('#adminApproval');

                        if(files.length == 0){
                            if(adminApprove.length)
                                adminApprove.hide();

                            Dropzone.options.uploadForm.files = [];
                        }

                        $.ajax({
                            'type'          : 'POST',
                            'timeout'       : 90000,
                            'data'          : {
                                '_token'    : $('[name="_token"]').val(),
                                'file'      : $fileList[file.name]
                            },
                            'error'         : function (e) {
                                globalErrorsHandler(e);
                            },
                            'success'       : function (data) {
                                if(data.success){
                                    $('#process_after').text(data.data.next_process).removeClass('hide-important');

                                }else{
                                    var file        = this.file,
                                        myDropzone  = this.myDropzone;

                                    if(adminApprove.length)
                                        adminApprove.show();

                                    myDropzone.options.addedfile.call(myDropzone, file);
                                    myDropzone.emit("complete", file);

                                    var $preview = $('.dz-preview:last');

                                    $preview.append('<a href="' + urls.download_uploaded.replace('##fileId##', $fileList[$preview.find('[data-dz-name]').text()]) + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');

                                    $.alertHandler('', data.msg, alert_box_failure);
                                }
                            },
                            'url'           : urls.delete,
                            'file'          : {
                                'name'      : file.name,
                                'size'      : file.size,
                                'preview'   : file.previewElement
                            },
                            'myDropzone'    : myDropzone
                        }, 'uploadForm');
                    }
                })
                .on('success', function (file, response) {
                    if(response.success){
                        $fileList[file.name] = response.data.file;

                        $(file.previewElement).append('<a target="_blank" href="' + urls.download_uploaded.replace('##fileId##', response.data.file) + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');

                        var adminApprove = $('#adminApproval');

                        if(adminApprove.length && $('#trade_lock').prop('checked', true))
                            adminApprove.show();

                        $('#process_after').text(response.data.next_process).removeClass('hide-important');
                    }else{
                        file['_removeLink'].click();
                        $.alertHandler('', response.msg, alert_box_failure);
                    }
                });

            $files = [];

            if(typeof $createFiles != 'undefined'){
                $.each($createFiles, function (key, value) {
                    var file = {name: value.name, size: value.size};
                    myDropzone.options.addedfile.call(myDropzone, file);
                    myDropzone.emit("complete", file);

                    var $preview = $(myDropzone.previewsContainer).find('.dz-preview:last');
                    $preview.append('<a target="_blank" href="' + urls.download_uploaded.replace('##fileId##', value.id) + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>');

                    $fileList[value.name] = value.id;
                    $files.push(new File([''], value.name))
                });
            }

            if(uploads_vetted || !$active){
                $('.dz-remove').hide();
                $('#uploadForm').css('pointer-events', 'none');

                if($('#trade_lock').length)
                    $('.dz-download').remove();
                else
                    $('.dz-download').css('pointer-events', 'initial');
            }

            Dropzone.options.uploadForm = myDropzone;
            Dropzone.options.uploadForm.files = $files;
        }
    });

    var status_form = $('#status_form');

    if(status_form.length)
        status_form.prepare_form_advanced({
            onSuccess   : function () {
                var data = {
                    '_token'    : $('[name="_token"]').val(),
                    'status'    : $('#approve').val()
                };

                if($('#commentCont:visible').length)
                    data.comments = $('#comments').val();

                $.ajax(new $.ajax_prototype({
                    'type'      : 'POST',
                    'timeout'   : 30000,
                    'url'       : urls.update,
                    'data'      : data,
                    'success'   : function (data) {
                        if(data.success){
                            var comment = $('#comments').val();

                            if(comment.length)
                                $('#adminCommentCont').show().find('#adminComment').text(comment);

                            $('#adminApproval').remove();
                            $('.dz-remove').hide();
                            $('#uploadForm').css('pointer-events', 'none');
                            $('.dz-download').css('pointer-events', 'initial');

                            $('#tradeStatus').html(data.data.status);
                            $('#downloadApp').remove();
                        }else{
                            globalApplicationErrors(data);
                        }
                    }
                }, 'status_form'));
            },
            handlers    : '.submit-edit',
            disable     : '.submit-edit, .cancel',
            cancel      : {
                handler     : '.cancel',
                callback    : function(){
                    $('#approve').chosen_update('').change();
                }
            },
            version_exception   : true
        });

    $('#approve').apply_chosen('').on('change', function () {
        if($(this).val() == -1)
            $('#commentCont').show();
        else
            $('#commentCont').hide();

        $('#comments').val('');
    });

    $('#trade_lock').on('change', function () {
        $.ajax(new $.ajax_prototype({
                'type'      : 'POST',
                'data'      : {
                    '_token'    : $('[name="_token"]').val(),
                    'is_locked' : (($('#trade_lock').prop('checked')) ? 1 : -1)
                },
                'url'       : urls.lock,
                'success'   : function (data) {
                    if(data.success){
                        if($('#trade_lock').prop('checked')){
                            var $filesCount = $('#uploadForm').css('pointer-events', 'auto').find('.dz-preview')
                                .each(function () {
                                    var obj         = $(this),
                                        elements    = '',
                                        href        = urls.download_uploaded.replace('##fileId##', $fileList[obj.find('[data-dz-name]').text()]);

                                    obj.find('.dz-remove').show();
                                    elements += '<a href="' + href + '" class="dz-download">' + $.translate('FILE_MANAGE.DOWNLOAD') + '</a>';

                                    obj.append(elements);
                                })
                                .length;




                            if($filesCount){
                                $('#adminApproval').show();
                            }else
                                $('#adminApproval').hide();
                        }else{
                            $('.dz-remove').hide();
                            $('.dz-download').remove();

                            $('#uploadForm').css('pointer-events', 'none');
                            $('#adminApproval').hide();
                        }
                    }else{
                        globalApplicationErrors(data);X
                    }
                }
            })
        );
    });
});