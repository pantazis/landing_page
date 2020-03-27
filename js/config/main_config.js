transition_end_events = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

time_out_count = 30000;

cookie_expiration = {
    cookie_acceptance : 1095
};

error_codes= {
    validation_error                                            : 100,
    invalid_verification_code                                   : 101,
    sql_error                                                   : 120,
    update_db_error                                             : 126,
    delete_db_error                                             : 127,
    unrecognized_action                                         : 150,
    action_not_allowed                                          : 151,
    action_allowed_only_to_users                                : 152,
    insufficient_permissions                                    : 175, //In global application errors
    session_error                                               : 400,
    session_active                                              : 402,
    ip_blacklisted                                              : 403,
    success                                                     : 1000,
    no_change                                                   : 1005,
    profile_updated_successfully                                : 1050,
    contact_info_are_valid                                      : 1051,
    email_verified_successfully                                 : 1052,
    mobile_verified_successfully                                : 1053,
    email_verified_mobile_not                                   : 1055,
    mobile_verified_email_not                                   : 1056,
    verify_code_resend                                          : 1059,
    verification_target_already_validated                       : 1060,
    verification_target_not_exists                              : 1061,
    verification_code_already_pending                           : 1062,
    verification_code_sent_recently                             : 1063,
    mail_already_pending                                        : 1064,
    mobile_already_pending                                      : 1065,
    login_failed                                                : 2000,
    unauthorised_email                                          : 2001,
    two_factor_auth                                             : 2004,
    two_factor_fail                                             : 2005,
    account_auto_suspended                                      : 2010,
    account_suspended                                           : 2011,
    password_mismatch                                           : 2100,
    no_mobile_to_reset_by                                       : 2101,
    user_credit_exhausted                                       : 2104, //Local Error, designated to user profile, might be moved to global
    username_mismatch                                           : 2150,
    email_sent                                                  : 2160,
    sms_sent                                                    : 2161,
    password_reset_email_verified                               : 2162,
    reset_password_option_not_valid                             : 2163,
    two_factor_suc                                              : 2164,
    new_pass_sent                                               : 2200,
    user_status_not_found                                       : 2500,
    billing_not_found                                           : 3000,
    billing_profile_updated                                     : 3001,
    billing_set_default_not_allowed                             : 3002,
    contact_role_deletion_not_allowed                           : 7502,
    contact_profile_not_found                                   : 7503,
    contact_profile_updated                                     : 7510,
    contact_profile_completed                                   : 7511,
    contact_individual_name_mismatch                            : 7530,
    catalog_product_requires_configuration                      : 10005,
    sub_product_category_not_found                              : 10009,
    dedicated_extra_detail_already_exists                       : 10010,
    attribute_delete_failed_attach_products                     : 10013,
    sub_product_is_not_configured_for_auto_pricing              : 10016,
    sub_product_has_incorrect_auto_pricing_config               : 10017,
    action_not_allowed_on_product                               : 10019,
    registry_maintenance                                        : 26000, //In global application errors
    transfer_not_allowed_domain_not_registered                  : 26050,
    whois_not_supported_for_this_domain                         : 27000,
    whois_communications_failed                                 : 27001,
    whois_responded_with_error                                  : 27002,
    whois_responded_no_result                                   : 27003,
    whois_search_no_tld_given                                   : 27004,
    cookie_invalid_name                                         : 28000,
    empty_search                                                : 30001,
    too_long_search                                             : 30002,
    no_tld                                                      : 30003,
    multiple_registries                                         : 30005,
    not_enough_tld                                              : 30006,
    domain_keyword_not_valid                                    : 30008,
    domain_is_not_valid                                         : 30009, //In global application errors
    domain_check_failed                                         : 30010, //In global application errors
    domain_authorization_code_sent                              : 30012,
    domain_info_failed                                          : 30013, //In global application errors
    domain_does_not_exist                                       : 30014, //In global application errors
    send_authorization_code_failed                              : 30015,
    invalid_domain_cant_be_registered                           : 30019,
    domain_max_length_reached                                   : 30020, //In global application errors
    domain_registrant_is_dnhost                                 : 30021, //In global application errors
    invalid_epp_auth                                            : 30022,
    domain_not_registered_cant_be_transferred_not_registered    : 30023, //In global application errors
    can_not_get_premium_quote                                   : 30024, //In global application errors
    domain_register_failed                                      : 30025, //In global application errors
    domain_not_registered_cant_be_transferred_syntax_error      : 30026, //In global application errors
    domain_not_registered_cant_be_transferred_tld_unsupported   : 30027, //In global application errors
    domain_check_renew_with_auto_renew_failed                   : 30034, //In global application errors
    host_in_use_delete_not_allowed                              : 32006,
    nameserver_could_not_update                                 : 32050,
    nameserver_could_not_get_info                               : 32051,
    nameserver_exceed_upper_limit                               : 32052,
    nameserver_do_not_cover_lower_limit                         : 32053,
    nameserver_does_not_have_host                               : 32060,
    nameserver_group_does_not_exist                             : 32075,
    nameserver_group_creation_failed                            : 32077,
    nameserver_group_import_failed                              : 32078,
    contact_update_chargeable                                   : 32100,
    contact_update_not_allowed_for_role                         : 32101,
    contact_maximum_reached                                     : 32100,
    domain_contact_update_failed                                : 32103,
    contact_not_in_eu                                           : 32104,
    auxiliary_contacts_remove_failed                            : 32107, //Local Error, designated to internal transfer.
    free_hosting_cant_be_activated                              : 33003,
    cart_not_found                                              : 35000,
    cart_item_not_found                                         : 35001,
    cart_item_add_failed                                        : 35002,
    cart_action_exception                                       : 35003,
    item_already_in_cart                                        : 35004,
    item_already_in_cart_needs_confirmation                     : 35005, //In global application errors
    cart_option_error                                           : 35006, //In global application errors
    cart_attribute_error                                        : 35007, //In global application errors
    domain_already_in_cart                                      : 35008, //In global application errors
    parent_child_does_not_exist                                 : 35009, //In global application errors
    item_cant_be_child                                          : 35010, //In global application errors
    item_associated_as_child                                    : 35011, //In global application errors
    get_domain_info_failed                                      : 35013, //In global application errors
    cart_not_ready_check_items                                  : 35014,
    cart_not_associated_with_billing_profile                    : 35015, //In global application errors
    domain_check_failure                                        : 35018, //In global application errors
    cart_item_domain_contacts                                   : 35019,
    cart_item_attributes_missing                                : 35022, //In global application errors

    cart_extension_error                                        : 35024, //In global application errors
    sale_document_update_exception                              : 35500, //Local Error, designated to sale documents, might be moved to global
    sale_document_not_found                                     : 35502, //Local Error, designated to sale documents, might be moved to global
    due_status_does_not_allow_payment                           : 35503, //Local Error, designated to sale documents, might be moved to global
    due_type_does_not_allow_payment                             : 35504, //Local Error, designated to sale documents, might be moved to global
    paying_document_status_does_not_allow_payment               : 35505, //Local Error, designated to sale documents, might be moved to global
    paying_document_type_does_not_allow_payment                 : 35506, //Local Error, designated to sale documents, might be moved to global
    due_document_balance_already_paid                           : 35507, //Local Error, designated to sale documents, might be moved to global
    paying_document_balance_is_zero                             : 35508, //Local Error, designated to sale documents, might be moved to global
    document_action_not_permitted                               : 35510, //Local Error, designated to sale documents, might be moved to global
    requested_task_not_allowed                                  : 35511, //Local Error, designated to sale documents, might be moved to global
    document_status_not_permitted                               : 35512, //Local Error, designated to sale documents, might be moved to global
    document_balance_total_difference                           : 35513, //Local Error, designated to sale documents, might be moved to global
    no_due_document_defined                                     : 35514, //Local Error, designated to sale documents, might be moved to global
    no_paying_document_defined                                  : 35515, //Local Error, designated to sale documents, might be moved to global
    balance_must_be_zero_or_equal                               : 35516, //Local Error, designated to sale documents, might be moved to global
    undefined_document_status                                   : 35517, //Local Error, designated to sale documents, might be moved to global
    duplicate_file_on_legal_document                            : 35523, //Local Error, designated to legal documents
    order_not_found                                             : 35601, //Local Error, designated to sale orders, might be moved to global
    order_item_pending_process_after                            : 35602, //Local Error, designated to sale orders, might be moved to global
    order_item_expired                                          : 35603, //Local Error, designated to sale orders, might be moved to global
    order_requested_status_not_executable                       : 35604, //Local Error, designated to sale orders, might be moved to global
    invoice_billing_profile_missing                             : 36101, //Local Error, designated to sale invoices, might be moved to global
    invoice_must_be_requested_by_order                          : 36102, //Local Error, designated to sale invoices, might be moved to global
    invoice_already_exists_for_this_document                    : 36103, //Local Error, designated to sale invoices, might be moved to global
    credit_action_not_found                                     : 35700, //Local Error, designated to credit, might be moved to global
    credit_document_not_found                                   : 35701, //Local Error, designated to credit, might be moved to global
    credit_status_not_permitted                                 : 35702, //Local Error, designated to credit, might be moved to global
    credit_paying_not_allowed_by_status                         : 35703, //Local Error, designated to credit, might be moved to global
    debit_status_does_not_allow_cancel                          : 35802, //Local Error, designated to debit, might be moved to global
    notification_delete_failed                                  : 38001,
    ssl_does_not_exist                                          : 39750, //Local Error, designated to ssl, might be moved to global
    enrollment_already_exists                                   : 39751, //Local Error, designated to ssl, might be moved to global
    ssl_with_no_enrollment                                      : 39752, //Local Error, designated to ssl, might be moved to global
    ssl_status_does_not_allow_reissue                           : 39753, //Local Error, designated to ssl, might be moved to global
    ssl_status_does_not_allow_cancellation                      : 39754, //Local Error, designated to ssl, might be moved to global
    ssl_status_does_not_allow_renew                             : 39755, //Local Error, designated to ssl, might be moved to global
    request_not_allowed                                         : 39756, //Local Error, designated to ssl, might be moved to global
    fetching_agreement_failed                                   : 39757, //Local Error, designated to ssl, might be moved to global
    fetching_csr_details_failed                                 : 39758, //Local Error, designated to ssl, might be moved to global
    fetching_approver_list_failed                               : 39759, //Local Error, designated to ssl, might be moved to global
    communication_with_supplier_error                           : 39760, //Local Error, designated to ssl, might be moved to global
    certificate_enrollment_failed                               : 39764, //Local Error, designated to ssl, might be moved to global
    certificate_auto_reorder_failed                             : 39786, //Global Error, designated to ssl.
    certificate_out_of_renew_period                             : 39791, //Global Error, designated to ssl.
    ssl_store_in_maintenance                                    : 39792, //Global Error, designated to ssl.
    installation_service_needs_admin_vetting                    : 39797,
    hetzner_api_product_not_found                               : 40501, //Local Error, designated to dedicated create and edit form
    hetzner_api_could_not_resolve_host                          : 40505, //Local Error, designated to dedicated create and edit form
    create_info_archive_request_received                        : 43000, //Local Error, designated to gdpr create info archive success
    archived_info_pending_create                                : 43001, //Local Error, designated to gdpr, the archive is not ready yet
    archived_info_pending_download                              : 43002, //Local Error, designated to gdpr, the archive is ready
    profile_required_gdpr_approval                              : 43005, //Global Error, designated to gdpr.
    general_gdpr_approval_is_missing                            : 43006, //Global Error, designated to gdpr.
    pbas_account_required_gdpr_approval                         : 43007, //Global Error, designated to gdpr.
    token_error                                                 : 49500,
    network_connection_error                                    : 49997,
    undefined_code                                              : 50000,
    access_denied                                               : 100000
};

notification_ids = {
    1 : 'DOMAIN_EXPIRATION',
    2 : 'OFFER',
    3 : 'SYSTEM',
};

trigger_strings = {
    user_activated  : 'active',
};

REG = {
    'ALL_GR'                : {
        'REGEX'     : /[α-ωΑ-ΩάέύίόώήϋϊΰΐΆΊΈΌΉΏΪΫ]+/g,
        'CHAR_SET'  : 'α-ωΑ-ΩάέύίόώήϋϊΰΐΆΊΈΌΉΏΪΫ'
    },
    'ALL_NUM'               : {
        'REGEX'     : /[0-9]+/g,
        'CHAR_SET'  : '0-9'
    },
    'ALL_ALLOWED'           : {
        'REGEX'     : /[a-zA-Zα-ωΑ-Ωάύίόώέϊϋΐΰ0-9ÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ]+/g,
        'CHAR_SET'  : 'a-zA-Zα-ωΑ-Ωάύίόώέϊϋΐΰ0-9ÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ'
    },
    'ALL_ALLOWED_EXTENDED'  : {
        'REGEX'     : /[0-9a-zA-Zα-ωΑ-ΩάώέύίόήΰΐϋϊςÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ\-\.]+/g,
        'CHAR_SET'  : '0-9a-zA-Zα-ωΑ-ΩάώέύίόήΰΐϋϊςÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ\.\-'
    },
    'BASIC_LATIN'           : {
        'REGEX'     : /[a-zA-Z]+/g,
        'CHAR_SET'  : 'a-zA-Z'
    },
    'ASCII'                 : {
        'ONLY'      : {
            'REGEX' : /[\x00-\x7F]/g
        },
        'INVERSE'   : {
            'REGEX' : /[^\x00-\x7F]/g
        }
    },
    'DOMAIN': /:\/{2}|^[.]|[.]$|^[-]|[-]$|[-][.]|[.][-]|[.]{2,}|[-]{2,}|[^α-ωΑ-ΩάέώύίόήϊϋΰΐΆΈΎΊΌΉΫΪΏa-zA-Z\d.-]/gm,
    'NUMERIC' : {
        'IMPERIAL_PLAIN' : {
            'WHOLE_WORD' : /^-?[0-9]+(\.[0-9]+)?$/
        },
        'IMPERIAL_FORMATTED' : {
            'WHOLE_WORD' : /^-?[0-9]{1,3}(,[0-9]{3,3})(\.[0-9]+)?$/
        },
        'METRIC_PLAIN' : {
            'WHOLE_WORD' : /^-?[0-9]+(,[0-9]+)?$/
        },
        'METRIC_FORMATTED' : {
            'WHOLE_WORD' : /^-?[0-9]{1,3}(\.[0-9]{3,3})+(,[0-9]+)?$/
        }
    }
};

REG['NS_NAME'] = {
    'IDN_SUPPORT' : {
        'HOST' : {
            'REGEX' : new RegExp('([_]+|[^\\w' + REG.ALL_GR.CHAR_SET + '-])+','g')
        },
        'NAMESERVER' : {
            'REGEX' : new RegExp('([_]+|[^\\w' + REG.ALL_GR.CHAR_SET + '.-])+','g')
        },
    },
    'NO_IDN_SUPPORT' : {
        'HOST' : {
            'REGEX' :  new RegExp('([_]+|[^\\w-])+','g')
        },
        'NAMESERVER' : {
            'REGEX' :  new RegExp('([_]+|[^\\w.-])+','g')
        },
    }
};

cacheNames = {
    'domainSearch' : 'domainSearchCache'
}

validator_pass_config = {
    fontSize: '12pt',
    padding: '4px',
    bad : 'Very bad',
    weak : 'Weak',
    good : 'Good',
    strong : 'Strong'
};

// Width classification thresholds
width_threshold = {
    small   : {
        upper : 640
    },
    medium  : {
        lower : 641,
        upper : 1024,
    },
    large   : {
        lower : 1025,
        upper : 1440
    },
    x_large : {
        lower : 1441
    }
};

if(typeof urls != 'undefined')
    urls['access_denied'] = '/access_denied';
else
    urls = {
        'access_denied' : '/access_denied'
    };

$.extend(urls, {
    'newsletter_status' : '/newsletter/status'
});

identifiers = {
  inline_block_items_class : 'block_item'
};

site_map = {
    cart : baseUrl + '/cart'
};

$idle_times = {
    common    : 300000, //5 Minutes in seconds
    cart      : 300000, //5 Minutes in seconds
};