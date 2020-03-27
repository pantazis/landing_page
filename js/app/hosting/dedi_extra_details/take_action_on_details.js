$(document).ready(function () {
    var form = $('#takeActionDedicatedExtraDetailsForm'),
        sku  = $('#sku'),
        name = $('#name'),
        availabilityChecked = true;

    $('select')
        .each(function () {
            var obj = $(this);

            obj.apply_chosen((obj.val() ? obj.val() : ''));
        })
        .on('change', function () {
            var obj = $(this);

            if (obj.val() == 'none')
                obj.chosen_update('');
        });


    if (sku.length) {
        sku
            .on('change', function (e) {
                if (typeof e.isTrigger == 'undefined' && this.value) {
                    checkSkuAvailability();
                    handleSKUChanges($(this));
                }
            })
            .on('keypress',function(e) {
                var obj = $(this);

                if(e.which == 13) {
                    e.preventDefault();

                    obj.trigger('change');
                    obj.blur();
                }
            })
            .on('input', function (e) {
                if (typeof e.isTrigger != 'undefined')
                    return;

                var obj = $(this);

                try {
                    clearTimeout(skuChangedTimer)
                } catch (e) {}

                skuChangedTimer = setTimeout(function () {
                    handleSKUChanges(obj);
                }, 250);
            });

        $('#price_in').on('change', function (e) {
            if (typeof e.isTrigger == 'undefined' && this.value) {
                var type = $('[name="detail_type_name"]').val();

                if (!!type && 'profit' in elementsConfig[type] && !!this.value && this.value > 0) {
                    $('#getPricing').show();
                } else {
                    $('#getPricing').hide();
                }
            }
        })
    } else {
        name
            .on('change', function () {
            if (this.value)
                checkAttributeNameAvailability();
        })
            .on('keypress',function(e) {
                var obj = $(this);

                if(e.which == 13) {
                    e.preventDefault();

                    obj.trigger('change');
                    obj.blur();
                }
            });
    }

    $('[type="number"]').on('input', function () {
        if (this.value < 0)
            $(this).val(0);
        else {
            try {
                if (!this.value.length || isNaN(this.value))
                    $(this).val(0);
            } catch (e) {
                $(this).val(0);
            }
        }
    });

    $('#option_id').on('change', function () {
        var obj = $(this),
            value = obj.val();

        if (!!value && value.indexOf('all') > -1) {
            var newValue = [],
                options = obj.find('option:selected');

            options.each(function () {
                if (this.value != 'all') {
                    if (newValue.indexOf(this.value) < 0)
                        newValue.push(this.value);

                    return true;
                }

                var relativeOptions = $(this).closest('optgroup').find('option:not([value="all"])');

                relativeOptions.each(function () {
                    if (newValue.indexOf(this.value) < 0)
                        newValue.push(this.value);
                });
            });

            obj.chosen_update(newValue);
        }
    });

    $(document).on('change', '.unlimitedValueController', function () {
            var obj = $('.unlimitedValueController:checked'),
                domains_num = $('#limitedValueContainer');

            if (obj.val() == 'num')
                domains_num.show();
            else
                domains_num.hide();

            domains_num.find('input').val('');
        });

    $('#getPricing').on('click', function (e) {
        e.preventDefault();

        $.activateOverlayLoader();

        var data = {
                '_token'        : $('[name="_token"]').val(),
                'detail_type'   : $('[name="detail_type_name"]').val(),
                'price_in'      : $('#price_in').val()
            },
            form = $(this).closest('form');

        form.find('.help-block.error').remove();
        form.find('.error').removeClass('error');

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : urls['pricing'],
                'data'                  : data,
                'success'               : function (data) {
                    if (data.success) {
                        for (var i in data.data.monthly_fee) {
                            if (data.data.monthly_fee.hasOwnProperty(i)) {
                                $('#monthly_fee_' + i).val(data.data.monthly_fee[i]);
                            }
                        }

                        for (var i in data.data.setup_fee) {
                            if (data.data.setup_fee.hasOwnProperty(i)) {
                                $('#setup_fee_' + i).val(data.data.setup_fee[i]);
                            }
                        }

                        $('#getPricing').hide();
                    } else {
                        var detail_type_error = '';
                        if (data.code == error_codes.validation_error && 'detail_type' in data.data)
                        {
                            detail_type_error = data.data.detail_type;

                            delete data.data.detail_type;
                        }

                        if (data.code == error_codes.sub_product_category_not_found || data.code == error_codes.sub_product_is_not_configured_for_auto_pricing || data.code == error_codes.sub_product_has_incorrect_auto_pricing_config)
                            $('#getPricing').hide();

                        globalApplicationErrors(data, form.attr('id'));

                        if (detail_type_error.length)
                            $.alertHandler('', detail_type_error, alert_box_failure);
                    }
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    });

    form.prepare_form_advanced({
        handlers            : '#submit',
        disable             : '#submit',
        version_exception   : true,
        disable_exception   : true,
        onSuccess           : function () {
            if (! availabilityChecked)
                return;

            var data = {
                '_token'    : $('[name="_token"]').val(),
                'price_out' : {
                    'total_per_interval'  : {},
                    'setup_fee'           : {}
                }
            };

            form.find('input:not(.chosen-container input):not([name="cp_domain_num"]):not([name^="monthly_fee_"]):not([name^="setup_fee_"]):visible, [type="hidden"], textarea, select').each(function () {
                if (this.type == 'checkbox') {
                    data[this.name] = (this.checked ? 1 : 0);
                } else {
                    if (this.type == 'select-multiple') {
                        data[this.name] = ((!!this.value) ? $(this).val() : []);
                    } else {
                        data[this.name] = ((!!this.value) ? this.value : '');
                    }
                }
            });

            var monthly_fee = form.find('[name^="monthly_fee_"]');

            if (monthly_fee.length) {
                monthly_fee.each(function () {
                    if (this.value.length)
                        data.price_out.total_per_interval[this.name.replace('monthly_fee_','')] = this.value;
                });

                form.find('[name^="setup_fee_"]').each(function () {
                    if (this.value.length)
                        data.price_out.setup_fee[this.name.replace('setup_fee_','')] = this.value||0;
                });
            } else {
                delete data.price_out;
            }


            var unlimitedValueController = $('.unlimitedValueController:checked');

            if (unlimitedValueController.length) {
                if (unlimitedValueController.val() == 'num') {
                    var limitedValueContainer = $('#limitedValueContainer [type="number"]');

                    data[limitedValueContainer.attr('name')] = limitedValueContainer.val();
                }
                else
                    data[unlimitedValueController.attr('id')] = 1;
            }

            var sellable = $('#sellable'),
                upgradable = $('#upgradable'),
                renewable = $('#renewable');

            if (sellable.length)
                data['sellable'] = (sellable.checked() ? 1 : 0);

            if (upgradable.length)
                data['upgradable'] = (upgradable.checked() ? 1 : 0);

            if (renewable.length)
                data['renewable'] = (renewable.checked() ? 1 : 0);


            $.activateOverlayLoader();

            $.ajax(
                new $.ajax_prototype({
                    'type'                  : 'POST',
                    'data'                  : data,
                    'success'               : function (data) {
                        if (data.success) {
                            if ('url' in data.data)
                                redirect = data.data.url;
                        } else {
                            if (data.code == error_codes.validation_error) {
                                if ('price_out' in data.data) {
                                    for (var i in data.data.price_out) {
                                        if (data.data.price_out.hasOwnProperty(i)) {
                                            data.data[i] = data.data.price_out[i];
                                        }
                                    }

                                    delete data.data.price_out;
                                }
                            }

                            globalApplicationErrors(data, form.attr('id'));
                        }
                    },
                    complete                : function () {},
                    postcompletecallback    : function () {
                        if (typeof redirect != 'undefined')
                            location.href = redirect;
                        else {
                            $.enable_form_controls(form.attr('id'));
                            $.deactivateOverlayLoader();
                        }
                    }
                })
            );
        }
    });

    function checkSkuAvailability () {
        availabilityChecked = false;

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : urls['sku_availability'],
                'data'                  : {
                    '_token'    : $('[name="_token"]').val(),
                    'sku'       : sku.val()
                },
                'success'               : function (data) {
                    if (data.data) {
                        if (data.data.availability)
                            $.alertHandler('', $.translate('hosting.create.skuavailability'), alert_box_success);
                        else
                            $.alertHandler('', $.translate('misc.unavailable_sku', 0, {'sku' : sku.val()}), alert_box_failure);

                        availabilityChecked = true;
                    } else {
                        globalApplicationErrors(data, form.attr('id'))
                    }
                },
                postcompletecallback    : function () {
                    $.enable_form_controls(form.attr('id'));
                    $.deactivateOverlayLoader();
            }
            })
        );
    }

    function handleSKUChanges (obj) {
        var text = obj.val().toLowerCase();


        text = text.trim();
        text = text.replace(/-/g,'_').replace(/\s+/g,' ');

        text = text.replace(/\s+/g,'_');

        obj.val(text);

        obj.trigger('change');
    }

    function checkAttributeNameAvailability () {
        availabilityChecked = false;

        $.activateOverlayLoader();

        $.ajax(
            new $.ajax_prototype({
                'type'                  : 'POST',
                'url'                   : urls['attr_availability'],
                'data'                  : {
                    '_token'    : $('[name="_token"]').val(),
                    'name'      : name.val()
                },
                'success'               : function (data) {
                    if (data.data) {
                        if (data.data.availability)
                            $.alertHandler('', $.translate('hosting.create.attributes_name_availability'), alert_box_success);
                        else
                            $.alertHandler('', $.translate('misc.unavailable_attribute_name', 0, {'name' : name.val()}), alert_box_failure);

                        availabilityChecked = true;
                    } else {
                        globalApplicationErrors(data, form.attr('id'))
                    }
                },
                postcompletecallback    : function () {
                    $.enable_form_controls(form.attr('id'));
                    $.deactivateOverlayLoader();
            }
            })
        );
    }
});