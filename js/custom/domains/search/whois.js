$(document).ready(function () {
    $.extend($.domain_search, {
        whois : {
        }
    });

    var domCache = {},
        whoisCache = {};

    $(document)
        .on('click', '.buttonTarget.taken, .singleButtonTarget.secondary', function (e) {
            e.preventDefault();

            var obj = $(this),
                domain = obj.closest('[data-fqdn]').attr('data-fqdn');

            $('#' + my_modals_config.whois.id).my_modal('open', function () {
                if(($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) && $.getSizeClassification('small')) {
                    domCache[my_modals_config.whois.id].find('.modal-content p').css({
                        'min-height' : '',
                        'max-height' : ''
                    });
                }

                if (whoisCache[domain]) {
                    domCache[my_modals_config.whois.id].find('.modal-content p').html(whoisCache[domain]).show();
                } else {
                    domCache[my_modals_config.whois.id].find('.loading').show();
                    domCache[my_modals_config.whois.id].find('.modal-content p').hide();

                    $.ajax(
                        new $.ajax_prototype({
                            type: 'POST',
                            timeout: $.domain_search.config.request_timeout.whois,
                            url: $.domain_search.config.functionality.whois.url,
                            data: {
                                '_token': $('[name="_token"]').val(),
                                'domain': domain
                            },
                            success: function (data) {
                                if (data.success) {
                                    domCache[my_modals_config.whois.id].find('.loading').hide();
                                    domCache[my_modals_config.whois.id].find('.modal-content p').html(data.data).show();

                                    whoisCache[domain] = data.data;
                                } else {
                                    globalApplicationErrors(data);
                                }
                            },
                            error: function (e) {
                                $('#' + my_modals_config.whois.id).my_modal('close');
                                globalErrorsHandler(e);
                            },
                            complete: function () {

                            }
                        })
                    )
                }
            }).find('.lead').text($.translate('whois.modal.title', null, {'domain' : domain}));
        });

    $.my_modals.insert({
        'id' 		    : my_modals_config.whois.id,
        'content'	    : my_modals_config.whois.content,
        'modal_classes'	: my_modals_config.whois.modal_classes,
        'close_icon'    : true,
        'callbacks'     : {
            'resize' : function () {
                var wh = $(window).height(),
                    modal = $('#' + my_modals_config.whois.id);

                if ($.getSizeClassification('small')) {
                    if($.isTouch() || ($.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null))) {
                        modal.find('p.whois').css({
                            'min-height' : '',
                            'max-height' : ''
                        })
                    } else {
                        wh -= 100;

                        modal.find('p.whois').css({
                            'min-height' : wh + 'px',
                            'max-height' : wh + 'px'
                        })
                    }
                } else {
                    if (wh < modal.height()) {
                        wh -= 150;

                        modal.find('p.whois').css({
                            'min-height' : wh + 'px',
                            'max-height' : wh + 'px'
                        })
                    } else {
                        var mh = 400;

                        if (mh > wh)
                            mh = wh - 150;

                        modal.find('p.whois').css({
                            'min-height' : mh + 'px',
                            'max-height' : mh + 'px'
                        })
                    }
                }

            }
        }
    });

    domCache[my_modals_config.whois.id] = $('#' + my_modals_config.whois.id);
});

$(window).on('load', function () {
    $(document).trigger('loaded:whois');
});