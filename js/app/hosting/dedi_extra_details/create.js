$(document).ready(function () {
    var attributeType       = $('#detail_type'),
        elementContainer    = '<div id="##id##" class="row ##hide##"><div class="large-4 columns"><label for="##name##" class="inline">##label##</label></div><div class="large-7 columns end">##element##</div></div>',
        form                = $('#createDedicatedExtraDetailsForm'),
        sku                 = $('#sku'),
        name                = $('#name'),
        availabilityChecked = false;

    var typesWithUnlimited = ['cp_dedicated', 'bandwidth', 'traffic'],
        elementsWithUnlimited = ['domains_total', 'bandwidth_total', 'traffic_total'];

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
                var type = attributeType.find('option:selected').attr('data-target');

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

    attributeType.on('change', function () {
        categoryTypeChanged();
    });

    $('#getPricing').on('click', function (e) {
        e.preventDefault();

        $.activateOverlayLoader();

        var data = {
                '_token'        : $('[name="_token"]').val(),
                'detail_type'   : $('#detail_type option:selected').attr('data-target'),
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
                        if (data.code == error_codes.sub_product_category_not_found || data.code == error_codes.sub_product_is_not_configured_for_auto_pricing || data.code == error_codes.sub_product_has_incorrect_auto_pricing_config)
                            $('#getPricing').hide();

                        globalApplicationErrors(data, form.attr('id'));
                    }
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    });

    $(document)
        .on('change', '.unlimitedValueController', function () {
            var obj = $('.unlimitedValueController:checked'),
                domains_num = $('#limitedValueContainer');

            if (obj.val() == 'num')
                domains_num.show();
            else
                domains_num.hide();

            domains_num.find('input').val('');
        });

    form.prepare_form_advanced({
        handlers            : '#submit',
        disable             : '#submit',
        version_exception   : true,
        disable_exception   : true,
        onSuccess           : function () {
            if (!availabilityChecked)
                return;

            var data = {
                '_token'    : $('[name="_token"]').val(),
                'price_out' : {
                    'total_per_interval'  : {},
                    'setup_fee'           : {}
                }
            };

            form.find('input:not(.chosen-container input):not([name="overwrite_previous"]):not([name="cp_domain_num"]):not([name^="monthly_fee_"]):not([name^="setup_fee_"]):visible, [type="hidden"], textarea, select').each(function () {
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

            var overwrite_previous = form.find('[name="overwrite_previous"]');

            if (overwrite_previous.checked())
                data.overwrite_previous = true;

            var monthly_fee = form.find('[name^="monthly_fee_"]');

            if (monthly_fee.length) {
                monthly_fee.each(function () {
                    data.price_out.total_per_interval[this.name.replace('monthly_fee_','')] = this.value;
                });

                form.find('[name^="setup_fee_"]').each(function () {
                    data.price_out.setup_fee[this.name.replace('setup_fee_','')] = this.value||0;
                });
            } else {
                delete data.price_out;
            }

            data.detail_type_name = $('#detail_type option:selected').attr('data-target');


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
                            var modal = $('#detailCreatedSuccessfully');

                            modal.find('#created_detail_name').text(form.find('[name="name"]').val());
                            modal.modal_open();
                            cleanForm(true);
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

                            if (data.code == error_codes.dedicated_extra_detail_already_exists)
                                $('#overwrite_container').show();

                            globalApplicationErrors(data, form.attr('id'));
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

    function categoryTypeChanged () {
        var type = attributeType.find('option:selected').attr('data-target');

        cleanForm();

        $('.common_requirement_container').show();

        if (Object.keys(elementsConfig[type].elements).length) {
            var specificInfoContainer = $('#specificInfoContainer'),
                warning = '<a href="#" class="warn normal-weight" data-dropdown="##name##_drop" data-options="is_hover:true" aria-expanded="false">(?)</a>' +
                            '<div id="##name##_drop" class="f-dropdown content medium my-tooltip text-left" data-dropdown-content="" aria-hidden="true">##warning##</div>';

            specificInfoContainer.show();
            specificInfoContainer.find('h5').text(TRANS.ADMIN.DEDICATED.PRODUCTS.extras.specific_info[type]);

            for (var i in elementsConfig[type].elements) {
                if (elementsConfig[type].elements.hasOwnProperty(i)) {
                    var label = TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i].title;

                    if ('warning' in TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i])
                        label += ' ' + warning.replace(/##name##/g, type + '_' + i)
                            .replace('##warning##', TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][i].warning);

                    var element;

                    if (typesWithUnlimited.indexOf(type) > -1  && elementsWithUnlimited.indexOf(i) > -1)
                        element = createOptionsForUnlimitedValue(type, i);
                    else
                        element = createElementFromConfig(type, i, elementsConfig[type].elements[i]);

                    specificInfoContainer.append(elementContainer.replace('##id##', '').replace('##hide##', '').replace('##name##', i).replace('##label##', label).replace('##element##', element));

                    if (typesWithUnlimited.indexOf(type) > -1  && elementsWithUnlimited.indexOf(i) > -1) {
                        element = createElementFromConfig(type, i, elementsConfig[type].elements[i], true);
                        specificInfoContainer.append(elementContainer.replace('##id##', 'limitedValueContainer').replace('##hide##', 'hide').replace('##name##', '').replace('##label##', '').replace('##element##', element));
                    }
                }
            }

            specificInfoContainer.find('select').each(function () {
                var obj = $(this);

                obj.apply_chosen((obj.val() ? obj.val() : ''));
            });

            $(document).foundation('dropdown', 'reflow');
        }
    }

    function createElementFromConfig (type, name, config, required) {
        var element = '';

        if (! ('type' in config) || config.type == 'list') {
            var placeholder = TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][name].placeholder;

            element = '<select name="' + name + '" id="' + name + '" data-placeholder="' + placeholder + '"';

            if ('required' in config || typeof required != 'undefined')
                element += ' data-validate="required"';

            element += '>';

            element += '<option value="" class="placeholder" disabled selected>' + placeholder + '</option>';

            if ('values' in config) {
                for (var i in config.values) {
                    if (config.values.hasOwnProperty(i)) {
                        var value = config.values[i],
                            text = config.values[i];

                        if (type == 'hdd' && name == 'type')
                            text = $.translate('misc.storage_type.' + text);

                        element += '<option value="' + value + '">' + text + '</option>';
                    }
                }
            }
            element += '</select>';
        } else {
            element = '<input type="' + config.type + '" name="' + name + '" id="' + name + '" placeholder="' + TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][name].placeholder + '"';

            if (('required' in config && config.type != 'checkbox') || typeof required != 'undefined')
                element += ' data-validate="required"';

            element += '>';

            // if (config.type == 'checkbox') {
            //     element = '<div class="switch tiny">' + element + '<label for="' + name + '"><span class="switch-on">ON</span><span class="switch-off">OFF</span></label></div>';
            // }
        }

        return element;
    }

    function createOptionsForUnlimitedValue (type, element_name) {
        var idPrefix, namePrefix;

        switch (element_name) {
            case 'domain_total':
                idPrefix = 'domains';
                namePrefix = 'cp_domain';
                break;
            case 'bandwidth_total':
                idPrefix = 'bandwidth';
                namePrefix = 'bandwidth';
                break;
            case 'traffic_total':
                idPrefix = 'traffic';
                namePrefix = 'traffic';
                break;
        }
        var element = '<ul class="inline-list check-margin-top" data-validate="required" data-validate-type="radio" data-override-visibility="true">' +
            '<li><div class="radio"><label for="' + idPrefix + '_num"><input id="' + idPrefix + '_num" class="unlimitedValueController" autocomplete="off" name="' + namePrefix + '_num" type="radio" value="num"><span class="radio__label">' + TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][element_name].input_choice.specify_number + '</span></label></div></li>' +
            '<li><div class="radio"><label for="' + idPrefix + '_unlimited"><input id="' + idPrefix + '_unlimited" class="unlimitedValueController" autocomplete="off" name="' + namePrefix + '_num" type="radio" value="Unlimited"><span class="radio__label">' + TRANS.ADMIN.DEDICATED.PRODUCTS.extras[type][element_name].input_choice.unlimited + '</span></label></div></li>' +
        '</ul>';

        return element;
    }

    function checkSkuAvailability () {
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

    function cleanForm (forceAll) {
        var specificInfoContainer = $('#specificInfoContainer');

        specificInfoContainer.hide();
        specificInfoContainer.find('.row').remove();

        form.find('input:not(.chosen-container input)').val('');
        form.find('select:not(#detail_type)').each(function () {
            $(this).chosen_update('');
        });

        if (typeof forceAll != 'undefined')
            $('#detail_type').chosen_update('');

        form.find('[type="checkbox"], [type="radio"]').checked(false);

        form.find('#overwrite_container').hide();

        availabilityChecked = false;

        $('#getPricing').hide();

        $('#sellable, #upgradable, #renewable').checked(true);
    }
});