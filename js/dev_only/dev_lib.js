$(document).ready(function () {
    $.extend({
        dev : {
            billing     : {
                create : {
                    cyprus : function () {
                        buildCYBillingProfile();
                    },
                    thailand : function () {
                        buildTHBillingProfile();
                    }
                }
            },
            contacts    : {
                create : {
                    individual : {
                        gr : function (properties) {
                            buildIndividualGrContactProfile(properties);
                        },
                        fr : function (properties) {
                            buildIndividualFRContactProfile(properties);
                        }
                    },
                    legal : {
                        gr : function (properties) {
                            buildLegalGrContactProfile(properties);
                        }
                    }
                },
            },
            cart        : {
                create  : {
                    ns : function (index, name) {
                        createCartNs(index, name);
                    }
                },
                test    : {
                    delete : function ($delete, $edit, order) {
                        $delete = $('[data-cart-item-id="' + $delete + '"]');
                        $edit   = $('[data-cart-item-id="' + $edit + '"]');

                        if($delete.length < 0 || $edit.length < 0)
                            throw 'Targets not found';

                        if(typeof order == 'undefined'){
                            if(!$delete.is('input'))
                                $delete.find('.delete:first').click();
                            else
                                $delete.prop('checked', false).trigger('change');

                            $edit.find('.length:not(.active):first a').click();
                        }else{
                            $edit.find('.length:not(.active):first a').click();

                            if(!$delete.is('input'))
                                $delete.find('.delete:first').click();
                            else
                                $delete.prop('checked', false).trigger('change');
                        }
                    },
                    add     : function ($add, $edit, order) {
                        if(typeof $add != 'object' || $add[0] == false || $add[1] == false)
                            throw 'Item to add not found';

                        $add    = $('[data-cart-item-id="' + $add[0]  + '"] [data-cross-product-sku="' + $add[1] + '"]');
                        $edit   = $('[data-cart-item-id="' + $edit + '"]');

                        if($add.length < 0 || $edit.length < 0)
                            throw 'Targets not found';

                        if(typeof order == 'undefined'){
                            $add.click();

                            $edit.find('.length:not(.active):first a').click();
                        }else{
                            $edit.find('.length:not(.active):first a').click();

                            $add.click();
                        }
                    }
                }
            },
            nsgroup     : {
                createNSGroup : function (nameserver_group_name, nameservers) {
                    execCreateNSGroup(nameserver_group_name, nameservers);
                },
                addNSToGroup : function (nameserver_group_id, nameservers) {
                    execAddNSToGroup(nameserver_group_id, nameservers);
                },
                editNSGroup : function (id, name) {
                    execEditNSGroup(id, name);
                },
                deleteNSGroup : function (id) {
                    execDeleteNSGroup(id);
                }
            },
            ns          : {
                editNameServer : function (nameserver_group_id, id, name) {
                    execEditNameServer(nameserver_group_id, id, name);
                },
                deleteNameServer : function (group_id, id) {
                    execDeleteNameServer(group_id, id);
                }
            },
            convert     : {
                obj         : function (obj) {
                    objectToList(obj);
                },
                json        : function (obj) {
                    objectToList(JSON.parse(obj));
                },
                create_cont : {
                    obj         : function (obj) {
                        var cont = $('#objlist');

                        if(cont.length < 1)
                            cont = $('body').append('<div id="objlist" style="position:absolute; top:0; left:0; width:100%; height:10000px; z-index: 1000; background-color: black; color: whitesmoke"><ul></ul></div>').find('#objlist');


                        objectToList(obj, cont);
                    },
                    json        : function (obj) {
                        var cont = $('#objlist');

                        if(cont.length < 1)
                            cont = $('body').append('<div id="objlist" style="position:absolute; top:0; left:0; width:100%; height:10000px; z-index: 1000; background-color: black; color: whitesmoke"><ul></ul></div>').find('#objlist');


                        objectToList(JSON.parse(obj), cont);
                    },
                }
            },
            ssl         : {
                enroll  : {
                    wokmeeu : {
                        step1 : function (callback) {
                            form = $('#enter_csr_form');

                            form.find('#new_btn').attr('checked', true);
                            form.find('#csr_input').val('-----BEGIN CERTIFICATE REQUEST-----\r\nMIICxDCCAawCAQAwfzELMAkGA1UEBhMCR1IxDzANBgNVBAgTBkF0dGljYTEPMA0G\r\nA1UEBxMGQXRoZW5zMRAwDgYDVQQKEwdXT0sgV09LMQswCQYDVQQLEwJJVDERMA8G\r\nA1UEAxMId29rbWUuZXUxHDAaBgkqhkiG9w0BCQEWDWF1YkBkbmhvc3QuZ3IwggEi\r\nMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAOXkKiuFYxldt/AME7RPKYqpa\r\nzXzNz76yh7OvRKDwawSep2unzS3zXhfJdzSrGBuDyK1R5j9DOCvOZ5w16QT+PjXA\r\nBz8tun4PyXFTdyzqtO9hYW4XlutDmC3BtgPFEmHcP5ABTTqPAzYubgo9PZudaBHE\r\n39iN9St9lJ3e9TMAFD7YQ0N9xc5PjoLFzjVVvK5OpERsw0QkOzbn/CUuNRqseFvS\r\n06ZBL2Gz6j2haRboy+maQr9draR1vlbnI2nX2ECuRSHR3DlB8tzp1enTySqaCRA1\r\nva1IWUUL70KyZEwdPH47q3sehTx8E/oWJ3jTJqjIAsdthxhSFz9Bk3zvj15rAgMB\r\nAAGgADANBgkqhkiG9w0BAQUFAAOCAQEAWYTMXV6qVo9F4xqEVm/0IpX/c4PkM0dy\r\n2/4fKr2FSw+PLyvx0bDVlzVVqt9LvBgA29gsnerZADPVpf5UgAKbK9lOUwk7iZ/b\r\nA6jZzg9SslV3kVYDbXTE5oOIAyQmEJ2kxUEYr/RMZjptWDin1IQzTCnuH4JFNVO4\r\nSL4JmrtcDGm5D2tGZz2fR0rKNkl5Uw8kex//rW0oHhVilAJMi1LRlmWHAel1x74Z\r\nh1Me3B3ArfMHn3rDhyA9vif1vgixBvPF6j+JD8QjPv8UVzYnqypjo+UrTWAuI08/\r\nTRBllDIYDtOLZT2WcMdW0JALNfGgp5bPFgww4nAaNnyrxEy1y7oP4w==\r\n-----END CERTIFICATE REQUEST-----').trigger('input');

                            form.find('[value="http_file"]').closest('label').click();

                            if (typeof callback == 'function') {
                                callback();
                            }
                        },
                        step2 : function (callback) {
                            form = $('#verify_details_form');

                            var approver_email = form.find('#approver_email');
                            approver_email.chosen_update(approver_email.find('option:first').val());

                            form.find('#admin_title_mr').attr('checked', true);
                            form.find('#admin_first_name').val('George');
                            form.find('#admin_last_name').val('Gkogkas');
                            form.find('#admin_email').val('gbgkogkas@gmail.com');
                            form.find('#admin_phone').val('6955428842');

                            form.find('#agreement_btn').attr('checked', true);

                            if (typeof callback == 'function') {
                                callback();
                            }
                        },
                        step3 : function (callback) {
                            form = $('#company_info_form');

                            form.find('#org_division').val('IT');
                            form.find('#org_phone').val('6955428842');
                            form.find('#org_address').val('Iera odos 15');
                            form.find('#org_zip').val('12244');

                            if (typeof callback == 'function') {
                                callback();
                            }
                        }
                    },
                    wokmeeu_renew : {
                        step1 : function () {
                            form = $('#enter_csr_form');

                            form.find('#renew_btn').attr('checked', true);
                            form.find('#csr_input').val('-----BEGIN CERTIFICATE REQUEST-----\r\nMIICxDCCAawCAQAwfzELMAkGA1UEBhMCR1IxDzANBgNVBAgTBkF0dGljYTEPMA0G\r\nA1UEBxMGQXRoZW5zMRAwDgYDVQQKEwdXT0sgV09LMQswCQYDVQQLEwJJVDERMA8G\r\nA1UEAxMId29rbWUuZXUxHDAaBgkqhkiG9w0BCQEWDWF1YkBkbmhvc3QuZ3IwggEi\r\nMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAOXkKiuFYxldt/AME7RPKYqpa\r\nzXzNz76yh7OvRKDwawSep2unzS3zXhfJdzSrGBuDyK1R5j9DOCvOZ5w16QT+PjXA\r\nBz8tun4PyXFTdyzqtO9hYW4XlutDmC3BtgPFEmHcP5ABTTqPAzYubgo9PZudaBHE\r\n39iN9St9lJ3e9TMAFD7YQ0N9xc5PjoLFzjVVvK5OpERsw0QkOzbn/CUuNRqseFvS\r\n06ZBL2Gz6j2haRboy+maQr9draR1vlbnI2nX2ECuRSHR3DlB8tzp1enTySqaCRA1\r\nva1IWUUL70KyZEwdPH47q3sehTx8E/oWJ3jTJqjIAsdthxhSFz9Bk3zvj15rAgMB\r\nAAGgADANBgkqhkiG9w0BAQUFAAOCAQEAWYTMXV6qVo9F4xqEVm/0IpX/c4PkM0dy\r\n2/4fKr2FSw+PLyvx0bDVlzVVqt9LvBgA29gsnerZADPVpf5UgAKbK9lOUwk7iZ/b\r\nA6jZzg9SslV3kVYDbXTE5oOIAyQmEJ2kxUEYr/RMZjptWDin1IQzTCnuH4JFNVO4\r\nSL4JmrtcDGm5D2tGZz2fR0rKNkl5Uw8kex//rW0oHhVilAJMi1LRlmWHAel1x74Z\r\nh1Me3B3ArfMHn3rDhyA9vif1vgixBvPF6j+JD8QjPv8UVzYnqypjo+UrTWAuI08/\r\nTRBllDIYDtOLZT2WcMdW0JALNfGgp5bPFgww4nAaNnyrxEy1y7oP4w==\r\n-----END CERTIFICATE REQUEST-----').trigger('input');

                            form.find('[value="http_file"]').closest('label').click();
                        },
                        step2 : function () {
                            form = $('#verify_details_form');

                            var approver_email = form.find('#approver_email');
                            approver_email.chosen_update(approver_email.find('option:first').val());

                            form.find('#admin_title_mr').attr('checked', true);
                            form.find('#admin_first_name').val('George');
                            form.find('#admin_last_name').val('Gkogkas');
                            form.find('#admin_email').val('gbgkogkas@gmail.com');
                            form.find('#admin_phone').val('6955428842');

                            form.find('#agreement_btn').attr('checked', true);
                        },
                        step3 : function () {
                            form = $('#company_info_form');

                            form.find('#org_division').val('IT');
                            form.find('#org_phone').val('6955428842');
                            form.find('#org_address').val('Iera odos 15');
                            form.find('#org_zip').val('12244');
                        }
                    }
                }
            },
            coupons     : {
                create : {
                    extract : function () {
                        var inputs = '';

                        if ($('#triggers_step .product_form').length > 1)
                            for (var i = 1; i < $('#triggers_step .product_form').length; i++) {
                                inputs += "$('#triggers_step .add:first').click();\r\n";
                            }

                        if ($('#constraints_step .product_form').length > 1)
                            for (var i = 1; i < $('#constraints_step .product_form').length; i++) {
                                inputs += "$('#constraints_step .add:last').click();\r\n";
                            }

                        $('#coupon_create_form').find('input:not([name="_token"]), select, textarea').each(function () {
                            var obj = $(this);

                            if (typeof obj.attr('name') != 'undefined' && !!obj.attr('name') && !!obj.val()) {
                                var tmp = "$('[name=\"" + obj.attr('name') + "\"]')";

                                if (!obj.is('[type="radio"]'))
                                    inputs += tmp;

                                if (!(obj.is('[type="radio"]') || obj.is('[type="checkbox"]'))) {
                                    if (typeof obj.val() == 'string') {
                                        inputs += ".val('" + obj.val() + "')";
                                    } else if (typeof obj.val() == 'object') {
                                        var values = obj.val();

                                        for (var i in values) {
                                            if (values.hasOwnProperty(i)) {
                                                inputs += ".find('option[value=\"" + values[i] + "\"]').attr('selected', 'selected');\r\n";
                                                inputs += "$('[name=\"" + obj.attr('name') + "\"]')";
                                            }
                                        }
                                    }

                                    if (obj.val())
                                        inputs += ".change()";
                                } else if (obj.is('[type="radio"]')) {
                                    inputs += "$('[name=\"" + obj.attr('name') + "\"][value=\"" + obj.val() + "\"]').prop('checked', " + obj.prop('checked') + ")";

                                    if (obj.prop('checked')) {
                                        inputs += ".change()";
                                    }
                                } else if (obj.is('[type="checkbox"]')) {
                                    inputs += ".prop('checked', " + obj.prop('checked') + ").change()";
                                }

                                inputs += ";\r\n";

                                inputs = inputs.replace(tmp + ";\r\n", '');
                            }
                        });

                        console.log(inputs);
                    },
                    coupon1 : function () {
                        $('#triggers_step .add:first').click();
                        $('#triggers_step .add:first').click();
                        $('[name="manual_code"]').val('BROWNZEBRA77').change();
                        $('[name="greek_title"]').val('Δοκιμαστικό κουπόνι').change();
                        $('[name="greek_description"]').val('Αυτό είναι ένα δοκιμαστικό κουπόνι').change();
                        $('[name="english_title"]').val('Test coupon').change();
                        $('[name="english_description"]').val('This is a test coupon').change();
                        $('[name="comment"]').val('This is a test coupon').change();
                        $('[name="trigger_target_type"][value="previous_order"]').prop('checked', false);
                        $('[name="trigger_target_type"][value="in_cart"]').prop('checked', true).change();
                        $('[name="trigger_minimum_duration"]').val('1').change();
                        $('[name="trigger_amount"]').val('10').change();
                        $('[name="trigger_start"]').val('08/03/2018 10:22:22').change();
                        $('[name="trigger_end"]').val('10/03/2018 10:22:22').change();
                        $('[name="trigger_category_prompt_1"][value="specify"]').prop('checked', true).change();
                        $('[name="trigger_category_prompt_1"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_category_prompt_1"][value="all"]').prop('checked', false);
                        $('[name="trigger_select_category_1"]').val('10').change();
                        $('[name="trigger_product_prompt_1"][value="specify"]').prop('checked', false);
                        $('[name="trigger_product_prompt_1"][value="currently_active"]').prop('checked', true).change();
                        $('[name="trigger_product_prompt_1"][value="all"]').prop('checked', false);
                        $('[name="trigger_select_product_1"]').change();
                        $('[name="trigger_action_prompt_1"][value="specify"]').prop('checked', false);
                        $('[name="trigger_action_prompt_1"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_action_prompt_1"][value="all"]').prop('checked', false);
                        $('[name="trigger_category_prompt_2"][value="specify"]').prop('checked', true).change();
                        $('[name="trigger_category_prompt_2"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_category_prompt_2"][value="all"]').prop('checked', false);
                        $('[name="trigger_select_category_2"]').val('8').change();
                        $('[name="trigger_product_prompt_2"][value="specify"]').prop('checked', true).change();
                        $('[name="trigger_product_prompt_2"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_product_prompt_2"][value="all"]').prop('checked', false);
                        $('[name="trigger_select_product_2"]').find('option[value="458"]').attr('selected', 'selected');
                        $('[name="trigger_select_product_2"]').find('option[value="459"]').attr('selected', 'selected');
                        $('[name="trigger_select_product_2"]').change();
                        $('[name="trigger_action_prompt_2"][value="specify"]').prop('checked', false);
                        $('[name="trigger_action_prompt_2"][value="currently_active"]').prop('checked', true).change();
                        $('[name="trigger_action_prompt_2"][value="all"]').prop('checked', false);
                        $('[name="trigger_category_prompt_3"][value="specify"]').prop('checked', true).change();
                        $('[name="trigger_category_prompt_3"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_category_prompt_3"][value="all"]').prop('checked', false);
                        $('[name="trigger_select_category_3"]').val('13').change();
                        $('[name="trigger_product_prompt_3"][value="specify"]').prop('checked', false);
                        $('[name="trigger_product_prompt_3"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_product_prompt_3"][value="all"]').prop('checked', true).change();
                        $('[name="trigger_select_product_3"]').change();
                        $('[name="trigger_action_prompt_3"][value="specify"]').prop('checked', false);
                        $('[name="trigger_action_prompt_3"][value="currently_active"]').prop('checked', false);
                        $('[name="trigger_action_prompt_3"][value="all"]').prop('checked', false);
                        $('[name="trigger_target_method"][value="and"]').prop('checked', false);
                        $('[name="trigger_target_method"][value="or"]').prop('checked', true).change();
                        $('[name="constraints_minimum_duration"]').val('1').change();
                        $('[name="constraints_start"]').val('08/03/2018 10:24:24').change();
                        $('[name="constraints_end"]').val('10/03/2018 10:24:24').change();
                        $('[name="constraint_category_prompt_1"][value="specify"]').prop('checked', true).change();
                        $('[name="constraint_category_prompt_1"][value="currently_active"]').prop('checked', false);
                        $('[name="constraint_category_prompt_1"][value="all"]').prop('checked', false);
                        $('[name="constraint_select_category_1"]').val('1').change();
                        $('[name="constraint_product_prompt_1"][value="specify"]').prop('checked', true).change();
                        $('[name="constraint_product_prompt_1"][value="currently_active"]').prop('checked', false);
                        $('[name="constraint_product_prompt_1"][value="all"]').prop('checked', false);
                        $('[name="constraint_select_product_1"]').find('option[value="1"]').attr('selected', 'selected');
                        $('[name="constraint_select_product_1"]').change();
                        $('[name="constraint_action_prompt_1"][value="specify"]').prop('checked', false);
                        $('[name="constraint_action_prompt_1"][value="currently_active"]').prop('checked', false);
                        $('[name="constraint_action_prompt_1"][value="all"]').prop('checked', true).change();
                        $('[name="max_allowed_uses"]').val('100').change();
                        $('[name="max_allowed_uses_per_user"]').val('10').change();
                        $('[name="max_allowed_uses_per_item"]').val('2').change();
                        $('[name="combine_offer"]').prop('checked', true).change();
                        $('[name="combine_coupons"]').prop('checked', true).change();
                        $('[name="trigger_on_user_custom_price"]').prop('checked', true).change();
                        $('[name="apply_to"][value="apply_to_all"]').prop('checked', true).change();
                        $('[name="apply_to"][value="tiers_separately"]').prop('checked', false);
                        $('[name="discount_type"][value="amount"]').prop('checked', false);
                        $('[name="discount_type"][value="percentage"]').prop('checked', true).change();
                        $('[name="amount"]').val('12').change();
                    }
                }
            }
        }
    });

    function buildCYBillingProfile () {
        $('[name="country"]').chosen_update('CY').change();
        $('[name="name"]').val('Γυριζοντας με ποδυλατο');
        $('[name="vatpref"]').val('CY');
        $('[name="vat"]').val('10325319I');
        $('[name="address"]').val('Λ Παυλοπουλο 38');
        $('[name="city"]').val('Ροδα');
        $('[name="state"]').val('Αχαραβη');
        $('[name="zip"]').val('1000');
    }

    function buildTHBillingProfile () {
        $('[name="country"]').chosen_update('TH').change();
        $('[name="name"]').val('Inport Βureau');
        $('[name="address"]').val('111 M.3 Changwattana Road');
        $('[name="city"]').val('Laksi');
        $('[name="state"]').val('Bangkok');
        $('[name="zip"]').val('10210');
    }


    function buildIndividualGrContactProfile (properties) {

        if(typeof properties == 'string'){
            switch (properties){
                case 'doc' :
                    console.log('Properties: ' + [
                        'name',
                        'subname'
                    ]);
                    break;
            }

            return ;
        }

        $('[name="type"]').chosen_update('individual').change();
        $('[name="country"]').chosen_update('GR');
        $('[name="state_id"]').chosen_update('Αττική');
        $('[name="phone_country"]').chosen_update('GR');
        $('#mr_radio_ind').prop({'checked': true});
        $('[name="first_name"]').val(((properties && properties.name) ? properties.name : 'Sofia'));
        $('[name="last_name"]').val(((properties && properties.subname) ? properties.subname : 'Dimaka'));
        $('[name="address_0"]').val('Address');
        $('[name="zip"]').val('12244');
        $('[name="city"]').val('city');
        $('[name="email"]').val('contacts@email.com');
        $('[name="phone"]').val('6955428842');
    }

    function buildIndividualFRContactProfile (properties) {

        if(typeof properties == 'string'){
            switch (properties){
                case 'doc' :
                    console.log('Properties: ' + [
                            'name',
                            'subname'
                        ]);
                    break;
            }

            return ;
        }

        $('[name="type"]').chosen_update('individual').change();
        $('[name="country"]').chosen_update('FR').change();
        $('[name="state"]').val('A France State');
        $('[name="phone_country"]').chosen_update('GR');
        $('#mr_radio_ind').prop({'checked': true});
        $('[name="first_name"]').val(((properties && properties.name) ? properties.name : 'George'));
        $('[name="last_name"]').val(((properties && properties.subname) ? properties.subname : 'Gkogkas'));
        $('[name="address_0"]').val('Address');
        $('[name="zip"]').val('75008');
        $('[name="city"]').val('city');
        $('[name="email"]').val('contacts@email.com');
        $('[name="phone"]').val('6955428842');
    }

    function buildLegalGrContactProfile (properties){

        if(typeof properties == 'string'){
            switch (properties){
                case 'doc' :
                    console.log('Properties: ' + [
                            'organization',
                            'name',
                            'subname'
                        ]);
                    break;
            }

            return;
        }
        
        $('[name="type"]').chosen_update('legal').change();
        $('[name="country"]').chosen_update('GR').change();
        $('[name="state_id"]').chosen_update('Αττική');
        $('[name="phone_country"]').chosen_update('GR');
        $('[name="fax_country"]').chosen_update('null');
        $('#mr_radio_ind').prop({'checked': true});
        $('[name="organization"]').val(((properties && properties.organization) ? properties.organization : 'Blue Lagoon Mariners'));
        $('[name="address_0"]').val('Address');
        $('[name="zip"]').val('12244');
        $('[name="city"]').val('City');
        $('[name="email"]').val('contacts@email.com');
        $('[name="phone"]').val('6955428842');
        $('[name="first_name_leg"]').val(((properties && properties.name) ? properties.name : 'George'));
        $('[name="last_name_leg"]').val(((properties && properties.subname) ? properties.subname : 'Gkogkas'));
    }

    function createCartNs (index, name) {
        var el;
        name = (name) ? name : 'ns1.dnhost.gr';


        var form = $('[id$="nameservers_form"]:eq(' + (index - 1) + ')');

        if(form.length){
            var ns = form.find('.nameservers:visible:last');

            if(ns.val()){
                form.find('.addNameServers').click();
                ns = form.find('.nameservers:visible:last');
            }

            name = name.split('.');

            if(name[0].match(/[0-9]+$/))
                name[0] = name[0].replace(/[0-9]+$/, form.find('.nameservers:visible').length);

            name = name.join('.');

            ns.val(name);
        }
    }

    function execCreateNSGroup (nameserver_group_name, nameservers) {
        createNSGroup.data.nameserver_group_name = nameserver_group_name;
        createNSGroup.data.nameservers = nameservers;

        $.ajax(createNSGroup);
    }

    function execAddNSToGroup (nameserver_group_id, nameservers) {
        addNSToGroup.data.nameserver_group_id = nameserver_group_id;
        addNSToGroup.data.nameservers = nameservers;

        $.ajax(addNSToGroup);
    }

    function execEditNSGroup (id, name) {
        editNSGroup.data.id = id;
        editNSGroup.data.name = name;

        $.ajax(editNSGroup);
    }

    function execDeleteNSGroup (id) {
        deleteNSGroup.data.id= id;

        $.ajax(deleteNSGroup);
    }

    function execEditNameServer (nameserver_group_id, id, name) {
        editNameServer.data.nameserver_group_id = nameserver_group_id;
        editNameServer.data.id = id;
        editNameServer.data.name = name;

        $.ajax(editNameServer);
    }

    function execDeleteNameServer (group_id, id) {
        deleteNameServer.data.group_id = group_id;
        deleteNameServer.data.id = id;

        $.ajax(deleteNameServer);
    }

    function objectToList(obj, start, recursion){

        if(typeof start == 'undefined'){
            console.clear();
            $('body').empty().append('<ul></ul>');
            start = $('body');
        }

        var ul = start.find('ul:last');

        $.each(obj, function (key, value){
            var li = ul.append('<li>' + key + '</li>').find('li:last');

            if(typeof value == 'object'){
                if($.isEmptyObject(value)){
                    li.text(li.text() + ' : {}');
                }else{
                    if(value instanceof $){
                        li.text(li.text() + ' : $.object');
                    }else{
                        li.html(li.html() + '<span> : <br><span class="toggleList">{</span></span>');
                        li.append('<ul></ul>');
                        objectToList(value, li, true);
                        li.html(li.html() + '<span> }</span>');
                    }
                }
            }else{
                li.text(li.text() + ' : ' + value);
            }
        });

        if(typeof recursion == 'undefined') {
            $(document).on('click', '.toggleList', function () {
                var obj = $(this);


                if (obj.hasClass('closed')) {
                    obj.removeClass('closed').closest('li').find('ul').hide();
                } else {
                    obj.addClass('closed').closest('li').find('> ul').show();
                }
            });

            style = '';

            style += '.toggleList{display: block; width: 2rem;} .toggleList:hover{cursor:pointer}';

            start.prepend('<style>' + style + '</style>');
        }
    }

    createNSGroup = new $.ajax_prototype({
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/create',
        'data'  : {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier,
            'nameserver_group_name' : '',
            'nameservers'   : []
        },
        success : function (data) {
            console.log(data);
        }
    });

    addNSToGroup = new $.ajax_prototype({
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/add',
        'data'  : {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier,
            'nameserver_group_id'   : '',
            'nameservers'   : []
        },
        success : function (data) {
            console.log(data);
        }
    });

    editNSGroup = new $.ajax_prototype({
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/edit',
        'data'  : {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier,
            'id'        : '',
            'name'      : ''
        },
        success : function (data) {
            console.log(data);
        }
    });

    deleteNSGroup = new $.ajax_prototype({
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/delete',
        'data'  : {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier,
            'id'        : '',
        },
        success : function (data) {
            console.log(data);
        }
    });

    editNameServer = new $.ajax_prototype({
        timeout  : 30000,
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/ns/edit',
        'data'  : {
            '_token'                : $('[name="_token"]').val(),
            'unique_id'             : unique_page_identifier,
            'nameserver_group_id'   : '',
            'id'                    : '',
            'name'                  : ''
        },
        success : function (data) {
            console.log(data);
        }
    });

    deleteNameServer = new $.ajax_prototype({
        'type'  : 'POST',
        'url'   : 'http://site.dev/cart/nsgroup/ns/delete',
        'data'  : {
            '_token'    : $('[name="_token"]').val(),
            'unique_id' : unique_page_identifier,
            'group_id'  : '',
            'id'        : ''
        },
        success : function (data) {
            console.log(data);
        }
    });
});

function testEvent () {
    $.ajax({
        type:'POST',
        data:{
            '_token' : $('[name="_token"]').val()
        },
        success : function (data) {
            console.log(data);
        },
        url : 'http://site.dev/event/test'
    })
}