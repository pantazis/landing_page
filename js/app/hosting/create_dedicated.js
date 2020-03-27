$(document).ready(function () {
    var vendors         = {},
        form            = $('#createDediForm'),
        proceed         = false;

    form.find('select').apply_chosen('');
    form.find('select:not(#vendor_id)').on('change', function () {
        if ($(this).val())
            form.trigger('change');
    });

    $('#createDediForm select:not([multiple]):not([data-validate])').each(function () {
        var obj = $(this);

        if (obj.find('.placeholder').length < 1) {
            obj.append('<option class="placeholder" value="none">Καθαρισμός επιλογών</option>');
            obj.chosen_update(obj.val());
        }
    });

    $('#vendor_id').on('change', function () {
        var obj                 = $(this),
            category_container  = $('.step'),
            category_tab        = $('.category_tab'),
            vendor_id           = obj.val();

        $.activateOverlayLoader();


        category_tab.filter(':not([data-for="admin_details"])').hide();
        category_container.filter(':first').find('.requirement_container:not(#vendor_id_container)').hide();

        var select = category_container.find('select:not(#vendor_id):not(#dnhost_flags)');

        select.find('option:not(.placeholder):not(.all_available)').remove();
        select.chosen_update('');

        category_container.find('[type="radio"]').prop('checked', false);
        category_container.find('[type="text"], [type="number"]').val('');

        category_container.find('fieldset:not(:first)').hide();

        obj.disabled(true);
        obj.chosen_update(obj.val());

        if (! (vendor_id in vendors)) {
            vendors[vendor_id] = true;
            $.ajax(
                new $.ajax_prototype({
                    'type'                  : 'POST',
                    'url'                   : urls.vendorInfo.replace('##id##', vendor_id),
                    'data'                  : {
                        '_token' : $('[name="_token"]').val()
                    },
                    'success'               : function (data) {
                        if (data.success) {
                            vendors[vendor_id] = data.data;
                            setViewForVendor(vendor_id);
                        } else
                            globalApplicationErrors(data);
                    },
                    postcompletecallback    : function () {
                        obj.disabled(false);
                        obj.chosen_update(obj.val());

                        $.deactivateOverlayLoader();
                    }
                })
            )
        } else {
            setViewForVendor(vendor_id);
            obj.disabled(false);
            obj.chosen_update(obj.val());

            setTimeout(function () {
                $.deactivateOverlayLoader();
            }, 300)
        }

    });

    $('[name="create_new"]').on('change', function () {
        var obj = $('[name="create_new"]:checked');

        if (obj.val() == 'new')
            setFormToCreateNewProduct();
        else
            setFormToReplaceProduct();
    });

    $('#product_to_replace').on('change', function () {
        var obj = $(this);

        if (!obj.val())
            return;

        cleanForm(true);

        $('.requirement_container:not(#locationsCont):not(#overwriteVendorSkuCont)').show();
        $('.category_tab').show();

        loadProductInfoToForm(obj.val());

        form.find('fieldset').show();

        getInfoThroughReplace = true;
        $('#vendor_sku').vendor_parsers('info');
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

    $('#dnhost_sku').on('change', function (e) {
        if (! ('isTrigger' in e))
            checkSkuAvailability($(this));
    });

    $('#unavailableSKUReplace').on('click', function (e) {
        e.preventDefault();

        var vendor_id = $('#vendor_id'),
            product_to_replace = $('#product_to_replace'),
            unavailableSKUVendorName = $('#unavailableSKUVendorName'),
            unavailableSKUServerName = $('#unavailableSKUServerName');

        $('#unavailableSKUModal').modal_close();

        vendor_id.chosen_update(unavailableSKUVendorName.attr('data-target')).trigger('change');

        pendingVendor = setInterval(function () {
            if (vendors[vendor_id.val()] !== true) {
                $('[name="create_new"]').disabled(false);
                $('[name="create_new"][value="old"]').prop('checked', true);

                product_to_replace.chosen_update(unavailableSKUServerName.attr('data-target')).trigger('change');

                clearInterval(pendingVendor);
            }
        }, 10)
    });

    $('#duplicatesTrigger').on('click', function (e) {
        e.preventDefault();

        var obj = $(this);

        obj.find('i').toggleClass('icon-plus-circle2 icon-minus-circle2');
        obj.closest('.editable-form').find('.wrapper').toggle();
    });

    $('#locationsList').on('change', function () {
        $('.locationRows').show();
        $('[data-location="' + $(this).val() + '"]').hide();
    });

    $(document)
        .on('click', '.step-button:not(.disabled)', function () {
            if (!proceed || vendorProductNotFound === true)
                return;

            $.activateOverlayLoader();

            var obj = $(this);


            if (! obj.hasClass('active')) {
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
            }

            $('.step').hide();

            obj.addClass('active');
            obj.prevAll().addClass('active').removeClass('disabled');
            obj.nextAll().removeClass('active').addClass('disabled');
            obj.next().removeClass('disabled');

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
        .on('click', '.button.next:not(.disabled)', function (e) {
            e.preventDefault();

            var step        = $('.step-button.active:last').next(),
                scrollTo    = step.offset().top;


            step.removeClass('disabled');
            step.click();

            $('html,body').scrollTop(scrollTo);
        })
        .on('click', '.button.prev:not(.disabled)', function (e) {
            e.preventDefault();

            var step        = $('.step-button.active:last').prev(),
                scrollTo    = step.offset().top;

            step.click();

            $('html,body').scrollTop(scrollTo);
        })
        .on('click', '.button.create:not(.disabled)', function (e) {
            e.preventDefault();

            form.validate();
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
                }
            } else {
                if (adminDefault.length) {
                    adminDefault.hide();

                    adminDefault.find('option:not([value="none"])').disabled(true);
                    adminDefault.find('select').chosen_update('');
                }
            }
        })
        .on('change', '#createDediForm select:not([multiple]):not([data-validate])', function () {
            var obj = $(this);

            if (obj.val() == 'none') {
                obj.chosen_update('');
                obj.trigger('change');
            }
        })
        .on('click', '.duplicateLink', function (e) {
            e.preventDefault();

            var data = {};

            form.find('input:not(.chosen-container input), select').each(function () {
                var obj = $(this);

                if ((!obj.is('[type="radio"]') || obj.prop('checked')) && !!obj.val() && obj.attr('name') != 'dnhost_sku') {
                    data[obj.attr('name')] = obj.val();
                }
            });

            data['create_new'] = 'new';

            if ('product_to_replace' in data)
                delete data['product_to_replace'];

            Cookies.set('duplicateServer', JSON.stringify(data), {path: '/'});

            $.activateOverlayLoader();

            setTimeout(function () {
                $.deactivateOverlayLoader();

                window.open(location.href, '_blank');
            }, 600);
        })
        .on('input change', '#dnhost_sku', function (e) {
            if (typeof e.isTrigger != 'undefined')
                return;

            var obj = $(this),
                text = obj.val().toLowerCase();

            text = text.replace(/-/g,'_');

            obj.val(text);

            obj.trigger('change');
        });

    form.find('[name^="setup_fee_"], [name="vendor_setup_fee"]').on('change', function () {
        var obj = $(this);

        if (obj.val() < 0)
            obj.val(0);
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
                        }
                    },
                    'hardware'      : {},
                    'software'      : {},
                    'network'       : {},
                    'admin_default' : {},
                };

                var product_to_replace = form.find('#product_to_replace').val();

                if (!!product_to_replace)
                    data.admin_details.product_to_replace = product_to_replace;

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

                        if (!! tmp)
                            data[category][requirment.attr('name')] = tmp;
                    });
                });

                $('.admin_default_container').each(function () {
                    var obj = $(this),
                        value = obj.find('select').val();

                    if (!! value)
                        data.admin_default[obj.attr('data-default-for')] = value;
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
                        'type'                  : 'POST',
                        'url'                   : urls['create'],
                        'data'                  : data,
                        'success'               : function (data) {
                            if (data.success) {
                                var tab = $('.step-button:first'),
                                    category_container  = $('.step');

                                tab.click();
                                $('html,body').scrollTop(tab.offset().top);

                                $('#dediCreatedModal').modal_open().find('#created_dedi_name').text(form.find('#dnhost_name').val());

                                cleanForm();

                                category_container.filter(':first').find('.requirement_container:not(#vendor_id_container)').hide();

                                category_container.find('select:not(#vendor_id)').chosen_update('');
                                category_container.find('[type="radio"]').prop('checked', false);
                                category_container.find('[type="text"], [type="number"]').val('');

                                delete vendors[form.find('#vendor_id').val()];

                                form.find('#vendor_id').chosen_update('');
                                form.find('fieldset:not(:first)').hide();
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
                        postcompletecallback    : function () {
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
        })
        .on('change', function (e) {
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

    $.extend({
        productInfo : function (vendor, info) {
            switch (vendor) {
                case 'hetzner':
                    hetznerInfoCallback(info);
                    break;
            }
        }
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
                            skuNotAvailable(data.data);
                    } else {
                        if (data.code == error_codes.validation_error) {
                            if ('sku' in data.data)
                                $('#vendor_sku').displayIndividualErrors(data.data.sku);
                        }

                        globalApplicationErrors(data);
                    }
                },
                postcompletecallback    : function () {
                    $.deactivateOverlayLoader();
                }
            })
        )
    }

    function skuNotAvailable (data) {
        var modal = $('#unavailableSKUModal');

        modal.modal_open();
        modal.find('#unavailableSKUContainer').text($('#vendor_sku').val());
        modal.find('#unavailableSKUServerName').text(data.product.name).attr('data-target', data.product.id);
        modal.find('#unavailableSKUVendorName').text(data.product.vendor.name).attr('data-target', data.product.vendor.id);
    }

    function setViewForVendor (vendor_id) {
        var create_new_container = $('#create_new_container').show();

        /**
         * Activate/Deactivate create new or replace radio buttons
         */
        if (vendors[vendor_id].vendor.products.length > 0) {
            create_new_container.find('[type="radio"]').prop('checked',false).disabled(false);

            appendProductsToListOfReplacements(vendors[vendor_id].vendor.products);
        } else {
            create_new_container.find('[value="new"]').prop('checked', true).change();
            create_new_container.find('[value="old"]').disabled(true);

            setFormToCreateNewProduct();
        }

        addOptionsToLists(vendor_id);

        if ('vendorCallback' in $)
            $.vendorCallback();
    }

    function addOptionsToLists (vendor_id, loopThrough) {
        if (typeof loopThrough == 'undefined') {
            addOptionsToLists (vendor_id, 'options');
            addOptionsToLists (vendor_id, 'attributes');
        } else {
            var loop = vendors[vendor_id][loopThrough],
                detailsName;

            if (loopThrough == 'options')
                detailsName = 'product_option';
            else
                detailsName = 'catalog_attribute_details';

            for (var i in loop) {
                if (loop.hasOwnProperty(i)) {
                    var list = $('select#' + loop[i].name),
                        adminDefaultList = $('select#admin_default_' + loop[i].name),
                        nextValue = '';

                    if (list.length) {
                        if (loop[i].name != 'dnhost_flags')
                            list.find('option:not(.placeholder):not(.all_available)').remove();

                        if (adminDefaultList.length)
                            adminDefaultList.find('option:not(.placeholder):not(.all_available)').remove();

                        var details = loop[i][detailsName],
                            detailsHtml = '';

                        if (details.length) {
                            for (var j in details) {
                                if (details.hasOwnProperty(j)) {
                                    var attrbutes = ' ';

                                    if (loop[i].name == 'datacenter') {
                                        var extra_settings = JSON.parse(details[j].extra_settings);

                                        if ('shortcuts' in extra_settings)
                                            attrbutes += 'data-shortcut="' + extra_settings['shortcuts'] + '"';
                                    }

                                    detailsHtml += '<option value="' + details[j].id + '"' + (('sku' in details[j]) ? ' data-sku="' + details[j].sku + '"' : '') + attrbutes + '>' + details[j].name + '</option>';
                                }
                            }

                            list.append(detailsHtml);

                            if (adminDefaultList.length) {
                                adminDefaultList.append(detailsHtml);
                                adminDefaultList.find('option:not(.placeholder):not(.all_available)').disabled(false);
                                adminDefaultList.chosen_update('');
                            }
                        }
                    }

                    list.chosen_update(nextValue);
                }
            }
        }
    }

    function appendProductsToListOfReplacements (products) {
        var product_to_replace  = $('#product_to_replace'),
            newOptions          = '';

        product_to_replace.find('option:not(.placeholder):not(.all_available)').remove();

        for (var i in products) {
            if (products.hasOwnProperty(i)) {
                newOptions += '<option value="' + products[i].id + '">#' + products[i].id + ' - ' + products[i].name + '</option>';
            }
        }

        product_to_replace.append(newOptions);
        product_to_replace.chosen_update("");
    }

    function loadProductInfoToForm(productId) {
        var products        = vendors[$('#vendor_id').val()].vendor.products,
            product         = $.grep(products, function (n) {
                return n.id == productId;
            })[0],
            dnhost_flags    = $('#dnhost_flags');

        $('select:not(#vendor_id):not(#product_to_replace)').chosen_update('');

        try {
            product.price_in = JSON.parse(product.price_in);
            product.price_out = JSON.parse(product.price_out);
            product.extra_settings = JSON.parse(product.extra_settings);
        } catch (e) {}

        $('[name="vendor_sku"]').val(product.vendor_sku).change();
        $('[name="vendor_url"]').val(decodeURIComponent(product.extra_settings.ordering_url)).change();

        $('[name="vendor_currency"]').prop('checked',false);
        $('[name="vendor_currency"][value="' + product.price_in_currency + '"]').prop('checked',true).change();

        $('[name="dnhost_name"]').val(product.name).change();
        $('[name="dnhost_sku"]').val(product.sku).change();

        $('[name="vendor_monthly_fee"]').val(product.price_in.cost[Object.keys(product.price_in.cost)[0]]).change();
        $('[name="vendor_setup_fee"]').val(product.price_in.setup_fee).change();

        for (var i in product.price_out.length['fixed']) {
            if (product.price_out.length['fixed'].hasOwnProperty(i)) {
                var length = product.price_out.length['fixed'][i];

                $('[name="monthly_fee_' + length + '"]').val(product.price_out.prices.tier[0].total_per_interval[length]).change();
                $('[name="setup_fee_' + length + '"]').val((('setup_fee' in product.price_out.prices.tier[0]) ? product.price_out.prices.tier[0].setup_fee[length] : 0)).change();
            }
        }

        for (i in product.product_options) {
            if (product.product_options.hasOwnProperty(i)) {
                var option = product.product_options[i],
                    optionList = $('[name="' + option.catalog_option.name + '"]');

                optionList.find('option[value="' + option.id + '"]').attr('selected', true).prop('selected', true);
                optionList.chosen_update(optionList.val()).change();
            }
        }

        for (i in product.attribute_details) {
            if (product.attribute_details.hasOwnProperty(i)) {
                var attribute = product.attribute_details[i],
                    attributeList = $('[name="' + attribute.attribute.name + '"]');

                attributeList.find('option[value="' + attribute.id + '"]').attr('selected', true).prop('selected', true);
                attributeList.chosen_update(attributeList.val()).change();
            }
        }

        if ('default' in product.extra_settings) {
            for (var asset in product.extra_settings.default) {
                if (product.extra_settings.default.hasOwnProperty(asset)) {
                    $('#admin_default_' + asset).chosen_update(product.extra_settings.default[asset]).trigger('change');
                }
            }
        }

        $('.button.next').removeClass('disabled');

        if ('flags' in product && product.flags.length) {
            for(i in product.flags) {
                if (product.flags.hasOwnProperty(i)) {
                    dnhost_flags.find('[value="' + product.flags[i].id + '"]').attr('selected', true).prop('selected', true);
                }
            }

            dnhost_flags.chosen_update(dnhost_flags.val());
        }
        proceed = true;
    }

    function setFormToCreateNewProduct () {
        cleanForm();

        $('.requirement_container:not(#product_to_replace_container):not(#locationsCont):not(#overwriteVendorSkuCont)').show();
        $('.category_tab').show();
        $('#product_to_replace_container').hide();

        form.find('fieldset').show();

        $('.button.next').removeClass('disabled');
        proceed = true;

        var options = vendors[$('#vendor_id').val()].options;


        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                var list = $('select#' + options[i].name),
                    nextValue = [];

                if (list.length) {
                    var details = options[i]['product_option'];

                    if (details.length) {
                        for (var j in details) {
                            if (details.hasOwnProperty(j)) {
                                if (typeof details[j].extra_settings != 'object')
                                    details[j].extra_settings = JSON.parse(details[j].extra_settings);

                                if (details[j].extra_settings.constructor == Object && 'selected_on_create' in details[j].extra_settings && details[j].extra_settings.selected_on_create)
                                    nextValue.push(details[j].id);
                            }
                        }

                    }
                }

                if (nextValue.length)
                    list.chosen_update(nextValue);
            }
        }
    }

    function setFormToReplaceProduct () {
        cleanForm();

        $('.requirement_container:not(#vendor_id_container):not(#create_new_container)').hide();
        $('#product_to_replace_container').show();
    }

    function cleanForm (preserveToReplace) {
        var category_container  = $('.step');

        $('.help-block.error').remove();
        $('.invalid.error').removeClass('invalid error');

        $('.button.next').addClass('disabled');
        proceed = false;

        if (preserveToReplace === true)
            category_container.find('select:not(#vendor_id):not(#product_to_replace)').chosen_update('').change();
        else
            category_container.find('select:not(#vendor_id)').chosen_update('').change();

        category_container.find('[type="radio"]:not([name="create_new"])').prop('checked', false).change();
        category_container.find('[type="text"], [type="number"]').val('').change();

        form.find('fieldset:not(:first)').hide();

        $('#vendor_currency_euro').prop('checked', true).change();

        $('.step-button:first').click();
        $('#infoTriggerContainer').remove();

        var locationsCont = $('#locationsCont');

        locationsCont.hide();
        locationsCont.find('.help-block').remove();
        locationsCont.find('.invalid.error').remove();

        $('#locationsList').removeAttr('data-validate');

        $('#duplicateServerContainer, #pricingButtonCont').hide();

        $('#sellable, #upgradable, #renewable').checked(true);

        $('#overwriteVendorSkuCont').hide().find('[type="checkbox"]').checked(false);
    }

    function hetznerInfoCallback (info) {
        if (info.location.length > 1 && form.find('[name="create_new"]:checked').val() == 'new') {
            var duplicateServerContainer = $('#duplicateServerContainer').show(),
                locationsCont = $('#locationsCont').show(),
                list = locationsCont.find('select'),
                wrapper = duplicateServerContainer.find('.wrapper'),
                locationRows = wrapper.find('.locationRows:last').clone();

            list.attr('data-validate', 'required');

            wrapper.find('.locationRows').remove();

            list.find('option:not(.placeholder)').remove();

            for (var i in info.location) {
                if (info.location.hasOwnProperty(i)) {
                    list.append('<option value="' + info.location[i] + '">' + info.location[i] + '</option>');

                    var newRow = locationRows.clone();
                    newRow.attr('data-location', info.location[i]);
                    newRow.find('.first-label').text('Datacenter ' +  info.location[i]);

                    wrapper.append(newRow);
                }
            }

            list.chosen_update('');
        } else {
            $('#locationsCont select').removeAttr('data-validate');
        }
    }
});

$(window).on('load', function () {
   var duplicationData = Cookies.get('duplicateServer'),
       form = $('#createDediForm');

   Cookies.remove('duplicateServer');

    if (!!duplicationData) {
        duplicationData = JSON.parse(duplicationData);

        var vendor_id = form.find('[name="vendor_id"]');

        vendor_id.chosen_update(duplicationData['vendor_id']);

        delete duplicationData['vendor_id'];

        $.extend({
            vendorCallback : function () {
                if (!!duplicationData) {
                    for (var i in duplicationData) {
                        if (duplicationData.hasOwnProperty(i)) {
                            var item = form.find('[name="' + i + '"]');

                            if (item.length) {
                                if (item.is('select')) {
                                    item.chosen_update(duplicationData[i]).trigger('change');
                                } else if (item.is('[type="radio"]')) {
                                    form.find('[name="' + i + '"][value="' + duplicationData[i] + '"]').checked(true).trigger('change');
                                } else {
                                    item.val(duplicationData[i]).trigger('change');
                                }


                                if (i == 'vendor_sku')
                                    $.vendor_parsers.getVendorInfo(item);
                            }
                        }
                    }
                }

                duplicationData = null;
            }
        });

        vendor_id.trigger('change');
    }
});