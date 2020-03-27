$(document).ready(function () {
    $.observers.register('tablesLoader', function (mutattions) {
        var loader = $(mutattions[0].target);

        if (loader.css('display') == 'none') {
            var pending_answer  = loader.closest('.pending_answer');

            if (pending_answer.find('.responsiveTableRow').length < 1)
                pending_answer.hide();
        }
    });

    $('.global_loader').each(function () {
        var obj = $(this);

        $.observers.observe('tablesLoader', obj, {'attributes':true})
    });

    $('#financialPanel select')
        .each(function () {
            var obj = $(this);

            obj.apply_chosen(obj.val());
        })
        .on('change', function () {
            if (typeof domainPrices != 'undefined') {
                var obj = $(this),
                    form = obj.closest('.editable-form');

                var priceSource = fixPriceOptionsForDomain();

                fixPriceDisplaysForDomain(priceSource, form);
            }
        });

    function fixPriceOptionsForDomain () {
        var actionsDropdown = $('#actionsDropdown'),
            typeDropdown    = $('#typeDropdown'),
            tiersDropdown   = $('#tiersDropdown'),
            action = actionsDropdown.val();

        if (action in domainPrices) {
            var priceSource = domainPrices[action];

            if ('use' in domainPrices[action]) {
                action = domainPrices[action].use;
                priceSource = domainPrices[action];
            }

            if (action == 'update')
                priceSource = domainPrices[action].contact.registrant;

            var type        = typeDropdown.val(),
                newTypes    = Object.keys(priceSource);

            newTypes = newTypes.removeIndex(newTypes.indexOf('length'));

            typeDropdown.empty();

            for (var i in newTypes) {
                if (newTypes.hasOwnProperty(i)) {
                    typeDropdown.append('<option value="' + newTypes[i] + '">' + newTypes[i] + '</option>');
                }
            }

            typeDropdown.chosen_update((newTypes.indexOf(type) > -1) ? type : newTypes[0]);
            typeDropdown.closest('.editable_line').toggle(newTypes.length > 1);

            //There might be a change at type after the types recreation
            //Get type again to handle TIERS
            type = typeDropdown.val();


            var tier        = tiersDropdown.val(),
                newTiers    = Object.keys(priceSource[type]['prices']['tier']);

            tiersDropdown.empty();

            for (var i in newTiers) {
                if (newTiers.hasOwnProperty(i)) {
                    tiersDropdown.append('<option value="' + newTiers[i] + '">' + (parseInt(newTiers[i]) + 1) + '</option>');
                }
            }

            tiersDropdown.chosen_update((newTiers.indexOf(tier) > -1) ? tier : newTiers[0]);
            tiersDropdown.closest('.editable_line').toggle(newTiers.length > 1);

            //There might be a change at tier after the tiers recreation
            //Get tier again to handle PRICES
            tier = tiersDropdown.val();

            priceSource = priceSource[type]['prices']['tier'][tier];

            return priceSource;
        }
    }

    function fixPriceDisplaysForDomain (priceSource, form) {
        form.find('.length_display').hide();

        if ('total_per_interval' in priceSource) {
            form.find('#pricesHeader').removeClass('hide-important');

            var perInterval = priceSource.total_per_interval;

            for (var i in perInterval) {
                if (perInterval.hasOwnProperty(i)) {
                    var display = form.find('.length_display[data-length="' + i + '"]');

                    display.find('.monthly_display').text($.imperial_to_metric(perInterval[i]) + '€');

                    var setup_fee = 0;

                    if ('setup_fee' in priceSource && i in priceSource['setup_fee'])
                        setup_fee = priceSource['setup_fee'][i];

                    display.find('.fee_display').text($.imperial_to_metric(setup_fee) + '€');

                    display.show();
                }
            }
        } else if ('setup_fee' in priceSource) {
            form.find('#pricesHeader').addClass('hide-important');

            var setup_fee_only = form.find('.setup_fee_only');

            if (setup_fee_only.length < 1) {
                var lastDisplay = form.find('.length_display:last');

                lastDisplay.after('<div class="item editable_line non-hover length_display setup_fee_only">\n' +
                    '    <div class="row">\n' +
                    '        <div class="large-4 columns"><span class="first-label">' + $.translate('pricing.setup_fee') + '</span></div>\n' +
                    '        <div class="large-8 columns end"><div class="content_static"><div class="row"><div class="medium-9 large-9 columns"><span class="data-label data_display">' + $.imperial_to_metric(priceSource['setup_fee']) + '€</span></div></div></div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>');
            } else {
                setup_fee_only.show().find('.data_display').text($.imperial_to_metric(priceSource['setup_fee']) + '€');
            }
        }
    }
});