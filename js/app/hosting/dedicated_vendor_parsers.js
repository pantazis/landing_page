$(document).ready(function () {
    var vendor_info = {},
        vendorInfoController = '<div id="infoTriggerContainer" class="row"><div class="large-7 columns large-offset-4 end"><p class="small-font normal-weight small-margin-bottom">Για να δεις τις πληροφορίες του προμηθευτή πάτα <a id="vendorInfoTrigger" href="#">εδώ</a></p></div></div>';

    vendorProductNotFound = false;

    $('#vendor_sku')
        .on('change', function (e) {
            if (! ('isTrigger' in e))
                $(this).vendor_parsers('info');
        })
        .on('keypress', function (e) {
            var obj = $(this),
                keycode = (event.keyCode ? event.keyCode : event.which);

            if (keycode == '13') {
                e.preventDefault();
                e.stopPropagation();

                obj.blur();
                obj.trigger('change');
                return;
            }
        });

    $('#locationsList').on('change', function () {
        var datacenter = $('#datacenter'),
            option = datacenter.find('option[data-shortcut*="' + $(this).val() + '"]');

        if (option.length)
            datacenter.chosen_update(option.val());
    });

    $(document).on('click', '#vendorInfoTrigger', function (e) {
        e.preventDefault();

        $('#vendorProductInfo').modal_open();
    });

    $.fn.extend({
        'vendor_parsers' : function (action) {
            switch (action) {
                case 'info' :
                    getVendorInfo($(this));
                    break
            }

            return this;
        }
    });

    $.extend({
        'vendor_parsers' : {
            'upload_info'   : function (vendorId, sku, info) {
                if (! (vendorId in vendor_info))
                    vendor_info[vendorId] = {};

                vendor_info[vendorId][sku] = info;
            },
            'getVendorInfo' : function (obj) {
                return getVendorInfo(obj)
            }
        }
    });

    function getVendorInfo (obj) {
        var vendor = $('#vendor_id');

        if (vendor.attr('data-api-support').split(',').indexOf(vendor.val()) < 0)
            return;

        $.activateOverlayLoader();

        obj.element();
        $('#infoTriggerContainer').remove();

        if (obj.next('.error').length < 1) {
            var vendorId = vendor.val(),
                vendorSKU = obj.val();

            if (typeof vendor_info[vendorId] != 'undefined' && typeof vendor_info[vendorId][vendorSKU] != 'undefined') {
                vendorProductNotFound = false;

                $('#vendorProductInfo').find('.lead').text(obj.val());
                selectVendorParser(vendor_info[vendor.val()][obj.val()]);
                obj.closest('.row').before(vendorInfoController);

                $('#overwriteVendorSkuCont').hide().find('[type="checkbox"]').checked(false);

                setTimeout(function () {
                    $.deactivateOverlayLoader();
                }, 300)
            } else {
                $.ajax(
                    new $.ajax_prototype({
                        'type': 'POST',
                        'url': urls.product_info,
                        'data': {
                            '_token': $('[name="_token"]').val(),
                            'vendor_id': vendor.val(),
                            'vendor_sku': obj.val(),
                        },
                        'success': function (data) {
                            if (data.success) {
                                vendorProductNotFound = false;

                                obj.closest('.row').before(vendorInfoController);

                                var modal = $('#vendorProductInfo');

                                modal.find('.lead').text(obj.val());

                                if (typeof getInfoThroughReplace == 'undefined' || getInfoThroughReplace !== true) {
                                    modal.modal_open();
                                    getInfoThroughReplace = false;
                                }

                                if (! (vendorId in vendor_info))
                                    vendor_info[vendorId] = {};

                                vendor_info[vendorId][vendorSKU] = data.data;

                                selectVendorParser(data.data);

                                $('#overwriteVendorSkuCont').hide().find('[type="checkbox"]').checked(false);
                            } else {
                                try {
                                    if (data.code == error_codes.hetzner_api_product_not_found) {
                                        $('#overwriteVendorSkuCont').show().find('[type="checkbox"]').checked(false);
                                    }

                                    if (data.code == error_codes.hetzner_api_product_not_found || data.code == error_codes.hetzner_api_could_not_resolve_host) {
                                        vendorProductNotFound = true;
                                        obj.displayIndividualErrors($.translate('catalog.product_not_found'));
                                    } else
                                        globalApplicationErrors(data, obj.closest('form').attr('id'));
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        },
                        'complete': function () {
                            $.deactivateOverlayLoader();
                        }
                    })
                );
            }
        } else {
            setTimeout(function () {
                $.deactivateOverlayLoader();
            }, 250);
        }
    }

    function selectVendorParser (info) {
        var vendor = $('#vendor_id option:selected').text().toLowerCase();

        if (! vendor)
            vendor = $('[name="vendor_name"]').val().toLowerCase();

        switch (vendor) {
            case 'hetzner':
                displayHetznerProductInfo(info);
                break
        }


        if ('productInfo' in $)
            $.productInfo(vendor, info);
    }

    function displayHetznerProductInfo (info) {
        var modal = $('#vendorProductInfo'),
            content = modal.find('.content');

        content.empty();
        content.append('<ul class="global-list"></ul>');

        content = content.find('.global-list');

        $.each(info, function (key, value) {
            var item = '<li><strong>' + key + '</strong><br>';

            if (typeof value == 'string')
                item += value;
            else if (value.constructor === Array) {
                if (value[0].constructor != Array && value[0].constructor != Object)
                    item += value.join('<br>');
                else if(key == 'prices') {
                    var tmp = [];
                    $.each(value, function (i, price) {
                        var line = '';

                        $.each(price, function (priceKey, priceValue) {
                            if (typeof priceValue == 'string')
                                line += priceValue + '<br>';
                            else if (typeof priceValue == 'string')
                                line += '<i>' + priceKey + '</i>' + ': ' + priceValue + '<br>';
                            else if (priceValue.constructor === Object)
                                line += '<i>' + priceKey + '</i>: [net: ' + priceValue['net'] + ', gross: ' + priceValue['gross'] + ']' + '<br>';
                        });

                        tmp.push(line);
                    });

                    item += tmp.join('<br>');
                }
            }

            item += '</li>';

            content.append(item);
        });

        $('#vendor_sku').val(info['id']).trigger('change');
    }
});