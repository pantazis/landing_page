$(document).ready(function () {
    var form        = $('#createDediForm');

    $('select').each(function () {
        var obj = $(this);

        obj.apply_chosen((obj.val() == 'none' ? '' : obj.val()));
    });

    $('#dnhost_sku').on('change', function (e) {
        if (! ('isTrigger' in e))
            checkSkuAvailability($(this));
    });

    $('.item .edit_btn').on('click', function (e) {
        e.preventDefault();

        var obj = $('.step-button[data-target="' + $(this).attr('data-target') + '"]');

        obj.removeClass('disabled').trigger('click');
        $.smoothScroll({}, obj.offsetTop);
    });


    form.prepare_form_advanced({
        version_exception : true,
        onSuccess: function (form) {
            $.activateOverlayLoader();

            var vendor_url = form.find('#vendor_url').val();

            if (! vendor_url)
                vendor_url = '';

            var data = {
                '_token'        : $('[name="_token"]').val(),
                'admin_details' : {
                    'vendor_id'             : form.find('#vendor_id').val(),
                    'vendor_sku'            : form.find('#vendor_sku').val(),
                    'vendor_url'            : vendor_url,
                    'vendor_currency'       : form.find('[name="vendor_currency"]:checked').val(),
                    'vendor_monthly_fee'    : form.find('#vendor_monthly_fee').val(),
                    'vendor_setup_fee'      : form.find('#vendor_setup_fee').val(),
                    'dnhost_name'           : form.find('#dnhost_name').val(),
                    'dnhost_sku'            : form.find('#dnhost_sku').val(),
                    'dnhost_flags'          : form.find('#dnhost_flags').val(),
                    'dnhost_price_out'      : {
                        'total_per_interval'    : {},
                        'setup_fee'             : {}
                    },
                },
                'hardware'      : {},
                'software'      : {},
                'network'       : {},
                'admin_default' : {},
            };

            var product_to_replace = form.find('#product_to_replace').val(),
                product_to_duplicate = form.find('#product_to_duplicate').val();

            if (!!product_to_replace)
                data.admin_details.product_to_replace = product_to_replace;

            if (!!product_to_duplicate)
                data.admin_details.product_to_duplicate = product_to_duplicate;

            $('[name^="monthly_fee"]').each(function () {
                var obj     = $(this),
                    length  = obj.attr('name').match(/[0-9]+/)[0];

                data.admin_details.dnhost_price_out.total_per_interval[length] = ((obj.val()) ? obj.val() : 0);
            });

            $('[name^="setup_fee"]').each(function () {
                var obj     = $(this),
                    length  = obj.attr('name').match(/[0-9]+/)[0];

                data.admin_details.dnhost_price_out.setup_fee[length] = ((obj.val()) ? obj.val() : 0);
            });

            $('[data-category-name]').each(function () {
                var container = $(this),
                    category = container.attr('data-category-name');

                container.find('select:not(.admin_default_list)').each(function () {
                    var requirment = $(this),
                        tmp = requirment.val();

                    if (!!tmp)
                        data[category][requirment.attr('name')] = tmp;
                });
            });

            $('.admin_default_container').each(function () {
                var obj = $(this),
                    value = obj.find('select').val();

                if (!! value) {
                    data.admin_default[obj.attr('data-default-for')] = value;
                }
            });

            data.admin_details['sellable'] = ($('#sellable').checked() ? 1 : 0);
            data.admin_details['upgradable'] = ($('#upgradable').checked() ? 1 : 0);
            data.admin_details['renewable'] = ($('#renewable').checked() ? 1 : 0);

            var overwriteVendorSKUCheck = $('#overwriteVendorSKUCheck');

            if (overwriteVendorSKUCheck.length && overwriteVendorSKUCheck.checked()) {
                data.admin_details['api_not_provided'] = true;
            }

            $.ajax(
                new $.ajax_prototype({
                    'type'      : 'POST',
                    'url'       : urls['action_submit'],
                    'data'      : data,
                    'success'   : function (data) {
                        if (data.success) {
                            var scrollTo = $('.steps').offset().top - 100;
                            $('html,body').scrollTop(scrollTo);

                            if ('redirect' in data.data)
                                redirect = data.data.redirect;
                            else
                                reloading = true;
                        } else {
                            if (data.code == error_codes.validation_error) {
                                $('[name^="monthly_fee_"], [name^="setup_fee_"]').each(function () {
                                    var obj = $(this),
                                        name = obj.attr('name');

                                    if ('admin_details' in data.data && name in data.data.admin_details) {
                                        obj.displayIndividualErrors(data.data.admin_details[name]);

                                        delete data.data.admin_details[name];
                                    }
                                });

                                var tmp  = {};

                                if ('admin_details' in data.data) {
                                    if ('dnhost_price_out' in data.data.admin_details)
                                    {
                                        tmp = $.extend(tmp, data.data.admin_details.dnhost_price_out);

                                        delete data.data.admin_details.dnhost_price_out;
                                    }

                                    tmp = $.extend(tmp, data.data.admin_details);
                                }

                                if ('hardware' in data.data)
                                    tmp = $.extend(tmp, data.data.hardware);

                                if ('software' in data.data)
                                    tmp = $.extend(tmp, data.data.software);

                                if ('network' in data.data)
                                    tmp = $.extend(tmp, data.data.network);

                                if ('admin_default' in data.data)
                                    for (var i in data.data.admin_default) {
                                        if (data.data.admin_default.hasOwnProperty(i)) {
                                            tmp['admin_default_' + i] = data.data.admin_default[i];
                                        }
                                    }

                                data.data = tmp;

                                $.each(data.data, function (i, value) {
                                    var obj = $('[name="' + i + '"]');

                                    if (obj.length) {
                                        obj.displayIndividualErrors(value);

                                        delete data.data[i];
                                    }
                                });
                            }

                            globalApplicationErrors(data);

                            if (form.find('.help-block.error').length)
                                $('[data-target="' + $('.step:has(.help-block.error):first').attr('id') + '"').click();
                        }
                    },
                    'complete'  : function () {
                        if (typeof redirect != 'undefined' && redirect !== false)
                            location.href = redirect;
                        if (typeof reloading != 'undefined' && reloading !== false)
                            location.reload(true);
                        else
                            $.deactivateOverlayLoader();
                    }
                })
            );
        },
        onError: function () {
            var tab         = $('[data-target="' + form.find('.step:has(.error):first').attr('id') + '"]'),
                error       = form.find('.error'),
                scrollTo    = error.offset().top - error.height();

            tab.click();

            $('html,body').scrollTop(scrollTo)
        }
    }).on('change', function (e) {
        var changeSource    = $(e.target),
            target          = $('[data-for="' + changeSource.attr('name') + '"]'),
            txt             = $.html_encoder.decode('&ndash;');


        if (changeSource.hasClass('admin_default_list')) {
            target = $('[data-for="' + changeSource.attr('id') + '"]');

            if (!! changeSource.val()) {
                if (target.length) {
                    target.closest('.item').show();
                } else {
                    var prev = $('.item:has([data-for="' + changeSource.closest('.admin_default_container ').attr('data-default-for') + '"])');

                    prev.after(prev.clone());

                    var newCont = $('.item:has([data-for="' + changeSource.closest('.admin_default_container ').attr('data-default-for') + '"]):last'),
                        label = newCont.find('.first-label');

                    target = newCont.find('[data-for]');

                    label.text('Προεπιλεγμένο - ' + label.text());
                    target.attr('data-for', 'admin_default_' + target.attr('data-for'));
                }
            } else
                target.closest('.item').hide();
        }

        if (target.length) {
            if (changeSource.is('select')) {
                var options = [];

                changeSource.find('option:selected').each(function () {
                    options.push($(this).text());
                });

                if (options.length)
                    txt = options.join(', ');

                target.text(txt);
            } else if (changeSource.is('[type="radio"]')) {
                var name = changeSource.attr('name'),
                    radio = $('label:has([name="' + name + '"]:checked)');

                if (radio.length)
                    txt = radio.text();

                target.text(txt);

                if (name == 'create_new') {
                    var item = $('.item:has([data-for="product_to_replace"])');

                    if ($('[name="' + name + '"]:checked').val() == 'new')
                        item.hide();
                    else
                        item.show();

                }

            } else if (changeSource.is('[type="text"]') || changeSource.is('[type="number"]')) {
                if (changeSource.val())
                    txt = changeSource.val();

                target.text(txt);
            }
        }
    });

    $(document)
        .on('click', '.step-button:not(.disabled):not(.active:last)', function (e) {
            e.preventDefault();

            if (vendorProductNotFound === true)
                return;

            $.activateOverlayLoader();

            var obj = $(this);

            var currentStep = $('.step:visible'),
                validate = currentStep.find('[data-validate]');

            if (validate.length) {
                currentStep.find('[data-validate]').each(function () {
                    $(this).element();
                });

                var error = currentStep.find('.error');

                if (error.length) {
                    setTimeout(function () {
                        $.deactivateOverlayLoader();
                    }, 400);
                    return;
                }
            }

            obj.addClass('active');
            obj.prevAll().addClass('active').removeClass('disabled');
            obj.next().removeClass('active disabled').nextAll().removeClass('active').addClass('disabled');

            $('.step').hide();
            $('#' + obj.attr('data-target')).show();

            $('.step:visible select[multiple]').each(function () {
                var obj = $(this);

                obj.chosen_update(obj.val());
            });
            form.trigger('change');

            setTimeout(function () {
                $.deactivateOverlayLoader();
            }, 400);
        })
        .on('click', '.button-group .create', function (e) {
            e.preventDefault();

            form.validate();
        })
        .on('click', '.button-group .button:not(.create)', function (e) {
            e.preventDefault();

            var obj         = $(this),
                step        = $('.step-button.active:last'),
                scrollTo    = step.offset().top;

            if (obj.hasClass('next'))
                step.next().trigger('click');
            else
                step.prev().trigger('click');

            $('html,body').scrollTop(scrollTo);
        })
        .on('change', 'input.error, select.error', function (e) {
            var obj = $(this),
                cont = obj.closest('div');

            cont.find('.error').removeClass('error');
            cont.find('.help-block').remove();
        })
        .on('change', 'select', function () {
            var obj = $(this),
                adminDefault = $('.admin_default_container[data-default-for="' + obj.attr('id') + '"]'),
                defaultList;

            if (obj.val()) {
                if (obj.val().indexOf('all') > -1) {
                    var values = [];

                    obj.find('option').each(function () {
                        if (this.value && this.value != 'all')
                            values.push(this.value);
                    });

                    obj.chosen_update(values);

                    obj.trigger('change');
                    return;
                } else if (obj.val() == 'none') {
                    obj.chosen_update('');

                    obj.trigger('change');
                    return;
                }

                if (adminDefault.length) {
                    adminDefault.show();

                    defaultList = adminDefault.find('select');

                    var selected = defaultList.val();

                    defaultList.find('option:not([value="none"])').disabled(true);

                    var values = obj.val();

                    for (var i in values) {
                        if (values.hasOwnProperty(i)) {
                            defaultList.find('[value="' + values[i] + '"]').disabled(false);
                        }
                    }

                    if (values.indexOf(selected) > -1)
                        defaultList.chosen_update(selected);
                    else
                        defaultList.chosen_update('');

                    defaultList.trigger('change');
                }
            } else {
                if (adminDefault.length) {
                    adminDefault.hide();

                    adminDefault.find('option:not([value="none"])').disabled(true);
                    defaultList = adminDefault.find('select');

                    defaultList.chosen_update('');
                    defaultList.trigger('change');
                }
            }
        })
        .on('input change', '#dnhost_sku', function () {
            if (typeof e.isTrigger != 'undefined')
                return;

            var obj = $(this),
                text = obj.val().toLowerCase();

            text = text.replace(/-/g,'_');

            obj.val(text);

            obj.trigger('change');
        });

    $('[name^="monthly_fee_"], [name^="setup_fee_"], [name="vendor_monthly_fee"], [name="vendor_setup_fee"]').on('change', function () {
        var obj = $(this),
            val = obj.val();

        if (val < 0)
            val = 0;
        else {
            try {
                if (!this.value.length || isNaN(this.value))
                    val = 0;
            } catch (e) {
                val = 0;
            }
        }

        obj.val(parseFloat(val));
    });


    function checkSkuAvailability (obj) {
        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : urls.checkSku,
                'data'                  : {
                    '_token'    : $('[name="_token"]').val(),
                    'sku'       : obj.val()
                },
                'success'               : function (data) {
                    if (data.success) {
                        if (data.data.availability)
                            $.alertHandler('', $.translate('hosting.create.skuavailability'), alert_box_success);
                        else
                            $.alertHandler('', $.translate('misc.unavailable_sku', 0, {'sku' : obj.val()}), alert_box_failure);
                    } else {
                        if (data.code == error_codes.validation_error && 'sku' in data.data)
                            $('#vendor_sku').displayIndividualErrors(data.data.sku);

                        globalApplicationErrors(data);
                    }
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    }
});

$(window).on('load', function () {
    var vendor_sku  = $('#vendor_sku');

    if (typeof vendor_info != 'undefined') {
        if (! ('error' in vendor_info)) {
            $.vendor_parsers.upload_info($('#vendor_id').val(), vendor_sku.val(), vendor_info);
            vendor_sku.vendor_parsers('info');
        } else {
            vendorProductNotFound = true;

            $('#overwriteVendorSkuCont').show().find('[type="checkbox"]').checked(false);
        }
    }
});