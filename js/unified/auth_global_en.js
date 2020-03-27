$(document).ready(function () {
    transition_end_events = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
    time_out_count = 3E4;
    cookie_expiration = {cookie_acceptance: 1095};
    error_codes = {
        validation_error: 100,
        invalid_verification_code: 101,
        sql_error: 120,
        update_db_error: 126,
        delete_db_error: 127,
        unrecognized_action: 150,
        action_not_allowed: 151,
        action_allowed_only_to_users: 152,
        insufficient_permissions: 175,
        session_error: 400,
        session_active: 402,
        ip_blacklisted: 403,
        success: 1E3,
        no_change: 1005,
        profile_updated_successfully: 1050,
        contact_info_are_valid: 1051,
        email_verified_successfully: 1052,
        mobile_verified_successfully: 1053,
        email_verified_mobile_not: 1055,
        mobile_verified_email_not: 1056,
        verify_code_resend: 1059,
        verification_target_already_validated: 1060,
        verification_target_not_exists: 1061,
        verification_code_already_pending: 1062,
        verification_code_sent_recently: 1063,
        mail_already_pending: 1064,
        mobile_already_pending: 1065,
        login_failed: 2E3,
        unauthorised_email: 2001,
        two_factor_auth: 2004,
        two_factor_fail: 2005,
        account_auto_suspended: 2010,
        account_suspended: 2011,
        password_mismatch: 2100,
        no_mobile_to_reset_by: 2101,
        user_credit_exhausted: 2104,
        username_mismatch: 2150,
        email_sent: 2160,
        sms_sent: 2161,
        password_reset_email_verified: 2162,
        reset_password_option_not_valid: 2163,
        two_factor_suc: 2164,
        new_pass_sent: 2200,
        user_status_not_found: 2500,
        billing_not_found: 3E3,
        billing_profile_updated: 3001,
        billing_set_default_not_allowed: 3002,
        contact_role_deletion_not_allowed: 7502,
        contact_profile_not_found: 7503,
        contact_profile_updated: 7510,
        contact_profile_completed: 7511,
        contact_individual_name_mismatch: 7530,
        catalog_product_requires_configuration: 10005,
        sub_product_category_not_found: 10009,
        dedicated_extra_detail_already_exists: 10010,
        attribute_delete_failed_attach_products: 10013,
        sub_product_is_not_configured_for_auto_pricing: 10016,
        sub_product_has_incorrect_auto_pricing_config: 10017,
        action_not_allowed_on_product: 10019,
        registry_maintenance: 26E3,
        transfer_not_allowed_domain_not_registered: 26050,
        whois_not_supported_for_this_domain: 27E3,
        whois_communications_failed: 27001,
        whois_responded_with_error: 27002,
        whois_responded_no_result: 27003,
        whois_search_no_tld_given: 27004,
        cookie_invalid_name: 28E3,
        empty_search: 30001,
        too_long_search: 30002,
        no_tld: 30003,
        multiple_registries: 30005,
        not_enough_tld: 30006,
        domain_keyword_not_valid: 30008,
        domain_is_not_valid: 30009,
        domain_check_failed: 30010,
        domain_authorization_code_sent: 30012,
        domain_info_failed: 30013,
        domain_does_not_exist: 30014,
        send_authorization_code_failed: 30015,
        invalid_domain_cant_be_registered: 30019,
        domain_max_length_reached: 30020,
        domain_registrant_is_dnhost: 30021,
        invalid_epp_auth: 30022,
        domain_not_registered_cant_be_transferred_not_registered: 30023,
        can_not_get_premium_quote: 30024,
        domain_register_failed: 30025,
        domain_not_registered_cant_be_transferred_syntax_error: 30026,
        domain_not_registered_cant_be_transferred_tld_unsupported: 30027,
        domain_check_renew_with_auto_renew_failed: 30034,
        host_in_use_delete_not_allowed: 32006,
        nameserver_could_not_update: 32050,
        nameserver_could_not_get_info: 32051,
        nameserver_exceed_upper_limit: 32052,
        nameserver_do_not_cover_lower_limit: 32053,
        nameserver_does_not_have_host: 32060,
        nameserver_group_does_not_exist: 32075,
        nameserver_group_creation_failed: 32077,
        nameserver_group_import_failed: 32078,
        contact_update_chargeable: 32100,
        contact_update_not_allowed_for_role: 32101,
        contact_maximum_reached: 32100,
        domain_contact_update_failed: 32103,
        contact_not_in_eu: 32104,
        auxiliary_contacts_remove_failed: 32107,
        free_hosting_cant_be_activated: 33003,
        cart_not_found: 35E3,
        cart_item_not_found: 35001,
        cart_item_add_failed: 35002,
        cart_action_exception: 35003,
        item_already_in_cart: 35004,
        item_already_in_cart_needs_confirmation: 35005,
        cart_option_error: 35006,
        cart_attribute_error: 35007,
        domain_already_in_cart: 35008,
        parent_child_does_not_exist: 35009,
        item_cant_be_child: 35010,
        item_associated_as_child: 35011,
        get_domain_info_failed: 35013,
        cart_not_ready_check_items: 35014,
        cart_not_associated_with_billing_profile: 35015,
        domain_check_failure: 35018,
        cart_item_domain_contacts: 35019,
        cart_item_attributes_missing: 35022,
        cart_extension_error: 35024,
        sale_document_update_exception: 35500,
        sale_document_not_found: 35502,
        due_status_does_not_allow_payment: 35503,
        due_type_does_not_allow_payment: 35504,
        paying_document_status_does_not_allow_payment: 35505,
        paying_document_type_does_not_allow_payment: 35506,
        due_document_balance_already_paid: 35507,
        paying_document_balance_is_zero: 35508,
        document_action_not_permitted: 35510,
        requested_task_not_allowed: 35511,
        document_status_not_permitted: 35512,
        document_balance_total_difference: 35513,
        no_due_document_defined: 35514,
        no_paying_document_defined: 35515,
        balance_must_be_zero_or_equal: 35516,
        undefined_document_status: 35517,
        duplicate_file_on_legal_document: 35523,
        order_not_found: 35601,
        order_item_pending_process_after: 35602,
        order_item_expired: 35603,
        order_requested_status_not_executable: 35604,
        invoice_billing_profile_missing: 36101,
        invoice_must_be_requested_by_order: 36102,
        invoice_already_exists_for_this_document: 36103,
        credit_action_not_found: 35700,
        credit_document_not_found: 35701,
        credit_status_not_permitted: 35702,
        credit_paying_not_allowed_by_status: 35703,
        debit_status_does_not_allow_cancel: 35802,
        notification_delete_failed: 38001,
        ssl_does_not_exist: 39750,
        enrollment_already_exists: 39751,
        ssl_with_no_enrollment: 39752,
        ssl_status_does_not_allow_reissue: 39753,
        ssl_status_does_not_allow_cancellation: 39754,
        ssl_status_does_not_allow_renew: 39755,
        request_not_allowed: 39756,
        fetching_agreement_failed: 39757,
        fetching_csr_details_failed: 39758,
        fetching_approver_list_failed: 39759,
        communication_with_supplier_error: 39760,
        certificate_enrollment_failed: 39764,
        certificate_auto_reorder_failed: 39786,
        certificate_out_of_renew_period: 39791,
        ssl_store_in_maintenance: 39792,
        installation_service_needs_admin_vetting: 39797,
        hetzner_api_product_not_found: 40501,
        hetzner_api_could_not_resolve_host: 40505,
        create_info_archive_request_received: 43E3,
        archived_info_pending_create: 43001,
        archived_info_pending_download: 43002,
        profile_required_gdpr_approval: 43005,
        general_gdpr_approval_is_missing: 43006,
        pbas_account_required_gdpr_approval: 43007,
        token_error: 49500,
        network_connection_error: 49997,
        undefined_code: 5E4,
        access_denied: 1E5
    };
    notification_ids = {1: "DOMAIN_EXPIRATION", 2: "OFFER", 3: "SYSTEM"};
    trigger_strings = {user_activated: "active"};
    REG = {
        "ALL_GR": {"REGEX": /[α-ωΑ-ΩάέύίόώήϋϊΰΐΆΊΈΌΉΏΪΫ]+/g, "CHAR_SET": "α-ωΑ-ΩάέύίόώήϋϊΰΐΆΊΈΌΉΏΪΫ"},
        "ALL_NUM": {"REGEX": /[0-9]+/g, "CHAR_SET": "0-9"},
        "ALL_ALLOWED": {
            "REGEX": /[a-zA-Zα-ωΑ-Ωάύίόώέϊϋΐΰ0-9ÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ]+/g,
            "CHAR_SET": "a-zA-Zα-ωΑ-Ωάύίόώέϊϋΐΰ0-9ÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ"
        },
        "ALL_ALLOWED_EXTENDED": {
            "REGEX": /[0-9a-zA-Zα-ωΑ-ΩάώέύίόήΰΐϋϊςÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ\-\.]+/g,
            "CHAR_SET": "0-9a-zA-Zα-ωΑ-ΩάώέύίόήΰΐϋϊςÀàÂâÆæÄäÇçÉéÈèÊêËëÎîÏïÔôŒœÖöÙùÛûÜüŸÿ.-"
        },
        "BASIC_LATIN": {
            "REGEX": /[a-zA-Z]+/g,
            "CHAR_SET": "a-zA-Z"
        },
        "ASCII": {"ONLY": {"REGEX": /[\x00-\x7F]/g}, "INVERSE": {"REGEX": /[^\x00-\x7F]/g}},
        "DOMAIN": /:\/{2}|^[.]|[.]$|^[-]|[-]$|[-][.]|[.][-]|[.]{2,}|[-]{2,}|[^α-ωΑ-ΩάέώύίόήϊϋΰΐΆΈΎΊΌΉΫΪΏa-zA-Z\d.-]/gm,
        "NUMERIC": {
            "IMPERIAL_PLAIN": {"WHOLE_WORD": /^-?[0-9]+(\.[0-9]+)?$/},
            "IMPERIAL_FORMATTED": {"WHOLE_WORD": /^-?[0-9]{1,3}(,[0-9]{3,3})(\.[0-9]+)?$/},
            "METRIC_PLAIN": {"WHOLE_WORD": /^-?[0-9]+(,[0-9]+)?$/},
            "METRIC_FORMATTED": {"WHOLE_WORD": /^-?[0-9]{1,3}(\.[0-9]{3,3})+(,[0-9]+)?$/}
        }
    };
    REG["NS_NAME"] = {
        "IDN_SUPPORT": {
            "HOST": {"REGEX": new RegExp("([_]+|[^\\w" + REG.ALL_GR.CHAR_SET + "-])+", "g")},
            "NAMESERVER": {"REGEX": new RegExp("([_]+|[^\\w" + REG.ALL_GR.CHAR_SET + ".-])+", "g")}
        },
        "NO_IDN_SUPPORT": {
            "HOST": {"REGEX": new RegExp("([_]+|[^\\w-])+", "g")},
            "NAMESERVER": {"REGEX": new RegExp("([_]+|[^\\w.-])+", "g")}
        }
    };
    cacheNames = {"domainSearch": "domainSearchCache"};
    validator_pass_config = {
        fontSize: "12pt",
        padding: "4px",
        bad: "Very bad",
        weak: "Weak",
        good: "Good",
        strong: "Strong"
    };
    width_threshold = {
        small: {upper: 640},
        medium: {lower: 641, upper: 1024},
        large: {lower: 1025, upper: 1440},
        x_large: {lower: 1441}
    };
    if (typeof urls != "undefined") urls["access_denied"] = "/access_denied"; else urls = {"access_denied": "/access_denied"};
    $.extend(urls, {"newsletter_status": "/newsletter/status"});
    identifiers = {inline_block_items_class: "block_item"};
    site_map = {cart: baseUrl + "/cart"};
    $idle_times = {common: 3E5, cart: 3E5};
});
var APP_LANG = {
    "MESSAGES": {
        "SOMETHING_GOES_WRONG": "Something went wrong. Please try again later.",
        "TIMEOUT": "There was no response from the server. Please try again.",
        "TIMEOUT_UNRECOVERABLE": {
            "TITLE": "No server response",
            "CONTENT": 'There seems to be a network connection issue. Please click \x3ca href\x3d"#" id\x3d"reloadbtn"\x3ehere\x3c/a\x3e to reload the page.'
        },
        "HTTP_ERROR": {
            400: "Http error: \x3cstrong\x3e400\x3c/strong\x3e",
            404: "We could not recognise the action you performed",
            429: "You performed too many requests",
            500: "Something went wrong. Please try again later.",
            503: "This service is temporally unavailable. Please try again later."
        },
        "ERROR": "There was an application error.",
        "RESPONSIVE_TABLES_ERROR": 'Due to technical reasons it was impossible to complete the action you requested. Please \x3ca href\x3d"#" id\x3d"reloadbtn"\x3eclick here\x3c/a\x3e to refresh or try later'
    },
    "STATE_INPUT_PLACEHOLDER": "Your state",
    "RESULTS_FOUND": {
        "result_found": "\x3cspan\x3e1\x3c/span\x3e result found",
        "results_found": "\x3cspan\x3e%%results%%\x3c/span\x3e results found.",
        "no_results_found": "\x3cspan\x3e0\x3c/span\x3e results found."
    },
    "RESP_TABLE_ACTIONS": {
        "actions": "ACTIONS",
        "edit": "Edit",
        "delete": "Delete",
        "manage": "Manage",
        "set_as_default": "Set as default",
        "default": "Default"
    },
    "STATUSES": {"active": "ACTIVE", "inactive": "INACTIVE", "deleted": "DELETED"},
    "TOOLTIPS": {"default_profile_admin": "This is the default profile of this user"},
    "MISC": {
        "ERROR": "Error",
        "REMOVE": "Remove",
        "INTERNATIONAL": "International",
        "DOMAIN_EXPIRATION": "Domain Expiration",
        "OFFER": "Offers",
        "SYSTEM": "System Notification"
    }
};
var COMMON_LANG = {
    LENGTH: {"MONTH": "month", "MONTHS": "months", "YEAR": "year", "YEARS": "years"},
    COUNTRIES: {
        "GB": "United Kingdom",
        "AT": "Austria",
        "BE": "Belgium",
        "BG": "Bulgaria",
        "FR": "France",
        "DE": "Germany",
        "DK": "Denmark",
        "CH": "Switzerland",
        "GR": "Greece",
        "EE": "Esthonia",
        "IE": "Ireland",
        "ES": "Spain",
        "IT": "Italy",
        "HR": "Croatia",
        "CY": "Cyprus",
        "LV": "Latvia",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "MT": "Malta",
        "NL": "Netherlands",
        "HU": "Hungary",
        "UA": "Ukraine",
        "PL": "Poland",
        "PT": "Portugal",
        "RO": "Romania",
        "SK": "Slovakia",
        "SI": "Slovenia",
        "SE": "Sweden",
        "CZ": "Czech Republic",
        "FI": "Finland",
        "OTHER": "Other country"
    },
    SIDE_NAV: {
        "ACCOUNT": "Account",
        "CART": "Cart",
        "SUPPORT": "Support",
        "LANG": "Language",
        "TAB_NAME": "Price settings",
        "VAT_TEMPLATES": {
            "WITHOUT": {"TEXT": "Prices without VAT", "TITLE": "Remove VAT"},
            "WITH": {"TEXT": "Prices with VAT", "TITLE": "Add VAT"}
        },
        "SELECTED_VAT": "Selected VAT",
        "CHANGE_VAT": "Change country VAT"
    },
    VAT: {
        "DISCLAIMER": {
            "VAT_ON": "Prices include VAT ##VAT##%.", "VAT_OFF": "Prices do not include VAT.", "VAT_ON_2": "w. VAT",
            "VAT_OFF_2": "+ VAT"
        }
    },
    BUTTONS: {
        CANCEL: "cancel",
        RESET_START: "Proceed",
        RESET_ACCESS: "Yes",
        RESET_SUBMIT: "Submit",
        RESET_CONTINUE: "Continue",
        RESET_NO_ACCESS: "No",
        RESET_ANS_FORGOT: "Forgot my answers",
        LOGIN: "Login",
        REGISTER: "Register"
    },
    LABEL: {"VERIFIED": "VERIFIED", "UNVERIFIED": "UNVERIFIED"},
    CONFIRMS: {
        USER_STATUS: {
            ACTIVE: "Are you sure you want to suspend %%USERNAME%%?",
            SUSPEND: "Are you sure you want to activate %%USERNAME%%?"
        }
    },
    STATUS: {ENABLE: "Enable", DISABLE: "Disable"},
    CONNECTIVITY: {PENDING_RESPONSE: "Pending response"},
    CART: {
        HARDWARE: "Hardware",
        SOFTWARE: "Software",
        MANAGEMENT: "Management",
        NETWORK: "Network",
        HOSTNAME: "Host name",
        CPU: "Επεξεργαστής",
        ADDITIONAL_CPU: "Additional CPU",
        RAM: "RAM",
        ADDITIONAL_RAM: "Additional RAM",
        RAM_SEMIDEDI: "RAM",
        HDD: "Δίσκοι",
        BACKUP: "Backup (μέσω FTP)",
        STORAGE_BOX: "Storage Box",
        OS: "Λειτουργικό",
        CP_DEDICATED: "Πίνακας ελέγχου",
        CP_VPS: "Πίνακας ελέγχου",
        WEB_SERVER: "Εξυπηρετητής",
        RAID: "RAID",
        BANDWIDTH: "Bandwidth",
        IPV4: "Ιδιωτική IPv4",
        MANUFACTURER: "Manufacturer",
        GPU: "GPU",
        DATACENTER: "Datacenter",
        REMOTE_CONSOLE: "Remote console",
        DDOS_PROTECTION: "DDOS protection",
        SUPPORT: "Support",
        TRAFFIC: "Traffic",
        BANDWIDTH_DEDI: "Bandwidth",
        TRAFFIC_DEDI: "Traffic",
        NET_PORTS: "Network Ports",
        MISC: {CHANGE: "Αλλαγή", ADDITION: "Προσθήκη"},
        IN_CART: "In cart",
        BUY_SERVICE: "Add to cart",
        RENEW: "Renew",
        ORDER: "Add to cart",
        ORDER_SSL: "Order a new SSL",
        TRAFIC: "Traffic",
        IO: "I/O",
        ENTRY_PROCESSES: "Entry Processes",
        EXCLUSIVE_IP_SEMIDEDI: "Dedicated IP",
        LITEMAGE: "Caching Option",
        DOMAIN_NAME: "Domain name"
    },
    DOMAINS: {
        TRANSFER: {
            UNDER_PROCESS: "Domain is under process",
            SUCCESSFUL_PROCESS: "Domain was transferred successfully to Dnhost"
        },
        RENEW: "Renew Domain",
        EMPTY_NS: "All servers will be deleted from registry",
        EMPTY_NS_CUSTOM_EXCLUDED: "All servers will be deleted from registry, except of custom nameservers",
        WHOIS: {EXTEND: "Add more years to ID Protect"},
        TRADE: {APPLICATION: {BUTTON: {FORTH: "Add to cart", OTHERS: "Domain owner change"}}}
    },
    MISC: {TODAY: "Today", CANCEL: "Cancel", RETURN: "Go back"},
    RESP_TABLE: {RENEW: "Renew"}
};
var TRANS = {
    LENGTH: {"MONTH": {1: "month", 2: "months"}, "YEAR": {1: "year", 2: "years"}},
    BILLING: {
        TYPE: {REC: "Receipt", INV: "Invoice"},
        STATUS: {SUCCESS: "ACTIVE", ERROR: "INACTIVE"},
        VAT: "VAT",
        DOY: "Tax office",
        FROM: "(from ##price##)"
    },
    CART: {
        DOMAIN_TRANSFER_SUCCESSFUL: {1: "Added to cart", 2: "All domains added to cart"},
        ATTRIBUTES: {SSL_INSTALL: {DOMAIN_NAME: "You must fill in the Domain name where the SSL will be installed"}},
        WARNINGS: {HOSTING: '\x3cstrong\x3eAttention!\x3c/strong\x3e This order is only for a new hosting plan. For renewal or upgrade please see \x3ca href\x3d"https://dnhost.gr/kb/article/AA-00718" target\x3d"_blank"\x3ehere\x3c/a\x3e.'},
        RGP_SETUP_FEE: "RGP fee",
        BUY_ACTION: "Add to cart"
    },
    DOMAINS: {
        NAMESERVER: {1: "Nameserver", 2: "Nameservers"},
        CONTACT_ROLES: {
            REGISTRANT: {DISPLAY: "Owner", FORM: {1: "Owner", 2: "Owner"}},
            ADMIN: {DISPLAY: "Administrator", FORM: {1: "Administrator", 2: "Administrator"}},
            TECH: {DISPLAY: "Technical", FORM: {1: "Technical", 2: "Technical"}},
            BILLING: {DISPLAY: "Billing", FORM: {1: "Billing", 2: "Billing"}}
        },
        RESPONSIVE_TABLES_PREVIEW: {
            REGISTERED: {1: "REGISTERED DOMAIN", 2: "REGISTERED DOMAINS"},
            EXPIRES: {1: "EXPIRES SOON", 2: "EXPIRING SOON"},
            EXPIRED: {1: "HAS EXPIRED", 2: "HAVE EXPIRED"},
            ID_PROTECT: {TITLE: {ON: "Domain is ID Protected", NA: "ID Protect not applicable"}}
        },
        INTERNAL_TRANSFER: {
            SINGLE_DOMAIN: "The transfer of \x3cstrong\x3e##domain##\x3c/strong\x3e to user \x3cstrong\x3e##user##\x3c/strong\x3e completed successfully.",
            MULTIPLE_DOMAINS: "The transfer of domains to user \x3cstrong\x3e##user##\x3c/strong\x3e completed successfully.",
            PASSED_INSPECTION: "Domain is ready for transfer"
        },
        SEARCHBAR: {
            MODE: {
                SEARCH: "SEARCH",
                SEARCH_TITLE: "Find your perfect domain",
                SEARCH_PH: "Find your perfect domain",
                TRANSFER: "TRANSFER",
                TRANSFER_TITLE: "Transfer your domains to Dnhost",
                TRANSFER_PH: "Transfer your domain to DNHOST"
            }
        },
        SEARCH: {
            FILTERS: {ALL: "All"}, ELNOTIFICATIONS: {
                SINGLEDOMAIN: '\x3cli\x3eΑν \x3cstrong\x3eείσαι ο κάτοχος\x3c/strong\x3e του ##transfer## και θες να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της \x3ca class\x3d"terms-link" href\x3d"https://www.eett.gr/opencms/opencms/EETT_EN/index.html"\x3eΕΕΤΤ\x3c/a\x3e, θα πρέπει πρώτα να μεταφέρεις το  ##transfer## στην DNHOST. \x3ca href\x3d"##route##" target\x3d"_blank" title\x3d"Μεταφορά Domain στην DNHOST" class\x3d"grFamilyTransferInit simple-link more-margin"\x3eΜετέφερέ το\x3ci class\x3d"icon-arrow-right22"\x3e\x3c/i\x3e\x3c/a\x3e\x3c/li\x3e\x3cli\x3eΑν \x3cstrong\x3eδεν είσαι ο κάτοχος\x3c/strong\x3e του ##transfer## και θες να κατοχυρώσεις το ##domain##, τότε επίλεξε την αυτόματη κατοχύρωση του .ελ, ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν \x3ca class\x3d"terms-link" href\x3d"##termsRoute##" title\x3d"Όροι κατοχύρωσης .ελ domains" target\x3d"_blank"\x3eόροι και προϋποθέσεις\x3c/a\x3e.\x3c/li\x3e',
                MULTIDOMAIN: '\x3cli\x3eΑν \x3cstrong\x3eείσαι ο κάτοχος\x3c/strong\x3e ενός εκ των παρακάτω .gr domains και θέλεις να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της \x3ca class\x3d"terms-link" href\x3d"https://www.eett.gr/opencms/opencms/EETT_EN/index.html"\x3eΕΕΤΤ\x3c/a\x3e, θα πρέπει πρώτα να μεταφέρεις στην DNHOST κάποιο από τα:\x3cdiv id\x3d"grFamilyTransferSelectableContainer" class\x3d"hidden"\x3e\x3cdiv class\x3d"for-el-backorder"\x3e\x3cdiv class\x3d"row collapse"\x3e##domains##\x3c/div\x3e\x3cdiv\x3e\x3ca id\x3d"grFamilyMultiDomainTransferBtn" href\x3d"##route##" target\x3d"_blank" title\x3d"Μεταφορά Domain στην DNHOST" class\x3d"grFamilyTransferInit simple-link more-margin" style\x3d"visibility: hidden"\x3eΜεταφορά\x3ci class\x3d"icon-arrow-right22"\x3e\x3c/i\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/li\x3e\x3cli\x3eΑν \x3cstrong\x3eδεν είσαι ο κάτοχος\x3c/strong\x3e κανενός εκ των παραπάνω .gr domains και θέλεις να κατοχυρώσεις το ##domain## τότε μπορείς να επιλέξεις την αυτόματη κατοχύρωση ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν \x3ca class\x3d"terms-link" href\x3d"##termsRoute##" title\x3d"Όροι κατοχύρωσης .ελ domains" target\x3d"_blank"\x3eόροι και προϋποθέσεις\x3c/a\x3e.\x3c/li\x3e'
            },
            BUTTONS: {CHECKING: "Checking"}
        },
        WARNINGS: {ELCOPYRIGHT: "To register this .ελ domain in DNHOST, the corresponding .gr domain must be in your DNHOST account.\n"}
    },
    SSL: {
        BUTTONS: {GET_CERTIFICATE: "Get Certificate", REISSUE: "Reissue", RENEW: "Renew", CANCEL: "Cancel"},
        STATUSES: {
            CANCELLED: "Cancelled",
            CAPS: {
                ACTIVE: "ACTIVE",
                INACTIVE: "INACTIVE",
                PENDING: "PENDING",
                CANCELLED: "CANCELLED",
                EXPIRED: "EXPIRED"
            }
        },
        ENROLLMENT: {
            VALIDATION: {
                INVALID_APPROVER_EMAIL: "Invalid email", MISSING_APPROVER_EMAIL: {
                    1: 'You have to set email for domain "##domain##"',
                    2: "You have to set emails for domains: ##domain##"
                }
            }
        },
        DETAILS: {REFUND: {SUCCESS: "REFUNDED", FAILED: "REFUND REJECTED", PENDING: "REFUND PROCESSING"}},
        ORDER_SSL_MODAL: {INITIAL: "Initial", DISCOUNT: "Discount", FINAL: "Final"},
        WHYNOPADLOCK: {
            DOMAINNAME: "Όνομα τομέα:",
            IPADDRESS: "IP διεύθυνση:",
            URLTESTED: "URL ελέγχου:",
            LINENUMBERS: "Αριθμός γραμμής",
            ISSUES: "Βρέθηκαν ##count## σφάλματα",
            INSECURELINK: {1: "Ανασφαλείς σύνδεσμος", 2: "Ανασφαλείς σύνδεσμοι"},
            NOERRORS: "Όλα τα αντικείμενα της σελίδας καλούνται επιτυχώς σε https!",
            FOUNDIN: "Βρέθηκε στο"
        },
        CSRDECODER: {
            COMMONNAME: "Common Name",
            ORGANIZATIONNAME: "Organization Name",
            ORGANIZATIONUNIT: "Organization Unit",
            LOCALITY: "Locality",
            STATE: "State",
            COUNTRY: "Country",
            EMAIL: "Email",
            KEYSIZE: "Key Size"
        }
    },
    HOSTING: {
        MAGENTO: {
            SHOWGRAPHS: {
                OPEN: 'See the comparative graphs \x3ci class\x3d"icon-arrow-down2"\x3e\x3c/i\x3e',
                CLOSE: 'Close the comparative graphs \x3ci class\x3d"icon-arrow-up2"\x3e\x3c/i\x3e'
            }
        },
        CREATE: {
            SKUAVAILABILITY: "Τo επιθυμιτό SKU είναι διαθέσιμο.",
            ATTRIBUTES_NAME_AVAILABILITY: "Τo επιθυμιτό Attribute Name είναι διαθέσιμο."
        }
    },
    DOCUMENTS: {
        CREDITS: {CANCELLED: "CANCELLED"},
        DEBITS: {
            ORDER: {
                EDIT: {
                    SUCCESS: "Order edit was successful",
                    FAILURE: {
                        EDITS_INVALID_LENGTH: "Invalid requested length",
                        DEL_NOT_FOUND: "Item does not exist in order, can be deleted"
                    }
                }
            }
        },
        TABS: {
            PAY_DOCUMENTS: {1: "Pay Document (##count##)", 2: "Pay Documents (##count##)"},
            PAYMENTS: {
                USED_TO_PAY_DOCUMENT: {1: "Used by (##count##)", 2: "Used by (##count##)"},
                PAID_BY_DOCUMENTS: {1: "Paid By (##count##)", 2: "Paid By (##count##)"}
            },
            PAY_WITH: {1: "Pay With Document (:count)", 2: "Pay With Documents (:count)"},
            ASSOCIATED: {1: "Συσχετισμένη κίνηση (##count##)", 2: "Συσχετισμένες κινήσεις (##count##)"}
        },
        PAYMENTS: {
            STATUS_HEADER: {BANK: "Πληρωμή μέσω τράπεζας"},
            STATUS: {PENDING: "Σε αναμονή εξόφλησης"},
            MSG: {PENDING: "ΠΕΡΙΜΕΝΟΥΜΕ ΤΗΝ ΠΛΗΡΩΜΗ ΣΟΥ"},
            BANK_NOTICE: {PENDING: "Μπορείς να πληρώσεις εδώ"}
        },
        STATUSES: {
            OPEN: "OPEN",
            ON_PAYMENT: "ON PAYMENT",
            PAID: "PAID",
            PENDING: "PENDING",
            COMPLETED: "COMPLETED",
            REFUNDED: "REFUNDED",
            PARTIALLY_REFUNDED: "PARTIALLY REFUNDED",
            CANCELLED: "CANCELLED",
            ERROR: "ERROR",
            OVERDUE: "OVERDUE",
            DECLINED: "DECLINED"
        },
        LEGAL_DOCUMENTS: {
            TITLE: {1: "Legal Document (##count##)", 2: "Legal Documents (##count##)"},
            TYPES: {INVOICE: "Invoice", RECEIPT: "Receipt"}
        }
    },
    FILE_MANAGE: {REMOVE: "Remove file", DOWNLOAD: "Download file"},
    MENU: {
        MAIN: {ADMIN: {DOMAIN_LIST: "All domains", HOSTING_LIST: "All hosting"}},
        STATIC: {TITLE: "SITE NAVIGATION"}
    },
    WHOIS: {MODAL: {TITLE: "##domain## - WHOIS DOMAIN"}},
    COUPONS: {CREATE: {ALL_USERS: "All", STATUS: {ACTIVE: "ΕΝΕΡΓΟ", WARNING: "ΣΕ ΑΝΑΜΟΝΗ"}}},
    GDPR: {
        REQUEST_ARCHIVE: "Ζήτησε μας τις πληροφορίες σου",
        ARCHIVE_READY: "Το αρχείο με τις πληροφορίες σου είναι έτοιμο",
        ARCHIVE_BUTTONS: {STEP_2: "Επαλήθευση κωδικού", STEP_3: "Λήψη αρχείου"},
        VALIDATE_AND_DOWNLOAD: "Βάλε τον κωδικό σου και κατεβασε",
        LOGIN: {
            EXPLANATION_TITLE: "Στα πλαίσια της συμμόρφωσης μας με τον Γενικό Κανονισμό Προστασίας Προσωπικών Δεδομένων θα χρειαστεί να αποδεχθείς τους παρακάτω όρους προκειμένου να χρησιμοποιείς τις υπηρεσίες μας.",
            EXPLANATION: '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΠοια προσωπικά δεδομένα ζητάμε;\x3c/strong\x3e\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font"\x3eΟνοματεπώνυμο, οργανισμός, τηλέφωνο, διεύθυνση, χώρα, email, επάγγελμα, ΑΦΜ, ΔΟΥ, IP διεύθυνση σύνδεσης.\x3c/p\x3e' +
                '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΓιατί θέλουμε τα προσωπικά σου δεδομένα;\x3c/strong\x3e\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font"\x3eΕίναι απαραίτητα για να σου παρέχουμε τις υπηρεσίες κατοχύρωσης ονομάτων χώρου, φιλοξενίας ιστοσελίδων \x26 email, έκδοσης πιστοποιητικών SSL και για την παροχή τεχνικής υποστήριξης, την εξυπηρέτηση και την τιμολόγηση σου.\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΤι κάνουμε με τα προσωπικά σου δεδομένα\x3c/strong\x3e\x3c/p\x3e' +
                '\x3cp class\x3d"smaller small-font"\x3eΤα αποθηκεύουμε στην κεντρική βάση δεδομένων πελατών μας, προστατεύοντάς τα με υψηλά μέτρα ασφαλείας και περιορισμού πρόσβασης σε αυτά μόνο από εξουσιοδημένα πρόσωπα.\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΜε ποιους και γιατί θέλουμε να μοιραστούμε τα προσωπικά σου δεδομένα;\x3c/strong\x3e\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font"\x3eΚοινοποιούμε τα προσωπικά δεδομένα μόνο με όσους τρίτους Οργανισμούς είναι απολύτως απαραίτητο για την παροχή της υπηρεσίας που θα αποκτήσεις: \x3c/p\x3e' +
                '\x3cul class\x3d"small-font" style\x3d"font-size: 0.925rem"\x3e' + "\x3cli\x3eΚατοχύρωση domain names: Στα Μητρώα Ονομάτων Χώρου για την τήρηση της βάσης δεδομένων τους (εντός και εκτός Ε.Ε.).\x3c/li\x3e" + "\x3cli\x3eΦιλοξενία ιστοσελίδων: Σε κανένα τρίτο οργανισμό, εξαιρετικά σπάνια ενδέχεται κάποιος τρίτος τεχνικός να έχει περιορισμένη κι ελεγχόμενη πρόσβαση για την επίλυση προβλημάτων με λογισμικό τρίτων κατασκευαστών (πχ Plesk).\x3c/li\x3e" + "\x3cli\x3eΈκδοση SSL: Στις αρχές έκδοσης SSL για την τήρηση της βάσης δεδομένων τους και τη διενέργεια των απαιτούμενων ελέγχων επικύρωσης στοιχείων (εντός και εκτός Ε.Ε.).\x3c/li\x3e" +
                "\x3cli\x3eΣτο λογιστικό μας γραφείο (εφόσον έχουμε εκδόσει ονομαστικό παραστατικό σε ιδιώτη ή ελεύθερο επαγγελματία) για την τήρηση των βιβλίων μας και τις καταχωρήσεις των σχετικών λογιστικών εγγραφών.\x3c/li\x3e" + "\x3c/ul\x3e" + '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΓιατί θέλουμε να μεταδώσουμε τα προσωπικά σου δεδομένα εκτός Ελλάδας και ΕΕ\x3c/strong\x3e\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font"\x3eΔιότι είναι απολύτως απαραίτητο για την παροχή των υπηρεσιών κατοχύρωσης ονομάτων χώρου (για συγκεκριμένες καταλήξεις/gTLDs: .com, .net κτλ) και έκδοσης ψηφιακών πιστοποιητικών ασφαλείας (SSL).\x3c/p\x3e' +
                '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΜπορείς να αποσύρεις την άδειά σου\x3c/strong\x3e\x3c/p\x3e' + '\x3cp class\x3d"smaller small-font"\x3eΌλα τα δεδομένα σου είναι προγραμματισμένα να διαγράφονται αυτόματα από τα συστήματά μας, όταν η αντίστοιχη υπηρεσία σου μαζί μας λήξει ή έχει μεταφερθεί σε άλλο πάροχο. \x3c/p\x3e' + '\x3cp class\x3d"smaller small-font no-margin-bottom"\x3e\x3cstrong\x3eΓια πόσο χρόνο διατηρούμε τα προσωπικά σου δεδομένα\x3c/strong\x3e\x3c/p\x3e' +
                '\x3cp class\x3d"smaller small-font"\x3eΜόνο για το χρόνο που είναι απολύτως απαραίτητος για την παροχή των υπηρεσιών μας. Τα δεδομένα διαγράφονται από τα συστήματα της DNHOST και των τρίτων, μετά την οριστική διακοπή της υπηρεσίας.\x3c/p\x3e' + "\x3chr\x3e\x3cbr\x3e",
            PROCESSING_APPROVAL_LABEL: "Δίνω τη ρητή συγκατάθεσή μου στην DNHOST να χρησιμοποιήσει τα προσωπικά δεδομένα μου (και τυχόν δεδομένα τρίτων, για λογαριασμό των οποίων ενεργώ), σύμφωνα με τα παραπάνω.",
            PROCESSING_APPROVAL_LABEL_ERROR: "Για τη συνέχιση χρήσης των υπηρεσιών μας πρέπει να συμφωνήσεις στη νόμιμη επεξεργασία των δεδομένων σου",
            DATA_VALIDITY_LABEL: "Δηλώνω υπευθύνως σύμφωνα με το νόμο 1599/86, ότι τα στοιχεία που δηλώνω είναι αληθή και ακριβή και δεν παραβιάζω εν γνώσει μου δικαιώματα τρίτων.",
            DATA_VALIDITY_LABEL_ERROR: "Για τη συνέχιση χρήσης των υπηρεσιών μας πρέπει να να επιβεβαιώσεις την ορθότητα των στοχείων σου.",
            COMMUNICATION_AGREEMENT_LABEL: "Συμφωνώ στη λήψη email και τηλεφωνικών κλήσεων για τεχνική υποστήριξη και σημαντικές ενημερώσεις σχετικά με τις υπηρεσίες που χρησιμοποιώ.",
            COMMUNICATION_AGREEMENT_LABEL_ERROR: "",
            NEWSLETTER_LABEL: "Θέλω να λαμβάνω email σχετικά με τα εταιρικά νέα, τα προϊόντα και ειδικές προσφορές σας.",
            ACCEPT_ALL_ABOVE_LABEL: "Αποδέχομαι τα παραπάνω",
            ACCEPT_ALL_ABOVE_LABEL_ERROR: "You should agree with the terms"
        },
        NEWSLETTER: {
            DISABLE: "You were successfully unsubscribed from our newsletter.",
            ENABLE: "Check your inbox to confirm your email subscription to our newsletter.",
            ENABLE_2: "Your subscription to our newsletter was successful.",
            RESEND: "Confirmation email was sent successfully.",
            ACCOUNT_CONFIRM_MODAL: {
                DISABLE: {
                    TITLE: "Unsubscribe Confirmation",
                    BODY: "Do you want to unsubscribe from our newsletter? Please confirm your unsubscription by clicking submit."
                },
                ENABLE: {
                    TITLE: "Confirm subscription",
                    BODY: "Do you want to subscribe to our newsletter? Please confirm your subscription by clicking submit button."
                }
            }
        }
    },
    PRICING: {MONTHLY_FEE_TITLE: "Monthly fee", SETUP_FEE: "Setup fee"},
    MISC: {
        TABLES: {NO_RESULTS: "No results"},
        SETUP_FEE: "Setup fee",
        DASHBOARD: "Dashboard",
        SIDR_MENU_TITLE: "MANAGE SERVICES",
        AMOUNT: "Amount",
        PERCENTAGE: "Percentage",
        DATES: {
            DAYS: "Days",
            HOURS: "Hours", MINUTES: "Minutes", SECONDS: "Seconds"
        },
        CLIPBOARD_COPIED: 'This "##text##" was added to your clipboard.',
        DOWNLOAD: "Download",
        LOGIN: "Login",
        ACCEPTANCE: "Accept",
        STATUSES: {
            ACTIVE: "ACTIVE",
            ACTIVE_FEMALE: "ACTIVE",
            INACTIVE: "INACTIVE",
            INACTIVE_FEMALE: "INACTIVE",
            DELETED: "DELETED",
            DELETE_FEMALE: "DELETED",
            PENDING: "PENDING",
            CANCELLED: "CANCELLED",
            COMPLETED: "COMPLETED",
            PROCESSING: "PROCESSING"
        },
        UNAVAILABLE_SKU: "The SKU:##sku## is not available.",
        UNAVAILABLE_ATTRIBUTE_NAME: "The name:##name## is not available.",
        STORAGE_TYPE: {SSD: "SSD", NVME: "NVMe", HDD: "HDD"}
    }
};
VALIDATION_MESSAGES = {
    "ERRORS": {
        "REQUIRED": "Please fill in all required fields",
        "EMAIL": "The email you gave is wrong",
        "LENGTH": {
            "MIN": "Your answer is shorter than ##n## characters",
            "MAX": "Your answer is larger than ##n## characters",
            "RANGE": "Your answer must be between ##min## - ##max## characters"
        },
        "INTERNATIONAL": "Your answer must not contain greek characters",
        "ILLEGAL": {"CHARS": "Your answer contains non acceptable characters"},
        "PASSWORD": "Your password is not strong enough",
        "NOTCONFIRMED": "It has not been validated",
        "IP": {
            "INVALID_CHARS": "The IP address you gave contains not acceptable characters",
            "INVALID_SYNTAX": "The syntax of the IP address you gave is not correct",
            "INVALID_FORMAT": "The IP address must have the format 0.0.0.0, with numbers from 0 to 255",
            "INVALID_FORMAT_V6": "The IPv6 address must have the format 0000:0000:0000:0000:0000:0000:0000:0000, with numbers from 0 to 255 and characters from A to F",
            "TOO_BIG_NUMS": "The IP address cannot contain numbers bigger than 255",
            "NO_IP": "No IP address was found"
        },
        "NAME_SERVERS": {
            "INVALID_CHARS": "The nameserver you want to store contains invalid characters.",
            "INVALID_SYNTAX": "The nameserver you want to store contains syntax errors.",
            "HOST_INVALID_FORMAT": "The nameserver you want to store must have the format xxx.##fqdn##.",
            "TOO_BIG_PREFIX": "The prefix of the nameserver you want to store cannot be larger than ##limit## characters",
            "PREFIX_NO_PERIODS": "The prefix of the nameserver you want to store cannot contain dots",
            "INVALID_HOST_ID": 'The nameserver you want to store can only contain "-", between two words.',
            "INVALID_NAMESERVER_DOMAIN": "The nameserver you want to store must have the format ns1.google.com",
            "UNACCEPTABLE_DOMAIN": "The nameserver you want to store is not acceptable"
        },
        "UNIQUE": "This value is not unique",
        "CONTACT_PROFILES": {"MISSING": "This contact profile has missing information, please fill them in."},
        "NOCHANGES": "No change detected.",
        "ASCII": "You can insert only ΑSCII characters in this field.",
        "NUMERIC": "The value must be a number",
        "VALUES": {
            "MIN": "The value can not be smaller than ##min##",
            "MAX": "The value can not be larger than ##max##"
        },
        "CUSTOM": {
            "WHOIS": {
                "POSTKEYWORD": {
                    "REQUIRED": "Please insert the domain you want to lookup",
                    "LENGTH": {"MIN": "A domain can not be shorter than ##n## characters"}
                }
            }
        }
    }
};

$(document).ready(function () {/*!
 * Pusher JavaScript Library v3.1.0
 * http://pusher.com/
 *
 * Copyright 2016, Pusher
 * Released under the MIT licence.
 */
    !function (t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Pusher = e() : t.Pusher = e()
    }(this, function () {
        return function (t) {
            function e(i) {
                if (n[i]) return n[i].exports;
                var o = n[i] = {exports: {}, id: i, loaded: !1};
                return t[i].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
            }

            var n = {};
            return e.m = t, e.c = n, e.p = "", e(0)
        }([function (t, e, n) {
            "use strict";
            var i = n(1);
            t.exports = i["default"]
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                if (null === t || void 0 === t) throw"You must pass your app key when you instantiate Pusher."
            }

            var o = n(2), r = n(9), s = n(23), a = n(38), c = n(39), u = n(40), l = n(12), h = n(5), f = n(62),
                p = n(8), d = n(42), y = function () {
                    function t(e, n) {
                        var l = this;
                        i(e), n = n || {}, this.key = e, this.config = r.extend(f.getGlobalConfig(), n.cluster ? f.getClusterConfig(n.cluster) : {}, n), this.channels = d["default"].createChannels(), this.global_emitter = new s["default"], this.sessionID = Math.floor(1e9 * Math.random()), this.timeline = new a["default"](this.key, this.sessionID, {
                            cluster: this.config.cluster,
                            features: t.getClientFeatures(),
                            params: this.config.timelineParams || {},
                            limit: 50,
                            level: c["default"].INFO,
                            version: h["default"].VERSION
                        }), this.config.disableStats || (this.timelineSender = d["default"].createTimelineSender(this.timeline, {
                            host: this.config.statsHost,
                            path: "/timeline/v2/" + o["default"].TimelineTransport.name
                        }));
                        var y = function (t) {
                            var e = r.extend({}, l.config, t);
                            return u.build(o["default"].getDefaultStrategy(e), e)
                        };
                        this.connection = d["default"].createConnectionManager(this.key, r.extend({
                            getStrategy: y,
                            timeline: this.timeline,
                            activityTimeout: this.config.activity_timeout,
                            pongTimeout: this.config.pong_timeout,
                            unavailableTimeout: this.config.unavailable_timeout
                        }, this.config, {encrypted: this.isEncrypted()})), this.connection.bind("connected", function () {
                            l.subscribeAll(), l.timelineSender && l.timelineSender.send(l.connection.isEncrypted())
                        }), this.connection.bind("message", function (t) {
                            var e = 0 === t.event.indexOf("pusher_internal:");
                            if (t.channel) {
                                var n = l.channel(t.channel);
                                n && n.handleEvent(t.event, t.data)
                            }
                            e || l.global_emitter.emit(t.event, t.data)
                        }), this.connection.bind("disconnected", function () {
                            l.channels.disconnect()
                        }), this.connection.bind("error", function (t) {
                            p["default"].warn("Error", t)
                        }), t.instances.push(this), this.timeline.info({instances: t.instances.length}), t.isReady && this.connect()
                    }

                    return t.ready = function () {
                        t.isReady = !0;
                        for (var e = 0, n = t.instances.length; n > e; e++) t.instances[e].connect()
                    }, t.log = function (e) {
                        var n = Function("return this")();
                        t.logToConsole && n.console && n.console.log && n.console.log(e)
                    }, t.getClientFeatures = function () {
                        return r.keys(r.filterObject({ws: o["default"].Transports.ws}, function (t) {
                            return t.isSupported({})
                        }))
                    }, t.prototype.channel = function (t) {
                        return this.channels.find(t)
                    }, t.prototype.allChannels = function () {
                        return this.channels.all()
                    }, t.prototype.connect = function () {
                        if (this.connection.connect(), this.timelineSender && !this.timelineSenderTimer) {
                            var t = this.connection.isEncrypted(), e = this.timelineSender;
                            this.timelineSenderTimer = new l.PeriodicTimer(6e4, function () {
                                e.send(t)
                            })
                        }
                    }, t.prototype.disconnect = function () {
                        this.connection.disconnect(), this.timelineSenderTimer && (this.timelineSenderTimer.ensureAborted(), this.timelineSenderTimer = null)
                    }, t.prototype.bind = function (t, e) {
                        return this.global_emitter.bind(t, e), this
                    }, t.prototype.bind_all = function (t) {
                        return this.global_emitter.bind_all(t), this
                    }, t.prototype.subscribeAll = function () {
                        var t;
                        for (t in this.channels.channels) this.channels.channels.hasOwnProperty(t) && this.subscribe(t)
                    }, t.prototype.subscribe = function (t) {
                        var e = this.channels.add(t, this);
                        return "connected" === this.connection.state && e.subscribe(), e
                    }, t.prototype.unsubscribe = function (t) {
                        var e = this.channels.remove(t);
                        e && "connected" === this.connection.state && e.unsubscribe()
                    }, t.prototype.send_event = function (t, e, n) {
                        return this.connection.send_event(t, e, n)
                    }, t.prototype.isEncrypted = function () {
                        return "https:" === o["default"].getProtocol() ? !0 : Boolean(this.config.encrypted)
                    }, t.instances = [], t.isReady = !1, t.logToConsole = !1, t.Runtime = o["default"], t.ScriptReceivers = o["default"].ScriptReceivers, t.DependenciesReceivers = o["default"].DependenciesReceivers, t.auth_callbacks = o["default"].auth_callbacks, t
                }();
            e.__esModule = !0, e["default"] = y, o["default"].setup(y)
        }, function (t, e, n) {
            "use strict";
            var i = n(3), o = n(7), r = n(14), s = n(15), a = n(16), c = n(4), u = n(17), l = n(18), h = n(25),
                f = n(26), p = n(27), d = n(28), y = {
                    nextAuthCallbackID: 1,
                    auth_callbacks: {},
                    ScriptReceivers: c.ScriptReceivers,
                    DependenciesReceivers: i.DependenciesReceivers,
                    getDefaultStrategy: f["default"],
                    Transports: l["default"],
                    transportConnectionInitializer: p["default"],
                    HTTPFactory: d["default"],
                    TimelineTransport: u["default"],
                    getXHRAPI: function () {
                        return window.XMLHttpRequest
                    },
                    getWebSocketAPI: function () {
                        return window.WebSocket || window.MozWebSocket
                    },
                    setup: function (t) {
                        var e = this;
                        window.Pusher = t;
                        var n = function () {
                            e.onDocumentBody(t.ready)
                        };
                        window.JSON ? n() : i.Dependencies.load("json2", {}, n)
                    },
                    getDocument: function () {
                        return document
                    },
                    getProtocol: function () {
                        return this.getDocument().location.protocol
                    },
                    getGlobal: function () {
                        return window
                    },
                    getAuthorizers: function () {
                        return {ajax: o["default"], jsonp: r["default"]}
                    },
                    onDocumentBody: function (t) {
                        var e = this;
                        document.body ? t() : setTimeout(function () {
                            e.onDocumentBody(t)
                        }, 0)
                    },
                    createJSONPRequest: function (t, e) {
                        return new a["default"](t, e)
                    },
                    createScriptRequest: function (t) {
                        return new s["default"](t)
                    },
                    getLocalStorage: function () {
                        try {
                            return window.localStorage
                        } catch (t) {
                            return
                        }
                    },
                    createXHR: function () {
                        return this.getXHRAPI() ? this.createXMLHttpRequest() : this.createMicrosoftXHR()
                    },
                    createXMLHttpRequest: function () {
                        var t = this.getXHRAPI();
                        return new t
                    },
                    createMicrosoftXHR: function () {
                        return new ActiveXObject("Microsoft.XMLHTTP")
                    },
                    getNetwork: function () {
                        return h.Network
                    },
                    createWebSocket: function (t) {
                        var e = this.getWebSocketAPI();
                        return new e(t)
                    },
                    createSocketRequest: function (t, e) {
                        if (this.isXHRSupported()) return this.HTTPFactory.createXHR(t, e);
                        if (this.isXDRSupported(0 === e.indexOf("https:"))) return this.HTTPFactory.createXDR(t, e);
                        throw"Cross-origin HTTP requests are not supported"
                    },
                    isXHRSupported: function () {
                        var t = this.getXHRAPI();
                        return Boolean(t) && void 0 !== (new t).withCredentials
                    },
                    isXDRSupported: function (t) {
                        var e = t ? "https:" : "http:", n = this.getProtocol();
                        return Boolean(window.XDomainRequest) && n === e
                    },
                    addUnloadListener: function (t) {
                        void 0 !== window.addEventListener ? window.addEventListener("unload", t, !1) : void 0 !== window.attachEvent && window.attachEvent("onunload", t)
                    },
                    removeUnloadListener: function (t) {
                        void 0 !== window.addEventListener ? window.removeEventListener("unload", t, !1) : void 0 !== window.detachEvent && window.detachEvent("onunload", t)
                    }
                };
            e.__esModule = !0, e["default"] = y
        }, function (t, e, n) {
            "use strict";
            var i = n(4), o = n(5), r = n(6);
            e.DependenciesReceivers = new i.ScriptReceiverFactory("_pusher_dependencies", "Pusher.DependenciesReceivers"), e.Dependencies = new r["default"]({
                cdn_http: o["default"].cdn_http,
                cdn_https: o["default"].cdn_https,
                version: o["default"].VERSION,
                suffix: o["default"].dependency_suffix,
                receivers: e.DependenciesReceivers
            })
        }, function (t, e) {
            "use strict";
            var n = function () {
                function t(t, e) {
                    this.lastId = 0, this.prefix = t, this.name = e
                }

                return t.prototype.create = function (t) {
                    this.lastId++;
                    var e = this.lastId, n = this.prefix + e, i = this.name + "[" + e + "]", o = !1, r = function () {
                        o || (t.apply(null, arguments), o = !0)
                    };
                    return this[e] = r, {number: e, id: n, name: i, callback: r}
                }, t.prototype.remove = function (t) {
                    delete this[t.number]
                }, t
            }();
            e.ScriptReceiverFactory = n, e.ScriptReceivers = new n("_pusher_script_", "Pusher.ScriptReceivers")
        }, function (t, e) {
            "use strict";
            var n = {
                VERSION: "3.1.0",
                PROTOCOL: 7,
                host: "ws.pusherapp.com",
                ws_port: 80,
                wss_port: 443,
                sockjs_host: "sockjs.pusher.com",
                sockjs_http_port: 80,
                sockjs_https_port: 443,
                sockjs_path: "/pusher",
                stats_host: "stats.pusher.com",
                channel_auth_endpoint: "/pusher/auth",
                channel_auth_transport: "ajax",
                activity_timeout: 12e4,
                pong_timeout: 3e4,
                unavailable_timeout: 1e4,
                cdn_http: "http://js.pusher.com",
                cdn_https: "https://js.pusher.com",
                dependency_suffix: ".min"
            };
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";
            var i = n(4), o = n(2), r = function () {
                function t(t) {
                    this.options = t, this.receivers = t.receivers || i.ScriptReceivers, this.loading = {}
                }

                return t.prototype.load = function (t, e, n) {
                    var i = this;
                    if (i.loading[t] && i.loading[t].length > 0) i.loading[t].push(n); else {
                        i.loading[t] = [n];
                        var r = o["default"].createScriptRequest(i.getPath(t, e)), s = i.receivers.create(function (e) {
                            if (i.receivers.remove(s), i.loading[t]) {
                                var n = i.loading[t];
                                delete i.loading[t];
                                for (var o = function (t) {
                                    t || r.cleanup()
                                }, a = 0; a < n.length; a++) n[a](e, o)
                            }
                        });
                        r.send(s)
                    }
                }, t.prototype.getRoot = function (t) {
                    var e, n = o["default"].getDocument().location.protocol;
                    return e = t && t.encrypted || "https:" === n ? this.options.cdn_https : this.options.cdn_http, e.replace(/\/*$/, "") + "/" + this.options.version
                }, t.prototype.getPath = function (t, e) {
                    return this.getRoot(e) + "/" + t + this.options.suffix + ".js"
                }, t
            }();
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";
            var i = n(8), o = n(2), r = function (t, e, n) {
                var r, s = this;
                r = o["default"].createXHR(), r.open("POST", s.options.authEndpoint, !0), r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (var a in this.authOptions.headers) r.setRequestHeader(a, this.authOptions.headers[a]);
                return r.onreadystatechange = function () {
                    if (4 === r.readyState) if (200 === r.status) {
                        var t, e = !1;
                        try {
                            t = JSON.parse(r.responseText), e = !0
                        } catch (o) {
                            n(!0, "JSON returned from webapp was invalid, yet status code was 200. Data was: " + r.responseText)
                        }
                        e && n(!1, t)
                    } else i["default"].warn("Couldn't get auth info from your webapp", r.status), n(!0, r.status)
                }, r.send(this.composeQuery(e)), r
            };
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = n(1), r = {
                debug: function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e - 0] = arguments[e];
                    o["default"].log && o["default"].log(i.stringify.apply(this, arguments))
                }, warn: function () {
                    for (var t = [], e = 0; e < arguments.length; e++) t[e - 0] = arguments[e];
                    var n = i.stringify.apply(this, arguments), r = Function("return this")();
                    r.console && (r.console.warn ? r.console.warn(n) : r.console.log && r.console.log(n)), o["default"].log && o["default"].log(n)
                }
            };
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                for (var o = 0; o < e.length; o++) {
                    var r = e[o];
                    for (var s in r) r[s] && r[s].constructor && r[s].constructor === Object ? t[s] = i(t[s] || {}, r[s]) : t[s] = r[s]
                }
                return t
            }

            function o() {
                for (var t = ["Pusher"], e = 0; e < arguments.length; e++) "string" == typeof arguments[e] ? t.push(arguments[e]) : t.push(JSON.stringify(arguments[e]));
                return t.join(" : ")
            }

            function r(t, e) {
                var n = Array.prototype.indexOf;
                if (null === t) return -1;
                if (n && t.indexOf === n) return t.indexOf(e);
                for (var i = 0, o = t.length; o > i; i++) if (t[i] === e) return i;
                return -1
            }

            function s(t, e) {
                for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e(t[n], n, t)
            }

            function a(t) {
                var e = [];
                return s(t, function (t, n) {
                    e.push(n)
                }), e
            }

            function c(t) {
                var e = [];
                return s(t, function (t) {
                    e.push(t)
                }), e
            }

            function u(t, e, n) {
                for (var i = 0; i < t.length; i++) e.call(n || w, t[i], i, t)
            }

            function l(t, e) {
                for (var n = [], i = 0; i < t.length; i++) n.push(e(t[i], i, t, n));
                return n
            }

            function h(t, e) {
                var n = {};
                return s(t, function (t, i) {
                    n[i] = e(t)
                }), n
            }

            function f(t, e) {
                e = e || function (t) {
                    return !!t
                };
                for (var n = [], i = 0; i < t.length; i++) e(t[i], i, t, n) && n.push(t[i]);
                return n
            }

            function p(t, e) {
                var n = {};
                return s(t, function (i, o) {
                    (e && e(i, o, t, n) || Boolean(i)) && (n[o] = i)
                }), n
            }

            function d(t) {
                var e = [];
                return s(t, function (t, n) {
                    e.push([n, t])
                }), e
            }

            function y(t, e) {
                for (var n = 0; n < t.length; n++) if (e(t[n], n, t)) return !0;
                return !1
            }

            function m(t, e) {
                for (var n = 0; n < t.length; n++) if (!e(t[n], n, t)) return !1;
                return !0
            }

            function v(t) {
                return h(t, function (t) {
                    return "object" == typeof t && (t = JSON.stringify(t)), encodeURIComponent(b["default"](t.toString()))
                })
            }

            function g(t) {
                var e = p(t, function (t) {
                    return void 0 !== t
                }), n = l(d(v(e)), k["default"].method("join", "=")).join("&");
                return n
            }

            function _(t) {
                var e = [], n = JSON.stringify(t, function (t, n) {
                    if ("object" == typeof n && null !== n) {
                        if (-1 !== e.indexOf(n)) return;
                        e.push(n)
                    }
                    return n
                });
                return e = null, n
            }

            var b = n(10), k = n(11), w = Function("return this")();
            e.extend = i, e.stringify = o, e.arrayIndexOf = r, e.objectApply = s, e.keys = a, e.values = c, e.apply = u, e.map = l, e.mapObject = h, e.filter = f, e.filterObject = p, e.flatten = d, e.any = y, e.all = m, e.encodeParamsObject = v, e.buildQueryString = g, e.safeJSONStringify = _
        }, function (t, e) {
            "use strict";

            function n(t) {
                return f(l(t))
            }

            var i = Function("return this")();
            e.__esModule = !0, e["default"] = n;
            for (var o = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = {}, a = 0, c = r.length; c > a; a++) s[r.charAt(a)] = a;
            var u = function (t) {
                var e = t.charCodeAt(0);
                return 128 > e ? t : 2048 > e ? o(192 | e >>> 6) + o(128 | 63 & e) : o(224 | e >>> 12 & 15) + o(128 | e >>> 6 & 63) + o(128 | 63 & e)
            }, l = function (t) {
                return t.replace(/[^\x00-\x7F]/g, u)
            }, h = function (t) {
                var e = [0, 2, 1][t.length % 3],
                    n = t.charCodeAt(0) << 16 | (t.length > 1 ? t.charCodeAt(1) : 0) << 8 | (t.length > 2 ? t.charCodeAt(2) : 0),
                    i = [r.charAt(n >>> 18), r.charAt(n >>> 12 & 63), e >= 2 ? "=" : r.charAt(n >>> 6 & 63), e >= 1 ? "=" : r.charAt(63 & n)];
                return i.join("")
            }, f = i.btoa || function (t) {
                return t.replace(/[\s\S]{1,3}/g, h)
            }
        }, function (t, e, n) {
            "use strict";
            var i = n(12), o = {
                getGlobal: function () {
                    return Function("return this")()
                }, now: function () {
                    return Date.now ? Date.now() : (new Date).valueOf()
                }, defer: function (t) {
                    return new i.OneOffTimer(0, t)
                }, method: function (t) {
                    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    var i = Array.prototype.slice.call(arguments, 1);
                    return function (e) {
                        return e[t].apply(e, i.concat(arguments))
                    }
                }
            };
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                a.clearTimeout(t)
            }

            function o(t) {
                a.clearInterval(t)
            }

            var r = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, s = n(13), a = Function("return this")(), c = function (t) {
                function e(e, n) {
                    t.call(this, setTimeout, i, e, function (t) {
                        return n(), null
                    })
                }

                return r(e, t), e
            }(s["default"]);
            e.OneOffTimer = c;
            var u = function (t) {
                function e(e, n) {
                    t.call(this, setInterval, o, e, function (t) {
                        return n(), t
                    })
                }

                return r(e, t), e
            }(s["default"]);
            e.PeriodicTimer = u
        }, function (t, e) {
            "use strict";
            var n = function () {
                function t(t, e, n, i) {
                    var o = this;
                    this.clear = e, this.timer = t(function () {
                        o.timer && (o.timer = i(o.timer))
                    }, n)
                }

                return t.prototype.isRunning = function () {
                    return null !== this.timer
                }, t.prototype.ensureAborted = function () {
                    this.timer && (this.clear(this.timer), this.timer = null)
                }, t
            }();
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";
            var i = n(8), o = function (t, e, n) {
                void 0 !== this.authOptions.headers && i["default"].warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP.");
                var o = t.nextAuthCallbackID.toString();
                t.nextAuthCallbackID++;
                var r = t.getDocument(), s = r.createElement("script");
                t.auth_callbacks[o] = function (t) {
                    n(!1, t)
                };
                var a = "Pusher.auth_callbacks['" + o + "']";
                s.src = this.options.authEndpoint + "?callback=" + encodeURIComponent(a) + "&" + this.composeQuery(e);
                var c = r.getElementsByTagName("head")[0] || r.documentElement;
                c.insertBefore(s, c.firstChild)
            };
            e.__esModule = !0, e["default"] = o
        }, function (t, e) {
            "use strict";
            var n = function () {
                function t(t) {
                    this.src = t
                }

                return t.prototype.send = function (t) {
                    var e = this, n = "Error loading " + e.src;
                    e.script = document.createElement("script"), e.script.id = t.id, e.script.src = e.src, e.script.type = "text/javascript", e.script.charset = "UTF-8", e.script.addEventListener ? (e.script.onerror = function () {
                        t.callback(n)
                    }, e.script.onload = function () {
                        t.callback(null)
                    }) : e.script.onreadystatechange = function () {
                        ("loaded" === e.script.readyState || "complete" === e.script.readyState) && t.callback(null)
                    }, void 0 === e.script.async && document.attachEvent && /opera/i.test(navigator.userAgent) ? (e.errorScript = document.createElement("script"), e.errorScript.id = t.id + "_error", e.errorScript.text = t.name + "('" + n + "');", e.script.async = e.errorScript.async = !1) : e.script.async = !0;
                    var i = document.getElementsByTagName("head")[0];
                    i.insertBefore(e.script, i.firstChild), e.errorScript && i.insertBefore(e.errorScript, e.script.nextSibling)
                }, t.prototype.cleanup = function () {
                    this.script && (this.script.onload = this.script.onerror = null, this.script.onreadystatechange = null), this.script && this.script.parentNode && this.script.parentNode.removeChild(this.script), this.errorScript && this.errorScript.parentNode && this.errorScript.parentNode.removeChild(this.errorScript), this.script = null, this.errorScript = null
                }, t
            }();
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = n(2), r = function () {
                function t(t, e) {
                    this.url = t, this.data = e
                }

                return t.prototype.send = function (t) {
                    if (!this.request) {
                        var e = i.buildQueryString(this.data), n = this.url + "/" + t.number + "?" + e;
                        this.request = o["default"].createScriptRequest(n), this.request.send(t)
                    }
                }, t.prototype.cleanup = function () {
                    this.request && this.request.cleanup()
                }, t
            }();
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";
            var i = n(2), o = n(4), r = function (t, e) {
                return function (n, r) {
                    var s = "http" + (e ? "s" : "") + "://", a = s + (t.host || t.options.host) + t.options.path,
                        c = i["default"].createJSONPRequest(a, n),
                        u = i["default"].ScriptReceivers.create(function (e, n) {
                            o.ScriptReceivers.remove(u), c.cleanup(), n && n.host && (t.host = n.host), r && r(e, n)
                        });
                    c.send(u)
                }
            }, s = {name: "jsonp", getAgent: r};
            e.__esModule = !0, e["default"] = s
        }, function (t, e, n) {
            "use strict";
            var i = n(19), o = n(21), r = n(20), s = n(2), a = n(3), c = n(9), u = new o["default"]({
                    file: "sockjs",
                    urls: r.sockjs,
                    handlesActivityChecks: !0,
                    supportsPing: !1,
                    isSupported: function () {
                        return !0
                    },
                    isInitialized: function () {
                        return void 0 !== window.SockJS
                    },
                    getSocket: function (t, e) {
                        return new window.SockJS(t, null, {
                            js_path: a.Dependencies.getPath("sockjs", {encrypted: e.encrypted}),
                            ignore_null_origin: e.ignoreNullOrigin
                        })
                    },
                    beforeOpen: function (t, e) {
                        t.send(JSON.stringify({path: e}))
                    }
                }), l = {
                    isSupported: function (t) {
                        var e = s["default"].isXDRSupported(t.encrypted);
                        return e
                    }
                }, h = new o["default"](c.extend({}, i.streamingConfiguration, l)),
                f = new o["default"](c.extend({}, i.pollingConfiguration, l));
            i["default"].xdr_streaming = h, i["default"].xdr_polling = f, i["default"].sockjs = u, e.__esModule = !0, e["default"] = i["default"]
        }, function (t, e, n) {
            "use strict";
            var i = n(20), o = n(21), r = n(9), s = n(2), a = new o["default"]({
                urls: i.ws,
                handlesActivityChecks: !1,
                supportsPing: !1,
                isInitialized: function () {
                    return Boolean(s["default"].getWebSocketAPI())
                },
                isSupported: function () {
                    return Boolean(s["default"].getWebSocketAPI())
                },
                getSocket: function (t) {
                    return s["default"].createWebSocket(t)
                }
            }), c = {
                urls: i.http, handlesActivityChecks: !1, supportsPing: !0, isInitialized: function () {
                    return !0
                }
            };
            e.streamingConfiguration = r.extend({
                getSocket: function (t) {
                    return s["default"].HTTPFactory.createStreamingSocket(t)
                }
            }, c), e.pollingConfiguration = r.extend({
                getSocket: function (t) {
                    return s["default"].HTTPFactory.createPollingSocket(t)
                }
            }, c);
            var u = {
                    isSupported: function () {
                        return s["default"].isXHRSupported()
                    }
                }, l = new o["default"](r.extend({}, e.streamingConfiguration, u)),
                h = new o["default"](r.extend({}, e.pollingConfiguration, u)),
                f = {ws: a, xhr_streaming: l, xhr_polling: h};
            e.__esModule = !0, e["default"] = f
        }, function (t, e, n) {
            "use strict";

            function i(t, e, n) {
                var i = t + (e.encrypted ? "s" : ""), o = e.encrypted ? e.hostEncrypted : e.hostUnencrypted;
                return i + "://" + o + n
            }

            function o(t, e) {
                var n = "/app/" + t,
                    i = "?protocol=" + r["default"].PROTOCOL + "&client=js&version=" + r["default"].VERSION + (e ? "&" + e : "");
                return n + i
            }

            var r = n(5);
            e.ws = {
                getInitial: function (t, e) {
                    return i("ws", e, o(t, "flash=false"))
                }
            }, e.http = {
                getInitial: function (t, e) {
                    var n = (e.httpPath || "/pusher") + o(t);
                    return i("http", e, n)
                }
            }, e.sockjs = {
                getInitial: function (t, e) {
                    return i("http", e, e.httpPath || "/pusher")
                }, getPath: function (t, e) {
                    return o(t)
                }
            }
        }, function (t, e, n) {
            "use strict";
            var i = n(22), o = function () {
                function t(t) {
                    this.hooks = t
                }

                return t.prototype.isSupported = function (t) {
                    return this.hooks.isSupported(t)
                }, t.prototype.createConnection = function (t, e, n, o) {
                    return new i["default"](this.hooks, t, e, n, o)
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(11), r = n(9), s = n(23), a = n(8), c = n(2), u = function (t) {
                function e(e, n, i, o, r) {
                    t.call(this), this.initialize = c["default"].transportConnectionInitializer, this.hooks = e, this.name = n, this.priority = i, this.key = o, this.options = r, this.state = "new", this.timeline = r.timeline, this.activityTimeout = r.activityTimeout, this.id = this.timeline.generateUniqueID()
                }

                return i(e, t), e.prototype.handlesActivityChecks = function () {
                    return Boolean(this.hooks.handlesActivityChecks)
                }, e.prototype.supportsPing = function () {
                    return Boolean(this.hooks.supportsPing)
                }, e.prototype.connect = function () {
                    var t = this;
                    if (this.socket || "initialized" !== this.state) return !1;
                    var e = this.hooks.urls.getInitial(this.key, this.options);
                    try {
                        this.socket = this.hooks.getSocket(e, this.options)
                    } catch (n) {
                        return o["default"].defer(function () {
                            t.onError(n), t.changeState("closed")
                        }), !1
                    }
                    return this.bindListeners(), a["default"].debug("Connecting", {
                        transport: this.name,
                        url: e
                    }), this.changeState("connecting"), !0
                }, e.prototype.close = function () {
                    return this.socket ? (this.socket.close(), !0) : !1
                }, e.prototype.send = function (t) {
                    var e = this;
                    return "open" === this.state ? (o["default"].defer(function () {
                        e.socket && e.socket.send(t)
                    }), !0) : !1
                }, e.prototype.ping = function () {
                    "open" === this.state && this.supportsPing() && this.socket.ping()
                }, e.prototype.onOpen = function () {
                    this.hooks.beforeOpen && this.hooks.beforeOpen(this.socket, this.hooks.urls.getPath(this.key, this.options)), this.changeState("open"), this.socket.onopen = void 0
                }, e.prototype.onError = function (t) {
                    this.emit("error", {
                        type: "WebSocketError",
                        error: t
                    }), this.timeline.error(this.buildTimelineMessage({error: t.toString()}))
                }, e.prototype.onClose = function (t) {
                    t ? this.changeState("closed", {
                        code: t.code,
                        reason: t.reason,
                        wasClean: t.wasClean
                    }) : this.changeState("closed"), this.unbindListeners(), this.socket = void 0
                }, e.prototype.onMessage = function (t) {
                    this.emit("message", t)
                }, e.prototype.onActivity = function () {
                    this.emit("activity")
                }, e.prototype.bindListeners = function () {
                    var t = this;
                    this.socket.onopen = function () {
                        t.onOpen()
                    }, this.socket.onerror = function (e) {
                        t.onError(e)
                    }, this.socket.onclose = function (e) {
                        t.onClose(e)
                    }, this.socket.onmessage = function (e) {
                        t.onMessage(e)
                    }, this.supportsPing() && (this.socket.onactivity = function () {
                        t.onActivity()
                    })
                }, e.prototype.unbindListeners = function () {
                    this.socket && (this.socket.onopen = void 0, this.socket.onerror = void 0, this.socket.onclose = void 0, this.socket.onmessage = void 0, this.supportsPing() && (this.socket.onactivity = void 0))
                }, e.prototype.changeState = function (t, e) {
                    this.state = t, this.timeline.info(this.buildTimelineMessage({
                        state: t,
                        params: e
                    })), this.emit(t, e)
                }, e.prototype.buildTimelineMessage = function (t) {
                    return r.extend({cid: this.id}, t)
                }, e
            }(s["default"]);
            e.__esModule = !0, e["default"] = u
        }, function (t, e, n) {
            "use strict";
            var i = n(24), o = Function("return this")(), r = function () {
                function t(t) {
                    this.callbacks = new i["default"], this.global_callbacks = [], this.failThrough = t
                }

                return t.prototype.bind = function (t, e, n) {
                    return this.callbacks.add(t, e, n), this
                }, t.prototype.bind_all = function (t) {
                    return this.global_callbacks.push(t), this
                }, t.prototype.unbind = function (t, e, n) {
                    return this.callbacks.remove(t, e, n), this
                }, t.prototype.unbind_all = function (t, e) {
                    return this.callbacks.remove(t, e), this
                }, t.prototype.emit = function (t, e) {
                    var n;
                    for (n = 0; n < this.global_callbacks.length; n++) this.global_callbacks[n](t, e);
                    var i = this.callbacks.get(t);
                    if (i && i.length > 0) for (n = 0; n < i.length; n++) i[n].fn.call(i[n].context || o, e); else this.failThrough && this.failThrough(t, e);
                    return this
                }, t
            }();
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                return "_" + t
            }

            var o = n(9), r = function () {
                function t() {
                    this._callbacks = {}
                }

                return t.prototype.get = function (t) {
                    return this._callbacks[i(t)]
                }, t.prototype.add = function (t, e, n) {
                    var o = i(t);
                    this._callbacks[o] = this._callbacks[o] || [], this._callbacks[o].push({fn: e, context: n})
                }, t.prototype.remove = function (t, e, n) {
                    if (!t && !e && !n) return void (this._callbacks = {});
                    var r = t ? [i(t)] : o.keys(this._callbacks);
                    e || n ? this.removeCallback(r, e, n) : this.removeAllCallbacks(r)
                }, t.prototype.removeCallback = function (t, e, n) {
                    o.apply(t, function (t) {
                        this._callbacks[t] = o.filter(this._callbacks[t] || [], function (t) {
                            return e && e !== t.fn || n && n !== t.context
                        }), 0 === this._callbacks[t].length && delete this._callbacks[t]
                    }, this)
                }, t.prototype.removeAllCallbacks = function (t) {
                    o.apply(t, function (t) {
                        delete this._callbacks[t]
                    }, this)
                }, t
            }();
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(23), r = function (t) {
                function e() {
                    t.call(this);
                    var e = this;
                    void 0 !== window.addEventListener && (window.addEventListener("online", function () {
                        e.emit("online")
                    }, !1), window.addEventListener("offline", function () {
                        e.emit("offline")
                    }, !1))
                }

                return i(e, t), e.prototype.isOnline = function () {
                    return void 0 === window.navigator.onLine ? !0 : window.navigator.onLine
                }, e
            }(o["default"]);
            e.NetInfo = r, e.Network = new r
        }, function (t, e) {
            "use strict";
            var n = function (t) {
                var e;
                return e = t.encrypted ? [":best_connected_ever", ":ws_loop", [":delayed", 2e3, [":http_fallback_loop"]]] : [":best_connected_ever", ":ws_loop", [":delayed", 2e3, [":wss_loop"]], [":delayed", 5e3, [":http_fallback_loop"]]], [[":def", "ws_options", {
                    hostUnencrypted: t.wsHost + ":" + t.wsPort,
                    hostEncrypted: t.wsHost + ":" + t.wssPort
                }], [":def", "wss_options", [":extend", ":ws_options", {encrypted: !0}]], [":def", "sockjs_options", {
                    hostUnencrypted: t.httpHost + ":" + t.httpPort,
                    hostEncrypted: t.httpHost + ":" + t.httpsPort,
                    httpPath: t.httpPath
                }], [":def", "timeouts", {
                    loop: !0,
                    timeout: 15e3,
                    timeoutLimit: 6e4
                }], [":def", "ws_manager", [":transport_manager", {
                    lives: 2,
                    minPingDelay: 1e4,
                    maxPingDelay: t.activity_timeout
                }]], [":def", "streaming_manager", [":transport_manager", {
                    lives: 2,
                    minPingDelay: 1e4,
                    maxPingDelay: t.activity_timeout
                }]], [":def_transport", "ws", "ws", 3, ":ws_options", ":ws_manager"], [":def_transport", "wss", "ws", 3, ":wss_options", ":ws_manager"], [":def_transport", "sockjs", "sockjs", 1, ":sockjs_options"], [":def_transport", "xhr_streaming", "xhr_streaming", 1, ":sockjs_options", ":streaming_manager"], [":def_transport", "xdr_streaming", "xdr_streaming", 1, ":sockjs_options", ":streaming_manager"], [":def_transport", "xhr_polling", "xhr_polling", 1, ":sockjs_options"], [":def_transport", "xdr_polling", "xdr_polling", 1, ":sockjs_options"], [":def", "ws_loop", [":sequential", ":timeouts", ":ws"]], [":def", "wss_loop", [":sequential", ":timeouts", ":wss"]], [":def", "sockjs_loop", [":sequential", ":timeouts", ":sockjs"]], [":def", "streaming_loop", [":sequential", ":timeouts", [":if", [":is_supported", ":xhr_streaming"], ":xhr_streaming", ":xdr_streaming"]]], [":def", "polling_loop", [":sequential", ":timeouts", [":if", [":is_supported", ":xhr_polling"], ":xhr_polling", ":xdr_polling"]]], [":def", "http_loop", [":if", [":is_supported", ":streaming_loop"], [":best_connected_ever", ":streaming_loop", [":delayed", 4e3, [":polling_loop"]]], [":polling_loop"]]], [":def", "http_fallback_loop", [":if", [":is_supported", ":http_loop"], [":http_loop"], [":sockjs_loop"]]], [":def", "strategy", [":cached", 18e5, [":first_connected", [":if", [":is_supported", ":ws"], e, ":http_fallback_loop"]]]]]
            };
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";

            function i() {
                var t = this;
                t.timeline.info(t.buildTimelineMessage({transport: t.name + (t.options.encrypted ? "s" : "")})), t.hooks.isInitialized() ? t.changeState("initialized") : t.hooks.file ? (t.changeState("initializing"), o.Dependencies.load(t.hooks.file, {encrypted: t.options.encrypted}, function (e, n) {
                    t.hooks.isInitialized() ? (t.changeState("initialized"), n(!0)) : (e && t.onError(e), t.onClose(), n(!1))
                })) : t.onClose()
            }

            var o = n(3);
            e.__esModule = !0, e["default"] = i
        }, function (t, e, n) {
            "use strict";
            var i = n(29), o = n(31);
            o["default"].createXDR = function (t, e) {
                return this.createRequest(i["default"], t, e)
            }, e.__esModule = !0, e["default"] = o["default"]
        }, function (t, e, n) {
            "use strict";
            var i = n(30), o = {
                getRequest: function (t) {
                    var e = new window.XDomainRequest;
                    return e.ontimeout = function () {
                        t.emit("error", new i.RequestTimedOut), t.close()
                    }, e.onerror = function (e) {
                        t.emit("error", e), t.close()
                    }, e.onprogress = function () {
                        e.responseText && e.responseText.length > 0 && t.onChunk(200, e.responseText)
                    }, e.onload = function () {
                        e.responseText && e.responseText.length > 0 && t.onChunk(200, e.responseText), t.emit("finished", 200), t.close()
                    }, e
                }, abortRequest: function (t) {
                    t.ontimeout = t.onerror = t.onprogress = t.onload = null, t.abort()
                }
            };
            e.__esModule = !0, e["default"] = o
        }, function (t, e) {
            "use strict";
            var n = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, i = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.BadEventName = i;
            var o = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.RequestTimedOut = o;
            var r = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.TransportPriorityTooLow = r;
            var s = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.TransportClosed = s;
            var a = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.UnsupportedTransport = a;
            var c = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return n(e, t), e
            }(Error);
            e.UnsupportedStrategy = c
        }, function (t, e, n) {
            "use strict";
            var i = n(32), o = n(33), r = n(35), s = n(36), a = n(37), c = {
                createStreamingSocket: function (t) {
                    return this.createSocket(r["default"], t)
                }, createPollingSocket: function (t) {
                    return this.createSocket(s["default"], t)
                }, createSocket: function (t, e) {
                    return new o["default"](t, e)
                }, createXHR: function (t, e) {
                    return this.createRequest(a["default"], t, e)
                }, createRequest: function (t, e, n) {
                    return new i["default"](t, e, n)
                }
            };
            e.__esModule = !0, e["default"] = c
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(2), r = n(23), s = 262144, a = function (t) {
                function e(e, n, i) {
                    t.call(this), this.hooks = e, this.method = n, this.url = i
                }

                return i(e, t), e.prototype.start = function (t) {
                    var e = this;
                    this.position = 0, this.xhr = this.hooks.getRequest(this), this.unloader = function () {
                        e.close()
                    }, o["default"].addUnloadListener(this.unloader), this.xhr.open(this.method, this.url, !0), this.xhr.setRequestHeader && this.xhr.setRequestHeader("Content-Type", "application/json"), this.xhr.send(t)
                }, e.prototype.close = function () {
                    this.unloader && (o["default"].removeUnloadListener(this.unloader), this.unloader = null), this.xhr && (this.hooks.abortRequest(this.xhr), this.xhr = null)
                }, e.prototype.onChunk = function (t, e) {
                    for (; ;) {
                        var n = this.advanceBuffer(e);
                        if (!n) break;
                        this.emit("chunk", {status: t, data: n})
                    }
                    this.isBufferTooLong(e) && this.emit("buffer_too_long")
                }, e.prototype.advanceBuffer = function (t) {
                    var e = t.slice(this.position), n = e.indexOf("\n");
                    return -1 !== n ? (this.position += n + 1, e.slice(0, n)) : null
                }, e.prototype.isBufferTooLong = function (t) {
                    return this.position === t.length && t.length > s
                }, e
            }(r["default"]);
            e.__esModule = !0, e["default"] = a
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                var e = /([^\?]*)\/*(\??.*)/.exec(t);
                return {base: e[1], queryString: e[2]}
            }

            function o(t, e) {
                return t.base + "/" + e + "/xhr_send"
            }

            function r(t) {
                var e = -1 === t.indexOf("?") ? "?" : "&";
                return t + e + "t=" + +new Date + "&n=" + f++
            }

            function s(t, e) {
                var n = /(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(t);
                return n[1] + e + n[3]
            }

            function a(t) {
                return Math.floor(Math.random() * t)
            }

            function c(t) {
                for (var e = [], n = 0; t > n; n++) e.push(a(32).toString(32));
                return e.join("")
            }

            var u = n(34), l = n(11), h = n(2), f = 1, p = function () {
                function t(t, e) {
                    this.hooks = t, this.session = a(1e3) + "/" + c(8), this.location = i(e), this.readyState = u["default"].CONNECTING, this.openStream()
                }

                return t.prototype.send = function (t) {
                    return this.sendRaw(JSON.stringify([t]))
                }, t.prototype.ping = function () {
                    this.hooks.sendHeartbeat(this)
                }, t.prototype.close = function (t, e) {
                    this.onClose(t, e, !0)
                }, t.prototype.sendRaw = function (t) {
                    if (this.readyState !== u["default"].OPEN) return !1;
                    try {
                        return h["default"].createSocketRequest("POST", r(o(this.location, this.session))).start(t), !0
                    } catch (e) {
                        return !1
                    }
                }, t.prototype.reconnect = function () {
                    this.closeStream(), this.openStream()
                }, t.prototype.onClose = function (t, e, n) {
                    this.closeStream(), this.readyState = u["default"].CLOSED, this.onclose && this.onclose({
                        code: t,
                        reason: e,
                        wasClean: n
                    })
                }, t.prototype.onChunk = function (t) {
                    if (200 === t.status) {
                        this.readyState === u["default"].OPEN && this.onActivity();
                        var e, n = t.data.slice(0, 1);
                        switch (n) {
                            case"o":
                                e = JSON.parse(t.data.slice(1) || "{}"),
                                    this.onOpen(e);
                                break;
                            case"a":
                                e = JSON.parse(t.data.slice(1) || "[]");
                                for (var i = 0; i < e.length; i++) this.onEvent(e[i]);
                                break;
                            case"m":
                                e = JSON.parse(t.data.slice(1) || "null"), this.onEvent(e);
                                break;
                            case"h":
                                this.hooks.onHeartbeat(this);
                                break;
                            case"c":
                                e = JSON.parse(t.data.slice(1) || "[]"), this.onClose(e[0], e[1], !0)
                        }
                    }
                }, t.prototype.onOpen = function (t) {
                    this.readyState === u["default"].CONNECTING ? (t && t.hostname && (this.location.base = s(this.location.base, t.hostname)), this.readyState = u["default"].OPEN, this.onopen && this.onopen()) : this.onClose(1006, "Server lost session", !0)
                }, t.prototype.onEvent = function (t) {
                    this.readyState === u["default"].OPEN && this.onmessage && this.onmessage({data: t})
                }, t.prototype.onActivity = function () {
                    this.onactivity && this.onactivity()
                }, t.prototype.onError = function (t) {
                    this.onerror && this.onerror(t)
                }, t.prototype.openStream = function () {
                    var t = this;
                    this.stream = h["default"].createSocketRequest("POST", r(this.hooks.getReceiveURL(this.location, this.session))), this.stream.bind("chunk", function (e) {
                        t.onChunk(e)
                    }), this.stream.bind("finished", function (e) {
                        t.hooks.onFinished(t, e)
                    }), this.stream.bind("buffer_too_long", function () {
                        t.reconnect()
                    });
                    try {
                        this.stream.start()
                    } catch (e) {
                        l["default"].defer(function () {
                            t.onError(e), t.onClose(1006, "Could not start streaming", !1)
                        })
                    }
                }, t.prototype.closeStream = function () {
                    this.stream && (this.stream.unbind_all(), this.stream.close(), this.stream = null)
                }, t
            }();
            e.__esModule = !0, e["default"] = p
        }, function (t, e) {
            "use strict";
            var n;
            !function (t) {
                t[t.CONNECTING = 0] = "CONNECTING", t[t.OPEN = 1] = "OPEN", t[t.CLOSED = 3] = "CLOSED"
            }(n || (n = {})), e.__esModule = !0, e["default"] = n
        }, function (t, e) {
            "use strict";
            var n = {
                getReceiveURL: function (t, e) {
                    return t.base + "/" + e + "/xhr_streaming" + t.queryString
                }, onHeartbeat: function (t) {
                    t.sendRaw("[]")
                }, sendHeartbeat: function (t) {
                    t.sendRaw("[]")
                }, onFinished: function (t, e) {
                    t.onClose(1006, "Connection interrupted (" + e + ")", !1)
                }
            };
            e.__esModule = !0, e["default"] = n
        }, function (t, e) {
            "use strict";
            var n = {
                getReceiveURL: function (t, e) {
                    return t.base + "/" + e + "/xhr" + t.queryString
                }, onHeartbeat: function () {
                }, sendHeartbeat: function (t) {
                    t.sendRaw("[]")
                }, onFinished: function (t, e) {
                    200 === e ? t.reconnect() : t.onClose(1006, "Connection interrupted (" + e + ")", !1)
                }
            };
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";
            var i = n(2), o = {
                getRequest: function (t) {
                    var e = i["default"].getXHRAPI(), n = new e;
                    return n.onreadystatechange = n.onprogress = function () {
                        switch (n.readyState) {
                            case 3:
                                n.responseText && n.responseText.length > 0 && t.onChunk(n.status, n.responseText);
                                break;
                            case 4:
                                n.responseText && n.responseText.length > 0 && t.onChunk(n.status, n.responseText), t.emit("finished", n.status), t.close()
                        }
                    }, n
                }, abortRequest: function (t) {
                    t.onreadystatechange = null, t.abort()
                }
            };
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = n(11), r = n(39), s = function () {
                function t(t, e, n) {
                    this.key = t, this.session = e, this.events = [], this.options = n || {}, this.sent = 0, this.uniqueID = 0
                }

                return t.prototype.log = function (t, e) {
                    t <= this.options.level && (this.events.push(i.extend({}, e, {timestamp: o["default"].now()})), this.options.limit && this.events.length > this.options.limit && this.events.shift())
                }, t.prototype.error = function (t) {
                    this.log(r["default"].ERROR, t)
                }, t.prototype.info = function (t) {
                    this.log(r["default"].INFO, t)
                }, t.prototype.debug = function (t) {
                    this.log(r["default"].DEBUG, t)
                }, t.prototype.isEmpty = function () {
                    return 0 === this.events.length
                }, t.prototype.send = function (t, e) {
                    var n = this, o = i.extend({
                        session: this.session,
                        bundle: this.sent + 1,
                        key: this.key,
                        lib: "js",
                        version: this.options.version,
                        cluster: this.options.cluster,
                        features: this.options.features,
                        timeline: this.events
                    }, this.options.params);
                    return this.events = [], t(o, function (t, i) {
                        t || n.sent++, e && e(t, i)
                    }), !0
                }, t.prototype.generateUniqueID = function () {
                    return this.uniqueID++, this.uniqueID
                }, t
            }();
            e.__esModule = !0, e["default"] = s
        }, function (t, e) {
            "use strict";
            var n;
            !function (t) {
                t[t.ERROR = 3] = "ERROR", t[t.INFO = 6] = "INFO", t[t.DEBUG = 7] = "DEBUG"
            }(n || (n = {})), e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                return function (e) {
                    return [t.apply(this, arguments), e]
                }
            }

            function o(t) {
                return "string" == typeof t && ":" === t.charAt(0)
            }

            function r(t, e) {
                return e[t.slice(1)]
            }

            function s(t, e) {
                if (0 === t.length) return [[], e];
                var n = u(t[0], e), i = s(t.slice(1), n[1]);
                return [[n[0]].concat(i[0]), i[1]]
            }

            function a(t, e) {
                if (!o(t)) return [t, e];
                var n = r(t, e);
                if (void 0 === n) throw"Undefined symbol " + t;
                return [n, e]
            }

            function c(t, e) {
                if (o(t[0])) {
                    var n = r(t[0], e);
                    if (t.length > 1) {
                        if ("function" != typeof n) throw"Calling non-function " + t[0];
                        var i = [l.extend({}, e)].concat(l.map(t.slice(1), function (t) {
                            return u(t, l.extend({}, e))[0]
                        }));
                        return n.apply(this, i)
                    }
                    return [n, e]
                }
                return s(t, e)
            }

            function u(t, e) {
                return "string" == typeof t ? a(t, e) : "object" == typeof t && t instanceof Array && t.length > 0 ? c(t, e) : [t, e]
            }

            var l = n(9), h = n(11), f = n(41), p = n(30), d = n(55), y = n(56), m = n(57), v = n(58), g = n(59),
                _ = n(60), b = n(61), k = n(2), w = k["default"].Transports;
            e.build = function (t, e) {
                var n = l.extend({}, C, e);
                return u(t, n)[1].strategy
            };
            var S = {
                isSupported: function () {
                    return !1
                }, connect: function (t, e) {
                    var n = h["default"].defer(function () {
                        e(new p.UnsupportedStrategy)
                    });
                    return {
                        abort: function () {
                            n.ensureAborted()
                        }, forceMinPriority: function () {
                        }
                    }
                }
            }, C = {
                extend: function (t, e, n) {
                    return [l.extend({}, e, n), t]
                }, def: function (t, e, n) {
                    if (void 0 !== t[e]) throw"Redefining symbol " + e;
                    return t[e] = n, [void 0, t]
                }, def_transport: function (t, e, n, i, o, r) {
                    var s = w[n];
                    if (!s) throw new p.UnsupportedTransport(n);
                    var a,
                        c = !(t.enabledTransports && -1 === l.arrayIndexOf(t.enabledTransports, e) || t.disabledTransports && -1 !== l.arrayIndexOf(t.disabledTransports, e));
                    a = c ? new d["default"](e, i, r ? r.getAssistant(s) : s, l.extend({
                        key: t.key,
                        encrypted: t.encrypted,
                        timeline: t.timeline,
                        ignoreNullOrigin: t.ignoreNullOrigin
                    }, o)) : S;
                    var u = t.def(t, e, a)[1];
                    return u.Transports = t.Transports || {}, u.Transports[e] = a, [void 0, u]
                }, transport_manager: i(function (t, e) {
                    return new f["default"](e)
                }), sequential: i(function (t, e) {
                    var n = Array.prototype.slice.call(arguments, 2);
                    return new y["default"](n, e)
                }), cached: i(function (t, e, n) {
                    return new v["default"](n, t.Transports, {ttl: e, timeline: t.timeline, encrypted: t.encrypted})
                }), first_connected: i(function (t, e) {
                    return new b["default"](e)
                }), best_connected_ever: i(function () {
                    var t = Array.prototype.slice.call(arguments, 1);
                    return new m["default"](t)
                }), delayed: i(function (t, e, n) {
                    return new g["default"](n, {delay: e})
                }), "if": i(function (t, e, n, i) {
                    return new _["default"](e, n, i)
                }), is_supported: i(function (t, e) {
                    return function () {
                        return e.isSupported()
                    }
                })
            }
        }, function (t, e, n) {
            "use strict";
            var i = n(42), o = function () {
                function t(t) {
                    this.options = t || {}, this.livesLeft = this.options.lives || 1 / 0
                }

                return t.prototype.getAssistant = function (t) {
                    return i["default"].createAssistantToTheTransportManager(this, t, {
                        minPingDelay: this.options.minPingDelay,
                        maxPingDelay: this.options.maxPingDelay
                    })
                }, t.prototype.isAlive = function () {
                    return this.livesLeft > 0
                }, t.prototype.reportDeath = function () {
                    this.livesLeft -= 1
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = n(43), o = n(44), r = n(47), s = n(48), a = n(49), c = n(50), u = n(51), l = n(53), h = n(54), f = {
                createChannels: function () {
                    return new h["default"]
                }, createConnectionManager: function (t, e) {
                    return new l["default"](t, e)
                }, createChannel: function (t, e) {
                    return new u["default"](t, e)
                }, createPrivateChannel: function (t, e) {
                    return new c["default"](t, e)
                }, createPresenceChannel: function (t, e) {
                    return new a["default"](t, e)
                }, createTimelineSender: function (t, e) {
                    return new s["default"](t, e)
                }, createAuthorizer: function (t, e) {
                    return new r["default"](t, e)
                }, createHandshake: function (t, e) {
                    return new o["default"](t, e)
                }, createAssistantToTheTransportManager: function (t, e, n) {
                    return new i["default"](t, e, n)
                }
            };
            e.__esModule = !0, e["default"] = f
        }, function (t, e, n) {
            "use strict";
            var i = n(11), o = n(9), r = function () {
                function t(t, e, n) {
                    this.manager = t, this.transport = e, this.minPingDelay = n.minPingDelay, this.maxPingDelay = n.maxPingDelay, this.pingDelay = void 0
                }

                return t.prototype.createConnection = function (t, e, n, r) {
                    var s = this;
                    r = o.extend({}, r, {activityTimeout: this.pingDelay});
                    var a = this.transport.createConnection(t, e, n, r), c = null, u = function () {
                        a.unbind("open", u), a.bind("closed", l), c = i["default"].now()
                    }, l = function (t) {
                        if (a.unbind("closed", l), 1002 === t.code || 1003 === t.code) s.manager.reportDeath(); else if (!t.wasClean && c) {
                            var e = i["default"].now() - c;
                            e < 2 * s.maxPingDelay && (s.manager.reportDeath(), s.pingDelay = Math.max(e / 2, s.minPingDelay))
                        }
                    };
                    return a.bind("open", u), a
                }, t.prototype.isSupported = function (t) {
                    return this.manager.isAlive() && this.transport.isSupported(t)
                }, t
            }();
            e.__esModule = !0, e["default"] = r
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = n(45), r = n(46), s = function () {
                function t(t, e) {
                    this.transport = t, this.callback = e, this.bindListeners()
                }

                return t.prototype.close = function () {
                    this.unbindListeners(), this.transport.close()
                }, t.prototype.bindListeners = function () {
                    var t = this;
                    this.onMessage = function (e) {
                        t.unbindListeners();
                        var n;
                        try {
                            n = o.processHandshake(e)
                        } catch (i) {
                            return t.finish("error", {error: i}), void t.transport.close()
                        }
                        "connected" === n.action ? t.finish("connected", {
                            connection: new r["default"](n.id, t.transport),
                            activityTimeout: n.activityTimeout
                        }) : (t.finish(n.action, {error: n.error}), t.transport.close())
                    }, this.onClosed = function (e) {
                        t.unbindListeners();
                        var n = o.getCloseAction(e) || "backoff", i = o.getCloseError(e);
                        t.finish(n, {error: i})
                    }, this.transport.bind("message", this.onMessage), this.transport.bind("closed", this.onClosed)
                }, t.prototype.unbindListeners = function () {
                    this.transport.unbind("message", this.onMessage), this.transport.unbind("closed", this.onClosed)
                }, t.prototype.finish = function (t, e) {
                    this.callback(i.extend({transport: this.transport, action: t}, e))
                }, t
            }();
            e.__esModule = !0, e["default"] = s
        }, function (t, e) {
            "use strict";
            e.decodeMessage = function (t) {
                try {
                    var e = JSON.parse(t.data);
                    if ("string" == typeof e.data) try {
                        e.data = JSON.parse(e.data)
                    } catch (n) {
                        if (!(n instanceof SyntaxError)) throw n
                    }
                    return e
                } catch (n) {
                    throw{type: "MessageParseError", error: n, data: t.data}
                }
            }, e.encodeMessage = function (t) {
                return JSON.stringify(t)
            }, e.processHandshake = function (t) {
                if (t = e.decodeMessage(t), "pusher:connection_established" === t.event) {
                    if (!t.data.activity_timeout) throw"No activity timeout specified in handshake";
                    return {action: "connected", id: t.data.socket_id, activityTimeout: 1e3 * t.data.activity_timeout}
                }
                if ("pusher:error" === t.event) return {
                    action: this.getCloseAction(t.data),
                    error: this.getCloseError(t.data)
                };
                throw"Invalid handshake"
            }, e.getCloseAction = function (t) {
                return t.code < 4e3 ? t.code >= 1002 && t.code <= 1004 ? "backoff" : null : 4e3 === t.code ? "ssl_only" : t.code < 4100 ? "refused" : t.code < 4200 ? "backoff" : t.code < 4300 ? "retry" : "refused"
            }, e.getCloseError = function (t) {
                return 1e3 !== t.code && 1001 !== t.code ? {
                    type: "PusherError",
                    data: {code: t.code, message: t.reason || t.message}
                } : null
            }
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(9), r = n(23), s = n(45), a = n(8), c = function (t) {
                function e(e, n) {
                    t.call(this), this.id = e, this.transport = n, this.activityTimeout = n.activityTimeout, this.bindListeners()
                }

                return i(e, t), e.prototype.handlesActivityChecks = function () {
                    return this.transport.handlesActivityChecks()
                }, e.prototype.send = function (t) {
                    return this.transport.send(t)
                }, e.prototype.send_event = function (t, e, n) {
                    var i = {event: t, data: e};
                    return n && (i.channel = n), a["default"].debug("Event sent", i), this.send(s.encodeMessage(i))
                }, e.prototype.ping = function () {
                    this.transport.supportsPing() ? this.transport.ping() : this.send_event("pusher:ping", {})
                }, e.prototype.close = function () {
                    this.transport.close()
                }, e.prototype.bindListeners = function () {
                    var t = this, e = {
                        message: function (e) {
                            var n;
                            try {
                                n = s.decodeMessage(e)
                            } catch (i) {
                                t.emit("error", {type: "MessageParseError", error: i, data: e.data})
                            }
                            if (void 0 !== n) {
                                switch (a["default"].debug("Event recd", n), n.event) {
                                    case"pusher:error":
                                        t.emit("error", {type: "PusherError", data: n.data});
                                        break;
                                    case"pusher:ping":
                                        t.emit("ping");
                                        break;
                                    case"pusher:pong":
                                        t.emit("pong")
                                }
                                t.emit("message", n)
                            }
                        }, activity: function () {
                            t.emit("activity")
                        }, error: function (e) {
                            t.emit("error", {type: "WebSocketError", error: e})
                        }, closed: function (e) {
                            n(), e && e.code && t.handleCloseEvent(e), t.transport = null, t.emit("closed")
                        }
                    }, n = function () {
                        o.objectApply(e, function (e, n) {
                            t.transport.unbind(n, e)
                        })
                    };
                    o.objectApply(e, function (e, n) {
                        t.transport.bind(n, e)
                    })
                }, e.prototype.handleCloseEvent = function (t) {
                    var e = s.getCloseAction(t), n = s.getCloseError(t);
                    n && this.emit("error", n), e && this.emit(e)
                }, e
            }(r["default"]);
            e.__esModule = !0, e["default"] = c
        }, function (t, e, n) {
            "use strict";
            var i = n(2), o = function () {
                function t(t, e) {
                    this.channel = t;
                    var n = e.authTransport;
                    if ("undefined" == typeof i["default"].getAuthorizers()[n]) throw"'" + n + "' is not a recognized auth transport";
                    this.type = n, this.options = e, this.authOptions = (e || {}).auth || {}
                }

                return t.prototype.composeQuery = function (t) {
                    var e = "socket_id=" + encodeURIComponent(t) + "&channel_name=" + encodeURIComponent(this.channel.name);
                    for (var n in this.authOptions.params) e += "&" + encodeURIComponent(n) + "=" + encodeURIComponent(this.authOptions.params[n]);
                    return e
                }, t.prototype.authorize = function (e, n) {
                    return t.authorizers = t.authorizers || i["default"].getAuthorizers(), t.authorizers[this.type].call(this, i["default"], e, n)
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = n(2), o = function () {
                function t(t, e) {
                    this.timeline = t, this.options = e || {}
                }

                return t.prototype.send = function (t, e) {
                    this.timeline.isEmpty() || this.timeline.send(i["default"].TimelineTransport.getAgent(this, t), e)
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(50), r = n(8), s = n(52), a = function (t) {
                function e(e, n) {
                    t.call(this, e, n), this.members = new s["default"]
                }

                return i(e, t), e.prototype.authorize = function (e, n) {
                    var i = this;
                    t.prototype.authorize.call(this, e, function (t, e) {
                        if (!t) {
                            if (void 0 === e.channel_data) return r["default"].warn("Invalid auth response for channel '" + i.name + "', expected 'channel_data' field"), void n("Invalid auth response");
                            var o = JSON.parse(e.channel_data);
                            i.members.setMyID(o.user_id)
                        }
                        n(t, e)
                    })
                }, e.prototype.handleEvent = function (t, e) {
                    switch (t) {
                        case"pusher_internal:subscription_succeeded":
                            this.members.onSubscription(e), this.subscribed = !0, this.emit("pusher:subscription_succeeded", this.members);
                            break;
                        case"pusher_internal:member_added":
                            var n = this.members.addMember(e);
                            this.emit("pusher:member_added", n);
                            break;
                        case"pusher_internal:member_removed":
                            var i = this.members.removeMember(e);
                            i && this.emit("pusher:member_removed", i);
                            break;
                        default:
                            o["default"].prototype.handleEvent.call(this, t, e)
                    }
                }, e.prototype.disconnect = function () {
                    this.members.reset(), t.prototype.disconnect.call(this)
                }, e
            }(o["default"]);
            e.__esModule = !0, e["default"] = a
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(42), r = n(51), s = function (t) {
                function e() {
                    t.apply(this, arguments)
                }

                return i(e, t), e.prototype.authorize = function (t, e) {
                    var n = o["default"].createAuthorizer(this, this.pusher.config);
                    return n.authorize(t, e)
                }, e
            }(r["default"]);
            e.__esModule = !0, e["default"] = s
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(23), r = n(30), s = n(8), a = function (t) {
                function e(e, n) {
                    t.call(this, function (t, n) {
                        s["default"].debug("No callbacks on " + e + " for " + t)
                    }), this.name = e, this.pusher = n, this.subscribed = !1
                }

                return i(e, t), e.prototype.authorize = function (t, e) {
                    return e(!1, {})
                }, e.prototype.trigger = function (t, e) {
                    if (0 !== t.indexOf("client-")) throw new r.BadEventName("Event '" + t + "' does not start with 'client-'");
                    return this.pusher.send_event(t, e, this.name)
                }, e.prototype.disconnect = function () {
                    this.subscribed = !1
                }, e.prototype.handleEvent = function (t, e) {
                    0 === t.indexOf("pusher_internal:") ? "pusher_internal:subscription_succeeded" === t && (this.subscribed = !0, this.emit("pusher:subscription_succeeded", e)) : this.emit(t, e)
                }, e.prototype.subscribe = function () {
                    var t = this;
                    this.authorize(this.pusher.connection.socket_id, function (e, n) {
                        e ? t.handleEvent("pusher:subscription_error", n) : t.pusher.send_event("pusher:subscribe", {
                            auth: n.auth,
                            channel_data: n.channel_data,
                            channel: t.name
                        })
                    })
                }, e.prototype.unsubscribe = function () {
                    this.pusher.send_event("pusher:unsubscribe", {channel: this.name})
                }, e
            }(o["default"]);
            e.__esModule = !0, e["default"] = a
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = function () {
                function t() {
                    this.reset()
                }

                return t.prototype.get = function (t) {
                    return Object.prototype.hasOwnProperty.call(this.members, t) ? {id: t, info: this.members[t]} : null
                }, t.prototype.each = function (t) {
                    var e = this;
                    i.objectApply(this.members, function (n, i) {
                        t(e.get(i))
                    })
                }, t.prototype.setMyID = function (t) {
                    this.myID = t
                }, t.prototype.onSubscription = function (t) {
                    this.members = t.presence.hash, this.count = t.presence.count, this.me = this.get(this.myID)
                }, t.prototype.addMember = function (t) {
                    return null === this.get(t.user_id) && this.count++, this.members[t.user_id] = t.user_info, this.get(t.user_id)
                }, t.prototype.removeMember = function (t) {
                    var e = this.get(t.user_id);
                    return e && (delete this.members[t.user_id], this.count--), e
                }, t.prototype.reset = function () {
                    this.members = {}, this.count = 0, this.myID = null, this.me = null
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e, n) {
            "use strict";
            var i = this && this.__extends || function (t, e) {
                function n() {
                    this.constructor = t
                }

                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
            }, o = n(23), r = n(12), s = n(8), a = n(9), c = n(2), u = function (t) {
                function e(e, n) {
                    var i = this;
                    t.call(this), this.key = e, this.options = n || {}, this.state = "initialized", this.connection = null, this.encrypted = !!n.encrypted, this.timeline = this.options.timeline, this.connectionCallbacks = this.buildConnectionCallbacks(), this.errorCallbacks = this.buildErrorCallbacks(), this.handshakeCallbacks = this.buildHandshakeCallbacks(this.errorCallbacks);
                    var o = c["default"].getNetwork();
                    o.bind("online", function () {
                        i.timeline.info({netinfo: "online"}), ("connecting" === i.state || "unavailable" === i.state) && i.retryIn(0)
                    }), o.bind("offline", function () {
                        i.timeline.info({netinfo: "offline"}), i.connection && i.sendActivityCheck()
                    }), this.updateStrategy()
                }

                return i(e, t), e.prototype.connect = function () {
                    if (!this.connection && !this.runner) {
                        if (!this.strategy.isSupported()) return void this.updateState("failed");
                        this.updateState("connecting"), this.startConnecting(), this.setUnavailableTimer()
                    }
                }, e.prototype.send = function (t) {
                    return this.connection ? this.connection.send(t) : !1
                }, e.prototype.send_event = function (t, e, n) {
                    return this.connection ? this.connection.send_event(t, e, n) : !1
                }, e.prototype.disconnect = function () {
                    this.disconnectInternally(), this.updateState("disconnected")
                }, e.prototype.isEncrypted = function () {
                    return this.encrypted
                }, e.prototype.startConnecting = function () {
                    var t = this, e = function (n, i) {
                        n ? t.runner = t.strategy.connect(0, e) : "error" === i.action ? (t.emit("error", {
                            type: "HandshakeError",
                            error: i.error
                        }), t.timeline.error({handshakeError: i.error})) : (t.abortConnecting(), t.handshakeCallbacks[i.action](i))
                    };
                    this.runner = this.strategy.connect(0, e)
                }, e.prototype.abortConnecting = function () {
                    this.runner && (this.runner.abort(), this.runner = null)
                }, e.prototype.disconnectInternally = function () {
                    if (this.abortConnecting(), this.clearRetryTimer(), this.clearUnavailableTimer(), this.connection) {
                        var t = this.abandonConnection();
                        t.close()
                    }
                }, e.prototype.updateStrategy = function () {
                    this.strategy = this.options.getStrategy({
                        key: this.key,
                        timeline: this.timeline,
                        encrypted: this.encrypted
                    })
                }, e.prototype.retryIn = function (t) {
                    var e = this;
                    this.timeline.info({
                        action: "retry",
                        delay: t
                    }), t > 0 && this.emit("connecting_in", Math.round(t / 1e3)), this.retryTimer = new r.OneOffTimer(t || 0, function () {
                        e.disconnectInternally(), e.connect()
                    })
                }, e.prototype.clearRetryTimer = function () {
                    this.retryTimer && (this.retryTimer.ensureAborted(), this.retryTimer = null)
                }, e.prototype.setUnavailableTimer = function () {
                    var t = this;
                    this.unavailableTimer = new r.OneOffTimer(this.options.unavailableTimeout, function () {
                        t.updateState("unavailable")
                    })
                }, e.prototype.clearUnavailableTimer = function () {
                    this.unavailableTimer && this.unavailableTimer.ensureAborted()
                }, e.prototype.sendActivityCheck = function () {
                    var t = this;
                    this.stopActivityCheck(), this.connection.ping(), this.activityTimer = new r.OneOffTimer(this.options.pongTimeout, function () {
                        t.timeline.error({pong_timed_out: t.options.pongTimeout}), t.retryIn(0)
                    })
                }, e.prototype.resetActivityCheck = function () {
                    var t = this;
                    this.stopActivityCheck(), this.connection.handlesActivityChecks() || (this.activityTimer = new r.OneOffTimer(this.activityTimeout, function () {
                        t.sendActivityCheck()
                    }))
                }, e.prototype.stopActivityCheck = function () {
                    this.activityTimer && this.activityTimer.ensureAborted()
                }, e.prototype.buildConnectionCallbacks = function () {
                    var t = this;
                    return {
                        message: function (e) {
                            t.resetActivityCheck(), t.emit("message", e)
                        }, ping: function () {
                            t.send_event("pusher:pong", {})
                        }, activity: function () {
                            t.resetActivityCheck()
                        }, error: function (e) {
                            t.emit("error", {type: "WebSocketError", error: e})
                        }, closed: function () {
                            t.abandonConnection(), t.shouldRetry() && t.retryIn(1e3)
                        }
                    }
                }, e.prototype.buildHandshakeCallbacks = function (t) {
                    var e = this;
                    return a.extend({}, t, {
                        connected: function (t) {
                            e.activityTimeout = Math.min(e.options.activityTimeout, t.activityTimeout, t.connection.activityTimeout || 1 / 0), e.clearUnavailableTimer(), e.setConnection(t.connection), e.socket_id = e.connection.id, e.updateState("connected", {socket_id: e.socket_id})
                        }
                    })
                }, e.prototype.buildErrorCallbacks = function () {
                    var t = this, e = function (e) {
                        return function (n) {
                            n.error && t.emit("error", {type: "WebSocketError", error: n.error}), e(n)
                        }
                    };
                    return {
                        ssl_only: e(function () {
                            t.encrypted = !0, t.updateStrategy(), t.retryIn(0)
                        }), refused: e(function () {
                            t.disconnect()
                        }), backoff: e(function () {
                            t.retryIn(1e3)
                        }), retry: e(function () {
                            t.retryIn(0)
                        })
                    }
                }, e.prototype.setConnection = function (t) {
                    this.connection = t;
                    for (var e in this.connectionCallbacks) this.connection.bind(e, this.connectionCallbacks[e]);
                    this.resetActivityCheck()
                }, e.prototype.abandonConnection = function () {
                    if (this.connection) {
                        this.stopActivityCheck();
                        for (var t in this.connectionCallbacks) this.connection.unbind(t, this.connectionCallbacks[t]);
                        var e = this.connection;
                        return this.connection = null, e
                    }
                }, e.prototype.updateState = function (t, e) {
                    var n = this.state;
                    if (this.state = t, n !== t) {
                        var i = t;
                        "connected" === i && (i += " with new socket ID " + e.socket_id), s["default"].debug("State changed", n + " -> " + i), this.timeline.info({
                            state: t,
                            params: e
                        }), this.emit("state_change", {previous: n, current: t}), this.emit(t, e)
                    }
                }, e.prototype.shouldRetry = function () {
                    return "connecting" === this.state || "connected" === this.state
                }, e
            }(o["default"]);
            e.__esModule = !0, e["default"] = u
        }, function (t, e, n) {
            "use strict";

            function i(t, e) {
                return 0 === t.indexOf("private-") ? r["default"].createPrivateChannel(t, e) : 0 === t.indexOf("presence-") ? r["default"].createPresenceChannel(t, e) : r["default"].createChannel(t, e)
            }

            var o = n(9), r = n(42), s = function () {
                function t() {
                    this.channels = {}
                }

                return t.prototype.add = function (t, e) {
                    return this.channels[t] || (this.channels[t] = i(t, e)), this.channels[t]
                }, t.prototype.all = function () {
                    return o.values(this.channels)
                }, t.prototype.find = function (t) {
                    return this.channels[t]
                }, t.prototype.remove = function (t) {
                    var e = this.channels[t];
                    return delete this.channels[t], e
                }, t.prototype.disconnect = function () {
                    o.objectApply(this.channels, function (t) {
                        t.disconnect()
                    })
                }, t
            }();
            e.__esModule = !0, e["default"] = s
        }, function (t, e, n) {
            "use strict";

            function i(t, e) {
                return r["default"].defer(function () {
                    e(t)
                }), {
                    abort: function () {
                    }, forceMinPriority: function () {
                    }
                }
            }

            var o = n(42), r = n(11), s = n(30), a = n(9), c = function () {
                function t(t, e, n, i) {
                    this.name = t, this.priority = e, this.transport = n, this.options = i || {}
                }

                return t.prototype.isSupported = function () {
                    return this.transport.isSupported({encrypted: this.options.encrypted})
                }, t.prototype.connect = function (t, e) {
                    var n = this;
                    if (!this.isSupported()) return i(new s.UnsupportedStrategy, e);
                    if (this.priority < t) return i(new s.TransportPriorityTooLow, e);
                    var r = !1,
                        c = this.transport.createConnection(this.name, this.priority, this.options.key, this.options),
                        u = null, l = function () {
                            c.unbind("initialized", l), c.connect()
                        }, h = function () {
                            u = o["default"].createHandshake(c, function (t) {
                                r = !0, d(), e(null, t)
                            })
                        }, f = function (t) {
                            d(), e(t)
                        }, p = function () {
                            d();
                            var t;
                            try {
                                t = JSON.stringify(c)
                            } catch (n) {
                                t = a.safeJSONStringify(c)
                            }
                            e(new s.TransportClosed(t))
                        }, d = function () {
                            c.unbind("initialized", l), c.unbind("open", h), c.unbind("error", f), c.unbind("closed", p)
                        };
                    return c.bind("initialized", l), c.bind("open", h), c.bind("error", f), c.bind("closed", p), c.initialize(), {
                        abort: function () {
                            r || (d(), u ? u.close() : c.close())
                        }, forceMinPriority: function (t) {
                            r || n.priority < t && (u ? u.close() : c.close())
                        }
                    }
                }, t
            }();
            e.__esModule = !0, e["default"] = c
        }, function (t, e, n) {
            "use strict";
            var i = n(9), o = n(11), r = n(12), s = function () {
                function t(t, e) {
                    this.strategies = t, this.loop = Boolean(e.loop), this.failFast = Boolean(e.failFast), this.timeout = e.timeout, this.timeoutLimit = e.timeoutLimit
                }

                return t.prototype.isSupported = function () {
                    return i.any(this.strategies, o["default"].method("isSupported"))
                }, t.prototype.connect = function (t, e) {
                    var n = this, i = this.strategies, o = 0, r = this.timeout, s = null, a = function (c, u) {
                        u ? e(null, u) : (o += 1, n.loop && (o %= i.length), o < i.length ? (r && (r = 2 * r, n.timeoutLimit && (r = Math.min(r, n.timeoutLimit))), s = n.tryStrategy(i[o], t, {
                            timeout: r,
                            failFast: n.failFast
                        }, a)) : e(!0))
                    };
                    return s = this.tryStrategy(i[o], t, {
                        timeout: r,
                        failFast: this.failFast
                    }, a), {
                        abort: function () {
                            s.abort()
                        }, forceMinPriority: function (e) {
                            t = e, s && s.forceMinPriority(e)
                        }
                    }
                }, t.prototype.tryStrategy = function (t, e, n, i) {
                    var o = null, s = null;
                    return n.timeout > 0 && (o = new r.OneOffTimer(n.timeout, function () {
                        s.abort(), i(!0)
                    })), s = t.connect(e, function (t, e) {
                        t && o && o.isRunning() && !n.failFast || (o && o.ensureAborted(), i(t, e))
                    }), {
                        abort: function () {
                            o && o.ensureAborted(), s.abort()
                        }, forceMinPriority: function (t) {
                            s.forceMinPriority(t)
                        }
                    }
                }, t
            }();
            e.__esModule = !0, e["default"] = s
        }, function (t, e, n) {
            "use strict";

            function i(t, e, n) {
                var i = s.map(t, function (t, i, o, r) {
                    return t.connect(e, n(i, r))
                });
                return {
                    abort: function () {
                        s.apply(i, r)
                    }, forceMinPriority: function (t) {
                        s.apply(i, function (e) {
                            e.forceMinPriority(t)
                        })
                    }
                }
            }

            function o(t) {
                return s.all(t, function (t) {
                    return Boolean(t.error)
                })
            }

            function r(t) {
                t.error || t.aborted || (t.abort(), t.aborted = !0)
            }

            var s = n(9), a = n(11), c = function () {
                function t(t) {
                    this.strategies = t
                }

                return t.prototype.isSupported = function () {
                    return s.any(this.strategies, a["default"].method("isSupported"))
                }, t.prototype.connect = function (t, e) {
                    return i(this.strategies, t, function (t, n) {
                        return function (i, r) {
                            return n[t].error = i, i ? void (o(n) && e(!0)) : (s.apply(n, function (t) {
                                t.forceMinPriority(r.transport.priority)
                            }), void e(null, r))
                        }
                    })
                }, t
            }();
            e.__esModule = !0, e["default"] = c
        }, function (t, e, n) {
            "use strict";

            function i(t) {
                return "pusherTransport" + (t ? "Encrypted" : "Unencrypted")
            }

            function o(t) {
                var e = c["default"].getLocalStorage();
                if (e) try {
                    var n = e[i(t)];
                    if (n) return JSON.parse(n)
                } catch (o) {
                    s(t)
                }
                return null
            }

            function r(t, e, n) {
                var o = c["default"].getLocalStorage();
                if (o) try {
                    o[i(t)] = JSON.stringify({timestamp: a["default"].now(), transport: e, latency: n})
                } catch (r) {
                }
            }

            function s(t) {
                var e = c["default"].getLocalStorage();
                if (e) try {
                    delete e[i(t)]
                } catch (n) {
                }
            }

            var a = n(11), c = n(2), u = n(56), l = function () {
                function t(t, e, n) {
                    this.strategy = t, this.transports = e, this.ttl = n.ttl || 18e5, this.encrypted = n.encrypted, this.timeline = n.timeline
                }

                return t.prototype.isSupported = function () {
                    return this.strategy.isSupported()
                }, t.prototype.connect = function (t, e) {
                    var n = this.encrypted, i = o(n), c = [this.strategy];
                    if (i && i.timestamp + this.ttl >= a["default"].now()) {
                        var l = this.transports[i.transport];
                        l && (this.timeline.info({
                            cached: !0,
                            transport: i.transport,
                            latency: i.latency
                        }), c.push(new u["default"]([l], {timeout: 2 * i.latency + 1e3, failFast: !0})))
                    }
                    var h = a["default"].now(), f = c.pop().connect(t, function p(i, o) {
                        i ? (s(n), c.length > 0 ? (h = a["default"].now(), f = c.pop().connect(t, p)) : e(i)) : (r(n, o.transport.name, a["default"].now() - h), e(null, o))
                    });
                    return {
                        abort: function () {
                            f.abort()
                        }, forceMinPriority: function (e) {
                            t = e, f && f.forceMinPriority(e)
                        }
                    }
                }, t
            }();
            e.__esModule = !0, e["default"] = l
        }, function (t, e, n) {
            "use strict";
            var i = n(12), o = function () {
                function t(t, e) {
                    var n = e.delay;
                    this.strategy = t, this.options = {delay: n}
                }

                return t.prototype.isSupported = function () {
                    return this.strategy.isSupported()
                }, t.prototype.connect = function (t, e) {
                    var n, o = this.strategy, r = new i.OneOffTimer(this.options.delay, function () {
                        n = o.connect(t, e)
                    });
                    return {
                        abort: function () {
                            r.ensureAborted(), n && n.abort()
                        }, forceMinPriority: function (e) {
                            t = e, n && n.forceMinPriority(e)
                        }
                    }
                }, t
            }();
            e.__esModule = !0, e["default"] = o
        }, function (t, e) {
            "use strict";
            var n = function () {
                function t(t, e, n) {
                    this.test = t, this.trueBranch = e, this.falseBranch = n
                }

                return t.prototype.isSupported = function () {
                    var t = this.test() ? this.trueBranch : this.falseBranch;
                    return t.isSupported()
                }, t.prototype.connect = function (t, e) {
                    var n = this.test() ? this.trueBranch : this.falseBranch;
                    return n.connect(t, e)
                }, t
            }();
            e.__esModule = !0, e["default"] = n
        }, function (t, e) {
            "use strict";
            var n = function () {
                function t(t) {
                    this.strategy = t
                }

                return t.prototype.isSupported = function () {
                    return this.strategy.isSupported()
                }, t.prototype.connect = function (t, e) {
                    var n = this.strategy.connect(t, function (t, i) {
                        i && n.abort(), e(t, i)
                    });
                    return n
                }, t
            }();
            e.__esModule = !0, e["default"] = n
        }, function (t, e, n) {
            "use strict";
            var i = n(5);
            e.getGlobalConfig = function () {
                return {
                    wsHost: i["default"].host,
                    wsPort: i["default"].ws_port,
                    wssPort: i["default"].wss_port,
                    httpHost: i["default"].sockjs_host,
                    httpPort: i["default"].sockjs_http_port,
                    httpsPort: i["default"].sockjs_https_port,
                    httpPath: i["default"].sockjs_path,
                    statsHost: i["default"].stats_host,
                    authEndpoint: i["default"].channel_auth_endpoint,
                    authTransport: i["default"].channel_auth_transport,
                    activity_timeout: i["default"].activity_timeout,
                    pong_timeout: i["default"].pong_timeout,
                    unavailable_timeout: i["default"].unavailable_timeout
                }
            }, e.getClusterConfig = function (t) {
                return {wsHost: "ws-" + t + ".pusher.com", httpHost: "sockjs-" + t + ".pusher.com"}
            }
        }])
    });
});
$(document).ready(function () {
    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @version 0.6.11
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */
    function FastClick(a) {
        "use strict";
        var b, c = this;
        if (this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = 10, this.layer = a, !a || !a.nodeType) throw new TypeError("Layer must be a document node");
        this.onClick = function () {
            return FastClick.prototype.onClick.apply(c, arguments)
        }, this.onMouse = function () {
            return FastClick.prototype.onMouse.apply(c, arguments)
        }, this.onTouchStart = function () {
            return FastClick.prototype.onTouchStart.apply(c, arguments)
        }, this.onTouchMove = function () {
            return FastClick.prototype.onTouchMove.apply(c, arguments)
        }, this.onTouchEnd = function () {
            return FastClick.prototype.onTouchEnd.apply(c, arguments)
        }, this.onTouchCancel = function () {
            return FastClick.prototype.onTouchCancel.apply(c, arguments)
        }, FastClick.notNeeded(a) || (this.deviceIsAndroid && (a.addEventListener("mouseover", this.onMouse, !0), a.addEventListener("mousedown", this.onMouse, !0), a.addEventListener("mouseup", this.onMouse, !0)), a.addEventListener("click", this.onClick, !0), a.addEventListener("touchstart", this.onTouchStart, !1), a.addEventListener("touchmove", this.onTouchMove, !1), a.addEventListener("touchend", this.onTouchEnd, !1), a.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (a.removeEventListener = function (b, c, d) {
            var e = Node.prototype.removeEventListener;
            "click" === b ? e.call(a, b, c.hijacked || c, d) : e.call(a, b, c, d)
        }, a.addEventListener = function (b, c, d) {
            var e = Node.prototype.addEventListener;
            "click" === b ? e.call(a, b, c.hijacked || (c.hijacked = function (a) {
                a.propagationStopped || c(a)
            }), d) : e.call(a, b, c, d)
        }), "function" == typeof a.onclick && (b = a.onclick, a.addEventListener("click", function (a) {
            b(a)
        }, !1), a.onclick = null))
    }

    FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0, FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent), FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent), FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent), FastClick.prototype.needsClick = function (a) {
        "use strict";
        switch (a.nodeName.toLowerCase()) {
            case"button":
            case"select":
            case"textarea":
                if (a.disabled) return !0;
                break;
            case"input":
                if (this.deviceIsIOS && "file" === a.type || a.disabled) return !0;
                break;
            case"label":
            case"video":
                return !0
        }
        return /\bneedsclick\b/.test(a.className)
    }, FastClick.prototype.needsFocus = function (a) {
        "use strict";
        switch (a.nodeName.toLowerCase()) {
            case"textarea":
                return !0;
            case"select":
                return !this.deviceIsAndroid;
            case"input":
                switch (a.type) {
                    case"button":
                    case"checkbox":
                    case"file":
                    case"image":
                    case"radio":
                    case"submit":
                        return !1
                }
                return !a.disabled && !a.readOnly;
            default:
                return /\bneedsfocus\b/.test(a.className)
        }
    }, FastClick.prototype.sendClick = function (a, b) {
        "use strict";
        var c, d;
        document.activeElement && document.activeElement !== a && document.activeElement.blur(), d = b.changedTouches[0], c = document.createEvent("MouseEvents"), c.initMouseEvent(this.determineEventType(a), !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null), c.forwardedTouchEvent = !0, a.dispatchEvent(c)
    }, FastClick.prototype.determineEventType = function (a) {
        "use strict";
        return this.deviceIsAndroid && "select" === a.tagName.toLowerCase() ? "mousedown" : "click"
    }, FastClick.prototype.focus = function (a) {
        "use strict";
        var b;
        this.deviceIsIOS && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type ? (b = a.value.length, a.setSelectionRange(b, b)) : a.focus()
    }, FastClick.prototype.updateScrollParent = function (a) {
        "use strict";
        var b, c;
        if (b = a.fastClickScrollParent, !b || !b.contains(a)) {
            c = a;
            do {
                if (c.scrollHeight > c.offsetHeight) {
                    b = c, a.fastClickScrollParent = c;
                    break
                }
                c = c.parentElement
            } while (c)
        }
        b && (b.fastClickLastScrollTop = b.scrollTop)
    }, FastClick.prototype.getTargetElementFromEventTarget = function (a) {
        "use strict";
        return a.nodeType === Node.TEXT_NODE ? a.parentNode : a
    }, FastClick.prototype.onTouchStart = function (a) {
        "use strict";
        var b, c, d;
        if (a.targetTouches.length > 1) return !0;
        if (b = this.getTargetElementFromEventTarget(a.target), c = a.targetTouches[0], this.deviceIsIOS) {
            if (d = window.getSelection(), d.rangeCount && !d.isCollapsed) return !0;
            if (!this.deviceIsIOS4) {
                if (c.identifier === this.lastTouchIdentifier) return a.preventDefault(), !1;
                this.lastTouchIdentifier = c.identifier, this.updateScrollParent(b)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = a.timeStamp, this.targetElement = b, this.touchStartX = c.pageX, this.touchStartY = c.pageY, a.timeStamp - this.lastClickTime < 200 && a.preventDefault(), !0
    }, FastClick.prototype.touchHasMoved = function (a) {
        "use strict";
        var b = a.changedTouches[0], c = this.touchBoundary;
        return Math.abs(b.pageX - this.touchStartX) > c || Math.abs(b.pageY - this.touchStartY) > c ? !0 : !1
    }, FastClick.prototype.onTouchMove = function (a) {
        "use strict";
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
    }, FastClick.prototype.findControl = function (a) {
        "use strict";
        return void 0 !== a.control ? a.control : a.htmlFor ? document.getElementById(a.htmlFor) : a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, FastClick.prototype.onTouchEnd = function (a) {
        "use strict";
        var b, c, d, e, f, g = this.targetElement;
        if (!this.trackingClick) return !0;
        if (a.timeStamp - this.lastClickTime < 200) return this.cancelNextClick = !0, !0;
        if (this.cancelNextClick = !1, this.lastClickTime = a.timeStamp, c = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, this.deviceIsIOSWithBadTarget && (f = a.changedTouches[0], g = document.elementFromPoint(f.pageX - window.pageXOffset, f.pageY - window.pageYOffset) || g, g.fastClickScrollParent = this.targetElement.fastClickScrollParent), d = g.tagName.toLowerCase(), "label" === d) {
            if (b = this.findControl(g)) {
                if (this.focus(g), this.deviceIsAndroid) return !1;
                g = b
            }
        } else if (this.needsFocus(g)) return a.timeStamp - c > 100 || this.deviceIsIOS && window.top !== window && "input" === d ? (this.targetElement = null, !1) : (this.focus(g), this.deviceIsIOS4 && "select" === d || (this.targetElement = null, a.preventDefault()), !1);
        return this.deviceIsIOS && !this.deviceIsIOS4 && (e = g.fastClickScrollParent, e && e.fastClickLastScrollTop !== e.scrollTop) ? !0 : (this.needsClick(g) || (a.preventDefault(), this.sendClick(g, a)), !1)
    }, FastClick.prototype.onTouchCancel = function () {
        "use strict";
        this.trackingClick = !1, this.targetElement = null
    }, FastClick.prototype.onMouse = function (a) {
        "use strict";
        return this.targetElement ? a.forwardedTouchEvent ? !0 : a.cancelable ? !this.needsClick(this.targetElement) || this.cancelNextClick ? (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0, a.stopPropagation(), a.preventDefault(), !1) : !0 : !0 : !0
    }, FastClick.prototype.onClick = function (a) {
        "use strict";
        var b;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === a.target.type && 0 === a.detail ? !0 : (b = this.onMouse(a), b || (this.targetElement = null), b)
    }, FastClick.prototype.destroy = function () {
        "use strict";
        var a = this.layer;
        this.deviceIsAndroid && (a.removeEventListener("mouseover", this.onMouse, !0), a.removeEventListener("mousedown", this.onMouse, !0), a.removeEventListener("mouseup", this.onMouse, !0)), a.removeEventListener("click", this.onClick, !0), a.removeEventListener("touchstart", this.onTouchStart, !1), a.removeEventListener("touchmove", this.onTouchMove, !1), a.removeEventListener("touchend", this.onTouchEnd, !1), a.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, FastClick.notNeeded = function (a) {
        "use strict";
        var b, c;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (c = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!FastClick.prototype.deviceIsAndroid) return !0;
            if (b = document.querySelector("meta[name=viewport]")) {
                if (-1 !== b.content.indexOf("user-scalable=no")) return !0;
                if (c > 31 && window.innerWidth <= window.screen.width) return !0
            }
        }
        return "none" === a.style.msTouchAction ? !0 : !1
    }, FastClick.attach = function (a) {
        "use strict";
        return new FastClick(a)
    }, "undefined" != typeof define && define.amd ? define(function () {
        "use strict";
        return FastClick
    }) : "undefined" != typeof module && module.exports ? (module.exports = FastClick.attach, module.exports.FastClick = FastClick) : window.FastClick = FastClick;
});
$(document).ready(function () {/*
 jQuery Cookie Plugin v1.4.0
 https://github.com/carhartl/jquery-cookie

 Copyright 2013 Klaus Hartl
 Released under the MIT license
 JavaScript Cookie v2.2.0
 https://github.com/js-cookie/js-cookie

 Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 Released under the MIT license
*/
    (function (factory) {
        var registeredInModuleLoader = false;
        if (typeof define === "function" && define.amd) {
            define(factory);
            registeredInModuleLoader = true
        }
        if (typeof exports === "object") {
            module.exports = factory();
            registeredInModuleLoader = true
        }
        if (!registeredInModuleLoader) {
            var OldCookies = window.Cookies;
            var api = window.Cookies = factory();
            api.noConflict = function () {
                window.Cookies = OldCookies;
                return api
            }
        }
    })(function () {
        function extend() {
            var i = 0;
            for (var result = {}; i < arguments.length; i++) {
                var attributes = arguments[i];
                for (var key in attributes) result[key] =
                    attributes[key]
            }
            return result
        }

        function init(converter) {
            function api(key, value, attributes) {
                if (typeof document === "undefined") return;
                if (arguments.length > 1) {
                    attributes = extend({path: "/"}, api.defaults, attributes);
                    if (typeof attributes.expires === "number") {
                        var expires = new Date;
                        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864E5);
                        attributes.expires = expires
                    }
                    attributes.expires = attributes.expires ? attributes.expires.toUTCString() : "";
                    try {
                        var result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) value =
                            result
                    } catch (e) {
                    }
                    if (!converter.write) value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent); else value = converter.write(value, key);
                    key = encodeURIComponent(String(key));
                    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                    key = key.replace(/[\(\)]/g, escape);
                    var stringifiedAttributes = "";
                    for (var attributeName in attributes) {
                        if (!attributes[attributeName]) continue;
                        stringifiedAttributes += "; " + attributeName;
                        if (attributes[attributeName] ===
                            true) continue;
                        stringifiedAttributes += "\x3d" + attributes[attributeName]
                    }
                    return document.cookie = key + "\x3d" + value + stringifiedAttributes
                }
                if (!key) result = {};
                var cookies = document.cookie ? document.cookie.split("; ") : [];
                var rdecode = /(%[0-9A-Z]{2})+/g;
                for (var i = 0; i < cookies.length; i++) {
                    var parts = cookies[i].split("\x3d");
                    var cookie = parts.slice(1).join("\x3d");
                    if (!this.json && cookie.charAt(0) === '"') cookie = cookie.slice(1, -1);
                    try {
                        var name = parts[0].replace(rdecode, decodeURIComponent);
                        cookie = converter.read ? converter.read(cookie,
                            name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);
                        if (this.json) try {
                            cookie = JSON.parse(cookie)
                        } catch (e$0) {
                        }
                        if (key === name) {
                            result = cookie;
                            break
                        }
                        if (!key) result[name] = cookie
                    } catch (e$1) {
                    }
                }
                return result
            }

            api.set = api;
            api.get = function (key) {
                return api.call(api, key)
            };
            api.getJSON = function () {
                return api.apply({json: true}, [].slice.call(arguments))
            };
            api.defaults = {};
            api.remove = function (key, attributes) {
                api(key, "", extend(attributes, {expires: -1}))
            };
            api.withConverter = init;
            return api
        }

        return init(function () {
        })
    });
});
$(document).ready(function () {/*! Sidr - v1.2.1 - 2013-11-06
 * https://github.com/artberri/sidr
 * Copyright (c) 2013 Alberto Varela; Licensed MIT */
    (function (e) {
        var t = !1, i = !1, n = {
            isUrl: function (e) {
                var t = RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i");
                return t.test(e) ? !0 : !1
            }, loadContent: function (e, t) {
                e.html(t)
            }, addPrefix: function (e) {
                var t = e.attr("id"), i = e.attr("class");
                "string" == typeof t && "" !== t && e.attr("id", t.replace(/([A-Za-z0-9_.\-]+)/g, "sidr-id-$1")), "string" == typeof i && "" !== i && "sidr-inner" !== i && e.attr("class", i.replace(/([A-Za-z0-9_.\-]+)/g, "sidr-class-$1")), e.removeAttr("style")
            }, execute: function (n, s, a) {
                "function" == typeof s ? (a = s, s = "sidr") : s || (s = "sidr");
                var r, d, l, c = e("#" + s), u = e(c.data("body")), f = e("html"), p = c.outerWidth(!0),
                    g = c.data("speed"), h = c.data("side"), m = c.data("displace"), v = c.data("onOpen"),
                    y = c.data("onClose"), x = "sidr" === s ? "sidr-open" : "sidr-open " + s + "-open";
                if ("open" === n || "toggle" === n && !c.is(":visible")) {
                    if (c.is(":visible") || t) return;
                    if (i !== !1) return o.close(i, function () {
                        o.open(s)
                    }), void 0;
                    t = !0, "left" === h ? (r = {left: p + "px"}, d = {left: "0px"}) : (r = {right: p + "px"}, d = {right: "0px"}), u.is("body") && (l = f.scrollTop(), f.css("overflow-x", "hidden").scrollTop(l)), m ? u.addClass("sidr-animating").css({
                        width: u.width(),
                        position: "absolute"
                    }).animate(r, g, function () {
                        e(this).addClass(x)
                    }) : setTimeout(function () {
                        e(this).addClass(x)
                    }, g), c.css("display", "block").animate(d, g, function () {
                        t = !1, i = s, "function" == typeof a && a(s), u.removeClass("sidr-animating")
                    }), v()
                } else {
                    if (!c.is(":visible") || t) return;
                    t = !0, "left" === h ? (r = {left: 0}, d = {left: "-" + p + "px"}) : (r = {right: 0}, d = {right: "-" + p + "px"}), u.is("body") && (l = f.scrollTop(), f.removeAttr("style").scrollTop(l)), u.addClass("sidr-animating").animate(r, g).removeClass(x), c.animate(d, g, function () {
                        c.removeAttr("style").hide(), u.removeAttr("style"), e("html").removeAttr("style"), t = !1, i = !1, "function" == typeof a && a(s), u.removeClass("sidr-animating")
                    }), y()
                }
            }
        }, o = {
            open: function (e, t) {
                n.execute("open", e, t)
            }, close: function (e, t) {
                n.execute("close", e, t)
            }, toggle: function (e, t) {
                n.execute("toggle", e, t)
            }, toogle: function (e, t) {
                n.execute("toggle", e, t)
            }
        };
        e.sidr = function (t) {
            return o[t] ? o[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "function" != typeof t && "string" != typeof t && t ? (e.error("Method " + t + " does not exist on jQuery.sidr"), void 0) : o.toggle.apply(this, arguments)
        }, e.fn.sidr = function (t) {
            var i = e.extend({
                name: "sidr",
                speed: 200,
                side: "left",
                source: null,
                renaming: !0,
                body: "body",
                displace: !0,
                onOpen: function () {
                },
                onClose: function () {
                }
            }, t), s = i.name, a = e("#" + s);
            if (0 === a.length && (a = e("<div />").attr("id", s).appendTo(e("body"))), a.addClass("sidr").addClass(i.side).data({
                speed: i.speed,
                side: i.side,
                body: i.body,
                displace: i.displace,
                onOpen: i.onOpen,
                onClose: i.onClose
            }), "function" == typeof i.source) {
                var r = i.source(s);
                n.loadContent(a, r)
            } else if ("string" == typeof i.source && n.isUrl(i.source)) e.get(i.source, function (e) {
                n.loadContent(a, e)
            }); else if ("string" == typeof i.source) {
                var d = "", l = i.source.split(",");
                if (e.each(l, function (t, i) {
                    d += '<div class="sidr-inner">' + e(i).html() + "</div>"
                }), i.renaming) {
                    var c = e("<div />").html(d);
                    c.find("*").each(function (t, i) {
                        var o = e(i);
                        n.addPrefix(o)
                    }), d = c.html()
                }
                n.loadContent(a, d)
            } else null !== i.source && e.error("Invalid Sidr Source");
            return this.each(function () {
                var t = e(this), i = t.data("sidr");
                i || (t.data("sidr", s), "ontouchstart" in document.documentElement ? (t.bind("touchstart", function (e) {
                    e.originalEvent.touches[0], this.touched = e.timeStamp
                }), t.bind("touchend", function (e) {
                    var t = Math.abs(e.timeStamp - this.touched);
                    200 > t && (e.preventDefault(), o.toggle(s))
                })) : t.click(function (e) {
                    e.preventDefault(), o.toggle(s)
                }))
            })
        }
    })(jQuery);
});
$(document).ready(function () {/*
 jQuery Smooth Scroll - v2.0.1 - 2016-09-07
 https://github.com/kswedberg/jquery-smooth-scroll
 Copyright (c) 2016 Karl Swedberg
 Licensed MIT
*/
    (function (factory) {
        if (typeof define === "function" && define.amd) define(["jquery"], factory); else if (typeof module === "object" && module.exports) factory(require("jquery")); else factory(jQuery)
    })(function ($) {
        var version = "2.0.1";
        var optionOverrides = {};
        var defaults = {
            exclude: [],
            excludeWithin: [],
            offset: 0,
            direction: "top",
            delegateSelector: null,
            scrollElement: null,
            scrollTarget: null,
            beforeScroll: function () {
            },
            afterScroll: function () {
            },
            easing: "swing",
            speed: 400,
            autoCoefficient: 2,
            preventDefault: true
        };
        var getScrollable =
            function (opts) {
                var scrollable = [];
                var scrolled = false;
                var dir = opts.dir && opts.dir === "left" ? "scrollLeft" : "scrollTop";
                this.each(function () {
                    var el = $(this);
                    if (this === document || this === window) return;
                    if (document.scrollingElement && (this === document.documentElement || this === document.body)) {
                        scrollable.push(document.scrollingElement);
                        return false
                    }
                    if (el[dir]() > 0) scrollable.push(this); else {
                        el[dir](1);
                        scrolled = el[dir]() > 0;
                        if (scrolled) scrollable.push(this);
                        el[dir](0)
                    }
                });
                if (!scrollable.length) this.each(function () {
                    if (this ===
                        document.documentElement && $(this).css("scrollBehavior") === "smooth") scrollable = [this];
                    if (!scrollable.length && this.nodeName === "BODY") scrollable = [this]
                });
                if (opts.el === "first" && scrollable.length > 1) scrollable = [scrollable[0]];
                return scrollable
            };
        $.fn.extend({
            scrollable: function (dir) {
                var scrl = getScrollable.call(this, {dir: dir});
                return this.pushStack(scrl)
            }, firstScrollable: function (dir) {
                var scrl = getScrollable.call(this, {el: "first", dir: dir});
                return this.pushStack(scrl)
            }, smoothScroll: function (options, extra) {
                options =
                    options || {};
                if (options === "options") {
                    if (!extra) return this.first().data("ssOpts");
                    return this.each(function () {
                        var $this = $(this);
                        var opts = $.extend($this.data("ssOpts") || {}, extra);
                        $(this).data("ssOpts", opts)
                    })
                }
                var opts$jscomp$0 = $.extend({}, $.fn.smoothScroll.defaults, options);
                var clickHandler = function (event) {
                    var escapeSelector = function (str) {
                        return str.replace(/(:|\.|\/)/g, "\\$1")
                    };
                    var link = this;
                    var $link = $(this);
                    var thisOpts = $.extend({}, opts$jscomp$0, $link.data("ssOpts") || {});
                    var exclude = opts$jscomp$0.exclude;
                    var excludeWithin = thisOpts.excludeWithin;
                    var elCounter = 0;
                    var ewlCounter = 0;
                    var include = true;
                    var clickOpts = {};
                    var locationPath = $.smoothScroll.filterPath(location.pathname);
                    var linkPath = $.smoothScroll.filterPath(link.pathname);
                    var hostMatch = location.hostname === link.hostname || !link.hostname;
                    var pathMatch = thisOpts.scrollTarget || linkPath === locationPath;
                    var thisHash = escapeSelector(link.hash);
                    if (thisHash && !$(thisHash).length) include = false;
                    if (!thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash)) include =
                        false; else {
                        for (; include && elCounter < exclude.length;) if ($link.is(escapeSelector(exclude[elCounter++]))) include = false;
                        for (; include && ewlCounter < excludeWithin.length;) if ($link.closest(excludeWithin[ewlCounter++]).length) include = false
                    }
                    if (include) {
                        if (thisOpts.preventDefault) event.preventDefault();
                        $.extend(clickOpts, thisOpts, {scrollTarget: thisOpts.scrollTarget || thisHash, link: link});
                        $.smoothScroll(clickOpts)
                    }
                };
                if (options.delegateSelector !== null) this.off("click.smoothscroll", options.delegateSelector).on("click.smoothscroll",
                    options.delegateSelector, clickHandler); else this.off("click.smoothscroll").on("click.smoothscroll", clickHandler);
                return this
            }
        });
        $.smoothScroll = function (options, px) {
            if (options === "options" && typeof px === "object") return $.extend(optionOverrides, px);
            var scrollerOffset = 0;
            var offPos = "offset";
            var scrollDir = "scrollTop";
            var aniProps = {};
            var aniOpts = {};
            if (typeof options === "number") {
                var opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
                var scrollTargetOffset = options
            } else {
                opts = $.extend({link: null},
                    $.fn.smoothScroll.defaults, options || {}, optionOverrides);
                if (opts.scrollElement) {
                    offPos = "position";
                    if (opts.scrollElement.css("position") === "static") opts.scrollElement.css("position", "relative")
                }
            }
            scrollDir = opts.direction === "left" ? "scrollLeft" : scrollDir;
            if (opts.scrollElement) {
                var $scroller = opts.scrollElement;
                if (!/^(?:HTML|BODY)$/.test($scroller[0].nodeName)) scrollerOffset = $scroller[scrollDir]()
            } else $scroller = $("html, body").firstScrollable(opts.direction);
            opts.beforeScroll.call($scroller, opts);
            scrollTargetOffset =
                typeof options === "number" ? options : px || $(opts.scrollTarget)[offPos]() && $(opts.scrollTarget)[offPos]()[opts.direction] || 0;
            aniProps[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;
            var speed = opts.speed;
            if (speed === "auto") {
                var delta = Math.abs(aniProps[scrollDir] - $scroller[scrollDir]());
                speed = delta / opts.autoCoefficient
            }
            aniOpts = {
                duration: speed, easing: opts.easing, complete: function () {
                    opts.afterScroll.call(opts.link, opts)
                }
            };
            if (opts.step) aniOpts.step = opts.step;
            if ($scroller.length) $scroller.stop().animate(aniProps,
                aniOpts); else opts.afterScroll.call(opts.link, opts)
        };
        $.smoothScroll.version = version;
        $.smoothScroll.filterPath = function (string) {
            string = string || "";
            return string.replace(/^\//, "").replace(/(?:index|default).[a-zA-Z]{3,4}$/, "").replace(/\/$/, "")
        };
        $.fn.smoothScroll.defaults = defaults
    });
});
$(document).ready(function () {
    jQuery.easing["jswing"] = jQuery.easing["swing"];
    jQuery.extend(jQuery.easing, {
        def: "easeOutQuad", swing: function (x, t, b, c, d) {
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d)
        }, easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b
        }, easeOutQuad: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b
        }, easeInOutQuad: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b
        }, easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b
        }, easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b
        }, easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c /
                2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b
        }, easeInQuart: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b
        }, easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b
        }, easeInOutQuart: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b
        }, easeInQuint: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b
        }, easeOutQuint: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b
        }, easeInOutQuint: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
        }, easeInSine: function (x,
                                 t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
        }, easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b
        }, easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
        }, easeInExpo: function (x, t, b, c, d) {
            return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
        }, easeOutExpo: function (x, t, b, c, d) {
            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
        }, easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
        }, easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
        }, easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
        }, easeInElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) /
                p)) + b
        }, easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        }, easeInOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4
            } else s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t *
                d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
        }, easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b
        }, easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        }, easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
        }, easeInBounce: function (x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce(x,
                d - t, 0, c, d) + b
        }, easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b; else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b; else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b; else return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b
        }, easeInOutBounce: function (x, t, b, c, d) {
            if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
        }
    });
});
$(document).ready(function () {/*
 Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.1.0
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/
    (function () {
        var _ref;
        var __hasProp = {}.hasOwnProperty;
        var __extends = function (child, parent) {
            function ctor() {
                this.constructor = child
            }

            for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
            ctor.prototype = parent.prototype;
            child.prototype = new ctor;
            child.__super__ = parent.prototype;
            return child
        };
        var SelectParser = function () {
            function SelectParser() {
                this.options_index = 0;
                this.parsed = []
            }

            SelectParser.prototype.add_node = function (child) {
                if (child.nodeName.toUpperCase() === "OPTGROUP") return this.add_group(child);
                else return this.add_option(child)
            };
            SelectParser.prototype.add_group = function (group) {
                var _i;
                var _len;
                var group_position = this.parsed.length;
                this.parsed.push({
                    array_index: group_position,
                    group: true,
                    label: this.escapeExpression(group.label),
                    children: 0,
                    disabled: group.disabled
                });
                var _ref = group.childNodes;
                var _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    var option = _ref[_i];
                    _results.push(this.add_option(option, group_position, group.disabled))
                }
                return _results
            };
            SelectParser.prototype.add_option = function (option,
                                                          group_position, group_disabled) {
                if (option.nodeName.toUpperCase() === "OPTION") {
                    if (option.text !== "") {
                        if (group_position != null) this.parsed[group_position].children += 1;
                        this.parsed.push({
                            array_index: this.parsed.length,
                            options_index: this.options_index,
                            value: option.value,
                            text: option.text,
                            html: option.innerHTML,
                            selected: option.selected,
                            disabled: group_disabled === true ? group_disabled : option.disabled,
                            group_array_index: group_position,
                            classes: option.className,
                            style: option.style.cssText
                        })
                    } else this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index, empty: true
                    });
                    return this.options_index += 1
                }
            };
            SelectParser.prototype.escapeExpression = function (text) {
                if (text == null || text === false) return "";
                if (!/[\&\<\>\"\'\`]/.test(text)) return text;
                var map = {"\x3c": "\x26lt;", "\x3e": "\x26gt;", '"': "\x26quot;", "'": "\x26#x27;", "`": "\x26#x60;"};
                var unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
                return text.replace(unsafe_chars, function (chr) {
                    return map[chr] || "\x26amp;"
                })
            };
            return SelectParser
        }();
        SelectParser.select_to_array = function (select) {
            var _i;
            var _len;
            var parser = new SelectParser;
            var _ref = select.childNodes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                var child = _ref[_i];
                parser.add_node(child)
            }
            return parser.parsed
        };
        var AbstractChosen = function () {
            function AbstractChosen(form_field, options) {
                this.form_field = form_field;
                this.options = options != null ? options : {};
                if (!AbstractChosen.browser_is_supported()) return;
                this.is_multiple = this.form_field.multiple;
                this.set_default_text();
                this.set_default_values();
                this.setup();
                this.set_up_html();
                this.register_observers()
            }

            AbstractChosen.prototype.set_default_values = function () {
                var _this = this;
                this.click_test_action = function (evt) {
                    return _this.test_active_click(evt)
                };
                this.activate_action = function (evt) {
                    return _this.activate_field(evt)
                };
                this.active_field = false;
                this.mouse_on_container = false;
                this.results_showing = false;
                this.result_highlighted = null;
                this.allow_single_deselect = this.options.allow_single_deselect != null && this.form_field.options[0] != null && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
                this.disable_search_threshold = this.options.disable_search_threshold || 0;
                this.disable_search = this.options.disable_search || false;
                this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
                this.group_search = this.options.group_search != null ? this.options.group_search : true;
                this.search_contains = this.options.search_contains || false;
                this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
                this.max_selected_options =
                    this.options.max_selected_options || Infinity;
                this.inherit_select_classes = this.options.inherit_select_classes || false;
                this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
                return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true
            };
            AbstractChosen.prototype.set_default_text = function () {
                if (this.form_field.getAttribute("data-placeholder")) this.default_text = this.form_field.getAttribute("data-placeholder");
                else if (this.is_multiple) this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text; else this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
                return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text
            };
            AbstractChosen.prototype.mouse_enter = function () {
                return this.mouse_on_container =
                    true
            };
            AbstractChosen.prototype.mouse_leave = function () {
                return this.mouse_on_container = false
            };
            AbstractChosen.prototype.input_focus = function (evt) {
                var _this = this;
                if (this.is_multiple) {
                    if (!this.active_field) return setTimeout(function () {
                        return _this.container_mousedown()
                    }, 50)
                } else if (!this.active_field) return this.activate_field()
            };
            AbstractChosen.prototype.input_blur = function (evt) {
                var _this = this;
                if (!this.mouse_on_container) {
                    this.active_field = false;
                    return setTimeout(function () {
                        return _this.blur_test()
                    }, 100)
                }
            };
            AbstractChosen.prototype.results_option_build = function (options) {
                var _i;
                var _len;
                var content = "";
                var _ref = this.results_data;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    var data = _ref[_i];
                    if (data.group) content += this.result_add_group(data); else content += this.result_add_option(data);
                    if (options != null ? options.first : void 0) if (data.selected && this.is_multiple) this.choice_build(data); else if (data.selected && !this.is_multiple) this.single_set_selected_text(data.text)
                }
                return content
            };
            AbstractChosen.prototype.result_add_option =
                function (option) {
                    if (!option.search_match) return "";
                    if (!this.include_option_in_results(option)) return "";
                    var classes = [];
                    if (!option.disabled && !(option.selected && this.is_multiple)) classes.push("active-result");
                    if (option.disabled && !(option.selected && this.is_multiple)) classes.push("disabled-result");
                    if (option.selected) classes.push("result-selected");
                    if (option.group_array_index != null) classes.push("group-option");
                    if (option.classes !== "") classes.push(option.classes);
                    var option_el = document.createElement("li");
                    option_el.className = classes.join(" ");
                    option_el.style.cssText = option.style;
                    option_el.setAttribute("data-option-array-index", option.array_index);
                    option_el.innerHTML = option.search_text;
                    return this.outerHTML(option_el)
                };
            AbstractChosen.prototype.result_add_group = function (group) {
                if (!(group.search_match || group.group_match)) return "";
                if (!(group.active_options > 0)) return "";
                var group_el = document.createElement("li");
                group_el.className = "group-result";
                group_el.innerHTML = group.search_text;
                return this.outerHTML(group_el)
            };
            AbstractChosen.prototype.results_update_field = function () {
                this.set_default_text();
                if (!this.is_multiple) this.results_reset_cleanup();
                this.result_clear_highlight();
                this.results_build();
                if (this.results_showing) return this.winnow_results()
            };
            AbstractChosen.prototype.reset_single_select_options = function () {
                var _i;
                var _len;
                var _ref = this.results_data;
                var _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    var result = _ref[_i];
                    if (result.selected) _results.push(result.selected = false); else _results.push(void 0)
                }
                return _results
            };
            AbstractChosen.prototype.results_toggle = function () {
                if (this.results_showing) return this.results_hide(); else return this.results_show()
            };
            AbstractChosen.prototype.results_search = function (evt) {
                if (this.results_showing) return this.winnow_results(); else return this.results_show()
            };
            AbstractChosen.prototype.winnow_results = function () {
                var _i;
                var _len;
                this.no_results_clear();
                var results = 0;
                var searchText = this.get_search_text();
                var escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$\x26");
                var regexAnchor =
                    this.search_contains ? "" : "^";
                var regex = new RegExp(regexAnchor + escapedSearchText, "i");
                var zregex = new RegExp(escapedSearchText, "i");
                var _ref = this.results_data;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    var option = _ref[_i];
                    option.search_match = false;
                    var results_group = null;
                    if (this.include_option_in_results(option)) {
                        if (option.group) {
                            option.group_match = false;
                            option.active_options = 0
                        }
                        if (option.group_array_index != null && this.results_data[option.group_array_index]) {
                            results_group = this.results_data[option.group_array_index];
                            if (results_group.active_options === 0 && results_group.search_match) results += 1;
                            results_group.active_options += 1
                        }
                        if (!(option.group && !this.group_search)) {
                            option.search_text = option.group ? option.label : option.html;
                            option.search_match = this.search_string_match(option.search_text, regex);
                            if (option.search_match && !option.group) results += 1;
                            if (option.search_match) {
                                if (searchText.length) {
                                    var startpos = option.search_text.search(zregex);
                                    var text = option.search_text.substr(0, startpos + searchText.length) + "\x3c/em\x3e" + option.search_text.substr(startpos +
                                        searchText.length);
                                    option.search_text = text.substr(0, startpos) + "\x3cem\x3e" + text.substr(startpos)
                                }
                                if (results_group != null) results_group.group_match = true
                            } else if (option.group_array_index != null && this.results_data[option.group_array_index].search_match) option.search_match = true
                        }
                    }
                }
                this.result_clear_highlight();
                if (results < 1 && searchText.length) {
                    this.update_results_content("");
                    return this.no_results(searchText)
                } else {
                    this.update_results_content(this.results_option_build());
                    return this.winnow_results_set_highlight()
                }
            };
            AbstractChosen.prototype.search_string_match = function (search_string, regex) {
                var _i;
                var _len;
                if (regex.test(search_string)) return true; else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
                    var parts = search_string.replace(/\[|\]/g, "").split(" ");
                    if (parts.length) for (_i = 0, _len = parts.length; _i < _len; _i++) {
                        var part = parts[_i];
                        if (regex.test(part)) return true
                    }
                }
            };
            AbstractChosen.prototype.choices_count = function () {
                var _i;
                var _len;
                if (this.selected_option_count != null) return this.selected_option_count;
                this.selected_option_count = 0;
                var _ref = this.form_field.options;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    var option = _ref[_i];
                    if (option.selected) this.selected_option_count += 1
                }
                return this.selected_option_count
            };
            AbstractChosen.prototype.choices_click = function (evt) {
                evt.preventDefault();
                if (!(this.results_showing || this.is_disabled)) return this.results_show()
            };
            AbstractChosen.prototype.keyup_checker = function (evt) {
                var _ref;
                var stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
                this.search_field_scale();
                switch (stroke) {
                    case 8:
                        if (this.is_multiple &&
                            this.backstroke_length < 1 && this.choices_count() > 0) return this.keydown_backstroke(); else if (!this.pending_backstroke) {
                            this.result_clear_highlight();
                            return this.results_search()
                        }
                        break;
                    case 13:
                        evt.preventDefault();
                        if (this.results_showing) return this.result_select(evt);
                        break;
                    case 27:
                        if (this.results_showing) this.results_hide();
                        return true;
                    case 9:
                    case 38:
                    case 40:
                    case 16:
                    case 91:
                    case 17:
                        break;
                    default:
                        return this.results_search()
                }
            };
            AbstractChosen.prototype.clipboard_event_checker = function (evt) {
                var _this = this;
                return setTimeout(function () {
                    return _this.results_search()
                }, 50)
            };
            AbstractChosen.prototype.container_width = function () {
                if (this.options.width != null) return this.options.width; else return "" + this.form_field.offsetWidth + "px"
            };
            AbstractChosen.prototype.include_option_in_results = function (option) {
                if (this.is_multiple && (!this.display_selected_options && option.selected)) return false;
                if (!this.display_disabled_options && option.disabled) return false;
                if (option.empty) return false;
                return true
            };
            AbstractChosen.prototype.search_results_touchstart =
                function (evt) {
                    this.touch_started = true;
                    return this.search_results_mouseover(evt)
                };
            AbstractChosen.prototype.search_results_touchmove = function (evt) {
                this.touch_started = false;
                return this.search_results_mouseout(evt)
            };
            AbstractChosen.prototype.search_results_touchend = function (evt) {
                if (this.touch_started) return this.search_results_mouseup(evt)
            };
            AbstractChosen.prototype.outerHTML = function (element) {
                if (element.outerHTML) return element.outerHTML;
                var tmp = document.createElement("div");
                tmp.appendChild(element);
                return tmp.innerHTML
            };
            AbstractChosen.browser_is_supported = function () {
                if (window.navigator.appName === "Microsoft Internet Explorer") return document.documentMode >= 8;
                if (/iP(od|hone)/i.test(window.navigator.userAgent)) return false;
                if (/Android/i.test(window.navigator.userAgent)) if (/Mobile/i.test(window.navigator.userAgent)) return false;
                return true
            };
            AbstractChosen.default_multiple_text = "Select Some Options";
            AbstractChosen.default_single_text = "Select an Option";
            AbstractChosen.default_no_result_text = "No results match";
            return AbstractChosen
        }();
        var $ = jQuery;
        $.fn.extend({
            chosen: function (options) {
                if (!AbstractChosen.browser_is_supported()) return this;
                return this.each(function (input_field) {
                    var $this = $(this);
                    var chosen = $this.data("chosen");
                    if (options === "destroy" && chosen) chosen.destroy(); else if (!chosen) $this.data("chosen", new Chosen(this, options))
                })
            }
        });
        var Chosen = function (_super) {
            function Chosen() {
                _ref = Chosen.__super__.constructor.apply(this, arguments);
                return _ref
            }

            __extends(Chosen, _super);
            Chosen.prototype.setup = function () {
                this.form_field_jq =
                    $(this.form_field);
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl")
            };
            Chosen.prototype.set_up_html = function () {
                var container_classes = ["chosen-container"];
                container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
                if (this.inherit_select_classes && this.form_field.className) container_classes.push(this.form_field.className);
                if (this.is_rtl) container_classes.push("chosen-rtl");
                var container_props = {
                    "class": container_classes.join(" "),
                    "style": "width: " + this.container_width() + ";", "title": this.form_field.title
                };
                if (this.form_field.id.length) container_props.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen";
                this.container = $("\x3cdiv /\x3e", container_props);
                if (this.is_multiple) this.container.html('\x3cul class\x3d"chosen-choices"\x3e\x3cli class\x3d"search-field"\x3e\x3cinput type\x3d"text" value\x3d"' + this.default_text + '" class\x3d"default" autocomplete\x3d"off" style\x3d"width:25px;" /\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e');
                else this.container.html('\x3ca class\x3d"chosen-single chosen-default" tabindex\x3d"-1"\x3e\x3cspan\x3e' + this.default_text + '\x3c/span\x3e\x3cdiv\x3e\x3cb\x3e\x3c/b\x3e\x3c/div\x3e\x3c/a\x3e\x3cdiv class\x3d"chosen-drop"\x3e\x3cdiv class\x3d"chosen-search"\x3e\x3cinput type\x3d"text" autocomplete\x3d"off" /\x3e\x3c/div\x3e\x3cul class\x3d"chosen-results"\x3e\x3c/ul\x3e\x3c/div\x3e');
                this.form_field_jq.hide().after(this.container);
                this.dropdown = this.container.find("div.chosen-drop").first();
                this.search_field =
                    this.container.find("input").first();
                this.search_results = this.container.find("ul.chosen-results").first();
                this.search_field_scale();
                this.search_no_results = this.container.find("li.no-results").first();
                if (this.is_multiple) {
                    this.search_choices = this.container.find("ul.chosen-choices").first();
                    this.search_container = this.container.find("li.search-field").first()
                } else {
                    this.search_container = this.container.find("div.chosen-search").first();
                    this.selected_item = this.container.find(".chosen-single").first()
                }
                this.results_build();
                this.set_tab_index();
                this.set_label_behavior();
                return this.form_field_jq.trigger("chosen:ready", {chosen: this})
            };
            Chosen.prototype.register_observers = function () {
                var _this = this;
                this.container.bind("mousedown.chosen", function (evt) {
                    _this.container_mousedown(evt)
                });
                this.container.bind("mouseup.chosen", function (evt) {
                    _this.container_mouseup(evt)
                });
                this.container.bind("mouseenter.chosen", function (evt) {
                    _this.mouse_enter(evt)
                });
                this.container.bind("mouseleave.chosen", function (evt) {
                    _this.mouse_leave(evt)
                });
                this.search_results.bind("mouseup.chosen",
                    function (evt) {
                        _this.search_results_mouseup(evt)
                    });
                this.search_results.bind("mouseover.chosen", function (evt) {
                    _this.search_results_mouseover(evt)
                });
                this.search_results.bind("mouseout.chosen", function (evt) {
                    _this.search_results_mouseout(evt)
                });
                this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen", function (evt) {
                    _this.search_results_mousewheel(evt)
                });
                this.search_results.bind("touchstart.chosen", function (evt) {
                    _this.search_results_touchstart(evt)
                });
                this.search_results.bind("touchmove.chosen",
                    function (evt) {
                        _this.search_results_touchmove(evt)
                    });
                this.search_results.bind("touchend.chosen", function (evt) {
                    _this.search_results_touchend(evt)
                });
                this.form_field_jq.bind("chosen:updated.chosen", function (evt) {
                    _this.results_update_field(evt)
                });
                this.form_field_jq.bind("chosen:activate.chosen", function (evt) {
                    _this.activate_field(evt)
                });
                this.form_field_jq.bind("chosen:open.chosen", function (evt) {
                    _this.container_mousedown(evt)
                });
                this.form_field_jq.bind("chosen:close.chosen", function (evt) {
                    _this.input_blur(evt)
                });
                this.search_field.bind("blur.chosen", function (evt) {
                    _this.input_blur(evt)
                });
                this.search_field.bind("keyup.chosen", function (evt) {
                    _this.keyup_checker(evt)
                });
                this.search_field.bind("keydown.chosen", function (evt) {
                    _this.keydown_checker(evt)
                });
                this.search_field.bind("focus.chosen", function (evt) {
                    _this.input_focus(evt)
                });
                this.search_field.bind("cut.chosen", function (evt) {
                    _this.clipboard_event_checker(evt)
                });
                this.search_field.bind("paste.chosen", function (evt) {
                    _this.clipboard_event_checker(evt)
                });
                if (this.is_multiple) return this.search_choices.bind("click.chosen",
                    function (evt) {
                        _this.choices_click(evt)
                    }); else return this.container.bind("click.chosen", function (evt) {
                    evt.preventDefault()
                })
            };
            Chosen.prototype.destroy = function () {
                $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
                if (this.search_field[0].tabIndex) this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
                this.container.remove();
                this.form_field_jq.removeData("chosen");
                return this.form_field_jq.show()
            };
            Chosen.prototype.search_field_disabled = function () {
                this.is_disabled =
                    this.form_field_jq[0].disabled;
                if (this.is_disabled) {
                    this.container.addClass("chosen-disabled");
                    this.search_field[0].disabled = true;
                    if (!this.is_multiple) this.selected_item.unbind("focus.chosen", this.activate_action);
                    return this.close_field()
                } else {
                    this.container.removeClass("chosen-disabled");
                    this.search_field[0].disabled = false;
                    if (!this.is_multiple) return this.selected_item.bind("focus.chosen", this.activate_action)
                }
            };
            Chosen.prototype.container_mousedown = function (evt) {
                if (!this.is_disabled) {
                    if (evt && evt.type ===
                        "mousedown" && !this.results_showing) evt.preventDefault();
                    if (!(evt != null && $(evt.target).hasClass("search-choice-close"))) {
                        if (!this.active_field) {
                            if (this.is_multiple) this.search_field.val("");
                            $(this.container[0].ownerDocument).bind("click.chosen", this.click_test_action);
                            this.results_show()
                        } else if (!this.is_multiple && evt && ($(evt.target)[0] === this.selected_item[0] || $(evt.target).parents("a.chosen-single").length)) {
                            evt.preventDefault();
                            this.results_toggle()
                        }
                        return this.activate_field()
                    }
                }
            };
            Chosen.prototype.container_mouseup =
                function (evt) {
                    if (evt.target.nodeName === "ABBR" && !this.is_disabled) return this.results_reset(evt)
                };
            Chosen.prototype.search_results_mousewheel = function (evt) {
                if (evt.originalEvent) var delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
                if (delta != null) {
                    evt.preventDefault();
                    if (evt.type === "DOMMouseScroll") delta *= 40;
                    return this.search_results.scrollTop(delta + this.search_results.scrollTop())
                }
            };
            Chosen.prototype.blur_test = function (evt) {
                if (!this.active_field && this.container.hasClass("chosen-container-active")) return this.close_field()
            };
            Chosen.prototype.close_field = function () {
                $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
                this.active_field = false;
                this.results_hide();
                this.container.removeClass("chosen-container-active");
                this.clear_backstroke();
                this.show_search_field_default();
                return this.search_field_scale()
            };
            Chosen.prototype.activate_field = function () {
                this.container.addClass("chosen-container-active");
                this.active_field = true;
                this.search_field.val(this.search_field.val());
                return this.search_field.focus()
            };
            Chosen.prototype.test_active_click = function (evt) {
                var active_container = $(evt.target).closest(".chosen-container");
                if (active_container.length && this.container[0] === active_container[0]) return this.active_field = true; else return this.close_field()
            };
            Chosen.prototype.results_build = function () {
                this.parsing = true;
                this.selected_option_count = null;
                this.results_data = SelectParser.select_to_array(this.form_field);
                if (this.is_multiple) this.search_choices.find("li.search-choice").remove(); else if (!this.is_multiple) {
                    this.single_set_selected_text();
                    if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                        this.search_field[0].readOnly = true;
                        this.container.addClass("chosen-container-single-nosearch")
                    } else {
                        this.search_field[0].readOnly = false;
                        this.container.removeClass("chosen-container-single-nosearch")
                    }
                }
                this.update_results_content(this.results_option_build({first: true}));
                this.search_field_disabled();
                this.show_search_field_default();
                this.search_field_scale();
                return this.parsing = false
            };
            Chosen.prototype.result_do_highlight =
                function (el) {
                    if (el.length) {
                        this.result_clear_highlight();
                        this.result_highlight = el;
                        this.result_highlight.addClass("highlighted");
                        var maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                        var visible_top = this.search_results.scrollTop();
                        var visible_bottom = maxHeight + visible_top;
                        var high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                        var high_bottom = high_top + this.result_highlight.outerHeight();
                        if (high_bottom >= visible_bottom) return this.search_results.scrollTop(high_bottom -
                        maxHeight > 0 ? high_bottom - maxHeight : 0); else if (high_top < visible_top) return this.search_results.scrollTop(high_top)
                    }
                };
            Chosen.prototype.result_clear_highlight = function () {
                if (this.result_highlight) this.result_highlight.removeClass("highlighted");
                return this.result_highlight = null
            };
            Chosen.prototype.results_show = function () {
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                    this.form_field_jq.trigger("chosen:maxselected", {chosen: this});
                    return false
                }
                this.container.addClass("chosen-with-drop");
                this.results_showing = true;
                this.search_field.focus();
                this.search_field.val(this.search_field.val());
                this.winnow_results();
                return this.form_field_jq.trigger("chosen:showing_dropdown", {chosen: this})
            };
            Chosen.prototype.update_results_content = function (content) {
                return this.search_results.html(content)
            };
            Chosen.prototype.results_hide = function () {
                if (this.results_showing) {
                    this.result_clear_highlight();
                    this.container.removeClass("chosen-with-drop");
                    this.form_field_jq.trigger("chosen:hiding_dropdown", {chosen: this})
                }
                return this.results_showing =
                    false
            };
            Chosen.prototype.set_tab_index = function (el) {
                if (this.form_field.tabIndex) {
                    var ti = this.form_field.tabIndex;
                    this.form_field.tabIndex = -1;
                    return this.search_field[0].tabIndex = ti
                }
            };
            Chosen.prototype.set_label_behavior = function () {
                var _this = this;
                this.form_field_label = this.form_field_jq.parents("label");
                if (!this.form_field_label.length && this.form_field.id.length) this.form_field_label = $("label[for\x3d'" + this.form_field.id + "']");
                if (this.form_field_label.length > 0) return this.form_field_label.bind("click.chosen",
                    function (evt) {
                        if (_this.is_multiple) return _this.container_mousedown(evt); else return _this.activate_field()
                    })
            };
            Chosen.prototype.show_search_field_default = function () {
                if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
                    this.search_field.val(this.default_text);
                    return this.search_field.addClass("default")
                } else {
                    this.search_field.val("");
                    return this.search_field.removeClass("default")
                }
            };
            Chosen.prototype.search_results_mouseup = function (evt) {
                var target = $(evt.target).hasClass("active-result") ?
                    $(evt.target) : $(evt.target).parents(".active-result").first();
                if (target.length) {
                    this.result_highlight = target;
                    this.result_select(evt);
                    return this.search_field.focus()
                }
            };
            Chosen.prototype.search_results_mouseover = function (evt) {
                var target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
                if (target) return this.result_do_highlight(target)
            };
            Chosen.prototype.search_results_mouseout = function (evt) {
                if ($(evt.target).hasClass("active-result" || $(evt.target).parents(".active-result").first())) return this.result_clear_highlight()
            };
            Chosen.prototype.choice_build = function (item) {
                var _this = this;
                var choice = $("\x3cli /\x3e", {"class": "search-choice"}).html("\x3cspan\x3e" + item.html + "\x3c/span\x3e");
                if (item.disabled) choice.addClass("search-choice-disabled"); else {
                    var close_link = $("\x3ca /\x3e", {
                        "class": "search-choice-close",
                        "data-option-array-index": item.array_index
                    });
                    close_link.bind("click.chosen", function (evt) {
                        return _this.choice_destroy_link_click(evt)
                    });
                    choice.append(close_link)
                }
                return this.search_container.before(choice)
            };
            Chosen.prototype.choice_destroy_link_click =
                function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (!this.is_disabled) return this.choice_destroy($(evt.target))
                };
            Chosen.prototype.choice_destroy = function (link) {
                if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
                    this.show_search_field_default();
                    if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) this.results_hide();
                    link.parents("li").first().remove();
                    return this.search_field_scale()
                }
            };
            Chosen.prototype.results_reset = function () {
                this.reset_single_select_options();
                this.form_field.options[0].selected = true;
                this.single_set_selected_text();
                this.show_search_field_default();
                this.results_reset_cleanup();
                this.form_field_jq.trigger("change");
                if (this.active_field) return this.results_hide()
            };
            Chosen.prototype.results_reset_cleanup = function () {
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.selected_item.find("abbr").remove()
            };
            Chosen.prototype.result_select = function (evt) {
                if (this.result_highlight) {
                    var high = this.result_highlight;
                    this.result_clear_highlight();
                    if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                        this.form_field_jq.trigger("chosen:maxselected", {chosen: this});
                        return false
                    }
                    if (this.is_multiple) high.removeClass("active-result"); else this.reset_single_select_options();
                    var item = this.results_data[high[0].getAttribute("data-option-array-index")];
                    item.selected = true;
                    this.form_field.options[item.options_index].selected = true;
                    this.selected_option_count = null;
                    if (this.is_multiple) this.choice_build(item); else this.single_set_selected_text(item.text);
                    if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) this.results_hide();
                    this.search_field.val("");
                    if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) this.form_field_jq.trigger("change", {"selected": this.form_field.options[item.options_index].value});
                    this.current_selectedIndex = this.form_field.selectedIndex;
                    return this.search_field_scale()
                }
            };
            Chosen.prototype.single_set_selected_text = function (text) {
                if (text == null) text = this.default_text;
                if (text === this.default_text) this.selected_item.addClass("chosen-default");
                else {
                    this.single_deselect_control_build();
                    this.selected_item.removeClass("chosen-default")
                }
                return this.selected_item.find("span").text(text)
            };
            Chosen.prototype.result_deselect = function (pos) {
                var result_data = this.results_data[pos];
                if (!this.form_field.options[result_data.options_index].disabled) {
                    result_data.selected = false;
                    this.form_field.options[result_data.options_index].selected = false;
                    this.selected_option_count = null;
                    this.result_clear_highlight();
                    if (this.results_showing) this.winnow_results();
                    this.form_field_jq.trigger("change",
                        {deselected: this.form_field.options[result_data.options_index].value});
                    this.search_field_scale();
                    return true
                } else return false
            };
            Chosen.prototype.single_deselect_control_build = function () {
                if (!this.allow_single_deselect) return;
                if (!this.selected_item.find("abbr").length) this.selected_item.find("span").first().after('\x3cabbr class\x3d"search-choice-close"\x3e\x3c/abbr\x3e');
                return this.selected_item.addClass("chosen-single-with-deselect")
            };
            Chosen.prototype.get_search_text = function () {
                if (this.search_field.val() ===
                    this.default_text) return ""; else return $("\x3cdiv/\x3e").text($.trim(this.search_field.val())).html()
            };
            Chosen.prototype.winnow_results_set_highlight = function () {
                var selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
                var do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
                if (do_high != null) return this.result_do_highlight(do_high)
            };
            Chosen.prototype.no_results = function (terms) {
                var no_results_html = $('\x3cli class\x3d"no-results"\x3e' +
                    this.results_none_found + ' "\x3cspan\x3e\x3c/span\x3e"\x3c/li\x3e');
                no_results_html.find("span").first().html(terms);
                this.search_results.append(no_results_html);
                return this.form_field_jq.trigger("chosen:no_results", {chosen: this})
            };
            Chosen.prototype.no_results_clear = function () {
                return this.search_results.find(".no-results").remove()
            };
            Chosen.prototype.keydown_arrow = function () {
                if (this.results_showing && this.result_highlight) {
                    var next_sib = this.result_highlight.nextAll("li.active-result").first();
                    if (next_sib) return this.result_do_highlight(next_sib)
                } else return this.results_show()
            };
            Chosen.prototype.keyup_arrow = function () {
                if (!this.results_showing && !this.is_multiple) return this.results_show(); else if (this.result_highlight) {
                    var prev_sibs = this.result_highlight.prevAll("li.active-result");
                    if (prev_sibs.length) return this.result_do_highlight(prev_sibs.first()); else {
                        if (this.choices_count() > 0) this.results_hide();
                        return this.result_clear_highlight()
                    }
                }
            };
            Chosen.prototype.keydown_backstroke = function () {
                if (this.pending_backstroke) {
                    this.choice_destroy(this.pending_backstroke.find("a").first());
                    return this.clear_backstroke()
                } else {
                    var next_available_destroy = this.search_container.siblings("li.search-choice").last();
                    if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                        this.pending_backstroke = next_available_destroy;
                        if (this.single_backstroke_delete) return this.keydown_backstroke(); else return this.pending_backstroke.addClass("search-choice-focus")
                    }
                }
            };
            Chosen.prototype.clear_backstroke = function () {
                if (this.pending_backstroke) this.pending_backstroke.removeClass("search-choice-focus");
                return this.pending_backstroke = null
            };
            Chosen.prototype.keydown_checker = function (evt) {
                var _ref1;
                var stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
                this.search_field_scale();
                if (stroke !== 8 && this.pending_backstroke) this.clear_backstroke();
                switch (stroke) {
                    case 8:
                        this.backstroke_length = this.search_field.val().length;
                        break;
                    case 9:
                        if (this.results_showing && !this.is_multiple) this.result_select(evt);
                        this.mouse_on_container = false;
                        break;
                    case 13:
                        break;
                    case 38:
                        evt.preventDefault();
                        this.keyup_arrow();
                        break;
                    case 40:
                        evt.preventDefault();
                        this.keydown_arrow();
                        break
                }
            };
            Chosen.prototype.search_field_scale = function () {
                var _i;
                var _len;
                if (this.is_multiple) {
                    var h = 0;
                    var w = 0;
                    var style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                    var styles = ["font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"];
                    for (_i = 0, _len = styles.length; _i < _len; _i++) {
                        var style = styles[_i];
                        style_block += style + ":" + this.search_field.css(style) + ";"
                    }
                    var div = $("\x3cdiv /\x3e", {"style": style_block});
                    div.text(this.search_field.val());
                    $("body").append(div);
                    w = div.width() + 25;
                    div.remove();
                    var f_width = this.container.outerWidth();
                    if (w > f_width - 10) w = f_width - 10;
                    return this.search_field.css({"width": w + "px"})
                }
            };
            return Chosen
        }(AbstractChosen)
    }).call(this);
});
$(document).ready(function () {
    function ajax_cart_prototype(properties, flavor) {
        return function (formId) {
            if (typeof formId != "string") formId = false;
            if (typeof flavor == "string" && flavor in $.request_flavors && "properties" in $.request_flavors[flavor]) properties = $.request_flavors[flavor].properties;
            return create_ajax_cart_prototype(properties, flavor, formId)
        }
    }

    function create_ajax_cart_prototype(properties, flavor, formId) {
        var expansion = {};
        var parameters = {};
        if (flavor in $.request_flavors) {
            if (typeof flavor == "string" &&
                "expansion" in $.request_flavors[flavor]) expansion = $.request_flavors[flavor].expansion;
            if (typeof flavor == "string" && "parameters" in $.request_flavors[flavor]) parameters = $.request_flavors[flavor].parameters
        }
        properties = $.extend(properties, expansion);
        var $prototype = new $.ajax_prototype(properties, formId, parameters);
        return $prototype
    }

    Date.prototype.stdTimezoneOffset = function () {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    };
    Date.prototype.isDstObserved = function () {
        return this.getTimezoneOffset() < this.stdTimezoneOffset()
    };
    Date.prototype.setTimezone = function (timezoneOffset) {
        var localTime = this.getTime();
        var localOffset = this.getTimezoneOffset() * 6E4;
        var utc = localTime + localOffset;
        var offset = utc + 36E5 * timezoneOffset;
        return this.setTime(offset)
    };
    Date.prototype.checkOfset = function (offset) {
        return this.isDstObserved() ? offset + 1 : offset
    };
    Array.prototype.removeIndex = function (index) {
        try {
            return this.filter(function (v, i) {
                return i != index
            })
        } catch (e) {
        }
    };
    if (typeof Object.prototype.array_except == "undefined") Object.defineProperty(Object.prototype, "array_except", {
        value: function (key) {
            var keyType = typeof key;
            if (keyType == "string" || keyType == "number") try {
                delete this[key]
            } catch (e) {
            } else if (keyType == "object") if (key.constructor == Array) for (var i in key) if (key.hasOwnProperty(i)) try {
                delete this[key[i]]
            } catch (e$0) {
            }
            return this
        }, enumerable: false
    });
    var observers = {};
    var isIdle = false;
    var $modal_opening = false;
    var $modal_opened = false;
    $(".closeMessage").on("click", function (e) {
        e.preventDefault();
        clearTimeout(timeOut);
        $("#alertContainer").slideUp(400)
    });
    $(".modal_cancel").on("click", function (e) {
        e.preventDefault();
        var obj = $(this);
        if (obj.hasClass("disabled")) return;
        obj.closest(".reveal-modal").modal_close()
    });
    $(".close-reveal-mymodal").on("click", function (e) {
        e.preventDefault();
        $(this).closest(".reveal-modal").modal_close()
    });
    $("#CartOrder .modal_cancel").on("click", function (e) {
        e.preventDefault();
        clearInterval(checkoutTimer)
    });
    alert = {
        formid: null, mssg: null, alert: null, data: null, element: null, outerShutter: null,
        control: true
    };
    $(window).bind("beforeunload", function () {
        alert["control"] = false
    });
    $.fn.extend({
        renameAttr: function (name, newName, removeData) {
            var val;
            return this.each(function () {
                val = jQuery.attr(this, name);
                jQuery.attr(this, newName, val);
                jQuery.removeAttr(this, name);
                if (removeData !== false) jQuery.removeData(this, name.replace("data-", ""))
            })
        }, modal_open: function (callback) {
            var obj = $(this);
            var visible_modals = $(".reveal-modal:visible:not(.my_modals)");
            if (obj.length < 1) {
                if (visible_modals.length) visible_modals.modal_close();
                return
            }
            obj.trigger("modal:opening");
            $modal_opening = true;
            $modal_opened = true;
            if (visible_modals.length) visible_modals.modal_close();
            obj.foundation("reveal", "open");
            if (typeof callback == "function") callback(obj);
            setTimeout(function () {
                $(".reveal-modal-bg").show()
            }, 250);
            if ($.getSizeClassification("medium_up") && (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null)) disableBodyScroll();
            if ($.getSizeClassification("medium_up") && (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() ==
                null)) {
                setTimeout(function () {
                    $("body").css({"overflow-y": "hidden", "position": "fixed"})
                }, 200);
                $("body").css({"overflow-y": "hidden", "position": "fixed"})
            }
            if ($.getSizeClassification("medium_down")) {
                if (obj.offset().top + obj.height() >= $(window).height()) {
                    obj.css({"height": "100%", "overflow-y": "scroll", "position": "fixed"});
                    setTimeout(function () {
                        obj.css("top", "0px")
                    }, 400)
                }
            } else if (obj.offset().top + obj.height() >= $(window).height()) {
                obj.addClass("modal-with-scroll");
                if (navigator.userAgent.toLowerCase().indexOf("firefox") >
                    -1) setTimeout(function () {
                    obj.css({"position": "fixed", "top": ""})
                }, 400)
            }
            $modal_opening = false;
            obj.my_modal("whiten");
            obj.trigger("modal:opened");
            return obj
        }, modal_close: function (callback) {
            var obj = $(this);
            obj.trigger("modal:closing");
            obj.find(".reveal-password:has(.icon-eye)").click();
            obj.each(function () {
                $(this).foundation("reveal", "close")
            });
            if ($.getSizeClassification("medium_up")) enableBodyScroll();
            $("body").css({"overflow-y": "", "position": "initial"});
            obj.css({"position": "", "top": "", "height": "", "overflow": ""}).removeClass("modal-with-scroll");
            $modal_opened = false;
            if (typeof callback == "function") callback();
            obj.trigger("modal:closed");
            return obj
        }, assign_secondary_phone: function (targets) {
            $(this).on("change", function () {
                var controller = $(this);
                var id = "";
                var input = null;
                $.each(targets, function () {
                    input = $("#" + $(this).attr("id").replace("_country", ""));
                    if (!input.val()) $(this).chosen_update(controller.val())
                })
            })
        }, disabled: function (enable) {
            if (typeof enable == "boolean") if (enable) $(this).attr("disabled", true); else $(this).removeAttr("disabled"); else return $(this).prop("disabled");
            return $(this)
        }, checked: function (enable) {
            if (typeof enable == "boolean") $(this).prop("checked", enable); else return $(this).prop("checked");
            return $(this)
        }, apply_chosen: function (properties) {
            if (typeof properties != "undfined" && properties == null) properties = "";
            if (!$.isTouch()) $(this).each(function () {
                var value = null;
                if (!$(this).is("select")) return;
                if (properties.constructor == Object) if ("value" in properties) {
                    value = properties["value"] ? properties["value"] : "";
                    if (!("disable_search" in properties["par"] && "disable_search_threshold" in
                        properties["par"])) properties.par["disable_search_threshold"] = 10;
                    if ($(this).find("option").length < 9) properties["par"]["disable_search"] = true;
                    if ("events" in properties["par"]) {
                        var obj = $(this);
                        $.each(properties["par"].events, function ($key, $event) {
                            obj.on($event.name, function () {
                                $event.event()
                            })
                        });
                        delete properties["par"].events
                    }
                    $(this).chosen(properties["par"])
                } else {
                    if (!"disable_search" in properties && !"disable_search_threshold" in properties) properties["disable_search_threshold"] = 10;
                    if ($(this).find("option").length <
                        9) properties["disable_search"] = true;
                    if ("events" in properties) {
                        obj = $(this);
                        $.each(properties.events, function ($key, $event) {
                            obj.on($event.name, function () {
                                $event.event()
                            })
                        });
                        delete properties.events
                    }
                    $(this).chosen(properties)
                } else if (typeof properties == "string" || typeof properties == "number") {
                    value = properties ? properties : "";
                    if ($(this).find("option").length < 9) $(this).chosen({"disable_search": true}); else $(this).chosen()
                } else if ($(this).find("option").length < 9) $(this).chosen({"disable_search": true}); else $(this).chosen();
                if (value == null) {
                    value = $(this).attr("value");
                    if (!value) value = $(this).find("option:selected").length ? $(this).val() : ""
                }
                $(this).find(".placeholder").remove();
                $(this).chosen_update(value)
            });
            return this
        }, chosen_update: function (value) {
            var obj = $(this);
            if ($.isArray(value)) {
                obj.find("option").removeAttr("selected").prop("selected", false);
                $.each(value, function (key, val) {
                    obj.find('option[value\x3d"' + val + '"]').prop("selected", true)
                });
                obj.trigger("chosen:updated")
            } else if (value) {
                obj.find("option").removeAttr("selected").prop("selected",
                    false);
                obj.find('option[value\x3d"' + value + '"]').prop("selected", true).trigger("chosen:updated")
            } else obj.val("").trigger("chosen:updated");
            return this
        }, chosen_disable: function (properties) {
            if (typeof properties == "undefined") properties = {value: ""};
            if (!properties.hasOwnProperty("value")) properties.value = "";
            $(this).each(function () {
                $(this).attr({"disabled": true}).val(properties.value).trigger("chosen:updated")
            })
        }, chosen_enable: function (properties) {
            var obj = $(this);
            if (typeof properties == "undefined") properties =
                {value: ""};
            if (!properties.hasOwnProperty("value")) properties.value = "";
            obj.each(function () {
                $(this).attr({"disabled": false}).val(properties.value).trigger("chosen:updated")
            });
            return obj
        }, chosen_option: function (properties) {
            if (typeof properties != "object") throw new Error("Properties is not defined");
            if (typeof properties.action == "undefined") throw new Error("No action selected");
            if (typeof properties.selector_string == "undefined" && typeof properties.option_obj == "undefined") throw new Error("Option is not defined");
            var obj = $(this);
            var option = null;
            if (typeof properties.selector_string != "undefined") option = obj.find(properties.selector_string); else option = properties.option_obj;
            switch (properties.action) {
                case "disable": {
                    option.attr({"disabled": !option.prop("disabled")});
                    obj.chosen_update()
                }
            }
            return obj
        }, chosen_append: function (text, value, properties) {
            $(this).each(function () {
                var obj = $(this);
                var current_val = obj.val() ? obj.val() : "";
                if (properties.where) obj.find(properties.where).append('\x3coption value\x3d"' + value + '"\x3e' +
                    text + "\x3c/option\x3e"); else obj.append('\x3coption value\x3d"' + value + '"\x3e' + text + "\x3c/option\x3e");
                if (properties["own-value"]) obj.chosen_update(current_val); else obj.trigger("chosen:updated")
            })
        }, getOuterHTML: function () {
            return $(this)[0].outerHTML
        }, translate: function (path, population, replace) {
            var obj = $(this);
            var $text = trans(path, population);
            if (typeof replace == "object") $.each(replace, function ($target, $value) {
                $regex = new RegExp("##" + $target + "##", "g");
                $text = $text.replace($regex, $value)
            });
            if ($.htmlLookUp($text)) obj.html($text);
            else obj.text($text);
            return obj
        }, statuses_update: function ($class, $text, $origin) {
            if (typeof $origin == "undefined") $origin = "label";
            $class = $origin + " " + $class;
            $(this).attr("class", $class).text($text);
            return this
        }, activation: function (status, callback) {
            if (typeof status == "string") {
                if (status == "toggle") $(this).toogleClass("active")
            } else if (typeof status == "boolean") if (status) $(this).addClass("active"); else $(this).removeClass("active");
            if (typeof callback == "function") callback(this)
        }, attr_app: function (attr, val) {
            var obj =
                $(this);
            if (typeof attr == "string") {
                if (val) {
                    var attr_used = obj.attr(attr);
                    if (!attr_used) attr_used = "";
                    obj.attr(attr, attr_used + val)
                }
            } else if (typeof attr == "object") $.each(attr, function (name, value) {
                obj.attr_app(name, value)
            });
            return obj
        }, attr_pre: function (attr, val) {
            var obj = $(this);
            if (obj.length > 1) obj.each(function () {
                $(this).attr_pre(attr, val)
            }); else if (typeof attr == "string") {
                if (val) if (obj.length > 1) obj.each(function () {
                    var item = $(this);
                    var attr_used = item.attr(attr);
                    if (!attr_used) attr_used = "";
                    item.attr(attr,
                        val + attr_used)
                }); else {
                    var attr_used$jscomp$0 = obj.attr(attr);
                    if (!attr_used$jscomp$0) attr_used$jscomp$0 = "";
                    obj.attr(attr, val + attr_used$jscomp$0)
                }
            } else if (typeof attr == "object") $.each(attr, function (name, value) {
                obj.attr_pre(name, value)
            });
            return obj
        }, setUpAllViewsTabHandler: function () {
            var tabsContainer = $(this);
            $(document).on("click", "#" + tabsContainer.attr("id") + " .tab-title:not(.active) a", function (e) {
                e.preventDefault();
                tabsContainer.find(".accordion [aria-expanded].active").removeClass("active");
                tabsContainer.find('.accordion [href\x3d"' +
                    $(this).attr("href") + '"]').addClass("active")
            }).on("click", "#" + tabsContainer.attr("id") + " .accordion [aria-expanded]", function (e) {
                e.preventDefault();
                var obj = $(this);
                if (!obj.hasClass("active")) {
                    tabsContainer.find(".accordion [aria-expanded].active").removeClass("active");
                    obj.addClass("active");
                    tabsContainer.find(".tab-title").removeClass("active").find('[href\x3d"' + obj.attr("href") + '"]').closest(".tab-title").addClass("active")
                } else {
                    obj.removeClass("active");
                    tabsContainer.find(".tab-title").removeClass("active");
                    tabsContainer.find(".tab-title:first").addClass("active")
                }
            });
            var timmerName = tabsContainer.attr("id") + "_timer";
            window[timmerName] = null;
            $(window).on("resize", function () {
                if (window[timmerName] != null) clearTimeout(window[timmerName]);
                window[timmerName] = setTimeout(function () {
                    if ($.getSizeClassification("large_up")) if (tabsContainer.find(".content.active").length < 1) {
                        tabsContainer.find(".content:first").addClass("active").show();
                        tabsContainer.find(".accordion [aria-expanded]:first").addClass("active")
                    }
                }, 10)
            })
        },
        noUiSlider: function () {
            try {
                return this[0].noUiSlider
            } catch (e) {
                return this
            }
        }
    });
    $.extend({
        set_cookie: function (name, value, url, redirect) {
            Cookies.set(name, value, {path: url});
            if (typeof redirect != "undefined") location.href = redirect; else setTimeout(function () {
                location.reload()
            }, 100)
        }, cookieHandler: function (name, callback) {
            if (typeof name != "string") return;
            if (typeof callback != "function") return;
            if (Cookies.get(name)) {
                try {
                    callback(Cookies.get(name))
                } catch (err) {
                }
                Cookies.remove(name)
            }
        }, windowSize: function () {
            $("body").append('\x3cdiv id\x3d"scrollContainer"\x3e\x3cp id\x3d"scrollObject"\x3e\x3c/p\x3e\x3c/div\x3e');
            $("#scrollContainer").css({
                "position": "absolute",
                "top": "0px",
                "left": "0px",
                "visibility": "hidden",
                "width": "200px",
                "height": "150px",
                "overflow": "hidden"
            });
            $("#scrollObject").css({"width": "100%", "height": "200px"});
            var w1 = $("#scrollObject").outerWidth();
            $("#scrollContainer").css({"overflow": "scroll"});
            var w2 = $("#scrollObject").outerWidth();
            if (w1 == w2) w2 = $("#scrollContainer").outerWidth();
            $("#scrollContainer").remove();
            return $(window).width() + (w1 - w2)
        }, getSizeClassification: function (look_up) {
            if (typeof look_up !=
                "undefined") if (typeof look_up == "string") switch (look_up) {
                case "small":
                    return $.windowSize() <= width_threshold.small.upper;
                case "medium":
                    return $.windowSize() > width_threshold.medium.lower - 1 && $.windowSize() < width_threshold.medium.upper + 1;
                case "large":
                    return $.windowSize() > width_threshold.large.lower - 1 && $.windowSize() < width_threshold.large.upper + 1;
                case "xlarge":
                    return $.windowSize() >= width_threshold.x_large.lower;
                case "medium_down":
                    return $.windowSize() <= width_threshold.medium.upper;
                case "medium_up":
                    return $.windowSize() >=
                        width_threshold.medium.lower;
                case "large_down":
                    return $.windowSize() < width_threshold.large.upper;
                case "large_up":
                    return $.windowSize() > width_threshold.large.lower;
                default:
                    throw new Error("The given classification does not match our list.");
            } else if (typeof look_up == "number") if (look_up <= width_threshold.small.upper) return "small"; else if (look_up > width_threshold.medium.lower - 1 && look_up < width_threshold.medium.upper + 1) return "medium"; else if (look_up > width_threshold.large.lower - 1 && look_up < width_threshold.large.upper +
                1) return "large"; else {
                if (look_up >= width_threshold.x_large.lower) return "xlarge"
            } else throw new Error("Invalid lookup type."); else throw new Error("Classification must be a valid string.");
        }, isTouch: function () {
            return !!("ontouchstart" in window)
        }, cookie_api: function (name, val, action, token) {
            $.ajax({
                url: baseUrl + "/api/user/set-cookie",
                method: "POST",
                data: {_token: token, cName: name, cValue: val, cAction: action},
                error: function (e) {
                    globalErrorsHandler(e)
                }
            })
        }, ajax_prototype: function (parameters, formId, expansion_properties) {
            if (typeof formId !=
                "undefined" && formId !== false && formId != null) formId = formId.replace(/^#/, "");
            var instance = this;
            var exception = ["success", "presuccesscallback", "postsuccesscallback", "error", "preerrorcallback", "posterrorcallback"];
            instance.cache = true;
            instance.ifModified = false;
            instance.processData = true;
            instance.async = true;
            instance.crossDomain = false;
            instance.dataType = "json";
            instance.timeout = 3E4;
            instance.beforeSend = function () {
                defaultBeforeSendAjaxAction(formId)
            };
            instance.error = function (e) {
                globalErrorsHandler(e)
            };
            instance.complete =
                function () {
                    $.enable_form_controls(formId);
                    $(".submitText").show();
                    $(".loading:not(.always_visible)").hide()
                };
            if (typeof parameters == "object") $.each($.array.except.key(parameters, exception), function (key, value) {
                if (key == "complete") $.enable_form_controls(formId);
                if (key.indexOf("callback") > -1) {
                    var callbackName = key;
                    key = key.replace("pre", "").replace("post", "").replace("callback", "");
                    var main = instance[key];
                    if (callbackName.indexOf("pre") > -1) instance[key] = function () {
                        value(instance);
                        main()
                    };
                    if (callbackName.indexOf("post") >
                        -1) instance[key] = function () {
                        main();
                        value(instance)
                    }
                } else if (key != "success") instance[key] = value
            });
            if (typeof expansion_properties == "object") $.each(expansion_properties, function (key, value) {
                if (key == "complete") $.enable_form_controls(formId);
                var $temp = instance[key];
                instance[key] = function () {
                    try {
                        $temp();
                        value(instance)
                    } catch (err) {
                    }
                }
            });
            instance.success = function (data) {
                try {
                    if ("presuccesscallback" in parameters) parameters["presuccesscallback"](instance, data);
                    parameters["success"](data, instance);
                    if ("postsuccesscallback" in
                        parameters) parameters["postsuccesscallback"](instance, data)
                } catch (err) {
                }
            };
            if ("error" in parameters || "preerrorcallback" in parameters || "posterrorcallback" in parameters) instance.error = function (e) {
                if ("preerrorcallback" in parameters) parameters["preerrorcallback"](instance);
                if ("error" in parameters) parameters["error"](e); else globalErrorsHandler(e);
                if ("posterrorcallback" in parameters) parameters["posterrorcallback"](instance)
            };
            var tmp = instance.beforeSend;
            instance.beforeSend = function (instance) {
                if (typeof tmp ==
                    "function") tmp(instance);
                $("input").blur()
            }
        }, ajax_variable_prototype: function (properties, flavor) {
            return ajax_cart_prototype(properties, flavor)
        }, ajax_get_flavor: function (properties, flavor) {
            var tmp = ajax_cart_prototype(properties, flavor);
            return tmp()
        }, compare_two_strings: function (stringA, stringB, strict) {
            if (!stringA || !stringB) return false;
            if (!strict) {
                stringA = stringA.toLowerCase();
                stringB = stringB.toLowerCase()
            }
            return stringA == stringB
        }, translate: function (path, population, replace) {
            var $text = trans(path, population);
            if (typeof replace == "object") $.each(replace, function ($target, $value) {
                $regex = new RegExp("##" + $target + "##", "g");
                $text = $text.replace($regex, $value)
            });
            return $text
        }, idle: function (callback, time) {
            if (typeof time == "string") if (time in $idle_times) time = $idle_times[time]; else time = $idle_times.common; else if (typeof time == "number") time = parseInt(time); else return;
            if (typeof callback != "function") return;
            inactivityTime(callback, time)
        }, isIdle: function (state) {
            if (typeof state == "boolean") isIdle = state;
            return isIdle
        }, htmlLookUp: function (text) {
            return /<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/.test(text)
        },
        keys: function (obj) {
            return Object.keys(obj)
        }, observers: {
            register: function (name, callback) {
                try {
                    observers[name] = new MutationObserver(callback)
                } catch (er) {
                }
            }, observe: function (name, node, config) {
                try {
                    if (!(node instanceof HTMLElement)) node = node[0];
                    observers[name].observe(node, config)
                } catch (er) {
                }
            }
        }, array: {
            except: {
                key: function (data, except) {
                    temp = {};
                    $.each(data, function (key, keyValue) {
                        if ($.inArray(key, except) == -1) temp[key] = keyValue
                    });
                    return temp
                }
            }
        }, isMobile: function () {
            try {
                var md = $.md.mobile() != null && ($.md.phone() !=
                    null || $.md.tablet() != null)
            } catch (er) {
                md = false
            }
            return $.isTouch() || md
        }, isReleaseDate: function (year, month, day, hour, minute, second, strict) {
            var now = new Date;
            var release = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
            if (typeof strict != "undefined" && strict === true) return now == release; else return now >= release
        }, is_guest: function () {
            return $userGroup == "guest"
        }, is_user: function () {
            return $userGroup == "user"
        }, is_admin: function () {
            return $userGroup == "admin"
        }, disable_gdpr_mopdal: function (data) {
            var modal = $("#gdpr_approval_modal");
            if (modal.length) {
                $("#gdpr_approval_modal .disabled").removeClass("disabled");
                var modal_bg = $(".reveal-modal-bg");
                modal_bg.css("z-index", modal_bg.attr("data-init-index"));
                if (data.code != error_codes.password_mismatch && data.code != error_codes.general_gdpr_approval_is_missing) modal.modal_close()
            }
        }, activateOverlayLoader: activateOverlayLoader, deactivateOverlayLoader: deactivateOverlayLoader
    });
    $referenceLinks = $(".reference_link");
    if ($referenceLinks.length) $referenceLinks.on("click", function (e) {
        e.preventDefault();
        $(this).closest("form").submit()
    });
    $(document).on("click", "#reloadbtn", function (e) {
        e.preventDefault();
        location.reload()
    }).on("click", ".reveal-modal-bg", function (e) {
        var modal = $(".reveal-modal.open");
        modal.find(".reveal-password:has(.icon-eye)").click();
        options = modal.attr("data-options");
        if (modal.length && (typeof options == "undefined" || options.indexOf("close_on_background_click:false") < 0)) enableBodyScroll()
    }).on("click", "#nav-icons .tabTrigger", function (e) {
        e.preventDefault();
        var $target = $(this).attr("href");
        $('[href\x3d"' + $target + '"]:not(.tabTrigger):first').click();
        window.location.hash = $target
    }).on("click", ".with-inner-list.with-click .head", function (e) {
        var obj = $(this).closest(".with-click");
        var ul = obj.find("ul");
        var initial = ul.css("max-height");
        $(obj.parents()[0]).find(".with-inner-list.with-click ul").css("max-height", "0");
        if (initial == null || parseInt(initial) == 0) obj.find("ul").css("max-height", "15rem"); else obj.find("ul").css("max-height", "0")
    }).on("click", function (e) {
        var target = $(e.target);
        if (target.is(".with-inner-list.with-click") ||
            $(".with-inner-list.with-click").has(e.target).length > 0) {
            var clickSource = $(target.closest(".with-click").parents()[0]);
            $(":has(\x3e .with-inner-list.with-click)").filter(function (i, a) {
                return !$(a).is(clickSource)
            }).find("ul").css("max-height", "0")
        } else $(".with-inner-list.with-click ul").css("max-height", "0")
    }).keyup(function (e) {
        if (e.keyCode == 27 && $modal_opened) {
            $("body").css({"overflow-y": "", "position": "initial"});
            $(".reveal-modal.modal-with-scroll").css({
                "position": "",
                "top": "",
                "height": "",
                "overflow": ""
            }).removeClass("modal-with-scroll");
            $modal_opened = false
        }
    });
    $(window).on("resize", function () {
        if (typeof modalRebuildTimer != "undefined" && modalRebuildTimer != null) clearTimeout(modalRebuildTimer);
        if (!$modal_opening) modalRebuildTimer = setTimeout(function () {
            var modal = $(".reveal-modal.open");
            if (modal.length) {
                var currentWidthClass = $.getSizeClassification($.windowSize());
                if (currentWidthClass != widthClass) {
                    widthClass = currentWidthClass;
                    if ($.getSizeClassification("medium_down")) {
                        if (modal.offset().top + modal.height() >= $(window).height()) {
                            modal.css({
                                "height": "100%",
                                "overflow-y": "scroll", "position": "fixed", "top": "0px"
                            });
                            modal.removeClass("modal-with-scroll")
                        }
                    } else if (modal.offset().top + modal.height() >= $(window).height()) modal.css({
                        "postion": "fixed",
                        "top": "",
                        "height": "",
                        "overflow": ""
                    }).addClass("modal-with-scroll")
                }
            }
            modalRebuildTimer = null
        }, 250)
    });
    var widthClass = $.getSizeClassification($.windowSize());
    $(".close-reveal-modal.modal-cancel").on("click", function () {
        $("body").css({"overflow-y": "", "position": "initial"});
        var modal = $(this).closest(".reveal-modal");
        setTimeout(function () {
            modal.css({
                "position": "",
                "top": "", "height": "", "overflow": ""
            })
        }, 300)
    });
    $.cookieHandler("errorCode", function (value) {
        var msg = value;
        setTimeout(function () {
            if (msg.match(/false/) != null) $.alertHandler("", msg.replace(/,false/, ""), alert_box_failure); else if (msg.match(/true/) == null) $.alertHandler("", msg, alert_box_warning);
            $
        }, 100)
    });
    $.cookieHandler("openPref", function (value) {
        setTimeout(function () {
            $('[href\x3d"#preferencesContent"]:first').click()
        }, 100)
    });
    (function (factory) {
        factory($)
    })(function ($) {
        $.fn.addBack = $.fn.addBack || $.fn.andSelf;
        $.fn.extend({
            actual: function (method, options) {
                var $target = this.eq(0);
                var tmp = [];
                var style = "";
                var $hidden;
                var fix = function () {
                    $hidden = $target.parents().addBack().filter(":hidden");
                    style += "visibility: hidden !important; display: block !important; ";
                    $hidden.each(function () {
                        var $this = $(this);
                        var thisStyle = $this.attr("style");
                        tmp.push(thisStyle);
                        $this.attr("style", thisStyle ? thisStyle + ";" + style : style)
                    })
                };
                var restore = function () {
                    $hidden.each(function (i) {
                        var $this = $(this);
                        var _tmp = tmp[i];
                        if (_tmp === undefined) $this.removeAttr("style");
                        else $this.attr("style", _tmp)
                    })
                };
                fix();
                var actual = $target[method]();
                restore();
                return actual
            }
        })
    });
    var inactivityTime = function (callback, time) {
        function execute() {
            callback()
        }

        function resetTimer() {
            clearTimeout(t);
            if ($.isIdle()) return;
            t = setTimeout(execute, time)
        }

        var t;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        resetTimer()
    }
});

function default_error_function() {
    $.alertHandler("", APP_LANG.MESSAGES.ERROR, alert_box_warning)
}

function defaultBeforeSendAjaxAction(formid, disableLoader) {
    if ($("#alertContainer").is(":visible")) killDisplays(true);
    if (typeof disableLoader == "undefined" || disableLoader === false) show_clicked_btns_loader();
    if (typeof formid != "undefined" && formid !== false && $(".reveal-modal-bg").length < 1 && formid != null) activateFormDim()
}

function activateFormDim() {
    $("body").append('\x3cdiv id\x3d"formDim" style\x3d"position:absolute; top:0; background-color: rgba(28, 29, 30, 0.7); z-index: 999999; display:block;"\x3e\x3c/div\x3e');
    $("#formDim").css({"width": $(document).outerWidth(), "height": $(document).outerHeight()})
}

function deactivateFormDim() {
    $("#formDim").remove()
}

function activateOverlayLoader() {
    var active = $("form \x3e :not(:disabled)");
    active.addClass("loaderDisabled").disabled(true);
    var globalOverlayLoader = $(".global-overlay-loader");
    if (globalOverlayLoader.length < 1) {
        $("body").append('\x3cdiv class\x3d"global-overlay-loader"\x3e\x3cdiv class\x3d"loading"\x3e\x3cspan class\x3d"spinner"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e');
        globalOverlayLoader = $(".global-overlay-loader")
    }
    globalOverlayLoader.show().find(".loading").show()
}

function deactivateOverlayLoader() {
    $(".global-overlay-loader").hide();
    $(".loaderDisabled").disabled(false).removeClass("loaderDisabled")
}

function show_clicked_btns_loader() {
    var loader = $(".loader_cont");
    var active_element = $(document.activeElement);
    if ($.isTouch()) if (active_element.is("body")) active_element = $(".requestTrigger:first");
    $(".requestTrigger").removeClass("requestTrigger");
    active_element.blur();
    if (loader.length && !active_element.is("body")) {
        if (active_element.is(".loader_cont")) loader = active_element; else if (active_element.closest("form").length) loader = active_element.closest("form").find(".loader_cont"); else loader = active_element.find("form").find(".loader_cont");
        loader = loader.filter(":visible");
        loader.find(".submitText").hide();
        loader.find(".loading").show()
    }
}

function disableBodyScroll() {
    $("body").on("touchmove", function (e) {
        e.preventDefault()
    });
    if (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null) {
        current_top = $(window).scrollTop();
        $("body").css({"position": "fixed", "overflow-y": "scroll", "width": "100%", "top": -current_top})
    }
}

function disableBodyScrollModalScroll(modal) {
    if (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null) {
        current_top = $(window).scrollTop();
        $("body").css({"position": "fixed", "overflow-y": "hidden", "width": "100%", "top": -current_top});
        modal.css({"overflow-y": "auto"})
    }
}

function enableBodyScroll() {
    $("body").off("touchmove");
    if ($("body").css("position") == "fixed") {
        $("body").css({"position": "static", "overflow-y": "auto", "width": "100%"});
        if (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null) window.scrollTo(0, current_top)
    }
}

function checkIfLocationIsBackend(location) {
    return /http[s]?:[/]{2}(my|admin)/.test(location)
}

function trans(string, population) {
    string = string.toUpperCase();
    var translation = window["TRANS"];
    var strings = string.replace(/^TRANS\./, "").split(".");
    var key_not_found = false;
    $.each(strings, function (key, value) {
        if (value in translation) translation = translation[value]; else {
            key_not_found = true;
            return false
        }
    });
    if (key_not_found) return "";
    if (population) if (population == 1) return translation[1]; else return translation[2]; else {
        if (translation.constructor == Object && population === 0 && 2 in translation) return translation[2];
        return translation
    }
}

function appendPageCoverLoader(cover_modals) {
    if ($("#pageLoader").length < 1) $("body").append('\x3cdiv id\x3d"pageLoader" style\x3d"width:100%; height:100%; background-color:rgba(28, 29, 30, 0.7); position:fixed; top:0"\x3e\x3cdiv style\x3d"position: relative; margin-left: 50%; margin-right: 50%; height: 100%; top: 50%;"\x3e\x3cdiv class\x3d"loading"\x3e\x3cspan class\x3d"spinner bigger"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e');
    if (typeof cover_modals != "undefined" && cover_modals === true) $("#pageLoader").css("z-index",
        100)
}

function create_length_string(key) {
    return key < 12 ? key + " " + trans("length.month", key) : key / 12 + " " + trans("length.year", key / 12)
};
$(document).ready(function () {
    function sideNavVatTriggerHandler() {
        var container = $("#countriesContainer");
        if ($('[name\x3d"sid-Vat"]:checked').val() == "sid-no-Vat") {
            $("#toolbox-vat #no_Vat").prop({"checked": true});
            $(".billing-profile-vat").slideUp();
            $(".select-vat").hide();
            container.slideUp()
        } else {
            $("#toolbox-vat #with_Vat").prop({"checked": true});
            $(".billing-profile-vat").slideDown();
            $(".select-vat").show();
            $("#countriesContainer .countries-wrapper").show();
            container.slideDown()
        }
        $("#submitVatSidr").show()
    }

    function enable_vat() {
        $("#no_Vat").prop({"checked": "false"});
        $("#with_Vat").prop({"checked": "true"});
        $("#sid-with-Vat").prop({"checked": "true"});
        $(".vatControl.add").addClass("active");
        $(".select-vat, .billing-profile-vat").removeClass("hide");
        $(".shared-hosting-plans .vatControlsTrigger").text(COMMON_LANG.VAT.DISCLAIMER.VAT_ON_2)
    }

    function disable_vat() {
        $("#with_Vat").prop({"checked": "false"});
        $("#no_Vat").prop({"checked": "true"});
        $("#sid-no-Vat").prop({"checked": "true"});
        $(".vatControl.remove").addClass("active");
        $(".select-vat, .billing-profile-vat").addClass("hide");
        $("#countriesContainer").css({"display": "none"});
        $(".shared-hosting-plans .vatControlsTrigger").text(COMMON_LANG.VAT.DISCLAIMER.VAT_OFF_2)
    }

    function vatApplier(setCookie, callback) {
        if (vat["show"]) vat_quote = vat["quote"]; else vat_quote = 1;
        vat_on_span();
        vat_on_paragraphs();
        vat_on_domains_pricelist();
        $(document).trigger("vat:changed");
        if (typeof setCookie == "undefined" || setCookie === true) $.cookie_api("showVat", vat["show"] ? "yes" : "no", "", $('#VatForm [name\x3d"_token"]').val());
        if (vat.show) text = COMMON_LANG.VAT.DISCLAIMER.VAT_ON.replace("##VAT##", vat["quote"].toFixed(2).toString().split(".")[1]); else text = COMMON_LANG.VAT.DISCLAIMER.VAT_OFF;
        $(".vat-disclaimer").text(text);
        if (typeof callback == "function") callback()
    }

    function vat_on_span() {
        $("span.vat:not(.related):not(.relative)").each(function () {
            var obj = $(this);
            if (obj.hasClass("on-length")) if (obj.closest(".length, .configurator, .summary").length) var price = obj.get_price("data-price-length-unit"); else price = obj.get_price(); else price =
                obj.get_price();
            if (price == 0) return;
            $(this).html(create_vatted_price(price, check_prices_follow_ups(obj), obj.hasClass("noDec")))
        });
        $("span.vat.related").each(function () {
            var obj = $(this);
            var percent = $('.vat_percent[data-relation\x3d"' + obj.attr("data-relation") + '"]');
            var relative_from = $('[data-relation\x3d"' + obj.attr("data-relation") + '"][data-role\x3d"from"]');
            var relative_to = $('[data-relation\x3d"' + obj.attr("data-relation") + '"][data-role\x3d"to"]');
            var priceFrom = relative_from.get_price("data-target");
            var priceTo = (priceFrom * vat_quote).toFixed(2);
            obj.text($.imperial_to_metric((priceFrom * parseFloat(vat_quote - 1)).toFixed(2)));
            relative_to.text($.imperial_to_metric(priceTo));
            if (percent.length) {
                var vat_percent = vat_quote * 100 - 100;
                percent.text(vat_percent)
            }
        })
    }

    function vat_on_paragraphs() {
        $("p.vat:not(:has(.vat-disclaimer))").each(function () {
            startingPrice = parseFloat($(this).attr("data-price"));
            if (!isNaN(startingPrice)) {
                text = $(this).text();
                match = text.match(/([0-9]{1,3}[,.])+[0-9]+/g);
                text = text.split(match[0]);
                if (!vat["show"]) startingPrice *= vat["quote"];
                price = startingPrice.toFixed(2).split(".");
                price[0] = digitNumberFormat(price[0]);
                dec = "," + price[1];
                if ($(this).hasClass("noDec") && price[1] < 1) dec = "";
                price = price[0] + dec;
                $(this).text(text[0] + price + text[1])
            }
        })
    }

    function vat_on_domains_pricelist() {
        if ($("table.domains").length > 0) $(".products").each(function () {
            if (vat["show"]) finalPrice = $(this).find(".vat:last").attr("data-price") * vat["quote"]; else finalPrice = $(this).find(".vat:last").attr("data-price");
            $(this).attr({"data-price-final": finalPrice})
        })
    }

    function sortVatCountries(option, container, others, separator) {
        options = $("." + option);
        options.sort(function (a, b) {
            var A = $(a).data("name");
            var B = $(b).data("name");
            A = A.toUpperCase();
            B = B.toUpperCase();
            if (A < B) return -1;
            if (A > B) return 1;
            return 0
        });
        countrieSelect = $("#" + container);
        options.each(function () {
            countrieSelect.append($(this))
        });
        $("." + option + ":last").after($("." + others));
        $("." + option + ":last").after($("." + separator))
    }

    function change_vat_country(obj, callback) {
        country = obj.find("option:selected");
        img = $(".flag:not(.ButtonFilters)");
        span = $("#countrySelected .sid-country, .country:not(.ButtonFilters)");
        percentage = $("#countrySelected .sid-percentage, .percentage");
        if (country.val() != "OTHER") {
            src = imgsrc + "/flags/" + country.val().toLowerCase() + ".png";
            img.attr({"class": "flag " + country.val().toLowerCase()});
            vat["show"] = true;
            vat["quote"] = parseFloat(country.attr("data-vat"));
            quote = vat["quote"].toString().split(".");
            quote = parseInt(quote[1]);
            if (quote < 10) quote *= 10;
            percentage.html("\x26lpar; " + quote + "\x26percnt; \x26rpar;")
        } else {
            src = imgsrc +
                "/flags/allothers.png";
            img.attr({"class": "flag allothers"});
            vat["show"] = false;
            percentage.text("")
        }
        vat["country"] = country.val();
        vatApplier();
        span.text(country.attr("data-name"));
        img.attr({"alt": country.attr("data-name"), "title": country.attr("data-name")});
        $.cookie_api("countryVat", country.val(), "", token);
        $("#countrySelector, #countrySelectorSid").val("");
        if (typeof callback == "function") callback()
    }

    function create_vatted_price(price, follow_up, no_dec, get_number) {
        if (typeof price == "string") price = reconstruct_string_price(price);
        price = (price * vat_quote).toFixed(2);
        if (get_number) return price;
        if (follow_up) {
            var temp = imperial_to_metric(price, true);
            if (follow_up === "small-decimals") price = temp[0] + small_decimals.replace("##dec##", temp[1]); else if (follow_up === "small-follow-ups") price = temp[0] + small_follow_up.replace("##dec##", temp[1]); else if (follow_up === "sup") price = temp[0] + "\x3csup\x3e," + temp[1] + "\x3c/sup\x3e"
        } else price = imperial_to_metric(price);
        return price
    }

    function imperial_to_metric(price, array, no_dec) {
        price = parseFloat(price).toFixed(2).toString().split(".");
        if (no_dec) price[1] = ""; else if (typeof price[1] == "undefined") price[1] = "00"; else if (price[1].length == 1) price[1] = price[1] + "0";
        price[0] = separate_by_3(price[0]);
        if (array) return price;
        price = price[0] + "," + price[1];
        return price
    }

    function metric_to_imperial(value) {
        return parseFloat(value.replace(".", "").replace(",", "."))
    }

    function separate_by_3(number, delimiter) {
        var temp = number.toString().split("").reverse().join("").match(/\d{1,3}/g);
        if (typeof delimiter == "undefined") delimiter = ".";
        for (var i = temp.length - 1; i >= 0; i--) temp[i] =
            temp[i].split("").reverse().join("");
        return temp.reverse().join(delimiter)
    }

    function check_prices_follow_ups(obj) {
        if (!(obj instanceof $)) return false;
        if (obj.hasClass("small-decimals") || typeof obj == "string" && obj.indexOf("small-decimals") > -1) return "small-decimals"; else if (obj.hasClass("small-follow-ups") || typeof obj == "string" && obj.indexOf("small-follow-ups") > -1) return "small-follow-ups"; else if (obj.hasClass("sup") || typeof obj == "string" && obj.indexOf("sup") > -1) return "sup";
        return false
    }

    function reconstruct_string_price(price) {
        if (typeof price ==
            "string") {
            var dots = price.match(/[.]/g);
            var commas = price.match(/[,]/g);
            if (dots != null && (commas != null || dots.length > 1)) return parseFloat(price.replace(/[.]/g, "").replace(",", ".")); else if (commas == null && (dots == null || dots.length <= 1)) return parseFloat(price)
        }
        return price
    }

    function detect_classes(classA, classB) {
        var match_classes = false;
        $.each(classB.split(" "), function (key, value) {
            if (classA.indexOf(value) > -1) match_classes = true; else {
                match_classes = false;
                return false
            }
        });
        return match_classes
    }

    function implementPriceTemplate(template,
                                    prices, interval) {
        if (typeof template != "string" || !(template in vat_templates)) throw"Invalid template";
        if (prices.constructor != Object || Object.keys(prices).length < 1) throw"Invalid prices";
        if (!("computation" in vat_templates[template])) throw"Computation is missing";
        if (vat_templates[template].constructor != Object) throw"Invalid computation property";
        var errorFound = null;
        var temp = vat_templates[template].template;
        for (i in prices) if (prices.hasOwnProperty(i)) {
            if (typeof prices[i] != "string" && typeof prices[i] != "number" ||
                typeof prices[i] == "string" && isNaN(parseFloat(prices[i]))) {
                errorFound = i + " is invalid, price got " + prices[i];
                break
            }
            temp = temp.replace(new RegExp("##" + i + "##", "g"), prices[i])
        }
        if (errorFound != null) throw errorFound;
        var computation = vat_templates[template].computation;
        for (i in computation) if (computation.hasOwnProperty(i)) {
            if (typeof computation[i] != "string") {
                errorFound = computation[i] + " not applicable";
                break
            }
            if (!(computation[i] in prices)) {
                errorFound = computation[i] + " missing from prices";
                break
            }
            temp = temp.replace(new RegExp("##" +
                i + "##", "g"), create_vatted_price(parseFloat(prices[computation[i]])))
        }
        if (errorFound != null) throw errorFound;
        if (typeof interval == "string") interval = parseInt(interval);
        if (typeof interval != "undefined" && typeof interval != "number") throw"Invalid interval";
        if (typeof interval == "number") temp += "/" + $.translate("length." + (interval < 12 ? "month" : "year"), 1);
        return temp
    }

    function convertDifToPercentage(prices, toNumber) {
        var dif = null;
        $.each(prices, function (index, value) {
            if (dif == null) dif = value; else dif -= value
        });
        var percentage =
            dif / Math.max.apply(null, prices);
        if (typeof toNumber != "undefined" && toNumber === true) return (percentage * 100).toFixed(2);
        return percentage.toFixed(2)
    }

    function fixModalVatView() {
        $('[name\x3d"Vat"]').prop("checked", false);
        if (vat.show) {
            $("#with_Vat").prop("checked", true).trigger("change");
            $("#countrySelector:visible, #countrySelectorSid:visible").val("")
        } else $("#no_Vat").prop("checked", true).trigger("change");
        var submitVat = $("#submitVat").hide();
        submitVat.find(".submitText").show();
        submitVat.find(".loading").hide()
    }

    function fixSidrVatView() {
        $('[name\x3d"sid-with-Vat"]').prop("checked", false);
        $("#countrySelector:visible, #countrySelectorSid:visible").val("");
        if (vat.show) {
            $("#sid-with-Vat").prop("checked", true);
            $("#sidVatContainer #countriesContainer").show().find(".countries-wrapper").show()
        } else {
            $("#sid-no-Vat").prop("checked", true);
            $("#sidVatContainer #countriesContainer").hide().find(".countries-wrapper").hide()
        }
        var submitVatSidr = $("#submitVatSidr").hide();
        submitVatSidr.find(".submitText").show();
        submitVatSidr.find(".loading").hide()
    }

    var vatControlsModal = $("#vatControlsModal");
    var modalObserverTimer;
    var sidrObserverTimer;
    $.observers.register("vatControlsModal", function (mutations) {
        try {
            clearTimeout(modalObserverTimer)
        } catch (e) {
        }
        modalObserverTimer = setTimeout(function () {
            if (!vatControlsModal.hasClass("open")) fixModalVatView()
        }, 250)
    });
    $.observers.register("sidVatContainer", function (mutations) {
        try {
            clearTimeout(sidrObserverTimer)
        } catch (e) {
        }
        sidrObserverTimer = setTimeout(function () {
                if (!$("#sidVatContainer .sidClose").hasClass("active")) fixSidrVatView()
            },
            250)
    });
    $.observers.observe("vatControlsModal", vatControlsModal, {attributes: true});
    var vat_templates = {
        "price": {
            "template": '\x3cspan class\x3d"vat" data-price\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price"],
            "class": "vat",
            "alt_class": ["vat setup-fee"],
            "computation": {"total": "init"}
        },
        "price-small-decimals": {
            "template": '\x3cspan class\x3d"vat small-decimals" data-price\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price"],
            "class": "vat small-decimals"
        },
        "price-small-follow-up": {
            "template": '\x3cspan class\x3d"vat small-follow-up" data-price\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price"],
            "class": "vat small-follow-up"
        },
        "price-total-sup": {
            "template": '\x3cspan class\x3d"vat sup" data-price\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price"],
            "class": "vat sup",
            "alt_class": ["vat sup price"]
        },
        "price-total": {
            "template": '\x3cspan class\x3d"vat price-total" data-price-total\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false, "update": ["data-price-total"], "class": "vat price-total"
        },
        "price-total-small-decimals": {
            "template": '\x3cspan class\x3d"vat price-total small-decimals" data-price-total\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price-total"],
            "class": "vat price-total small-decimals"
        },
        "price-total-small-follow-up": {
            "template": '\x3cspan class\x3d"vat price-total small-follow-up" data-price-total\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price-total"],
            "class": "vat price-total small-follow-up"
        },
        "on-length": {
            "template": '\x3cspan class\x3d"vat on-length" data-price-length-total\x3d"##total##" data-price-length-unit\x3d"##length##"\x3e##final##\x3c/span\x3e\x26euro;',
            "multi_pricing": true,
            "update": ["data-price-length-total", "data-price-length-unit"],
            "class": "vat on-length",
            "computation": {"final": "length"}
        },
        "on-length-with-setup-fees": {
            "template": '\x3cspan class\x3d"vat on-length-with-setup-fees" data-price-setup-fees\x3d"##setup_fee##" data-price-length-total\x3d"##total##" data-price-length-unit\x3d"##length##"\x3e##final##\x3c/span\x3e\x26euro;',
            "multi_pricing": true,
            "update": ["data-price-length-total", "data-price-length-unit"],
            "class": "vat on-length"
        },
        "regular-price": {
            "template": '\x3cspan class\x3d"vat regular-price" data-price\x3d"##init##"\x3e##total##\x3c/span\x3e\x26euro;',
            "multi_pricing": false,
            "update": ["data-price"],
            "class": "vat regular-price"
        },
        "tier": {"template": "", "multi_pricing": false, "update": ["data-price"], "class": "vat tier"},
        "relative": {
            "template": "",
            "multi_pricing": false,
            "update": ["data-target"],
            "class": "vat relative",
            "alt_class": ["vat relative checkout_order_total"]
        },
        "calculation-component": {
            "template": "",
            "multi_pricing": false,
            "update": ["data-component-price"],
            "class": "vat calculation-component",
            "no-display": true
        },
        "calculation-component-with-length": {
            "template": "",
            "multi_pricing": true,
            "update": ["data-component-price", "data-component-price-unit"],
            "class": "vat calculation-component-with-length",
            "no-display": true
        }
    };
    var small_decimals = "\x3csmall\x3e,##dec##\x3c/small\x3e";
    var small_follow_up = "\x3csmall\x3e##dec## \x26euro; / " + COMMON_LANG.LENGTH.YEAR + "\x3c/small\x3e";
    try {
        if (vat["show"]) var vat_quote = vat["quote"]; else vat_quote = 1
    } catch (e) {
        vat_quote = 1
    }
    $.fn.extend({
        update_vat: function (template, src, text, attr, price_src) {
            var obj = $(this).hasClass("vat") ? $(this) : $(this).find(".vat");
            if (text != "like") {
                attr = undefined;
                price_src = undefined
            }
            if (!(template in vat_templates)) throw"Unknown template";
            if (src instanceof $) if (!vat_templates[template].multi_pricing) {
                if (text == "like") $.each(src[0].attributes, function (key, value) {
                    if (value.name.indexOf(attr) > -1) {
                        price = parseFloat(src.attr(value.name));
                        return false
                    }
                }); else if (src.attr("class") == vat_templates[template].class || "alt_class" in vat_templates[template] && $.inArray(src.attr("class"), vat_templates[template].alt_class)) var price = parseFloat(src.attr(vat_templates[template].update[0]));
                if (!("no-display" in vat_templates[template])) obj.attr(vat_templates[template].update[0], price).html(create_vatted_price(price, check_prices_follow_ups(obj), obj.hasClass("noDec"))); else obj.attr(vat_templates[template].update[0], price)
            } else if (text == "like") {
                if (typeof attr ==
                    "string") throw"Asset must be array not a string";
                $.each(vat_templates[template].update, function (key, value) {
                    obj.attr(value, src.attr(attr[key]))
                });
                if (!("no-display" in vat_templates[template])) obj.html(create_vatted_price(src.attr(price_src), check_prices_follow_ups(obj), obj.hasClass("noDec")))
            } else {
                $.each(vat_templates[template].update, function (key, value) {
                    obj.attr(value, src.attr(value))
                });
                if (!("no-display" in vat_templates[template])) obj.html(create_vatted_price(src.attr(text), check_prices_follow_ups(obj),
                    obj.hasClass("noDec")))
            } else if ($.isArray(src)) {
                if (vat_templates[template].update.length > src.length) throw"Input does not match needs.";
                $.each(vat_templates[template].update, function (key, value) {
                    obj.attr(value, src[key])
                });
                obj.html(create_vatted_price(src[text], check_prices_follow_ups(obj), obj.hasClass("noDec")))
            }
            return obj
        }, get_price: function (attr$jscomp$0) {
            var vat = $(this).hasClass("vat") ? $(this) : $(this).find(".vat");
            var vat_class = vat.attr("class");
            if (vat.length) {
                if (typeof attr$jscomp$0 == "undefined") {
                    var price =
                        0;
                    if (vat.attr("class") == "vat") price = vat.attr("data-price"); else {
                        vat_class = vat_class.trim().replace(/[ ]+/, " ");
                        $.each(vat_templates, function (key, value) {
                            if (vat_class == value.class || "alt_class" in value && value.alt_class.indexOf(vat_class) > -1) {
                                if (value.update.length == 1) price = vat.attr(value.update[0]); else $.each(value.update, function (index, attr) {
                                    if (attr.indexOf("total") > -1) {
                                        price = vat.attr(attr);
                                        return false
                                    }
                                });
                                return false
                            }
                        })
                    }
                } else if (typeof attr$jscomp$0 != "string") for (i = 0; i < attr$jscomp$0.length; i++) {
                    price =
                        vat.attr(attr$jscomp$0[i]);
                    if (typeof price != "undefined") break
                } else price = vat.attr(attr$jscomp$0);
                return $.isNumeric(price) ? parseFloat(price) : 0
            }
        }, get_vated_price: function (properties) {
            if (typeof properties == "boolean") return create_vatted_price($(this).get_price(), check_prices_follow_ups($(this)), $(this).hasClass("noDec"), properties); else if (typeof properties == "object") return create_vatted_price($(this).get_price(properties.attr), check_prices_follow_ups($(this)), $(this).hasClass("noDec"), properties.get_number);
            else return create_vatted_price($(this).get_price(properties), check_prices_follow_ups($(this)), $(this).hasClass("noDec"))
        }, get_length_duration: function (div_class) {
            var length = $(this).hasClass("length") ? $(this) : $(this).closest(".length");
            if (typeof div_class != "undefined") return length.find("a").html().replace(/\s{2,}/g, " ").replace(new RegExp("\x3cdiv.+" + div_class + "(.+|\n)+/div\x3e", "g"), "").trim(); else return length.find("a").html().replace(/\s{2,}/g, " ").replace(/<div.+price-per-length(.+|\n)+\/div>/g,
                "").trim()
        }, insert_vat: function (template, init_price, total_price, misc_prices, overwrite) {
            var obj = $(this);
            if (typeof overwrite != "undefined" && overwrite === true) obj.empty();
            var result = $.insert_vat(template, init_price, total_price, misc_prices);
            obj.append(result);
            return obj
        }, imperial_to_metric: function (price) {
            $(this).text(imperial_to_metric(price));
            return this
        }, implementPriceTemplate: function (template, prices, interval) {
            var obj = $(this);
            obj.append(implementPriceTemplate(template, prices, interval));
            return obj
        }
    });
    $.extend({
        get_vated_price: function (price) {
            return create_vatted_price(parseFloat(price))
        }, insert_vat: function (template, init_price, total_price, misc_prices, masks) {
            if (!(template in vat_templates)) throw"Unknown template";
            if (typeof init_price != "number") throw"Invalid or Undefined initial price";
            if (!vat_templates[template].multi_pricing) var new_template = vat_templates[template]["template"].replace("##init##", init_price).replace("##total##", create_vatted_price(parseFloat(init_price), check_prices_follow_ups(vat_templates[template]["template"]),
                vat_templates[template]["template"].indexOf("nodec") > -1)); else new_template = vat_templates[template]["template"].replace("##length##", init_price).replace("##total##", parseFloat(total_price)).replace("##final##", create_vatted_price(parseFloat(init_price), false, vat_templates[template]["template"].indexOf("nodec") > -1));
            if (typeof misc_prices != "undefined") $.each(misc_prices, function (key, value) {
                new_template = new_template.replace(new RegExp("##" + key + "##"), value)
            });
            if (typeof masks != "undefined") for (var i in masks) if (masks.hasOwnProperty(i)) new_template =
                new_template.replace(masks[i].mask, masks[i].replacement);
            return new_template
        }, imperial_to_metric: function (price) {
            return imperial_to_metric(price)
        }, metric_to_imperial: function (price) {
            return metric_to_imperial(price)
        }, get_price_vat: function (price) {
            return imperial_to_metric((price * (vat["quote"] - 1)).toFixed(2))
        }, create_vatted_price: function (price, follow_up, no_dec, get_number) {
            return create_vatted_price(price, follow_up, no_dec, get_number)
        }, implementPriceTemplate: function (template, prices, interval) {
            return implementPriceTemplate(template,
                prices, interval)
        }, convertDifToPercentage: function (prices, toNumber) {
            return convertDifToPercentage(prices, toNumber)
        }, vatApplier: vatApplier, fixModalVatView: fixModalVatView, fixSidrVatView: fixSidrVatView, vat: {
            initiate: function () {
                try {
                    if (!!vat) vat["show"] ? enable_vat() : disable_vat()
                } catch (e$0) {
                }
                $("#countrySelector, #countrySelectorSid").val("");
                sortVatCountries("optionCountries", "countrySelector", "optionOther", "optionSeparator")
            }, sort_vat_countries: function (option, container, others, separator) {
                sortVatCountries(option,
                    container, others, separator)
            }
        }
    });
    $('[name\x3d"Vat"]').on("change", function () {
        percentage = $("#countrySelected .sid-percentage, .percentage");
        if ($('[name\x3d"Vat"]:checked').val() == "no-Vat") {
            $("#sid-no-Vat").prop({"checked": "true"});
            $("#countriesContainer").slideUp();
            if (typeof $keepVatNoticesVisible === "undefined" || $keepVatNoticesVisible === false) $(".billing-profile-vat").slideUp(); else $keepVatNoticesVisible = false;
            $(".select-vat").hide();
            percentage.text("")
        } else {
            percentage.html("\x26lpar; " + vat["quote"].toFixed(2).replace("1.",
                "") + "\x26percnt; \x26rpar;");
            $("#sid-with-Vat").prop({"checked": "true"});
            $("#countriesContainer").slideDown();
            $(".billing-profile-vat").slideDown();
            $(".select-vat").show()
        }
        $("#submitVat").show()
    });
    $(document).on("vat:changed", function () {
        if (vat["show"]) vat_quote = vat["quote"]; else vat_quote = 1
    }).on("change", "#countrySelector, #countrySelectorSid", function () {
        var obj = $(this);
        if (obj.attr("id") == "countrySelector") $("#submitVat").show(); else $("#submitVatSidr").show()
    }).on("change", '[name\x3d"sid-Vat"]',
        function () {
            sideNavVatTriggerHandler()
        }).on("click", ".vatControlsTrigger, #footerVatControls", function (e) {
        e.preventDefault();
        if ($.getSizeClassification("large_up")) $("#vatControlsModal").modal_open(); else setTimeout(function () {
            $.sidr("open", "backend-side-nav");
            $("#sidVatTrigger").trigger("click");
            if (vat["show"]) $("#sidVatContainer #countriesContainer").show().find(".countries-wrapper").show()
        }, 100)
    }).on("click", "#submitVat, #submitVatSidr", function (e) {
        e.preventDefault();
        var obj = $(this);
        var checkedVat =
            $('[name\x3d"Vat"]:visible:checked, [name\x3d"sid-Vat"]:visible:checked');
        obj.find(".submitText").hide();
        obj.find(".loading").show(0);
        setTimeout(function () {
            if (checkedVat.val() == "with-vat" || checkedVat.val() == "sid-with-Vat") {
                vat["show"] = true;
                $(".shared-hosting-plans .vatControlsTrigger").text(COMMON_LANG.VAT.DISCLAIMER.VAT_ON_2);
                var countrySelector = $("#countrySelector:visible, #countrySelectorSid:visible");
                if (countrySelector.find("option:selected:not(:disabled)").length) change_vat_country(countrySelector,
                    function () {
                        if ($.getSizeClassification("large_up")) {
                            $("#vatControlsModal").modal_close();
                            $(window).trigger("resize").trigger("scroll")
                        } else {
                            $.sidr("close", "backend-side-nav");
                            $("#sidVatTrigger .sidClose").trigger("click")
                        }
                        fixModalVatView();
                        fixSidrVatView()
                    }); else vatApplier(true, function () {
                    if ($.getSizeClassification("large_up")) {
                        $("#vatControlsModal").modal_close();
                        $(window).trigger("resize").trigger("scroll")
                    } else {
                        $.sidr("close", "backend-side-nav");
                        $("#sidVatTrigger .sidClose").trigger("click")
                    }
                    fixModalVatView();
                    fixSidrVatView()
                })
            } else {
                vat["show"] = false;
                $(".shared-hosting-plans .vatControlsTrigger").text(COMMON_LANG.VAT.DISCLAIMER.VAT_OFF_2);
                vatApplier(true, function () {
                    if ($.getSizeClassification("large_up")) {
                        $("#vatControlsModal").modal_close();
                        $(window).trigger("resize").trigger("scroll")
                    } else {
                        $.sidr("close", "backend-side-nav");
                        $("#sidVatTrigger .sidClose").trigger("click")
                    }
                    fixModalVatView();
                    fixSidrVatView()
                })
            }
        }, 500);
        obj.blur()
    }).on("click", "#cancelVatChanges, #cancelVatChangesSidr", function (e) {
        e.preventDefault();
        if ($.getSizeClassification("large_up")) {
            $("#vatControlsModal").modal_close();
            $(window).trigger("resize").trigger("scroll")
        } else {
            $.sidr("close", "backend-side-nav");
            $("#sidVatTrigger .sidClose").trigger("click")
        }
        $(this).blur()
    });
    $("#vatControlsModal .close-reveal-mymodal").click(function () {
        $(window).trigger("resize").trigger("scroll")
    })
});
$(window).on("load", function () {
    if (vat.country != "OTHER") try {
        var testVat = $.grep(countries, function (a) {
            return a.iso_2 == vat.country
        });
        if (testVat.length < 1) {
            var grCountry = $.grep(countries, function (a) {
                return a.iso_2 == "GR"
            })[0];
            vat.show = false, vat.country = "GR";
            vat.quote = grCountry.vat_rate;
            var span = $("#countrySelected .sid-country, .country:not(.ButtonFilters)");
            var percentage = $("#countrySelected .sid-percentage, .percentage");
            var img = $(".flag:not(.ButtonFilters)");
            span.text(grCountry.name);
            img.attr({
                "alt": grCountry.name,
                "title": grCountry.name, "src": imgsrc + "/flags/gr.png", "class": "flag gr"
            });
            percentage.html("\x26lpar; " + vat.quote + "\x26percnt; \x26rpar;");
            $.vatApplier();
            $.fixModalVatView();
            $.fixSidrVatView();
            $.cookie_api("showVat", "no", "", $('[name\x3d"_token"]').val());
            $.cookie_api("countryVat", "GR", "", token)
        }
    } catch (e) {
    }
    var sidclose = $("#sidVatContainer .sidClose");
    if (sidclose.length) $.observers.observe("sidVatContainer", sidclose, {attributes: true}); else var sidcloseInterval = setInterval(function () {
        sidclose = $("#sidVatContainer .sidClose");
        if (sidclose.length) {
            $.observers.observe("sidVatContainer", sidclose, {attributes: true});
            clearInterval(sidcloseInterval)
        }
    }, 100)
});
jQuery(document).ready(function ($) {
    showTopScroll();
    token = $('input[name\x3d"_token"]').attr("value");
    pos = 0;
    $.vat.initiate();
    $(".slideTrigger").on("click", function (e) {
        e.preventDefault();
        $(".bgactive").removeClass("bgactive");
        father = $(this).closest("li").attr("class");
        if ($("#" + father).hasClass("activated")) {
            var slide = $("#" + father);
            var support = slide.find("#support_toolbox_cont");
            slide.toggleClass("activated");
            if (support.length) {
                support.show();
                slide.find("#support_toolbox_msg_cont").hide()
            }
        } else {
            $(this).closest("a").toggleClass("bgactive");
            slide = $(".slide.activated");
            support = slide.find("#support_toolbox_cont");
            if (support.length) {
                support.show();
                slide.find("#support_toolbox_msg_cont").hide()
            }
            slide.toggleClass("activated");
            $("#" + father).toggleClass("activated");
            if (father.indexOf("vat") > -1) $.sendUsevat()
        }
    });
    $(".menu-opener").on("click", function (e) {
        e.preventDefault();
        $(".bgactive").removeClass("bgactive");
        if ($(".slideUpForm .activated").length > 0) {
            $(".slideUpForm .activated").removeClass("activated");
            setTimeout(function () {
                    $(".menuContainer, .menu-opener-inner").toggleClass("activated")
                },
                300)
        } else $(".menuContainer, .menu-opener-inner").toggleClass("activated");
        if ($(".menu-opener-inner").hasClass("activated")) {
            $(this).closest("a").attr({"title": "Κλείσε την εργαλειοθήκη"});
            $.sendUsetoolbar()
        } else $(this).closest("a").attr({"title": "Εργαλειοθήκη"})
    });
    $(".close-toolbox").on("click", function (e) {
        e.preventDefault;
        $(".bgactive").removeClass("bgactive");
        var slide = $(this).closest(".slide");
        var support = slide.find("#support_toolbox_cont");
        slide.removeClass("activated");
        if (support.length) {
            support.show();
            slide.find("#support_toolbox_msg_cont").hide()
        }
        setTimeout(function () {
            $(".menuContainer, .menu-opener-inner").toggleClass("activated")
        }, 300)
    });
    $("#toTop").on("click", function () {
        $(".bgactive").removeClass("bgactive");
        $(".slide.activated").removeClass("activated")
    });
    $(document).mouseup(function (e) {
        toolbox_menus_visibility_handler(e)
    }).scroll(function () {
        if (typeof scrollTopTimer == "undefined" || scrollTopTimer == null) scrollTopTimer = setTimeout(function () {
            showTopScroll();
            scrollTopTimer = null
        }, 100)
    });
    $("#more").click(function () {
        $(".partners-list").animate({scrollLeft: "+\x3d456"},
            300, "swing")
    });
    $("#prev").click(function () {
        $(".partners-list").animate({scrollLeft: "-\x3d456"}, 300, "swing")
    });
    $(".smoothScroll:not(.customScroll)").smoothScroll();
    var cookies_box = $(".cookies-box");
    try {
        if (cookies_box.length && cookie_acceptance == "false") {
            cookies_box.show();
            cookies_box.find("a").on("click", function (e) {
                e.preventDefault();
                cookies_box.hide();
                $.cookie_api("cookiesAccepted", true, "", token)
            })
        }
    } catch (e) {
    }
});
var timeOut;
var alertType;
var type;
helperBlock = '\x3cspan class\x3d"help-block error"\x3eerrorMessage\x3c/span\x3e';
$(".help-block").css({"background": "#ff503f"});

function criteriaApplierMain(handler, target) {
    filterData = handler.data("target");
    if (handler.hasClass("all")) target.show(); else {
        target.hide();
        if (handler.hasClass("flag")) target.filter('[data-flag*\x3d"Flag' + filterData + '"]').show(); else if (handler.hasClass("category")) target.filter('[data-categories*\x3d"' + filterData + '"]').show(); else if (handler.hasClass("country")) target.filter('[data-tld\x3d".' + filterData + '"],[data-tld$\x3d".' + filterData + '"],[data-tld\x3d".ελ"],[data-tld\x3d".ευ"]').show(); else if (handler.hasClass("discount")) target.filter(":has(.discount .current-price)").show();
        else if (handler.hasClass("favorite")) target.filter(":has(span.favorite.selected)").show()
    }
}

function tableSortMain(rows, sortBy) {
    rows.sort(function (a, b) {
        var A = $(a).data(sortBy);
        var B = $(b).data(sortBy);
        if (sortBy == "name") {
            A = A.toUpperCase();
            B = B.toUpperCase()
        }
        if (A < B) return -1 * decision;
        if (A > B) return 1 * decision;
        return 0
    })
}

function sslLengthManager(target, calculateFinalPrice) {
    target.closest("ul").removeClass("open").css({
        "top": "163px",
        "left": "-99999px"
    }).find(".active").removeClass("active");
    text = target.text().replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").replace(" € / ", "").replace(/\s[0-9]+[.,][0-9]+[.,][0-9]+|\s[0-9]+[.,][0-9]+/g, ".");
    text = text.split(".");
    target.closest(".duration").find(".dropdown").text(text[0]);
    if (calculateFinalPrice) if ($(".additional-domains").length > 0 || $(".number-of-servers").length > 0) price =
        parseFloat(getProductPrice()); else price = parseFloat(target.find("span").attr("data-price-length-total")); else price = parseFloat(target.find("span").attr("data-price-length-total"));
    noVatPrice = price.toFixed(2);
    if (vat["show"]) price *= vat["quote"];
    price = price.toFixed(2);
    price = price.split(".");
    price[0] = digitNumberFormat(price[0]);
    target.closest(".length").addClass("active").closest(".price-container, .checkout, .pricing-table").find(".price .vat").attr({"data-price-total": noVatPrice}).html(price[0] + "\x3csmall\x3e," +
        price[1] + "\x3c/small\x3e")
}

function digitNumberFormat(digit) {
    if (price[0] > 999) {
        digitPrice = digit.toString();
        digitPriceLength = digitPrice.length;
        test = [];
        c = 1;
        for (i = 0; i <= digitPriceLength; i++) if (c == 3 || c == digitPrice.length) {
            test.push(digitPrice.substring(digitPrice.length - 3));
            digitPrice = digitPrice.slice(0, -c);
            c = 1
        } else c++;
        num = "";
        for (i = 0; i < test.length; i++) {
            num += test[test.length - i - 1];
            num += "."
        }
        num = num.slice(0, -1);
        return num
    } else return digit
}

function showTopScroll() {
    if ($(".domain-results-searchbar").length < 1) if ($.getSizeClassification("large_up")) if ($(document).scrollTop() > $(document).height() * .2) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut(); else {
        var header = $("header");
        var main_banner = $(".main_banner");
        var main_inner_banner = $(".main_banner");
        var intro = $(".intro");
        if (header.length) if ($(document).scrollTop() > header.offset().top + header.outerHeight()) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut();
        else if (main_banner.length) if ($(document).scrollTop() > main_banner.offset().top + main_banner.outerHeight() - 200) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut(); else if (intro.length) if ($(document).scrollTop() > intro.offset().top + intro.outerHeight() - 200) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut(); else if (main_inner_banner.length) if ($(document).scrollTop() > main_inner_banner.offset().top + main_inner_banner.outerHeight() - 200) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut();
        else if ($(document).scrollTop() > 200) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut()
    } else if ($(".domain-results-searchbar").length > 0 && $(document).scrollTop() >= $(".tld-results.list").position().top * 1.5 && $(".tld-results.list").is(":visible")) $("#toTop-Container").fadeIn(); else $("#toTop-Container").fadeOut()
}

function toolbox_menus_visibility_handler(e) {
    var target = $(e.target);
    if ($("#formDim").length) return;
    var container = $("#toolBar-container");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        var slide = $(".slideUpForm .activated");
        if (slide.length > 0) {
            var support = slide.find("#support_toolbox_cont");
            slide.removeClass("activated");
            if (support.length) {
                support.show();
                slide.find("#support_toolbox_msg_cont").hide()
            }
            setTimeout(function () {
                    $(".menuContainer, .menu-opener-inner").removeClass("activated")
                },
                300)
        } else $(".menuContainer, .menu-opener-inner").removeClass("activated")
    }
};
$(document).ready(function () {
    function validate_form(obj) {
        if (obj.is("form")) {
            obj.find(".error:not(.stickly_warning)").removeClass("error");
            $(".invalid").removeClass("invalid");
            $(".help-block").remove();
            src = obj.find("[data-validate]");
            $.each(validation_rules, function (key, value) {
                rule_name = key.replace("validate_", "");
                elements = [];
                src.each(function () {
                    var item = $(this);
                    var rules = item.attr("data-validate").split(" ");
                    if ($.inArray(rule_name, rules) > -1) if (!item.is("disabled") && !item.hasClass("invalid")) elements.push(item)
                });
                if (elements.length) $(elements).each(function () {
                    el = $(this);
                    type = el.attr("data-validate-type");
                    if (typeof type == "undefined") {
                        var override = typeof el.attr("data-override-visibility") != "undefined";
                        if (!value.rule(el, obj, override)) {
                            if (el.is("select")) {
                                el.addClass("invalid");
                                var chosen = $("#" + el.attr("id") + "_chosen");
                                if (chosen.length) var target = chosen; else target = el
                            } else target = el;
                            if (!getCustomDisplay(obj.attr("id"), key, target)) target.show_validation_error(value.message)
                        }
                    } else if (el.is(":visible") || typeof el.attr("data-override-visibility") !=
                        "undefined") {
                        validation_target = el.find('[type\x3d"' + type + '"]');
                        if (!value.rule(validation_target, obj, true)) if (!getCustomDisplay(obj.attr("id"), key, el)) el.show_validation_error(value.message)
                    }
                })
            });
            apply_localised_rules(obj);
            if (obj.find(".error").length < 1) $.each(group_validation_rules, function (key, value) {
                elements = obj.find('[data-validate*\x3d"' + key.replace("validate_", "") + '"]');
                if (elements.length) elements.each(function () {
                    value.rule($(this))
                })
            })
        }
    }

    function apply_localised_rules(obj) {
        if (obj.find(".error").length <
            1 && !$.isEmptyObject(local_validation_rules)) $.each(local_validation_rules, function (rule, definition) {
            if (obj.is(definition.form) && typeof definition.targets == "string") {
                var targets = obj.find(definition.targets);
                if (targets.length) targets.each(function () {
                    var el = $(this);
                    if (!definition.rule(el)) el.show_validation_error(definition.message)
                })
            }
        })
    }

    function perform_status_handler_function(display_errors, obj) {
        if (typeof display_errors == "undefined") if ($(".invalid").length) obj.trigger("onError"); else obj.trigger("onSuccess");
        return false
    }

    function hook_cancel_form(form, formId, properties) {
        if (!("cancel" in properties)) return;
        if (!("handler" in properties.cancel)) throw"There is no handle to hook.";
        if (!("callback" in properties.cancel)) throw"No callback is defined.";
        var handler = form.find(properties.cancel.handler);
        if (handler.length) {
            var handlers = properties.cancel.handler.split(",");
            $.each(handlers, function (key, value) {
                var current_handler = "#" + formId + " " + value;
                $(document).on("click", current_handler + ":not(.disabled)", function (e) {
                    e.preventDefault();
                    properties.cancel.callback($(this))
                }).on("click", current_handler + ".disabled", function (e) {
                    e.preventDefault()
                })
            })
        }
    }

    function hook_triggers(form, formId, properties) {
        if (!properties.trigger) return;
        $.each(properties.trigger, function (key, data) {
            $(data.item).on(data.event, function (e) {
                data.callback(e, $(this))
            })
        })
    }

    function perform_two_way_version_control(form, formId) {
        if (typeof form_objs[formId].ver_control != "undefined") {
            if (!perform_version_test_on_logs(form, form_objs[form.attr("id")].ver_control)) {
                no_change_enable_submit_button(form);
                form.find(".error").removeClass("error");
                form.find(".help-block").remove();
                return false
            }
        } else if (!perform_version_test_on_local_version_control(form)) {
            no_change_enable_submit_button(form);
            form.find(".error").removeClass("error");
            form.find(".help-block").remove();
            return false
        }
        return true
    }

    function no_change_enable_submit_button(form) {
        handlers = $.get_logs(form.attr("id")).handlers;
        if (typeof handlers != "undefined" && handlers.length) $(handlers).removeClass("disabled").blur()
    }

    function log_version_control(formId,
                                 properties) {
        if ("ver_control" in properties) form_objs[formId]["ver_control"] = properties.ver_control
    }

    function perform_version_test_on_logs(form, logs) {
        if (logs.type == "array") return check_log_array(form, logs)
    }

    function check_log_array(form, logs) {
        var data = fetch_data_from_array(logs.value);
        var form_array = uniform_input_form_to_obj(form);
        var changes_found = false;
        $.each(form_array["data"], function (key, value) {
            if (typeof data[key] == "undefined" || $.isArray(data[key]) && data[key].indexOf(value) < 0 || "value" in data[key] &&
                data[key]["value"] != value) {
                changes_found = true;
                return false
            }
        });
        if (!changes_found) $.each(data, function (key) {
            if (data[key]) {
                var target = form.find('[name\x3d"' + key + '"]');
                var value = $.isArray(data[key]) ? data[key] : data[key]["value"];
                if (target.length < 1 || value.indexOf(target.val()) < 0 || !target.is("select") && target.is(":hidden")) {
                    changes_found = true;
                    return false
                }
            } else changes_found = true
        });
        return changes_found
    }

    function perform_version_test_on_local_version_control(form) {
        var targets = form.find('input[data-last-val]:not([type\x3d"hidden"]):not(:disabled):not(.chosen-drop input):not([name\x3d"_token"]), textarea[data-last-val]:not(:disabled)');
        var changes_found = false;
        if (targets.length) targets.each(function () {
            var obj = $(this);
            if (obj.is("div")) return;
            var last_val = obj.attr("data-last-val");
            var current_val = obj.val();
            if (obj.attr("type") == "checkbox") current_val = JSON.parse('"[' + (obj.prop("checked") ? 1 : 0) + ']"'); else current_val = $.isArray(current_val) ? JSON.stringify(current_val) : JSON.stringify([current_val]);
            if (last_val.indexOf("[") != 0) last_val = $.isArray(last_val) ? JSON.stringify(last_val) : JSON.stringify([last_val]);
            if (last_val != current_val) {
                changes_found =
                    true;
                return false
            }
        });
        if (!changes_found) {
            if (!$.isTouch()) {
                var chosen = form.find(".chosen-container:visible");
                var selects = [];
                if (chosen.length) {
                    chosen.each(function () {
                        selects.push($("#" + $(this).attr("id").replace("_chosen", "") + ":not(:disabled)"))
                    });
                    selects = $(selects)
                }
            } else selects = form.find("select:visible:not(:disabled)");
            if (selects.length) selects.each(function () {
                var obj = $(this);
                var last_val = obj.attr("data-last-val");
                var current_val = obj.val();
                if (!last_val) last_val = "";
                current_val = $.isArray(current_val) ?
                    JSON.stringify(current_val) : JSON.stringify([current_val]);
                if (last_val.indexOf("[") != 0) last_val = $.isArray(last_val) ? JSON.stringify(last_val) : JSON.stringify([last_val]);
                if (last_val != current_val) {
                    changes_found = true;
                    return false
                }
            })
        }
        return changes_found
    }

    function fetch_data_from_array(value$jscomp$0) {
        var path = value$jscomp$0.split(",");
        var data = null;
        $.each(path, function (key, value) {
            if (data == null) data = window[value]; else data = data[value]
        });
        return data
    }

    function log_exceptions(formId, properties) {
        if ("version_exception" in
            properties) form_objs[formId]["version_exception"] = properties.version_exception
    }

    function handle_no_changes_error(form) {
        var item = form.closest(".item");
        var wrapper = item.closest(".wrapper");
        if (item.length) {
            if (item.hasClass(identifiers.inline_block_items_class)) closeBlock(wrapper); else closeLine(item);
            $.alertHandler("", ERROR_MSG.NOCHANGES, alert_box_warning)
        }
        if (typeof post_close_command == "function") post_close_command(form)
    }

    function uniform_input_form_to_obj(form) {
        var data = {};
        inputs = form.find("input:not(:disabled):not(:hidden):not(.chosen-drop input), textarea:not(:disabled):not(:hidden)");
        inputs.each(function () {
            data[$(this).attr("name")] = $(this).val()
        });
        form.find("select:not(:disabled)").each(function () {
            var obj = $(this);
            if (obj.is(":visible") || $("#" + obj.attr("id") + "_chosen").is(":visible")) data[obj.attr("name")] = obj.val()
        });
        return {"data": data, "length": form.find("input:not(:hidden), textarea:not(:hidden), select").length}
    }

    function enable_form_controls(formId) {
        if (typeof formId != "undefined") {
            var logs = $.get_logs(formId);
            if (typeof logs == "undefined") return;
            var disabled = logs.disabled;
            if (typeof disabled ==
                "object") $(disabled).filter(":not([data-keep_disabled])").removeClass("disabled"); else $("#" + formId).find(".disabled:not([data-keep_disabled])").removeClass("disabled");
            $("#formDim").remove()
        }
    }

    function hook_callbacks(form, formId, properties) {
        if (typeof properties.callback != "object") return;
        form_objs[formId]["callback"] = {};
        $.each(properties.callback, function (key, value) {
            if (valid_callbacks.indexOf(key) > -1 && typeof value == "function") form_objs[formId]["callback"][key] = value
        })
    }

    function hook_outer_handles(form,
                                formId, properties) {
        if (typeof properties.outer_handlers != "string") return;
        var handlers = $(properties.outer_handlers);
        form_objs[form.attr("id")].outer_handlers = handlers;
        if (!("disabled" in form_objs[form.attr("id")])) form_objs[form.attr("id")].disabled = [];
        handlers.each(function () {
            form_objs[form.attr("id")].disabled.push(this)
        });
        handlers = properties.outer_handlers.split(",");
        var active_handlers = "";
        var disabled_handlers = "";
        $.each(handlers, function (key, value) {
            active_handlers += value.trim() + ":not(.disabled), ";
            disabled_handlers += value.trim() + ".disabled, "
        });
        active_handlers = active_handlers.trim().replace(/,$/, "");
        disabled_handlers = disabled_handlers.trim().replace(/,$/, "");
        $(document).on("click", active_handlers, function (e) {
            e.preventDefault();
            var obj = $(this);
            if (!obj.hasClass("order")) obj.addClass("disabled");
            form.trigger("validate")
        });
        $(document).on("click", disabled_handlers, function (e) {
            e.preventDefault()
        })
    }

    function validate_element(obj, callback, error, strict) {
        strict_validation = strict;
        var rules = obj.attr("data-validate").split(" ");
        obj.removeClass("error invalid");
        if (!obj.is("div")) var cont = obj.closest("div"); else cont = obj;
        cont.find(".error:not(.stickly_warning)").removeClass("error");
        cont.find(".invalid").removeClass("invalid");
        cont.find(".help-block").remove();
        for (var rule in rules) if (rules.hasOwnProperty(rule)) {
            rule = validation_rules["validate_" + rules[rule]];
            var type = obj.attr("data-validate-type");
            var el = obj;
            if (el.is("select")) {
                var tmp = $("#" + el.attr("id") + "_chosen.chosen-container");
                if (tmp.length) el = tmp
            }
            if (typeof type != "undefined") {
                var target =
                    obj.find('[type\x3d"' + type + '"]');
                if (!rule.rule(target, obj.closest("form"), true)) {
                    el.show_validation_error(rule.message);
                    break
                }
            } else try {
                if (!rule.rule(obj, obj.closest("form"), !strict)) {
                    el.show_validation_error(rule.message);
                    break
                }
            } catch (e) {
                throw e;
            }
        }
        if (obj.hasClass("error")) {
            if (typeof error == "function") error(obj)
        } else if (typeof callback == "function") callback(obj);
        strict_validation = true
    }

    function getCustomDisplay(form, rule, element) {
        try {
            if (!(rule in form_objs[form].custom_error_display)) return false;
            if (typeof form_objs[form].custom_error_display[rule] ==
                "function") form_objs[form].custom_error_display[rule](validation_rules[rule], $(element));
            return true
        } catch (err) {
            return false
        }
    }

    function defaultErrorHandler(formId) {
        if ("handlers" in form_objs[formId]) form_objs[formId].handlers.removeClass("disabled").blur();
        if ("outer_handlers" in form_objs[formId]) form_objs[formId].outer_handlers.removeClass("disabled").blur()
    }

    var DEPENDENCIES = {
        "SUBDOMAIN_LENGTH": 18,
        "DOMAIN_NAME_MAX_LEN": 63,
        "TEXT_INPUTS": '#formId [type\x3d"date"],#formId [type\x3d"datetime"],#formId [type\x3d"datetime-local"],#formId [type\x3d"email"],#formId [type\x3d"month"],#formId [type\x3d"password"],#formId [type\x3d"search"],#formId [type\x3d"tel"],#formId [type\x3d"text"],#formId [type\x3d"time"],#formId [type\x3d"url"],#formId [type\x3d"week"]'
    };
    var ERROR_MSG = VALIDATION_MESSAGES.ERRORS;
    var validation_rules = {
        "validate_required": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                var requiredIf = el.attr("data-required-if");
                if (typeof requiredIf != "undefined") {
                    requiredIf = $(requiredIf);
                    if (requiredIf.is('[type\x3d"radio"]') || requiredIf.is('[type\x3d"checkbox"]')) if (requiredIf.prop("checked") !== true) return true;
                    var requiredFor = el.attr("data-required-for");
                    if (typeof requiredFor != "undefined") {
                        requiredFor =
                            requiredFor.split(",");
                        if (requiredFor.indexOf(requiredIf.val()) < 0) return true
                    }
                }
                switch (el.attr("type")) {
                    case "checkbox":
                        return el.is(":checked");
                    case "radio":
                        return form.find('input[name\x3d"' + el.attr("name") + '"]').filter(":checked").length > 0;
                    default:
                        if (el.is("select")) {
                            var selected = el.find("option:selected");
                            var chosen = $("#" + el.attr("id") + "_chosen:visible");
                            if (chosen.length || el.is(":visible") || override_visibility) if (el.attr("data-disabled")) return selected.length && !!selected.val(); else {
                                selected = el.find("option:selected:not(:disabled)");
                                return selected.length && !!selected.val()
                            }
                            return true
                        } else return el.val() && $.trim(el.val().trim()) !== ""
                }
            }, "message": ERROR_MSG.REQUIRED
        }, "validate_length": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                length = el.attr("data-validate-length");
                var possible_lengths = length.match(/min|max/g);
                if (!$.isEmptyObject(possible_lengths)) if (possible_lengths.length == 1) {
                    var length_rule = length.match(/[0-9]+/);
                    this.ruleConfig = {rule: length_rule[0]};
                    if (!$.isEmptyObject(possible_lengths)) {
                        length_rule = parseInt(length_rule[0]);
                        if (length.match("min")) return !this.utilities.min(el, length_rule, this); else return !this.utilities.max(el, length_rule, this)
                    }
                } else {
                    var range = length.replace(/\-$/, "").split("-");
                    range[0] = parseInt(range[0].replace("min", ""));
                    range[1] = parseInt(range[1].replace("max", ""));
                    this.ruleConfig = {rule: range, type: "range"};
                    this.message = ERROR_MSG.LENGTH.RANGE.replace("##min##", range[0]).replace("##max##", range[1]);
                    var val_len = el.val().length;
                    return val_len > range[0] - 1 && val_len < range[1] + 1
                }
                return true
            }, "utilities": {
                "min": function (el, length, src) {
                    src.ruleConfig.type = "min";
                    src.message = ERROR_MSG.LENGTH.MIN.replace("##n##", length);
                    return el.val().length < length
                }, "max": function (el, length, src) {
                    src.ruleConfig.type = "max";
                    src.message = ERROR_MSG.LENGTH.MAX.replace("##n##", length);
                    return el.val().length > length
                }
            }
        }, "validate_international": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                var value = el.val();
                value = value.match(REG.ALL_GR.REGEX);
                if (!$.isEmptyObject(value)) return false;
                return true
            }, "message": ERROR_MSG.INTERNATIONAL
        }, "validate_email": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                value = el.val().trim();
                found = value.match(/@/g);
                if (!$.isEmptyObject(found) && found.length == 1) {
                    var username = "";
                    var domain = "";
                    value = value.split("@");
                    username = value[0];
                    domain = value[1];
                    if (domain != null) {
                        if (!$.isEmptyObject(domain.match(REG.DOMAIN)) ||
                            $.isEmptyObject(domain.replace(/\.$/, "").match(/\./))) return false;
                        return true
                    }
                } else if (!$.isEmptyObject(found) && found.length > 1) return true;
                return false
            }, "message": ERROR_MSG.EMAIL
        }, "validate_regex": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                value = el.val().trim();
                regex = el.attr("data-validate-regex").split("/#/");
                modifiers = regex[1];
                regex = regex[0];
                if (modifiers != null) regex = new RegExp(regex, modifiers); else regex = new RegExp(regex);
                value = value.replace(regex, "");
                return value == ""
            }, "message": ERROR_MSG.ILLEGAL.CHARS
        }, "validate_number": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                value = el.val().trim().replace(/[0-9]/g, "");
                return value == ""
            }, "message": ERROR_MSG.ILLEGAL.CHARS
        }, "validate_strength": {
            "rule": function (el, form, override_visibility) {
                var requiredStrength = el.attr("data-validate-strength");
                if (requiredStrength && requiredStrength > 3) requiredStrength = 3;
                return this.utilities.calculatePasswordStrength(el.val()) >=
                    requiredStrength
            }, "message": ERROR_MSG.PASSWORD, "utilities": {
                calculatePasswordStrength: function (password) {
                    if (password.length < 4) return 0;
                    var score = 0;
                    var checkRepetition = function (pLen, str) {
                        var res = "";
                        for (var i = 0; i < str.length; i++) {
                            var repeated = true;
                            for (var j = 0; j < pLen && j + i + pLen < str.length; j++) repeated = repeated && str.charAt(j + i) == str.charAt(j + i + pLen);
                            if (j < pLen) repeated = false;
                            if (repeated) {
                                i += pLen - 1;
                                repeated = false
                            } else res += str.charAt(i)
                        }
                        return res
                    };
                    if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) score += 5;
                    if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) score +=
                        5;
                    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;
                    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) if (password.match(/([0-9])/)) score += 40;
                    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) score += 15;
                    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) score += 15;
                    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) score += 15;
                    if (password.match(/^\w+$/) || password.match(/^\d+$/)) score -= 10;
                    if (score < 0) score = 0;
                    if (score > 100) score = 100;
                    if (score <
                        20) return 0; else if (score < 40) return 1; else if (score <= 60) return 2; else return 3
                }, strengthDisplay: function ($el, options) {
                    var config = {bad: "Very bad", weak: "Weak", good: "Good", strong: "Strong"};
                    if (options) $.extend(config, options);
                    $el.bind("keyup", function (e) {
                        var val = $(this).val().trim();
                        var $parent = typeof config.parent == "undefined" ? $(this).parent() : $(config.parent).parent();
                        var $displayContainer = $parent.find(".strength-meter");
                        if (val != "") {
                            if ($displayContainer.length == 0) {
                                $displayContainer = $("\x3cspan\x3e\x3c/span\x3e");
                                $displayContainer.addClass("strength-meter").appendTo($parent)
                            }
                            if (!val) $displayContainer.hide(); else $displayContainer.show();
                            var strength = validation_rules.validate_strength.utilities.calculatePasswordStrength(val);
                            var css = {
                                "color": "white",
                                "display": "block",
                                "font-size": "0.825rem",
                                "padding": "0.125rem 0.575rem",
                                "position": "relative",
                                "top": "-1.25rem",
                                "background-color": "#fd8549"
                            };
                            var text = config.bad;
                            if (strength == 1) {
                                css["background-color"] = "#F5D01C";
                                text = config.weak
                            } else if (strength == 2) {
                                css["background-color"] =
                                    "#20b6db";
                                text = config.good
                            } else if (strength >= 3) {
                                css["background-color"] = "#18bf93";
                                text = config.strong
                            }
                            $displayContainer.css(css).text(text)
                        } else if ($displayContainer.length) $displayContainer.remove()
                    })
                }
            }
        }, "validate_pass_confirm": {
            "rule": function (el, form, override_visibility) {
                passToBeConfirmed = form.find("#password").val().trim();
                if (passToBeConfirmed == "") return true;
                if (passToBeConfirmed != el.val().trim()) return false;
                return true
            }, "message": ERROR_MSG.NOTCONFIRMED
        }, "validate_email_confirm": {
            "rule": function (el,
                              form, override_visibility) {
                emailToBeConfirmed = form.find("#email").val().trim();
                if (emailToBeConfirmed == "") return true;
                if (emailToBeConfirmed != el.val().trim()) return false;
                return true
            }, "message": ERROR_MSG.NOTCONFIRMED
        }, "validate_ip": {
            "rule": function (el, form, override_visibility) {
                var val = el.val();
                if (val.replace(/[0-9a-fA-F:.]+/g, "").length) {
                    this.message = ERROR_MSG.IP.INVALID_CHARS;
                    return false
                }
                if (val.match(/^[:.]|[:.]$/) != null || val.match(/[:][.]|[.][:]/) != null) {
                    this.message = ERROR_MSG.IP.INVALID_SYNTAX;
                    return false
                }
                return true
            }
        },
        "validate_name_servers": {
            "rule": function (el, form, override_visibility) {
                var optional = el.attr("data-optional");
                var scope = el.attr("data-scope");
                if (typeof optional != "udefined" && optional && el.val().length < 1 || el.is("input") && el.is(":hidden")) return true;
                this.message = "";
                if (typeof scope == "string" && scope) if (scope in this.utilities.scope) return this.utilities.scope[scope](el, this); else throw"The requested scope is not recognised!"; else return this.utilities.scope.name_server(el, this);
                return true
            }, "utilities": {
                "scope": {
                    "host": function (el,
                                      src) {
                        var val = el.val();
                        if (val.match(el.attr("data-validate-idn") == "true" ? REG.NS_NAME.IDN_SUPPORT.HOST.REGEX : REG.NS_NAME.NO_IDN_SUPPORT.HOST.REGEX) != null) {
                            src.message = ERROR_MSG.NAME_SERVERS.INVALID_CHARS;
                            return false
                        }
                        if (val.match(/^[-]|[-]$|[-]{2,}/g) != null) {
                            src.message = ERROR_MSG.NAME_SERVERS.INVALID_SYNTAX;
                            return false
                        }
                        return true
                    }, "name_server": function (el, src) {
                        var val = el.val();
                        if (val.match(el.attr("data-validate-idn") == "true" ? REG.NS_NAME.IDN_SUPPORT.NAMESERVER.REGEX : REG.NS_NAME.NO_IDN_SUPPORT.NAMESERVER.REGEX) !=
                            null) {
                            src.message = ERROR_MSG.NAME_SERVERS.INVALID_CHARS;
                            return false
                        }
                        if (val.match(/^[.-]|[.-]$|[.-]{2,}/g) != null) {
                            src.message = ERROR_MSG.NAME_SERVERS.INVALID_SYNTAX;
                            return false
                        }
                        return true
                    }
                }
            }
        }, "validate_terms_and_conditions": {
            "rule": function (el, form, override_visibility) {
                if (el.is('[type\x3d"checkbox"]') && el.closest("label").is(":visible")) if (!el.prop("checked")) return false;
                return true
            }
        }, "validate_required_contact": {
            "rule": function (el, form, override_visibility) {
                var option = el.find("option:selected");
                var chosen = $("#" + el.attr("id") + "_chosen");
                if (chosen.length < 1 && !el.is(":visible") || chosen.length && !chosen.is(":visible")) return true;
                if (option.length) {
                    if (option.disabled()) {
                        this.message = ERROR_MSG.CONTACT_PROFILES.MISSING;
                        return false
                    }
                } else {
                    this.message = ERROR_MSG.REQUIRED;
                    return false
                }
                return true
            }
        }, "validate_ascii": {
            "rule": function (el, form, override_visibility) {
                if (el.val() == "") return true;
                var extended = el.attr("data-extended-character-set");
                if (typeof extended == "undefined") extended = false;
                return (extended ?
                    /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(el.val())
            }, "message": ERROR_MSG.ASCII
        }, "validate_numeric": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                switch (el.attr("type")) {
                    case "checkbox":
                        return true;
                    case "radio":
                        return true;
                    default:
                        if (el.is("select")) return true; else {
                            var value = el.val();
                            if (!value) return true;
                            value = value.toString();
                            if (REG.NUMERIC.IMPERIAL_PLAIN.WHOLE_WORD) return true; else if (REG.NUMERIC.IMPERIAL_FORMATTED.WHOLE_WORD) return true;
                            else if (REG.NUMERIC.METRIC_PLAIN.WHOLE_WORD) return true; else if (REG.NUMERIC.METRIC_FORMATTED.WHOLE_WORD) return true; else return false
                        }
                }
            }, "message": ERROR_MSG.NUMERIC
        }, "validate_value": {
            "rule": function (el, form, override_visibility) {
                if (el.is(":hidden") && !el.is("select") && !override_visibility) return true;
                switch (el.attr("type")) {
                    case "checkbox":
                        return true;
                    case "radio":
                        return true;
                    default:
                        if (el.is("select")) return true; else {
                            var value = el.val();
                            var min = el.attr("data-min-value");
                            var max = el.attr("data-max-value");
                            if (!value) return true;
                            value = value.toString();
                            if (REG.NUMERIC.IMPERIAL_PLAIN.WHOLE_WORD) value = parseFloat(value); else if (REG.NUMERIC.IMPERIAL_FORMATTED.WHOLE_WORD) value = parseFloat(value.replace(/,/g, "")); else if (REG.NUMERIC.METRIC_PLAIN.WHOLE_WORD) value = parseFloat(value.replace(",", ".")); else if (REG.NUMERIC.METRIC_FORMATTED.WHOLE_WORD) value = parseFloat(value.replace(/\./g, "").replace(",", ".")); else return true;
                            if (typeof min != "undefined" && value < min) {
                                this.message = ERROR_MSG.VALUES.MIN.replace("##min##",
                                    min);
                                return false
                            }
                            if (typeof max != "undefined" && value > max) {
                                this.message = ERROR_MSG.VALUES.MAX.replace("##max##", max);
                                return false
                            }
                            return true
                        }
                }
            }
        }
    };
    var local_validation_rules = {};
    var group_validation_rules = {
        "validate_unique": {
            "rule": function (el, form, override_visibility) {
                var targets = el.find('[type\x3d"text"]:visible:not(disabled):not(.error)[name*\x3d"' + el.attr("data-validate-target") + '"]');
                var data = {};
                var msg = this.message;
                targets.each(function () {
                    var input = $(this);
                    var val = input.val();
                    if (!(val in data)) data[val] =
                        [];
                    data[val].push(input.attr("name"))
                });
                $.each(data, function (key$jscomp$0, value) {
                    if (value.length > 1) $.each(value, function (key, names) {
                        $('[name\x3d"' + names + '"]').show_validation_error(msg)
                    })
                })
            }, "message": ERROR_MSG.UNIQUE
        }
    };
    var validation_class = "under_validation";
    var valid_callbacks = ["before:validate", "before:execute", "after:prepare"];
    var strict_validation = true;
    var form_objs = {};
    $.fn.extend({
        validate_form: function (display_errors) {
            var form = $(this);
            var formId = form.attr("id");
            if (typeof form_objs[formId]["version_exception"] ==
                "undefined") if (!perform_two_way_version_control(form, formId)) {
                handle_no_changes_error(form);
                return
            }
            if (typeof form_objs[formId]["callback"] != "undefined" && typeof form_objs[formId]["callback"]["before:validate"] == "function") form_objs[formId]["callback"]["before:validate"]();
            validate_form(form);
            perform_status_handler_function(display_errors, form);
            return form
        }, display_form_errors: function (callback) {
            obj = $(this);
            validate_form(obj);
            obj.trigger("onError");
            if (typeof callback == "function") callback();
            return obj
        },
        show_validation_error: function (errorMsg) {
            el = $(this);
            el.addClass("invalid error");
            errorMsg = typeof el.attr("data-validate-error-msg") != "undefined" ? el.attr("data-validate-error-msg") : errorMsg;
            siblingTarget = typeof el.attr("data-sibling-class") != "undefined" ? "." + el.attr("data-sibling-class") : null;
            siblingTarget = typeof el.attr("data-sibling-id") != "undefined" && siblingTarget == null ? "#" + el.attr("data-sibling-id") : siblingTarget;
            if (siblingTarget != null) if (typeof el.attr("type") != "undefined" && el.attr("type") == "checkbox") el.siblings(siblingTarget).after('\x3cspan class\x3d"help-block error"\x3e' +
                errorMsg + "\x3c/span\x3e"); else el.siblings(siblingTarget).addClass("invalid error").after('\x3cspan class\x3d"help-block error"\x3e' + errorMsg + "\x3c/span\x3e"); else el.addClass("invalid error").after('\x3cspan class\x3d"help-block error"\x3e' + errorMsg + "\x3c/span\x3e");
            if (el.hasClass("chosen-container")) el = $("#" + el.attr("id").replace("_chosen", ""));
            var name = el.attr("name");
            if (name === "undefined") name = el.attr("data-name");
            if (typeof el.attr("type") != "undefined" && el.attr("type") == "checkbox") return;
            var label =
                el.closest("form").find('label[for\x3d"' + name + '"]');
            if (label.length < 1) label = el.closest("form").find('label[for\x3d"' + el.attr("id") + '"]');
            label.addClass("error")
        }, displayPasswordStrength: function (conf) {
            new validation_rules.validate_strength.utilities.strengthDisplay(this, conf);
            return this
        }, prepare_form: function (onSuccess, onError, disable) {
            var form = $(this);
            var formId = form.attr("id");
            var events = {
                "onError": function () {
                    if (typeof onError == "function") onError(form);
                    return false
                }, "onSuccess": function () {
                    onSuccess(form)
                }
            };
            if (typeof onSuccess != "function") {
                throw"Callback for success was not set!";
                return false
            }
            if (!(formId in form_objs)) form_objs[formId] = events; else $.extend(form_objs[formId], events);
            if (typeof disable != "undefined") form_objs[formId].disabled = form.find(disable);
            form.attr({"novalidate": ""});
            form.addClass(validation_class);
            form.find('[data-validate*\x3d"strength"]').displayPasswordStrength();
            form.find("textarea").on("keypress", function (e) {
                if (e.which == "13" && e.shiftKey == true) {
                    e.preventDefault();
                    $(this).closest("form").trigger("validate")
                }
            });
            form.on("validate", function (e) {
                form.validate_form()
            });
            form.on("submit", function (e) {
                e.preventDefault()
            });
            form.on("onError", function () {
                form_objs[formId].onError();
                defaultErrorHandler(formId);
                $(this).find_errors()
            });
            form.on("onSuccess", function () {
                if (typeof disable != "undefined") form_objs[formId].disabled.addClass("disabled");
                form_objs[formId].onSuccess()
            });
            form.add_handler();
            return $(this)
        }, prepare_form_advanced: function (properties) {
            var form = $(this);
            var formId = form.attr("id");
            if (form.is_ready()) return form;
            if (!$.isPlainObject(properties) || $.isEmptyObject(properties)) throw"Properties object is undefined! Define it to continue.";
            if (!("onSuccess" in properties) || typeof properties.onSuccess != "function") throw"Callback for success was not set!";
            if (!("onError" in properties)) properties.onError = null;
            if ("custom_keypress_handler" in properties) {
                if (!(formId in form_objs)) form_objs[formId] = {};
                form_objs[formId].custom_keypress_handler = properties.custom_keypress_handler
            }
            form.prepare_form(properties.onSuccess, properties.onError,
                properties.disable);
            if ("handlers" in properties) {
                if (typeof properties.handlers != "string") throw"The handlers property contains invalid type of data! It should be string, " + typeof properties.handlers + " was given. Handlers must contain a JQuery selector.";
                var handlers = form.find(properties.handlers);
                if (handlers.length) {
                    form_objs[form.attr("id")].handlers = handlers;
                    $.each(properties.handlers.split(","), function (key, handler) {
                        $(document).on("click", "#" + form.attr("id") + " " + handler + ":not(.disabled)", function (e) {
                            e.preventDefault();
                            var obj = $(this);
                            if (!obj.hasClass("order") && !obj.hasClass("update") && !("disable_exception" in properties)) obj.addClass("disabled");
                            if ($.isTouch()) obj.addClass("requestTrigger");
                            form.trigger("validate");
                            obj.blur()
                        });
                        $(document).on("click", "#" + form.attr("id") + " " + handler + ".disabled", function (e) {
                            e.preventDefault()
                        })
                    })
                } else throw'The handlers you provided, for Form : "' + formId + '" didn`t match any elements.';
            }
            hook_outer_handles(form, formId, properties);
            hook_cancel_form(form, formId, properties);
            hook_callbacks(form,
                formId, properties);
            hook_triggers(form, formId, properties);
            log_version_control(formId, properties);
            log_exceptions(formId, properties);
            if ("callback" in form_objs[formId] && "after:prepare" in form_objs[formId]["callback"]) form_objs[formId]["callback"]["after:prepare"](form);
            if ("custom_error_handler" in properties) form_objs[formId].custom_error_handler = properties.custom_error_handler;
            if ("custom_error_display" in properties) form_objs[formId].custom_error_display = properties.custom_error_display;
            return form
        }, add_handler: function () {
            var form$jscomp$0 =
                $(this);
            var formId = form$jscomp$0.attr("id");
            if ("custom_keypress_handler" in form_objs[formId]) $.each(form_objs[formId].custom_keypress_handler, function (selector, callback) {
                $(selector).on("keypress", function (e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        callback()
                    }
                })
            }); else $(document).on("keypress", "#" + formId + " input:not(.chosen-container input)", function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    var form = $(this).closest("form");
                    $(this).closest("form").submit_form()
                }
            });
            return form$jscomp$0
        }, submit_form: function () {
            $(this).trigger("validate")
        },
        find_errors: function ($speed) {
            var form = $(this);
            var formId = form.attr("id");
            var error = form.find(".error:first");
            if (typeof form_objs[formId] != "undefined" && "custom_error_handler" in form_objs[formId]) form_objs[formId].custom_error_handler(error); else if (error.is(":visible")) $("html,body").animate({scrollTop: error.offset().top - 100}, $speed || 2E3)
        }, enable_form_controls: function () {
            if ($(this).is("form")) enable_form_controls($(this).attr("id"));
            return $(this)
        }, validate: function () {
            $(this).trigger("validate");
            return $(this)
        },
        element: function (strict, callback, error, success) {
            if (typeof strict == "function") {
                var tmp = callback;
                var tmp2 = error;
                callback = strict;
                error = tmp;
                success = tmp2;
                strict = false
            }
            validate_element($(this), callback, error, strict, success)
        }, is_ready: function () {
            return $(this).hasClass(validation_class)
        }, handle_errors: function () {
            defaultErrorHandler(this[0].id)
        }, alter_event_callback: function (event, callback) {
            if (["onSuccess", "onError"].indexOf(event) < 0) throw'Event "' + event + '" unknown';
            if (typeof callback != "function") throw"Callback must be function";
            var form = $(this);
            form_objs[form.attr("id")][event] = function () {
                callback(form)
            }
        }
    });
    $.extend({
        read_dependencies: function (key) {
            return DEPENDENCIES[key.toUpperCase()]
        }, read_logs: function (key) {
            return form_objs
        }, get_logs: function (formId) {
            return form_objs[formId]
        }, enable_form_controls: function (formId) {
            if (formId !== false) enable_form_controls(formId)
        }, add_validation_rule: function (rules) {
            if (typeof rules != "object") throw"No rules to add.";
            $.each(rules, function (key, value) {
                if (!(key in local_validation_rules)) local_validation_rules[key] =
                    value
            })
        }, get_error_msg: function () {
            return ERROR_MSG
        }, getValidationClass: function () {
            return validation_class
        }
    })
});
$(document).ready(function () {
    use_global_handler = true;
    $.fn.extend({
        displayIndividualErrors: function (error) {
            displayIndividualInputErrors($(this), error);
            return this
        }
    });
    $.extend({
        alertHandler: function (formid, mssg, alertType, data, error_code, outerShutter) {
            var cartDomainAlertCont = $("#errorDomains");
            if (cartDomainAlertCont.length) {
                cartDomainAlertCont.hide();
                if (typeof cartDomainAlert != "undefined") clearTimeout(cartDomainAlert)
            }
            alert["formid"] = formid;
            alert["mssg"] = mssg;
            alert["alert"] = alertType;
            alert["error_code"] =
                error_code;
            alert["data"] = data;
            alert["outerShutter"] = outerShutter ? outerShutter : false;
            killDisplays("", error_code);
            return false
        }, displayErrors: function (formid, data) {
            displayErrorInputMessages(formid, data)
        }, closeDisplays: function () {
            killDisplays(true)
        }
    });
    $(function () {
        var inputs = $("input, textarea, text, button");
        var inputTo;
        inputs.on("keydown", function (e) {
            var targets = $("input:visible:not(:disabled), textarea");
            if (e.keyCode == 9 || e.which == 9) {
                e.preventDefault();
                if (e.shiftKey) var inputTo = targets.get(targets.index(this) -
                    1); else inputTo = targets.get(targets.index(this) + 1);
                if (inputTo) inputTo.focus(); else targets[0].focus()
            }
        })
    });
    $(document).on("change", ".gdpr_approvals", function () {
        if ($(".gdpr_approvals:checked").length) $("#login_btn").removeClass("disabled"); else $("#login_btn").addClass("disabled")
    })
});
var custom_selectors_apply = {};
var common_error_modal = '\x3cdiv id\x3d"errorModal" class\x3d"reveal-modal tiny" data-reveal aria-labelledby\x3d"" role\x3d"" data-options\x3d"close_on_background_click:false; close_on_esc:false;" style\x3d"display: none"\x3e\x3cdiv class\x3d"row collapse"\x3e\x3cdiv class\x3d"small-12 columns"\x3e\x3cp id\x3d"errorModalTitle" class\x3d"lead red"\x3e\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"modal-content"\x3e\x3cdiv class\x3d"row"\x3e\x3cdiv class\x3d"small-12 columns"\x3e\x3cp id\x3d"errorModalContent"\x3e\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
var gdpr_built = false;
alert_box_failure = "alert";
alert_box_warning = "warning";
alert_box_success = "success";
alert_visibility_duration = 11E3;
alert_help_box = '\x3cdiv class\x3d"alert-box help-block alert"\x3e\x3c/div\x3e';

function globalErrorsHandler(x, modalError) {
    if (x.readyState == 0) connectionErrors(x.statusText, modalError); else if (x.readyState == 4) if (x.status != 200) httpErrors("http" + x.status)
}

function connectionErrors(statusText, modalError) {
    switch (statusText) {
        case "timeout": {
            if (typeof modalError != "undefined" && modalError === true) openModalError(function (modal) {
                modal.find("#errorModalTitle").text(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.TITLE);
                modal.find("#errorModalContent").html(APP_LANG.MESSAGES.TIMEOUT_UNRECOVERABLE.CONTENT)
            }); else $.alertHandler("", APP_LANG.MESSAGES.TIMEOUT, alert_box_failure, "", "timeout");
            break
        }
        default: {
            $.alertHandler("", APP_LANG.MESSAGES.ERROR, alert_box_failure, "", "default")
        }
    }
}

function httpErrors(error_code) {
    $.alertHandler("", APP_LANG.MESSAGES.ERROR, alert_box_failure, "", error_code)
}

function openModalError(callback) {
    if (typeof callback != "function") throw"Callback function is not defined";
    $("body").append(common_error_modal);
    var modal = $("#errorModal");
    try {
        modal.modal_open()
    } catch ($err) {
    }
    callback(modal)
}

function globalApplicationErrors(response, formId, custom_selectors) {
    if (typeof custom_selectors == "object") $.extend(custom_selectors_apply, custom_selectors);
    if (typeof response == "object" && "success" in response && !response.success) switch (response.code) {
        case error_codes.validation_error: {
            $.displayErrors(formId, response.data);
            break
        }
        case error_codes.sql_error:
        case error_codes.update_db_error:
        case error_codes.delete_db_error: {
            $.alertHandler("", response.msg, alert_box_failure);
            break
        }
        case error_codes.unrecognized_action: {
            $.alertHandler("",
                APP_LANG.MESSAGES.ERROR, alert_box_failure);
            break
        }
        case error_codes.action_not_allowed:
        case error_codes.insufficient_permissions: {
            $.alertHandler("", response.msg, alert_box_failure);
            break
        }
        case error_codes.session_error: {
            break
        }
        case error_codes.session_active: {
            document.location.reload(true);
            break
        }
        case error_codes.ip_blacklisted: {
            $.alertHandler("", response.msg, alert_box_failure);
            break
        }
        case error_codes.login_failed: {
            $.alertHandler(formId, response.msg, alert_box_failure);
            break
        }
        case error_codes.two_factor_auth: {
            $.alertHandler("",
                response.msg, alert_box_warning);
            break
        }
        case error_codes.account_auto_suspended:
        case error_codes.account_suspended: {
            current_location = window.location.href;
            if (checkIfLocationIsBackend(current_location)) if (/\//g.test(current_location)) $.set_cookie("errorCode", [response.msg, response.success], "/"); else $.alertHandler("", response.msg, alert_box_failure, response.data); else $.alertHandler("", response.msg, alert_box_failure, response.data);
            break
        }
        case error_codes.registry_maintenance:
        case error_codes.domain_is_not_valid:
        case error_codes.domain_check_failed:
        case error_codes.domain_info_failed:
        case error_codes.domain_does_not_exist:
        case error_codes.invalid_domain_cant_be_registered:
        case error_codes.domain_max_length_reached:
        case error_codes.domain_registrant_is_dnhost:
        case error_codes.invalid_epp_auth:
        case error_codes.domain_not_registered_cant_be_transferred_not_registered:
        case error_codes.can_not_get_premium_quote:
        case error_codes.domain_register_failed:
        case error_codes.domain_not_registered_cant_be_transferred_syntax_error:
        case error_codes.domain_not_registered_cant_be_transferred_tld_unsupported:
        case error_codes.domain_check_renew_with_auto_renew_failed: {
            $.alertHandler(formId,
                response.msg, alert_box_failure);
            break
        }
        case error_codes.cart_item_not_found: {
            cartItemNotFound(response);
            break
        }
        case error_codes.cart_action_exception:
        case error_codes.item_already_in_cart:
        case error_codes.cart_option_error:
        case error_codes.cart_attribute_error:
        case error_codes.domain_already_in_cart:
        case error_codes.parent_child_does_not_exist:
        case error_codes.item_cant_be_child:
        case error_codes.item_associated_as_child:
        case error_codes.get_domain_info_failed:
        case error_codes.cart_not_associated_with_billing_profile:
        case error_codes.domain_check_failure: {
            $.alertHandler(formId,
                response.msg, alert_box_failure);
            break
        }
        case error_codes.cart_item_attributes_missing: {
            $.alertHandler(formId, response.msg, alert_box_failure);
            break
        }
        case error_codes.cart_extension_error: {
            $.alertHandler(formId, response.msg, alert_box_failure);
            break
        }
        case error_codes.certificate_auto_reorder_failed: {
            $.alertHandler("", response.msg, alert_box_failure);
            break
        }
        case error_codes.certificate_out_of_renew_period: {
            $.alertHandler("", response.data, alert_box_failure);
            break
        }
        case error_codes.ssl_store_in_maintenance: {
            $.alertHandler("",
                response.data, alert_box_failure);
            break
        }
        case error_codes.profile_required_gdpr_approval: {
            loginGdprApprovalRequired(response);
            break
        }
        case error_codes.token_error: {
            location.reload(true);
            break
        }
        case error_codes.network_connection_error: {
            $.alertHandler("", response.msg, alert_box_failure);
            break
        }
        case error_codes.access_denied: {
            document.location.href = response.data;
            break
        }
        default: {
            $.alertHandler("", response.msg ? response.msg : APP_LANG.MESSAGES.ERROR, alert_box_failure)
        }
    } else $.alertHandler("", APP_LANG.MESSAGES.ERROR,
        alert_box_failure);
    var gdprModal = $("#gdpr_approval_modal");
    if (gdprModal.length) {
        $("#gdpr_approval_modal .disabled").removeClass("disabled");
        var modal_bg = $(".reveal-modal-bg");
        modal_bg.css("z-index", modal_bg.attr("data-init-index"));
        var loader_cont = gdprModal.find(".loader_cont");
        loader_cont.find(".submitText").show();
        loader_cont.find(".loading").hide()
    }
}

function creditDocumentApplicationErrors(response, formId) {
    switch (response.code) {
        case error_codes.credit_action_not_found:
        case error_codes.credit_document_not_found:
        case error_codes.credit_status_not_permitted:
        case error_codes.credit_paying_not_allowed_by_status: {
            $.alertHandler("", response.msg, alert_box_failure)
        }
        default: {
            billingDocumentsApplicationErrors(response, formId);
            break
        }
    }
}

function billingDocumentsApplicationErrors(response, formId) {
    switch (response.code) {
        case error_codes.user_credit_exhausted:
        case error_codes.sale_document_update_exception:
        case error_codes.sale_document_not_found:
        case error_codes.due_status_does_not_allow_payment:
        case error_codes.due_type_does_not_allow_payment:
        case error_codes.paying_document_status_does_not_allow_payment:
        case error_codes.paying_document_type_does_not_allow_payment:
        case error_codes.due_document_balance_already_paid:
        case error_codes.paying_document_balance_is_zero:
        case error_codes.document_action_not_permitted:
        case error_codes.requested_task_not_allowed:
        case error_codes.document_status_not_permitted:
        case error_codes.document_balance_total_difference:
        case error_codes.no_due_document_defined:
        case error_codes.no_paying_document_defined:
        case error_codes.balance_must_be_zero_or_equal:
        case error_codes.undefined_document_status:
        case error_codes.order_not_found:
        case error_codes.order_item_pending_process_after:
        case error_codes.order_item_expired:
        case error_codes.order_requested_status_not_executable:
        case error_codes.invoice_billing_profile_missing:
        case error_codes.invoice_must_be_requested_by_order:
        case error_codes.invoice_already_exists_for_this_document:
        case error_codes.credit_action_not_found:
        case error_codes.credit_document_not_found:
        case error_codes.credit_status_not_permitted:
        case error_codes.credit_paying_not_allowed_by_status:
        case error_codes.debit_status_does_not_allow_cancel: {
            $.alertHandler("", response.msg,
                alert_box_failure);
            break
        }
        default: {
            globalApplicationErrors(response, formId);
            break
        }
    }
}

function masterDocumentsApplicationErrorsHandler(response, formId) {
    switch (response.code) {
        case error_codes.sale_document_update_exception:
        case error_codes.sale_document_not_found:
        case error_codes.due_status_does_not_allow_payment:
        case error_codes.due_type_does_not_allow_payment:
        case error_codes.paying_document_status_does_not_allow_payment:
        case error_codes.paying_document_type_does_not_allow_payment:
        case error_codes.due_document_balance_already_paid:
        case error_codes.paying_document_balance_is_zero:
        case error_codes.document_action_not_permitted:
        case error_codes.document_status_not_permitted:
        case error_codes.document_balance_total_difference:
        case error_codes.credit_action_not_found:
        case error_codes.credit_document_not_found:
        case error_codes.credit_status_not_permitted:
        case error_codes.credit_paying_not_allowed_by_status: {
            $.alertHandler("", response.msg,
                alert_box_failure);
            break
        }
        default: {
            globalApplicationErrors(response, formId);
            break
        }
    }
}

function enableGlobalHandler() {
    use_global_handler = true
}

function disableGlobalHandler() {
    use_global_handler = false
}

function userProfileVerificationCodeError(formId, msg) {
    $.displayErrors(formId, {"verification_code": msg})
}

function verificationTargetErrors(formId, msg, success) {
    if (success) $.alertHandler(formId, msg, alert_box_success); else $.alertHandler(formId, msg, alert_box_failure)
}

function userProfileVerificationErrors(formId, msg) {
    $.alertHandler(formId, msg, alert_box_failure)
}

function passResetUserNotFound(formId, msg, data) {
    $.alertHandler(formId, msg, alert_box_failure, data)
}

function unauthorisedEmailError(formId, msg) {
    $.alertHandler(formId, msg, alert_box_failure)
}

function resetPassTwoFactorFailed() {
    $(".step:visible").hide();
    $("#reset-view3,#failed-auth").show();
    formId = $(".step:visible form").attr("id");
    $("#btn-method-skip").text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS).addClass("button expand warning").removeClass("link").blur();
    initializeNextForm()
}

function passwordVerificationErrors(formId, msg) {
    $.alertHandler(formId, msg, alert_box_failure)
}

function setMobileResetErrors(formId, msg) {
    $.alertHandler(formId, msg, alert_box_failure)
}

function invalidResetOption(msg) {
    $.alertHandler("", msg, alert_box_warning)
}

function billingProfileNotFound(msg) {
    $("#infoModal").modal_open().find(".modal-content p").text(msg)
}

function billingProfileSetDefaultProhibited(msg) {
    $.alertHandler("", msg, alert_box_failure)
}

function contactProfileNotFound(msg) {
    $("#infoModal").modal_open().find(".modal-content p").text(msg)
}

function individualTypeNameMismatch(given_name) {
    $('[name\x3d"first_name_int_ind"]').show_validation_error(given_name);
    $('[name\x3d"last_name_int_ind"]').show_validation_error(given_name)
}

function cartItemNotFound(response) {
    var not_found = response.data.not_found;
    var item = $('.item[data-cart-item-id\x3d"' + not_found + '"]');
    var prices_box = $(".prices-box");
    var domain = $('.tldResults[data-cart-item-id\x3d"' + not_found + '"], .singleResult[data-cart-item-id\x3d"' + not_found + '"]');
    $.cart.remove(not_found);
    if (item.length) item.remove();
    if (prices_box.length) {
        $("#order").text($.imperial_to_metric(response.data.check_out.totals.sub_total));
        $("#order_vat").text($.imperial_to_metric(response.data.check_out.totals.vat));
        $("#order_total").text($.imperial_to_metric(response.data.check_out.totals.grand_total))
    }
    if (domain.length) domain.find(".cart-button, .singleButtonTarget").removeClass("selected");
    if ($(".panel.specs").length) $.alertHandler("", response.msg, alert_box_failure)
}

function loginGdprApprovalRequired() {
    var form = $("#form-login-modal, #form-login");
    $("#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont").remove();
    form.find("#email, #password").closest(".row").hide();
    form.prepend('\x3cdiv id\x3d"inputs_cont"\x3e \n' + '\x3cinput id\x3d"communication_agreement" name\x3d"communication_agreement" type\x3d"hidden" value\x3d"1"\x3e \n' + '\x3cinput id\x3d"data_validity" name\x3d"data_validity" type\x3d"hidden" value\x3d"1"\x3e \n' +
        '\x3cinput id\x3d"processing_approval" name\x3d"processing_approval" type\x3d"hidden" value\x3d"1"\x3e \n' + '\x3cinput id\x3d"newsletter_hidden" name\x3d"newsletter" type\x3d"hidden" value\x3d"0"\x3e \n' + "\x3c/div\x3e");
    form.prepend('\x3cdiv id\x3d"newsletter_cont" class\x3d"row"\x3e\n' + '            \x3cdiv class\x3d"large-12 columns agree-terms"\x3e\n' + '                \x3cdiv class\x3d"checkbox"\x3e\n' + '                    \x3clabel class\x3d"text-left"\x3e\n' + '                        \x3cinput id\x3d"newsletter_dial" name\x3d"newsletter_dial" type\x3d"checkbox" value\x3d"1"\x3e\n' +
        '                        \x3cspan class\x3d"checkbox__label"\x3e' + $.translate("gdpr.login.newsletter_label") + "\x3c/span\x3e\n" + "                    \x3c/label\x3e\n" + "                \x3c/div\x3e\n" + "            \x3c/div\x3e\n" + "        \x3c/div\x3e");
    form.prepend('\x3cdiv id\x3d"agreement_cont" class\x3d"row"\x3e\n' + '            \x3cdiv class\x3d"large-12 columns agree-terms"\x3e\n' + '                \x3cdiv class\x3d"checkbox"\x3e\n' + '                    \x3clabel class\x3d"text-left"\x3e\n' + '                        \x3cinput id\x3d"agreement" class\x3d"gdpr_approvals" data-validate\x3d"terms_and_conditions" data-validate-error-msg\x3d"' +
        $.translate("gdpr.login.accept_all_above_label_error") + '" data-sibling-class\x3d"checkbox__label" name\x3d"agreement" type\x3d"checkbox" value\x3d"1"\x3e\n' + '                        \x3cspan class\x3d"checkbox__label"\x3e' + $.translate("gdpr.login.accept_all_above_label") + "\x3c/span\x3e\n" + "                    \x3c/label\x3e\n" + "                \x3c/div\x3e\n" + "            \x3c/div\x3e\n" + "        \x3c/div\x3e");
    form.prepend('\x3cdiv id\x3d"agreement_list_cont" class\x3d"row"\x3e\n' + '            \x3cdiv class\x3d"large-12 right columns"\x3e\n' +
        '                \x3cul class\x3d"global-list"\x3e\n' + "                    \x3cli\x3e" + $.translate("gdpr.login.processing_approval_label") + "\x3c/li\x3e\n" + "                    \x3cli\x3e" + $.translate("gdpr.login.data_validity_label") + "\x3c/li\x3e\n" + "                    \x3cli\x3e" + $.translate("gdpr.login.communication_agreement_label") + "\x3c/li\x3e\n" + "                \x3c/ul\x3e\n" + "            \x3c/div\x3e\n" + "        \x3c/div\x3e");
    form.prepend('\x3cdiv id\x3d"explanation_cont"\x3e' + $.translate("gdpr.login.explanation") +
        "\x3c/div\x3e");
    form.prepend('\x3cdiv id\x3d"info_cont" class\x3d"alert-box info"\x3e\x3cp class\x3d"no-margin-bottom smallest small-font"\x3e\x3cstrong\x3e' + $.translate("gdpr.login.explanation_title") + "\x3c/strong\x3e\x3c/p\x3e\x3c/div\x3e");
    if (window.location.href.match(/http(s)?:\/\/my/) == null) {
        form.addClass("with-scroll");
        $("#explanation_cont li").css({"margin-bottom": "0.5rem", "line-height": "1.3"})
    } else {
        $("#explanation_cont li").css("margin-bottom", "0.5rem");
        $("#explanation_cont ul").css("font-size",
            "")
    }
    $("#login_btn").translate("misc.acceptance");
    form.closest("div").find("hr:last").hide();
    $("#passResetLink").hide();
    if (gdpr_built == false) {
        $.observers.register("register_forms", function (mutations) {
            if (typeof $loginErrors == "undefined" || $loginErrors == null) {
                $("#inputs_cont, #newsletter_cont, #agreement_cont, #agreement_list_cont, #explanation_cont, #info_cont").remove();
                form.find("#email, #password").val("").closest(".row").show();
                form.closest("div").find("hr:last").show();
                $("#passResetLink").show();
                form.removeClass("with-scroll");
                $("#login_btn").translate("misc.login").removeClass("disabled");
                gdpr_built = false
            }
        });
        $.observers.observe("register_forms", $("#register-forms, #panel1"), {
            attributes: true,
            attributeFilter: ["class"]
        })
    }
    gdpr_built = true;
    setTimeout(function () {
        $loginErrors = null
    }, 500)
}

function killDisplays(no_trigger, error_code) {
    message = $("#alertContainer");
    set_error_code = message.attr("data-error-code");
    if (set_error_code && error_code && set_error_code == error_code) return;
    if (message.is(":visible")) {
        clearTimeout(timeOut);
        $("#alertContainer").slideUp("default", function () {
            if (!no_trigger) clearAlertNotice(error_code)
        })
    } else if (!no_trigger) clearAlertNotice(error_code);
    if (!no_trigger) $("#alertContainer").removeAttr("data-error-code")
}

function shutter(adelay, aslide) {
    if (aslide === undefined || aslide == "") aslide = 400; else if (aslide == "slow") aslide = 800; else if (aslide == "medium") aslide = 400; else if (aslide == "fast") aslide = 200;
    if (adelay === undefined || adelay == "") adelay = 0; else if (adelay == "slow") adelay = 800; else if (adelay == "medium") adelay = 400; else if (adelay == "fast") adelay = 200;
    timeOut = setTimeout(function () {
        $("#alertContainer").removeAttr("data-error-code", "").slideUp(aslide)
    }, adelay)
}

function displayAlertMessages(formid, myMessage, messageType, data, error_code, outerShutter, element) {
    if (alert["control"]) {
        if (outerShutter === undefined || outerShutter == "") outerShutter = false;
        $("#message").remove();
        if (messageType == "" || messageType === undefined) messageType = alert_box_warning;
        if (myMessage == "" || myMessage === undefined) myMessage = APP_LANG.MESSAGES.ERROR;
        $("#alertMessage").addClass(messageType);
        $("#alertMessage .icon-announcement").after("\x3cspan id\x3d'message'\x3e" + myMessage + "\x3c/span\x3e");
        $("#alertContainer").slideDown(700);
        if (error_code) $("#alertContainer").attr("data-error-code", error_code);
        if (outerShutter == false) shutter(alert_visibility_duration, 700);
        $("button.disabled").removeClass("disabled", function () {
            if ((element !== undefined || element !== "") && alert == alert_box_success) $(element).remove();
            if (data === false || data === undefined || data === "") if (formid !== undefined || formid !== "") displayErrorInputMessages(formid, data)
        });
        if ($.isTouch()) $(window).scrollTop($(window).scrollTop() + 30);
        displayErrorInputMessages(formid, data);
        alertType =
            messageType
    }
}

function displayErrorInputMessages(form, errorsInput) {
    if (typeof errorsInput == "undefined") return;
    form = $("#" + form);
    $.each(errorsInput, function (i, value) {
        if (Object.keys(custom_selectors_apply).length > 0 && i in custom_selectors_apply) element = custom_selectors_apply[i](); else element = form.find('[name\x3d"' + i + '"]');
        target = false;
        if (element.length < 1) {
            var elements = form.find('[name^\x3d"' + i + '."]');
            if (elements.length) {
                element = elements.filter(":last");
                var parent = element.closest(".row");
                parent.after(alert_help_box);
                $(parent.parents()[0]).find(".alert-box.help-block:last").text(errorsInput[i])
            }
            return
        }
        if (element.length >
            1) element = element.filter(function () {
            var obj = $(this);
            if (obj.is("select")) return $("#" + obj.attr("id") + "_chosen").css("display") != "none"; else return obj.css("display") != "none"
        });
        if (element.is("select")) {
            element.addClass("error");
            chosen = form.find("#" + element.attr("id") + "_chosen");
            if (chosen.length) target = chosen; else element.parent("div").find(".form-error").css({"margin-top": 0})
        } else target = element;
        if (target) {
            if (typeof target == "object") target = target[0];
            target = $(target);
            if (target.hasClass("switch-controller")) target =
                $('[for\x3d"' + target.attr("id") + '"]');
            if (typeof errorsInput[i] == "string") target.after(helperBlock.replace("errorMessage", errorsInput[i])); else $.each(errorsInput[i], function (key, value) {
                target.after(helperBlock.replace("errorMessage", value))
            });
            parent = target.addClass("error").parent("div");
            parent.children("label").addClass("error");
            var block = parent.find(".help-block:not(:last)");
            if (block.length) block.css("margin-bottom", 0)
        }
        form.find('[for\x3d"' + i + '"]').addClass("error")
    });
    $(".form-error").addClass("error")
}

function displayIndividualInputErrors(element, error) {
    element.addClass("error");
    var chosen = $("#" + element.attr("id") + "_chosen");
    if (chosen.length) var label = chosen.addClass("error").after(helperBlock.replace("errorMessage", error)).parent("div").children("label"); else label = element.after(helperBlock.replace("errorMessage", error)).parent("div").children("label");
    if (label.length < 1) label = $('label[for\x3d"' + element.attr("id") + '"]');
    label.addClass("error")
}

function removeErrors() {
    $(".myErrorLabel").removeClass("myErrorLabel").removeClass("error");
    $("select.error").each(function () {
        $(this).closest("div").find('[id*\x3d"_chosen"]').addClass("error")
    })
}

function clearAlertNotice(error_code) {
    $("#loaderContainer").hide();
    $("#alertMessage").removeClass(alertType);
    $("#alertContainer").removeAttr("data-error-code");
    displayAlertMessages(alert["formid"], alert["mssg"], alert["alert"], alert["data"], error_code, alert["outerShutter"])
};
$(document).ready(function () {
    function cart_inc() {
        var text = get_active_items().length;
        if (text) {
            cart_badge.css({"visibility": "visible", "opacity": 1}).text(text).addClass("heartbit");
            $("#cart_badge_sidr, #sidCartBadge, #bottomCartBadge").text(text).addClass("heartbit");
            $("#mobile-nav .badge").css({"visibility": "visible", "opacity": 1}).text(text).addClass("heartbit");
            if (badgeHeartBit == null) badgeHeartBit = setTimeout(function () {
                cart_badge.removeClass("heartbit");
                $("#cart_badge_sidr, #sidCartBadge, #bottomCartBadge, #mobile-nav .badge").removeClass("heartbit");
                badgeHeartBit = null
            }, 7E3);
            var $sideCartCont = $("#sideCartCont");
            $("#empty_cart, #emptySideCart").hide();
            $("#go_to_cart, #sideCartGoTo, #bottomCartBadge").show();
            $("#btmNavCont").removeClass("hidden");
            $sideCartCont.removeClass("empty");
            sideCartVisibility(function () {
                if (sidCartVisibility) {
                    if (typeof $openCartTimer != "undefined") clearTimeout($openCartTimer);
                    $openCartTimer = setTimeout(function () {
                        if ($sideCartCont.length) {
                            if (typeof $clearCartCont != "undefined") clearTimeout($clearCartCont);
                            $sideCartCont.addClass("w-shadow active");
                            var $itemsCont = $sideCartCont.find(".wrapper .cart-items");
                            $itemsCont.animate({scrollTop: $itemsCont.find("li:last").offset().top});
                            $clearCartCont = setTimeout(function () {
                                $sideCartCont.removeClass("active").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                                    $sideCartCont.removeClass("w-shadow");
                                    $sideCartCont.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend")
                                })
                            }, 5E3)
                        }
                    }, 100)
                }
            });
            $("#cart_badge_sidr").show()
        } else cart_dec()
    }

    function cart_dec() {
        var text = get_active_items().length;
        cart_badge.text(text);
        $("#cart_badge_sidr, #sidCartBadge, #bottomCartBadge, #mobile-nav .badge").text(text);
        if (text == 0) {
            cart_badge.css({"visibility": "hidden", "opacity": 0});
            $("#mobile-nav .badge").css({"visibility": "hidden", "opacity": 0});
            $("#empty_cart, #emptySideCart").show();
            $("#go_to_cart, #sideCartGoTo, #bottomCartBadge").hide();
            $("#sideCartCont").addClass("empty");
            $("#cart_badge_sidr").hide();
            sidCartVisibility = false;
            sideCartVisibility()
        }
    }

    function remove_item_request(item) {
        var item_id = item.attr("data-cart-item-id");
        var domain_button = $('.tldResults[data-cart-item-id\x3d"' + item_id + '"]').find(".cart-button");
        var single_domain_button = $('.singleResult[data-cart-item-id\x3d"' + item_id + '"]').find(".singleButtonTarget");
        var resp_button = $('.responsiveTableRow .button[data-cart-item-id\x3d"' + item_id + '"]');
        var idProtect = $('#addIdProtect[data-cart-item-id\x3d"' + item_id + '"]');
        var domain_renew = $('#domainRenew[data-cart-item-id\x3d"' + item_id + '"]');
        var ssl_renew = $('#sslRenew[data-cart-item-id\x3d"' + item_id + '"]');
        var resp_button_id_protect = $('.id_icon_action[data-cart-item-id\x3d"' + item_id + '"]');
        $("body").trigger("remove_item_request", [item_id]);
        if (domain_button.length) domain_button.removeClass("selected");
        if (single_domain_button.length) single_domain_button.removeClass("selected");
        if (resp_button.length) {
            resp_button.removeClass("in-cart");
            var submitText = resp_button.find(".submitText");
            if (submitText.length) submitText.text(COMMON_LANG.RESP_TABLE.RENEW);
            else resp_button.text(COMMON_LANG.RESP_TABLE.RENEW)
        }
        if (idProtect.length) {
            idProtect.removeClass("in-cart");
            submitText = idProtect.find(".submitText");
            if (submitText.length) submitText.text(idProtect.hasClass("renew") ? COMMON_LANG.DOMAINS.WHOIS.EXTEND : COMMON_LANG.CART.BUY_SERVICE); else idProtect.text(idProtect.hasClass("renew") ? COMMON_LANG.DOMAINS.WHOIS.EXTEND : COMMON_LANG.CART.BUY_SERVICE)
        }
        if (domain_renew.length) domain_renew.removeClass("hide-important");
        if (ssl_renew.length) ssl_renew.removeClass("hide-important");
        if (resp_button_id_protect.length) resp_button_id_protect.removeClass("in-cart").text(COMMON_LANG.CART.BUY_SERVICE);
        if ($(".cart_step").length) $.ajax($.ajax_get_flavor({
            data: {"_token": $('[name\x3d"_token"]').val(), unique_id: unique_page_identifier},
            success: function (data) {
                data.data.instance = this;
                if (data.success) {
                    reCreateCartSummary(data.data);
                    if (app_env != "local" && "remarketing_items" in data.data) $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items)
                } else {
                    $.cart_loaders.remove_pending_delete(this.triggered_item);
                    $.alertHandler("", data.msg, alert_box_failure);
                    if (typeof data.data == "object" && "items" in data.data) reCreateCartSummary(data.data); else if (data.code == error_codes.cart_not_found) {
                        $(".cart_step, .steps").hide();
                        $(".cart-icon-msg").show()
                    }
                }
            },
            complete: function () {
            },
            url: delete_item_url.replace("##id##", item.attr("data-cart-item-id")),
            type: "POST",
            triggered_item: '[data-cart-item-id\x3d"' + item.attr("data-cart-item-id") + '"]'
        }, "cart_delete")); else $.ajax({
            timeout: 3E4, data: {
                "_token": $('[name\x3d"_token"]').val(),
                unique_id: unique_page_identifier
            }, error: function (e) {
                globalErrorsHandler(e);
                if ($("#product-summary").length < 1) {
                    item.cart_show();
                    $("body").trigger("remove_item_failed", [item_id]);
                    if (domain_button.length) domain_button.addClass("selected");
                    if (single_domain_button.length) single_domain_button.addClass("selected");
                    if (resp_button.length) {
                        resp_button.addClass("in-cart");
                        var submitText = resp_button.find(".submitText");
                        if (submitText.length) submitText.text(COMMON_LANG.CART.IN_CART); else resp_button.text(COMMON_LANG.CART.IN_CART)
                    }
                    if (idProtect.length) {
                        idProtect.removeClass("in-cart");
                        submitText = idProtect.find(".submitText");
                        if (submitText.length) submitText.text(COMMON_LANG.CART.IN_CART); else idProtect.text(COMMON_LANG.CART.IN_CART)
                    }
                    if (domain_renew.length) domain_renew.addClass("hide-important");
                    if (ssl_renew.length) ssl_renew.addClass("hide-important");
                    if (resp_button_id_protect.length) resp_button_id_protect.addClass("in-cart").text(COMMON_LANG.CART.IN_CART)
                }
            }, success: function (data) {
                if (data.success) if ($(".cart_step").length) {
                    reCreateCartSummary(data.data);
                    if (app_env != "local" && "remarketing_items" in
                        data.data) $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items)
                } else {
                    $("body").trigger("remove_item_success", [item_id]);
                    if (item.hasClass("cross_sale")) {
                        var product = item.closest(".item").find('li:has(.add_cross_sell[data-cross-product-id\x3d"' + item.attr("data-product-id") + '"])');
                        var cont = product.closest(".wrapper");
                        product.show();
                        var sales = cont.find("li:has(.add_cross_sell)").filter(function () {
                            return $(this).css("display") != "none"
                        });
                        manage_sales(sales, cont);
                        item.prev("hr").remove()
                    }
                    if (item.is("li")) $('li[data-cart-item-id\x3d"' +
                        item.attr("data-cart-item-id") + '"]').remove(); else item.remove();
                    var product_summary = $("#product-summary");
                    if (product_summary.length && product_summary.find(".item").length < 1) {
                        $(".cart-icon-msg").show();
                        $(".steps, #product-summary").hide()
                    }
                    cart_dec();
                    if (typeof data.data == "object" && "checkout" in data.data) {
                        var prices = data.data.checkout.totals;
                        $(".checkout_order_price").attr("data-target", prices.sub_total).text($.imperial_to_metric(prices.sub_total));
                        $(".checkout_order_vat").text($.imperial_to_metric(prices.vat));
                        updateOrderTotalVat(prices.sub_total, prices.grand_total);
                        execution_time.delete = data.data.execution_time;
                        service_time.delete = data.data.service_time
                    }
                    if ("deleted_items" in data.data) $.each(data.data.deleted_items, function (key, item_id) {
                        var item = $('li[data-cart-item-id\x3d"' + item_id + '"]');
                        if (item.length) {
                            item.remove();
                            cart_dec()
                        }
                    });
                    var transferCart = $("#toCartGroup");
                    if (transferCart.length) transferCart.find('[data-cart-item-id\x3d"' + data.msg.cart_item_id + '"]').remove();
                    process_checkout_settings(data.data.checkout);
                    try {
                        if (typeof dependencies != "undefined" && !$.isEmptyObject(dependencies.domains_in_cart)) {
                            var domains = Object.keys(dependencies.domains_in_cart);
                            $.each(domains, function (key, value) {
                                if (dependencies.domains_in_cart[value].cart_item_id == item_id) delete dependencies.domains_in_cart[value]
                            })
                        }
                    } catch (er) {
                    }
                    if (app_env != "local" && "remarketing_items" in data.data) $.sendRemoveFromCartRemarketingEvent(data.data.remarketing_items)
                } else if ($("#product-summary").length) {
                    $.alertHandler("", data.msg, alert_box_failure);
                    if (typeof data.data ==
                        "object" && "items" in data.data) reCreateCartSummary(data.data); else if (data.code == error_codes.cart_not_found) {
                        $(".cart_step, .steps").hide();
                        $(".cart-icon-msg").show()
                    }
                } else {
                    item.cart_show();
                    $("body").trigger("remove_item_failed", [item_id]);
                    if (domain_button) domain_button.addClass("selected");
                    if (resp_button.length) {
                        resp_button.addClass("in-cart");
                        var submitText = resp_button.find(".submitText");
                        if (submitText.length) submitText.text(COMMON_LANG.CART.IN_CART); else resp_button.text(COMMON_LANG.CART.IN_CART)
                    }
                    if (idProtect.length) {
                        idProtect.removeClass("in-cart");
                        submitText = idProtect.find(".submitText");
                        if (submitText.length) submitText.text(COMMON_LANG.CART.IN_CART); else idProtect.text(COMMON_LANG.CART.IN_CART)
                    }
                    if (domain_renew.length) domain_renew.addClass("hide-important");
                    if (ssl_renew.length) ssl_renew.addClass("hide-important");
                    if (resp_button_id_protect.length) resp_button_id_protect.addClass("in-cart").text(COMMON_LANG.CART.IN_CART);
                    globalApplicationErrors(data, "")
                }
            }, url: delete_item_url.replace("##id##", item.attr("data-cart-item-id")), type: "POST"
        });
        $("body").trigger("cart-item:removed",
            {"item": item_id})
    }

    function get_active_items() {
        return cart_list.find("li").filter(function () {
            return $(this).css("display") != "none"
        })
    }

    function cart_view_insert(data) {
        var checkout = data.msg.checkout;
        if ("cart_item" in data.msg) {
            var cart_item = data.msg.cart_item;
            if (data.msg.parent) {
                insert_sale(data.msg.parent, data.msg.cart_item);
                updateCheckoutPrices(checkout, "create", data.msg.execution_time);
                return
            }
            var $item_name = "name_full" in cart_item ? cart_item.name_full : cart_item.name;
            cart_item_list.find(".footer").before($("#general_item_temp").html().replace(/##itemid##/g,
                cart_item.id).replace("##itemname##", $item_name).replace("##action##", cart_item.sub_name).replace("##itemprice##", $.imperial_to_metric(cart_item.billing.price.total)));
            var new_item = cart_item_list.find(".item:last");
            var cross_cont = new_item.find(".cross_cont");
            var row = cross_cont.closest(".row");
            var duration = new_item.find(".item_duration");
            if ("promo" in cart_item.billing.price && typeof cart_item.billing.price.promo == "number" && cart_item.billing.price.promo != cart_item.billing.price.base) new_item.find(".price").addClass("discount").html(promoPrices.replace("##previousPrice##",
                $.imperial_to_metric(cart_item.billing.price.base)).replace("##newPrice##", $.imperial_to_metric(cart_item.billing.price.promo)));
            if ("registry_name" in cart_item) new_item.attr("data-registry", cart_item.registry_name);
            cart_view_inform_new_item(new_item, cart_item);
            cart_view_inform_new_lengths(duration, cart_item);
            cart_append_cross_sells(new_item, cart_item);
            cart_append_ssl_settings(new_item, cart_item);
            if (cart_item.sku.indexOf("ssl_install") > -1) {
                new_item.find(".ssl-configure").remove();
                if ("domain" in cart_item.user_attributes) {
                    new_item.append($("#ssl_installation_required_domain_set_for_stand_alone").html().replace(/##domain##/g,
                        cart_item.user_attributes.domain));
                    if ("common_name_fixed" in cart_item) new_item.find(".edit_stand_alone_installation").remove()
                } else new_item.append($("#ssl_installation_required_domain_for_stand_alone").html().replace(/##id##/g, cart_item.id));
                if ("san_domains" in cart_item && cart_item.san_domains > 0) new_item.find(".stand-alone-ssl-installation").closest(".row").remove()
            }
            if (Object.keys(cart_warnings).length) if ("hosting_warning" in cart_warnings && data.msg.cart_item.type.indexOf("hosting") > -1) new_item.find(".description").append('\x3cdiv class\x3d"cart-item-msg"\x3e\x3cspan\x3e' +
                $.translate("cart.warnings.hosting") + "\x3c/span\x3e\x3c/div\x3e");
            if ("up_sells" in cart_item) {
                var new_panel = new_item.append('\x3cdiv class\x3d"actions-panel"\x3e\x3c/div\x3e').find(".actions-panel:last");
                var up_sell_temp = $("#general_item_temp").html();
                $.each(cart_item.up_sells, function (key, value) {
                    var $upsell_data = upsells[key];
                    var explanations = "";
                    var requiredInfo = "";
                    if (data.msg.cart_item.type == "ssl") explanations = $("#ssl_" + data.msg.cart_item.validation_type.toLowerCase() + "_installation_explanations").html().replace(/##itemId##/g,
                        data.msg.cart_item.id);
                    if (cart_item["type"] == "ssl" && cart_item["children_up_sell"].length) {
                        var totalDomains = 1;
                        var additionalDomains = null;
                        additionalDomains = $.grep(cart_item["settings"], function (obj) {
                            return obj.name == "additional_domains"
                        });
                        if (!!additionalDomains && additionalDomains.length) totalDomains = additionalDomains[0].vendor_settings.maximum;
                        if (totalDomains == 1) requiredInfo = $("#ssl_installation_required_domain").html().replace(/##id##/g, cart_item["children_up_sell"][0])
                    }
                    new_panel.append('\x3chr class\x3d"big-inner-margin"\x3e');
                    new_panel.append($("#up_sell_temp").html().replace(/##productid##/g, $upsell_data.product_id).replace(/##parentid##/g, new_item.attr("data-cart-item-id")).replace(/##productSku##/g, $upsell_data.product_sku).replace(/##itemnameadd##/g, $upsell_data.name_add).replace(/##itemname##/g, $upsell_data.name).replace(/##explanations##/g, explanations).replace(/##requiredInfo##/g, requiredInfo).replace(/##itemtitle##/g, $upsell_data.title).replace(/##action##/g, $upsell_data.desc).replace(/##itemprice##/g, $.imperial_to_metric($upsell_data.price_out.setup_fee)));
                    if ("promo" in $upsell_data.price_out && typeof $upsell_data.price_out.promo == "number" && $upsell_data.price_out.promo != $upsell_data.price_out.setup_fee) new_panel.find(".price").addClass("discount").html(promoPrices.replace("##previousPrice##", $.imperial_to_metric($upsell_data.price_out.setup_fee)).replace("##newPrice##", $.imperial_to_metric($upsell_data.price_out.promo)))
                })
            }
            return new_item
        }
        if ("add_on" in data.msg) {
            var upsell = $('.item[data-cart-item-id\x3d"' + data.msg.add_on.parent + '"]').find('[data-product-id\x3d"' +
                data.msg.add_on.product + '"]').attr("data-cart-item-id", data.msg.add_on.id).prop("checked", true).closest(".up_sell");
            upsell.find(".add_label").hide();
            upsell.find(".service_in_cart").show();
            upsell.find(".up_sell_price").show()
        }
    }

    function cart_view_inform_new_item(new_item, cart_item) {
        if ("promo" in cart_item.billing.price && cart_item.billing.price.promo != null && cart_item.billing.price.promo != 0) new_item.find(".product .description strong").addClass("discount");
        if (cart_item.type == "domain") {
            new_item.attr("data-group",
                "domains");
            fixDomainObjects(new_item, cart_item)
        } else if (cart_item.type.indexOf("hosting") > -1) new_item.attr("data-group", "hosting"); else if (cart_item.sku.indexOf("ssl_install") > -1) new_item.attr("data-group", "ssl_installation"); else new_item.attr("data-group", "ssl");
        if (cart_item.type.indexOf("vps") < 0 && cart_item.type.indexOf("dedi") < 0) {
            new_item.find(".configure").remove();
            if (cart_item.type == "domain" && cart_item.rgp === true) new_item.find(".set-up-price").html($.translate("cart.rgp_setup_fee") + ':\x3cspan class\x3d"set_up_fee"\x3e' +
                $.imperial_to_metric(cart_item.billing.price.setup_fee) + "\x3c/span\x3e \x3cspan\x3e€\x3c/span\x3e"); else new_item.find(".set-up-price").remove()
        } else {
            new_item.find(" \x3e div:eq(0)").after($("#item_options_temp").html());
            new_item.find(".configure").attr("href", cart_edit.replace("##id##", cart_item.id));
            new_item.find(".delete").attr("href", cart_delete.replace("##id##", cart_item.id));
            if (cart_item.type.indexOf("vps") > -1) {
                var conf_to_use = configs.vps;
                if (cart_item.type.indexOf("linux") > -1) conf_to_use = conf_to_use.linux;
                else conf_to_use = conf_to_use.windows;
                new_item.find(".set-up-price").remove()
            } else {
                var setupFeeCont = new_item.find(".set_up_fee");
                if (cart_item.type.indexOf("semi") < 0) {
                    if (typeof cart_item.billing.price.setup_fee != "undefined") {
                        if (setupFeeCont.length < 1) {
                            new_item.find(".current-price").after('\x3cspan class\x3d"set-up-price"\x3e' + $.translate("misc.setup_fee") + ':\x3cspan class\x3d"set_up_fee"\x3e0\x3c/span\x3e \x3cspan\x3e€\x3c/span\x3e\x3c/span\x3e');
                            setupFeeCont = new_item.find(".set_up_fee")
                        }
                        setupFeeCont.text($.imperial_to_metric(cart_item.billing.price.setup_fee))
                    } else new_item.find(".set-up-price").remove();
                    conf_to_use = configs.dedicated;
                    if (cart_item.type.indexOf("greece") > -1) conf_to_use = conf_to_use.greece; else conf_to_use = conf_to_use.germany
                } else {
                    conf_to_use = configs.semi.france;
                    if (typeof cart_item.billing.price.setup_fee != "undefined") {
                        if (setupFeeCont.length < 1) {
                            new_item.find(".current-price").after('\x3cspan class\x3d"set-up-price"\x3e' + $.translate("misc.setup_fee") + ':\x3cspan class\x3d"set_up_fee"\x3e0\x3c/span\x3e \x3cspan\x3e€\x3c/span\x3e\x3c/span\x3e');
                            setupFeeCont = new_item.find(".set_up_fee")
                        }
                        setupFeeCont.text($.imperial_to_metric(cart_item.billing.price.setup_fee))
                    } else new_item.find(".set-up-price").remove()
                }
            }
            cart_view_insert_build_options_user_attributes(new_item,
                cart_item, conf_to_use)
        }
    }

    function cart_view_insert_build_options_user_attributes(new_item, cart_item, conf_to_use) {
        var newConf = Object.assign({}, conf_to_use).array_except("management");
        var categories_count = Object.keys(newConf).length - 1;
        var cont = new_item.find(".specs-panel").find(".in-list");
        var opt_cont = cont.html();
        var list_eq = 0;
        if (cart_item.type != "hosting-dedi") {
            for (var i$jscomp$0 = 1; i$jscomp$0 <= categories_count; i$jscomp$0++) cont.append(opt_cont);
            $.each(newConf, function (key, assets) {
                var list = cont.find(".columns:eq(" +
                    list_eq + ")");
                list.find(".lead").text(COMMON_LANG.CART[key.toUpperCase()]);
                list = list.find("ul");
                $.each(assets, function (assetIndex, asset) {
                    var text = "-";
                    if (asset in cart_item.user_attributes) text = cart_item.user_attributes[asset]; else {
                        var option = $.grep(cart_item.options, function (i) {
                            return i.name == asset
                        });
                        if (option.length) {
                            if ("name" in option[0].selected) {
                                type = "option";
                                text = option[0].selected.name
                            }
                        } else {
                            var attr = $.grep(cart_item.attributes, function (i) {
                                return i.name == asset
                            });
                            if (attr.length) {
                                type = "attribute";
                                if ("locale" in attr[0].selected && !!attr[0].selected.locale) text = attr[0].selected.locale; else text = attr[0].selected.name;
                                if (cart_item.type.indexOf("semi") > -1 && asset == "entry_processes") text = attr[0].selected.extra_settings.amount
                            }
                        }
                    }
                    list.append('\x3cli data-opt-name\x3d"' + asset + '"\x3e\x3cspan class\x3d"spec"\x3e' + COMMON_LANG.CART[asset.toUpperCase()] + ':\x3c/span\x3e \x3cspan class\x3d"spec-value"\x3e' + text + "\x3c/span\x3e\x3c/li\x3e")
                });
                list_eq++
            });
            cont.find(".columns:eq(" + (list_eq - 1) + ")").addClass("end");
            $.each(cart_item.options, function (key, value) {
                if (cart_item.sku.indexOf("semi") > -1 && value.name == "ram") value.name = "ram_semidedi";
                var opt = new_item.find('[data-opt-name\x3d"' + value.name + '"]');
                opt.find(".spec-value").text(value.selected.name)
            });
            if ("hostname" in cart_item.user_attributes && !!cart_item.user_attributes.hostname) new_item.find(".serverHostName").text(cart_item.user_attributes.hostname)
        } else {
            cont.empty();
            var contHtml = opt_cont;
            var features = Object.assign({}, dedi_format.features).array_except("management");
            for (i$jscomp$0 in features) if (features.hasOwnProperty(i$jscomp$0)) {
                cont.append(contHtml.replace("##opt_category##", COMMON_LANG.CART[i$jscomp$0.toUpperCase()]));
                var list = cont.find("ul:last");
                list.closest(".columns").toggleClass("large-6 large-4");
                for (var j in features[i$jscomp$0]) if (features[i$jscomp$0].hasOwnProperty(j)) {
                    var type = "";
                    var name = "";
                    var optionName = features[i$jscomp$0][j];
                    var option = $.grep(cart_item.options, function (i) {
                        return i.name == optionName
                    });
                    if (option.length) {
                        if ("name" in option[0].selected) {
                            type =
                                "option";
                            name = option[0].selected.name
                        }
                    } else {
                        var attr = $.grep(cart_item.attributes, function (i) {
                            return i.name == optionName
                        });
                        if (attr.length) {
                            type = "attribute";
                            name = attr[0].selected.name
                        }
                    }
                    if (optionName == "bandwidth" || optionName == "traffic") optionName += "_dedi";
                    if (name) {
                        list.append('\x3cli data-opt-name\x3d"' + optionName + '"\x3e\x3cspan class\x3d"spec"\x3e' + COMMON_LANG.CART[optionName.toUpperCase()] + ':\x3c/span\x3e \x3cspan class\x3d"spec-value"\x3e' + name + "\x3c/span\x3e\x3c/li\x3e");
                        if (type == "option" && "extensions" in
                            option[0].selected) for (var k in option[0].selected.extensions) if (option[0].selected.extensions.hasOwnProperty(k)) list.append('\x3cli\x3e\x3cspan class\x3d"spec"\x3eΕπέκταση ' + name + ':\x3c/span\x3e \x3cspan class\x3d"spec-value"\x3e' + option[0].selected.extensions[k].name + "\x3c/span\x3e\x3c/li\x3e")
                    }
                }
            }
            if ("hostname" in cart_item.user_attributes && !!cart_item.user_attributes.hostname) cont.closest(".specs-panel").find(".serverHostName").text(cart_item.user_attributes.hostname)
        }
    }

    function cart_view_inform_new_lengths(duration,
                                          cart_item) {
        if (cart_item.billing.all_lengths && Object.keys(cart_item.billing.all_lengths).length) {
            duration.find("button").text(create_length_string(cart_item.billing.length.selected));
            duration = duration.find("ul");
            duration.empty();
            if ("base_per_interval" in cart_item.billing.all_lengths) duration.addClass("discount");
            var $minLength = cart_item.billing.length.valid[0];
            var $lengthInterval = $minLength < 12 ? ($minLength > 1 ? $minLength : "") + " " + $.translate("LENGTH.MONTH", $minLength) : ($minLength / 12 > 1 ? $minLength / 12 : "") +
                " " + $.translate("LENGTH.YEAR", $minLength / 12);
            if (["sha_win_pro", "sha_lin_pro"].indexOf(cart_item["sku"]) > -1) cart_item.billing.all_lengths.total_per_interval = {1: cart_item.billing.all_lengths.total_per_interval[1]};
            var billingLengths = cart_item.billing.all_lengths;
            if (cart_item.type == "domain" && cart_item.rgp === true) {
                var firstLength = Object.keys(billingLengths.total_per_interval)[0];
                var firstLengthValue = billingLengths.total_per_interval[firstLength];
                billingLengths.total_per_interval = {};
                billingLengths.total_per_interval[firstLength] =
                    firstLengthValue
            }
            $.each(billingLengths.total_per_interval, function (key, value) {
                var currentPrice = value.toFixed(2) + " € / " + $lengthInterval;
                if (typeof cart_item.billing.all_lengths.base_per_interval != "undefined" && cart_item.billing.all_lengths.base_per_interval[key] != value && cart_item.billing.all_lengths.base_per_interval[key] > value) currentPrice = '\x3cs class\x3d"strikethrough"\x3e\x3cspan\x3e' + cart_item.billing.all_lengths.base_per_interval[key] + " €\x3c/span\x3e\x3c/s\x3e" + currentPrice;
                duration.append('\x3cli class\x3d"length"\x3e' +
                    '\x3ca href\x3d"#" class\x3d"item_length" data-length\x3d"' + key + '"\x3e' + create_length_string(key) + '\x3cdiv class\x3d"price-per-length right"\x3e' + currentPrice + "\x3c/div\x3e" + "\x3c/a\x3e" + "\x3c/li\x3e")
            });
            duration.find('[data-length\x3d"' + cart_item.billing.length.selected + '"]').closest(".length").addClass("active")
        } else duration.remove()
    }

    function cart_inform_checkout_prices(checkout) {
        $(".checkout_order_price").attr("data-target", checkout.totals.sub_total).text($.imperial_to_metric(checkout.totals.sub_total));
        $(".checkout_order_vat").text($.imperial_to_metric(checkout.totals.vat));
        updateOrderTotalVat(checkout.totals.sub_total, checkout.totals.grand_total)
    }

    function cart_append_cross_sells(new_item, cart_item) {
        if (cart_item["type"] == "domain") {
            item_classes_clear("other_only_", "domain_only_", new_item);
            new_item.find(".other_remove").removeClass("other_remove")
        } else {
            item_classes_clear("domain_only_", "other_only_", new_item);
            new_item.find(".other_remove").remove()
        }
        if (Object.keys(cart_item.cross_sells).length) {
            var sales_cont =
                new_item.find(".sales_remaining ul");
            $.each(cart_item.cross_sells, function (key, value) {
                var sale = $("#cross_sell_" + key + "_temp");
                if (sale.html().indexOf("id_protect") > -1 && "expired" in cart_item) return true;
                if (sale.length) sales_cont.append(sale.html().replace(/##id##/g, cart_item.id))
            });
            $(document).foundation("dropdown", "reflow");
            new_item.find(".sales_remaining li:visible:not(:eq(0))").addClass("v-line")
        } else new_item.find(".addons-panel").remove()
    }

    function cart_append_ssl_settings(new_item, cart_item) {
        if (cart_item.settings) {
            var settings_length =
                cart_item.settings.length;
            new_item.find(" \x3e .row:first").after($("#ssl_settings_temp").html());
            var settings = new_item.find(".settings");
            var setting_temp = settings.html();
            settings.empty();
            for (i = 0; i <= settings_length - 1; i++) {
                var current_settings = cart_item.settings[i];
                settings.append(setting_temp.replace("##locale##", current_settings.locale).replace("##name##", current_settings.name));
                var selected_setting = settings.find(".columns:last");
                var duration = selected_setting.find("select");
                if (current_settings.min_quantity_required &&
                    current_settings.vendor_settings.minimum) if (current_settings.min_quantity_required > current_settings.vendor_settings.minimum) var $j = current_settings.min_quantity_required; else $j = current_settings.vendor_settings.minimum; else if (current_settings.vendor_settings.minimum) $j = current_settings.vendor_settings.minimum; else if (current_settings.min_quantity_required) $j = current_settings.min_quantity_required; else $j = 0;
                for (j = $j; j <= current_settings.vendor_settings.maximum; j += "domains_per_pack" in current_settings.vendor_settings ?
                    current_settings.vendor_settings.domains_per_pack : 1) duration.append('\x3coption value\x3d"' + j + '"\x3e' + j + "\x3c/option\x3e");
                duration.val(cart_item.settings[i].quantity)
            }
            settings.find(".columns:last").addClass("end")
        }
    }

    function sort_items() {
        $.each(group_order, function (key, value) {
            $(".footer").before($('[data-group\x3d"' + value + '"]'))
        })
    }

    function manage_sales(sales, cont) {
        var item = cont.closest(".item");
        if (sales.length) cont.closest(".addons-panel").show(); else cont.closest(".addons-panel").hide();
        item.find(".sales_remaining li").removeClass("v-line");
        item.find(".sales_remaining li:visible:not(:eq(0))").addClass("v-line")
    }

    function insert_sale(itemId, data, cart_items) {
        var item = $('[data-cart-item-id\x3d"' + itemId + '"]');
        var panel = item.find(".crossSellPanel");
        var parentDomain = $.grep(cart_items, function (obj) {
            return obj.id == itemId && obj.type == "domain"
        });
        panel.append('\x3chr class\x3d"big-inner-margin"\x3e' + $("#general_item_temp").html().replace(/##itemid##/g, data.id).replace("##itemname##", "name_full" in data ? data.name_full : data.name).replace("##action##",
            data.sub_name).replace("##selected_length##", create_length_string(data.billing.length.selected)).replace("##itemprice##", $.imperial_to_metric(data.total_price ? data.total_price : data.billing.price.total)));
        var sale = panel.find(".item:last").attr("class", "cross_sale");
        if ("promo" in data.billing.price && typeof data.billing.price.promo == "number" && data.billing.price.promo != data.billing.price.base) panel.find(".price").last().addClass("discount").html(promoPrices.replace("##previousPrice##", $.imperial_to_metric(data.billing.price.base)).replace("##newPrice##",
            $.imperial_to_metric(data.billing.price.promo)));
        var duration_cont = sale.find(".duration").closest(".columns");
        var duration_html = duration_cont.html();
        duration_cont.empty();
        duration_cont.append('\x3cdiv class\x3d"cross-sell-duration"\x3e' + duration_html + "\x3c/div\x3e");
        sale.find("\x3e div:eq(1)").remove();
        sale.attr("data-product-id", data.catalog_product_id);
        sale.find(".description").addClass("big-inner-margin");
        sale.find(".configure").remove();
        sale.find(".actions-panel").remove();
        sale.find(".set-up-price").remove();
        sale.find(".addons-panel").remove();
        var duration = sale.find(".item_duration ul");
        var first_length = duration.find("li");
        var length_temp = first_length[0].outerHTML;
        var $first_length = data.billing.length.valid[0];
        var $length_trans = $first_length < 12 ? ($first_length > 1 ? $first_length + " " : "") + trans("length.month", $first_length) : ($first_length / 12 + " " ? $first_length / 12 + " " : "") + trans("length.year", $first_length / 12);
        first_length.remove();
        $.each(data.billing.length.valid, function (key, value) {
            duration.append(length_temp.replace("##length##",
                value).replace("##total_price##", data.billing.all_lengths.total[value]).replace("##length_text##", create_length_string(value)).replace("##price_per_length##", $.imperial_to_metric(data.billing.all_lengths.total_per_interval[value]) + " € / " + $length_trans))
        });
        duration.find('li:has([data-length\x3d"' + data.billing.length.selected + '"])').addClass("active");
        wrapper = sale.closest(".item").find(".wrapper");
        wrapper.find('li:has([data-cross-product-id\x3d"' + data.catalog_product_id + '"])').hide();
        sales = wrapper.find("li:has(.add_cross_sell)").filter(function () {
            return $(this).css("display") !=
                "none"
        });
        manage_sales(sales, wrapper);
        if (data.up_sells.constructor == Object) {
            var $new_action_panel = sale.append('\x3cdiv class\x3d"actions-panel medium-inner-margin"\x3e\x3c/div\x3e').find(".actions-panel:last");
            $.each(data.up_sells, function (key) {
                var $upsell_data = upsells[key];
                var explanations = "";
                var requiredInfo = "";
                if (data.type == "ssl") explanations = $("#ssl_" + data.validation_type.toLowerCase() + "_installation_explanations").html().replace(/##itemId##/g, data.id);
                if (data.type == "ssl" && data.children_up_sell.length) {
                    var totalDomains =
                        1;
                    var additionalDomains = null;
                    additionalDomains = $.grep(data["settings"], function (obj) {
                        return obj.name == "additional_domains"
                    });
                    if (!!additionalDomains && additionalDomains.length) totalDomains = additionalDomains[0].vendor_settings.maximum;
                    if (totalDomains == 1) requiredInfo = $("#ssl_installation_required_domain").html().replace(/##id##/g, data.children_up_sell[0])
                }
                $new_action_panel.append($("#up_sell_temp").html().replace(/##productid##/g, $upsell_data.product_id).replace(/##parentid##/g, sale.attr("data-cart-item-id")).replace(/##productSku##/g,
                    $upsell_data.product_sku).replace(/##itemnameadd##/g, $upsell_data.name_add).replace(/##itemname##/g, $upsell_data.name).replace(/##itemtitle##/g, $upsell_data.title).replace(/##explanations##/g, explanations).replace(/##requiredInfo##/g, requiredInfo).replace(/##action##/g, $upsell_data.desc).replace(/##itemprice##/g, $.imperial_to_metric($upsell_data.price_out.setup_fee)))
            });
            $.each(data.children_up_sell, function (index, child) {
                var childLookup = child;
                child = cart_items[cart_items.findIndex(function ($item) {
                    return $item.id ==
                        childLookup
                })];
                var $up_sell = $new_action_panel.find('[data-product-id\x3d"' + child.catalog_product_id + '"]').prop("checked", true).attr("data-cart-item-id", child.id).closest(".up_sell");
                $up_sell.find(".add_label").hide();
                $up_sell.find(".service_in_cart").show();
                $up_sell.find(".up_sell_price").show()
            })
        }
    }

    function item_classes_clear(classes_remove, classes_keep, new_item) {
        new_item.find('[class*\x3d"' + classes_remove + '"]').each(function () {
            var obj = $(this);
            var classes = obj.attr("class");
            var valid_classes = "";
            classes =
                classes.split(" ");
            $.each(classes, function (key, value) {
                if (value && value.indexOf(classes_remove) < 0) valid_classes += value + " "
            });
            obj.attr("class", valid_classes.trim())
        });
        new_item.find('[class*\x3d"' + classes_keep + '"]').each(function () {
            $(this).attr("class", $(this).attr("class").replace(classes_keep, "").replace(/ +/g, " ").trim())
        })
    }

    function fixDomainObjects(new_item, cart_item) {
        if (cart_item.user_attributes === undefined) {
            new_item.find(".domain-configure").remove();
            return
        }
        var stop_for = ["renew", "trade"];
        var allow =
            !(stop_for.indexOf(cart_item.product_action) < 0 || cart_item.product_action.toString().indexOf("transfer") > -1 && cart_item.sku == "eu");
        if (allow) new_item.find(".domain-configure .contacts_cont").closest(".columns").remove(); else {
            fixDomainContactObject(new_item, cart_item);
            if ("contacts_no_edit" in cart_item.user_attributes) new_item.find('.domainEdit[data-edit\x3d"contacts"]').remove()
        }
        stop_for = ["transfer", "renew", "transfer_renew", "trade"];
        if (stop_for.indexOf(cart_item.product_action) > -1) {
            new_item.find(".domain-configure .nameservers_cont").closest(".columns").remove();
            return
        }
        fixDomainNameserverObject(new_item, cart_item.user_attributes.nameservers)
    }

    function fixDomainContactObject(new_item, cart_item) {
        if (!("list" in contacts)) {
            new_item.find(".oneRequired, .manyRequired").remove();
            return
        }
        var saved_contacts = cart_item.user_attributes.contacts;
        var config = new_item.find(".domain-configure .content:first");
        if (saved_contacts.registry_settings.required.length == 1) {
            var attr = config.find(".attr-items");
            var form = config.find(".attr-form");
            var result = config.find(".oneRequired").html();
            attr.find("div").remove();
            attr.find("a").before(result);
            var label = form.find("label");
            var select = label.find("select");
            label.html(label.find("select"));
            var value$jscomp$0 = saved_contacts.saved[saved_contacts.registry_settings.required[0]];
            if (value$jscomp$0) {
                var contact = contacts.list[contacts.list.findIndex(function (a) {
                    if (a.id == saved_contacts.saved[saved_contacts.registry_settings.required[0]]) return a
                })];
                attr.find("span").text("#" + contact.id + " " + contact.name)
            }
            if (contacts.list.length) {
                $(".contactWRN").hide();
                $(".contactLabel").show();
                $.each(contacts.list, function (key, value) {
                    var option = select.find('[value\x3d"' + value.id + '"]');
                    if (option.length < 1) {
                        select.append('\x3coption value\x3d"' + value.id + '"\x3e' + value.name + "\x3c/option\x3e");
                        option = select.find('[value\x3d"' + value.id + '"]')
                    }
                    if (value[cart_item.registry_name + "_ready"] === 0) option.disabled(true)
                });
                if ("explicit_contacts" in cart_item.user_attributes) {
                    select.find("option").filter(function (a, i) {
                        return cart_item.user_attributes.explicit_contacts.indexOf(parseInt(i.value)) <
                            0
                    }).remove();
                    form.find(".new-contact-profile").remove();
                    select.chosen_update(select.val())
                }
            } else {
                $(".contactWRN").show();
                $(".contactLabel").hide()
            }
            select.apply_chosen({
                "value": value$jscomp$0 ? value$jscomp$0 : "",
                "par": {search_contains: true}
            }).update_version_control(value$jscomp$0);
            if (value$jscomp$0) {
                config.closest(".wrapper").find(".icon.alert").toggleClass("alert success").find("i").toggleClass("icon-question icon-checkmark");
                config.find(".domainEdit").text(COMMON_LANG.CART.MISC.CHANGE)
            }
        } else {
            attr =
                config.find(".attr-items");
            form = config.find(".attr-form");
            result = config.find(".manyRequired").html();
            attr.find("div").remove();
            attr.find("a").before(result);
            var contact_list = attr.find("ul");
            var contact_item = contact_list.find("li")[0].outerHTML;
            label = form.find("label")[0].outerHTML;
            var a = form.find(".new-contact-profile");
            var saved_count = 0;
            contact_list.empty();
            form.find("label").remove();
            $.each(saved_contacts.registry_settings.required, function (key, value) {
                contact_list.append(contact_item.replace(/##role##/g,
                    value).replace(/##Role##/, trans("DOMAINS.CONTACT_ROLES." + value.toUpperCase() + ".DISPLAY")));
                a.before(label);
                var current_label = form.find("label:last");
                var span = current_label.find("span");
                var select = current_label.find("select");
                var placeholder = current_label.find(".placeholder");
                span.text(span.text().replace(trans("DOMAINS.CONTACT_ROLES.REGISTRANT.FORM", 1), trans("DOMAINS.CONTACT_ROLES." + value.toUpperCase() + ".FORM", 1)));
                var text = select.attr("data-placeholder").replace(trans("DOMAINS.CONTACT_ROLES.REGISTRANT.FORM",
                    2), trans("DOMAINS.CONTACT_ROLES." + value.toUpperCase() + ".FORM", 2));
                select.attr("data-placeholder", text);
                placeholder.text(text);
                if (saved_contacts.saved[value]) contact_list.find("li:last span").text(contacts.list[contacts.list.findIndex(function (a) {
                    if (a.id == saved_contacts.saved[value]) return a
                })].name);
                select.attr("name", value).apply_chosen(saved_contacts.saved[value] ? saved_contacts.saved[value] : "").update_version_control(saved_contacts.saved[value]);
                if (saved_contacts.saved[value]) ++saved_count
            });
            if (saved_count ==
                saved_contacts.registry_settings.required.length) {
                config.closest(".wrapper").find(".icon.alert").toggleClass("alert success").find("i").toggleClass("icon-question icon-checkmark");
                config.find(".domainEdit").text(COMMON_LANG.CART.MISC.CHANGE)
            }
        }
    }

    function fixDomainNameserverObject(new_item, saved_ns) {
        var config = new_item.find(".domain-configure .content:last");
        var ns_cont = config.find(".ns_container");
        var select = config.find(".ns_group");
        var group = select.find("optgroup:last");
        var attr_cont = config.find(".attr-items");
        var item_id = new_item.attr("data-cart-item-id");
        var editbtn = config.find(".domainEdit");
        new_item.attr("data-registry", saved_ns.registry_settings.name);
        ns_cont.attr("data-min", saved_ns.registry_settings.min).attr("data-max", saved_ns.registry_settings.max);
        $.each(nsgroups, function (key, value) {
            if (select.find('[value\x3d"' + key + '"]').length < 1) group.append('\x3coption value\x3d"' + key + '"\x3e' + value.name + "\x3c/option\x3e")
        });
        if (saved_ns.saved.group_id) {
            if (!$.isTouch()) select.apply_chosen(saved_ns.saved.group_id);
            else select.val(saved_ns.saved.group_id);
            select.change();
            attr_cont.prepend(ns_cont.html());
            logs[item_id].name_servers = {groupId: saved_ns.saved.group_id};
            editbtn.text(COMMON_LANG.CART.MISC.CHANGE)
        } else if (saved_ns.saved.list) {
            select.apply_chosen("nons").change();
            logs[item_id].name_servers = {values: []};
            $.each(saved_ns.saved.list, function (key, value) {
                var ns = ns_cont.find(".nameservers:eq(" + key + ")");
                var add_btn = ns_cont.closest("form").find(".addNameServers");
                if (ns.length < 1) add_btn.click();
                ns = ns_cont.find(".nameservers:eq(" +
                    key + ")");
                ns.val(value);
                logs[item_id].name_servers.values.push(value);
                editbtn.before("\x3cspan\x3e" + value + "\x3c/span\x3e")
            });
            editbtn.text(COMMON_LANG.CART.MISC.CHANGE);
            select.controlDeleteButtons()
        } else select.apply_chosen("");
        if (saved_ns.status) var wrapper = config.closest(".wrapper").find(".icon").toggleClass("alert success").find("i").toggleClass("icon-question icon-checkmark")
    }

    function updateCheckoutPrices(checkout, action, time) {
        var prices = checkout["totals"];
        $(".checkout_order_price").attr("data-target",
            prices.sub_total).text($.imperial_to_metric(prices.sub_total));
        if (vat["show"] || $userGroup == "user") $(".checkout_order_vat").text($.imperial_to_metric(prices.vat));
        updateOrderTotalVat(prices.sub_total, prices.grand_total);
        process_checkout_settings(checkout)
    }

    function process_checkout_settings(checkout) {
        if (typeof payment_totals == "undefined") return;
        $.each(checkout.settings.total, function (key, value) {
            payment_totals[key] = value;
            if (key == "credit") {
                var obj = $(".credit_payment_balance");
                obj.text(checkout.settings.credits.balance.formated);
                checkout.settings.credits.use ? obj.closest(".credit-box ").show() : obj.closest(".credit-box ").hide().find('[type\x3d"checkbox"]').prop("checked", false)
            } else if (key == "credit_limit") {
                obj = $(".credit_limit_balance");
                obj.text(checkout.settings.credit_limit.balance.formated);
                checkout.settings.credit_limit.use ? obj.closest(".credit-box ").show() : obj.closest(".credit-box ").hide().find('[type\x3d"checkbox"]').prop("checked", false)
            }
        });
        $("#credit_payment_form").trigger("change")
    }

    function sideCartVisibility(callback) {
        if (typeof sideCartTimer !=
            "undefined") clearTimeout(sideCartTimer);
        sideCartTimer = setTimeout(function () {
            if (!sideCartVisGet) return;
            var cont = $("#sideCartCont");
            if ($(window).scrollTop() >= nav_end) {
                $("#sideCartCont.empty.active").removeClass("active");
                if (sidCartVisibility) return;
                $("#sideCartCont:not(.empty)").removeClass("hide-important");
                $("#sideCartCont.empty").addClass("hide-important");
                checkVisibility()
            } else {
                if (!sidCartVisibility) return;
                if (cont.hasClass("active")) cont.removeClass("active"); else cont.addClass("hide-important");
                checkVisibility()
            }
        }, 100);
        if (typeof callback == "function") if ($(".reveal-modal-bg:visible").length < 1) callback(); else setTimeout(function () {
            callback()
        }, 300)
    }

    function reCreateCartSummary(data) {
        if (data.items.length) {
            var current_item = $(data.instance.triggered_item);
            if (current_item.length > 1) current_item = current_item.filter("input");
            var $loading_items = current_item.is("input") ? $('.item:has(.item_loader):not([data-cart-item-id\x3d"' + current_item.closest(".item").attr("data-cart-item-id") + '"])') : $(".item:has(.item_loader):not(" +
                data.instance.triggered_item + ")");
            var templates = {};
            var pending_delete = $.cart_loaders.get_pending_delete();
            var firstItem = true;
            if ($loading_items.length) $loading_items.each(function () {
                var obj = $(this);
                templates[obj.attr("data-cart-item-id")] = obj[0].outerHTML
            });
            $(".item").remove();
            if ("ns_group" in data) nsgroups[data.ns_group.group_id] = {
                id: data.ns_group.group_id,
                name: data.ns_group.group_name,
                nameservers: data.ns_group.list
            };
            $.each(data.items, function (key, value) {
                if ($.inArray('[data-cart-item-id\x3d"' + value.id +
                    '"]', pending_delete) == -1) {
                    if ($.inArray(value.id, data.children) == -1) {
                        if (value.id in templates) if (firstItem) $("#itemsWrapper .header").after(templates[value.id]); else $(".item:last").after(templates[value.id]); else {
                            var $new_item = $.cart.view.insert.item({"msg": {"cart_item": value}});
                            if (value.children_cross_sell.length) $.each(value.children_cross_sell, function (index, child) {
                                var childLookup = child;
                                if ($.inArray('[data-cart-item-id\x3d"' + childLookup + '"]', pending_delete) == -1) {
                                    child = data.items[data.items.findIndex(function ($item) {
                                        return $item.id ==
                                            childLookup
                                    })];
                                    $.cart.view.insert.sale(value.id, child, data.items)
                                } else $.cart_loaders.remove_pending_delete('[data-cart-item-id\x3d"' + childLookup + '"]')
                            });
                            if (value.children_up_sell.length) $.each(value.children_up_sell, function (index, child) {
                                var childLookup = child;
                                if ($.inArray('[data-cart-item-id\x3d"' + childLookup + '"]', pending_delete) == -1) {
                                    child = data.items[data.items.findIndex(function ($item) {
                                        return $item.id == childLookup
                                    })];
                                    var $up_sell = $new_item.find('[data-product-id\x3d"' + child.catalog_product_id +
                                        '"]').prop("checked", true).attr("data-cart-item-id", child.id).closest(".up_sell");
                                    $up_sell.find(".add_label").hide();
                                    $up_sell.find(".service_in_cart").show();
                                    $up_sell.find(".up_sell_price").show()
                                } else $.cart_loaders.remove_pending_delete('[data-cart-item-id\x3d"' + childLookup + '"]')
                            });
                            $new_item.find(".actions-panel").each(function () {
                                var obj = $(this);
                                var children = obj.children();
                                if (children.length < 1) obj.remove()
                            });
                            if (value.type == "ssl" && value.settings.length < 1) $new_item.find(".ssl-configure").remove()
                        }
                        if (value.type ==
                            "ssl" && !$.cart_loaders.find_up_sell_delete()) $('[data-cart-item-id\x3d"' + value.id + '"]').find(".item_loader").remove()
                    } else if (value.sku.indexOf("ssl_install") > -1 && "domain" in value.user_attributes) {
                        var parent = $.grep(data.items, function (obj) {
                            return obj.children.length > 0 && obj.children.indexOf(value.id) > -1
                        });
                        if (parent[0].product_action == "renew") $('.get-ssl-domain:has([name\x3d"target_domains_' + value.id + '"])').show().empty().append($("#ssl_installation_required_domain_set_display").html().replace(/##domain##/g,
                            value.user_attributes.domain)); else $('.get-ssl-domain:has([name\x3d"target_domains_' + value.id + '"])').show().empty().append($("#ssl_installation_required_domain_set").html().replace(/##id##/g, value.id).replace(/##domain##/g, value.user_attributes.domain))
                    }
                    firstItem = false
                } else $.cart_loaders.remove_pending_delete('[data-cart-item-id\x3d"' + value.id + '"]')
            });
            var productCont = $("#product-summary");
            productCont.find(".footer, .cart-chechout").show();
            $('.item:not([data-group\x3d"ssl"])').find(".ssl-configure").remove();
            updateCheckoutPrices(data.checkout, "update");
            sort_items();
            $wrapper.css("min-height", "");
            var $height = $wrapper.height();
            $wrapper.css("min-height", $height);
            if ($.cart_loaders.get_active_loaders().length < 1) {
                var prices = $("#itemsWrapper").find(".prices-box");
                prices.find("ul").show();
                prices.find(".loading").hide()
            }
        } else {
            $(".cart_step, .steps").remove();
            $(".cart-icon-msg").show()
        }
        var durations = $("#product-summary .duration");
        if ($.getSizeClassification("medium_down")) $.durations.fixPricesForMediumDown(durations);
        else $.durations.fixPricesForLargeUp(durations);
        $.rebuildCheckoutForm(data.checkout.settings);
        $(document).foundation("dropdown", "reflow");
        $(".get-ssl-domain").slideDown(200)
    }

    function checkVisibility() {
        if ($(".reveal-modal-bg:visible").length < 1) {
            sideCartVisGet = $.getSizeClassification("large_up");
            sidCartVisibility = $("#sideCartCont:not(.empty):visible").length > 0
        } else setTimeout(function () {
            sideCartVisGet = $.getSizeClassification("large_up");
            sidCartVisibility = $("#sideCartCont:not(.empty):visible").length >
                0
        }, 250)
    }

    function addToCartErrorHandler(data) {
        switch (data.code) {
            case error_codes.validation_error: {
                $.alertHandler("", data.data.length ? data.data.length : data.msg, alert_box_failure);
                break
            }
            case error_codes.cart_option_error: {
                $.each(data.data, function (key, value) {
                    $('ul[data-option-id\x3d"' + value["option_id"] + '"]').after(helperBlock).closest(".panel").find(".help-block").text(value["error"])
                });
                break
            }
            case error_codes.cart_extension_error: {
                $.each(data.data, function (key, value) {
                    $('.extension-panel[data-detail-id\x3d"' +
                        value["option_detail_id"] + '"]').append(helperBlock).find(".help-block").text(value["error"])
                });
                break
            }
            case error_codes.cart_attribute_error: {
                $.alertHandler("", data.msg, alert_box_failure);
                $.each(data.data, function (key, value) {
                    var error = {};
                    error[key] = value.locale;
                    $.displayErrors($("#" + key).closest("form").attr("id"), error)
                });
                break
            }
            default: {
                globalApplicationErrors(data, "")
            }
        }
    }

    function updateOrderTotalVat(subTotal, grandTotal) {
        var $order_total = $(".checkout_order_total");
        if ($order_total.hasClass("relative")) $order_total.update_vat("relative",
            [subTotal], 0); else $order_total.text($.imperial_to_metric(grandTotal))
    }

    unique_page_identifier = parseInt($.now() * Math.random());
    var cart_list = $("#main_nav").find("ul.cart-items");
    var side_cart = $("#sideCartCont");
    var side_cart_list = side_cart.find("ul.cart-items");
    var cart_badge = $("#cart_badge");
    var cart_item = '\x3cli data-cart-item-id\x3d"##id##"\x3e' + '\x3cdiv class\x3d"product"\x3e##name## \x3cbr\x3e\x3cspan class\x3d"cart_item_desc"\x3e##desc##\x3c/span\x3e\x3c/div\x3e' + '\x3cdiv class\x3d"price"\x3e\x3cspan class\x3d"vat" data-price\x3d""\x3e\x3c/span\x3e \x26euro;\x3c/div\x3e' +
        '\x3ca href\x3d"#" class\x3d"item-remove" title\x3d"Αφαίρεση προϊόντος"\x3e\x3c/a\x3e' + "\x3c/li\x3e";
    var cart_item_list = $("#product-summary");
    var sideCartVisGet = true;
    var sidCartVisibility = false;
    var nav_end = 70;
    var cart_containers = $("#cartContainer, #sideCartCont");
    var $wrapper = $("#itemsWrapper");
    var promoPrices = '\x3cs class\x3d"strikethrough"\x3e\x3cspan class\x3d"item_price"\x3e##previousPrice##\x3c/span\x3e \x26euro;\x3c/s\x3e\x3cdiv class\x3d"current-price"\x3e\x3cspan class\x3d"item_price"\x3e##newPrice##\x3c/span\x3e \x26euro;\x3c/div\x3e';
    var badgeHeartBit = null;
    execution_time = {delete: 0, update: 0, create: 0};
    $("#openSideCart").on("click", function (e) {
        e.preventDefault();
        var obj = $(this).closest("div");
        if (!obj.hasClass("active")) obj.addClass("w-shadow active"); else obj.removeClass("active").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
            obj.removeClass("w-shadow");
            obj.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend")
        })
    });
    $(document).on("click", ".item-remove",
        function (e) {
            e.preventDefault();
            var item = $(this).closest("li");
            var items = $('li[data-cart-item-id\x3d"' + item.attr("data-cart-item-id") + '"]');
            items.cart_hide();
            remove_item_request(item)
        }).on("click", ".item:not(.order) .delete", function (e) {
        e.preventDefault();
        var item = $(this).closest("[data-cart-item-id]");
        $("#cartContainer").find('[data-cart-item-id\x3d"' + item.attr("data-cart-item-id") + '"]').cart_hide();
        remove_item_request(item)
    });
    $(window).on("scroll", function () {
        sideCartVisibility()
    }).on("resize", function () {
        checkVisibility()
    });
    $.fn.extend({
        cart_hide: function () {
            $(this).hide();
            cart_dec()
        }, cart_show: function () {
            $(this).show();
            cart_inc()
        }
    });
    $.extend({
        cart: {
            insert: function (itemId, itemName, itemDesc, itemPrice) {
                var itemsList = $("ul.cart-items");
                var item = itemsList.find('[data-cart-item-id\x3d"' + itemId + '"]');
                if (item.length) return;
                var vat = $("ul.cart-items").append(cart_item.replace("##id##", itemId).replace("##name##", itemName).replace("##desc##", itemDesc)).find(".vat:last");
                if (typeof itemPrice == "number") vat.update_vat("price", [itemPrice],
                    0).closest("li"); else vat.update_vat("price", itemPrice, 1).closest("li");
                cart_inc()
            }, update: function (itemId, properties) {
                if (typeof properties != "object") throw"Invalid update properties.";
                var item = $("ul.cart-items").find('[data-cart-item-id\x3d"' + itemId + '"]');
                if (typeof properties.name != "undefined") item.find(".cart_item_name").text(properties.name);
                if (typeof properties.desc != "undefined") item.find(".cart_item_desc").text(properties.desc);
                if (typeof properties.price != "undefined") item.update_vat("price", [properties.price],
                    0)
            }, remove: function (itemId, skip_dec) {
                if (cart_containers.length) {
                    cart_containers.find('li[data-cart-item-id\x3d"' + itemId + '"]').remove();
                    if (!skip_dec) cart_dec()
                }
            }, dec: function () {
                cart_dec()
            }, inc: function () {
                cart_inc()
            }, get_items: function () {
                return get_active_items()
            }, view: {
                insert: {
                    item: function (data) {
                        return cart_view_insert(data)
                    }, sale: function (itemId, data, items) {
                        insert_sale(itemId, data, items)
                    }
                }, remove: function (data) {
                    data = data.msg;
                    if (!("add_on" in data)) {
                        var item = cart_item_list.find('[data-cart-item-id\x3d"' +
                            data.cart_item_id + '"]');
                        item.prev("hr").remove();
                        var wrapper = item.closest(".item").find(".wrapper");
                        wrapper.find('li:has([data-cross-product-id\x3d"' + item.attr("data-product-id") + '"])').show();
                        var sales = wrapper.find("li:has(.add_cross_sell)").filter(function () {
                            return $(this).css("display") != "none"
                        });
                        manage_sales(sales, wrapper);
                        item.remove()
                    } else {
                        var upsell = $('[data-cart-item-id\x3d"' + data.add_on.item_id + '"]').prop("checked", false).removeAttr("data-cart-item-id").closest(".up_sell");
                        upsell.find(".add_label").show();
                        upsell.find(".service_in_cart").hide();
                        upsell.find(".up_sell_price").hide()
                    }
                    updateCheckoutPrices(data.checkout, "delete", data.execution_time)
                }, update: function (data) {
                    var updates = data.msg.updates;
                    var checkout = data.msg.checkout;
                    $.each(updates, function (key$jscomp$0, info) {
                        var item = cart_item_list.find('[data-cart-item-id\x3d"' + info.id + '"]');
                        var setup_fee = item.find(".set_up_fee");
                        var price_el = !item.hasClass("cross_sale") ? item.find(".item_price:not(.cross_sale .item_price)") : item.find(".item_price");
                        var duration =
                            !item.hasClass("cross_sale") ? item.find(".item_duration:not(.cross_sale .item_duration)") : item.find(".item_duration");
                        duration.find("button").text(create_length_string(info.billing.length.selected));
                        duration = duration.find("ul");
                        duration.empty();
                        $.each(info.billing.all_lengths.total_per_interval, function (key, value) {
                            duration.append('\x3cli class\x3d"length"\x3e' + '\x3ca href\x3d"#" class\x3d"item_length" data-length\x3d"' + key + '"\x3e' + create_length_string(key) + '\x3cdiv class\x3d"price-per-length right"\x3e ' +
                                $.imperial_to_metric(value) + " € / μήνα\x3c/div\x3e" + "\x3c/a\x3e" + "\x3c/li\x3e")
                        });
                        duration.find('li:has([data-length\x3d"' + info.billing.length.selected + '"])').addClass("active");
                        if (setup_fee.length) {
                            price_el.text($.imperial_to_metric(info.billing.price.total));
                            setup_fee.text($.imperial_to_metric(info.billing.price.setup_fee))
                        } else price_el.text($.imperial_to_metric(info.billing.price.total));
                        if (info.options) $.each(info.options, function (key, opt) {
                            item.find('[data-opt-name\x3d"' + opt.name + '"]').find(".spec-value").text(opt.selected.name)
                        });
                        if (info.user_attributes) $.each(info.user_attributes, function (key, attr) {
                            item.find('[data-opt-name\x3d"' + key + '"]').find(".spec-value").text(attr)
                        });
                        if (info.settings) for (i in info.settings) {
                            if (info.type == "ssl") var quantity = "quantity";
                            var setting = item.find('[name\x3d"' + info.settings[i].name + '"]');
                            setting.val(info.settings[i][quantity])
                        }
                    });
                    updateCheckoutPrices(checkout, "update", data.msg.execution_time)
                }, manage_sales: function (sales, cont) {
                    manage_sales(sales, cont)
                }, updateCheckoutPrices: function (checkout,
                                                   action, time) {
                    updateCheckoutPrices(checkout, action, time)
                }, process_checkout_settings: function (checkout) {
                    process_checkout_settings(checkout)
                }, sort_items: function () {
                    sort_items()
                }, reCreateCartSummary: function (data) {
                    reCreateCartSummary(data)
                }
            }, sideCart: {
                checkVisibility: function () {
                    checkVisibility()
                }
            }, errorHandler: function (data) {
                if ($("#product-summary").length) {
                    $.alertHandler("", data.msg, alert_box_failure);
                    if (typeof data.data == "object" && "items" in data.data) reCreateCartSummary(data.data); else if (data.code ==
                        error_codes.cart_not_found) {
                        $(".cart_step, .steps").hide();
                        $(".cart-icon-msg").show()
                    }
                } else {
                    $(".order.pending").removeClass("pending");
                    addToCartErrorHandler(data)
                }
            }
        }
    });
    side_cart_list.html(cart_list.html());
    checkVisibility();
    sideCartVisibility();
    if ($wrapper.length) {
        var $height = $wrapper.height();
        $wrapper.css("min-height", $height)
    }
    $("#sideCartCont").on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
        var obj = $(this);
        if (!obj.hasClass("active")) {
            obj.removeClass("w-shadow");
            if ($(window).scrollTop() < nav_end || obj.hasClass("empty")) setTimeout(function () {
                obj.addClass("hide-important");
                checkVisibility()
            }, 500)
        }
    });
    if ($("#sideCartCont .cart-items").length) {
        $.observers.register("side_cart", function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) if (typeof observationSideCartTimer == "undefined" || observationSideCartTimer == null) observationSideCartTimer = setTimeout(function () {
                    sideCartVisibility()
                }, 250)
            })
        });
        $.observers.observe("side_cart", $("#sideCartCont .cart-items")[0],
            {childList: true})
    }
});
$(document).ready(function () {
    function notice_insert(data) {
        if (data.msg.display_on_screen) parameters = JSON.parse(data.msg.raw_text); else parameters = {
            subject: APP_LANG.MISC[notification_ids[data.msg.notification_template_id]],
            body: JSON.parse(data.msg.parameters)["subject"]
        };
        parameters.notification_id = data.msg.notification_id;
        return create_notification(parameters)
    }

    function create_notification(parameters) {
        notice = '\x3cli data-notification-id\x3d"' + parameters.notification_id + '"\x3e' + '\x3cdiv class\x3d"product"\x3e' +
            parameters.subject + "\x3cbr /\x3e" + parameters.body + "\x3c/div\x3e" + '\x3ca href\x3d"#" class\x3d"remove_notice"\x3eclose\x3c/a\x3e' + "\x3c/li\x3e";
        return notice
    }

    function remove_notice_request(notice$jscomp$0, list) {
        if (typeof notice_obj != "object") notice_obj = new $.ajax_prototype({
            data: {"_token": $('[name\x3d"_token"]').val(), unique_id: unique_page_identifier},
            type: "POST",
            success: function (data) {
                var notice = $('[data-notification-id\x3d"' + this.url.match(/[0-9]+$/) + '"]');
                var list = notice.closest("ul");
                if (data.success) {
                    notice.remove();
                    if (list.hasClass("notification-list")) $.notice.dec(); else if (list.find("li").length == 0) list.hide()
                } else {
                    notice_remove_failed(notice, list);
                    globalApplicationErrors(data, "")
                }
            },
            error: function (response) {
                notice_remove_failed(notice$jscomp$0, list);
                globalApplicationErrors(response, "")
            },
            complete: function () {
            }
        });
        notice_obj.url = notice_delete.replace("##id##", notice$jscomp$0.attr("data-notification-id"));
        $.ajax(notice_obj)
    }

    function notice_remove_failed(notice, list) {
        notice.show();
        if (list.hasClass("notification-list")) $.notice.inc();
        else list.show()
    }

    function get_active_items() {
        return notification_list.find("li").filter(function () {
            return $(this).css("display") != "none"
        })
    }

    var notification_list = $("#notice_cont");
    $.fn.extend({
        "notice_insert": function (data) {
            var obj = $(this);
            obj.show().append(notice_insert(data));
            if (obj.hasClass("notification-list")) $.notice.inc()
        }
    });
    $.extend({
        notice: {
            insert: function (data) {
                notice_insert(data)
            }, inc: function () {
                notification_list.closest("li").find(".badge").text(get_active_items().length);
                $("#empty_notices").hide();
                $("#go_to_notices, #notice_badge").show()
            }, dec: function () {
                var notices = get_active_items().length;
                notification_list.closest("li").find(".badge").text(notices);
                if (!notices) {
                    $("#empty_notices").show();
                    $("#go_to_notices, #notice_badge").hide()
                }
            }
        }
    });
    $(document).on("click", ".remove_notice", function () {
        var obj = $(this);
        var notice = obj.closest("li");
        var list = obj.closest("ul");
        notice.hide();
        if (list.hasClass("notification-list")) $.notice.dec(); else if (list.find("li").length == 1) list.hide();
        remove_notice_request(notice,
            list)
    })
});
$(document).ready(function () {
    (function () {
        function scrollMenuVisibilityHandler() {
            if ($.getSizeClassification("large_up")) {
                var current_pos = $(window).scrollTop();
                if (current_pos <= nav_pos) {
                    navWrapper.hide();
                    navWrapper.find(".active").removeClass("active");
                    nav.find(".active").removeClass("active")
                } else {
                    navWrapper.show();
                    if (!window.requestAnimationFrame) {
                        if (typeof activateNavBtn != "undefined" && activateNavBtn != null) {
                            scrolling = false;
                            return
                        }
                        activateNavBtn = setTimeout(function () {
                                activateBtn();
                                activateNavBtn = null
                            },
                            5)
                    } else requestAnimationFrame(activateBtn)
                }
            } else {
                navWrapper.hide();
                navWrapper.find(".active").removeClass("active");
                nav.find(".active").removeClass("active")
            }
            scrolling = false
        }

        function activateBtn() {
            var current_pos = $(window).scrollTop();
            for (i in sectionLoop) {
                section = sectionLoop[i];
                var first_section = firstSection == section && Math.floor(sectionToOffsets[firstSection][0]) == current_pos;
                var section_pos = (Math.floor(sectionToOffsets[section][0]) < current_pos && current_pos || Math.floor(sectionToOffsets[section][0]) ==
                    current_pos && current_pos) < sectionToOffsets[section][1];
                section_pos = Math.floor(sectionToOffsets[section][0]) <= current_pos && current_pos < sectionToOffsets[section][1];
                if (first_section || section_pos) {
                    navWrapper.find(".active").removeClass("active");
                    navWrapper.find('[href\x3d"' + section + '"]').addClass("active");
                    nav.find(".active").removeClass("active");
                    nav.find('[href\x3d"' + section + '"]').addClass("active");
                    scrolling = false;
                    break
                }
            }
        }

        function calculateSections() {
            sections.each(function (i) {
                var obj = $(this);
                var sectionName =
                    obj.attr("href");
                var section = $(sectionName);
                try {
                    sectionToOffsets[sectionName] = [parseFloat(section.offset().top.toFixed(5)) - navWrapper.height() - 1]
                } catch (er) {
                    console.log(section)
                }
                if (i > 0) {
                    var prevSection = $(sections[i - 1]);
                    var prevSectionName = prevSection.attr("href");
                    sectionToOffsets[prevSectionName].push(sectionToOffsets[sectionName][0])
                }
                var sectionHeight = section.height();
                if (i == sections.length - 1) sectionToOffsets[sectionName].push(sectionToOffsets[sectionName][0] + sectionHeight)
            })
        }

        nav = $("#custom-nav");
        navWrapper = $("#wrapper-nav");
        if (nav.length < 1) {
            $(".customScroll").on("click", function (e) {
                e.preventDefault();
                $.smoothScroll({}, $($(this).attr("href")).offset().top)
            });
            return
        }
        if (navWrapper.length < 1) {
            $("main").append('\x3cdiv id\x3d"wrapper-nav" class\x3d"hide" style\x3d"position:fixed; top:0; width:100%; display: none"\x3e' + $("#custom-nav").html() + "\x3c/div\x3e");
            navWrapper = $("#wrapper-nav")
        } else $("#wrapper-nav").html($("#custom-nav").html());
        nav_pos = nav.position().top;
        var sections = $("#wrapper-nav a.customScroll");
        var sectionToOffsets = {};
        var sectionLoop = [];
        var firstSection = sections.filter(":first").attr("href");
        $(".customScroll").on("click", function (e) {
            e.preventDefault();
            scrolling = true;
            scrollMenuVisibilityHandler();
            var section = $($(this).attr("href"));
            if (section.length < 1) return;
            if ($.getSizeClassification("large_up")) var top = section.offset().top - $("#wrapper-nav").height() + 4; else top = section.offset().top;
            var target = top > nav_pos ? top : nav_pos;
            if ($(window).scrollTop() >= nav_pos && $.getSizeClassification("large_up")) $("#wrapper-nav").show();
            $.smoothScroll({}, target)
        });
        if (typeof delaySections == "undefined") calculateSections();
        sectionLoop = Object.keys(sectionToOffsets);
        var scrolling = false;
        var isViewPortLarge = $.getSizeClassification("large_up");
        $("#toTop").on("click", function (e) {
            e.preventDefault();
            scrolling = true;
            scrollMenuVisibilityHandler()
        }).smoothScroll({
            afterScroll: function () {
                if (!$.getSizeClassification("large_up")) return;
                $("#wrapper-nav").hide();
                navWrapper.find(".active").removeClass("active");
                nav.find(".active").removeClass("active")
            }
        });
        scrollMenuVisibilityHandler();
        $.extend({
            recalculateSections: function () {
                sections = $("#wrapper-nav a.customScroll");
                sectionToOffsets = {};
                sectionLoop = [];
                firstSection = sections.filter(":first").attr("href");
                calculateSections();
                sectionLoop = Object.keys(sectionToOffsets);
                scrolling = false;
                isViewPortLarge = $.getSizeClassification("large_up")
            }, calculateSections: calculateSections
        });
        window.addEventListener("resize", function () {
            var currentViewPort = $.getSizeClassification("large_up");
            if (isViewPortLarge != currentViewPort) {
                if (!currentViewPort) navWrapper.hide();
                else navWrapper.show();
                scrollMenuVisibilityHandler();
                isViewPortLarge = currentViewPort
            }
        });
        if (!$.isTouch()) window.addEventListener("scroll", function () {
            if (scrolling) return;
            scrolling = true;
            scrollMenuVisibilityHandler()
        })
    })()
});

$(document).ready(function () {/*
 https://mths.be/he v1.1.0 by @mathias | MIT license */
    $(document).ready(function () {
        var he;
        (function (root) {
            var freeExports = typeof exports == "object" && exports;
            var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
            var freeGlobal = typeof global == "object" && global;
            if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) root = freeGlobal;
            var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            var regexAsciiWhitelist = /[\x01-\x7F]/g;
            var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
            var regexEncodeNonAscii =
                /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
            var encodeMap = {
                "­": "shy",
                "‌": "zwnj",
                "‍": "zwj",
                "‎": "lrm",
                "⁣": "ic",
                "⁢": "it",
                "⁡": "af",
                "‏": "rlm",
                "​": "ZeroWidthSpace",
                "⁠": "NoBreak",
                "̑": "DownBreve",
                "⃛": "tdot",
                "⃜": "DotDot",
                "\t": "Tab",
                "\n": "NewLine",
                " ": "puncsp",
                " ": "MediumSpace",
                " ": "thinsp",
                " ": "hairsp",
                " ": "emsp13",
                " ": "ensp",
                " ": "emsp14",
                " ": "emsp",
                " ": "numsp",
                " ": "nbsp",
                "  ": "ThickSpace",
                "‾": "oline",
                "_": "lowbar",
                "‐": "dash",
                "–": "ndash",
                "—": "mdash",
                "―": "horbar",
                ",": "comma",
                ";": "semi",
                "⁏": "bsemi",
                ":": "colon",
                "⩴": "Colone",
                "!": "excl",
                "¡": "iexcl",
                "?": "quest",
                "¿": "iquest",
                ".": "period",
                "‥": "nldr",
                "…": "mldr",
                "·": "middot",
                "'": "apos",
                "‘": "lsquo",
                "’": "rsquo",
                "‚": "sbquo",
                "‹": "lsaquo",
                "›": "rsaquo",
                '"': "quot",
                "“": "ldquo",
                "”": "rdquo",
                "„": "bdquo",
                "«": "laquo",
                "»": "raquo",
                "(": "lpar",
                ")": "rpar",
                "[": "lsqb",
                "]": "rsqb",
                "{": "lcub",
                "}": "rcub",
                "⌈": "lceil",
                "⌉": "rceil",
                "⌊": "lfloor",
                "⌋": "rfloor",
                "⦅": "lopar",
                "⦆": "ropar",
                "⦋": "lbrke",
                "⦌": "rbrke",
                "⦍": "lbrkslu",
                "⦎": "rbrksld",
                "⦏": "lbrksld",
                "⦐": "rbrkslu",
                "⦑": "langd",
                "⦒": "rangd",
                "⦓": "lparlt",
                "⦔": "rpargt",
                "⦕": "gtlPar",
                "⦖": "ltrPar",
                "⟦": "lobrk",
                "⟧": "robrk",
                "⟨": "lang",
                "⟩": "rang",
                "⟪": "Lang",
                "⟫": "Rang",
                "⟬": "loang",
                "⟭": "roang",
                "❲": "lbbrk",
                "❳": "rbbrk",
                "‖": "Vert",
                "§": "sect",
                "¶": "para",
                "@": "commat",
                "*": "ast",
                "/": "sol",
                "undefined": null,
                "\x26": "amp",
                "#": "num",
                "%": "percnt",
                "‰": "permil",
                "‱": "pertenk",
                "†": "dagger",
                "‡": "Dagger",
                "•": "bull",
                "⁃": "hybull",
                "′": "prime",
                "″": "Prime",
                "‴": "tprime",
                "⁗": "qprime",
                "‵": "bprime",
                "⁁": "caret",
                "`": "grave",
                "´": "acute",
                "˜": "tilde",
                "^": "Hat",
                "¯": "macr",
                "˘": "breve",
                "˙": "dot",
                "¨": "die",
                "˚": "ring",
                "˝": "dblac",
                "¸": "cedil",
                "˛": "ogon",
                "ˆ": "circ",
                "ˇ": "caron",
                "°": "deg",
                "©": "copy",
                "®": "reg",
                "℗": "copysr",
                "℘": "wp",
                "℞": "rx",
                "℧": "mho",
                "℩": "iiota",
                "←": "larr",
                "↚": "nlarr",
                "→": "rarr",
                "↛": "nrarr",
                "↑": "uarr",
                "↓": "darr",
                "↔": "harr",
                "↮": "nharr",
                "↕": "varr",
                "↖": "nwarr",
                "↗": "nearr",
                "↘": "searr",
                "↙": "swarr",
                "↝": "rarrw",
                "↝̸": "nrarrw",
                "↞": "Larr",
                "↟": "Uarr",
                "↠": "Rarr",
                "↡": "Darr",
                "↢": "larrtl",
                "↣": "rarrtl",
                "↤": "mapstoleft",
                "↥": "mapstoup",
                "↦": "map",
                "↧": "mapstodown",
                "↩": "larrhk",
                "↪": "rarrhk",
                "↫": "larrlp",
                "↬": "rarrlp",
                "↭": "harrw",
                "↰": "lsh",
                "↱": "rsh",
                "↲": "ldsh",
                "↳": "rdsh",
                "↵": "crarr",
                "↶": "cularr",
                "↷": "curarr",
                "↺": "olarr",
                "↻": "orarr",
                "↼": "lharu",
                "↽": "lhard",
                "↾": "uharr",
                "↿": "uharl",
                "⇀": "rharu",
                "⇁": "rhard",
                "⇂": "dharr",
                "⇃": "dharl",
                "⇄": "rlarr",
                "⇅": "udarr",
                "⇆": "lrarr",
                "⇇": "llarr",
                "⇈": "uuarr",
                "⇉": "rrarr",
                "⇊": "ddarr",
                "⇋": "lrhar",
                "⇌": "rlhar",
                "⇐": "lArr",
                "⇍": "nlArr",
                "⇑": "uArr",
                "⇒": "rArr",
                "⇏": "nrArr",
                "⇓": "dArr",
                "⇔": "iff",
                "⇎": "nhArr",
                "⇕": "vArr",
                "⇖": "nwArr",
                "⇗": "neArr",
                "⇘": "seArr",
                "⇙": "swArr",
                "⇚": "lAarr",
                "⇛": "rAarr",
                "⇝": "zigrarr",
                "⇤": "larrb",
                "⇥": "rarrb",
                "⇵": "duarr",
                "⇽": "loarr",
                "⇾": "roarr",
                "⇿": "hoarr",
                "∀": "forall",
                "∁": "comp",
                "∂": "part",
                "∂̸": "npart",
                "∃": "exist",
                "∄": "nexist",
                "∅": "empty",
                "∇": "Del",
                "∈": "in",
                "∉": "notin",
                "∋": "ni",
                "∌": "notni",
                "϶": "bepsi",
                "∏": "prod",
                "∐": "coprod",
                "∑": "sum",
                "+": "plus",
                "±": "pm",
                "÷": "div",
                "×": "times",
                "\x3c": "lt",
                "≮": "nlt",
                "\x3c⃒": "nvlt",
                "\x3d": "equals",
                "≠": "ne",
                "\x3d⃥": "bne",
                "⩵": "Equal",
                "\x3e": "gt",
                "≯": "ngt",
                "\x3e⃒": "nvgt",
                "¬": "not",
                "|": "vert",
                "¦": "brvbar",
                "−": "minus",
                "∓": "mp",
                "∔": "plusdo",
                "⁄": "frasl",
                "∖": "setmn",
                "∗": "lowast",
                "∘": "compfn",
                "√": "Sqrt",
                "∝": "prop",
                "∞": "infin",
                "∟": "angrt",
                "∠": "ang",
                "∠⃒": "nang",
                "∡": "angmsd",
                "∢": "angsph",
                "∣": "mid",
                "∤": "nmid",
                "∥": "par",
                "∦": "npar",
                "∧": "and",
                "∨": "or",
                "∩": "cap",
                "∩︀": "caps",
                "∪": "cup",
                "∪︀": "cups",
                "∫": "int",
                "∬": "Int",
                "∭": "tint",
                "⨌": "qint",
                "∮": "oint",
                "∯": "Conint",
                "∰": "Cconint",
                "∱": "cwint",
                "∲": "cwconint",
                "∳": "awconint",
                "∴": "there4",
                "∵": "becaus",
                "∶": "ratio",
                "∷": "Colon",
                "∸": "minusd",
                "∺": "mDDot",
                "∻": "homtht",
                "∼": "sim",
                "≁": "nsim",
                "∼⃒": "nvsim",
                "∽": "bsim",
                "∽̱": "race",
                "∾": "ac",
                "∾̳": "acE",
                "∿": "acd",
                "≀": "wr",
                "≂": "esim",
                "≂̸": "nesim",
                "≃": "sime",
                "≄": "nsime",
                "≅": "cong",
                "≇": "ncong",
                "≆": "simne",
                "≈": "ap",
                "≉": "nap",
                "≊": "ape",
                "≋": "apid",
                "≋̸": "napid",
                "≌": "bcong",
                "≍": "CupCap",
                "≭": "NotCupCap",
                "≍⃒": "nvap",
                "≎": "bump",
                "≎̸": "nbump",
                "≏": "bumpe",
                "≏̸": "nbumpe",
                "≐": "doteq",
                "≐̸": "nedot",
                "≑": "eDot",
                "≒": "efDot",
                "≓": "erDot",
                "≔": "colone",
                "≕": "ecolon",
                "≖": "ecir",
                "≗": "cire",
                "≙": "wedgeq",
                "≚": "veeeq",
                "≜": "trie",
                "≟": "equest",
                "≡": "equiv",
                "≢": "nequiv",
                "≡⃥": "bnequiv",
                "≤": "le",
                "≰": "nle",
                "≤⃒": "nvle",
                "≥": "ge",
                "≱": "nge",
                "≥⃒": "nvge",
                "≦": "lE",
                "≦̸": "nlE",
                "≧": "gE",
                "≧̸": "ngE",
                "≨︀": "lvnE",
                "≨": "lnE",
                "≩": "gnE",
                "≩︀": "gvnE",
                "≪": "ll",
                "≪̸": "nLtv",
                "≪⃒": "nLt",
                "≫": "gg",
                "≫̸": "nGtv",
                "≫⃒": "nGt",
                "≬": "twixt",
                "≲": "lsim",
                "≴": "nlsim",
                "≳": "gsim",
                "≵": "ngsim",
                "≶": "lg",
                "≸": "ntlg",
                "≷": "gl",
                "≹": "ntgl",
                "≺": "pr",
                "⊀": "npr",
                "≻": "sc",
                "⊁": "nsc",
                "≼": "prcue",
                "⋠": "nprcue",
                "≽": "sccue",
                "⋡": "nsccue",
                "≾": "prsim",
                "≿": "scsim",
                "≿̸": "NotSucceedsTilde",
                "⊂": "sub",
                "⊄": "nsub",
                "⊂⃒": "vnsub",
                "⊃": "sup",
                "⊅": "nsup",
                "⊃⃒": "vnsup",
                "⊆": "sube",
                "⊈": "nsube",
                "⊇": "supe",
                "⊉": "nsupe",
                "⊊︀": "vsubne",
                "⊊": "subne",
                "⊋︀": "vsupne",
                "⊋": "supne",
                "⊍": "cupdot",
                "⊎": "uplus",
                "⊏": "sqsub",
                "⊏̸": "NotSquareSubset",
                "⊐": "sqsup",
                "⊐̸": "NotSquareSuperset",
                "⊑": "sqsube",
                "⋢": "nsqsube",
                "⊒": "sqsupe",
                "⋣": "nsqsupe",
                "⊓": "sqcap",
                "⊓︀": "sqcaps",
                "⊔": "sqcup",
                "⊔︀": "sqcups",
                "⊕": "oplus",
                "⊖": "ominus",
                "⊗": "otimes",
                "⊘": "osol",
                "⊙": "odot",
                "⊚": "ocir",
                "⊛": "oast",
                "⊝": "odash",
                "⊞": "plusb",
                "⊟": "minusb",
                "⊠": "timesb",
                "⊡": "sdotb",
                "⊢": "vdash",
                "⊬": "nvdash",
                "⊣": "dashv",
                "⊤": "top",
                "⊥": "bot",
                "⊧": "models",
                "⊨": "vDash",
                "⊭": "nvDash",
                "⊩": "Vdash",
                "⊮": "nVdash",
                "⊪": "Vvdash",
                "⊫": "VDash",
                "⊯": "nVDash",
                "⊰": "prurel",
                "⊲": "vltri",
                "⋪": "nltri",
                "⊳": "vrtri",
                "⋫": "nrtri",
                "⊴": "ltrie",
                "⋬": "nltrie",
                "⊴⃒": "nvltrie",
                "⊵": "rtrie",
                "⋭": "nrtrie",
                "⊵⃒": "nvrtrie",
                "⊶": "origof",
                "⊷": "imof",
                "⊸": "mumap",
                "⊹": "hercon",
                "⊺": "intcal",
                "⊻": "veebar",
                "⊽": "barvee",
                "⊾": "angrtvb",
                "⊿": "lrtri",
                "⋀": "Wedge",
                "⋁": "Vee",
                "⋂": "xcap",
                "⋃": "xcup",
                "⋄": "diam",
                "⋅": "sdot",
                "⋆": "Star",
                "⋇": "divonx",
                "⋈": "bowtie",
                "⋉": "ltimes",
                "⋊": "rtimes",
                "⋋": "lthree",
                "⋌": "rthree",
                "⋍": "bsime",
                "⋎": "cuvee",
                "⋏": "cuwed",
                "⋐": "Sub",
                "⋑": "Sup",
                "⋒": "Cap",
                "⋓": "Cup",
                "⋔": "fork",
                "⋕": "epar",
                "⋖": "ltdot",
                "⋗": "gtdot",
                "⋘": "Ll",
                "⋘̸": "nLl",
                "⋙": "Gg",
                "⋙̸": "nGg",
                "⋚︀": "lesg",
                "⋚": "leg",
                "⋛": "gel",
                "⋛︀": "gesl",
                "⋞": "cuepr",
                "⋟": "cuesc",
                "⋦": "lnsim",
                "⋧": "gnsim",
                "⋨": "prnsim",
                "⋩": "scnsim",
                "⋮": "vellip",
                "⋯": "ctdot",
                "⋰": "utdot",
                "⋱": "dtdot",
                "⋲": "disin",
                "⋳": "isinsv",
                "⋴": "isins",
                "⋵": "isindot",
                "⋵̸": "notindot",
                "⋶": "notinvc",
                "⋷": "notinvb",
                "⋹": "isinE",
                "⋹̸": "notinE",
                "⋺": "nisd",
                "⋻": "xnis",
                "⋼": "nis",
                "⋽": "notnivc",
                "⋾": "notnivb",
                "⌅": "barwed",
                "⌆": "Barwed",
                "⌌": "drcrop",
                "⌍": "dlcrop",
                "⌎": "urcrop",
                "⌏": "ulcrop",
                "⌐": "bnot",
                "⌒": "profline",
                "⌓": "profsurf",
                "⌕": "telrec",
                "⌖": "target",
                "⌜": "ulcorn",
                "⌝": "urcorn",
                "⌞": "dlcorn",
                "⌟": "drcorn",
                "⌢": "frown",
                "⌣": "smile",
                "⌭": "cylcty",
                "⌮": "profalar",
                "⌶": "topbot",
                "⌽": "ovbar",
                "⌿": "solbar",
                "⍼": "angzarr",
                "⎰": "lmoust",
                "⎱": "rmoust",
                "⎴": "tbrk",
                "⎵": "bbrk",
                "⎶": "bbrktbrk",
                "⏜": "OverParenthesis",
                "⏝": "UnderParenthesis",
                "⏞": "OverBrace",
                "⏟": "UnderBrace",
                "⏢": "trpezium",
                "⏧": "elinters",
                "␣": "blank",
                "─": "boxh",
                "│": "boxv",
                "┌": "boxdr",
                "┐": "boxdl",
                "└": "boxur",
                "┘": "boxul",
                "├": "boxvr",
                "┤": "boxvl",
                "┬": "boxhd",
                "┴": "boxhu",
                "┼": "boxvh",
                "═": "boxH",
                "║": "boxV",
                "╒": "boxdR",
                "╓": "boxDr",
                "╔": "boxDR",
                "╕": "boxdL",
                "╖": "boxDl",
                "╗": "boxDL",
                "╘": "boxuR",
                "╙": "boxUr",
                "╚": "boxUR",
                "╛": "boxuL",
                "╜": "boxUl",
                "╝": "boxUL",
                "╞": "boxvR",
                "╟": "boxVr",
                "╠": "boxVR",
                "╡": "boxvL",
                "╢": "boxVl",
                "╣": "boxVL",
                "╤": "boxHd",
                "╥": "boxhD",
                "╦": "boxHD",
                "╧": "boxHu",
                "╨": "boxhU",
                "╩": "boxHU",
                "╪": "boxvH",
                "╫": "boxVh",
                "╬": "boxVH",
                "▀": "uhblk",
                "▄": "lhblk",
                "█": "block",
                "░": "blk14",
                "▒": "blk12",
                "▓": "blk34",
                "□": "squ",
                "▪": "squf",
                "▫": "EmptyVerySmallSquare",
                "▭": "rect",
                "▮": "marker",
                "▱": "fltns",
                "△": "xutri",
                "▴": "utrif",
                "▵": "utri",
                "▸": "rtrif",
                "▹": "rtri",
                "▽": "xdtri",
                "▾": "dtrif",
                "▿": "dtri",
                "◂": "ltrif",
                "◃": "ltri",
                "◊": "loz",
                "○": "cir",
                "◬": "tridot",
                "◯": "xcirc",
                "◸": "ultri",
                "◹": "urtri",
                "◺": "lltri",
                "◻": "EmptySmallSquare",
                "◼": "FilledSmallSquare",
                "★": "starf",
                "☆": "star",
                "☎": "phone",
                "♀": "female",
                "♂": "male",
                "♠": "spades",
                "♣": "clubs",
                "♥": "hearts",
                "♦": "diams",
                "♪": "sung",
                "✓": "check",
                "✗": "cross",
                "✠": "malt",
                "✶": "sext",
                "❘": "VerticalSeparator",
                "⟈": "bsolhsub",
                "⟉": "suphsol",
                "⟵": "xlarr",
                "⟶": "xrarr",
                "⟷": "xharr",
                "⟸": "xlArr",
                "⟹": "xrArr",
                "⟺": "xhArr",
                "⟼": "xmap",
                "⟿": "dzigrarr",
                "⤂": "nvlArr",
                "⤃": "nvrArr",
                "⤄": "nvHarr",
                "⤅": "Map",
                "⤌": "lbarr",
                "⤍": "rbarr",
                "⤎": "lBarr",
                "⤏": "rBarr",
                "⤐": "RBarr",
                "⤑": "DDotrahd",
                "⤒": "UpArrowBar",
                "⤓": "DownArrowBar",
                "⤖": "Rarrtl",
                "⤙": "latail",
                "⤚": "ratail",
                "⤛": "lAtail",
                "⤜": "rAtail",
                "⤝": "larrfs",
                "⤞": "rarrfs",
                "⤟": "larrbfs",
                "⤠": "rarrbfs",
                "⤣": "nwarhk",
                "⤤": "nearhk",
                "⤥": "searhk",
                "⤦": "swarhk",
                "⤧": "nwnear",
                "⤨": "toea",
                "⤩": "tosa",
                "⤪": "swnwar",
                "⤳": "rarrc",
                "⤳̸": "nrarrc",
                "⤵": "cudarrr",
                "⤶": "ldca",
                "⤷": "rdca",
                "⤸": "cudarrl",
                "⤹": "larrpl",
                "⤼": "curarrm",
                "⤽": "cularrp",
                "⥅": "rarrpl",
                "⥈": "harrcir",
                "⥉": "Uarrocir",
                "⥊": "lurdshar",
                "⥋": "ldrushar",
                "⥎": "LeftRightVector",
                "⥏": "RightUpDownVector",
                "⥐": "DownLeftRightVector",
                "⥑": "LeftUpDownVector",
                "⥒": "LeftVectorBar",
                "⥓": "RightVectorBar",
                "⥔": "RightUpVectorBar",
                "⥕": "RightDownVectorBar",
                "⥖": "DownLeftVectorBar",
                "⥗": "DownRightVectorBar",
                "⥘": "LeftUpVectorBar",
                "⥙": "LeftDownVectorBar",
                "⥚": "LeftTeeVector",
                "⥛": "RightTeeVector",
                "⥜": "RightUpTeeVector",
                "⥝": "RightDownTeeVector",
                "⥞": "DownLeftTeeVector",
                "⥟": "DownRightTeeVector",
                "⥠": "LeftUpTeeVector",
                "⥡": "LeftDownTeeVector",
                "⥢": "lHar",
                "⥣": "uHar",
                "⥤": "rHar",
                "⥥": "dHar",
                "⥦": "luruhar",
                "⥧": "ldrdhar",
                "⥨": "ruluhar",
                "⥩": "rdldhar",
                "⥪": "lharul",
                "⥫": "llhard",
                "⥬": "rharul",
                "⥭": "lrhard",
                "⥮": "udhar",
                "⥯": "duhar",
                "⥰": "RoundImplies",
                "⥱": "erarr",
                "⥲": "simrarr",
                "⥳": "larrsim",
                "⥴": "rarrsim",
                "⥵": "rarrap",
                "⥶": "ltlarr",
                "⥸": "gtrarr",
                "⥹": "subrarr",
                "⥻": "suplarr",
                "⥼": "lfisht",
                "⥽": "rfisht",
                "⥾": "ufisht",
                "⥿": "dfisht",
                "⦚": "vzigzag",
                "⦜": "vangrt",
                "⦝": "angrtvbd",
                "⦤": "ange",
                "⦥": "range",
                "⦦": "dwangle",
                "⦧": "uwangle",
                "⦨": "angmsdaa",
                "⦩": "angmsdab",
                "⦪": "angmsdac",
                "⦫": "angmsdad",
                "⦬": "angmsdae",
                "⦭": "angmsdaf",
                "⦮": "angmsdag",
                "⦯": "angmsdah",
                "⦰": "bemptyv",
                "⦱": "demptyv",
                "⦲": "cemptyv",
                "⦳": "raemptyv",
                "⦴": "laemptyv",
                "⦵": "ohbar",
                "⦶": "omid",
                "⦷": "opar",
                "⦹": "operp",
                "⦻": "olcross",
                "⦼": "odsold",
                "⦾": "olcir",
                "⦿": "ofcir",
                "⧀": "olt",
                "⧁": "ogt",
                "⧂": "cirscir",
                "⧃": "cirE",
                "⧄": "solb",
                "⧅": "bsolb",
                "⧉": "boxbox",
                "⧍": "trisb",
                "⧎": "rtriltri",
                "⧏": "LeftTriangleBar",
                "⧏̸": "NotLeftTriangleBar",
                "⧐": "RightTriangleBar",
                "⧐̸": "NotRightTriangleBar",
                "⧜": "iinfin",
                "⧝": "infintie",
                "⧞": "nvinfin",
                "⧣": "eparsl",
                "⧤": "smeparsl",
                "⧥": "eqvparsl",
                "⧫": "lozf",
                "⧴": "RuleDelayed",
                "⧶": "dsol",
                "⨀": "xodot",
                "⨁": "xoplus",
                "⨂": "xotime",
                "⨄": "xuplus",
                "⨆": "xsqcup",
                "⨍": "fpartint",
                "⨐": "cirfnint",
                "⨑": "awint",
                "⨒": "rppolint",
                "⨓": "scpolint",
                "⨔": "npolint",
                "⨕": "pointint",
                "⨖": "quatint",
                "⨗": "intlarhk",
                "⨢": "pluscir",
                "⨣": "plusacir",
                "⨤": "simplus",
                "⨥": "plusdu",
                "⨦": "plussim",
                "⨧": "plustwo",
                "⨩": "mcomma",
                "⨪": "minusdu",
                "⨭": "loplus",
                "⨮": "roplus",
                "⨯": "Cross",
                "⨰": "timesd",
                "⨱": "timesbar",
                "⨳": "smashp",
                "⨴": "lotimes",
                "⨵": "rotimes",
                "⨶": "otimesas",
                "⨷": "Otimes",
                "⨸": "odiv",
                "⨹": "triplus",
                "⨺": "triminus",
                "⨻": "tritime",
                "⨼": "iprod",
                "⨿": "amalg",
                "⩀": "capdot",
                "⩂": "ncup",
                "⩃": "ncap",
                "⩄": "capand",
                "⩅": "cupor",
                "⩆": "cupcap",
                "⩇": "capcup",
                "⩈": "cupbrcap",
                "⩉": "capbrcup",
                "⩊": "cupcup",
                "⩋": "capcap",
                "⩌": "ccups",
                "⩍": "ccaps",
                "⩐": "ccupssm",
                "⩓": "And",
                "⩔": "Or",
                "⩕": "andand",
                "⩖": "oror",
                "⩗": "orslope",
                "⩘": "andslope",
                "⩚": "andv",
                "⩛": "orv",
                "⩜": "andd",
                "⩝": "ord",
                "⩟": "wedbar",
                "⩦": "sdote",
                "⩪": "simdot",
                "⩭": "congdot",
                "⩭̸": "ncongdot",
                "⩮": "easter",
                "⩯": "apacir",
                "⩰": "apE",
                "⩰̸": "napE",
                "⩱": "eplus",
                "⩲": "pluse",
                "⩳": "Esim",
                "⩷": "eDDot",
                "⩸": "equivDD",
                "⩹": "ltcir",
                "⩺": "gtcir",
                "⩻": "ltquest",
                "⩼": "gtquest",
                "⩽": "les",
                "⩽̸": "nles",
                "⩾": "ges",
                "⩾̸": "nges",
                "⩿": "lesdot",
                "⪀": "gesdot",
                "⪁": "lesdoto",
                "⪂": "gesdoto",
                "⪃": "lesdotor",
                "⪄": "gesdotol",
                "⪅": "lap",
                "⪆": "gap",
                "⪇": "lne",
                "⪈": "gne",
                "⪉": "lnap",
                "⪊": "gnap",
                "⪋": "lEg",
                "⪌": "gEl",
                "⪍": "lsime",
                "⪎": "gsime",
                "⪏": "lsimg",
                "⪐": "gsiml",
                "⪑": "lgE",
                "⪒": "glE",
                "⪓": "lesges",
                "⪔": "gesles",
                "⪕": "els",
                "⪖": "egs",
                "⪗": "elsdot",
                "⪘": "egsdot",
                "⪙": "el",
                "⪚": "eg",
                "⪝": "siml",
                "⪞": "simg",
                "⪟": "simlE",
                "⪠": "simgE",
                "⪡": "LessLess",
                "⪡̸": "NotNestedLessLess",
                "⪢": "GreaterGreater",
                "⪢̸": "NotNestedGreaterGreater",
                "⪤": "glj",
                "⪥": "gla",
                "⪦": "ltcc",
                "⪧": "gtcc",
                "⪨": "lescc",
                "⪩": "gescc",
                "⪪": "smt",
                "⪫": "lat",
                "⪬": "smte",
                "⪬︀": "smtes",
                "⪭": "late",
                "⪭︀": "lates",
                "⪮": "bumpE",
                "⪯": "pre",
                "⪯̸": "npre",
                "⪰": "sce",
                "⪰̸": "nsce",
                "⪳": "prE",
                "⪴": "scE",
                "⪵": "prnE",
                "⪶": "scnE",
                "⪷": "prap",
                "⪸": "scap",
                "⪹": "prnap",
                "⪺": "scnap",
                "⪻": "Pr",
                "⪼": "Sc",
                "⪽": "subdot",
                "⪾": "supdot",
                "⪿": "subplus",
                "⫀": "supplus",
                "⫁": "submult",
                "⫂": "supmult",
                "⫃": "subedot",
                "⫄": "supedot",
                "⫅": "subE",
                "⫅̸": "nsubE",
                "⫆": "supE",
                "⫆̸": "nsupE",
                "⫇": "subsim",
                "⫈": "supsim",
                "⫋︀": "vsubnE",
                "⫋": "subnE",
                "⫌︀": "vsupnE",
                "⫌": "supnE",
                "⫏": "csub",
                "⫐": "csup",
                "⫑": "csube",
                "⫒": "csupe",
                "⫓": "subsup",
                "⫔": "supsub",
                "⫕": "subsub",
                "⫖": "supsup",
                "⫗": "suphsub",
                "⫘": "supdsub",
                "⫙": "forkv",
                "⫚": "topfork",
                "⫛": "mlcp",
                "⫤": "Dashv",
                "⫦": "Vdashl",
                "⫧": "Barv",
                "⫨": "vBar",
                "⫩": "vBarv",
                "⫫": "Vbar",
                "⫬": "Not",
                "⫭": "bNot",
                "⫮": "rnmid",
                "⫯": "cirmid",
                "⫰": "midcir",
                "⫱": "topcir",
                "⫲": "nhpar",
                "⫳": "parsim",
                "⫽": "parsl",
                "⫽⃥": "nparsl",
                "♭": "flat",
                "♮": "natur",
                "♯": "sharp",
                "¤": "curren",
                "¢": "cent",
                "$": "dollar",
                "£": "pound",
                "¥": "yen",
                "€": "euro",
                "¹": "sup1",
                "½": "half",
                "⅓": "frac13",
                "¼": "frac14",
                "⅕": "frac15",
                "⅙": "frac16",
                "⅛": "frac18",
                "²": "sup2",
                "⅔": "frac23",
                "⅖": "frac25",
                "³": "sup3",
                "¾": "frac34",
                "⅗": "frac35",
                "⅜": "frac38",
                "⅘": "frac45",
                "⅚": "frac56",
                "⅝": "frac58",
                "⅞": "frac78",
                "\ud835\udcb6": "ascr",
                "\ud835\udd52": "aopf",
                "\ud835\udd1e": "afr",
                "\ud835\udd38": "Aopf",
                "\ud835\udd04": "Afr",
                "\ud835\udc9c": "Ascr",
                "ª": "ordf",
                "á": "aacute",
                "Á": "Aacute",
                "à": "agrave",
                "À": "Agrave",
                "ă": "abreve",
                "Ă": "Abreve",
                "â": "acirc",
                "Â": "Acirc",
                "å": "aring",
                "Å": "angst",
                "ä": "auml",
                "Ä": "Auml",
                "ã": "atilde",
                "Ã": "Atilde",
                "ą": "aogon",
                "Ą": "Aogon",
                "ā": "amacr",
                "Ā": "Amacr",
                "æ": "aelig",
                "Æ": "AElig",
                "\ud835\udcb7": "bscr",
                "\ud835\udd53": "bopf",
                "\ud835\udd1f": "bfr",
                "\ud835\udd39": "Bopf",
                "ℬ": "Bscr",
                "\ud835\udd05": "Bfr",
                "\ud835\udd20": "cfr",
                "\ud835\udcb8": "cscr",
                "\ud835\udd54": "copf",
                "ℭ": "Cfr",
                "\ud835\udc9e": "Cscr",
                "ℂ": "Copf",
                "ć": "cacute",
                "Ć": "Cacute",
                "ĉ": "ccirc",
                "Ĉ": "Ccirc",
                "č": "ccaron",
                "Č": "Ccaron",
                "ċ": "cdot",
                "Ċ": "Cdot",
                "ç": "ccedil",
                "Ç": "Ccedil",
                "℅": "incare",
                "\ud835\udd21": "dfr",
                "ⅆ": "dd",
                "\ud835\udd55": "dopf",
                "\ud835\udcb9": "dscr",
                "\ud835\udc9f": "Dscr",
                "\ud835\udd07": "Dfr",
                "ⅅ": "DD",
                "\ud835\udd3b": "Dopf",
                "ď": "dcaron",
                "Ď": "Dcaron",
                "đ": "dstrok",
                "Đ": "Dstrok",
                "ð": "eth",
                "Ð": "ETH",
                "ⅇ": "ee",
                "ℯ": "escr",
                "\ud835\udd22": "efr",
                "\ud835\udd56": "eopf",
                "ℰ": "Escr",
                "\ud835\udd08": "Efr",
                "\ud835\udd3c": "Eopf",
                "é": "eacute",
                "É": "Eacute",
                "è": "egrave",
                "È": "Egrave",
                "ê": "ecirc",
                "Ê": "Ecirc",
                "ě": "ecaron",
                "Ě": "Ecaron",
                "ë": "euml",
                "Ë": "Euml",
                "ė": "edot",
                "Ė": "Edot",
                "ę": "eogon",
                "Ę": "Eogon",
                "ē": "emacr",
                "Ē": "Emacr",
                "\ud835\udd23": "ffr",
                "\ud835\udd57": "fopf",
                "\ud835\udcbb": "fscr",
                "\ud835\udd09": "Ffr",
                "\ud835\udd3d": "Fopf",
                "ℱ": "Fscr",
                "ﬀ": "fflig",
                "ﬃ": "ffilig",
                "ﬄ": "ffllig",
                "ﬁ": "filig",
                "fj": "fjlig",
                "ﬂ": "fllig",
                "ƒ": "fnof",
                "ℊ": "gscr",
                "\ud835\udd58": "gopf",
                "\ud835\udd24": "gfr",
                "\ud835\udca2": "Gscr",
                "\ud835\udd3e": "Gopf",
                "\ud835\udd0a": "Gfr",
                "ǵ": "gacute",
                "ğ": "gbreve",
                "Ğ": "Gbreve",
                "ĝ": "gcirc",
                "Ĝ": "Gcirc",
                "ġ": "gdot",
                "Ġ": "Gdot",
                "Ģ": "Gcedil",
                "\ud835\udd25": "hfr",
                "ℎ": "planckh",
                "\ud835\udcbd": "hscr",
                "\ud835\udd59": "hopf",
                "ℋ": "Hscr",
                "ℌ": "Hfr",
                "ℍ": "Hopf",
                "ĥ": "hcirc",
                "Ĥ": "Hcirc",
                "ℏ": "hbar",
                "ħ": "hstrok",
                "Ħ": "Hstrok",
                "\ud835\udd5a": "iopf",
                "\ud835\udd26": "ifr",
                "\ud835\udcbe": "iscr",
                "ⅈ": "ii",
                "\ud835\udd40": "Iopf",
                "ℐ": "Iscr",
                "ℑ": "Im",
                "í": "iacute",
                "Í": "Iacute",
                "ì": "igrave",
                "Ì": "Igrave",
                "î": "icirc",
                "Î": "Icirc",
                "ï": "iuml",
                "Ï": "Iuml",
                "ĩ": "itilde",
                "Ĩ": "Itilde",
                "İ": "Idot",
                "į": "iogon",
                "Į": "Iogon",
                "ī": "imacr",
                "Ī": "Imacr",
                "ĳ": "ijlig",
                "Ĳ": "IJlig",
                "ı": "imath",
                "\ud835\udcbf": "jscr",
                "\ud835\udd5b": "jopf",
                "\ud835\udd27": "jfr",
                "\ud835\udca5": "Jscr",
                "\ud835\udd0d": "Jfr",
                "\ud835\udd41": "Jopf",
                "ĵ": "jcirc",
                "Ĵ": "Jcirc",
                "ȷ": "jmath",
                "\ud835\udd5c": "kopf",
                "\ud835\udcc0": "kscr",
                "\ud835\udd28": "kfr",
                "\ud835\udca6": "Kscr",
                "\ud835\udd42": "Kopf",
                "\ud835\udd0e": "Kfr",
                "ķ": "kcedil",
                "Ķ": "Kcedil",
                "\ud835\udd29": "lfr",
                "\ud835\udcc1": "lscr",
                "ℓ": "ell",
                "\ud835\udd5d": "lopf",
                "ℒ": "Lscr",
                "\ud835\udd0f": "Lfr",
                "\ud835\udd43": "Lopf",
                "ĺ": "lacute",
                "Ĺ": "Lacute",
                "ľ": "lcaron",
                "Ľ": "Lcaron",
                "ļ": "lcedil",
                "Ļ": "Lcedil",
                "ł": "lstrok",
                "Ł": "Lstrok",
                "ŀ": "lmidot",
                "Ŀ": "Lmidot",
                "\ud835\udd2a": "mfr",
                "\ud835\udd5e": "mopf",
                "\ud835\udcc2": "mscr",
                "\ud835\udd10": "Mfr",
                "\ud835\udd44": "Mopf",
                "ℳ": "Mscr",
                "\ud835\udd2b": "nfr",
                "\ud835\udd5f": "nopf",
                "\ud835\udcc3": "nscr",
                "ℕ": "Nopf",
                "\ud835\udca9": "Nscr",
                "\ud835\udd11": "Nfr",
                "ń": "nacute",
                "Ń": "Nacute",
                "ň": "ncaron",
                "Ň": "Ncaron",
                "ñ": "ntilde",
                "Ñ": "Ntilde",
                "ņ": "ncedil",
                "Ņ": "Ncedil",
                "№": "numero",
                "ŋ": "eng",
                "Ŋ": "ENG",
                "\ud835\udd60": "oopf",
                "\ud835\udd2c": "ofr",
                "ℴ": "oscr",
                "\ud835\udcaa": "Oscr",
                "\ud835\udd12": "Ofr",
                "\ud835\udd46": "Oopf",
                "º": "ordm",
                "ó": "oacute",
                "Ó": "Oacute",
                "ò": "ograve",
                "Ò": "Ograve",
                "ô": "ocirc",
                "Ô": "Ocirc",
                "ö": "ouml",
                "Ö": "Ouml",
                "ő": "odblac",
                "Ő": "Odblac",
                "õ": "otilde",
                "Õ": "Otilde",
                "ø": "oslash",
                "Ø": "Oslash",
                "ō": "omacr",
                "Ō": "Omacr",
                "œ": "oelig",
                "Œ": "OElig",
                "\ud835\udd2d": "pfr",
                "\ud835\udcc5": "pscr",
                "\ud835\udd61": "popf",
                "ℙ": "Popf",
                "\ud835\udd13": "Pfr",
                "\ud835\udcab": "Pscr",
                "\ud835\udd62": "qopf",
                "\ud835\udd2e": "qfr",
                "\ud835\udcc6": "qscr",
                "\ud835\udcac": "Qscr",
                "\ud835\udd14": "Qfr",
                "ℚ": "Qopf",
                "ĸ": "kgreen",
                "\ud835\udd2f": "rfr",
                "\ud835\udd63": "ropf",
                "\ud835\udcc7": "rscr",
                "ℛ": "Rscr",
                "ℜ": "Re",
                "ℝ": "Ropf",
                "ŕ": "racute",
                "Ŕ": "Racute",
                "ř": "rcaron",
                "Ř": "Rcaron",
                "ŗ": "rcedil",
                "Ŗ": "Rcedil",
                "\ud835\udd64": "sopf",
                "\ud835\udcc8": "sscr",
                "\ud835\udd30": "sfr",
                "\ud835\udd4a": "Sopf",
                "\ud835\udd16": "Sfr",
                "\ud835\udcae": "Sscr",
                "Ⓢ": "oS",
                "ś": "sacute",
                "Ś": "Sacute",
                "ŝ": "scirc",
                "Ŝ": "Scirc",
                "š": "scaron",
                "Š": "Scaron",
                "ş": "scedil",
                "Ş": "Scedil",
                "ß": "szlig",
                "\ud835\udd31": "tfr",
                "\ud835\udcc9": "tscr",
                "\ud835\udd65": "topf",
                "\ud835\udcaf": "Tscr",
                "\ud835\udd17": "Tfr",
                "\ud835\udd4b": "Topf",
                "ť": "tcaron",
                "Ť": "Tcaron",
                "ţ": "tcedil",
                "Ţ": "Tcedil",
                "™": "trade",
                "ŧ": "tstrok",
                "Ŧ": "Tstrok",
                "\ud835\udcca": "uscr",
                "\ud835\udd66": "uopf",
                "\ud835\udd32": "ufr",
                "\ud835\udd4c": "Uopf",
                "\ud835\udd18": "Ufr",
                "\ud835\udcb0": "Uscr",
                "ú": "uacute",
                "Ú": "Uacute",
                "ù": "ugrave",
                "Ù": "Ugrave",
                "ŭ": "ubreve",
                "Ŭ": "Ubreve",
                "û": "ucirc",
                "Û": "Ucirc",
                "ů": "uring",
                "Ů": "Uring",
                "ü": "uuml",
                "Ü": "Uuml",
                "ű": "udblac",
                "Ű": "Udblac",
                "ũ": "utilde",
                "Ũ": "Utilde",
                "ų": "uogon",
                "Ų": "Uogon",
                "ū": "umacr",
                "Ū": "Umacr",
                "\ud835\udd33": "vfr",
                "\ud835\udd67": "vopf",
                "\ud835\udccb": "vscr",
                "\ud835\udd19": "Vfr",
                "\ud835\udd4d": "Vopf",
                "\ud835\udcb1": "Vscr",
                "\ud835\udd68": "wopf",
                "\ud835\udccc": "wscr",
                "\ud835\udd34": "wfr",
                "\ud835\udcb2": "Wscr",
                "\ud835\udd4e": "Wopf",
                "\ud835\udd1a": "Wfr",
                "ŵ": "wcirc",
                "Ŵ": "Wcirc",
                "\ud835\udd35": "xfr",
                "\ud835\udccd": "xscr",
                "\ud835\udd69": "xopf",
                "\ud835\udd4f": "Xopf",
                "\ud835\udd1b": "Xfr",
                "\ud835\udcb3": "Xscr",
                "\ud835\udd36": "yfr",
                "\ud835\udcce": "yscr",
                "\ud835\udd6a": "yopf",
                "\ud835\udcb4": "Yscr",
                "\ud835\udd1c": "Yfr",
                "\ud835\udd50": "Yopf",
                "ý": "yacute",
                "Ý": "Yacute",
                "ŷ": "ycirc",
                "Ŷ": "Ycirc",
                "ÿ": "yuml",
                "Ÿ": "Yuml",
                "\ud835\udccf": "zscr",
                "\ud835\udd37": "zfr",
                "\ud835\udd6b": "zopf",
                "ℨ": "Zfr",
                "ℤ": "Zopf",
                "\ud835\udcb5": "Zscr",
                "ź": "zacute",
                "Ź": "Zacute",
                "ž": "zcaron",
                "Ž": "Zcaron",
                "ż": "zdot",
                "Ż": "Zdot",
                "Ƶ": "imped",
                "þ": "thorn",
                "Þ": "THORN",
                "ŉ": "napos",
                "α": "alpha",
                "Α": "Alpha",
                "β": "beta",
                "Β": "Beta",
                "γ": "gamma",
                "Γ": "Gamma",
                "δ": "delta",
                "Δ": "Delta",
                "ε": "epsi",
                "ϵ": "epsiv",
                "Ε": "Epsilon",
                "ϝ": "gammad",
                "Ϝ": "Gammad",
                "ζ": "zeta",
                "Ζ": "Zeta",
                "η": "eta",
                "Η": "Eta",
                "θ": "theta",
                "ϑ": "thetav",
                "Θ": "Theta",
                "ι": "iota",
                "Ι": "Iota",
                "κ": "kappa",
                "ϰ": "kappav",
                "Κ": "Kappa",
                "λ": "lambda",
                "Λ": "Lambda",
                "μ": "mu",
                "µ": "micro",
                "Μ": "Mu",
                "ν": "nu",
                "Ν": "Nu",
                "ξ": "xi",
                "Ξ": "Xi",
                "ο": "omicron",
                "Ο": "Omicron",
                "π": "pi",
                "ϖ": "piv",
                "Π": "Pi",
                "ρ": "rho",
                "ϱ": "rhov",
                "Ρ": "Rho",
                "σ": "sigma",
                "Σ": "Sigma",
                "ς": "sigmaf",
                "τ": "tau",
                "Τ": "Tau",
                "υ": "upsi",
                "Υ": "Upsilon",
                "ϒ": "Upsi",
                "φ": "phi",
                "ϕ": "phiv",
                "Φ": "Phi",
                "χ": "chi",
                "Χ": "Chi",
                "ψ": "psi",
                "Ψ": "Psi",
                "ω": "omega",
                "Ω": "ohm",
                "а": "acy",
                "А": "Acy",
                "б": "bcy",
                "Б": "Bcy",
                "в": "vcy",
                "В": "Vcy",
                "г": "gcy",
                "Г": "Gcy",
                "ѓ": "gjcy",
                "Ѓ": "GJcy",
                "д": "dcy",
                "Д": "Dcy",
                "ђ": "djcy",
                "Ђ": "DJcy",
                "е": "iecy",
                "Е": "IEcy",
                "ё": "iocy",
                "Ё": "IOcy",
                "є": "jukcy",
                "Є": "Jukcy",
                "ж": "zhcy",
                "Ж": "ZHcy",
                "з": "zcy",
                "З": "Zcy",
                "ѕ": "dscy",
                "Ѕ": "DScy",
                "и": "icy",
                "И": "Icy",
                "і": "iukcy",
                "І": "Iukcy",
                "ї": "yicy",
                "Ї": "YIcy",
                "й": "jcy",
                "Й": "Jcy",
                "ј": "jsercy",
                "Ј": "Jsercy",
                "к": "kcy",
                "К": "Kcy",
                "ќ": "kjcy",
                "Ќ": "KJcy",
                "л": "lcy",
                "Л": "Lcy",
                "љ": "ljcy",
                "Љ": "LJcy",
                "м": "mcy",
                "М": "Mcy",
                "н": "ncy",
                "Н": "Ncy",
                "њ": "njcy",
                "Њ": "NJcy",
                "о": "ocy",
                "О": "Ocy",
                "п": "pcy",
                "П": "Pcy",
                "р": "rcy",
                "Р": "Rcy",
                "с": "scy",
                "С": "Scy",
                "т": "tcy",
                "Т": "Tcy",
                "ћ": "tshcy",
                "Ћ": "TSHcy",
                "у": "ucy",
                "У": "Ucy",
                "ў": "ubrcy",
                "Ў": "Ubrcy",
                "ф": "fcy",
                "Ф": "Fcy",
                "х": "khcy",
                "Х": "KHcy",
                "ц": "tscy",
                "Ц": "TScy",
                "ч": "chcy",
                "Ч": "CHcy",
                "џ": "dzcy",
                "Џ": "DZcy",
                "ш": "shcy",
                "Ш": "SHcy",
                "щ": "shchcy",
                "Щ": "SHCHcy",
                "ъ": "hardcy",
                "Ъ": "HARDcy",
                "ы": "ycy",
                "Ы": "Ycy",
                "ь": "softcy",
                "Ь": "SOFTcy",
                "э": "ecy",
                "Э": "Ecy",
                "ю": "yucy",
                "Ю": "YUcy",
                "я": "yacy",
                "Я": "YAcy",
                "ℵ": "aleph",
                "ℶ": "beth",
                "ℷ": "gimel",
                "ℸ": "daleth"
            };
            var regexEscape = /["&'<>`]/g;
            var escapeMap = {
                '"': "\x26quot;",
                "\x26": "\x26amp;",
                "'": "\x26#x27;",
                "\x3c": "\x26lt;",
                "\x3e": "\x26gt;",
                "`": "\x26#x60;"
            };
            var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
            var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
            var decodeMap = {
                "aacute": "á",
                "Aacute": "Á",
                "abreve": "ă",
                "Abreve": "Ă",
                "ac": "∾",
                "acd": "∿",
                "acE": "∾̳",
                "acirc": "â",
                "Acirc": "Â",
                "acute": "´",
                "acy": "а",
                "Acy": "А",
                "aelig": "æ",
                "AElig": "Æ",
                "af": "⁡",
                "afr": "\ud835\udd1e",
                "Afr": "\ud835\udd04",
                "agrave": "à",
                "Agrave": "À",
                "alefsym": "ℵ",
                "aleph": "ℵ",
                "alpha": "α",
                "Alpha": "Α",
                "amacr": "ā",
                "Amacr": "Ā",
                "amalg": "⨿",
                "amp": "\x26",
                "AMP": "\x26",
                "and": "∧",
                "And": "⩓",
                "andand": "⩕",
                "andd": "⩜",
                "andslope": "⩘",
                "andv": "⩚",
                "ang": "∠",
                "ange": "⦤",
                "angle": "∠",
                "angmsd": "∡",
                "angmsdaa": "⦨",
                "angmsdab": "⦩",
                "angmsdac": "⦪",
                "angmsdad": "⦫",
                "angmsdae": "⦬",
                "angmsdaf": "⦭",
                "angmsdag": "⦮",
                "angmsdah": "⦯",
                "angrt": "∟",
                "angrtvb": "⊾",
                "angrtvbd": "⦝",
                "angsph": "∢",
                "angst": "Å",
                "angzarr": "⍼",
                "aogon": "ą",
                "Aogon": "Ą",
                "aopf": "\ud835\udd52",
                "Aopf": "\ud835\udd38",
                "ap": "≈",
                "apacir": "⩯",
                "ape": "≊",
                "apE": "⩰",
                "apid": "≋",
                "apos": "'",
                "ApplyFunction": "⁡",
                "approx": "≈",
                "approxeq": "≊",
                "aring": "å",
                "Aring": "Å",
                "ascr": "\ud835\udcb6",
                "Ascr": "\ud835\udc9c",
                "Assign": "≔",
                "ast": "*",
                "asymp": "≈",
                "asympeq": "≍",
                "atilde": "ã",
                "Atilde": "Ã",
                "auml": "ä",
                "Auml": "Ä",
                "awconint": "∳",
                "awint": "⨑",
                "backcong": "≌",
                "backepsilon": "϶",
                "backprime": "‵",
                "backsim": "∽",
                "backsimeq": "⋍",
                "Backslash": "∖",
                "Barv": "⫧",
                "barvee": "⊽",
                "barwed": "⌅",
                "Barwed": "⌆",
                "barwedge": "⌅",
                "bbrk": "⎵",
                "bbrktbrk": "⎶",
                "bcong": "≌",
                "bcy": "б",
                "Bcy": "Б",
                "bdquo": "„",
                "becaus": "∵",
                "because": "∵",
                "Because": "∵",
                "bemptyv": "⦰",
                "bepsi": "϶",
                "bernou": "ℬ",
                "Bernoullis": "ℬ",
                "beta": "β",
                "Beta": "Β",
                "beth": "ℶ",
                "between": "≬",
                "bfr": "\ud835\udd1f",
                "Bfr": "\ud835\udd05",
                "bigcap": "⋂",
                "bigcirc": "◯",
                "bigcup": "⋃",
                "bigodot": "⨀",
                "bigoplus": "⨁",
                "bigotimes": "⨂",
                "bigsqcup": "⨆",
                "bigstar": "★",
                "bigtriangledown": "▽",
                "bigtriangleup": "△",
                "biguplus": "⨄",
                "bigvee": "⋁",
                "bigwedge": "⋀",
                "bkarow": "⤍",
                "blacklozenge": "⧫",
                "blacksquare": "▪",
                "blacktriangle": "▴",
                "blacktriangledown": "▾",
                "blacktriangleleft": "◂",
                "blacktriangleright": "▸",
                "blank": "␣",
                "blk12": "▒",
                "blk14": "░",
                "blk34": "▓",
                "block": "█",
                "bne": "\x3d⃥",
                "bnequiv": "≡⃥",
                "bnot": "⌐",
                "bNot": "⫭",
                "bopf": "\ud835\udd53",
                "Bopf": "\ud835\udd39",
                "bot": "⊥",
                "bottom": "⊥",
                "bowtie": "⋈",
                "boxbox": "⧉",
                "boxdl": "┐",
                "boxdL": "╕",
                "boxDl": "╖",
                "boxDL": "╗",
                "boxdr": "┌",
                "boxdR": "╒",
                "boxDr": "╓",
                "boxDR": "╔",
                "boxh": "─",
                "boxH": "═",
                "boxhd": "┬",
                "boxhD": "╥",
                "boxHd": "╤",
                "boxHD": "╦",
                "boxhu": "┴",
                "boxhU": "╨",
                "boxHu": "╧",
                "boxHU": "╩",
                "boxminus": "⊟",
                "boxplus": "⊞",
                "boxtimes": "⊠",
                "boxul": "┘",
                "boxuL": "╛",
                "boxUl": "╜",
                "boxUL": "╝",
                "boxur": "└",
                "boxuR": "╘",
                "boxUr": "╙",
                "boxUR": "╚",
                "boxv": "│",
                "boxV": "║",
                "boxvh": "┼",
                "boxvH": "╪",
                "boxVh": "╫",
                "boxVH": "╬",
                "boxvl": "┤",
                "boxvL": "╡",
                "boxVl": "╢",
                "boxVL": "╣",
                "boxvr": "├",
                "boxvR": "╞",
                "boxVr": "╟",
                "boxVR": "╠",
                "bprime": "‵",
                "breve": "˘",
                "Breve": "˘",
                "brvbar": "¦",
                "bscr": "\ud835\udcb7",
                "Bscr": "ℬ",
                "bsemi": "⁏",
                "bsim": "∽",
                "bsime": "⋍",
                "bsol": "\\",
                "bsolb": "⧅",
                "bsolhsub": "⟈",
                "bull": "•",
                "bullet": "•",
                "bump": "≎",
                "bumpe": "≏",
                "bumpE": "⪮",
                "bumpeq": "≏",
                "Bumpeq": "≎",
                "cacute": "ć",
                "Cacute": "Ć",
                "cap": "∩",
                "Cap": "⋒",
                "capand": "⩄",
                "capbrcup": "⩉",
                "capcap": "⩋",
                "capcup": "⩇",
                "capdot": "⩀",
                "CapitalDifferentialD": "ⅅ",
                "caps": "∩︀",
                "caret": "⁁",
                "caron": "ˇ",
                "Cayleys": "ℭ",
                "ccaps": "⩍",
                "ccaron": "č",
                "Ccaron": "Č",
                "ccedil": "ç",
                "Ccedil": "Ç",
                "ccirc": "ĉ",
                "Ccirc": "Ĉ",
                "Cconint": "∰",
                "ccups": "⩌",
                "ccupssm": "⩐",
                "cdot": "ċ",
                "Cdot": "Ċ",
                "cedil": "¸",
                "Cedilla": "¸",
                "cemptyv": "⦲",
                "cent": "¢",
                "centerdot": "·",
                "CenterDot": "·",
                "cfr": "\ud835\udd20",
                "Cfr": "ℭ",
                "chcy": "ч",
                "CHcy": "Ч",
                "check": "✓",
                "checkmark": "✓",
                "chi": "χ",
                "Chi": "Χ",
                "cir": "○",
                "circ": "ˆ",
                "circeq": "≗",
                "circlearrowleft": "↺",
                "circlearrowright": "↻",
                "circledast": "⊛",
                "circledcirc": "⊚",
                "circleddash": "⊝",
                "CircleDot": "⊙",
                "circledR": "®",
                "circledS": "Ⓢ",
                "CircleMinus": "⊖",
                "CirclePlus": "⊕",
                "CircleTimes": "⊗",
                "cire": "≗",
                "cirE": "⧃",
                "cirfnint": "⨐",
                "cirmid": "⫯",
                "cirscir": "⧂",
                "ClockwiseContourIntegral": "∲",
                "CloseCurlyDoubleQuote": "”",
                "CloseCurlyQuote": "’",
                "clubs": "♣",
                "clubsuit": "♣",
                "colon": ":",
                "Colon": "∷",
                "colone": "≔",
                "Colone": "⩴",
                "coloneq": "≔",
                "comma": ",",
                "commat": "@",
                "comp": "∁",
                "compfn": "∘",
                "complement": "∁",
                "complexes": "ℂ",
                "cong": "≅",
                "congdot": "⩭",
                "Congruent": "≡",
                "conint": "∮",
                "Conint": "∯",
                "ContourIntegral": "∮",
                "copf": "\ud835\udd54",
                "Copf": "ℂ",
                "coprod": "∐",
                "Coproduct": "∐",
                "copy": "©",
                "COPY": "©",
                "copysr": "℗",
                "CounterClockwiseContourIntegral": "∳",
                "crarr": "↵",
                "cross": "✗",
                "Cross": "⨯",
                "cscr": "\ud835\udcb8",
                "Cscr": "\ud835\udc9e",
                "csub": "⫏",
                "csube": "⫑",
                "csup": "⫐",
                "csupe": "⫒",
                "ctdot": "⋯",
                "cudarrl": "⤸",
                "cudarrr": "⤵",
                "cuepr": "⋞",
                "cuesc": "⋟",
                "cularr": "↶",
                "cularrp": "⤽",
                "cup": "∪",
                "Cup": "⋓",
                "cupbrcap": "⩈",
                "cupcap": "⩆",
                "CupCap": "≍",
                "cupcup": "⩊",
                "cupdot": "⊍",
                "cupor": "⩅",
                "cups": "∪︀",
                "curarr": "↷",
                "curarrm": "⤼",
                "curlyeqprec": "⋞",
                "curlyeqsucc": "⋟",
                "curlyvee": "⋎",
                "curlywedge": "⋏",
                "curren": "¤",
                "curvearrowleft": "↶",
                "curvearrowright": "↷",
                "cuvee": "⋎",
                "cuwed": "⋏",
                "cwconint": "∲",
                "cwint": "∱",
                "cylcty": "⌭",
                "dagger": "†",
                "Dagger": "‡",
                "daleth": "ℸ",
                "darr": "↓",
                "dArr": "⇓",
                "Darr": "↡",
                "dash": "‐",
                "dashv": "⊣",
                "Dashv": "⫤",
                "dbkarow": "⤏",
                "dblac": "˝",
                "dcaron": "ď",
                "Dcaron": "Ď",
                "dcy": "д",
                "Dcy": "Д",
                "dd": "ⅆ",
                "DD": "ⅅ",
                "ddagger": "‡",
                "ddarr": "⇊",
                "DDotrahd": "⤑",
                "ddotseq": "⩷",
                "deg": "°",
                "Del": "∇",
                "delta": "δ",
                "Delta": "Δ",
                "demptyv": "⦱",
                "dfisht": "⥿",
                "dfr": "\ud835\udd21",
                "Dfr": "\ud835\udd07",
                "dHar": "⥥",
                "dharl": "⇃",
                "dharr": "⇂",
                "DiacriticalAcute": "´",
                "DiacriticalDot": "˙",
                "DiacriticalDoubleAcute": "˝",
                "DiacriticalGrave": "`",
                "DiacriticalTilde": "˜",
                "diam": "⋄",
                "diamond": "⋄",
                "Diamond": "⋄",
                "diamondsuit": "♦",
                "diams": "♦",
                "die": "¨",
                "DifferentialD": "ⅆ",
                "digamma": "ϝ",
                "disin": "⋲",
                "div": "÷",
                "divide": "÷",
                "divideontimes": "⋇",
                "divonx": "⋇",
                "djcy": "ђ",
                "DJcy": "Ђ",
                "dlcorn": "⌞",
                "dlcrop": "⌍",
                "dollar": "$",
                "dopf": "\ud835\udd55",
                "Dopf": "\ud835\udd3b",
                "dot": "˙",
                "Dot": "¨",
                "DotDot": "⃜",
                "doteq": "≐",
                "doteqdot": "≑",
                "DotEqual": "≐",
                "dotminus": "∸",
                "dotplus": "∔",
                "dotsquare": "⊡",
                "doublebarwedge": "⌆",
                "DoubleContourIntegral": "∯",
                "DoubleDot": "¨",
                "DoubleDownArrow": "⇓",
                "DoubleLeftArrow": "⇐",
                "DoubleLeftRightArrow": "⇔",
                "DoubleLeftTee": "⫤",
                "DoubleLongLeftArrow": "⟸",
                "DoubleLongLeftRightArrow": "⟺",
                "DoubleLongRightArrow": "⟹",
                "DoubleRightArrow": "⇒",
                "DoubleRightTee": "⊨",
                "DoubleUpArrow": "⇑",
                "DoubleUpDownArrow": "⇕",
                "DoubleVerticalBar": "∥",
                "downarrow": "↓",
                "Downarrow": "⇓",
                "DownArrow": "↓",
                "DownArrowBar": "⤓",
                "DownArrowUpArrow": "⇵",
                "DownBreve": "̑",
                "downdownarrows": "⇊",
                "downharpoonleft": "⇃",
                "downharpoonright": "⇂",
                "DownLeftRightVector": "⥐",
                "DownLeftTeeVector": "⥞",
                "DownLeftVector": "↽",
                "DownLeftVectorBar": "⥖",
                "DownRightTeeVector": "⥟",
                "DownRightVector": "⇁",
                "DownRightVectorBar": "⥗",
                "DownTee": "⊤",
                "DownTeeArrow": "↧",
                "drbkarow": "⤐",
                "drcorn": "⌟",
                "drcrop": "⌌",
                "dscr": "\ud835\udcb9",
                "Dscr": "\ud835\udc9f",
                "dscy": "ѕ",
                "DScy": "Ѕ",
                "dsol": "⧶",
                "dstrok": "đ",
                "Dstrok": "Đ",
                "dtdot": "⋱",
                "dtri": "▿",
                "dtrif": "▾",
                "duarr": "⇵",
                "duhar": "⥯",
                "dwangle": "⦦",
                "dzcy": "џ",
                "DZcy": "Џ",
                "dzigrarr": "⟿",
                "eacute": "é",
                "Eacute": "É",
                "easter": "⩮",
                "ecaron": "ě",
                "Ecaron": "Ě",
                "ecir": "≖",
                "ecirc": "ê",
                "Ecirc": "Ê",
                "ecolon": "≕",
                "ecy": "э",
                "Ecy": "Э",
                "eDDot": "⩷",
                "edot": "ė",
                "eDot": "≑",
                "Edot": "Ė",
                "ee": "ⅇ",
                "efDot": "≒",
                "efr": "\ud835\udd22",
                "Efr": "\ud835\udd08",
                "eg": "⪚",
                "egrave": "è",
                "Egrave": "È",
                "egs": "⪖",
                "egsdot": "⪘",
                "el": "⪙",
                "Element": "∈",
                "elinters": "⏧",
                "ell": "ℓ",
                "els": "⪕",
                "elsdot": "⪗",
                "emacr": "ē",
                "Emacr": "Ē",
                "empty": "∅",
                "emptyset": "∅",
                "EmptySmallSquare": "◻",
                "emptyv": "∅",
                "EmptyVerySmallSquare": "▫",
                "emsp": " ",
                "emsp13": " ",
                "emsp14": " ",
                "eng": "ŋ",
                "ENG": "Ŋ",
                "ensp": " ",
                "eogon": "ę",
                "Eogon": "Ę",
                "eopf": "\ud835\udd56",
                "Eopf": "\ud835\udd3c",
                "epar": "⋕",
                "eparsl": "⧣",
                "eplus": "⩱",
                "epsi": "ε",
                "epsilon": "ε",
                "Epsilon": "Ε",
                "epsiv": "ϵ",
                "eqcirc": "≖",
                "eqcolon": "≕",
                "eqsim": "≂",
                "eqslantgtr": "⪖",
                "eqslantless": "⪕",
                "Equal": "⩵",
                "equals": "\x3d",
                "EqualTilde": "≂",
                "equest": "≟",
                "Equilibrium": "⇌",
                "equiv": "≡",
                "equivDD": "⩸",
                "eqvparsl": "⧥",
                "erarr": "⥱",
                "erDot": "≓",
                "escr": "ℯ",
                "Escr": "ℰ",
                "esdot": "≐",
                "esim": "≂",
                "Esim": "⩳",
                "eta": "η",
                "Eta": "Η",
                "eth": "ð",
                "ETH": "Ð",
                "euml": "ë",
                "Euml": "Ë",
                "euro": "€",
                "excl": "!",
                "exist": "∃",
                "Exists": "∃",
                "expectation": "ℰ",
                "exponentiale": "ⅇ",
                "ExponentialE": "ⅇ",
                "fallingdotseq": "≒",
                "fcy": "ф",
                "Fcy": "Ф",
                "female": "♀",
                "ffilig": "ﬃ",
                "fflig": "ﬀ",
                "ffllig": "ﬄ",
                "ffr": "\ud835\udd23",
                "Ffr": "\ud835\udd09",
                "filig": "ﬁ",
                "FilledSmallSquare": "◼",
                "FilledVerySmallSquare": "▪",
                "fjlig": "fj",
                "flat": "♭",
                "fllig": "ﬂ",
                "fltns": "▱",
                "fnof": "ƒ",
                "fopf": "\ud835\udd57",
                "Fopf": "\ud835\udd3d",
                "forall": "∀",
                "ForAll": "∀",
                "fork": "⋔",
                "forkv": "⫙",
                "Fouriertrf": "ℱ",
                "fpartint": "⨍",
                "frac12": "½",
                "frac13": "⅓",
                "frac14": "¼",
                "frac15": "⅕",
                "frac16": "⅙",
                "frac18": "⅛",
                "frac23": "⅔",
                "frac25": "⅖",
                "frac34": "¾",
                "frac35": "⅗",
                "frac38": "⅜",
                "frac45": "⅘",
                "frac56": "⅚",
                "frac58": "⅝",
                "frac78": "⅞",
                "frasl": "⁄",
                "frown": "⌢",
                "fscr": "\ud835\udcbb",
                "Fscr": "ℱ",
                "gacute": "ǵ",
                "gamma": "γ",
                "Gamma": "Γ",
                "gammad": "ϝ",
                "Gammad": "Ϝ",
                "gap": "⪆",
                "gbreve": "ğ",
                "Gbreve": "Ğ",
                "Gcedil": "Ģ",
                "gcirc": "ĝ",
                "Gcirc": "Ĝ",
                "gcy": "г",
                "Gcy": "Г",
                "gdot": "ġ",
                "Gdot": "Ġ",
                "ge": "≥",
                "gE": "≧",
                "gel": "⋛",
                "gEl": "⪌",
                "geq": "≥",
                "geqq": "≧",
                "geqslant": "⩾",
                "ges": "⩾",
                "gescc": "⪩",
                "gesdot": "⪀",
                "gesdoto": "⪂",
                "gesdotol": "⪄",
                "gesl": "⋛︀",
                "gesles": "⪔",
                "gfr": "\ud835\udd24",
                "Gfr": "\ud835\udd0a",
                "gg": "≫",
                "Gg": "⋙",
                "ggg": "⋙",
                "gimel": "ℷ",
                "gjcy": "ѓ",
                "GJcy": "Ѓ",
                "gl": "≷",
                "gla": "⪥",
                "glE": "⪒",
                "glj": "⪤",
                "gnap": "⪊",
                "gnapprox": "⪊",
                "gne": "⪈",
                "gnE": "≩",
                "gneq": "⪈",
                "gneqq": "≩",
                "gnsim": "⋧",
                "gopf": "\ud835\udd58",
                "Gopf": "\ud835\udd3e",
                "grave": "`",
                "GreaterEqual": "≥",
                "GreaterEqualLess": "⋛",
                "GreaterFullEqual": "≧",
                "GreaterGreater": "⪢",
                "GreaterLess": "≷",
                "GreaterSlantEqual": "⩾",
                "GreaterTilde": "≳",
                "gscr": "ℊ",
                "Gscr": "\ud835\udca2",
                "gsim": "≳",
                "gsime": "⪎",
                "gsiml": "⪐",
                "gt": "\x3e",
                "Gt": "≫",
                "GT": "\x3e",
                "gtcc": "⪧",
                "gtcir": "⩺",
                "gtdot": "⋗",
                "gtlPar": "⦕",
                "gtquest": "⩼",
                "gtrapprox": "⪆",
                "gtrarr": "⥸",
                "gtrdot": "⋗",
                "gtreqless": "⋛",
                "gtreqqless": "⪌",
                "gtrless": "≷",
                "gtrsim": "≳",
                "gvertneqq": "≩︀",
                "gvnE": "≩︀",
                "Hacek": "ˇ",
                "hairsp": " ",
                "half": "½",
                "hamilt": "ℋ",
                "hardcy": "ъ",
                "HARDcy": "Ъ",
                "harr": "↔",
                "hArr": "⇔",
                "harrcir": "⥈",
                "harrw": "↭",
                "Hat": "^",
                "hbar": "ℏ",
                "hcirc": "ĥ",
                "Hcirc": "Ĥ",
                "hearts": "♥",
                "heartsuit": "♥",
                "hellip": "…",
                "hercon": "⊹",
                "hfr": "\ud835\udd25",
                "Hfr": "ℌ",
                "HilbertSpace": "ℋ",
                "hksearow": "⤥",
                "hkswarow": "⤦",
                "hoarr": "⇿",
                "homtht": "∻",
                "hookleftarrow": "↩",
                "hookrightarrow": "↪",
                "hopf": "\ud835\udd59",
                "Hopf": "ℍ",
                "horbar": "―",
                "HorizontalLine": "─",
                "hscr": "\ud835\udcbd",
                "Hscr": "ℋ",
                "hslash": "ℏ",
                "hstrok": "ħ",
                "Hstrok": "Ħ",
                "HumpDownHump": "≎",
                "HumpEqual": "≏",
                "hybull": "⁃",
                "hyphen": "‐",
                "iacute": "í",
                "Iacute": "Í",
                "ic": "⁣",
                "icirc": "î",
                "Icirc": "Î",
                "icy": "и",
                "Icy": "И",
                "Idot": "İ",
                "iecy": "е",
                "IEcy": "Е",
                "iexcl": "¡",
                "iff": "⇔",
                "ifr": "\ud835\udd26",
                "Ifr": "ℑ",
                "igrave": "ì",
                "Igrave": "Ì",
                "ii": "ⅈ",
                "iiiint": "⨌",
                "iiint": "∭",
                "iinfin": "⧜",
                "iiota": "℩",
                "ijlig": "ĳ",
                "IJlig": "Ĳ",
                "Im": "ℑ",
                "imacr": "ī",
                "Imacr": "Ī",
                "image": "ℑ",
                "ImaginaryI": "ⅈ",
                "imagline": "ℐ",
                "imagpart": "ℑ",
                "imath": "ı",
                "imof": "⊷",
                "imped": "Ƶ",
                "Implies": "⇒",
                "in": "∈",
                "incare": "℅",
                "infin": "∞",
                "infintie": "⧝",
                "inodot": "ı",
                "int": "∫",
                "Int": "∬",
                "intcal": "⊺",
                "integers": "ℤ",
                "Integral": "∫",
                "intercal": "⊺",
                "Intersection": "⋂",
                "intlarhk": "⨗",
                "intprod": "⨼",
                "InvisibleComma": "⁣",
                "InvisibleTimes": "⁢",
                "iocy": "ё",
                "IOcy": "Ё",
                "iogon": "į",
                "Iogon": "Į",
                "iopf": "\ud835\udd5a",
                "Iopf": "\ud835\udd40",
                "iota": "ι",
                "Iota": "Ι",
                "iprod": "⨼",
                "iquest": "¿",
                "iscr": "\ud835\udcbe",
                "Iscr": "ℐ",
                "isin": "∈",
                "isindot": "⋵",
                "isinE": "⋹",
                "isins": "⋴",
                "isinsv": "⋳",
                "isinv": "∈",
                "it": "⁢",
                "itilde": "ĩ",
                "Itilde": "Ĩ",
                "iukcy": "і",
                "Iukcy": "І",
                "iuml": "ï",
                "Iuml": "Ï",
                "jcirc": "ĵ",
                "Jcirc": "Ĵ",
                "jcy": "й",
                "Jcy": "Й",
                "jfr": "\ud835\udd27",
                "Jfr": "\ud835\udd0d",
                "jmath": "ȷ",
                "jopf": "\ud835\udd5b",
                "Jopf": "\ud835\udd41",
                "jscr": "\ud835\udcbf",
                "Jscr": "\ud835\udca5",
                "jsercy": "ј",
                "Jsercy": "Ј",
                "jukcy": "є",
                "Jukcy": "Є",
                "kappa": "κ",
                "Kappa": "Κ",
                "kappav": "ϰ",
                "kcedil": "ķ",
                "Kcedil": "Ķ",
                "kcy": "к",
                "Kcy": "К",
                "kfr": "\ud835\udd28",
                "Kfr": "\ud835\udd0e",
                "kgreen": "ĸ",
                "khcy": "х",
                "KHcy": "Х",
                "kjcy": "ќ",
                "KJcy": "Ќ",
                "kopf": "\ud835\udd5c",
                "Kopf": "\ud835\udd42",
                "kscr": "\ud835\udcc0",
                "Kscr": "\ud835\udca6",
                "lAarr": "⇚",
                "lacute": "ĺ",
                "Lacute": "Ĺ",
                "laemptyv": "⦴",
                "lagran": "ℒ",
                "lambda": "λ",
                "Lambda": "Λ",
                "lang": "⟨",
                "Lang": "⟪",
                "langd": "⦑",
                "langle": "⟨",
                "lap": "⪅",
                "Laplacetrf": "ℒ",
                "laquo": "«",
                "larr": "←",
                "lArr": "⇐",
                "Larr": "↞",
                "larrb": "⇤",
                "larrbfs": "⤟",
                "larrfs": "⤝",
                "larrhk": "↩",
                "larrlp": "↫",
                "larrpl": "⤹",
                "larrsim": "⥳",
                "larrtl": "↢",
                "lat": "⪫",
                "latail": "⤙",
                "lAtail": "⤛",
                "late": "⪭",
                "lates": "⪭︀",
                "lbarr": "⤌",
                "lBarr": "⤎",
                "lbbrk": "❲",
                "lbrace": "{",
                "lbrack": "[",
                "lbrke": "⦋",
                "lbrksld": "⦏",
                "lbrkslu": "⦍",
                "lcaron": "ľ",
                "Lcaron": "Ľ",
                "lcedil": "ļ",
                "Lcedil": "Ļ",
                "lceil": "⌈",
                "lcub": "{",
                "lcy": "л",
                "Lcy": "Л",
                "ldca": "⤶",
                "ldquo": "“",
                "ldquor": "„",
                "ldrdhar": "⥧",
                "ldrushar": "⥋",
                "ldsh": "↲",
                "le": "≤",
                "lE": "≦",
                "LeftAngleBracket": "⟨",
                "leftarrow": "←",
                "Leftarrow": "⇐",
                "LeftArrow": "←",
                "LeftArrowBar": "⇤",
                "LeftArrowRightArrow": "⇆",
                "leftarrowtail": "↢",
                "LeftCeiling": "⌈",
                "LeftDoubleBracket": "⟦",
                "LeftDownTeeVector": "⥡",
                "LeftDownVector": "⇃",
                "LeftDownVectorBar": "⥙",
                "LeftFloor": "⌊",
                "leftharpoondown": "↽",
                "leftharpoonup": "↼",
                "leftleftarrows": "⇇",
                "leftrightarrow": "↔",
                "Leftrightarrow": "⇔",
                "LeftRightArrow": "↔",
                "leftrightarrows": "⇆",
                "leftrightharpoons": "⇋",
                "leftrightsquigarrow": "↭",
                "LeftRightVector": "⥎",
                "LeftTee": "⊣",
                "LeftTeeArrow": "↤",
                "LeftTeeVector": "⥚",
                "leftthreetimes": "⋋",
                "LeftTriangle": "⊲",
                "LeftTriangleBar": "⧏",
                "LeftTriangleEqual": "⊴",
                "LeftUpDownVector": "⥑",
                "LeftUpTeeVector": "⥠",
                "LeftUpVector": "↿",
                "LeftUpVectorBar": "⥘",
                "LeftVector": "↼",
                "LeftVectorBar": "⥒",
                "leg": "⋚",
                "lEg": "⪋",
                "leq": "≤",
                "leqq": "≦",
                "leqslant": "⩽",
                "les": "⩽",
                "lescc": "⪨",
                "lesdot": "⩿",
                "lesdoto": "⪁",
                "lesdotor": "⪃",
                "lesg": "⋚︀",
                "lesges": "⪓",
                "lessapprox": "⪅",
                "lessdot": "⋖",
                "lesseqgtr": "⋚",
                "lesseqqgtr": "⪋",
                "LessEqualGreater": "⋚",
                "LessFullEqual": "≦",
                "LessGreater": "≶",
                "lessgtr": "≶",
                "LessLess": "⪡",
                "lesssim": "≲",
                "LessSlantEqual": "⩽",
                "LessTilde": "≲",
                "lfisht": "⥼",
                "lfloor": "⌊",
                "lfr": "\ud835\udd29",
                "Lfr": "\ud835\udd0f",
                "lg": "≶",
                "lgE": "⪑",
                "lHar": "⥢",
                "lhard": "↽",
                "lharu": "↼",
                "lharul": "⥪",
                "lhblk": "▄",
                "ljcy": "љ",
                "LJcy": "Љ",
                "ll": "≪",
                "Ll": "⋘",
                "llarr": "⇇",
                "llcorner": "⌞",
                "Lleftarrow": "⇚",
                "llhard": "⥫",
                "lltri": "◺",
                "lmidot": "ŀ",
                "Lmidot": "Ŀ",
                "lmoust": "⎰",
                "lmoustache": "⎰",
                "lnap": "⪉",
                "lnapprox": "⪉",
                "lne": "⪇",
                "lnE": "≨",
                "lneq": "⪇",
                "lneqq": "≨",
                "lnsim": "⋦",
                "loang": "⟬",
                "loarr": "⇽",
                "lobrk": "⟦",
                "longleftarrow": "⟵",
                "Longleftarrow": "⟸",
                "LongLeftArrow": "⟵",
                "longleftrightarrow": "⟷",
                "Longleftrightarrow": "⟺",
                "LongLeftRightArrow": "⟷",
                "longmapsto": "⟼",
                "longrightarrow": "⟶",
                "Longrightarrow": "⟹",
                "LongRightArrow": "⟶",
                "looparrowleft": "↫",
                "looparrowright": "↬",
                "lopar": "⦅",
                "lopf": "\ud835\udd5d",
                "Lopf": "\ud835\udd43",
                "loplus": "⨭",
                "lotimes": "⨴",
                "lowast": "∗",
                "lowbar": "_",
                "LowerLeftArrow": "↙",
                "LowerRightArrow": "↘",
                "loz": "◊",
                "lozenge": "◊",
                "lozf": "⧫",
                "lpar": "(",
                "lparlt": "⦓",
                "lrarr": "⇆",
                "lrcorner": "⌟",
                "lrhar": "⇋",
                "lrhard": "⥭",
                "lrm": "‎",
                "lrtri": "⊿",
                "lsaquo": "‹",
                "lscr": "\ud835\udcc1",
                "Lscr": "ℒ",
                "lsh": "↰",
                "Lsh": "↰",
                "lsim": "≲",
                "lsime": "⪍",
                "lsimg": "⪏",
                "lsqb": "[",
                "lsquo": "‘",
                "lsquor": "‚",
                "lstrok": "ł",
                "Lstrok": "Ł",
                "lt": "\x3c",
                "Lt": "≪",
                "LT": "\x3c",
                "ltcc": "⪦",
                "ltcir": "⩹",
                "ltdot": "⋖",
                "lthree": "⋋",
                "ltimes": "⋉",
                "ltlarr": "⥶",
                "ltquest": "⩻",
                "ltri": "◃",
                "ltrie": "⊴",
                "ltrif": "◂",
                "ltrPar": "⦖",
                "lurdshar": "⥊",
                "luruhar": "⥦",
                "lvertneqq": "≨︀",
                "lvnE": "≨︀",
                "macr": "¯",
                "male": "♂",
                "malt": "✠",
                "maltese": "✠",
                "map": "↦",
                "Map": "⤅",
                "mapsto": "↦",
                "mapstodown": "↧",
                "mapstoleft": "↤",
                "mapstoup": "↥",
                "marker": "▮",
                "mcomma": "⨩",
                "mcy": "м",
                "Mcy": "М",
                "mdash": "—",
                "mDDot": "∺",
                "measuredangle": "∡",
                "MediumSpace": " ",
                "Mellintrf": "ℳ",
                "mfr": "\ud835\udd2a",
                "Mfr": "\ud835\udd10",
                "mho": "℧",
                "micro": "µ",
                "mid": "∣",
                "midast": "*",
                "midcir": "⫰",
                "middot": "·",
                "minus": "−",
                "minusb": "⊟",
                "minusd": "∸",
                "minusdu": "⨪",
                "MinusPlus": "∓",
                "mlcp": "⫛",
                "mldr": "…",
                "mnplus": "∓",
                "models": "⊧",
                "mopf": "\ud835\udd5e",
                "Mopf": "\ud835\udd44",
                "mp": "∓",
                "mscr": "\ud835\udcc2",
                "Mscr": "ℳ",
                "mstpos": "∾",
                "mu": "μ",
                "Mu": "Μ",
                "multimap": "⊸",
                "mumap": "⊸",
                "nabla": "∇",
                "nacute": "ń",
                "Nacute": "Ń",
                "nang": "∠⃒",
                "nap": "≉",
                "napE": "⩰̸",
                "napid": "≋̸",
                "napos": "ŉ",
                "napprox": "≉",
                "natur": "♮",
                "natural": "♮",
                "naturals": "ℕ",
                "nbsp": " ",
                "nbump": "≎̸",
                "nbumpe": "≏̸",
                "ncap": "⩃",
                "ncaron": "ň",
                "Ncaron": "Ň",
                "ncedil": "ņ",
                "Ncedil": "Ņ",
                "ncong": "≇",
                "ncongdot": "⩭̸",
                "ncup": "⩂",
                "ncy": "н",
                "Ncy": "Н",
                "ndash": "–",
                "ne": "≠",
                "nearhk": "⤤",
                "nearr": "↗",
                "neArr": "⇗",
                "nearrow": "↗",
                "nedot": "≐̸",
                "NegativeMediumSpace": "​",
                "NegativeThickSpace": "​",
                "NegativeThinSpace": "​",
                "NegativeVeryThinSpace": "​",
                "nequiv": "≢",
                "nesear": "⤨",
                "nesim": "≂̸",
                "NestedGreaterGreater": "≫",
                "NestedLessLess": "≪",
                "NewLine": "\n",
                "nexist": "∄",
                "nexists": "∄",
                "nfr": "\ud835\udd2b",
                "Nfr": "\ud835\udd11",
                "nge": "≱",
                "ngE": "≧̸",
                "ngeq": "≱",
                "ngeqq": "≧̸",
                "ngeqslant": "⩾̸",
                "nges": "⩾̸",
                "nGg": "⋙̸",
                "ngsim": "≵",
                "ngt": "≯",
                "nGt": "≫⃒",
                "ngtr": "≯",
                "nGtv": "≫̸",
                "nharr": "↮",
                "nhArr": "⇎",
                "nhpar": "⫲",
                "ni": "∋",
                "nis": "⋼",
                "nisd": "⋺",
                "niv": "∋",
                "njcy": "њ",
                "NJcy": "Њ",
                "nlarr": "↚",
                "nlArr": "⇍",
                "nldr": "‥",
                "nle": "≰",
                "nlE": "≦̸",
                "nleftarrow": "↚",
                "nLeftarrow": "⇍",
                "nleftrightarrow": "↮",
                "nLeftrightarrow": "⇎",
                "nleq": "≰",
                "nleqq": "≦̸",
                "nleqslant": "⩽̸",
                "nles": "⩽̸",
                "nless": "≮",
                "nLl": "⋘̸",
                "nlsim": "≴",
                "nlt": "≮",
                "nLt": "≪⃒",
                "nltri": "⋪",
                "nltrie": "⋬",
                "nLtv": "≪̸",
                "nmid": "∤",
                "NoBreak": "⁠",
                "NonBreakingSpace": " ",
                "nopf": "\ud835\udd5f",
                "Nopf": "ℕ",
                "not": "¬",
                "Not": "⫬",
                "NotCongruent": "≢",
                "NotCupCap": "≭",
                "NotDoubleVerticalBar": "∦",
                "NotElement": "∉",
                "NotEqual": "≠",
                "NotEqualTilde": "≂̸",
                "NotExists": "∄",
                "NotGreater": "≯",
                "NotGreaterEqual": "≱",
                "NotGreaterFullEqual": "≧̸",
                "NotGreaterGreater": "≫̸",
                "NotGreaterLess": "≹",
                "NotGreaterSlantEqual": "⩾̸",
                "NotGreaterTilde": "≵",
                "NotHumpDownHump": "≎̸",
                "NotHumpEqual": "≏̸",
                "notin": "∉",
                "notindot": "⋵̸",
                "notinE": "⋹̸",
                "notinva": "∉",
                "notinvb": "⋷",
                "notinvc": "⋶",
                "NotLeftTriangle": "⋪",
                "NotLeftTriangleBar": "⧏̸",
                "NotLeftTriangleEqual": "⋬",
                "NotLess": "≮",
                "NotLessEqual": "≰",
                "NotLessGreater": "≸",
                "NotLessLess": "≪̸",
                "NotLessSlantEqual": "⩽̸",
                "NotLessTilde": "≴",
                "NotNestedGreaterGreater": "⪢̸",
                "NotNestedLessLess": "⪡̸",
                "notni": "∌",
                "notniva": "∌",
                "notnivb": "⋾",
                "notnivc": "⋽",
                "NotPrecedes": "⊀",
                "NotPrecedesEqual": "⪯̸",
                "NotPrecedesSlantEqual": "⋠",
                "NotReverseElement": "∌",
                "NotRightTriangle": "⋫",
                "NotRightTriangleBar": "⧐̸",
                "NotRightTriangleEqual": "⋭",
                "NotSquareSubset": "⊏̸",
                "NotSquareSubsetEqual": "⋢",
                "NotSquareSuperset": "⊐̸",
                "NotSquareSupersetEqual": "⋣",
                "NotSubset": "⊂⃒",
                "NotSubsetEqual": "⊈",
                "NotSucceeds": "⊁",
                "NotSucceedsEqual": "⪰̸",
                "NotSucceedsSlantEqual": "⋡",
                "NotSucceedsTilde": "≿̸",
                "NotSuperset": "⊃⃒",
                "NotSupersetEqual": "⊉",
                "NotTilde": "≁",
                "NotTildeEqual": "≄",
                "NotTildeFullEqual": "≇",
                "NotTildeTilde": "≉",
                "NotVerticalBar": "∤",
                "npar": "∦",
                "nparallel": "∦",
                "nparsl": "⫽⃥",
                "npart": "∂̸",
                "npolint": "⨔",
                "npr": "⊀",
                "nprcue": "⋠",
                "npre": "⪯̸",
                "nprec": "⊀",
                "npreceq": "⪯̸",
                "nrarr": "↛",
                "nrArr": "⇏",
                "nrarrc": "⤳̸",
                "nrarrw": "↝̸",
                "nrightarrow": "↛",
                "nRightarrow": "⇏",
                "nrtri": "⋫",
                "nrtrie": "⋭",
                "nsc": "⊁",
                "nsccue": "⋡",
                "nsce": "⪰̸",
                "nscr": "\ud835\udcc3",
                "Nscr": "\ud835\udca9",
                "nshortmid": "∤",
                "nshortparallel": "∦",
                "nsim": "≁",
                "nsime": "≄",
                "nsimeq": "≄",
                "nsmid": "∤",
                "nspar": "∦",
                "nsqsube": "⋢",
                "nsqsupe": "⋣",
                "nsub": "⊄",
                "nsube": "⊈",
                "nsubE": "⫅̸",
                "nsubset": "⊂⃒",
                "nsubseteq": "⊈",
                "nsubseteqq": "⫅̸",
                "nsucc": "⊁",
                "nsucceq": "⪰̸",
                "nsup": "⊅",
                "nsupe": "⊉",
                "nsupE": "⫆̸",
                "nsupset": "⊃⃒",
                "nsupseteq": "⊉",
                "nsupseteqq": "⫆̸",
                "ntgl": "≹",
                "ntilde": "ñ",
                "Ntilde": "Ñ",
                "ntlg": "≸",
                "ntriangleleft": "⋪",
                "ntrianglelefteq": "⋬",
                "ntriangleright": "⋫",
                "ntrianglerighteq": "⋭",
                "nu": "ν",
                "Nu": "Ν",
                "num": "#",
                "numero": "№",
                "numsp": " ",
                "nvap": "≍⃒",
                "nvdash": "⊬",
                "nvDash": "⊭",
                "nVdash": "⊮",
                "nVDash": "⊯",
                "nvge": "≥⃒",
                "nvgt": "\x3e⃒",
                "nvHarr": "⤄",
                "nvinfin": "⧞",
                "nvlArr": "⤂",
                "nvle": "≤⃒",
                "nvlt": "\x3c⃒",
                "nvltrie": "⊴⃒",
                "nvrArr": "⤃",
                "nvrtrie": "⊵⃒",
                "nvsim": "∼⃒",
                "nwarhk": "⤣",
                "nwarr": "↖",
                "nwArr": "⇖",
                "nwarrow": "↖",
                "nwnear": "⤧",
                "oacute": "ó",
                "Oacute": "Ó",
                "oast": "⊛",
                "ocir": "⊚",
                "ocirc": "ô",
                "Ocirc": "Ô",
                "ocy": "о",
                "Ocy": "О",
                "odash": "⊝",
                "odblac": "ő",
                "Odblac": "Ő",
                "odiv": "⨸",
                "odot": "⊙",
                "odsold": "⦼",
                "oelig": "œ",
                "OElig": "Œ",
                "ofcir": "⦿",
                "ofr": "\ud835\udd2c",
                "Ofr": "\ud835\udd12",
                "ogon": "˛",
                "ograve": "ò",
                "Ograve": "Ò",
                "ogt": "⧁",
                "ohbar": "⦵",
                "ohm": "Ω",
                "oint": "∮",
                "olarr": "↺",
                "olcir": "⦾",
                "olcross": "⦻",
                "oline": "‾",
                "olt": "⧀",
                "omacr": "ō",
                "Omacr": "Ō",
                "omega": "ω",
                "Omega": "Ω",
                "omicron": "ο",
                "Omicron": "Ο",
                "omid": "⦶",
                "ominus": "⊖",
                "oopf": "\ud835\udd60",
                "Oopf": "\ud835\udd46",
                "opar": "⦷",
                "OpenCurlyDoubleQuote": "“",
                "OpenCurlyQuote": "‘",
                "operp": "⦹",
                "oplus": "⊕",
                "or": "∨",
                "Or": "⩔",
                "orarr": "↻",
                "ord": "⩝",
                "order": "ℴ",
                "orderof": "ℴ",
                "ordf": "ª",
                "ordm": "º",
                "origof": "⊶",
                "oror": "⩖",
                "orslope": "⩗",
                "orv": "⩛",
                "oS": "Ⓢ",
                "oscr": "ℴ",
                "Oscr": "\ud835\udcaa",
                "oslash": "ø",
                "Oslash": "Ø",
                "osol": "⊘",
                "otilde": "õ",
                "Otilde": "Õ",
                "otimes": "⊗",
                "Otimes": "⨷",
                "otimesas": "⨶",
                "ouml": "ö",
                "Ouml": "Ö",
                "ovbar": "⌽",
                "OverBar": "‾",
                "OverBrace": "⏞",
                "OverBracket": "⎴",
                "OverParenthesis": "⏜",
                "par": "∥",
                "para": "¶",
                "parallel": "∥",
                "parsim": "⫳",
                "parsl": "⫽",
                "part": "∂",
                "PartialD": "∂",
                "pcy": "п",
                "Pcy": "П",
                "percnt": "%",
                "period": ".",
                "permil": "‰",
                "perp": "⊥",
                "pertenk": "‱",
                "pfr": "\ud835\udd2d",
                "Pfr": "\ud835\udd13",
                "phi": "φ",
                "Phi": "Φ",
                "phiv": "ϕ",
                "phmmat": "ℳ",
                "phone": "☎",
                "pi": "π",
                "Pi": "Π",
                "pitchfork": "⋔",
                "piv": "ϖ",
                "planck": "ℏ",
                "planckh": "ℎ",
                "plankv": "ℏ",
                "plus": "+",
                "plusacir": "⨣",
                "plusb": "⊞",
                "pluscir": "⨢",
                "plusdo": "∔",
                "plusdu": "⨥",
                "pluse": "⩲",
                "PlusMinus": "±",
                "plusmn": "±",
                "plussim": "⨦",
                "plustwo": "⨧",
                "pm": "±",
                "Poincareplane": "ℌ",
                "pointint": "⨕",
                "popf": "\ud835\udd61",
                "Popf": "ℙ",
                "pound": "£",
                "pr": "≺",
                "Pr": "⪻",
                "prap": "⪷",
                "prcue": "≼",
                "pre": "⪯",
                "prE": "⪳",
                "prec": "≺",
                "precapprox": "⪷",
                "preccurlyeq": "≼",
                "Precedes": "≺",
                "PrecedesEqual": "⪯",
                "PrecedesSlantEqual": "≼",
                "PrecedesTilde": "≾",
                "preceq": "⪯",
                "precnapprox": "⪹",
                "precneqq": "⪵",
                "precnsim": "⋨",
                "precsim": "≾",
                "prime": "′",
                "Prime": "″",
                "primes": "ℙ",
                "prnap": "⪹",
                "prnE": "⪵",
                "prnsim": "⋨",
                "prod": "∏",
                "Product": "∏",
                "profalar": "⌮",
                "profline": "⌒",
                "profsurf": "⌓",
                "prop": "∝",
                "Proportion": "∷",
                "Proportional": "∝",
                "propto": "∝",
                "prsim": "≾",
                "prurel": "⊰",
                "pscr": "\ud835\udcc5",
                "Pscr": "\ud835\udcab",
                "psi": "ψ",
                "Psi": "Ψ",
                "puncsp": " ",
                "qfr": "\ud835\udd2e",
                "Qfr": "\ud835\udd14",
                "qint": "⨌",
                "qopf": "\ud835\udd62",
                "Qopf": "ℚ",
                "qprime": "⁗",
                "qscr": "\ud835\udcc6",
                "Qscr": "\ud835\udcac",
                "quaternions": "ℍ",
                "quatint": "⨖",
                "quest": "?",
                "questeq": "≟",
                "quot": '"',
                "QUOT": '"',
                "rAarr": "⇛",
                "race": "∽̱",
                "racute": "ŕ",
                "Racute": "Ŕ",
                "radic": "√",
                "raemptyv": "⦳",
                "rang": "⟩",
                "Rang": "⟫",
                "rangd": "⦒",
                "range": "⦥",
                "rangle": "⟩",
                "raquo": "»",
                "rarr": "→",
                "rArr": "⇒",
                "Rarr": "↠",
                "rarrap": "⥵",
                "rarrb": "⇥",
                "rarrbfs": "⤠",
                "rarrc": "⤳",
                "rarrfs": "⤞",
                "rarrhk": "↪",
                "rarrlp": "↬",
                "rarrpl": "⥅",
                "rarrsim": "⥴",
                "rarrtl": "↣",
                "Rarrtl": "⤖",
                "rarrw": "↝",
                "ratail": "⤚",
                "rAtail": "⤜",
                "ratio": "∶",
                "rationals": "ℚ",
                "rbarr": "⤍",
                "rBarr": "⤏",
                "RBarr": "⤐",
                "rbbrk": "❳",
                "rbrace": "}",
                "rbrack": "]",
                "rbrke": "⦌",
                "rbrksld": "⦎",
                "rbrkslu": "⦐",
                "rcaron": "ř",
                "Rcaron": "Ř",
                "rcedil": "ŗ",
                "Rcedil": "Ŗ",
                "rceil": "⌉",
                "rcub": "}",
                "rcy": "р",
                "Rcy": "Р",
                "rdca": "⤷",
                "rdldhar": "⥩",
                "rdquo": "”",
                "rdquor": "”",
                "rdsh": "↳",
                "Re": "ℜ",
                "real": "ℜ",
                "realine": "ℛ",
                "realpart": "ℜ",
                "reals": "ℝ",
                "rect": "▭",
                "reg": "®",
                "REG": "®",
                "ReverseElement": "∋",
                "ReverseEquilibrium": "⇋",
                "ReverseUpEquilibrium": "⥯",
                "rfisht": "⥽",
                "rfloor": "⌋",
                "rfr": "\ud835\udd2f",
                "Rfr": "ℜ",
                "rHar": "⥤",
                "rhard": "⇁",
                "rharu": "⇀",
                "rharul": "⥬",
                "rho": "ρ",
                "Rho": "Ρ",
                "rhov": "ϱ",
                "RightAngleBracket": "⟩",
                "rightarrow": "→",
                "Rightarrow": "⇒",
                "RightArrow": "→",
                "RightArrowBar": "⇥",
                "RightArrowLeftArrow": "⇄",
                "rightarrowtail": "↣",
                "RightCeiling": "⌉",
                "RightDoubleBracket": "⟧",
                "RightDownTeeVector": "⥝",
                "RightDownVector": "⇂",
                "RightDownVectorBar": "⥕",
                "RightFloor": "⌋",
                "rightharpoondown": "⇁",
                "rightharpoonup": "⇀",
                "rightleftarrows": "⇄",
                "rightleftharpoons": "⇌",
                "rightrightarrows": "⇉",
                "rightsquigarrow": "↝",
                "RightTee": "⊢",
                "RightTeeArrow": "↦",
                "RightTeeVector": "⥛",
                "rightthreetimes": "⋌",
                "RightTriangle": "⊳",
                "RightTriangleBar": "⧐",
                "RightTriangleEqual": "⊵",
                "RightUpDownVector": "⥏",
                "RightUpTeeVector": "⥜",
                "RightUpVector": "↾",
                "RightUpVectorBar": "⥔",
                "RightVector": "⇀",
                "RightVectorBar": "⥓",
                "ring": "˚",
                "risingdotseq": "≓",
                "rlarr": "⇄",
                "rlhar": "⇌",
                "rlm": "‏",
                "rmoust": "⎱",
                "rmoustache": "⎱",
                "rnmid": "⫮",
                "roang": "⟭",
                "roarr": "⇾",
                "robrk": "⟧",
                "ropar": "⦆",
                "ropf": "\ud835\udd63",
                "Ropf": "ℝ",
                "roplus": "⨮",
                "rotimes": "⨵",
                "RoundImplies": "⥰",
                "rpar": ")",
                "rpargt": "⦔",
                "rppolint": "⨒",
                "rrarr": "⇉",
                "Rrightarrow": "⇛",
                "rsaquo": "›",
                "rscr": "\ud835\udcc7",
                "Rscr": "ℛ",
                "rsh": "↱",
                "Rsh": "↱",
                "rsqb": "]",
                "rsquo": "’",
                "rsquor": "’",
                "rthree": "⋌",
                "rtimes": "⋊",
                "rtri": "▹",
                "rtrie": "⊵",
                "rtrif": "▸",
                "rtriltri": "⧎",
                "RuleDelayed": "⧴",
                "ruluhar": "⥨",
                "rx": "℞",
                "sacute": "ś",
                "Sacute": "Ś",
                "sbquo": "‚",
                "sc": "≻",
                "Sc": "⪼",
                "scap": "⪸",
                "scaron": "š",
                "Scaron": "Š",
                "sccue": "≽",
                "sce": "⪰",
                "scE": "⪴",
                "scedil": "ş",
                "Scedil": "Ş",
                "scirc": "ŝ",
                "Scirc": "Ŝ",
                "scnap": "⪺",
                "scnE": "⪶",
                "scnsim": "⋩",
                "scpolint": "⨓",
                "scsim": "≿",
                "scy": "с",
                "Scy": "С",
                "sdot": "⋅",
                "sdotb": "⊡",
                "sdote": "⩦",
                "searhk": "⤥",
                "searr": "↘",
                "seArr": "⇘",
                "searrow": "↘",
                "sect": "§",
                "semi": ";",
                "seswar": "⤩",
                "setminus": "∖",
                "setmn": "∖",
                "sext": "✶",
                "sfr": "\ud835\udd30",
                "Sfr": "\ud835\udd16",
                "sfrown": "⌢",
                "sharp": "♯",
                "shchcy": "щ",
                "SHCHcy": "Щ",
                "shcy": "ш",
                "SHcy": "Ш",
                "ShortDownArrow": "↓",
                "ShortLeftArrow": "←",
                "shortmid": "∣",
                "shortparallel": "∥",
                "ShortRightArrow": "→",
                "ShortUpArrow": "↑",
                "shy": "­",
                "sigma": "σ",
                "Sigma": "Σ",
                "sigmaf": "ς",
                "sigmav": "ς",
                "sim": "∼",
                "simdot": "⩪",
                "sime": "≃",
                "simeq": "≃",
                "simg": "⪞",
                "simgE": "⪠",
                "siml": "⪝",
                "simlE": "⪟",
                "simne": "≆",
                "simplus": "⨤",
                "simrarr": "⥲",
                "slarr": "←",
                "SmallCircle": "∘",
                "smallsetminus": "∖",
                "smashp": "⨳",
                "smeparsl": "⧤",
                "smid": "∣",
                "smile": "⌣",
                "smt": "⪪",
                "smte": "⪬",
                "smtes": "⪬︀",
                "softcy": "ь",
                "SOFTcy": "Ь",
                "sol": "/",
                "solb": "⧄",
                "solbar": "⌿",
                "sopf": "\ud835\udd64",
                "Sopf": "\ud835\udd4a",
                "spades": "♠",
                "spadesuit": "♠",
                "spar": "∥",
                "sqcap": "⊓",
                "sqcaps": "⊓︀",
                "sqcup": "⊔",
                "sqcups": "⊔︀",
                "Sqrt": "√",
                "sqsub": "⊏",
                "sqsube": "⊑",
                "sqsubset": "⊏",
                "sqsubseteq": "⊑",
                "sqsup": "⊐",
                "sqsupe": "⊒",
                "sqsupset": "⊐",
                "sqsupseteq": "⊒",
                "squ": "□",
                "square": "□",
                "Square": "□",
                "SquareIntersection": "⊓",
                "SquareSubset": "⊏",
                "SquareSubsetEqual": "⊑",
                "SquareSuperset": "⊐",
                "SquareSupersetEqual": "⊒",
                "SquareUnion": "⊔",
                "squarf": "▪",
                "squf": "▪",
                "srarr": "→",
                "sscr": "\ud835\udcc8",
                "Sscr": "\ud835\udcae",
                "ssetmn": "∖",
                "ssmile": "⌣",
                "sstarf": "⋆",
                "star": "☆",
                "Star": "⋆",
                "starf": "★",
                "straightepsilon": "ϵ",
                "straightphi": "ϕ",
                "strns": "¯",
                "sub": "⊂",
                "Sub": "⋐",
                "subdot": "⪽",
                "sube": "⊆",
                "subE": "⫅",
                "subedot": "⫃",
                "submult": "⫁",
                "subne": "⊊",
                "subnE": "⫋",
                "subplus": "⪿",
                "subrarr": "⥹",
                "subset": "⊂",
                "Subset": "⋐",
                "subseteq": "⊆",
                "subseteqq": "⫅",
                "SubsetEqual": "⊆",
                "subsetneq": "⊊",
                "subsetneqq": "⫋",
                "subsim": "⫇",
                "subsub": "⫕",
                "subsup": "⫓",
                "succ": "≻",
                "succapprox": "⪸",
                "succcurlyeq": "≽",
                "Succeeds": "≻",
                "SucceedsEqual": "⪰",
                "SucceedsSlantEqual": "≽",
                "SucceedsTilde": "≿",
                "succeq": "⪰",
                "succnapprox": "⪺",
                "succneqq": "⪶",
                "succnsim": "⋩",
                "succsim": "≿",
                "SuchThat": "∋",
                "sum": "∑",
                "Sum": "∑",
                "sung": "♪",
                "sup": "⊃",
                "Sup": "⋑",
                "sup1": "¹",
                "sup2": "²",
                "sup3": "³",
                "supdot": "⪾",
                "supdsub": "⫘",
                "supe": "⊇",
                "supE": "⫆",
                "supedot": "⫄",
                "Superset": "⊃",
                "SupersetEqual": "⊇",
                "suphsol": "⟉",
                "suphsub": "⫗",
                "suplarr": "⥻",
                "supmult": "⫂",
                "supne": "⊋",
                "supnE": "⫌",
                "supplus": "⫀",
                "supset": "⊃",
                "Supset": "⋑",
                "supseteq": "⊇",
                "supseteqq": "⫆",
                "supsetneq": "⊋",
                "supsetneqq": "⫌",
                "supsim": "⫈",
                "supsub": "⫔",
                "supsup": "⫖",
                "swarhk": "⤦",
                "swarr": "↙",
                "swArr": "⇙",
                "swarrow": "↙",
                "swnwar": "⤪",
                "szlig": "ß",
                "Tab": "\t",
                "target": "⌖",
                "tau": "τ",
                "Tau": "Τ",
                "tbrk": "⎴",
                "tcaron": "ť",
                "Tcaron": "Ť",
                "tcedil": "ţ",
                "Tcedil": "Ţ",
                "tcy": "т",
                "Tcy": "Т",
                "tdot": "⃛",
                "telrec": "⌕",
                "tfr": "\ud835\udd31",
                "Tfr": "\ud835\udd17",
                "there4": "∴",
                "therefore": "∴",
                "Therefore": "∴",
                "theta": "θ",
                "Theta": "Θ",
                "thetasym": "ϑ",
                "thetav": "ϑ",
                "thickapprox": "≈",
                "thicksim": "∼",
                "ThickSpace": "  ",
                "thinsp": " ",
                "ThinSpace": " ",
                "thkap": "≈",
                "thksim": "∼",
                "thorn": "þ",
                "THORN": "Þ",
                "tilde": "˜",
                "Tilde": "∼",
                "TildeEqual": "≃",
                "TildeFullEqual": "≅",
                "TildeTilde": "≈",
                "times": "×",
                "timesb": "⊠",
                "timesbar": "⨱",
                "timesd": "⨰",
                "tint": "∭",
                "toea": "⤨",
                "top": "⊤",
                "topbot": "⌶",
                "topcir": "⫱",
                "topf": "\ud835\udd65",
                "Topf": "\ud835\udd4b",
                "topfork": "⫚",
                "tosa": "⤩",
                "tprime": "‴",
                "trade": "™",
                "TRADE": "™",
                "triangle": "▵",
                "triangledown": "▿",
                "triangleleft": "◃",
                "trianglelefteq": "⊴",
                "triangleq": "≜",
                "triangleright": "▹",
                "trianglerighteq": "⊵",
                "tridot": "◬",
                "trie": "≜",
                "triminus": "⨺",
                "TripleDot": "⃛",
                "triplus": "⨹",
                "trisb": "⧍",
                "tritime": "⨻",
                "trpezium": "⏢",
                "tscr": "\ud835\udcc9",
                "Tscr": "\ud835\udcaf",
                "tscy": "ц",
                "TScy": "Ц",
                "tshcy": "ћ",
                "TSHcy": "Ћ",
                "tstrok": "ŧ",
                "Tstrok": "Ŧ",
                "twixt": "≬",
                "twoheadleftarrow": "↞",
                "twoheadrightarrow": "↠",
                "uacute": "ú",
                "Uacute": "Ú",
                "uarr": "↑",
                "uArr": "⇑",
                "Uarr": "↟",
                "Uarrocir": "⥉",
                "ubrcy": "ў",
                "Ubrcy": "Ў",
                "ubreve": "ŭ",
                "Ubreve": "Ŭ",
                "ucirc": "û",
                "Ucirc": "Û",
                "ucy": "у",
                "Ucy": "У",
                "udarr": "⇅",
                "udblac": "ű",
                "Udblac": "Ű",
                "udhar": "⥮",
                "ufisht": "⥾",
                "ufr": "\ud835\udd32",
                "Ufr": "\ud835\udd18",
                "ugrave": "ù",
                "Ugrave": "Ù",
                "uHar": "⥣",
                "uharl": "↿",
                "uharr": "↾",
                "uhblk": "▀",
                "ulcorn": "⌜",
                "ulcorner": "⌜",
                "ulcrop": "⌏",
                "ultri": "◸",
                "umacr": "ū",
                "Umacr": "Ū",
                "uml": "¨",
                "UnderBar": "_",
                "UnderBrace": "⏟",
                "UnderBracket": "⎵",
                "UnderParenthesis": "⏝",
                "Union": "⋃",
                "UnionPlus": "⊎",
                "uogon": "ų",
                "Uogon": "Ų",
                "uopf": "\ud835\udd66",
                "Uopf": "\ud835\udd4c",
                "uparrow": "↑",
                "Uparrow": "⇑",
                "UpArrow": "↑",
                "UpArrowBar": "⤒",
                "UpArrowDownArrow": "⇅",
                "updownarrow": "↕",
                "Updownarrow": "⇕",
                "UpDownArrow": "↕",
                "UpEquilibrium": "⥮",
                "upharpoonleft": "↿",
                "upharpoonright": "↾",
                "uplus": "⊎",
                "UpperLeftArrow": "↖",
                "UpperRightArrow": "↗",
                "upsi": "υ",
                "Upsi": "ϒ",
                "upsih": "ϒ",
                "upsilon": "υ",
                "Upsilon": "Υ",
                "UpTee": "⊥",
                "UpTeeArrow": "↥",
                "upuparrows": "⇈",
                "urcorn": "⌝",
                "urcorner": "⌝",
                "urcrop": "⌎",
                "uring": "ů",
                "Uring": "Ů",
                "urtri": "◹",
                "uscr": "\ud835\udcca",
                "Uscr": "\ud835\udcb0",
                "utdot": "⋰",
                "utilde": "ũ",
                "Utilde": "Ũ",
                "utri": "▵",
                "utrif": "▴",
                "uuarr": "⇈",
                "uuml": "ü",
                "Uuml": "Ü",
                "uwangle": "⦧",
                "vangrt": "⦜",
                "varepsilon": "ϵ",
                "varkappa": "ϰ",
                "varnothing": "∅",
                "varphi": "ϕ",
                "varpi": "ϖ",
                "varpropto": "∝",
                "varr": "↕",
                "vArr": "⇕",
                "varrho": "ϱ",
                "varsigma": "ς",
                "varsubsetneq": "⊊︀",
                "varsubsetneqq": "⫋︀",
                "varsupsetneq": "⊋︀",
                "varsupsetneqq": "⫌︀",
                "vartheta": "ϑ",
                "vartriangleleft": "⊲",
                "vartriangleright": "⊳",
                "vBar": "⫨",
                "Vbar": "⫫",
                "vBarv": "⫩",
                "vcy": "в",
                "Vcy": "В",
                "vdash": "⊢",
                "vDash": "⊨",
                "Vdash": "⊩",
                "VDash": "⊫",
                "Vdashl": "⫦",
                "vee": "∨",
                "Vee": "⋁",
                "veebar": "⊻",
                "veeeq": "≚",
                "vellip": "⋮",
                "verbar": "|",
                "Verbar": "‖",
                "vert": "|",
                "Vert": "‖",
                "VerticalBar": "∣",
                "VerticalLine": "|",
                "VerticalSeparator": "❘",
                "VerticalTilde": "≀",
                "VeryThinSpace": " ",
                "vfr": "\ud835\udd33",
                "Vfr": "\ud835\udd19",
                "vltri": "⊲",
                "vnsub": "⊂⃒",
                "vnsup": "⊃⃒",
                "vopf": "\ud835\udd67",
                "Vopf": "\ud835\udd4d",
                "vprop": "∝",
                "vrtri": "⊳",
                "vscr": "\ud835\udccb",
                "Vscr": "\ud835\udcb1",
                "vsubne": "⊊︀",
                "vsubnE": "⫋︀",
                "vsupne": "⊋︀",
                "vsupnE": "⫌︀",
                "Vvdash": "⊪",
                "vzigzag": "⦚",
                "wcirc": "ŵ",
                "Wcirc": "Ŵ",
                "wedbar": "⩟",
                "wedge": "∧",
                "Wedge": "⋀",
                "wedgeq": "≙",
                "weierp": "℘",
                "wfr": "\ud835\udd34",
                "Wfr": "\ud835\udd1a",
                "wopf": "\ud835\udd68",
                "Wopf": "\ud835\udd4e",
                "wp": "℘",
                "wr": "≀",
                "wreath": "≀",
                "wscr": "\ud835\udccc",
                "Wscr": "\ud835\udcb2",
                "xcap": "⋂",
                "xcirc": "◯",
                "xcup": "⋃",
                "xdtri": "▽",
                "xfr": "\ud835\udd35",
                "Xfr": "\ud835\udd1b",
                "xharr": "⟷",
                "xhArr": "⟺",
                "xi": "ξ",
                "Xi": "Ξ",
                "xlarr": "⟵",
                "xlArr": "⟸",
                "xmap": "⟼",
                "xnis": "⋻",
                "xodot": "⨀",
                "xopf": "\ud835\udd69",
                "Xopf": "\ud835\udd4f",
                "xoplus": "⨁",
                "xotime": "⨂",
                "xrarr": "⟶",
                "xrArr": "⟹",
                "xscr": "\ud835\udccd",
                "Xscr": "\ud835\udcb3",
                "xsqcup": "⨆",
                "xuplus": "⨄",
                "xutri": "△",
                "xvee": "⋁",
                "xwedge": "⋀",
                "yacute": "ý",
                "Yacute": "Ý",
                "yacy": "я",
                "YAcy": "Я",
                "ycirc": "ŷ",
                "Ycirc": "Ŷ",
                "ycy": "ы",
                "Ycy": "Ы",
                "yen": "¥",
                "yfr": "\ud835\udd36",
                "Yfr": "\ud835\udd1c",
                "yicy": "ї",
                "YIcy": "Ї",
                "yopf": "\ud835\udd6a",
                "Yopf": "\ud835\udd50",
                "yscr": "\ud835\udcce",
                "Yscr": "\ud835\udcb4",
                "yucy": "ю",
                "YUcy": "Ю",
                "yuml": "ÿ",
                "Yuml": "Ÿ",
                "zacute": "ź",
                "Zacute": "Ź",
                "zcaron": "ž",
                "Zcaron": "Ž",
                "zcy": "з",
                "Zcy": "З",
                "zdot": "ż",
                "Zdot": "Ż",
                "zeetrf": "ℨ",
                "ZeroWidthSpace": "​",
                "zeta": "ζ",
                "Zeta": "Ζ",
                "zfr": "\ud835\udd37",
                "Zfr": "ℨ",
                "zhcy": "ж",
                "ZHcy": "Ж",
                "zigrarr": "⇝",
                "zopf": "\ud835\udd6b",
                "Zopf": "ℤ",
                "zscr": "\ud835\udccf",
                "Zscr": "\ud835\udcb5",
                "zwj": "‍",
                "zwnj": "‌"
            };
            var decodeMapLegacy = {
                "aacute": "á",
                "Aacute": "Á",
                "acirc": "â",
                "Acirc": "Â",
                "acute": "´",
                "aelig": "æ",
                "AElig": "Æ",
                "agrave": "à",
                "Agrave": "À",
                "amp": "\x26",
                "AMP": "\x26",
                "aring": "å",
                "Aring": "Å",
                "atilde": "ã",
                "Atilde": "Ã",
                "auml": "ä",
                "Auml": "Ä",
                "brvbar": "¦",
                "ccedil": "ç",
                "Ccedil": "Ç",
                "cedil": "¸",
                "cent": "¢",
                "copy": "©",
                "COPY": "©",
                "curren": "¤",
                "deg": "°",
                "divide": "÷",
                "eacute": "é",
                "Eacute": "É",
                "ecirc": "ê",
                "Ecirc": "Ê",
                "egrave": "è",
                "Egrave": "È",
                "eth": "ð",
                "ETH": "Ð",
                "euml": "ë",
                "Euml": "Ë",
                "frac12": "½",
                "frac14": "¼",
                "frac34": "¾",
                "gt": "\x3e",
                "GT": "\x3e",
                "iacute": "í",
                "Iacute": "Í",
                "icirc": "î",
                "Icirc": "Î",
                "iexcl": "¡",
                "igrave": "ì",
                "Igrave": "Ì",
                "iquest": "¿",
                "iuml": "ï",
                "Iuml": "Ï",
                "laquo": "«",
                "lt": "\x3c",
                "LT": "\x3c",
                "macr": "¯",
                "micro": "µ",
                "middot": "·",
                "nbsp": " ",
                "not": "¬",
                "ntilde": "ñ",
                "Ntilde": "Ñ",
                "oacute": "ó",
                "Oacute": "Ó",
                "ocirc": "ô",
                "Ocirc": "Ô",
                "ograve": "ò",
                "Ograve": "Ò",
                "ordf": "ª",
                "ordm": "º",
                "oslash": "ø",
                "Oslash": "Ø",
                "otilde": "õ",
                "Otilde": "Õ",
                "ouml": "ö",
                "Ouml": "Ö",
                "para": "¶",
                "plusmn": "±",
                "pound": "£",
                "quot": '"',
                "QUOT": '"',
                "raquo": "»",
                "reg": "®",
                "REG": "®",
                "sect": "§",
                "shy": "­",
                "sup1": "¹",
                "sup2": "²",
                "sup3": "³",
                "szlig": "ß",
                "thorn": "þ",
                "THORN": "Þ",
                "times": "×",
                "uacute": "ú",
                "Uacute": "Ú",
                "ucirc": "û",
                "Ucirc": "Û",
                "ugrave": "ù",
                "Ugrave": "Ù",
                "uml": "¨",
                "uuml": "ü",
                "Uuml": "Ü",
                "yacute": "ý",
                "Yacute": "Ý",
                "yen": "¥",
                "yuml": "ÿ"
            };
            var decodeMapNumeric = {
                0: "�",
                128: "€",
                130: "‚",
                131: "ƒ",
                132: "„",
                133: "…",
                134: "†",
                135: "‡",
                136: "ˆ",
                137: "‰",
                138: "Š",
                139: "‹",
                140: "Œ",
                142: "Ž",
                145: "‘",
                146: "’",
                147: "“",
                148: "”",
                149: "•",
                150: "–",
                151: "—",
                152: "˜",
                153: "™",
                154: "š",
                155: "›",
                156: "œ",
                158: "ž",
                159: "Ÿ"
            };
            var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65E3, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607,
                262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
            var stringFromCharCode = String.fromCharCode;
            var object = {};
            var hasOwnProperty = object.hasOwnProperty;
            var has = function (object, propertyName) {
                return hasOwnProperty.call(object, propertyName)
            };
            var contains = function (array, value) {
                var index = -1;
                for (var length = array.length; ++index < length;) if (array[index] == value) return true;
                return false
            };
            var merge = function (options, defaults) {
                if (!options) return defaults;
                var result = {};
                for (var key in defaults) result[key] = has(options, key) ? options[key] : defaults[key];
                return result
            };
            var codePointToSymbol = function (codePoint, strict) {
                var output = "";
                if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
                    if (strict) parseError("character reference outside the permissible Unicode range");
                    return "�"
                }
                if (has(decodeMapNumeric, codePoint)) {
                    if (strict) parseError("disallowed character reference");
                    return decodeMapNumeric[codePoint]
                }
                if (strict &&
                    contains(invalidReferenceCodePoints, codePoint)) parseError("disallowed character reference");
                if (codePoint > 65535) {
                    codePoint -= 65536;
                    output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
                    codePoint = 56320 | codePoint & 1023
                }
                output += stringFromCharCode(codePoint);
                return output
            };
            var hexEscape = function (codePoint) {
                return "\x26#x" + codePoint.toString(16).toUpperCase() + ";"
            };
            var decEscape = function (codePoint) {
                return "\x26#" + codePoint + ";"
            };
            var parseError = function (message) {
                throw Error("Parse error: " + message);
            };
            var encode =
                function (string, options) {
                    options = merge(options, encode.options);
                    var strict = options.strict;
                    if (strict && regexInvalidRawCodePoint.test(string)) parseError("forbidden code point");
                    var encodeEverything = options.encodeEverything;
                    var useNamedReferences = options.useNamedReferences;
                    var allowUnsafeSymbols = options.allowUnsafeSymbols;
                    var escapeCodePoint = options.decimal ? decEscape : hexEscape;
                    var escapeBmpSymbol = function (symbol) {
                        return escapeCodePoint(symbol.charCodeAt(0))
                    };
                    if (encodeEverything) {
                        string = string.replace(regexAsciiWhitelist,
                            function (symbol) {
                                if (useNamedReferences && has(encodeMap, symbol)) return "\x26" + encodeMap[symbol] + ";";
                                return escapeBmpSymbol(symbol)
                            });
                        if (useNamedReferences) string = string.replace(/&gt;\u20D2/g, "\x26nvgt;").replace(/&lt;\u20D2/g, "\x26nvlt;").replace(/&#x66;&#x6A;/g, "\x26fjlig;");
                        if (useNamedReferences) string = string.replace(regexEncodeNonAscii, function (string) {
                            return "\x26" + encodeMap[string] + ";"
                        })
                    } else if (useNamedReferences) {
                        if (!allowUnsafeSymbols) string = string.replace(regexEscape, function (string) {
                            return "\x26" +
                                encodeMap[string] + ";"
                        });
                        string = string.replace(/&gt;\u20D2/g, "\x26nvgt;").replace(/&lt;\u20D2/g, "\x26nvlt;");
                        string = string.replace(regexEncodeNonAscii, function (string) {
                            return "\x26" + encodeMap[string] + ";"
                        })
                    } else if (!allowUnsafeSymbols) string = string.replace(regexEscape, escapeBmpSymbol);
                    return string.replace(regexAstralSymbols, function ($0) {
                        var high = $0.charCodeAt(0);
                        var low = $0.charCodeAt(1);
                        var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
                        return escapeCodePoint(codePoint)
                    }).replace(regexBmpWhitelist, escapeBmpSymbol)
                };
            encode.options = {
                "allowUnsafeSymbols": false,
                "encodeEverything": false,
                "strict": false,
                "useNamedReferences": false,
                "decimal": false
            };
            var decode = function (html, options) {
                options = merge(options, decode.options);
                var strict = options.strict;
                if (strict && regexInvalidEntity.test(html)) parseError("malformed character reference");
                return html.replace(regexDecode, function ($0, $1, $2, $3, $4, $5, $6, $7) {
                    if ($1) {
                        var decDigits = $1;
                        var semicolon = $2;
                        if (strict && !semicolon) parseError("character reference was not terminated by a semicolon");
                        var codePoint = parseInt(decDigits, 10);
                        return codePointToSymbol(codePoint, strict)
                    }
                    if ($3) {
                        var hexDigits = $3;
                        semicolon = $4;
                        if (strict && !semicolon) parseError("character reference was not terminated by a semicolon");
                        codePoint = parseInt(hexDigits, 16);
                        return codePointToSymbol(codePoint, strict)
                    }
                    if ($5) {
                        var reference = $5;
                        if (has(decodeMap, reference)) return decodeMap[reference]; else {
                            if (strict) parseError("named character reference was not terminated by a semicolon");
                            return $0
                        }
                    }
                    reference = $6;
                    var next = $7;
                    if (next && options.isAttributeValue) {
                        if (strict &&
                            next == "\x3d") parseError("`\x26` did not start a character reference");
                        return $0
                    } else {
                        if (strict) parseError("named character reference was not terminated by a semicolon");
                        return decodeMapLegacy[reference] + (next || "")
                    }
                })
            };
            decode.options = {"isAttributeValue": false, "strict": false};
            var escape = function (string) {
                return string.replace(regexEscape, function ($0) {
                    return escapeMap[$0]
                })
            };
            he = {"version": "1.1.0", "encode": encode, "decode": decode, "escape": escape, "unescape": decode};
            if (typeof define == "function" && typeof define.amd ==
                "object" && define.amd) define(function () {
                return he
            }); else if (freeExports && !freeExports.nodeType) if (freeModule) freeModule.exports = he; else for (var key in he) has(he, key) && (freeExports[key] = he[key]); else root.he = he
        })(this);
        $.extend({html_encoder: he})
    });
});
$(document).ready(function () {/*! jQuery UI - v1.12.1 - 2018-06-28
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/draggable.js, widgets/droppable.js, widgets/accordion.js, widgets/datepicker.js, widgets/mouse.js, widgets/progressbar.js, effect.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

    (function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
    })(function (t) {
        function e(t) {
            for (var e = t.css("visibility"); "inherit" === e;) t = t.parent(), e = t.css("visibility");
            return "hidden" !== e
        }

        function i(t) {
            for (var e, i; t.length && t[0] !== document;) {
                if (e = t.css("position"), ("absolute" === e || "relative" === e || "fixed" === e) && (i = parseInt(t.css("zIndex"), 10), !isNaN(i) && 0 !== i)) return i;
                t = t.parent()
            }
            return 0
        }

        function s() {
            this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
                closeText: "Done",
                prevText: "Prev",
                nextText: "Next",
                currentText: "Today",
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                weekHeader: "Wk",
                dateFormat: "mm/dd/yy",
                firstDay: 0,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: ""
            }, this._defaults = {
                showOn: "focus",
                showAnim: "fadeIn",
                showOptions: {},
                defaultDate: null,
                appendText: "",
                buttonText: "...",
                buttonImage: "",
                buttonImageOnly: !1,
                hideIfNoPrevNext: !1,
                navigationAsDateFormat: !1,
                gotoCurrent: !1,
                changeMonth: !1,
                changeYear: !1,
                yearRange: "c-10:c+10",
                showOtherMonths: !1,
                selectOtherMonths: !1,
                showWeek: !1,
                calculateWeek: this.iso8601Week,
                shortYearCutoff: "+10",
                minDate: null,
                maxDate: null,
                duration: "fast",
                beforeShowDay: null,
                beforeShow: null,
                onSelect: null,
                onChangeMonthYear: null,
                onClose: null,
                numberOfMonths: 1,
                showCurrentAtPos: 0,
                stepMonths: 1,
                stepBigMonths: 12,
                altField: "",
                altFormat: "",
                constrainInput: !0,
                showButtonPanel: !1,
                autoSize: !1,
                disabled: !1
            }, t.extend(this._defaults, this.regional[""]), this.regional.en = t.extend(!0, {}, this.regional[""]), this.regional["en-US"] = t.extend(!0, {}, this.regional.en), this.dpDiv = n(t("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
        }

        function n(e) {
            var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
            return e.on("mouseout", i, function () {
                t(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && t(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && t(this).removeClass("ui-datepicker-next-hover")
            }).on("mouseover", i, o)
        }

        function o() {
            t.datepicker._isDisabledDatepicker(u.inline ? u.dpDiv.parent()[0] : u.input[0]) || (t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), t(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && t(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && t(this).addClass("ui-datepicker-next-hover"))
        }

        function a(e, i) {
            t.extend(e, i);
            for (var s in i) null == i[s] && (e[s] = i[s]);
            return e
        }

        t.ui = t.ui || {}, t.ui.version = "1.12.1";
        var r = 0, l = Array.prototype.slice;
        t.cleanData = function (e) {
            return function (i) {
                var s, n, o;
                for (o = 0; null != (n = i[o]); o++) try {
                    s = t._data(n, "events"), s && s.remove && t(n).triggerHandler("remove")
                } catch (a) {
                }
                e(i)
            }
        }(t.cleanData), t.widget = function (e, i, s) {
            var n, o, a, r = {}, l = e.split(".")[0];
            e = e.split(".")[1];
            var h = l + "-" + e;
            return s || (s = i, i = t.Widget), t.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))), t.expr[":"][h.toLowerCase()] = function (e) {
                return !!t.data(e, h)
            }, t[l] = t[l] || {}, n = t[l][e], o = t[l][e] = function (t, e) {
                return this._createWidget ? (arguments.length && this._createWidget(t, e), void 0) : new o(t, e)
            }, t.extend(o, n, {
                version: s.version,
                _proto: t.extend({}, s),
                _childConstructors: []
            }), a = new i, a.options = t.widget.extend({}, a.options), t.each(s, function (e, s) {
                return t.isFunction(s) ? (r[e] = function () {
                    function t() {
                        return i.prototype[e].apply(this, arguments)
                    }

                    function n(t) {
                        return i.prototype[e].apply(this, t)
                    }

                    return function () {
                        var e, i = this._super, o = this._superApply;
                        return this._super = t, this._superApply = n, e = s.apply(this, arguments), this._super = i, this._superApply = o, e
                    }
                }(), void 0) : (r[e] = s, void 0)
            }), o.prototype = t.widget.extend(a, {widgetEventPrefix: n ? a.widgetEventPrefix || e : e}, r, {
                constructor: o,
                namespace: l,
                widgetName: e,
                widgetFullName: h
            }), n ? (t.each(n._childConstructors, function (e, i) {
                var s = i.prototype;
                t.widget(s.namespace + "." + s.widgetName, o, i._proto)
            }), delete n._childConstructors) : i._childConstructors.push(o), t.widget.bridge(e, o), o
        }, t.widget.extend = function (e) {
            for (var i, s, n = l.call(arguments, 1), o = 0, a = n.length; a > o; o++) for (i in n[o]) s = n[o][i], n[o].hasOwnProperty(i) && void 0 !== s && (e[i] = t.isPlainObject(s) ? t.isPlainObject(e[i]) ? t.widget.extend({}, e[i], s) : t.widget.extend({}, s) : s);
            return e
        }, t.widget.bridge = function (e, i) {
            var s = i.prototype.widgetFullName || e;
            t.fn[e] = function (n) {
                var o = "string" == typeof n, a = l.call(arguments, 1), r = this;
                return o ? this.length || "instance" !== n ? this.each(function () {
                    var i, o = t.data(this, s);
                    return "instance" === n ? (r = o, !1) : o ? t.isFunction(o[n]) && "_" !== n.charAt(0) ? (i = o[n].apply(o, a), i !== o && void 0 !== i ? (r = i && i.jquery ? r.pushStack(i.get()) : i, !1) : void 0) : t.error("no such method '" + n + "' for " + e + " widget instance") : t.error("cannot call methods on " + e + " prior to initialization; " + "attempted to call method '" + n + "'")
                }) : r = void 0 : (a.length && (n = t.widget.extend.apply(null, [n].concat(a))), this.each(function () {
                    var e = t.data(this, s);
                    e ? (e.option(n || {}), e._init && e._init()) : t.data(this, s, new i(n, this))
                })), r
            }
        }, t.Widget = function () {
        }, t.Widget._childConstructors = [], t.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {classes: {}, disabled: !1, create: null},
            _createWidget: function (e, i) {
                i = t(i || this.defaultElement || this)[0], this.element = t(i), this.uuid = r++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = t(), this.hoverable = t(), this.focusable = t(), this.classesElementLookup = {}, i !== this && (t.data(i, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function (t) {
                        t.target === i && this.destroy()
                    }
                }), this.document = t(i.style ? i.ownerDocument : i.document || i), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: function () {
                return {}
            },
            _getCreateEventData: t.noop,
            _create: t.noop,
            _init: t.noop,
            destroy: function () {
                var e = this;
                this._destroy(), t.each(this.classesElementLookup, function (t, i) {
                    e._removeClass(i, t)
                }), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
            },
            _destroy: t.noop,
            widget: function () {
                return this.element
            },
            option: function (e, i) {
                var s, n, o, a = e;
                if (0 === arguments.length) return t.widget.extend({}, this.options);
                if ("string" == typeof e) if (a = {}, s = e.split("."), e = s.shift(), s.length) {
                    for (n = a[e] = t.widget.extend({}, this.options[e]), o = 0; s.length - 1 > o; o++) n[s[o]] = n[s[o]] || {}, n = n[s[o]];
                    if (e = s.pop(), 1 === arguments.length) return void 0 === n[e] ? null : n[e];
                    n[e] = i
                } else {
                    if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
                    a[e] = i
                }
                return this._setOptions(a), this
            },
            _setOptions: function (t) {
                var e;
                for (e in t) this._setOption(e, t[e]);
                return this
            },
            _setOption: function (t, e) {
                return "classes" === t && this._setOptionClasses(e), this.options[t] = e, "disabled" === t && this._setOptionDisabled(e), this
            },
            _setOptionClasses: function (e) {
                var i, s, n;
                for (i in e) n = this.classesElementLookup[i], e[i] !== this.options.classes[i] && n && n.length && (s = t(n.get()), this._removeClass(n, i), s.addClass(this._classes({
                    element: s,
                    keys: i,
                    classes: e,
                    add: !0
                })))
            },
            _setOptionDisabled: function (t) {
                this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t), t && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
            },
            enable: function () {
                return this._setOptions({disabled: !1})
            },
            disable: function () {
                return this._setOptions({disabled: !0})
            },
            _classes: function (e) {
                function i(i, o) {
                    var a, r;
                    for (r = 0; i.length > r; r++) a = n.classesElementLookup[i[r]] || t(), a = e.add ? t(t.unique(a.get().concat(e.element.get()))) : t(a.not(e.element).get()), n.classesElementLookup[i[r]] = a, s.push(i[r]), o && e.classes[i[r]] && s.push(e.classes[i[r]])
                }

                var s = [], n = this;
                return e = t.extend({
                    element: this.element,
                    classes: this.options.classes || {}
                }, e), this._on(e.element, {remove: "_untrackClassesElement"}), e.keys && i(e.keys.match(/\S+/g) || [], !0), e.extra && i(e.extra.match(/\S+/g) || []), s.join(" ")
            },
            _untrackClassesElement: function (e) {
                var i = this;
                t.each(i.classesElementLookup, function (s, n) {
                    -1 !== t.inArray(e.target, n) && (i.classesElementLookup[s] = t(n.not(e.target).get()))
                })
            },
            _removeClass: function (t, e, i) {
                return this._toggleClass(t, e, i, !1)
            },
            _addClass: function (t, e, i) {
                return this._toggleClass(t, e, i, !0)
            },
            _toggleClass: function (t, e, i, s) {
                s = "boolean" == typeof s ? s : i;
                var n = "string" == typeof t || null === t,
                    o = {extra: n ? e : i, keys: n ? t : e, element: n ? this.element : t, add: s};
                return o.element.toggleClass(this._classes(o), s), this
            },
            _on: function (e, i, s) {
                var n, o = this;
                "boolean" != typeof e && (s = i, i = e, e = !1), s ? (i = n = t(i), this.bindings = this.bindings.add(i)) : (s = i, i = this.element, n = this.widget()), t.each(s, function (s, a) {
                    function r() {
                        return e || o.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof a ? o[a] : a).apply(o, arguments) : void 0
                    }

                    "string" != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
                    var l = s.match(/^([\w:-]*)\s*(.*)$/), h = l[1] + o.eventNamespace, c = l[2];
                    c ? n.on(h, c, r) : i.on(h, r)
                })
            },
            _off: function (e, i) {
                i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.off(i).off(i), this.bindings = t(this.bindings.not(e).get()), this.focusable = t(this.focusable.not(e).get()), this.hoverable = t(this.hoverable.not(e).get())
            },
            _delay: function (t, e) {
                function i() {
                    return ("string" == typeof t ? s[t] : t).apply(s, arguments)
                }

                var s = this;
                return setTimeout(i, e || 0)
            },
            _hoverable: function (e) {
                this.hoverable = this.hoverable.add(e), this._on(e, {
                    mouseenter: function (e) {
                        this._addClass(t(e.currentTarget), null, "ui-state-hover")
                    }, mouseleave: function (e) {
                        this._removeClass(t(e.currentTarget), null, "ui-state-hover")
                    }
                })
            },
            _focusable: function (e) {
                this.focusable = this.focusable.add(e), this._on(e, {
                    focusin: function (e) {
                        this._addClass(t(e.currentTarget), null, "ui-state-focus")
                    }, focusout: function (e) {
                        this._removeClass(t(e.currentTarget), null, "ui-state-focus")
                    }
                })
            },
            _trigger: function (e, i, s) {
                var n, o, a = this.options[e];
                if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent) for (n in o) n in i || (i[n] = o[n]);
                return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
            }
        }, t.each({show: "fadeIn", hide: "fadeOut"}, function (e, i) {
            t.Widget.prototype["_" + e] = function (s, n, o) {
                "string" == typeof n && (n = {effect: n});
                var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;
                n = n || {}, "number" == typeof n && (n = {duration: n}), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) {
                    t(this)[e](), o && o.call(s[0]), i()
                })
            }
        }), t.widget, function () {
            function e(t, e, i) {
                return [parseFloat(t[0]) * (u.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (u.test(t[1]) ? i / 100 : 1)]
            }

            function i(e, i) {
                return parseInt(t.css(e, i), 10) || 0
            }

            function s(e) {
                var i = e[0];
                return 9 === i.nodeType ? {
                    width: e.width(),
                    height: e.height(),
                    offset: {top: 0, left: 0}
                } : t.isWindow(i) ? {
                    width: e.width(),
                    height: e.height(),
                    offset: {top: e.scrollTop(), left: e.scrollLeft()}
                } : i.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {top: i.pageY, left: i.pageX}
                } : {width: e.outerWidth(), height: e.outerHeight(), offset: e.offset()}
            }

            var n, o = Math.max, a = Math.abs, r = /left|center|right/, l = /top|center|bottom/,
                h = /[\+\-]\d+(\.[\d]+)?%?/, c = /^\w+/, u = /%$/, d = t.fn.position;
            t.position = {
                scrollbarWidth: function () {
                    if (void 0 !== n) return n;
                    var e, i,
                        s = t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                        o = s.children()[0];
                    return t("body").append(s), e = o.offsetWidth, s.css("overflow", "scroll"), i = o.offsetWidth, e === i && (i = s[0].clientWidth), s.remove(), n = e - i
                }, getScrollInfo: function (e) {
                    var i = e.isWindow || e.isDocument ? "" : e.element.css("overflow-x"),
                        s = e.isWindow || e.isDocument ? "" : e.element.css("overflow-y"),
                        n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth,
                        o = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight;
                    return {width: o ? t.position.scrollbarWidth() : 0, height: n ? t.position.scrollbarWidth() : 0}
                }, getWithinInfo: function (e) {
                    var i = t(e || window), s = t.isWindow(i[0]), n = !!i[0] && 9 === i[0].nodeType, o = !s && !n;
                    return {
                        element: i,
                        isWindow: s,
                        isDocument: n,
                        offset: o ? t(e).offset() : {left: 0, top: 0},
                        scrollLeft: i.scrollLeft(),
                        scrollTop: i.scrollTop(),
                        width: i.outerWidth(),
                        height: i.outerHeight()
                    }
                }
            }, t.fn.position = function (n) {
                if (!n || !n.of) return d.apply(this, arguments);
                n = t.extend({}, n);
                var u, p, f, g, m, _, v = t(n.of), b = t.position.getWithinInfo(n.within),
                    y = t.position.getScrollInfo(b), w = (n.collision || "flip").split(" "), k = {};
                return _ = s(v), v[0].preventDefault && (n.at = "left top"), p = _.width, f = _.height, g = _.offset, m = t.extend({}, g), t.each(["my", "at"], function () {
                    var t, e, i = (n[this] || "").split(" ");
                    1 === i.length && (i = r.test(i[0]) ? i.concat(["center"]) : l.test(i[0]) ? ["center"].concat(i) : ["center", "center"]), i[0] = r.test(i[0]) ? i[0] : "center", i[1] = l.test(i[1]) ? i[1] : "center", t = h.exec(i[0]), e = h.exec(i[1]), k[this] = [t ? t[0] : 0, e ? e[0] : 0], n[this] = [c.exec(i[0])[0], c.exec(i[1])[0]]
                }), 1 === w.length && (w[1] = w[0]), "right" === n.at[0] ? m.left += p : "center" === n.at[0] && (m.left += p / 2), "bottom" === n.at[1] ? m.top += f : "center" === n.at[1] && (m.top += f / 2), u = e(k.at, p, f), m.left += u[0], m.top += u[1], this.each(function () {
                    var s, r, l = t(this), h = l.outerWidth(), c = l.outerHeight(), d = i(this, "marginLeft"),
                        _ = i(this, "marginTop"), x = h + d + i(this, "marginRight") + y.width,
                        C = c + _ + i(this, "marginBottom") + y.height, D = t.extend({}, m),
                        T = e(k.my, l.outerWidth(), l.outerHeight());
                    "right" === n.my[0] ? D.left -= h : "center" === n.my[0] && (D.left -= h / 2), "bottom" === n.my[1] ? D.top -= c : "center" === n.my[1] && (D.top -= c / 2), D.left += T[0], D.top += T[1], s = {
                        marginLeft: d,
                        marginTop: _
                    }, t.each(["left", "top"], function (e, i) {
                        t.ui.position[w[e]] && t.ui.position[w[e]][i](D, {
                            targetWidth: p,
                            targetHeight: f,
                            elemWidth: h,
                            elemHeight: c,
                            collisionPosition: s,
                            collisionWidth: x,
                            collisionHeight: C,
                            offset: [u[0] + T[0], u[1] + T[1]],
                            my: n.my,
                            at: n.at,
                            within: b,
                            elem: l
                        })
                    }), n.using && (r = function (t) {
                        var e = g.left - D.left, i = e + p - h, s = g.top - D.top, r = s + f - c, u = {
                            target: {element: v, left: g.left, top: g.top, width: p, height: f},
                            element: {element: l, left: D.left, top: D.top, width: h, height: c},
                            horizontal: 0 > i ? "left" : e > 0 ? "right" : "center",
                            vertical: 0 > r ? "top" : s > 0 ? "bottom" : "middle"
                        };
                        h > p && p > a(e + i) && (u.horizontal = "center"), c > f && f > a(s + r) && (u.vertical = "middle"), u.important = o(a(e), a(i)) > o(a(s), a(r)) ? "horizontal" : "vertical", n.using.call(this, t, u)
                    }), l.offset(t.extend(D, {using: r}))
                })
            }, t.ui.position = {
                fit: {
                    left: function (t, e) {
                        var i, s = e.within, n = s.isWindow ? s.scrollLeft : s.offset.left, a = s.width,
                            r = t.left - e.collisionPosition.marginLeft, l = n - r, h = r + e.collisionWidth - a - n;
                        e.collisionWidth > a ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - a - n, t.left += l - i) : t.left = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionWidth : n : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - r, t.left)
                    }, top: function (t, e) {
                        var i, s = e.within, n = s.isWindow ? s.scrollTop : s.offset.top, a = e.within.height,
                            r = t.top - e.collisionPosition.marginTop, l = n - r, h = r + e.collisionHeight - a - n;
                        e.collisionHeight > a ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - a - n, t.top += l - i) : t.top = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionHeight : n : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - r, t.top)
                    }
                }, flip: {
                    left: function (t, e) {
                        var i, s, n = e.within, o = n.offset.left + n.scrollLeft, r = n.width,
                            l = n.isWindow ? n.scrollLeft : n.offset.left, h = t.left - e.collisionPosition.marginLeft,
                            c = h - l, u = h + e.collisionWidth - r - l,
                            d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0,
                            p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0,
                            f = -2 * e.offset[0];
                        0 > c ? (i = t.left + d + p + f + e.collisionWidth - r - o, (0 > i || a(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - l, (s > 0 || u > a(s)) && (t.left += d + p + f))
                    }, top: function (t, e) {
                        var i, s, n = e.within, o = n.offset.top + n.scrollTop, r = n.height,
                            l = n.isWindow ? n.scrollTop : n.offset.top, h = t.top - e.collisionPosition.marginTop,
                            c = h - l, u = h + e.collisionHeight - r - l, d = "top" === e.my[1],
                            p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
                            f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0,
                            g = -2 * e.offset[1];
                        0 > c ? (s = t.top + p + f + g + e.collisionHeight - r - o, (0 > s || a(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, (i > 0 || u > a(i)) && (t.top += p + f + g))
                    }
                }, flipfit: {
                    left: function () {
                        t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments)
                    }, top: function () {
                        t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments)
                    }
                }
            }
        }(), t.ui.position, t.extend(t.expr[":"], {
            data: t.expr.createPseudo ? t.expr.createPseudo(function (e) {
                return function (i) {
                    return !!t.data(i, e)
                }
            }) : function (e, i, s) {
                return !!t.data(e, s[3])
            }
        }), t.fn.extend({
            disableSelection: function () {
                var t = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
                return function () {
                    return this.on(t + ".ui-disableSelection", function (t) {
                        t.preventDefault()
                    })
                }
            }(), enableSelection: function () {
                return this.off(".ui-disableSelection")
            }
        }), t.ui.focusable = function (i, s) {
            var n, o, a, r, l, h = i.nodeName.toLowerCase();
            return "area" === h ? (n = i.parentNode, o = n.name, i.href && o && "map" === n.nodeName.toLowerCase() ? (a = t("img[usemap='#" + o + "']"), a.length > 0 && a.is(":visible")) : !1) : (/^(input|select|textarea|button|object)$/.test(h) ? (r = !i.disabled, r && (l = t(i).closest("fieldset")[0], l && (r = !l.disabled))) : r = "a" === h ? i.href || s : s, r && t(i).is(":visible") && e(t(i)))
        }, t.extend(t.expr[":"], {
            focusable: function (e) {
                return t.ui.focusable(e, null != t.attr(e, "tabindex"))
            }
        }), t.ui.focusable, t.fn.form = function () {
            return "string" == typeof this[0].form ? this.closest("form") : t(this[0].form)
        }, t.ui.formResetMixin = {
            _formResetHandler: function () {
                var e = t(this);
                setTimeout(function () {
                    var i = e.data("ui-form-reset-instances");
                    t.each(i, function () {
                        this.refresh()
                    })
                })
            }, _bindFormResetHandler: function () {
                if (this.form = this.element.form(), this.form.length) {
                    var t = this.form.data("ui-form-reset-instances") || [];
                    t.length || this.form.on("reset.ui-form-reset", this._formResetHandler), t.push(this), this.form.data("ui-form-reset-instances", t)
                }
            }, _unbindFormResetHandler: function () {
                if (this.form.length) {
                    var e = this.form.data("ui-form-reset-instances");
                    e.splice(t.inArray(this, e), 1), e.length ? this.form.data("ui-form-reset-instances", e) : this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")
                }
            }
        }, "1.7" === t.fn.jquery.substring(0, 3) && (t.each(["Width", "Height"], function (e, i) {
            function s(e, i, s, o) {
                return t.each(n, function () {
                    i -= parseFloat(t.css(e, "padding" + this)) || 0, s && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), o && (i -= parseFloat(t.css(e, "margin" + this)) || 0)
                }), i
            }

            var n = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"], o = i.toLowerCase(), a = {
                innerWidth: t.fn.innerWidth,
                innerHeight: t.fn.innerHeight,
                outerWidth: t.fn.outerWidth,
                outerHeight: t.fn.outerHeight
            };
            t.fn["inner" + i] = function (e) {
                return void 0 === e ? a["inner" + i].call(this) : this.each(function () {
                    t(this).css(o, s(this, e) + "px")
                })
            }, t.fn["outer" + i] = function (e, n) {
                return "number" != typeof e ? a["outer" + i].call(this, e) : this.each(function () {
                    t(this).css(o, s(this, e, !0, n) + "px")
                })
            }
        }), t.fn.addBack = function (t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
        }), t.ui.keyCode = {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }, t.ui.escapeSelector = function () {
            var t = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
            return function (e) {
                return e.replace(t, "\\$1")
            }
        }(), t.fn.labels = function () {
            var e, i, s, n, o;
            return this[0].labels && this[0].labels.length ? this.pushStack(this[0].labels) : (n = this.eq(0).parents("label"), s = this.attr("id"), s && (e = this.eq(0).parents().last(), o = e.add(e.length ? e.siblings() : this.siblings()), i = "label[for='" + t.ui.escapeSelector(s) + "']", n = n.add(o.find(i).addBack(i))), this.pushStack(n))
        }, t.fn.scrollParent = function (e) {
            var i = this.css("position"), s = "absolute" === i, n = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                o = this.parents().filter(function () {
                    var e = t(this);
                    return s && "static" === e.css("position") ? !1 : n.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"))
                }).eq(0);
            return "fixed" !== i && o.length ? o : t(this[0].ownerDocument || document)
        }, t.extend(t.expr[":"], {
            tabbable: function (e) {
                var i = t.attr(e, "tabindex"), s = null != i;
                return (!s || i >= 0) && t.ui.focusable(e, s)
            }
        }), t.fn.extend({
            uniqueId: function () {
                var t = 0;
                return function () {
                    return this.each(function () {
                        this.id || (this.id = "ui-id-" + ++t)
                    })
                }
            }(), removeUniqueId: function () {
                return this.each(function () {
                    /^ui-id-\d+$/.test(this.id) && t(this).removeAttr("id")
                })
            }
        }), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
        var h = !1;
        t(document).on("mouseup", function () {
            h = !1
        }), t.widget("ui.mouse", {
            version: "1.12.1",
            options: {cancel: "input, textarea, button, select, option", distance: 1, delay: 0},
            _mouseInit: function () {
                var e = this;
                this.element.on("mousedown." + this.widgetName, function (t) {
                    return e._mouseDown(t)
                }).on("click." + this.widgetName, function (i) {
                    return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
                }), this.started = !1
            },
            _mouseDestroy: function () {
                this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function (e) {
                if (!h) {
                    this._mouseMoved = !1, this._mouseStarted && this._mouseUp(e), this._mouseDownEvent = e;
                    var i = this, s = 1 === e.which,
                        n = "string" == typeof this.options.cancel && e.target.nodeName ? t(e.target).closest(this.options.cancel).length : !1;
                    return s && !n && this._mouseCapture(e) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                        i.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(e) !== !1, !this._mouseStarted) ? (e.preventDefault(), !0) : (!0 === t.data(e.target, this.widgetName + ".preventClickEvent") && t.removeData(e.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
                        return i._mouseMove(t)
                    }, this._mouseUpDelegate = function (t) {
                        return i._mouseUp(t)
                    }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), e.preventDefault(), h = !0, !0)) : !0
                }
            },
            _mouseMove: function (e) {
                if (this._mouseMoved) {
                    if (t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button) return this._mouseUp(e);
                    if (!e.which) if (e.originalEvent.altKey || e.originalEvent.ctrlKey || e.originalEvent.metaKey || e.originalEvent.shiftKey) this.ignoreMissingWhich = !0; else if (!this.ignoreMissingWhich) return this._mouseUp(e)
                }
                return (e.which || e.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
            },
            _mouseUp: function (e) {
                this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, h = !1, e.preventDefault()
            },
            _mouseDistanceMet: function (t) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function () {
                return this.mouseDelayMet
            },
            _mouseStart: function () {
            },
            _mouseDrag: function () {
            },
            _mouseStop: function () {
            },
            _mouseCapture: function () {
                return !0
            }
        }), t.ui.plugin = {
            add: function (e, i, s) {
                var n, o = t.ui[e].prototype;
                for (n in s) o.plugins[n] = o.plugins[n] || [], o.plugins[n].push([i, s[n]])
            }, call: function (t, e, i, s) {
                var n, o = t.plugins[e];
                if (o && (s || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType)) for (n = 0; o.length > n; n++) t.options[o[n][0]] && o[n][1].apply(t.element, i)
            }
        }, t.ui.safeActiveElement = function (t) {
            var e;
            try {
                e = t.activeElement
            } catch (i) {
                e = t.body
            }
            return e || (e = t.body), e.nodeName || (e = t.body), e
        }, t.ui.safeBlur = function (e) {
            e && "body" !== e.nodeName.toLowerCase() && t(e).trigger("blur")
        }, t.widget("ui.draggable", t.ui.mouse, {
            version: "1.12.1",
            widgetEventPrefix: "drag",
            options: {
                addClasses: !0,
                appendTo: "parent",
                axis: !1,
                connectToSortable: !1,
                containment: !1,
                cursor: "auto",
                cursorAt: !1,
                grid: !1,
                handle: !1,
                helper: "original",
                iframeFix: !1,
                opacity: !1,
                refreshPositions: !1,
                revert: !1,
                revertDuration: 500,
                scope: "default",
                scroll: !0,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                snap: !1,
                snapMode: "both",
                snapTolerance: 20,
                stack: !1,
                zIndex: !1,
                drag: null,
                start: null,
                stop: null
            },
            _create: function () {
                "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
            },
            _setOption: function (t, e) {
                this._super(t, e), "handle" === t && (this._removeHandleClassName(), this._setHandleClassName())
            },
            _destroy: function () {
                return (this.helper || this.element).is(".ui-draggable-dragging") ? (this.destroyOnClear = !0, void 0) : (this._removeHandleClassName(), this._mouseDestroy(), void 0)
            },
            _mouseCapture: function (e) {
                var i = this.options;
                return this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), this.handle ? (this._blurActiveElement(e), this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1)
            },
            _blockFrames: function (e) {
                this.iframeBlocks = this.document.find(e).map(function () {
                    var e = t(this);
                    return t("<div>").css("position", "absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]
                })
            },
            _unblockFrames: function () {
                this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
            },
            _blurActiveElement: function (e) {
                var i = t.ui.safeActiveElement(this.document[0]), s = t(e.target);
                s.closest(i).length || t.ui.safeBlur(i)
            },
            _mouseStart: function (e) {
                var i = this.options;
                return this.helper = this._createHelper(e), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
                    return "fixed" === t(this).css("position")
                }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(e), this.originalPosition = this.position = this._generatePosition(e, !1), this.originalPageX = e.pageX, this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0)
            },
            _refreshOffsets: function (t) {
                this.offset = {
                    top: this.positionAbs.top - this.margins.top,
                    left: this.positionAbs.left - this.margins.left,
                    scroll: !1,
                    parent: this._getParentOffset(),
                    relative: this._getRelativeOffset()
                }, this.offset.click = {left: t.pageX - this.offset.left, top: t.pageY - this.offset.top}
            },
            _mouseDrag: function (e, i) {
                if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(e, !0), this.positionAbs = this._convertPositionTo("absolute"), !i) {
                    var s = this._uiHash();
                    if (this._trigger("drag", e, s) === !1) return this._mouseUp(new t.Event("mouseup", e)), !1;
                    this.position = s.position
                }
                return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1
            },
            _mouseStop: function (e) {
                var i = this, s = !1;
                return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)), this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    i._trigger("stop", e) !== !1 && i._clear()
                }) : this._trigger("stop", e) !== !1 && this._clear(), !1
            },
            _mouseUp: function (e) {
                return this._unblockFrames(), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), this.handleElement.is(e.target) && this.element.trigger("focus"), t.ui.mouse.prototype._mouseUp.call(this, e)
            },
            cancel: function () {
                return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new t.Event("mouseup", {target: this.element[0]})) : this._clear(), this
            },
            _getHandle: function (e) {
                return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0
            },
            _setHandleClassName: function () {
                this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
            },
            _removeHandleClassName: function () {
                this._removeClass(this.handleElement, "ui-draggable-handle")
            },
            _createHelper: function (e) {
                var i = this.options, s = t.isFunction(i.helper),
                    n = s ? t(i.helper.apply(this.element[0], [e])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
                return n.parents("body").length || n.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), s && n[0] === this.element[0] && this._setPositionRelative(), n[0] === this.element[0] || /(fixed|absolute)/.test(n.css("position")) || n.css("position", "absolute"), n
            },
            _setPositionRelative: function () {
                /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
            },
            _adjustOffsetFromHelper: function (e) {
                "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                    left: +e[0],
                    top: +e[1] || 0
                }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
            },
            _isRootNode: function (t) {
                return /(html|body)/i.test(t.tagName) || t === this.document[0]
            },
            _getParentOffset: function () {
                var e = this.offsetParent.offset(), i = this.document[0];
                return "absolute" === this.cssPosition && this.scrollParent[0] !== i && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (e = {
                    top: 0,
                    left: 0
                }), {
                    top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
            },
            _getRelativeOffset: function () {
                if ("relative" !== this.cssPosition) return {top: 0, left: 0};
                var t = this.element.position(), e = this._isRootNode(this.scrollParent[0]);
                return {
                    top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                    left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
                }
            },
            _cacheMargins: function () {
                this.margins = {
                    left: parseInt(this.element.css("marginLeft"), 10) || 0,
                    top: parseInt(this.element.css("marginTop"), 10) || 0,
                    right: parseInt(this.element.css("marginRight"), 10) || 0,
                    bottom: parseInt(this.element.css("marginBottom"), 10) || 0
                }
            },
            _cacheHelperProportions: function () {
                this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
            },
            _setContainment: function () {
                var e, i, s, n = this.options, o = this.document[0];
                return this.relativeContainer = null, n.containment ? "window" === n.containment ? (this.containment = [t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === n.containment ? (this.containment = [0, 0, t(o).width() - this.helperProportions.width - this.margins.left, (t(o).height() || o.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : n.containment.constructor === Array ? (this.containment = n.containment, void 0) : ("parent" === n.containment && (n.containment = this.helper[0].parentNode), i = t(n.containment), s = i[0], s && (e = /(scroll|auto)/.test(i.css("overflow")), this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = i), void 0) : (this.containment = null, void 0)
            },
            _convertPositionTo: function (t, e) {
                e || (e = this.position);
                var i = "absolute" === t ? 1 : -1, s = this._isRootNode(this.scrollParent[0]);
                return {
                    top: e.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : s ? 0 : this.offset.scroll.top) * i,
                    left: e.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : s ? 0 : this.offset.scroll.left) * i
                }
            },
            _generatePosition: function (t, e) {
                var i, s, n, o, a = this.options, r = this._isRootNode(this.scrollParent[0]), l = t.pageX, h = t.pageY;
                return r && this.offset.scroll || (this.offset.scroll = {
                    top: this.scrollParent.scrollTop(),
                    left: this.scrollParent.scrollLeft()
                }), e && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, t.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), t.pageY - this.offset.click.top < i[1] && (h = i[1] + this.offset.click.top), t.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), t.pageY - this.offset.click.top > i[3] && (h = i[3] + this.offset.click.top)), a.grid && (n = a.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / a.grid[1]) * a.grid[1] : this.originalPageY, h = i ? n - this.offset.click.top >= i[1] || n - this.offset.click.top > i[3] ? n : n - this.offset.click.top >= i[1] ? n - a.grid[1] : n + a.grid[1] : n, o = a.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / a.grid[0]) * a.grid[0] : this.originalPageX, l = i ? o - this.offset.click.left >= i[0] || o - this.offset.click.left > i[2] ? o : o - this.offset.click.left >= i[0] ? o - a.grid[0] : o + a.grid[0] : o), "y" === a.axis && (l = this.originalPageX), "x" === a.axis && (h = this.originalPageY)), {
                    top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : r ? 0 : this.offset.scroll.top),
                    left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : r ? 0 : this.offset.scroll.left)
                }
            },
            _clear: function () {
                this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
            },
            _trigger: function (e, i, s) {
                return s = s || this._uiHash(), t.ui.plugin.call(this, e, [i, s, this], !0), /^(drag|start|stop)/.test(e) && (this.positionAbs = this._convertPositionTo("absolute"), s.offset = this.positionAbs), t.Widget.prototype._trigger.call(this, e, i, s)
            },
            plugins: {},
            _uiHash: function () {
                return {
                    helper: this.helper,
                    position: this.position,
                    originalPosition: this.originalPosition,
                    offset: this.positionAbs
                }
            }
        }), t.ui.plugin.add("draggable", "connectToSortable", {
            start: function (e, i, s) {
                var n = t.extend({}, i, {item: s.element});
                s.sortables = [], t(s.options.connectToSortable).each(function () {
                    var i = t(this).sortable("instance");
                    i && !i.options.disabled && (s.sortables.push(i), i.refreshPositions(), i._trigger("activate", e, n))
                })
            }, stop: function (e, i, s) {
                var n = t.extend({}, i, {item: s.element});
                s.cancelHelperRemoval = !1, t.each(s.sortables, function () {
                    var t = this;
                    t.isOver ? (t.isOver = 0, s.cancelHelperRemoval = !0, t.cancelHelperRemoval = !1, t._storedCSS = {
                        position: t.placeholder.css("position"),
                        top: t.placeholder.css("top"),
                        left: t.placeholder.css("left")
                    }, t._mouseStop(e), t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0, t._trigger("deactivate", e, n))
                })
            }, drag: function (e, i, s) {
                t.each(s.sortables, function () {
                    var n = !1, o = this;
                    o.positionAbs = s.positionAbs, o.helperProportions = s.helperProportions, o.offset.click = s.offset.click, o._intersectsWith(o.containerCache) && (n = !0, t.each(s.sortables, function () {
                        return this.positionAbs = s.positionAbs, this.helperProportions = s.helperProportions, this.offset.click = s.offset.click, this !== o && this._intersectsWith(this.containerCache) && t.contains(o.element[0], this.element[0]) && (n = !1), n
                    })), n ? (o.isOver || (o.isOver = 1, s._parent = i.helper.parent(), o.currentItem = i.helper.appendTo(o.element).data("ui-sortable-item", !0), o.options._helper = o.options.helper, o.options.helper = function () {
                        return i.helper[0]
                    }, e.target = o.currentItem[0], o._mouseCapture(e, !0), o._mouseStart(e, !0, !0), o.offset.click.top = s.offset.click.top, o.offset.click.left = s.offset.click.left, o.offset.parent.left -= s.offset.parent.left - o.offset.parent.left, o.offset.parent.top -= s.offset.parent.top - o.offset.parent.top, s._trigger("toSortable", e), s.dropped = o.element, t.each(s.sortables, function () {
                        this.refreshPositions()
                    }), s.currentItem = s.element, o.fromOutside = s), o.currentItem && (o._mouseDrag(e), i.position = o.position)) : o.isOver && (o.isOver = 0, o.cancelHelperRemoval = !0, o.options._revert = o.options.revert, o.options.revert = !1, o._trigger("out", e, o._uiHash(o)), o._mouseStop(e, !0), o.options.revert = o.options._revert, o.options.helper = o.options._helper, o.placeholder && o.placeholder.remove(), i.helper.appendTo(s._parent), s._refreshOffsets(e), i.position = s._generatePosition(e, !0), s._trigger("fromSortable", e), s.dropped = !1, t.each(s.sortables, function () {
                        this.refreshPositions()
                    }))
                })
            }
        }), t.ui.plugin.add("draggable", "cursor", {
            start: function (e, i, s) {
                var n = t("body"), o = s.options;
                n.css("cursor") && (o._cursor = n.css("cursor")), n.css("cursor", o.cursor)
            }, stop: function (e, i, s) {
                var n = s.options;
                n._cursor && t("body").css("cursor", n._cursor)
            }
        }), t.ui.plugin.add("draggable", "opacity", {
            start: function (e, i, s) {
                var n = t(i.helper), o = s.options;
                n.css("opacity") && (o._opacity = n.css("opacity")), n.css("opacity", o.opacity)
            }, stop: function (e, i, s) {
                var n = s.options;
                n._opacity && t(i.helper).css("opacity", n._opacity)
            }
        }), t.ui.plugin.add("draggable", "scroll", {
            start: function (t, e, i) {
                i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)), i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
            }, drag: function (e, i, s) {
                var n = s.options, o = !1, a = s.scrollParentNotHidden[0], r = s.document[0];
                a !== r && "HTML" !== a.tagName ? (n.axis && "x" === n.axis || (s.overflowOffset.top + a.offsetHeight - e.pageY < n.scrollSensitivity ? a.scrollTop = o = a.scrollTop + n.scrollSpeed : e.pageY - s.overflowOffset.top < n.scrollSensitivity && (a.scrollTop = o = a.scrollTop - n.scrollSpeed)), n.axis && "y" === n.axis || (s.overflowOffset.left + a.offsetWidth - e.pageX < n.scrollSensitivity ? a.scrollLeft = o = a.scrollLeft + n.scrollSpeed : e.pageX - s.overflowOffset.left < n.scrollSensitivity && (a.scrollLeft = o = a.scrollLeft - n.scrollSpeed))) : (n.axis && "x" === n.axis || (e.pageY - t(r).scrollTop() < n.scrollSensitivity ? o = t(r).scrollTop(t(r).scrollTop() - n.scrollSpeed) : t(window).height() - (e.pageY - t(r).scrollTop()) < n.scrollSensitivity && (o = t(r).scrollTop(t(r).scrollTop() + n.scrollSpeed))), n.axis && "y" === n.axis || (e.pageX - t(r).scrollLeft() < n.scrollSensitivity ? o = t(r).scrollLeft(t(r).scrollLeft() - n.scrollSpeed) : t(window).width() - (e.pageX - t(r).scrollLeft()) < n.scrollSensitivity && (o = t(r).scrollLeft(t(r).scrollLeft() + n.scrollSpeed)))), o !== !1 && t.ui.ddmanager && !n.dropBehaviour && t.ui.ddmanager.prepareOffsets(s, e)
            }
        }), t.ui.plugin.add("draggable", "snap", {
            start: function (e, i, s) {
                var n = s.options;
                s.snapElements = [], t(n.snap.constructor !== String ? n.snap.items || ":data(ui-draggable)" : n.snap).each(function () {
                    var e = t(this), i = e.offset();
                    this !== s.element[0] && s.snapElements.push({
                        item: this,
                        width: e.outerWidth(),
                        height: e.outerHeight(),
                        top: i.top,
                        left: i.left
                    })
                })
            }, drag: function (e, i, s) {
                var n, o, a, r, l, h, c, u, d, p, f = s.options, g = f.snapTolerance, m = i.offset.left,
                    _ = m + s.helperProportions.width, v = i.offset.top, b = v + s.helperProportions.height;
                for (d = s.snapElements.length - 1; d >= 0; d--) l = s.snapElements[d].left - s.margins.left, h = l + s.snapElements[d].width, c = s.snapElements[d].top - s.margins.top, u = c + s.snapElements[d].height, l - g > _ || m > h + g || c - g > b || v > u + g || !t.contains(s.snapElements[d].item.ownerDocument, s.snapElements[d].item) ? (s.snapElements[d].snapping && s.options.snap.release && s.options.snap.release.call(s.element, e, t.extend(s._uiHash(), {snapItem: s.snapElements[d].item})), s.snapElements[d].snapping = !1) : ("inner" !== f.snapMode && (n = g >= Math.abs(c - b), o = g >= Math.abs(u - v), a = g >= Math.abs(l - _), r = g >= Math.abs(h - m), n && (i.position.top = s._convertPositionTo("relative", {
                    top: c - s.helperProportions.height,
                    left: 0
                }).top), o && (i.position.top = s._convertPositionTo("relative", {
                    top: u,
                    left: 0
                }).top), a && (i.position.left = s._convertPositionTo("relative", {
                    top: 0,
                    left: l - s.helperProportions.width
                }).left), r && (i.position.left = s._convertPositionTo("relative", {
                    top: 0,
                    left: h
                }).left)), p = n || o || a || r, "outer" !== f.snapMode && (n = g >= Math.abs(c - v), o = g >= Math.abs(u - b), a = g >= Math.abs(l - m), r = g >= Math.abs(h - _), n && (i.position.top = s._convertPositionTo("relative", {
                    top: c,
                    left: 0
                }).top), o && (i.position.top = s._convertPositionTo("relative", {
                    top: u - s.helperProportions.height,
                    left: 0
                }).top), a && (i.position.left = s._convertPositionTo("relative", {
                    top: 0,
                    left: l
                }).left), r && (i.position.left = s._convertPositionTo("relative", {
                    top: 0,
                    left: h - s.helperProportions.width
                }).left)), !s.snapElements[d].snapping && (n || o || a || r || p) && s.options.snap.snap && s.options.snap.snap.call(s.element, e, t.extend(s._uiHash(), {snapItem: s.snapElements[d].item})), s.snapElements[d].snapping = n || o || a || r || p)
            }
        }), t.ui.plugin.add("draggable", "stack", {
            start: function (e, i, s) {
                var n, o = s.options, a = t.makeArray(t(o.stack)).sort(function (e, i) {
                    return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0)
                });
                a.length && (n = parseInt(t(a[0]).css("zIndex"), 10) || 0, t(a).each(function (e) {
                    t(this).css("zIndex", n + e)
                }), this.css("zIndex", n + a.length))
            }
        }), t.ui.plugin.add("draggable", "zIndex", {
            start: function (e, i, s) {
                var n = t(i.helper), o = s.options;
                n.css("zIndex") && (o._zIndex = n.css("zIndex")), n.css("zIndex", o.zIndex)
            }, stop: function (e, i, s) {
                var n = s.options;
                n._zIndex && t(i.helper).css("zIndex", n._zIndex)
            }
        }), t.ui.draggable, t.widget("ui.droppable", {
            version: "1.12.1",
            widgetEventPrefix: "drop",
            options: {
                accept: "*",
                addClasses: !0,
                greedy: !1,
                scope: "default",
                tolerance: "intersect",
                activate: null,
                deactivate: null,
                drop: null,
                out: null,
                over: null
            },
            _create: function () {
                var e, i = this.options, s = i.accept;
                this.isover = !1, this.isout = !0, this.accept = t.isFunction(s) ? s : function (t) {
                    return t.is(s)
                }, this.proportions = function () {
                    return arguments.length ? (e = arguments[0], void 0) : e ? e : e = {
                        width: this.element[0].offsetWidth,
                        height: this.element[0].offsetHeight
                    }
                }, this._addToManager(i.scope), i.addClasses && this._addClass("ui-droppable")
            },
            _addToManager: function (e) {
                t.ui.ddmanager.droppables[e] = t.ui.ddmanager.droppables[e] || [], t.ui.ddmanager.droppables[e].push(this)
            },
            _splice: function (t) {
                for (var e = 0; t.length > e; e++) t[e] === this && t.splice(e, 1)
            },
            _destroy: function () {
                var e = t.ui.ddmanager.droppables[this.options.scope];
                this._splice(e)
            },
            _setOption: function (e, i) {
                if ("accept" === e) this.accept = t.isFunction(i) ? i : function (t) {
                    return t.is(i)
                }; else if ("scope" === e) {
                    var s = t.ui.ddmanager.droppables[this.options.scope];
                    this._splice(s), this._addToManager(i)
                }
                this._super(e, i)
            },
            _activate: function (e) {
                var i = t.ui.ddmanager.current;
                this._addActiveClass(), i && this._trigger("activate", e, this.ui(i))
            },
            _deactivate: function (e) {
                var i = t.ui.ddmanager.current;
                this._removeActiveClass(), i && this._trigger("deactivate", e, this.ui(i))
            },
            _over: function (e) {
                var i = t.ui.ddmanager.current;
                i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this._addHoverClass(), this._trigger("over", e, this.ui(i)))
            },
            _out: function (e) {
                var i = t.ui.ddmanager.current;
                i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this._removeHoverClass(), this._trigger("out", e, this.ui(i)))
            },
            _drop: function (e, i) {
                var s = i || t.ui.ddmanager.current, n = !1;
                return s && (s.currentItem || s.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
                    var i = t(this).droppable("instance");
                    return i.options.greedy && !i.options.disabled && i.options.scope === s.options.scope && i.accept.call(i.element[0], s.currentItem || s.element) && c(s, t.extend(i, {offset: i.element.offset()}), i.options.tolerance, e) ? (n = !0, !1) : void 0
                }), n ? !1 : this.accept.call(this.element[0], s.currentItem || s.element) ? (this._removeActiveClass(), this._removeHoverClass(), this._trigger("drop", e, this.ui(s)), this.element) : !1) : !1
            },
            ui: function (t) {
                return {
                    draggable: t.currentItem || t.element,
                    helper: t.helper,
                    position: t.position,
                    offset: t.positionAbs
                }
            },
            _addHoverClass: function () {
                this._addClass("ui-droppable-hover")
            },
            _removeHoverClass: function () {
                this._removeClass("ui-droppable-hover")
            },
            _addActiveClass: function () {
                this._addClass("ui-droppable-active")
            },
            _removeActiveClass: function () {
                this._removeClass("ui-droppable-active")
            }
        });
        var c = t.ui.intersect = function () {
            function t(t, e, i) {
                return t >= e && e + i > t
            }

            return function (e, i, s, n) {
                if (!i.offset) return !1;
                var o = (e.positionAbs || e.position.absolute).left + e.margins.left,
                    a = (e.positionAbs || e.position.absolute).top + e.margins.top, r = o + e.helperProportions.width,
                    l = a + e.helperProportions.height, h = i.offset.left, c = i.offset.top,
                    u = h + i.proportions().width, d = c + i.proportions().height;
                switch (s) {
                    case"fit":
                        return o >= h && u >= r && a >= c && d >= l;
                    case"intersect":
                        return o + e.helperProportions.width / 2 > h && u > r - e.helperProportions.width / 2 && a + e.helperProportions.height / 2 > c && d > l - e.helperProportions.height / 2;
                    case"pointer":
                        return t(n.pageY, c, i.proportions().height) && t(n.pageX, h, i.proportions().width);
                    case"touch":
                        return (a >= c && d >= a || l >= c && d >= l || c > a && l > d) && (o >= h && u >= o || r >= h && u >= r || h > o && r > u);
                    default:
                        return !1
                }
            }
        }();
        t.ui.ddmanager = {
            current: null, droppables: {"default": []}, prepareOffsets: function (e, i) {
                var s, n, o = t.ui.ddmanager.droppables[e.options.scope] || [], a = i ? i.type : null,
                    r = (e.currentItem || e.element).find(":data(ui-droppable)").addBack();
                t:for (s = 0; o.length > s; s++) if (!(o[s].options.disabled || e && !o[s].accept.call(o[s].element[0], e.currentItem || e.element))) {
                    for (n = 0; r.length > n; n++) if (r[n] === o[s].element[0]) {
                        o[s].proportions().height = 0;
                        continue t
                    }
                    o[s].visible = "none" !== o[s].element.css("display"), o[s].visible && ("mousedown" === a && o[s]._activate.call(o[s], i), o[s].offset = o[s].element.offset(), o[s].proportions({
                        width: o[s].element[0].offsetWidth,
                        height: o[s].element[0].offsetHeight
                    }))
                }
            }, drop: function (e, i) {
                var s = !1;
                return t.each((t.ui.ddmanager.droppables[e.options.scope] || []).slice(), function () {
                    this.options && (!this.options.disabled && this.visible && c(e, this, this.options.tolerance, i) && (s = this._drop.call(this, i) || s), !this.options.disabled && this.visible && this.accept.call(this.element[0], e.currentItem || e.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i)))
                }), s
            }, dragStart: function (e, i) {
                e.element.parentsUntil("body").on("scroll.droppable", function () {
                    e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
                })
            }, drag: function (e, i) {
                e.options.refreshPositions && t.ui.ddmanager.prepareOffsets(e, i), t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function () {
                    if (!this.options.disabled && !this.greedyChild && this.visible) {
                        var s, n, o, a = c(e, this, this.options.tolerance, i),
                            r = !a && this.isover ? "isout" : a && !this.isover ? "isover" : null;
                        r && (this.options.greedy && (n = this.options.scope, o = this.element.parents(":data(ui-droppable)").filter(function () {
                            return t(this).droppable("instance").options.scope === n
                        }), o.length && (s = t(o[0]).droppable("instance"), s.greedyChild = "isover" === r)), s && "isover" === r && (s.isover = !1, s.isout = !0, s._out.call(s, i)), this[r] = !0, this["isout" === r ? "isover" : "isout"] = !1, this["isover" === r ? "_over" : "_out"].call(this, i), s && "isout" === r && (s.isout = !1, s.isover = !0, s._over.call(s, i)))
                    }
                })
            }, dragStop: function (e, i) {
                e.element.parentsUntil("body").off("scroll.droppable"), e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
            }
        }, t.uiBackCompat !== !1 && t.widget("ui.droppable", t.ui.droppable, {
            options: {
                hoverClass: !1,
                activeClass: !1
            }, _addActiveClass: function () {
                this._super(), this.options.activeClass && this.element.addClass(this.options.activeClass)
            }, _removeActiveClass: function () {
                this._super(), this.options.activeClass && this.element.removeClass(this.options.activeClass)
            }, _addHoverClass: function () {
                this._super(), this.options.hoverClass && this.element.addClass(this.options.hoverClass)
            }, _removeHoverClass: function () {
                this._super(), this.options.hoverClass && this.element.removeClass(this.options.hoverClass)
            }
        }), t.ui.droppable, t.widget("ui.accordion", {
            version: "1.12.1",
            options: {
                active: 0,
                animate: {},
                classes: {
                    "ui-accordion-header": "ui-corner-top",
                    "ui-accordion-header-collapsed": "ui-corner-all",
                    "ui-accordion-content": "ui-corner-bottom"
                },
                collapsible: !1,
                event: "click",
                header: "> li > :first-child, > :not(li):even",
                heightStyle: "auto",
                icons: {activeHeader: "ui-icon-triangle-1-s", header: "ui-icon-triangle-1-e"},
                activate: null,
                beforeActivate: null
            },
            hideProps: {
                borderTopWidth: "hide",
                borderBottomWidth: "hide",
                paddingTop: "hide",
                paddingBottom: "hide",
                height: "hide"
            },
            showProps: {
                borderTopWidth: "show",
                borderBottomWidth: "show",
                paddingTop: "show",
                paddingBottom: "show",
                height: "show"
            },
            _create: function () {
                var e = this.options;
                this.prevShow = this.prevHide = t(), this._addClass("ui-accordion", "ui-widget ui-helper-reset"), this.element.attr("role", "tablist"), e.collapsible || e.active !== !1 && null != e.active || (e.active = 0), this._processPanels(), 0 > e.active && (e.active += this.headers.length), this._refresh()
            },
            _getCreateEventData: function () {
                return {header: this.active, panel: this.active.length ? this.active.next() : t()}
            },
            _createIcons: function () {
                var e, i, s = this.options.icons;
                s && (e = t("<span>"), this._addClass(e, "ui-accordion-header-icon", "ui-icon " + s.header), e.prependTo(this.headers), i = this.active.children(".ui-accordion-header-icon"), this._removeClass(i, s.header)._addClass(i, null, s.activeHeader)._addClass(this.headers, "ui-accordion-icons"))
            },
            _destroyIcons: function () {
                this._removeClass(this.headers, "ui-accordion-icons"), this.headers.children(".ui-accordion-header-icon").remove()
            },
            _destroy: function () {
                var t;
                this.element.removeAttr("role"), this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId(), this._destroyIcons(), t = this.headers.next().css("display", "").removeAttr("role aria-hidden aria-labelledby").removeUniqueId(), "content" !== this.options.heightStyle && t.css("height", "")
            },
            _setOption: function (t, e) {
                return "active" === t ? (this._activate(e), void 0) : ("event" === t && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(e)), this._super(t, e), "collapsible" !== t || e || this.options.active !== !1 || this._activate(0), "icons" === t && (this._destroyIcons(), e && this._createIcons()), void 0)
            },
            _setOptionDisabled: function (t) {
                this._super(t), this.element.attr("aria-disabled", t), this._toggleClass(null, "ui-state-disabled", !!t), this._toggleClass(this.headers.add(this.headers.next()), null, "ui-state-disabled", !!t)
            },
            _keydown: function (e) {
                if (!e.altKey && !e.ctrlKey) {
                    var i = t.ui.keyCode, s = this.headers.length, n = this.headers.index(e.target), o = !1;
                    switch (e.keyCode) {
                        case i.RIGHT:
                        case i.DOWN:
                            o = this.headers[(n + 1) % s];
                            break;
                        case i.LEFT:
                        case i.UP:
                            o = this.headers[(n - 1 + s) % s];
                            break;
                        case i.SPACE:
                        case i.ENTER:
                            this._eventHandler(e);
                            break;
                        case i.HOME:
                            o = this.headers[0];
                            break;
                        case i.END:
                            o = this.headers[s - 1]
                    }
                    o && (t(e.target).attr("tabIndex", -1), t(o).attr("tabIndex", 0), t(o).trigger("focus"), e.preventDefault())
                }
            },
            _panelKeyDown: function (e) {
                e.keyCode === t.ui.keyCode.UP && e.ctrlKey && t(e.currentTarget).prev().trigger("focus")
            },
            refresh: function () {
                var e = this.options;
                this._processPanels(), e.active === !1 && e.collapsible === !0 || !this.headers.length ? (e.active = !1, this.active = t()) : e.active === !1 ? this._activate(0) : this.active.length && !t.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (e.active = !1, this.active = t()) : this._activate(Math.max(0, e.active - 1)) : e.active = this.headers.index(this.active), this._destroyIcons(), this._refresh()
            },
            _processPanels: function () {
                var t = this.headers, e = this.panels;
                this.headers = this.element.find(this.options.header), this._addClass(this.headers, "ui-accordion-header ui-accordion-header-collapsed", "ui-state-default"), this.panels = this.headers.next().filter(":not(.ui-accordion-content-active)").hide(), this._addClass(this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content"), e && (this._off(t.not(this.headers)), this._off(e.not(this.panels)))
            },
            _refresh: function () {
                var e, i = this.options, s = i.heightStyle, n = this.element.parent();
                this.active = this._findActive(i.active), this._addClass(this.active, "ui-accordion-header-active", "ui-state-active")._removeClass(this.active, "ui-accordion-header-collapsed"), this._addClass(this.active.next(), "ui-accordion-content-active"), this.active.next().show(), this.headers.attr("role", "tab").each(function () {
                    var e = t(this), i = e.uniqueId().attr("id"), s = e.next(), n = s.uniqueId().attr("id");
                    e.attr("aria-controls", n), s.attr("aria-labelledby", i)
                }).next().attr("role", "tabpanel"), this.headers.not(this.active).attr({
                    "aria-selected": "false",
                    "aria-expanded": "false",
                    tabIndex: -1
                }).next().attr({"aria-hidden": "true"}).hide(), this.active.length ? this.active.attr({
                    "aria-selected": "true",
                    "aria-expanded": "true",
                    tabIndex: 0
                }).next().attr({"aria-hidden": "false"}) : this.headers.eq(0).attr("tabIndex", 0), this._createIcons(), this._setupEvents(i.event), "fill" === s ? (e = n.height(), this.element.siblings(":visible").each(function () {
                    var i = t(this), s = i.css("position");
                    "absolute" !== s && "fixed" !== s && (e -= i.outerHeight(!0))
                }), this.headers.each(function () {
                    e -= t(this).outerHeight(!0)
                }), this.headers.next().each(function () {
                    t(this).height(Math.max(0, e - t(this).innerHeight() + t(this).height()))
                }).css("overflow", "auto")) : "auto" === s && (e = 0, this.headers.next().each(function () {
                    var i = t(this).is(":visible");
                    i || t(this).show(), e = Math.max(e, t(this).css("height", "").height()), i || t(this).hide()
                }).height(e))
            },
            _activate: function (e) {
                var i = this._findActive(e)[0];
                i !== this.active[0] && (i = i || this.active[0], this._eventHandler({
                    target: i,
                    currentTarget: i,
                    preventDefault: t.noop
                }))
            },
            _findActive: function (e) {
                return "number" == typeof e ? this.headers.eq(e) : t()
            },
            _setupEvents: function (e) {
                var i = {keydown: "_keydown"};
                e && t.each(e.split(" "), function (t, e) {
                    i[e] = "_eventHandler"
                }), this._off(this.headers.add(this.headers.next())), this._on(this.headers, i), this._on(this.headers.next(), {keydown: "_panelKeyDown"}), this._hoverable(this.headers), this._focusable(this.headers)
            },
            _eventHandler: function (e) {
                var i, s, n = this.options, o = this.active, a = t(e.currentTarget), r = a[0] === o[0],
                    l = r && n.collapsible, h = l ? t() : a.next(), c = o.next(),
                    u = {oldHeader: o, oldPanel: c, newHeader: l ? t() : a, newPanel: h};
                e.preventDefault(), r && !n.collapsible || this._trigger("beforeActivate", e, u) === !1 || (n.active = l ? !1 : this.headers.index(a), this.active = r ? t() : a, this._toggle(u), this._removeClass(o, "ui-accordion-header-active", "ui-state-active"), n.icons && (i = o.children(".ui-accordion-header-icon"), this._removeClass(i, null, n.icons.activeHeader)._addClass(i, null, n.icons.header)), r || (this._removeClass(a, "ui-accordion-header-collapsed")._addClass(a, "ui-accordion-header-active", "ui-state-active"), n.icons && (s = a.children(".ui-accordion-header-icon"), this._removeClass(s, null, n.icons.header)._addClass(s, null, n.icons.activeHeader)), this._addClass(a.next(), "ui-accordion-content-active")))
            },
            _toggle: function (e) {
                var i = e.newPanel, s = this.prevShow.length ? this.prevShow : e.oldPanel;
                this.prevShow.add(this.prevHide).stop(!0, !0), this.prevShow = i, this.prevHide = s, this.options.animate ? this._animate(i, s, e) : (s.hide(), i.show(), this._toggleComplete(e)), s.attr({"aria-hidden": "true"}), s.prev().attr({
                    "aria-selected": "false",
                    "aria-expanded": "false"
                }), i.length && s.length ? s.prev().attr({
                    tabIndex: -1,
                    "aria-expanded": "false"
                }) : i.length && this.headers.filter(function () {
                    return 0 === parseInt(t(this).attr("tabIndex"), 10)
                }).attr("tabIndex", -1), i.attr("aria-hidden", "false").prev().attr({
                    "aria-selected": "true",
                    "aria-expanded": "true",
                    tabIndex: 0
                })
            },
            _animate: function (t, e, i) {
                var s, n, o, a = this, r = 0, l = t.css("box-sizing"),
                    h = t.length && (!e.length || t.index() < e.index()), c = this.options.animate || {},
                    u = h && c.down || c, d = function () {
                        a._toggleComplete(i)
                    };
                return "number" == typeof u && (o = u), "string" == typeof u && (n = u), n = n || u.easing || c.easing, o = o || u.duration || c.duration, e.length ? t.length ? (s = t.show().outerHeight(), e.animate(this.hideProps, {
                    duration: o,
                    easing: n,
                    step: function (t, e) {
                        e.now = Math.round(t)
                    }
                }), t.hide().animate(this.showProps, {
                    duration: o, easing: n, complete: d, step: function (t, i) {
                        i.now = Math.round(t), "height" !== i.prop ? "content-box" === l && (r += i.now) : "content" !== a.options.heightStyle && (i.now = Math.round(s - e.outerHeight() - r), r = 0)
                    }
                }), void 0) : e.animate(this.hideProps, o, n, d) : t.animate(this.showProps, o, n, d)
            },
            _toggleComplete: function (t) {
                var e = t.oldPanel, i = e.prev();
                this._removeClass(e, "ui-accordion-content-active"), this._removeClass(i, "ui-accordion-header-active")._addClass(i, "ui-accordion-header-collapsed"), e.length && (e.parent()[0].className = e.parent()[0].className), this._trigger("activate", null, t)
            }
        }), t.extend(t.ui, {datepicker: {version: "1.12.1"}});
        var u;
        t.extend(s.prototype, {
            markerClassName: "hasDatepicker",
            maxRows: 4,
            _widgetDatepicker: function () {
                return this.dpDiv
            },
            setDefaults: function (t) {
                return a(this._defaults, t || {}), this
            },
            _attachDatepicker: function (e, i) {
                var s, n, o;
                s = e.nodeName.toLowerCase(), n = "div" === s || "span" === s, e.id || (this.uuid += 1, e.id = "dp" + this.uuid), o = this._newInst(t(e), n), o.settings = t.extend({}, i || {}), "input" === s ? this._connectDatepicker(e, o) : n && this._inlineDatepicker(e, o)
            },
            _newInst: function (e, i) {
                var s = e[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
                return {
                    id: s,
                    input: e,
                    selectedDay: 0,
                    selectedMonth: 0,
                    selectedYear: 0,
                    drawMonth: 0,
                    drawYear: 0,
                    inline: i,
                    dpDiv: i ? n(t("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
                }
            },
            _connectDatepicker: function (e, i) {
                var s = t(e);
                i.append = t([]), i.trigger = t([]), s.hasClass(this.markerClassName) || (this._attachments(s, i), s.addClass(this.markerClassName).on("keydown", this._doKeyDown).on("keypress", this._doKeyPress).on("keyup", this._doKeyUp), this._autoSize(i), t.data(e, "datepicker", i), i.settings.disabled && this._disableDatepicker(e))
            },
            _attachments: function (e, i) {
                var s, n, o, a = this._get(i, "appendText"), r = this._get(i, "isRTL");
                i.append && i.append.remove(), a && (i.append = t("<span class='" + this._appendClass + "'>" + a + "</span>"), e[r ? "before" : "after"](i.append)), e.off("focus", this._showDatepicker), i.trigger && i.trigger.remove(), s = this._get(i, "showOn"), ("focus" === s || "both" === s) && e.on("focus", this._showDatepicker), ("button" === s || "both" === s) && (n = this._get(i, "buttonText"), o = this._get(i, "buttonImage"), i.trigger = t(this._get(i, "buttonImageOnly") ? t("<img/>").addClass(this._triggerClass).attr({
                    src: o,
                    alt: n,
                    title: n
                }) : t("<button type='button'></button>").addClass(this._triggerClass).html(o ? t("<img/>").attr({
                    src: o,
                    alt: n,
                    title: n
                }) : n)), e[r ? "before" : "after"](i.trigger), i.trigger.on("click", function () {
                    return t.datepicker._datepickerShowing && t.datepicker._lastInput === e[0] ? t.datepicker._hideDatepicker() : t.datepicker._datepickerShowing && t.datepicker._lastInput !== e[0] ? (t.datepicker._hideDatepicker(), t.datepicker._showDatepicker(e[0])) : t.datepicker._showDatepicker(e[0]), !1
                }))
            },
            _autoSize: function (t) {
                if (this._get(t, "autoSize") && !t.inline) {
                    var e, i, s, n, o = new Date(2009, 11, 20), a = this._get(t, "dateFormat");
                    a.match(/[DM]/) && (e = function (t) {
                        for (i = 0, s = 0, n = 0; t.length > n; n++) t[n].length > i && (i = t[n].length, s = n);
                        return s
                    }, o.setMonth(e(this._get(t, a.match(/MM/) ? "monthNames" : "monthNamesShort"))), o.setDate(e(this._get(t, a.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - o.getDay())), t.input.attr("size", this._formatDate(t, o).length)
                }
            },
            _inlineDatepicker: function (e, i) {
                var s = t(e);
                s.hasClass(this.markerClassName) || (s.addClass(this.markerClassName).append(i.dpDiv), t.data(e, "datepicker", i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(e), i.dpDiv.css("display", "block"))
            },
            _dialogDatepicker: function (e, i, s, n, o) {
                var r, l, h, c, u, d = this._dialogInst;
                return d || (this.uuid += 1, r = "dp" + this.uuid, this._dialogInput = t("<input type='text' id='" + r + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.on("keydown", this._doKeyDown), t("body").append(this._dialogInput), d = this._dialogInst = this._newInst(this._dialogInput, !1), d.settings = {}, t.data(this._dialogInput[0], "datepicker", d)), a(d.settings, n || {}), i = i && i.constructor === Date ? this._formatDate(d, i) : i, this._dialogInput.val(i), this._pos = o ? o.length ? o : [o.pageX, o.pageY] : null, this._pos || (l = document.documentElement.clientWidth, h = document.documentElement.clientHeight, c = document.documentElement.scrollLeft || document.body.scrollLeft, u = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [l / 2 - 100 + c, h / 2 - 150 + u]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), d.settings.onSelect = s, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), t.blockUI && t.blockUI(this.dpDiv), t.data(this._dialogInput[0], "datepicker", d), this
            },
            _destroyDatepicker: function (e) {
                var i, s = t(e), n = t.data(e, "datepicker");
                s.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), t.removeData(e, "datepicker"), "input" === i ? (n.append.remove(), n.trigger.remove(), s.removeClass(this.markerClassName).off("focus", this._showDatepicker).off("keydown", this._doKeyDown).off("keypress", this._doKeyPress).off("keyup", this._doKeyUp)) : ("div" === i || "span" === i) && s.removeClass(this.markerClassName).empty(), u === n && (u = null))
            },
            _enableDatepicker: function (e) {
                var i, s, n = t(e), o = t.data(e, "datepicker");
                n.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), "input" === i ? (e.disabled = !1, o.trigger.filter("button").each(function () {
                    this.disabled = !1
                }).end().filter("img").css({
                    opacity: "1.0",
                    cursor: ""
                })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().removeClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = t.map(this._disabledInputs, function (t) {
                    return t === e ? null : t
                }))
            },
            _disableDatepicker: function (e) {
                var i, s, n = t(e), o = t.data(e, "datepicker");
                n.hasClass(this.markerClassName) && (i = e.nodeName.toLowerCase(), "input" === i ? (e.disabled = !0, o.trigger.filter("button").each(function () {
                    this.disabled = !0
                }).end().filter("img").css({
                    opacity: "0.5",
                    cursor: "default"
                })) : ("div" === i || "span" === i) && (s = n.children("." + this._inlineClass), s.children().addClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = t.map(this._disabledInputs, function (t) {
                    return t === e ? null : t
                }), this._disabledInputs[this._disabledInputs.length] = e)
            },
            _isDisabledDatepicker: function (t) {
                if (!t) return !1;
                for (var e = 0; this._disabledInputs.length > e; e++) if (this._disabledInputs[e] === t) return !0;
                return !1
            },
            _getInst: function (e) {
                try {
                    return t.data(e, "datepicker")
                } catch (i) {
                    throw"Missing instance data for this datepicker"
                }
            },
            _optionDatepicker: function (e, i, s) {
                var n, o, r, l, h = this._getInst(e);
                return 2 === arguments.length && "string" == typeof i ? "defaults" === i ? t.extend({}, t.datepicker._defaults) : h ? "all" === i ? t.extend({}, h.settings) : this._get(h, i) : null : (n = i || {}, "string" == typeof i && (n = {}, n[i] = s), h && (this._curInst === h && this._hideDatepicker(), o = this._getDateDatepicker(e, !0), r = this._getMinMaxDate(h, "min"), l = this._getMinMaxDate(h, "max"), a(h.settings, n), null !== r && void 0 !== n.dateFormat && void 0 === n.minDate && (h.settings.minDate = this._formatDate(h, r)), null !== l && void 0 !== n.dateFormat && void 0 === n.maxDate && (h.settings.maxDate = this._formatDate(h, l)), "disabled" in n && (n.disabled ? this._disableDatepicker(e) : this._enableDatepicker(e)), this._attachments(t(e), h), this._autoSize(h), this._setDate(h, o), this._updateAlternate(h), this._updateDatepicker(h)), void 0)
            },
            _changeDatepicker: function (t, e, i) {
                this._optionDatepicker(t, e, i)
            },
            _refreshDatepicker: function (t) {
                var e = this._getInst(t);
                e && this._updateDatepicker(e)
            },
            _setDateDatepicker: function (t, e) {
                var i = this._getInst(t);
                i && (this._setDate(i, e), this._updateDatepicker(i), this._updateAlternate(i))
            },
            _getDateDatepicker: function (t, e) {
                var i = this._getInst(t);
                return i && !i.inline && this._setDateFromField(i, e), i ? this._getDate(i) : null
            },
            _doKeyDown: function (e) {
                var i, s, n, o = t.datepicker._getInst(e.target), a = !0, r = o.dpDiv.is(".ui-datepicker-rtl");
                if (o._keyEvent = !0, t.datepicker._datepickerShowing) switch (e.keyCode) {
                    case 9:
                        t.datepicker._hideDatepicker(), a = !1;
                        break;
                    case 13:
                        return n = t("td." + t.datepicker._dayOverClass + ":not(." + t.datepicker._currentClass + ")", o.dpDiv), n[0] && t.datepicker._selectDay(e.target, o.selectedMonth, o.selectedYear, n[0]), i = t.datepicker._get(o, "onSelect"), i ? (s = t.datepicker._formatDate(o), i.apply(o.input ? o.input[0] : null, [s, o])) : t.datepicker._hideDatepicker(), !1;
                    case 27:
                        t.datepicker._hideDatepicker();
                        break;
                    case 33:
                        t.datepicker._adjustDate(e.target, e.ctrlKey ? -t.datepicker._get(o, "stepBigMonths") : -t.datepicker._get(o, "stepMonths"), "M");
                        break;
                    case 34:
                        t.datepicker._adjustDate(e.target, e.ctrlKey ? +t.datepicker._get(o, "stepBigMonths") : +t.datepicker._get(o, "stepMonths"), "M");
                        break;
                    case 35:
                        (e.ctrlKey || e.metaKey) && t.datepicker._clearDate(e.target), a = e.ctrlKey || e.metaKey;
                        break;
                    case 36:
                        (e.ctrlKey || e.metaKey) && t.datepicker._gotoToday(e.target), a = e.ctrlKey || e.metaKey;
                        break;
                    case 37:
                        (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, r ? 1 : -1, "D"), a = e.ctrlKey || e.metaKey, e.originalEvent.altKey && t.datepicker._adjustDate(e.target, e.ctrlKey ? -t.datepicker._get(o, "stepBigMonths") : -t.datepicker._get(o, "stepMonths"), "M");
                        break;
                    case 38:
                        (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, -7, "D"), a = e.ctrlKey || e.metaKey;
                        break;
                    case 39:
                        (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, r ? -1 : 1, "D"), a = e.ctrlKey || e.metaKey, e.originalEvent.altKey && t.datepicker._adjustDate(e.target, e.ctrlKey ? +t.datepicker._get(o, "stepBigMonths") : +t.datepicker._get(o, "stepMonths"), "M");
                        break;
                    case 40:
                        (e.ctrlKey || e.metaKey) && t.datepicker._adjustDate(e.target, 7, "D"), a = e.ctrlKey || e.metaKey;
                        break;
                    default:
                        a = !1
                } else 36 === e.keyCode && e.ctrlKey ? t.datepicker._showDatepicker(this) : a = !1;
                a && (e.preventDefault(), e.stopPropagation())
            },
            _doKeyPress: function (e) {
                var i, s, n = t.datepicker._getInst(e.target);
                return t.datepicker._get(n, "constrainInput") ? (i = t.datepicker._possibleChars(t.datepicker._get(n, "dateFormat")), s = String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), e.ctrlKey || e.metaKey || " " > s || !i || i.indexOf(s) > -1) : void 0
            },
            _doKeyUp: function (e) {
                var i, s = t.datepicker._getInst(e.target);
                if (s.input.val() !== s.lastVal) try {
                    i = t.datepicker.parseDate(t.datepicker._get(s, "dateFormat"), s.input ? s.input.val() : null, t.datepicker._getFormatConfig(s)), i && (t.datepicker._setDateFromField(s), t.datepicker._updateAlternate(s), t.datepicker._updateDatepicker(s))
                } catch (n) {
                }
                return !0
            },
            _showDatepicker: function (e) {
                if (e = e.target || e, "input" !== e.nodeName.toLowerCase() && (e = t("input", e.parentNode)[0]), !t.datepicker._isDisabledDatepicker(e) && t.datepicker._lastInput !== e) {
                    var s, n, o, r, l, h, c;
                    s = t.datepicker._getInst(e), t.datepicker._curInst && t.datepicker._curInst !== s && (t.datepicker._curInst.dpDiv.stop(!0, !0), s && t.datepicker._datepickerShowing && t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])), n = t.datepicker._get(s, "beforeShow"), o = n ? n.apply(e, [e, s]) : {}, o !== !1 && (a(s.settings, o), s.lastVal = null, t.datepicker._lastInput = e, t.datepicker._setDateFromField(s), t.datepicker._inDialog && (e.value = ""), t.datepicker._pos || (t.datepicker._pos = t.datepicker._findPos(e), t.datepicker._pos[1] += e.offsetHeight), r = !1, t(e).parents().each(function () {
                        return r |= "fixed" === t(this).css("position"), !r
                    }), l = {
                        left: t.datepicker._pos[0],
                        top: t.datepicker._pos[1]
                    }, t.datepicker._pos = null, s.dpDiv.empty(), s.dpDiv.css({
                        position: "absolute",
                        display: "block",
                        top: "-1000px"
                    }), t.datepicker._updateDatepicker(s), l = t.datepicker._checkOffset(s, l, r), s.dpDiv.css({
                        position: t.datepicker._inDialog && t.blockUI ? "static" : r ? "fixed" : "absolute",
                        display: "none",
                        left: l.left + "px",
                        top: l.top + "px"
                    }), s.inline || (h = t.datepicker._get(s, "showAnim"), c = t.datepicker._get(s, "duration"), s.dpDiv.css("z-index", i(t(e)) + 1), t.datepicker._datepickerShowing = !0, t.effects && t.effects.effect[h] ? s.dpDiv.show(h, t.datepicker._get(s, "showOptions"), c) : s.dpDiv[h || "show"](h ? c : null), t.datepicker._shouldFocusInput(s) && s.input.trigger("focus"), t.datepicker._curInst = s))
                }
            },
            _updateDatepicker: function (e) {
                this.maxRows = 4, u = e, e.dpDiv.empty().append(this._generateHTML(e)), this._attachHandlers(e);
                var i, s = this._getNumberOfMonths(e), n = s[1], a = 17,
                    r = e.dpDiv.find("." + this._dayOverClass + " a");
                r.length > 0 && o.apply(r.get(0)), e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), n > 1 && e.dpDiv.addClass("ui-datepicker-multi-" + n).css("width", a * n + "em"), e.dpDiv[(1 !== s[0] || 1 !== s[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), e === t.datepicker._curInst && t.datepicker._datepickerShowing && t.datepicker._shouldFocusInput(e) && e.input.trigger("focus"), e.yearshtml && (i = e.yearshtml, setTimeout(function () {
                    i === e.yearshtml && e.yearshtml && e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml), i = e.yearshtml = null
                }, 0))
            },
            _shouldFocusInput: function (t) {
                return t.input && t.input.is(":visible") && !t.input.is(":disabled") && !t.input.is(":focus")
            },
            _checkOffset: function (e, i, s) {
                var n = e.dpDiv.outerWidth(), o = e.dpDiv.outerHeight(), a = e.input ? e.input.outerWidth() : 0,
                    r = e.input ? e.input.outerHeight() : 0,
                    l = document.documentElement.clientWidth + (s ? 0 : t(document).scrollLeft()),
                    h = document.documentElement.clientHeight + (s ? 0 : t(document).scrollTop());
                return i.left -= this._get(e, "isRTL") ? n - a : 0, i.left -= s && i.left === e.input.offset().left ? t(document).scrollLeft() : 0, i.top -= s && i.top === e.input.offset().top + r ? t(document).scrollTop() : 0, i.left -= Math.min(i.left, i.left + n > l && l > n ? Math.abs(i.left + n - l) : 0), i.top -= Math.min(i.top, i.top + o > h && h > o ? Math.abs(o + r) : 0), i
            },
            _findPos: function (e) {
                for (var i, s = this._getInst(e), n = this._get(s, "isRTL"); e && ("hidden" === e.type || 1 !== e.nodeType || t.expr.filters.hidden(e));) e = e[n ? "previousSibling" : "nextSibling"];
                return i = t(e).offset(), [i.left, i.top]
            },
            _hideDatepicker: function (e) {
                var i, s, n, o, a = this._curInst;
                !a || e && a !== t.data(e, "datepicker") || this._datepickerShowing && (i = this._get(a, "showAnim"), s = this._get(a, "duration"), n = function () {
                    t.datepicker._tidyDialog(a)
                }, t.effects && (t.effects.effect[i] || t.effects[i]) ? a.dpDiv.hide(i, t.datepicker._get(a, "showOptions"), s, n) : a.dpDiv["slideDown" === i ? "slideUp" : "fadeIn" === i ? "fadeOut" : "hide"](i ? s : null, n), i || n(), this._datepickerShowing = !1, o = this._get(a, "onClose"), o && o.apply(a.input ? a.input[0] : null, [a.input ? a.input.val() : "", a]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                    position: "absolute",
                    left: "0",
                    top: "-100px"
                }), t.blockUI && (t.unblockUI(), t("body").append(this.dpDiv))), this._inDialog = !1)
            },
            _tidyDialog: function (t) {
                t.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar")
            },
            _checkExternalClick: function (e) {
                if (t.datepicker._curInst) {
                    var i = t(e.target), s = t.datepicker._getInst(i[0]);
                    (i[0].id !== t.datepicker._mainDivId && 0 === i.parents("#" + t.datepicker._mainDivId).length && !i.hasClass(t.datepicker.markerClassName) && !i.closest("." + t.datepicker._triggerClass).length && t.datepicker._datepickerShowing && (!t.datepicker._inDialog || !t.blockUI) || i.hasClass(t.datepicker.markerClassName) && t.datepicker._curInst !== s) && t.datepicker._hideDatepicker()
                }
            },
            _adjustDate: function (e, i, s) {
                var n = t(e), o = this._getInst(n[0]);
                this._isDisabledDatepicker(n[0]) || (this._adjustInstDate(o, i + ("M" === s ? this._get(o, "showCurrentAtPos") : 0), s), this._updateDatepicker(o))
            },
            _gotoToday: function (e) {
                var i, s = t(e), n = this._getInst(s[0]);
                this._get(n, "gotoCurrent") && n.currentDay ? (n.selectedDay = n.currentDay, n.drawMonth = n.selectedMonth = n.currentMonth, n.drawYear = n.selectedYear = n.currentYear) : (i = new Date, n.selectedDay = i.getDate(), n.drawMonth = n.selectedMonth = i.getMonth(), n.drawYear = n.selectedYear = i.getFullYear()), this._notifyChange(n), this._adjustDate(s)
            },
            _selectMonthYear: function (e, i, s) {
                var n = t(e), o = this._getInst(n[0]);
                o["selected" + ("M" === s ? "Month" : "Year")] = o["draw" + ("M" === s ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10), this._notifyChange(o), this._adjustDate(n)
            },
            _selectDay: function (e, i, s, n) {
                var o, a = t(e);
                t(n).hasClass(this._unselectableClass) || this._isDisabledDatepicker(a[0]) || (o = this._getInst(a[0]), o.selectedDay = o.currentDay = t("a", n).html(), o.selectedMonth = o.currentMonth = i, o.selectedYear = o.currentYear = s, this._selectDate(e, this._formatDate(o, o.currentDay, o.currentMonth, o.currentYear)))
            },
            _clearDate: function (e) {
                var i = t(e);
                this._selectDate(i, "")
            },
            _selectDate: function (e, i) {
                var s, n = t(e), o = this._getInst(n[0]);
                i = null != i ? i : this._formatDate(o), o.input && o.input.val(i), this._updateAlternate(o), s = this._get(o, "onSelect"), s ? s.apply(o.input ? o.input[0] : null, [i, o]) : o.input && o.input.trigger("change"), o.inline ? this._updateDatepicker(o) : (this._hideDatepicker(), this._lastInput = o.input[0], "object" != typeof o.input[0] && o.input.trigger("focus"), this._lastInput = null)
            },
            _updateAlternate: function (e) {
                var i, s, n, o = this._get(e, "altField");
                o && (i = this._get(e, "altFormat") || this._get(e, "dateFormat"), s = this._getDate(e), n = this.formatDate(i, s, this._getFormatConfig(e)), t(o).val(n))
            },
            noWeekends: function (t) {
                var e = t.getDay();
                return [e > 0 && 6 > e, ""]
            },
            iso8601Week: function (t) {
                var e, i = new Date(t.getTime());
                return i.setDate(i.getDate() + 4 - (i.getDay() || 7)), e = i.getTime(), i.setMonth(0), i.setDate(1), Math.floor(Math.round((e - i) / 864e5) / 7) + 1
            },
            parseDate: function (e, i, s) {
                if (null == e || null == i) throw"Invalid arguments";
                if (i = "object" == typeof i ? "" + i : i + "", "" === i) return null;
                var n, o, a, r, l = 0, h = (s ? s.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                    c = "string" != typeof h ? h : (new Date).getFullYear() % 100 + parseInt(h, 10),
                    u = (s ? s.dayNamesShort : null) || this._defaults.dayNamesShort,
                    d = (s ? s.dayNames : null) || this._defaults.dayNames,
                    p = (s ? s.monthNamesShort : null) || this._defaults.monthNamesShort,
                    f = (s ? s.monthNames : null) || this._defaults.monthNames, g = -1, m = -1, _ = -1, v = -1, b = !1,
                    y = function (t) {
                        var i = e.length > n + 1 && e.charAt(n + 1) === t;
                        return i && n++, i
                    }, w = function (t) {
                        var e = y(t), s = "@" === t ? 14 : "!" === t ? 20 : "y" === t && e ? 4 : "o" === t ? 3 : 2,
                            n = "y" === t ? s : 1, o = RegExp("^\\d{" + n + "," + s + "}"), a = i.substring(l).match(o);
                        if (!a) throw"Missing number at position " + l;
                        return l += a[0].length, parseInt(a[0], 10)
                    }, k = function (e, s, n) {
                        var o = -1, a = t.map(y(e) ? n : s, function (t, e) {
                            return [[e, t]]
                        }).sort(function (t, e) {
                            return -(t[1].length - e[1].length)
                        });
                        if (t.each(a, function (t, e) {
                            var s = e[1];
                            return i.substr(l, s.length).toLowerCase() === s.toLowerCase() ? (o = e[0], l += s.length, !1) : void 0
                        }), -1 !== o) return o + 1;
                        throw"Unknown name at position " + l
                    }, x = function () {
                        if (i.charAt(l) !== e.charAt(n)) throw"Unexpected literal at position " + l;
                        l++
                    };
                for (n = 0; e.length > n; n++) if (b) "'" !== e.charAt(n) || y("'") ? x() : b = !1; else switch (e.charAt(n)) {
                    case"d":
                        _ = w("d");
                        break;
                    case"D":
                        k("D", u, d);
                        break;
                    case"o":
                        v = w("o");
                        break;
                    case"m":
                        m = w("m");
                        break;
                    case"M":
                        m = k("M", p, f);
                        break;
                    case"y":
                        g = w("y");
                        break;
                    case"@":
                        r = new Date(w("@")), g = r.getFullYear(), m = r.getMonth() + 1, _ = r.getDate();
                        break;
                    case"!":
                        r = new Date((w("!") - this._ticksTo1970) / 1e4), g = r.getFullYear(), m = r.getMonth() + 1, _ = r.getDate();
                        break;
                    case"'":
                        y("'") ? x() : b = !0;
                        break;
                    default:
                        x()
                }
                if (i.length > l && (a = i.substr(l), !/^\s+/.test(a))) throw"Extra/unparsed characters found in date: " + a;
                if (-1 === g ? g = (new Date).getFullYear() : 100 > g && (g += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (c >= g ? 0 : -100)), v > -1) for (m = 1, _ = v; ;) {
                    if (o = this._getDaysInMonth(g, m - 1), o >= _) break;
                    m++, _ -= o
                }
                if (r = this._daylightSavingAdjust(new Date(g, m - 1, _)), r.getFullYear() !== g || r.getMonth() + 1 !== m || r.getDate() !== _) throw"Invalid date";
                return r
            },
            ATOM: "yy-mm-dd",
            COOKIE: "D, dd M yy",
            ISO_8601: "yy-mm-dd",
            RFC_822: "D, d M y",
            RFC_850: "DD, dd-M-y",
            RFC_1036: "D, d M y",
            RFC_1123: "D, d M yy",
            RFC_2822: "D, d M yy",
            RSS: "D, d M y",
            TICKS: "!",
            TIMESTAMP: "@",
            W3C: "yy-mm-dd",
            _ticksTo1970: 1e7 * 60 * 60 * 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
            formatDate: function (t, e, i) {
                if (!e) return "";
                var s, n = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
                    o = (i ? i.dayNames : null) || this._defaults.dayNames,
                    a = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
                    r = (i ? i.monthNames : null) || this._defaults.monthNames, l = function (e) {
                        var i = t.length > s + 1 && t.charAt(s + 1) === e;
                        return i && s++, i
                    }, h = function (t, e, i) {
                        var s = "" + e;
                        if (l(t)) for (; i > s.length;) s = "0" + s;
                        return s
                    }, c = function (t, e, i, s) {
                        return l(t) ? s[e] : i[e]
                    }, u = "", d = !1;
                if (e) for (s = 0; t.length > s; s++) if (d) "'" !== t.charAt(s) || l("'") ? u += t.charAt(s) : d = !1; else switch (t.charAt(s)) {
                    case"d":
                        u += h("d", e.getDate(), 2);
                        break;
                    case"D":
                        u += c("D", e.getDay(), n, o);
                        break;
                    case"o":
                        u += h("o", Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() - new Date(e.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                        break;
                    case"m":
                        u += h("m", e.getMonth() + 1, 2);
                        break;
                    case"M":
                        u += c("M", e.getMonth(), a, r);
                        break;
                    case"y":
                        u += l("y") ? e.getFullYear() : (10 > e.getFullYear() % 100 ? "0" : "") + e.getFullYear() % 100;
                        break;
                    case"@":
                        u += e.getTime();
                        break;
                    case"!":
                        u += 1e4 * e.getTime() + this._ticksTo1970;
                        break;
                    case"'":
                        l("'") ? u += "'" : d = !0;
                        break;
                    default:
                        u += t.charAt(s)
                }
                return u
            },
            _possibleChars: function (t) {
                var e, i = "", s = !1, n = function (i) {
                    var s = t.length > e + 1 && t.charAt(e + 1) === i;
                    return s && e++, s
                };
                for (e = 0; t.length > e; e++) if (s) "'" !== t.charAt(e) || n("'") ? i += t.charAt(e) : s = !1; else switch (t.charAt(e)) {
                    case"d":
                    case"m":
                    case"y":
                    case"@":
                        i += "0123456789";
                        break;
                    case"D":
                    case"M":
                        return null;
                    case"'":
                        n("'") ? i += "'" : s = !0;
                        break;
                    default:
                        i += t.charAt(e)
                }
                return i
            },
            _get: function (t, e) {
                return void 0 !== t.settings[e] ? t.settings[e] : this._defaults[e]
            },
            _setDateFromField: function (t, e) {
                if (t.input.val() !== t.lastVal) {
                    var i = this._get(t, "dateFormat"), s = t.lastVal = t.input ? t.input.val() : null,
                        n = this._getDefaultDate(t), o = n, a = this._getFormatConfig(t);
                    try {
                        o = this.parseDate(i, s, a) || n
                    } catch (r) {
                        s = e ? "" : s
                    }
                    t.selectedDay = o.getDate(), t.drawMonth = t.selectedMonth = o.getMonth(), t.drawYear = t.selectedYear = o.getFullYear(), t.currentDay = s ? o.getDate() : 0, t.currentMonth = s ? o.getMonth() : 0, t.currentYear = s ? o.getFullYear() : 0, this._adjustInstDate(t)
                }
            },
            _getDefaultDate: function (t) {
                return this._restrictMinMax(t, this._determineDate(t, this._get(t, "defaultDate"), new Date))
            },
            _determineDate: function (e, i, s) {
                var n = function (t) {
                        var e = new Date;
                        return e.setDate(e.getDate() + t), e
                    }, o = function (i) {
                        try {
                            return t.datepicker.parseDate(t.datepicker._get(e, "dateFormat"), i, t.datepicker._getFormatConfig(e))
                        } catch (s) {
                        }
                        for (var n = (i.toLowerCase().match(/^c/) ? t.datepicker._getDate(e) : null) || new Date, o = n.getFullYear(), a = n.getMonth(), r = n.getDate(), l = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, h = l.exec(i); h;) {
                            switch (h[2] || "d") {
                                case"d":
                                case"D":
                                    r += parseInt(h[1], 10);
                                    break;
                                case"w":
                                case"W":
                                    r += 7 * parseInt(h[1], 10);
                                    break;
                                case"m":
                                case"M":
                                    a += parseInt(h[1], 10), r = Math.min(r, t.datepicker._getDaysInMonth(o, a));
                                    break;
                                case"y":
                                case"Y":
                                    o += parseInt(h[1], 10), r = Math.min(r, t.datepicker._getDaysInMonth(o, a))
                            }
                            h = l.exec(i)
                        }
                        return new Date(o, a, r)
                    },
                    a = null == i || "" === i ? s : "string" == typeof i ? o(i) : "number" == typeof i ? isNaN(i) ? s : n(i) : new Date(i.getTime());
                return a = a && "Invalid Date" == "" + a ? s : a, a && (a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0)), this._daylightSavingAdjust(a)
            },
            _daylightSavingAdjust: function (t) {
                return t ? (t.setHours(t.getHours() > 12 ? t.getHours() + 2 : 0), t) : null
            },
            _setDate: function (t, e, i) {
                var s = !e, n = t.selectedMonth, o = t.selectedYear,
                    a = this._restrictMinMax(t, this._determineDate(t, e, new Date));
                t.selectedDay = t.currentDay = a.getDate(), t.drawMonth = t.selectedMonth = t.currentMonth = a.getMonth(), t.drawYear = t.selectedYear = t.currentYear = a.getFullYear(), n === t.selectedMonth && o === t.selectedYear || i || this._notifyChange(t), this._adjustInstDate(t), t.input && t.input.val(s ? "" : this._formatDate(t))
            },
            _getDate: function (t) {
                var e = !t.currentYear || t.input && "" === t.input.val() ? null : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
                return e
            },
            _attachHandlers: function (e) {
                var i = this._get(e, "stepMonths"), s = "#" + e.id.replace(/\\\\/g, "\\");
                e.dpDiv.find("[data-handler]").map(function () {
                    var e = {
                        prev: function () {
                            t.datepicker._adjustDate(s, -i, "M")
                        }, next: function () {
                            t.datepicker._adjustDate(s, +i, "M")
                        }, hide: function () {
                            t.datepicker._hideDatepicker()
                        }, today: function () {
                            t.datepicker._gotoToday(s)
                        }, selectDay: function () {
                            return t.datepicker._selectDay(s, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                        }, selectMonth: function () {
                            return t.datepicker._selectMonthYear(s, this, "M"), !1
                        }, selectYear: function () {
                            return t.datepicker._selectMonthYear(s, this, "Y"), !1
                        }
                    };
                    t(this).on(this.getAttribute("data-event"), e[this.getAttribute("data-handler")])
                })
            },
            _generateHTML: function (t) {
                var e, i, s, n, o, a, r, l, h, c, u, d, p, f, g, m, _, v, b, y, w, k, x, C, D, T, I, M, P, S, N, H, z,
                    A, O, E, W, F, L, R = new Date,
                    Y = this._daylightSavingAdjust(new Date(R.getFullYear(), R.getMonth(), R.getDate())),
                    B = this._get(t, "isRTL"), j = this._get(t, "showButtonPanel"),
                    q = this._get(t, "hideIfNoPrevNext"), K = this._get(t, "navigationAsDateFormat"),
                    U = this._getNumberOfMonths(t), V = this._get(t, "showCurrentAtPos"),
                    X = this._get(t, "stepMonths"), $ = 1 !== U[0] || 1 !== U[1],
                    G = this._daylightSavingAdjust(t.currentDay ? new Date(t.currentYear, t.currentMonth, t.currentDay) : new Date(9999, 9, 9)),
                    J = this._getMinMaxDate(t, "min"), Q = this._getMinMaxDate(t, "max"), Z = t.drawMonth - V,
                    te = t.drawYear;
                if (0 > Z && (Z += 12, te--), Q) for (e = this._daylightSavingAdjust(new Date(Q.getFullYear(), Q.getMonth() - U[0] * U[1] + 1, Q.getDate())), e = J && J > e ? J : e; this._daylightSavingAdjust(new Date(te, Z, 1)) > e;) Z--, 0 > Z && (Z = 11, te--);
                for (t.drawMonth = Z, t.drawYear = te, i = this._get(t, "prevText"), i = K ? this.formatDate(i, this._daylightSavingAdjust(new Date(te, Z - X, 1)), this._getFormatConfig(t)) : i, s = this._canAdjustMonth(t, -1, te, Z) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (B ? "e" : "w") + "'>" + i + "</span></a>" : q ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + i + "'><span class='ui-icon ui-icon-circle-triangle-" + (B ? "e" : "w") + "'>" + i + "</span></a>", n = this._get(t, "nextText"), n = K ? this.formatDate(n, this._daylightSavingAdjust(new Date(te, Z + X, 1)), this._getFormatConfig(t)) : n, o = this._canAdjustMonth(t, 1, te, Z) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (B ? "w" : "e") + "'>" + n + "</span></a>" : q ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + n + "'><span class='ui-icon ui-icon-circle-triangle-" + (B ? "w" : "e") + "'>" + n + "</span></a>", a = this._get(t, "currentText"), r = this._get(t, "gotoCurrent") && t.currentDay ? G : Y, a = K ? this.formatDate(a, r, this._getFormatConfig(t)) : a, l = t.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(t, "closeText") + "</button>", h = j ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (B ? l : "") + (this._isInRange(t, r) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + a + "</button>" : "") + (B ? "" : l) + "</div>" : "", c = parseInt(this._get(t, "firstDay"), 10), c = isNaN(c) ? 0 : c, u = this._get(t, "showWeek"), d = this._get(t, "dayNames"), p = this._get(t, "dayNamesMin"), f = this._get(t, "monthNames"), g = this._get(t, "monthNamesShort"), m = this._get(t, "beforeShowDay"), _ = this._get(t, "showOtherMonths"), v = this._get(t, "selectOtherMonths"), b = this._getDefaultDate(t), y = "", k = 0; U[0] > k; k++) {
                    for (x = "", this.maxRows = 4, C = 0; U[1] > C; C++) {
                        if (D = this._daylightSavingAdjust(new Date(te, Z, t.selectedDay)), T = " ui-corner-all", I = "", $) {
                            if (I += "<div class='ui-datepicker-group", U[1] > 1) switch (C) {
                                case 0:
                                    I += " ui-datepicker-group-first", T = " ui-corner-" + (B ? "right" : "left");
                                    break;
                                case U[1] - 1:
                                    I += " ui-datepicker-group-last", T = " ui-corner-" + (B ? "left" : "right");
                                    break;
                                default:
                                    I += " ui-datepicker-group-middle", T = ""
                            }
                            I += "'>"
                        }
                        for (I += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + T + "'>" + (/all|left/.test(T) && 0 === k ? B ? o : s : "") + (/all|right/.test(T) && 0 === k ? B ? s : o : "") + this._generateMonthYearHeader(t, Z, te, J, Q, k > 0 || C > 0, f, g) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>", M = u ? "<th class='ui-datepicker-week-col'>" + this._get(t, "weekHeader") + "</th>" : "", w = 0; 7 > w; w++) P = (w + c) % 7, M += "<th scope='col'" + ((w + c + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + d[P] + "'>" + p[P] + "</span></th>";
                        for (I += M + "</tr></thead><tbody>", S = this._getDaysInMonth(te, Z), te === t.selectedYear && Z === t.selectedMonth && (t.selectedDay = Math.min(t.selectedDay, S)), N = (this._getFirstDayOfMonth(te, Z) - c + 7) % 7, H = Math.ceil((N + S) / 7), z = $ ? this.maxRows > H ? this.maxRows : H : H, this.maxRows = z, A = this._daylightSavingAdjust(new Date(te, Z, 1 - N)), O = 0; z > O; O++) {
                            for (I += "<tr>", E = u ? "<td class='ui-datepicker-week-col'>" + this._get(t, "calculateWeek")(A) + "</td>" : "", w = 0; 7 > w; w++) W = m ? m.apply(t.input ? t.input[0] : null, [A]) : [!0, ""], F = A.getMonth() !== Z, L = F && !v || !W[0] || J && J > A || Q && A > Q, E += "<td class='" + ((w + c + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (F ? " ui-datepicker-other-month" : "") + (A.getTime() === D.getTime() && Z === t.selectedMonth && t._keyEvent || b.getTime() === A.getTime() && b.getTime() === D.getTime() ? " " + this._dayOverClass : "") + (L ? " " + this._unselectableClass + " ui-state-disabled" : "") + (F && !_ ? "" : " " + W[1] + (A.getTime() === G.getTime() ? " " + this._currentClass : "") + (A.getTime() === Y.getTime() ? " ui-datepicker-today" : "")) + "'" + (F && !_ || !W[2] ? "" : " title='" + W[2].replace(/'/g, "&#39;") + "'") + (L ? "" : " data-handler='selectDay' data-event='click' data-month='" + A.getMonth() + "' data-year='" + A.getFullYear() + "'") + ">" + (F && !_ ? "&#xa0;" : L ? "<span class='ui-state-default'>" + A.getDate() + "</span>" : "<a class='ui-state-default" + (A.getTime() === Y.getTime() ? " ui-state-highlight" : "") + (A.getTime() === G.getTime() ? " ui-state-active" : "") + (F ? " ui-priority-secondary" : "") + "' href='#'>" + A.getDate() + "</a>") + "</td>", A.setDate(A.getDate() + 1), A = this._daylightSavingAdjust(A);
                            I += E + "</tr>"
                        }
                        Z++, Z > 11 && (Z = 0, te++), I += "</tbody></table>" + ($ ? "</div>" + (U[0] > 0 && C === U[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""), x += I
                    }
                    y += x
                }
                return y += h, t._keyEvent = !1, y
            },
            _generateMonthYearHeader: function (t, e, i, s, n, o, a, r) {
                var l, h, c, u, d, p, f, g, m = this._get(t, "changeMonth"), _ = this._get(t, "changeYear"),
                    v = this._get(t, "showMonthAfterYear"), b = "<div class='ui-datepicker-title'>", y = "";
                if (o || !m) y += "<span class='ui-datepicker-month'>" + a[e] + "</span>"; else {
                    for (l = s && s.getFullYear() === i, h = n && n.getFullYear() === i, y += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", c = 0; 12 > c; c++) (!l || c >= s.getMonth()) && (!h || n.getMonth() >= c) && (y += "<option value='" + c + "'" + (c === e ? " selected='selected'" : "") + ">" + r[c] + "</option>");
                    y += "</select>"
                }
                if (v || (b += y + (!o && m && _ ? "" : "&#xa0;")), !t.yearshtml) if (t.yearshtml = "", o || !_) b += "<span class='ui-datepicker-year'>" + i + "</span>"; else {
                    for (u = this._get(t, "yearRange").split(":"), d = (new Date).getFullYear(), p = function (t) {
                        var e = t.match(/c[+\-].*/) ? i + parseInt(t.substring(1), 10) : t.match(/[+\-].*/) ? d + parseInt(t, 10) : parseInt(t, 10);
                        return isNaN(e) ? d : e
                    }, f = p(u[0]), g = Math.max(f, p(u[1] || "")), f = s ? Math.max(f, s.getFullYear()) : f, g = n ? Math.min(g, n.getFullYear()) : g, t.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; g >= f; f++) t.yearshtml += "<option value='" + f + "'" + (f === i ? " selected='selected'" : "") + ">" + f + "</option>";
                    t.yearshtml += "</select>", b += t.yearshtml, t.yearshtml = null
                }
                return b += this._get(t, "yearSuffix"), v && (b += (!o && m && _ ? "" : "&#xa0;") + y), b += "</div>"
            },
            _adjustInstDate: function (t, e, i) {
                var s = t.selectedYear + ("Y" === i ? e : 0), n = t.selectedMonth + ("M" === i ? e : 0),
                    o = Math.min(t.selectedDay, this._getDaysInMonth(s, n)) + ("D" === i ? e : 0),
                    a = this._restrictMinMax(t, this._daylightSavingAdjust(new Date(s, n, o)));
                t.selectedDay = a.getDate(), t.drawMonth = t.selectedMonth = a.getMonth(), t.drawYear = t.selectedYear = a.getFullYear(), ("M" === i || "Y" === i) && this._notifyChange(t)
            },
            _restrictMinMax: function (t, e) {
                var i = this._getMinMaxDate(t, "min"), s = this._getMinMaxDate(t, "max"), n = i && i > e ? i : e;
                return s && n > s ? s : n
            },
            _notifyChange: function (t) {
                var e = this._get(t, "onChangeMonthYear");
                e && e.apply(t.input ? t.input[0] : null, [t.selectedYear, t.selectedMonth + 1, t])
            },
            _getNumberOfMonths: function (t) {
                var e = this._get(t, "numberOfMonths");
                return null == e ? [1, 1] : "number" == typeof e ? [1, e] : e
            },
            _getMinMaxDate: function (t, e) {
                return this._determineDate(t, this._get(t, e + "Date"), null)
            },
            _getDaysInMonth: function (t, e) {
                return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate()
            },
            _getFirstDayOfMonth: function (t, e) {
                return new Date(t, e, 1).getDay()
            },
            _canAdjustMonth: function (t, e, i, s) {
                var n = this._getNumberOfMonths(t),
                    o = this._daylightSavingAdjust(new Date(i, s + (0 > e ? e : n[0] * n[1]), 1));
                return 0 > e && o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth())), this._isInRange(t, o)
            },
            _isInRange: function (t, e) {
                var i, s, n = this._getMinMaxDate(t, "min"), o = this._getMinMaxDate(t, "max"), a = null, r = null,
                    l = this._get(t, "yearRange");
                return l && (i = l.split(":"), s = (new Date).getFullYear(), a = parseInt(i[0], 10), r = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (a += s), i[1].match(/[+\-].*/) && (r += s)), (!n || e.getTime() >= n.getTime()) && (!o || e.getTime() <= o.getTime()) && (!a || e.getFullYear() >= a) && (!r || r >= e.getFullYear())
            },
            _getFormatConfig: function (t) {
                var e = this._get(t, "shortYearCutoff");
                return e = "string" != typeof e ? e : (new Date).getFullYear() % 100 + parseInt(e, 10), {
                    shortYearCutoff: e,
                    dayNamesShort: this._get(t, "dayNamesShort"),
                    dayNames: this._get(t, "dayNames"),
                    monthNamesShort: this._get(t, "monthNamesShort"),
                    monthNames: this._get(t, "monthNames")
                }
            },
            _formatDate: function (t, e, i, s) {
                e || (t.currentDay = t.selectedDay, t.currentMonth = t.selectedMonth, t.currentYear = t.selectedYear);
                var n = e ? "object" == typeof e ? e : this._daylightSavingAdjust(new Date(s, i, e)) : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
                return this.formatDate(this._get(t, "dateFormat"), n, this._getFormatConfig(t))
            }
        }), t.fn.datepicker = function (e) {
            if (!this.length) return this;
            t.datepicker.initialized || (t(document).on("mousedown", t.datepicker._checkExternalClick), t.datepicker.initialized = !0), 0 === t("#" + t.datepicker._mainDivId).length && t("body").append(t.datepicker.dpDiv);
            var i = Array.prototype.slice.call(arguments, 1);
            return "string" != typeof e || "isDisabled" !== e && "getDate" !== e && "widget" !== e ? "option" === e && 2 === arguments.length && "string" == typeof arguments[1] ? t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this[0]].concat(i)) : this.each(function () {
                "string" == typeof e ? t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this].concat(i)) : t.datepicker._attachDatepicker(this, e)
            }) : t.datepicker["_" + e + "Datepicker"].apply(t.datepicker, [this[0]].concat(i))
        }, t.datepicker = new s, t.datepicker.initialized = !1, t.datepicker.uuid = (new Date).getTime(), t.datepicker.version = "1.12.1", t.datepicker, t.widget("ui.progressbar", {
            version: "1.12.1",
            options: {
                classes: {
                    "ui-progressbar": "ui-corner-all",
                    "ui-progressbar-value": "ui-corner-left",
                    "ui-progressbar-complete": "ui-corner-right"
                }, max: 100, value: 0, change: null, complete: null
            },
            min: 0,
            _create: function () {
                this.oldValue = this.options.value = this._constrainedValue(), this.element.attr({
                    role: "progressbar",
                    "aria-valuemin": this.min
                }), this._addClass("ui-progressbar", "ui-widget ui-widget-content"), this.valueDiv = t("<div>").appendTo(this.element), this._addClass(this.valueDiv, "ui-progressbar-value", "ui-widget-header"), this._refreshValue()
            },
            _destroy: function () {
                this.element.removeAttr("role aria-valuemin aria-valuemax aria-valuenow"), this.valueDiv.remove()
            },
            value: function (t) {
                return void 0 === t ? this.options.value : (this.options.value = this._constrainedValue(t), this._refreshValue(), void 0)
            },
            _constrainedValue: function (t) {
                return void 0 === t && (t = this.options.value), this.indeterminate = t === !1, "number" != typeof t && (t = 0), this.indeterminate ? !1 : Math.min(this.options.max, Math.max(this.min, t))
            },
            _setOptions: function (t) {
                var e = t.value;
                delete t.value, this._super(t), this.options.value = this._constrainedValue(e), this._refreshValue()
            },
            _setOption: function (t, e) {
                "max" === t && (e = Math.max(this.min, e)), this._super(t, e)
            },
            _setOptionDisabled: function (t) {
                this._super(t), this.element.attr("aria-disabled", t), this._toggleClass(null, "ui-state-disabled", !!t)
            },
            _percentage: function () {
                return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min)
            },
            _refreshValue: function () {
                var e = this.options.value, i = this._percentage();
                this.valueDiv.toggle(this.indeterminate || e > this.min).width(i.toFixed(0) + "%"), this._toggleClass(this.valueDiv, "ui-progressbar-complete", null, e === this.options.max)._toggleClass("ui-progressbar-indeterminate", null, this.indeterminate), this.indeterminate ? (this.element.removeAttr("aria-valuenow"), this.overlayDiv || (this.overlayDiv = t("<div>").appendTo(this.valueDiv), this._addClass(this.overlayDiv, "ui-progressbar-overlay"))) : (this.element.attr({
                    "aria-valuemax": this.options.max,
                    "aria-valuenow": e
                }), this.overlayDiv && (this.overlayDiv.remove(), this.overlayDiv = null)), this.oldValue !== e && (this.oldValue = e, this._trigger("change")), e === this.options.max && this._trigger("complete")
            }
        });
        var d = "ui-effects-", p = "ui-effects-style", f = "ui-effects-animated", g = t;
        t.effects = {effect: {}}, function (t, e) {
            function i(t, e, i) {
                var s = u[e.type] || {};
                return null == t ? i || !e.def ? null : e.def : (t = s.floor ? ~~t : parseFloat(t), isNaN(t) ? e.def : s.mod ? (t + s.mod) % s.mod : 0 > t ? 0 : t > s.max ? s.max : t)
            }

            function s(i) {
                var s = h(), n = s._rgba = [];
                return i = i.toLowerCase(), f(l, function (t, o) {
                    var a, r = o.re.exec(i), l = r && o.parse(r), h = o.space || "rgba";
                    return l ? (a = s[h](l), s[c[h].cache] = a[c[h].cache], n = s._rgba = a._rgba, !1) : e
                }), n.length ? ("0,0,0,0" === n.join() && t.extend(n, o.transparent), s) : o[i]
            }

            function n(t, e, i) {
                return i = (i + 1) % 1, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + 6 * (e - t) * (2 / 3 - i) : t
            }

            var o,
                a = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
                r = /^([\-+])=\s*(\d+\.?\d*)/, l = [{
                    re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function (t) {
                        return [t[1], t[2], t[3], t[4]]
                    }
                }, {
                    re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    parse: function (t) {
                        return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]]
                    }
                }, {
                    re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (t) {
                        return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
                    }
                }, {
                    re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (t) {
                        return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)]
                    }
                }, {
                    re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                    space: "hsla",
                    parse: function (t) {
                        return [t[1], t[2] / 100, t[3] / 100, t[4]]
                    }
                }], h = t.Color = function (e, i, s, n) {
                    return new t.Color.fn.parse(e, i, s, n)
                }, c = {
                    rgba: {
                        props: {
                            red: {idx: 0, type: "byte"},
                            green: {idx: 1, type: "byte"},
                            blue: {idx: 2, type: "byte"}
                        }
                    },
                    hsla: {
                        props: {
                            hue: {idx: 0, type: "degrees"},
                            saturation: {idx: 1, type: "percent"},
                            lightness: {idx: 2, type: "percent"}
                        }
                    }
                }, u = {"byte": {floor: !0, max: 255}, percent: {max: 1}, degrees: {mod: 360, floor: !0}},
                d = h.support = {}, p = t("<p>")[0], f = t.each;
            p.style.cssText = "background-color:rgba(1,1,1,.5)", d.rgba = p.style.backgroundColor.indexOf("rgba") > -1, f(c, function (t, e) {
                e.cache = "_" + t, e.props.alpha = {idx: 3, type: "percent", def: 1}
            }), h.fn = t.extend(h.prototype, {
                parse: function (n, a, r, l) {
                    if (n === e) return this._rgba = [null, null, null, null], this;
                    (n.jquery || n.nodeType) && (n = t(n).css(a), a = e);
                    var u = this, d = t.type(n), p = this._rgba = [];
                    return a !== e && (n = [n, a, r, l], d = "array"), "string" === d ? this.parse(s(n) || o._default) : "array" === d ? (f(c.rgba.props, function (t, e) {
                        p[e.idx] = i(n[e.idx], e)
                    }), this) : "object" === d ? (n instanceof h ? f(c, function (t, e) {
                        n[e.cache] && (u[e.cache] = n[e.cache].slice())
                    }) : f(c, function (e, s) {
                        var o = s.cache;
                        f(s.props, function (t, e) {
                            if (!u[o] && s.to) {
                                if ("alpha" === t || null == n[t]) return;
                                u[o] = s.to(u._rgba)
                            }
                            u[o][e.idx] = i(n[t], e, !0)
                        }), u[o] && 0 > t.inArray(null, u[o].slice(0, 3)) && (u[o][3] = 1, s.from && (u._rgba = s.from(u[o])))
                    }), this) : e
                }, is: function (t) {
                    var i = h(t), s = !0, n = this;
                    return f(c, function (t, o) {
                        var a, r = i[o.cache];
                        return r && (a = n[o.cache] || o.to && o.to(n._rgba) || [], f(o.props, function (t, i) {
                            return null != r[i.idx] ? s = r[i.idx] === a[i.idx] : e
                        })), s
                    }), s
                }, _space: function () {
                    var t = [], e = this;
                    return f(c, function (i, s) {
                        e[s.cache] && t.push(i)
                    }), t.pop()
                }, transition: function (t, e) {
                    var s = h(t), n = s._space(), o = c[n], a = 0 === this.alpha() ? h("transparent") : this,
                        r = a[o.cache] || o.to(a._rgba), l = r.slice();
                    return s = s[o.cache], f(o.props, function (t, n) {
                        var o = n.idx, a = r[o], h = s[o], c = u[n.type] || {};
                        null !== h && (null === a ? l[o] = h : (c.mod && (h - a > c.mod / 2 ? a += c.mod : a - h > c.mod / 2 && (a -= c.mod)), l[o] = i((h - a) * e + a, n)))
                    }), this[n](l)
                }, blend: function (e) {
                    if (1 === this._rgba[3]) return this;
                    var i = this._rgba.slice(), s = i.pop(), n = h(e)._rgba;
                    return h(t.map(i, function (t, e) {
                        return (1 - s) * n[e] + s * t
                    }))
                }, toRgbaString: function () {
                    var e = "rgba(", i = t.map(this._rgba, function (t, e) {
                        return null == t ? e > 2 ? 1 : 0 : t
                    });
                    return 1 === i[3] && (i.pop(), e = "rgb("), e + i.join() + ")"
                }, toHslaString: function () {
                    var e = "hsla(", i = t.map(this.hsla(), function (t, e) {
                        return null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), t
                    });
                    return 1 === i[3] && (i.pop(), e = "hsl("), e + i.join() + ")"
                }, toHexString: function (e) {
                    var i = this._rgba.slice(), s = i.pop();
                    return e && i.push(~~(255 * s)), "#" + t.map(i, function (t) {
                        return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t
                    }).join("")
                }, toString: function () {
                    return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
                }
            }), h.fn.parse.prototype = h.fn, c.hsla.to = function (t) {
                if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                var e, i, s = t[0] / 255, n = t[1] / 255, o = t[2] / 255, a = t[3], r = Math.max(s, n, o),
                    l = Math.min(s, n, o), h = r - l, c = r + l, u = .5 * c;
                return e = l === r ? 0 : s === r ? 60 * (n - o) / h + 360 : n === r ? 60 * (o - s) / h + 120 : 60 * (s - n) / h + 240, i = 0 === h ? 0 : .5 >= u ? h / c : h / (2 - c), [Math.round(e) % 360, i, u, null == a ? 1 : a]
            }, c.hsla.from = function (t) {
                if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                var e = t[0] / 360, i = t[1], s = t[2], o = t[3], a = .5 >= s ? s * (1 + i) : s + i - s * i,
                    r = 2 * s - a;
                return [Math.round(255 * n(r, a, e + 1 / 3)), Math.round(255 * n(r, a, e)), Math.round(255 * n(r, a, e - 1 / 3)), o]
            }, f(c, function (s, n) {
                var o = n.props, a = n.cache, l = n.to, c = n.from;
                h.fn[s] = function (s) {
                    if (l && !this[a] && (this[a] = l(this._rgba)), s === e) return this[a].slice();
                    var n, r = t.type(s), u = "array" === r || "object" === r ? s : arguments, d = this[a].slice();
                    return f(o, function (t, e) {
                        var s = u["object" === r ? t : e.idx];
                        null == s && (s = d[e.idx]), d[e.idx] = i(s, e)
                    }), c ? (n = h(c(d)), n[a] = d, n) : h(d)
                }, f(o, function (e, i) {
                    h.fn[e] || (h.fn[e] = function (n) {
                        var o, a = t.type(n), l = "alpha" === e ? this._hsla ? "hsla" : "rgba" : s, h = this[l](),
                            c = h[i.idx];
                        return "undefined" === a ? c : ("function" === a && (n = n.call(this, c), a = t.type(n)), null == n && i.empty ? this : ("string" === a && (o = r.exec(n), o && (n = c + parseFloat(o[2]) * ("+" === o[1] ? 1 : -1))), h[i.idx] = n, this[l](h)))
                    })
                })
            }), h.hook = function (e) {
                var i = e.split(" ");
                f(i, function (e, i) {
                    t.cssHooks[i] = {
                        set: function (e, n) {
                            var o, a, r = "";
                            if ("transparent" !== n && ("string" !== t.type(n) || (o = s(n)))) {
                                if (n = h(o || n), !d.rgba && 1 !== n._rgba[3]) {
                                    for (a = "backgroundColor" === i ? e.parentNode : e; ("" === r || "transparent" === r) && a && a.style;) try {
                                        r = t.css(a, "backgroundColor"), a = a.parentNode
                                    } catch (l) {
                                    }
                                    n = n.blend(r && "transparent" !== r ? r : "_default")
                                }
                                n = n.toRgbaString()
                            }
                            try {
                                e.style[i] = n
                            } catch (l) {
                            }
                        }
                    }, t.fx.step[i] = function (e) {
                        e.colorInit || (e.start = h(e.elem, i), e.end = h(e.end), e.colorInit = !0), t.cssHooks[i].set(e.elem, e.start.transition(e.end, e.pos))
                    }
                })
            }, h.hook(a), t.cssHooks.borderColor = {
                expand: function (t) {
                    var e = {};
                    return f(["Top", "Right", "Bottom", "Left"], function (i, s) {
                        e["border" + s + "Color"] = t
                    }), e
                }
            }, o = t.Color.names = {
                aqua: "#00ffff",
                black: "#000000",
                blue: "#0000ff",
                fuchsia: "#ff00ff",
                gray: "#808080",
                green: "#008000",
                lime: "#00ff00",
                maroon: "#800000",
                navy: "#000080",
                olive: "#808000",
                purple: "#800080",
                red: "#ff0000",
                silver: "#c0c0c0",
                teal: "#008080",
                white: "#ffffff",
                yellow: "#ffff00",
                transparent: [null, null, null, 0],
                _default: "#ffffff"
            }
        }(g), function () {
            function e(e) {
                var i, s,
                    n = e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, null) : e.currentStyle,
                    o = {};
                if (n && n.length && n[0] && n[n[0]]) for (s = n.length; s--;) i = n[s], "string" == typeof n[i] && (o[t.camelCase(i)] = n[i]); else for (i in n) "string" == typeof n[i] && (o[i] = n[i]);
                return o
            }

            function i(e, i) {
                var s, o, a = {};
                for (s in i) o = i[s], e[s] !== o && (n[s] || (t.fx.step[s] || !isNaN(parseFloat(o))) && (a[s] = o));
                return a
            }

            var s = ["add", "remove", "toggle"], n = {
                border: 1,
                borderBottom: 1,
                borderColor: 1,
                borderLeft: 1,
                borderRight: 1,
                borderTop: 1,
                borderWidth: 1,
                margin: 1,
                padding: 1
            };
            t.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (e, i) {
                t.fx.step[i] = function (t) {
                    ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (g.style(t.elem, i, t.end), t.setAttr = !0)
                }
            }), t.fn.addBack || (t.fn.addBack = function (t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }), t.effects.animateClass = function (n, o, a, r) {
                var l = t.speed(o, a, r);
                return this.queue(function () {
                    var o, a = t(this), r = a.attr("class") || "", h = l.children ? a.find("*").addBack() : a;
                    h = h.map(function () {
                        var i = t(this);
                        return {el: i, start: e(this)}
                    }), o = function () {
                        t.each(s, function (t, e) {
                            n[e] && a[e + "Class"](n[e])
                        })
                    }, o(), h = h.map(function () {
                        return this.end = e(this.el[0]), this.diff = i(this.start, this.end), this
                    }), a.attr("class", r), h = h.map(function () {
                        var e = this, i = t.Deferred(), s = t.extend({}, l, {
                            queue: !1, complete: function () {
                                i.resolve(e)
                            }
                        });
                        return this.el.animate(this.diff, s), i.promise()
                    }), t.when.apply(t, h.get()).done(function () {
                        o(), t.each(arguments, function () {
                            var e = this.el;
                            t.each(this.diff, function (t) {
                                e.css(t, "")
                            })
                        }), l.complete.call(a[0])
                    })
                })
            }, t.fn.extend({
                addClass: function (e) {
                    return function (i, s, n, o) {
                        return s ? t.effects.animateClass.call(this, {add: i}, s, n, o) : e.apply(this, arguments)
                    }
                }(t.fn.addClass), removeClass: function (e) {
                    return function (i, s, n, o) {
                        return arguments.length > 1 ? t.effects.animateClass.call(this, {remove: i}, s, n, o) : e.apply(this, arguments)
                    }
                }(t.fn.removeClass), toggleClass: function (e) {
                    return function (i, s, n, o, a) {
                        return "boolean" == typeof s || void 0 === s ? n ? t.effects.animateClass.call(this, s ? {add: i} : {remove: i}, n, o, a) : e.apply(this, arguments) : t.effects.animateClass.call(this, {toggle: i}, s, n, o)
                    }
                }(t.fn.toggleClass), switchClass: function (e, i, s, n, o) {
                    return t.effects.animateClass.call(this, {add: i, remove: e}, s, n, o)
                }
            })
        }(), function () {
            function e(e, i, s, n) {
                return t.isPlainObject(e) && (i = e, e = e.effect), e = {effect: e}, null == i && (i = {}), t.isFunction(i) && (n = i, s = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (n = s, s = i, i = {}), t.isFunction(s) && (n = s, s = null), i && t.extend(e, i), s = s || i.duration, e.duration = t.fx.off ? 0 : "number" == typeof s ? s : s in t.fx.speeds ? t.fx.speeds[s] : t.fx.speeds._default, e.complete = n || i.complete, e
            }

            function i(e) {
                return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? t.isFunction(e) ? !0 : "object" != typeof e || e.effect ? !1 : !0 : !0
            }

            function s(t, e) {
                var i = e.outerWidth(), s = e.outerHeight(),
                    n = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
                    o = n.exec(t) || ["", 0, i, s, 0];
                return {
                    top: parseFloat(o[1]) || 0,
                    right: "auto" === o[2] ? i : parseFloat(o[2]),
                    bottom: "auto" === o[3] ? s : parseFloat(o[3]),
                    left: parseFloat(o[4]) || 0
                }
            }

            t.expr && t.expr.filters && t.expr.filters.animated && (t.expr.filters.animated = function (e) {
                return function (i) {
                    return !!t(i).data(f) || e(i)
                }
            }(t.expr.filters.animated)), t.uiBackCompat !== !1 && t.extend(t.effects, {
                save: function (t, e) {
                    for (var i = 0, s = e.length; s > i; i++) null !== e[i] && t.data(d + e[i], t[0].style[e[i]])
                }, restore: function (t, e) {
                    for (var i, s = 0, n = e.length; n > s; s++) null !== e[s] && (i = t.data(d + e[s]), t.css(e[s], i))
                }, setMode: function (t, e) {
                    return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e
                }, createWrapper: function (e) {
                    if (e.parent().is(".ui-effects-wrapper")) return e.parent();
                    var i = {width: e.outerWidth(!0), height: e.outerHeight(!0), "float": e.css("float")},
                        s = t("<div></div>").addClass("ui-effects-wrapper").css({
                            fontSize: "100%",
                            background: "transparent",
                            border: "none",
                            margin: 0,
                            padding: 0
                        }), n = {width: e.width(), height: e.height()}, o = document.activeElement;
                    try {
                        o.id
                    } catch (a) {
                        o = document.body
                    }
                    return e.wrap(s), (e[0] === o || t.contains(e[0], o)) && t(o).trigger("focus"), s = e.parent(), "static" === e.css("position") ? (s.css({position: "relative"}), e.css({position: "relative"})) : (t.extend(i, {
                        position: e.css("position"),
                        zIndex: e.css("z-index")
                    }), t.each(["top", "left", "bottom", "right"], function (t, s) {
                        i[s] = e.css(s), isNaN(parseInt(i[s], 10)) && (i[s] = "auto")
                    }), e.css({
                        position: "relative",
                        top: 0,
                        left: 0,
                        right: "auto",
                        bottom: "auto"
                    })), e.css(n), s.css(i).show()
                }, removeWrapper: function (e) {
                    var i = document.activeElement;
                    return e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).trigger("focus")), e
                }
            }), t.extend(t.effects, {
                version: "1.12.1", define: function (e, i, s) {
                    return s || (s = i, i = "effect"), t.effects.effect[e] = s, t.effects.effect[e].mode = i, s
                }, scaledDimensions: function (t, e, i) {
                    if (0 === e) return {height: 0, width: 0, outerHeight: 0, outerWidth: 0};
                    var s = "horizontal" !== i ? (e || 100) / 100 : 1, n = "vertical" !== i ? (e || 100) / 100 : 1;
                    return {
                        height: t.height() * n,
                        width: t.width() * s,
                        outerHeight: t.outerHeight() * n,
                        outerWidth: t.outerWidth() * s
                    }
                }, clipToBox: function (t) {
                    return {
                        width: t.clip.right - t.clip.left,
                        height: t.clip.bottom - t.clip.top,
                        left: t.clip.left,
                        top: t.clip.top
                    }
                }, unshift: function (t, e, i) {
                    var s = t.queue();
                    e > 1 && s.splice.apply(s, [1, 0].concat(s.splice(e, i))), t.dequeue()
                }, saveStyle: function (t) {
                    t.data(p, t[0].style.cssText)
                }, restoreStyle: function (t) {
                    t[0].style.cssText = t.data(p) || "", t.removeData(p)
                }, mode: function (t, e) {
                    var i = t.is(":hidden");
                    return "toggle" === e && (e = i ? "show" : "hide"), (i ? "hide" === e : "show" === e) && (e = "none"), e
                }, getBaseline: function (t, e) {
                    var i, s;
                    switch (t[0]) {
                        case"top":
                            i = 0;
                            break;
                        case"middle":
                            i = .5;
                            break;
                        case"bottom":
                            i = 1;
                            break;
                        default:
                            i = t[0] / e.height
                    }
                    switch (t[1]) {
                        case"left":
                            s = 0;
                            break;
                        case"center":
                            s = .5;
                            break;
                        case"right":
                            s = 1;
                            break;
                        default:
                            s = t[1] / e.width
                    }
                    return {x: s, y: i}
                }, createPlaceholder: function (e) {
                    var i, s = e.css("position"), n = e.position();
                    return e.css({
                        marginTop: e.css("marginTop"),
                        marginBottom: e.css("marginBottom"),
                        marginLeft: e.css("marginLeft"),
                        marginRight: e.css("marginRight")
                    }).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()), /^(static|relative)/.test(s) && (s = "absolute", i = t("<" + e[0].nodeName + ">").insertAfter(e).css({
                        display: /^(inline|ruby)/.test(e.css("display")) ? "inline-block" : "block",
                        visibility: "hidden",
                        marginTop: e.css("marginTop"),
                        marginBottom: e.css("marginBottom"),
                        marginLeft: e.css("marginLeft"),
                        marginRight: e.css("marginRight"),
                        "float": e.css("float")
                    }).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).addClass("ui-effects-placeholder"), e.data(d + "placeholder", i)), e.css({
                        position: s,
                        left: n.left,
                        top: n.top
                    }), i
                }, removePlaceholder: function (t) {
                    var e = d + "placeholder", i = t.data(e);
                    i && (i.remove(), t.removeData(e))
                }, cleanUp: function (e) {
                    t.effects.restoreStyle(e), t.effects.removePlaceholder(e)
                }, setTransition: function (e, i, s, n) {
                    return n = n || {}, t.each(i, function (t, i) {
                        var o = e.cssUnit(i);
                        o[0] > 0 && (n[i] = o[0] * s + o[1])
                    }), n
                }
            }), t.fn.extend({
                effect: function () {
                    function i(e) {
                        function i() {
                            r.removeData(f), t.effects.cleanUp(r), "hide" === s.mode && r.hide(), a()
                        }

                        function a() {
                            t.isFunction(l) && l.call(r[0]), t.isFunction(e) && e()
                        }

                        var r = t(this);
                        s.mode = c.shift(), t.uiBackCompat === !1 || o ? "none" === s.mode ? (r[h](), a()) : n.call(r[0], s, i) : (r.is(":hidden") ? "hide" === h : "show" === h) ? (r[h](), a()) : n.call(r[0], s, a)
                    }

                    var s = e.apply(this, arguments), n = t.effects.effect[s.effect], o = n.mode, a = s.queue,
                        r = a || "fx", l = s.complete, h = s.mode, c = [], u = function (e) {
                            var i = t(this), s = t.effects.mode(i, h) || o;
                            i.data(f, !0), c.push(s), o && ("show" === s || s === o && "hide" === s) && i.show(), o && "none" === s || t.effects.saveStyle(i), t.isFunction(e) && e()
                        };
                    return t.fx.off || !n ? h ? this[h](s.duration, l) : this.each(function () {
                        l && l.call(this)
                    }) : a === !1 ? this.each(u).each(i) : this.queue(r, u).queue(r, i)
                }, show: function (t) {
                    return function (s) {
                        if (i(s)) return t.apply(this, arguments);
                        var n = e.apply(this, arguments);
                        return n.mode = "show", this.effect.call(this, n)
                    }
                }(t.fn.show), hide: function (t) {
                    return function (s) {
                        if (i(s)) return t.apply(this, arguments);
                        var n = e.apply(this, arguments);
                        return n.mode = "hide", this.effect.call(this, n)
                    }
                }(t.fn.hide), toggle: function (t) {
                    return function (s) {
                        if (i(s) || "boolean" == typeof s) return t.apply(this, arguments);
                        var n = e.apply(this, arguments);
                        return n.mode = "toggle", this.effect.call(this, n)
                    }
                }(t.fn.toggle), cssUnit: function (e) {
                    var i = this.css(e), s = [];
                    return t.each(["em", "px", "%", "pt"], function (t, e) {
                        i.indexOf(e) > 0 && (s = [parseFloat(i), e])
                    }), s
                }, cssClip: function (t) {
                    return t ? this.css("clip", "rect(" + t.top + "px " + t.right + "px " + t.bottom + "px " + t.left + "px)") : s(this.css("clip"), this)
                }, transfer: function (e, i) {
                    var s = t(this), n = t(e.to), o = "fixed" === n.css("position"), a = t("body"),
                        r = o ? a.scrollTop() : 0, l = o ? a.scrollLeft() : 0, h = n.offset(),
                        c = {top: h.top - r, left: h.left - l, height: n.innerHeight(), width: n.innerWidth()},
                        u = s.offset(),
                        d = t("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(e.className).css({
                            top: u.top - r,
                            left: u.left - l,
                            height: s.innerHeight(),
                            width: s.innerWidth(),
                            position: o ? "fixed" : "absolute"
                        }).animate(c, e.duration, e.easing, function () {
                            d.remove(), t.isFunction(i) && i()
                        })
                }
            }), t.fx.step.clip = function (e) {
                e.clipInit || (e.start = t(e.elem).cssClip(), "string" == typeof e.end && (e.end = s(e.end, e.elem)), e.clipInit = !0), t(e.elem).cssClip({
                    top: e.pos * (e.end.top - e.start.top) + e.start.top,
                    right: e.pos * (e.end.right - e.start.right) + e.start.right,
                    bottom: e.pos * (e.end.bottom - e.start.bottom) + e.start.bottom,
                    left: e.pos * (e.end.left - e.start.left) + e.start.left
                })
            }
        }(), function () {
            var e = {};
            t.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (t, i) {
                e[i] = function (e) {
                    return Math.pow(e, t + 2)
                }
            }), t.extend(e, {
                Sine: function (t) {
                    return 1 - Math.cos(t * Math.PI / 2)
                }, Circ: function (t) {
                    return 1 - Math.sqrt(1 - t * t)
                }, Elastic: function (t) {
                    return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15)
                }, Back: function (t) {
                    return t * t * (3 * t - 2)
                }, Bounce: function (t) {
                    for (var e, i = 4; ((e = Math.pow(2, --i)) - 1) / 11 > t;) ;
                    return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
                }
            }), t.each(e, function (e, i) {
                t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function (t) {
                    return 1 - i(1 - t)
                }, t.easing["easeInOut" + e] = function (t) {
                    return .5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2
                }
            })
        }(), t.effects
    });
});
$(document).ready(function () {
    (function (Pusher) {
        function objectApply(object, f) {
            for (var key in object) if (Object.prototype.hasOwnProperty.call(object, key)) f(object[key], key, object)
        }

        function composeQuery(requests, socketId, authOptions) {
            var i = 0;
            var query = "\x26socket_id\x3d" + encodeURIComponent(socketId);
            for (var channel in requests) {
                query += "\x26channel_name[" + i + "]\x3d" + encodeURIComponent(channel);
                i++
            }
            for (var param in authOptions.params) query += "\x26" + encodeURIComponent(param) + "\x3d" + encodeURIComponent(authOptions.params[param]);
            return query
        }

        function xhrRequest(requests, socketId, authOptions, authEndpoint, callback) {
            var xhr = Pusher.Runtime.createXHR();
            xhr.open("POST", authEndpoint, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            for (var headerName in authOptions.headers) xhr.setRequestHeader(headerName, authOptions.headers[headerName]);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) if (xhr.status === 200) {
                    var parsed = false;
                    try {
                        var data = JSON.parse(xhr.responseText);
                        parsed = true
                    } catch (e) {
                        callback(true, "JSON returned from webapp was invalid, yet status code was 200. Data was: " +
                            xhr.responseText)
                    }
                    if (parsed) callback(false, data)
                } else callback(true, xhr.status)
            };
            xhr.send(composeQuery(requests, socketId, authOptions))
        }

        var BufferedAuthorizer = function (options) {
            this.options = options;
            this.authOptions = options.authOptions || {};
            this.requests = {};
            this.setRequestTimeout()
        };
        BufferedAuthorizer.prototype.add = function (channel, callback) {
            this.requests[channel] = callback;
            if (!this.requestTimeout) this.setRequestTimeout()
        };
        BufferedAuthorizer.prototype.setRequestTimeout = function () {
            clearTimeout(this.requestTimeout);
            this.requestTimeout = setTimeout(function () {
                if (Object.keys(this.requests).length) {
                    this.executeRequests();
                    this.setRequestTimeout()
                } else this.requestTimeout = null
            }.bind(this), this.options.authDelay || 0)
        };
        BufferedAuthorizer.prototype.executeRequests = function () {
            var requests = this.requests;
            this.requests = {};
            xhrRequest(requests, this.options.socketId, this.authOptions, this.options.authEndpoint, function (error, response) {
                if (error) objectApply(requests, function (callback) {
                    callback(true, response)
                }); else objectApply(requests,
                    function (callback, channel) {
                        if (response[channel]) if (!response[channel].status || response[channel].status === 200) callback(null, response[channel].data); else callback(true, response[channel].status); else callback(true, 404)
                    })
            })
        };
        var authorizers = {};
        var buffered = function buffered(Runtime, socketId, callback) {
            var authEndpoint = this.options.authEndpoint;
            var key = socketId + ":" + authEndpoint;
            var authorizer = authorizers[key];
            if (!authorizer) authorizer = authorizers[key] = new BufferedAuthorizer({
                socketId: socketId, authEndpoint: authEndpoint,
                authDelay: this.options.authDelay, authOptions: this.options.auth
            });
            authorizer.add(this.channel.name, callback)
        };
        var supportedAuthorizers = Pusher.Runtime.getAuthorizers();
        Pusher.Runtime.getAuthorizers = function () {
            supportedAuthorizers.buffered = buffered;
            return supportedAuthorizers
        }
    })(window.Pusher);
});
$(document).ready(function () {
    function handle_notifications_create_events(data) {
        if (data.msg.display_on_screen) $("#flashNoticeCont").show().notice_insert(data); else $("#notice_cont").notice_insert(data)
    }

    var event_handler = $("#event_handler");
    var auth_key = event_handler.attr("data-channel");
    var pusher = new Pusher(event_handler.attr("data-pusher-key"), {
        authTransport: "buffered",
        authEndpoint: location.origin + event_handler.attr("data-auth-point"),
        authDelay: 200,
        cluster: event_handler.attr("data-cluster")
    });
    channel =
        {
            cart: pusher.subscribe("private-cart-" + auth_key),
            billing: pusher.subscribe("private-billing-" + auth_key),
            contacts: pusher.subscribe("private-contacts-" + auth_key),
            domain: pusher.subscribe("private-domain-" + auth_key),
            account: pusher.subscribe("private-account-" + auth_key),
            ssl: pusher.subscribe("private-ssl-" + auth_key),
            newsletter: pusher.subscribe("private-newsletter-" + auth_key),
            notifications: {
                personal: pusher.subscribe("private-notifications-" + auth_key),
                global: pusher.subscribe("global-notifications")
            },
            promotions: {global: pusher.subscribe("global-promotions")}
        };
    channel.cart.bind("App\\Events\\Cart\\CartItemWasCreated", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        if ("cart_item" in data.msg) {
            cartItems = data.msg["cart_item"];
            if ($.isArray(cartItems)) $.each(cartItems, function (index, value) {
                $.cart.insert(value.id, value.name, value.sub_name, value.billing.price.total)
            }); else {
                if (data.msg["domain_register"]) $('[data-fqdn\x3d"' + cartItems.name + '"]').attr("data-cart-item-id", cartItems.id).find(".cart-button, .singleButtonTarget").addClass("selected");
                $sub_name = cartItems.sub_name;
                if ("sub_name_small" in cartItems) $sub_name = cartItems.sub_name_small;
                $.cart.insert(cartItems.id, cartItems.name, $sub_name, cartItems.billing.price.total)
            }
        }
        $.cart.sideCart.checkVisibility()
    });
    channel.cart.bind("App\\Events\\Cart\\CartItemsWereCreated", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        $.each(data.msg.cart_items, function (index, value) {
            $.cart.insert(value.id, value.name, value.sub_name, value.billing.price.total)
        });
        $.cart.sideCart.checkVisibility()
    });
    channel.cart.bind("App\\Events\\Cart\\CartItemWasDeleted", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        $.cart.remove(data.msg.cart_item_id);
        if (data.msg.fqdn) $('[data-fqdn\x3d"' + data.msg.fqdn + '"]').attr("data-cart-item-id", "").find(".selected").removeClass("selected");
        if (data.msg.children_items) for (i in data.msg.children_items) $.cart.remove(data.msg.children_items[i]);
        $.cart.sideCart.checkVisibility()
    });
    channel.cart.bind("App\\Events\\Cart\\CartItemWasUpdated", function (data) {
        if (data.msg.unique_id ==
            unique_page_identifier) return;
        updates = data.msg.updates;
        $.each(updates, function (key, info) {
            $.cart.update(info.id, {name: info.name, desc: info.sub_name, price: info.billing.price.total})
        });
        $.cart.sideCart.checkVisibility()
    });
    channel.cart.bind("App\\Events\\Cart\\CartItemNotFound", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        data = data.msg;
        if (typeof data.not_found == "string") $.cart.remove(data.not_found); else if (typeof data.not_found == "object") ;
        var item = $('.item[data-cart-item-id\x3d"' +
            data.not_found + '"]');
        var domain = $('.tldResults[data-cart-item-id\x3d"' + data.not_found + '"], .singleResult[data-cart-item-id\x3d"' + data.not_found + '"]');
        if (item.length) item.remove();
        if (domain.length) domain.find(".cart-button, .singleButtonTarget").removeClass("selected")
    });
    channel.cart.bind("App\\Events\\Cart\\ItemAlreadyInCart", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        data = data.msg;
        var cart_item = data.cart_item;
        var item = $('li[data-cart-item-id\x3d"' + cart_item.id + '"]');
        var domain =
            $('[data-fqdn\x3d"' + cart_item.name + '"]');
        if (item.length < 1) $.cart.insert(cart_item.id, cart_item.name, cart_item.sub_name, cart_item.billing.price.total);
        if (domain.length) domain.attr("data-cart-item-id", cart_item.id).find(".cart-button, .singleButtonTarget").addClass("selected")
    });
    channel.notifications.personal.bind("App\\Events\\Notifications\\PersonalNotificationWasCreated", function (data) {
        handle_notifications_create_events(data)
    });
    channel.notifications.global.bind("App\\Events\\Notifications\\GlobalNotificationWasCreated",
        function (data) {
            handle_notifications_create_events(data)
        });
    channel.notifications.personal.bind("App\\Events\\Notifications\\NotificationWasDeleted", function (data) {
        if (data.msg.unique_id == unique_page_identifier) return;
        if (data.msg.notification_id == "all") {
            $("#notice_cont").empty();
            $("#flashNoticeCont").empty().hide();
            $.notice.dec()
        } else {
            var notice = $('[data-notification-id\x3d"' + data.msg.notification_id + '"]');
            if (notice.length < 1) return;
            var list = notice.closest("ul");
            notice.remove();
            if (list.hasClass("notification-list")) $.notice.dec();
            else if (list.find("li").length < 1) list.hide()
        }
    });
    channel.account.bind("App\\Events\\Account\\EmailVerified", function (data) {
        if ("notification" in data.msg) $.alertHandler("", data.msg.notification.display, alert_box_success);
        var $email_cont = $("#email_item");
        if ($email_cont.length) {
            $email_cont.find(".secondary-wrapper").hide();
            $email_cont.find(".verified_pressent").hide();
            $email_cont.find(".edit_btn").closest("div").show();
            $('.content_static span[data-about\x3d"email"]').set_text(data.msg.saved.display);
            $email_cont.find(".saved").set_text(data.msg.saved.display);
            $email_cont.find(".warning.label").set_text(COMMON_LANG.LABEL.VERIFIED).removeClass("warning").addClass("success")
        }
    });
    channel.promotions.global.bind("App\\Events\\Promotions\\PromotionAutoRenew", function (data) {
        if (typeof countDowns != "undefined") {
            var promotion_name = data.msg.name.toString().match(/[0-9]+/g)[0];
            console.log(countDowns[promotion_name], data.msg.soft_end.date, new Date);
            var date = data.msg.soft_end.date.toString().replace(/\.[0-9]+/, "").match(/[0-9]+/g);
            var new_expiration_date = new Date(Date.UTC(date[0],
                date[1], date[2], date[3], date[4], date[5]));
            if (typeof countDownShowHandler == "function") countDownShowHandler(promotion_name, data.msg.soft_end.date)
        }
    });
    channel.promotions.global.bind("App\\Events\\Promotions\\PromotionAutoRemove", function (data) {
        if (typeof countDowns != "undefined") {
            var promotion_name = data.msg.name.toString().match(/[0-9]+/g)[0];
            delete countDowns[promotion_name];
            if (typeof countDownHideHandler == "function") countDownHideHandler(promotion_name)
        }
    });
    channel.billing.bind("App\\Events\\Billing\\DefaultProfileWasUpdated",
        function (data$jscomp$0) {
            if (window.location.href.toString().indexOf("cart") > -1) return;
            $.ajax(new $.ajax_prototype({
                "type": "POST", "url": $reloadVatWidgetUrl, "success": function (data) {
                    if (data.success) {
                        var billingProfile = data.data.billingProfile;
                        var checkedSetting = $('#toolbox-vat [name\x3d"Vat"]:checked');
                        if (billingProfile.vat_waived) {
                            $("#vatNotice").hide();
                            $("#vatWaivedNotice").show();
                            $('[name\x3d"Vat"]').attr("checked", false).prop("checked", false);
                            if (checkedSetting.val() !== "no-Vat") {
                                $keepVatNoticesVisible =
                                    true;
                                $("#no_Vat").click()
                            }
                            $("#no_Vat").prop("checked", true);
                            $("#no_Vat").disabled(true);
                            $("#with_Vat").disabled(true);
                            $("#toolbox-vat .billing-profile-vat").slideDown()
                        } else {
                            $("#vatNotice").show();
                            $("#vatWaivedNotice").hide();
                            $("#no_Vat").disabled(false);
                            $("#with_Vat").disabled(false);
                            if (checkedSetting.val() === "no-Vat") $("#toolbox-vat .billing-profile-vat").slideUp(); else $("#toolbox-vat .billing-profile-vat").slideDown()
                        }
                        $(".vatNoticeRate").text(billingProfile.rate);
                        $(".vatNoticeCountry").text(billingProfile.country);
                        $(".vatNoticeProfileName").text(billingProfile.type == "inv" ? billingProfile.name : $.translate("billing.type.rec"));
                        var profileLink = $("#toolbox-vat .billing-profile-vat a");
                        profileLink.attr("href", profileLink.attr("href").replace(/[0-9]+$/, billingProfile.id));
                        vat.country = data.data.country;
                        vat.quote = data.data.quote;
                        $(document).trigger("vat:changed")
                    }
                }
            }))
        });
    channel.notifications.personal.bind("App\\Events\\GDPR\\ArchiveReady", function (data) {
        console.log("ArchiveReady");
        $.alertHandler("", $.translate("gdpr.archive_ready"),
            alert_box_success);
        $("#archivedInfoBtn").translate("gdpr.archive_buttons.step_2").show();
        $("#downloadWarning").hide()
    })
});

$(document).ready(function () {
    (function ($) {
        var options = {active_class: "active", multi_expand: false, speed: 300, toggleable: true};
        $.extend({
            toggleMultiExpand: function () {
                options.multi_expand = true
            }
        });
        $.fn.accordionAnimated = function () {
            var $accordion = this;
            var $items = $accordion.find("\x3e dd");
            $.extend(options, Foundation.utils.data_options($accordion));
            if (typeof faq == "undefined") $items.find("\x3e a").on("click.accordion", function () {
                console.log("click one");
                var obj = $(this);
                if (!options.toggleable && obj.closest("dd").hasClass(options.active_class)) return;
                $(obj.attr("href")).stop(true, true).slideToggle(options.speed);
                if (!options.multi_expand) $items.find("\x3e .content:not(" + obj.attr("href") + ")").stop(true, true).slideUp(options.speed); else obj.closest(".accordion").find(".content:not(" + obj.attr("href") + ")").stop(true, true).slideUp(options.speed)
            }); else {
                $(document).ready(function () {
                    $(".accordion dd a").on("click", function () {
                        console.log("click two");
                        var obj = $(this).closest(".accordion");
                        obj.find("dd.active").removeClass("active");
                        obj.find("dd.content.active").removeClass("active")
                    })
                });
                $items.find("\x3e a").on("click.accordion", function () {
                    var obj = $(this);
                    if (!options.toggleable && obj.closest("dd").hasClass(options.active_class)) return;
                    $(obj.attr("href")).stop(true, true).slideToggle(options.speed);
                    if (!options.multi_expand) $items.find(".content:not(" + obj.attr("href") + ")").stop(true, true).slideUp(options.speed); else obj.closest(".accordion").find(".content:not(" + obj.attr("href") + ")").stop(true, true).slideUp(options.speed)
                })
            }
        }
    })(jQuery);
    $(document).ready(function () {
        $(".accordion").accordionAnimated()
    });
});
$(document).ready(function () {/*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
    !function (a, b) {
        a(function () {
            "use strict";

            function a(a, b) {
                return null != a && null != b && a.toLowerCase() === b.toLowerCase()
            }

            function c(a, b) {
                var c, d, e = a.length;
                if (!e || !b) return !1;
                for (c = b.toLowerCase(), d = 0; d < e; ++d) if (c === a[d].toLowerCase()) return !0;
                return !1
            }

            function d(a) {
                for (var b in a) h.call(a, b) && (a[b] = new RegExp(a[b], "i"))
            }

            function e(a, b) {
                this.ua = a || "", this._cache = {}, this.maxPhoneWidth = b || 600
            }

            var f = {};
            f.mobileDetectRules = {
                phones: {
                    iPhone: "\\biPhone\\b|\\biPod\\b",
                    BlackBerry: "BlackBerry|\\bBB10\\b|rim[0-9]+",
                    HTC: "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m",
                    Nexus: "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",
                    Dell: "Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue Pro|Dell Flash|Dell Smoke|Dell Mini 3iX|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
                    Motorola: "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b",
                    Samsung: "\\bSamsung\\b|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C",
                    LG: "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323)",
                    Sony: "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",
                    Asus: "Asus.*Galaxy|PadFone.*Mobile",
                    NokiaLumia: "Lumia [0-9]{3,4}",
                    Micromax: "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
                    Palm: "PalmSource|Palm",
                    Vertu: "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
                    Pantech: "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
                    Fly: "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
                    Wiko: "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
                    iMobile: "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
                    SimValley: "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
                    Wolfgang: "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
                    Alcatel: "Alcatel",
                    Nintendo: "Nintendo 3DS",
                    Amoi: "Amoi",
                    INQ: "INQ",
                    GenericPhone: "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
                },
                tablets: {
                    iPad: "iPad|iPad.*Mobile",
                    NexusTablet: "Android.*Nexus[\\s]+(7|9|10)",
                    SamsungTablet: "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587",
                    Kindle: "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",
                    SurfaceTablet: "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
                    HPTablet: "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
                    AsusTablet: "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z",
                    BlackBerryTablet: "PlayBook|RIM Tablet",
                    HTCtablet: "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
                    MotorolaTablet: "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
                    NookTablet: "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
                    AcerTablet: "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",
                    ToshibaTablet: "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
                    LGTablet: "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
                    FujitsuTablet: "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
                    PrestigioTablet: "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
                    LenovoTablet: "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)",
                    DellTablet: "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
                    YarvikTablet: "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
                    MedionTablet: "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
                    ArnovaTablet: "97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
                    IntensoTablet: "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
                    IRUTablet: "M702pro",
                    MegafonTablet: "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
                    EbodaTablet: "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
                    AllViewTablet: "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
                    ArchosTablet: "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
                    AinolTablet: "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
                    NokiaLumiaTablet: "Lumia 2520",
                    SonyTablet: "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",
                    PhilipsTablet: "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
                    CubeTablet: "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
                    CobyTablet: "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
                    MIDTablet: "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
                    MSITablet: "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
                    SMiTTablet: "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
                    RockChipTablet: "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
                    FlyTablet: "IQ310|Fly Vision",
                    bqTablet: "Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris [E|M]10)|Maxwell.*Lite|Maxwell.*Plus",
                    HuaweiTablet: "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim",
                    NecTablet: "\\bN-06D|\\bN-08D",
                    PantechTablet: "Pantech.*P4100",
                    BronchoTablet: "Broncho.*(N701|N708|N802|a710)",
                    VersusTablet: "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
                    ZyncTablet: "z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",
                    PositivoTablet: "TB07STA|TB10STA|TB07FTA|TB10FTA",
                    NabiTablet: "Android.*\\bNabi",
                    KoboTablet: "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
                    DanewTablet: "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
                    TexetTablet: "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
                    PlaystationTablet: "Playstation.*(Portable|Vita)",
                    TrekstorTablet: "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
                    PyleAudioTablet: "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
                    AdvanTablet: "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
                    DanyTechTablet: "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
                    GalapadTablet: "Android.*\\bG1\\b",
                    MicromaxTablet: "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
                    KarbonnTablet: "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
                    AllFineTablet: "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
                    PROSCANTablet: "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
                    YONESTablet: "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
                    ChangJiaTablet: "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
                    GUTablet: "TX-A1301|TX-M9002|Q702|kf026",
                    PointOfViewTablet: "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
                    OvermaxTablet: "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)",
                    HCLTablet: "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
                    DPSTablet: "DPS Dream 9|DPS Dual 7",
                    VistureTablet: "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
                    CrestaTablet: "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
                    MediatekTablet: "\\bMT8125|MT8389|MT8135|MT8377\\b",
                    ConcordeTablet: "Concorde([ ]+)?Tab|ConCorde ReadMan",
                    GoCleverTablet: "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
                    ModecomTablet: "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
                    VoninoTablet: "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
                    ECSTablet: "V07OT2|TM105A|S10OT1|TR10CS1",
                    StorexTablet: "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
                    VodafoneTablet: "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",
                    EssentielBTablet: "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
                    RossMoorTablet: "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
                    iMobileTablet: "i-mobile i-note",
                    TolinoTablet: "tolino tab [0-9.]+|tolino shine",
                    AudioSonicTablet: "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
                    AMPETablet: "Android.* A78 ",
                    SkkTablet: "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
                    TecnoTablet: "TECNO P9",
                    JXDTablet: "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
                    iJoyTablet: "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
                    FX2Tablet: "FX2 PAD7|FX2 PAD10",
                    XoroTablet: "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
                    ViewsonicTablet: "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
                    OdysTablet: "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
                    CaptivaTablet: "CAPTIVA PAD",
                    IconbitTablet: "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
                    TeclastTablet: "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
                    OndaTablet: "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",
                    JaytechTablet: "TPC-PA762",
                    BlaupunktTablet: "Endeavour 800NG|Endeavour 1010",
                    DigmaTablet: "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
                    EvolioTablet: "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
                    LavaTablet: "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
                    AocTablet: "MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",
                    MpmanTablet: "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
                    CelkonTablet: "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
                    WolderTablet: "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
                    MiTablet: "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
                    NibiruTablet: "Nibiru M1|Nibiru Jupiter One",
                    NexoTablet: "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
                    LeaderTablet: "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
                    UbislateTablet: "UbiSlate[\\s]?7C",
                    PocketBookTablet: "Pocketbook",
                    KocasoTablet: "\\b(TB-1207)\\b",
                    HisenseTablet: "\\b(F5281|E2371)\\b",
                    Hudl: "Hudl HT7S3|Hudl 2",
                    TelstraTablet: "T-Hub2",
                    GenericTablet: "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b"
                },
                oss: {
                    AndroidOS: "Android",
                    BlackBerryOS: "blackberry|\\bBB10\\b|rim tablet os",
                    PalmOS: "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
                    SymbianOS: "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
                    WindowsMobileOS: "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",
                    WindowsPhoneOS: "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
                    iOS: "\\biPhone.*Mobile|\\biPod|\\biPad",
                    MeeGoOS: "MeeGo",
                    MaemoOS: "Maemo",
                    JavaOS: "J2ME/|\\bMIDP\\b|\\bCLDC\\b",
                    webOS: "webOS|hpwOS",
                    badaOS: "\\bBada\\b",
                    BREWOS: "BREW"
                },
                uas: {
                    Chrome: "\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",
                    Dolfin: "\\bDolfin\\b",
                    Opera: "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",
                    Skyfire: "Skyfire",
                    Edge: "Mobile Safari/[.0-9]* Edge",
                    IE: "IEMobile|MSIEMobile",
                    Firefox: "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",
                    Bolt: "bolt",
                    TeaShark: "teashark",
                    Blazer: "Blazer",
                    Safari: "Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",
                    UCBrowser: "UC.*Browser|UCWEB",
                    baiduboxapp: "baiduboxapp",
                    baidubrowser: "baidubrowser",
                    DiigoBrowser: "DiigoBrowser",
                    Puffin: "Puffin",
                    Mercury: "\\bMercury\\b",
                    ObigoBrowser: "Obigo",
                    NetFront: "NF-Browser",
                    GenericBrowser: "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",
                    PaleMoon: "Android.*PaleMoon|Mobile.*PaleMoon"
                },
                props: {
                    Mobile: "Mobile/[VER]",
                    Build: "Build/[VER]",
                    Version: "Version/[VER]",
                    VendorID: "VendorID/[VER]",
                    iPad: "iPad.*CPU[a-z ]+[VER]",
                    iPhone: "iPhone.*CPU[a-z ]+[VER]",
                    iPod: "iPod.*CPU[a-z ]+[VER]",
                    Kindle: "Kindle/[VER]",
                    Chrome: ["Chrome/[VER]", "CriOS/[VER]", "CrMo/[VER]"],
                    Coast: ["Coast/[VER]"],
                    Dolfin: "Dolfin/[VER]",
                    Firefox: ["Firefox/[VER]", "FxiOS/[VER]"],
                    Fennec: "Fennec/[VER]",
                    Edge: "Edge/[VER]",
                    IE: ["IEMobile/[VER];", "IEMobile [VER]", "MSIE [VER];", "Trident/[0-9.]+;.*rv:[VER]"],
                    NetFront: "NetFront/[VER]",
                    NokiaBrowser: "NokiaBrowser/[VER]",
                    Opera: [" OPR/[VER]", "Opera Mini/[VER]", "Version/[VER]"],
                    "Opera Mini": "Opera Mini/[VER]",
                    "Opera Mobi": "Version/[VER]",
                    "UC Browser": "UC Browser[VER]",
                    MQQBrowser: "MQQBrowser/[VER]",
                    MicroMessenger: "MicroMessenger/[VER]",
                    baiduboxapp: "baiduboxapp/[VER]",
                    baidubrowser: "baidubrowser/[VER]",
                    SamsungBrowser: "SamsungBrowser/[VER]",
                    Iron: "Iron/[VER]",
                    Safari: ["Version/[VER]", "Safari/[VER]"],
                    Skyfire: "Skyfire/[VER]",
                    Tizen: "Tizen/[VER]",
                    Webkit: "webkit[ /][VER]",
                    PaleMoon: "PaleMoon/[VER]",
                    Gecko: "Gecko/[VER]",
                    Trident: "Trident/[VER]",
                    Presto: "Presto/[VER]",
                    Goanna: "Goanna/[VER]",
                    iOS: " \\bi?OS\\b [VER][ ;]{1}",
                    Android: "Android [VER]",
                    BlackBerry: ["BlackBerry[\\w]+/[VER]", "BlackBerry.*Version/[VER]", "Version/[VER]"],
                    BREW: "BREW [VER]",
                    Java: "Java/[VER]",
                    "Windows Phone OS": ["Windows Phone OS [VER]", "Windows Phone [VER]"],
                    "Windows Phone": "Windows Phone [VER]",
                    "Windows CE": "Windows CE/[VER]",
                    "Windows NT": "Windows NT [VER]",
                    Symbian: ["SymbianOS/[VER]", "Symbian/[VER]"],
                    webOS: ["webOS/[VER]", "hpwOS/[VER];"]
                },
                utils: {
                    Bot: "Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",
                    MobileBot: "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",
                    DesktopMode: "WPDesktop",
                    TV: "SonyDTV|HbbTV",
                    WebKit: "(webkit)[ /]([\\w.]+)",
                    Console: "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|PLAYSTATION|Xbox)\\b",
                    Watch: "SM-V700"
                }
            }, f.detectMobileBrowsers = {
                fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
                shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
                tabletPattern: /android|ipad|playbook|silk/i
            };
            var g, h = Object.prototype.hasOwnProperty;
            return f.FALLBACK_PHONE = "UnknownPhone", f.FALLBACK_TABLET = "UnknownTablet", f.FALLBACK_MOBILE = "UnknownMobile", g = "isArray" in Array ? Array.isArray : function (a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }, function () {
                var a, b, c, e, i, j, k = f.mobileDetectRules;
                for (a in k.props) if (h.call(k.props, a)) {
                    for (b = k.props[a], g(b) || (b = [b]), i = b.length, e = 0; e < i; ++e) c = b[e], j = c.indexOf("[VER]"), j >= 0 && (c = c.substring(0, j) + "([\\w._\\+]+)" + c.substring(j + 5)), b[e] = new RegExp(c, "i");
                    k.props[a] = b
                }
                d(k.oss), d(k.phones), d(k.tablets), d(k.uas), d(k.utils), k.oss0 = {
                    WindowsPhoneOS: k.oss.WindowsPhoneOS,
                    WindowsMobileOS: k.oss.WindowsMobileOS
                }
            }(), f.findMatch = function (a, b) {
                for (var c in a) if (h.call(a, c) && a[c].test(b)) return c;
                return null
            }, f.findMatches = function (a, b) {
                var c = [];
                for (var d in a) h.call(a, d) && a[d].test(b) && c.push(d);
                return c
            }, f.getVersionStr = function (a, b) {
                var c, d, e, g, i = f.mobileDetectRules.props;
                if (h.call(i, a)) for (c = i[a], e = c.length, d = 0; d < e; ++d) if (g = c[d].exec(b), null !== g) return g[1];
                return null
            }, f.getVersion = function (a, b) {
                var c = f.getVersionStr(a, b);
                return c ? f.prepareVersionNo(c) : NaN
            }, f.prepareVersionNo = function (a) {
                var b;
                return b = a.split(/[a-z._ \/\-]/i), 1 === b.length && (a = b[0]), b.length > 1 && (a = b[0] + ".", b.shift(), a += b.join("")), Number(a)
            }, f.isMobileFallback = function (a) {
                return f.detectMobileBrowsers.fullPattern.test(a) || f.detectMobileBrowsers.shortPattern.test(a.substr(0, 4))
            }, f.isTabletFallback = function (a) {
                return f.detectMobileBrowsers.tabletPattern.test(a)
            }, f.prepareDetectionCache = function (a, c, d) {
                if (a.mobile === b) {
                    var g, h, i;
                    return (h = f.findMatch(f.mobileDetectRules.tablets, c)) ? (a.mobile = a.tablet = h, void (a.phone = null)) : (g = f.findMatch(f.mobileDetectRules.phones, c)) ? (a.mobile = a.phone = g, void (a.tablet = null)) : void (f.isMobileFallback(c) ? (i = e.isPhoneSized(d), i === b ? (a.mobile = f.FALLBACK_MOBILE, a.tablet = a.phone = null) : i ? (a.mobile = a.phone = f.FALLBACK_PHONE, a.tablet = null) : (a.mobile = a.tablet = f.FALLBACK_TABLET, a.phone = null)) : f.isTabletFallback(c) ? (a.mobile = a.tablet = f.FALLBACK_TABLET, a.phone = null) : a.mobile = a.tablet = a.phone = null)
                }
            }, f.mobileGrade = function (a) {
                var b = null !== a.mobile();
                return a.os("iOS") && a.version("iPad") >= 4.3 || a.os("iOS") && a.version("iPhone") >= 3.1 || a.os("iOS") && a.version("iPod") >= 3.1 || a.version("Android") > 2.1 && a.is("Webkit") || a.version("Windows Phone OS") >= 7 || a.is("BlackBerry") && a.version("BlackBerry") >= 6 || a.match("Playbook.*Tablet") || a.version("webOS") >= 1.4 && a.match("Palm|Pre|Pixi") || a.match("hp.*TouchPad") || a.is("Firefox") && a.version("Firefox") >= 12 || a.is("Chrome") && a.is("AndroidOS") && a.version("Android") >= 4 || a.is("Skyfire") && a.version("Skyfire") >= 4.1 && a.is("AndroidOS") && a.version("Android") >= 2.3 || a.is("Opera") && a.version("Opera Mobi") > 11 && a.is("AndroidOS") || a.is("MeeGoOS") || a.is("Tizen") || a.is("Dolfin") && a.version("Bada") >= 2 || (a.is("UC Browser") || a.is("Dolfin")) && a.version("Android") >= 2.3 || a.match("Kindle Fire") || a.is("Kindle") && a.version("Kindle") >= 3 || a.is("AndroidOS") && a.is("NookTablet") || a.version("Chrome") >= 11 && !b || a.version("Safari") >= 5 && !b || a.version("Firefox") >= 4 && !b || a.version("MSIE") >= 7 && !b || a.version("Opera") >= 10 && !b ? "A" : a.os("iOS") && a.version("iPad") < 4.3 || a.os("iOS") && a.version("iPhone") < 3.1 || a.os("iOS") && a.version("iPod") < 3.1 || a.is("Blackberry") && a.version("BlackBerry") >= 5 && a.version("BlackBerry") < 6 || a.version("Opera Mini") >= 5 && a.version("Opera Mini") <= 6.5 && (a.version("Android") >= 2.3 || a.is("iOS")) || a.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") || a.version("Opera Mobi") >= 11 && a.is("SymbianOS") ? "B" : (a.version("BlackBerry") < 5 || a.match("MSIEMobile|Windows CE.*Mobile") || a.version("Windows Mobile") <= 5.2, "C")
            }, f.detectOS = function (a) {
                return f.findMatch(f.mobileDetectRules.oss0, a) || f.findMatch(f.mobileDetectRules.oss, a)
            }, f.getDeviceSmallerSide = function () {
                return window.screen.width < window.screen.height ? window.screen.width : window.screen.height
            }, e.prototype = {
                constructor: e, mobile: function () {
                    return f.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.mobile
                }, phone: function () {
                    return f.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.phone
                }, tablet: function () {
                    return f.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.tablet
                }, userAgent: function () {
                    return this._cache.userAgent === b && (this._cache.userAgent = f.findMatch(f.mobileDetectRules.uas, this.ua)), this._cache.userAgent
                }, userAgents: function () {
                    return this._cache.userAgents === b && (this._cache.userAgents = f.findMatches(f.mobileDetectRules.uas, this.ua)), this._cache.userAgents
                }, os: function () {
                    return this._cache.os === b && (this._cache.os = f.detectOS(this.ua)), this._cache.os
                }, version: function (a) {
                    return f.getVersion(a, this.ua)
                }, versionStr: function (a) {
                    return f.getVersionStr(a, this.ua)
                }, is: function (b) {
                    return c(this.userAgents(), b) || a(b, this.os()) || a(b, this.phone()) || a(b, this.tablet()) || c(f.findMatches(f.mobileDetectRules.utils, this.ua), b)
                }, match: function (a) {
                    return a instanceof RegExp || (a = new RegExp(a, "i")), a.test(this.ua)
                }, isPhoneSized: function (a) {
                    return e.isPhoneSized(a || this.maxPhoneWidth)
                }, mobileGrade: function () {
                    return this._cache.grade === b && (this._cache.grade = f.mobileGrade(this)), this._cache.grade
                }
            }, "undefined" != typeof window && window.screen ? e.isPhoneSized = function (a) {
                return a < 0 ? b : f.getDeviceSmallerSide() <= a
            } : e.isPhoneSized = function () {
            }, e._impl = f, e.version = "1.3.6 2017-04-05", e
        })
    }(function (a) {
        if ("undefined" != typeof module && module.exports) return function (a) {
            module.exports = a()
        };
        if ("function" == typeof define && define.amd) return define;
        if ("undefined" != typeof window) return function (a) {
            window.MobileDetect = a()
        };
        throw new Error("unknown environment")
    }());
});
$(document).ready(function () {
    function queueFunction(callback, properties) {
        return {"callback": callback, "properties": properties}
    }

    function addToQueue(my_queue, callback, properties) {
        try {
            queue[my_queue].push(new queueFunction(callback, properties))
        } catch (er) {
            queue[my_queue] = [];
            queue[my_queue].push(new queueFunction(callback, properties))
        }
    }

    function modalCreator(properties) {
        insertNewModal(properties);
        my_modals[properties.id] = {modal: $("#" + properties.id), modal_bg: $("#" + properties.id + "_bgCover")};
        insertContentToModal(properties);
        if (!my_modals[properties.id].modal_bg.hasClass("dismiss_click")) my_modals[properties.id].modal_bg.on("click", function (e) {
            e.preventDefault();
            if (my_modals[properties.id].modal.is(e.target) || my_modals[properties.id].modal.find(e.target).length) return;
            my_modals[properties.id].modal.my_modal("close")
        });
        if ("callbacks" in properties) my_modals[properties.id].callbacks = properties.callbacks;
        if ("close_icon" in properties) my_modals[properties.id].modal.find(".close-reveal-mymodal").on("click", function (e) {
            e.preventDefault();
            my_modals[properties.id].modal.my_modal("close")
        })
    }

    function insertNewModal(properties) {
        if (properties.id in my_modals) throw"Modal already created";
        if (properties.constructor != Object || Object.keys(properties).length < 1) throw"Invalid properties";
        if (!("id" in properties)) throw"Id is missing";
        if (!("cover_classes" in properties)) properties.cover_classes = ""; else if (properties.cover_classes.constructor == Array) properties.cover_classes = properties.cover_classes.join(" ");
        if ("disable" in properties) if ("bg_click_close" in
            properties.disable) properties.cover_classes += " dismiss_click";
        var bgStyle = style;
        $("body").append(modalTemplate.replace(/##bgStyle##/g, bgStyle.join(" ").trim()).replace(/##id##/g, properties.id).replace(/##cover_classes##/g, " " + properties.cover_classes).replace(/##modal_classes##/g, "modal_classes" in properties && properties.modal_classes ? " " + properties.modal_classes : ""))
    }

    function insertContentToModal(properties) {
        if ("content" in properties && properties.content.constructor == Array) {
            properties.content = JSON.stringify(properties.content);
            for (i in my_modal_classes) if (my_modal_classes.hasOwnProperty(i)) properties.content = properties.content.replace(new RegExp("##" + i + "##", "g"), my_modal_classes[i]);
            properties.content = JSON.parse(properties.content);
            for (i in properties.content) if (properties.content.hasOwnProperty(i)) {
                var element = convertStringToElement(properties.content[i], properties.id);
                my_modals[properties.id].modal.css({
                    "position": "fixed",
                    "top": "-900px",
                    "display": "block",
                    "visibility": "visible"
                })[0].appendChild(element)
            }
        }
        for (i in queue[properties.id]) if (queue[properties.id].hasOwnProperty(i)) queue[properties.id][i].callback(queue[properties.id][i].properties);
        queue[properties.id] = [];
        if ("close_icon" in properties) $("#" + properties.id).append(closeIcon)
    }

    function convertStringToElement(elementString, queue, tempElement) {
        if (typeof tempElement == "undefined") tempElement = null;
        if (typeof elementString == "string") var elementSplit = JSON.parse(elementString); else elementSplit = elementString;
        for (i in elementSplit) if (elementSplit.hasOwnProperty(i)) {
            var element = null;
            if (typeof elementSplit[i] == "string") {
                try {
                    var elementToCreate = elementSplit[i].match(valid_elements)[1]
                } catch (er) {
                    throw'Invalid element structure: "' +
                    elementSplit[i] + '"';
                }
                element = document.createElement(elementToCreate);
                try {
                    var attributes = elementSplit[i].match(/{.+}/);
                    var text = attributes != null ? elementSplit[i].replace(attributes[0], "").match(/\[.+]/) : elementSplit[i].match(/\[.+]/);
                    if (attributes != null) {
                        attributes = attributes[0].replace(/{|}/g, "").split(",");
                        for (i in attributes) if (attributes.hasOwnProperty(i)) {
                            var attribute = attributes[i].split("\x3d");
                            if (attribute[0] == "style") {
                                var cssAttributes = attribute[1].replace(/:\s+/g, ":").replace(/;/g, "").trim().split(" ");
                                var selector = "#" + queue + " ";
                                if (element.id) selector += "#" + element.id;
                                if (element.className) selector += "." + element.className.replace(/\s+/g, " ").replace(/\s/g, ".");
                                addToQueue(queue, queuedStyle, {"selector": selector, "style": cssAttributes})
                            } else element.setAttribute(attribute[0], attribute[1])
                        }
                    }
                    if (text != null) {
                        text[0] = text[0].replace(/\[|]/g, "");
                        if (text[0].match(/^trans/)) text[0] = $.translate(text[0].replace(/^trans/g, "").replace(/\(|\)/g, ""));
                        element.appendChild(document.createTextNode(text[0]))
                    }
                } catch (er$0) {
                    console.log(er$0)
                }
                if (element !=
                    null) if (tempElement == null) tempElement = element; else tempElement.appendChild(element)
            } else {
                var parent = tempElement;
                if (tempElement.lastElementChild != null) parent = tempElement.lastElementChild;
                element = convertStringToElement(elementSplit[i], queue, parent);
                if (tempElement.lastElementChild == null) tempElement = element; else tempElement.lastElementChild = element
            }
        }
        return tempElement
    }

    function pinDisplay() {
        $("html,body").on("touchmove", function (e) {
            e.preventDefault()
        });
        if (!$.isTouch() || $.md.mobile() == null && $.md.phone() ==
            null && $.md.tablet() == null) {
            current_top = $(window).scrollTop();
            $("body").css({"position": "fixed", "overflow-y": "scroll", "width": "100%", "top": -current_top})
        }
    }

    function unpinDisplay() {
        $("html,body").off("touchmove");
        if ($("body").css("position") == "fixed") {
            $("body").css({"position": "static", "overflow-y": "auto", "width": "100%"});
            if (!$.isTouch() || $.md.mobile() == null && $.md.phone() == null && $.md.tablet() == null) window.scrollTo(0, current_top)
        }
    }

    function queuedStyle(data) {
        var element = document.querySelector(data.selector);
        for (c in data.style) if (data.style.hasOwnProperty(c)) {
            var rule = data.style[c].split(":");
            element.style[rule[0]] = rule[1]
        }
    }

    function repositionModalOnWindow(modal) {
        if ($.getSizeClassification("small")) modal.css("top", "0px"); else {
            var wh = $(window).height();
            var mh = modal.height();
            var mtop = 0;
            if (wh >= mh) mtop = (wh - mh) / 2;
            if ($.isTouch() || $.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null)) mtop += window.pageYOffset;
            modal.css("top", mtop + "px")
        }
    }

    function whitenCloseIcon(modal) {
        if (modal.find(".lead").css("color") ==
            "rgb(255, 255, 255)") modal.find(".custom-close-modal, .close-reveal-mymodal").css("color", "white")
    }

    var my_modals = {};
    var style = ["position: fixed;", "top: 0;", "height: 100%;", "width: 100%;", "background-color: rgba(28, 29, 30, 0.7);", "z-index: 100;", "display: none;"];
    var modalResizeEvents = {};
    var modalResizeCounter = {};
    var modalTemplate = '\x3cdiv id\x3d"##id##_bgCover" class\x3d"my_bgCover##cover_classes##" style\x3d"##bgStyle##"\x3e\x3c/div\x3e' + '\x3cdiv id\x3d"##id##" class\x3d"my_modals reveal-modal tiny##modal_classes##"\x3e\x3c/div\x3e';
    var closeIcon = '\x3ca class\x3d"close-reveal-mymodal modal_cancel" aria-label\x3d"Close"\x3e\x26#215;\x3c/a\x3e';
    var queue = {};
    $.fn.extend({
        my_modal: function (action, callback) {
            if (typeof action != "string") throw"Invalid Action";
            var obj = $(this);
            var modal_id = obj.attr("id");
            var modal_cover = $("#" + modal_id + "_bgCover");
            switch (action) {
                case "open":
                    var previousVisible = $(".my_bgCover:visible");
                    var wh = $(window).height();
                    var mh = obj.height();
                    var mtop = 0;
                    if (wh >= mh) mtop = (wh - mh) / 2;
                    if ($.isTouch() || $.md.mobile() != null && ($.md.phone() !=
                        null || $.md.tablet() != null)) {
                        obj.css("position", "absolute");
                        mtop += window.pageYOffset;
                        if ($.getSizeClassification("small")) mtop = window.pageYOffset
                    }
                    if (previousVisible.length) previousVisible.my_modal("close", function () {
                        obj.css({"top": mtop + "px"});
                        modal_cover.show()
                    }); else {
                        obj.css({"top": mtop + "px"});
                        modal_cover.show()
                    }
                    if (typeof callback == "function") callback();
                    pinDisplay();
                    modalResizeEvents[modal_id] = function () {
                        try {
                            clearTimeout(modalResizeCounter[modal_id])
                        } catch (er) {
                        }
                        modalResizeCounter[modal_id] = setTimeout(function () {
                            repositionModalOnWindow(obj);
                            if ("callbacks" in my_modals[modal_id] && "resize" in my_modals[modal_id].callbacks) my_modals[modal_id].callbacks.resize()
                        }, 100)
                    };
                    window.addEventListener("resize", modalResizeEvents[obj.attr("id")], false);
                    whitenCloseIcon(obj);
                    break;
                case "close":
                    obj.css("top", "-9999999px");
                    modal_cover.hide();
                    if (typeof callback == "function") callback();
                    unpinDisplay();
                    window.removeEventListener("resize", modalResizeEvents[obj.attr("id")]);
                    break;
                case "whiten":
                    whitenCloseIcon(obj);
                    break
            }
            return this
        }
    });
    $.extend({
        my_modals: {
            insert: function (properties) {
                modalCreator(properties);
                return true
            }, pinDisplay: function () {
                if ($.isTouch() || $.md.mobile() != null && ($.md.phone() != null || $.md.tablet() != null)) return;
                pinDisplay()
            }, unpinDisplay: function () {
                unpinDisplay()
            }
        }
    })
});
$(document).ready(function () {
    function sendAddToCartRemarketingEvent(items, callback) {
        if (app_env != "local" && items.length) {
            gtag("event", "add_to_cart", {"items": items});
            if (typeof callback == "function") callback()
        }
    }

    function sendRemoveFromCartRemarketingEvent(items, callback) {
        if (app_env != "local" && items.length) {
            gtag("event", "remove_from_cart", {"items": items});
            if (typeof callback == "function") callback()
        }
    }

    function updateItemInAnalytics(items) {
        if ("remove" in items && "add" in items) sendRemoveFromCartRemarketingEvent(items.remove,
            function () {
                sendAddToCartRemarketingEvent(items.add)
            })
    }

    function sendSelectContentForThisUrl(target) {
        var data = {"_token": $('[name\x3d"_token"]').val(), "target": target};
        $.ajax(new $.ajax_prototype({
            url: urls.getRemarketingItems, type: "POST", data: data, success: function (data) {
                if (data.success) if (data.data.view_item.length) gtag("event", "select_content", {
                    "content_type": "product",
                    "items": data.data.view_item
                })
            }
        }))
    }

    function sendCheckoutProgressEvent(items, callback) {
        if (app_env != "local" && items.length) {
            gtag("event",
                "checkout_progress", {"items": items});
            if (typeof callback == "function") callback()
        }
    }

    function sendRegisterEvent(callback) {
        gtag("event", "register", {"event_category": "users", "event_action": "register"});
        gtag("event", "conversion", {"send_to": "AW-858474282/8MQXCMH-mXsQqo6tmQM"});
        fbq("track", "CompleteRegistration");
        if (typeof callback == "function") callback()
    }

    function sendLoginEvent(callback) {
        gtag("event", "login", {"event_category": "users", "event_action": "login"});
        if (typeof callback == "function") callback()
    }

    function getCurrentCartForAnalytics(successCallback) {
        $.ajax(new $.ajax_prototype({
            "url": "/cart/analytics/items",
            "type": "POST", "data": {"_token": $('[name\x3d"_token"]').val()}, "success": function (data) {
                if (data.success) if (typeof successCallback == "function") successCallback(data); else sendCheckoutProgressEvent(data.data.remarketing_items)
            }
        }))
    }

    function usetoolbar() {
        gtag("event", "usetoolbar", {"event_category": "tools", "event_action": "click", "event_label": "usetoolbar"})
    }

    function usevat() {
        gtag("event", "usevat", {"event_category": "tools", "event_action": "click", "event_label": "usevat"})
    }

    var cookies = {
        add_remarketing_items: "add_remarketing_items",
        update_remarketing_items: "update_remarketing_items",
        remarketing_login: "remarketing_login",
        remarketing_register: "remarketing_register"
    };
    $.fn.extend({
        sendSelectContentForThisUrl: function () {
            if (app_env != "local") {
                var obj = $(this);
                var target = obj.attr("href").split("/");
                target = target[target.length - 1];
                target = target.toLowerCase().replace(/-/g, "_");
                sendSelectContentForThisUrl(target)
            }
            return this
        }
    });
    $.extend({
        sendSelectContentForThisUrl: function (url) {
            if (app_env != "local") {
                var target = url.split("/");
                target = target[target.length -
                1];
                target = target.toLowerCase().replace(/-/g, "_");
                sendSelectContentForThisUrl(target)
            }
        }, getNewTabRemarketingCookie: function () {
            var target = location.href.split("/");
            target = target[target.length - 1];
            target = target.toLowerCase().replace(/-/g, "_");
            var cookie_name = "new_tab_remarketing_" + target;
            return Cookies.get(cookie_name)
        }, removeNewTabRemarketingCookie: function () {
            var target = location.href.split("/");
            target = target[target.length - 1];
            target = target.toLowerCase().replace(/-/g, "_");
            var cookie_name = "new_tab_remarketing_" +
                target;
            Cookies.remove(cookie_name)
        }, sendAddToCartRemarketingEvent: function (items) {
            sendAddToCartRemarketingEvent(items)
        }, sendRemoveFromCartRemarketingEvent: function (items) {
            sendRemoveFromCartRemarketingEvent(items)
        }, setAddToCartConfiguredCart: function (items) {
            Cookies.set(cookies.add_remarketing_items, JSON.stringify(items), {path: "/"})
        }, getAddToCartConfiguredCart: function () {
            var addToCartItems = Cookies.get(cookies.add_remarketing_items);
            if (addToCartItems) {
                sendAddToCartRemarketingEvent(JSON.parse(addToCartItems));
                Cookies.remove(cookies.add_remarketing_items)
            }
        }, updateItemInAnalytics: function (items) {
            updateItemInAnalytics(items)
        }, setUpdateConfiguredCart: function (items) {
            Cookies.set(cookies.update_remarketing_items, JSON.stringify(items), {path: "/"})
        }, getUpdateConfiguredCart: function () {
            var updateItems = Cookies.get(cookies.update_remarketing_items);
            if (updateItems) {
                updateItemInAnalytics(JSON.parse(updateItems));
                Cookies.remove(cookies.update_remarketing_items)
            }
        }, getCurrentCartForAnalytics: function () {
            getCurrentCartForAnalytics()
        },
        sendRegisterEvent: function () {
            if (app_env == "local") return;
            sendRegisterEvent()
        }, sendLoginEvent: function () {
            if (app_env == "local") return;
            sendLoginEvent()
        }, setRegisterEventCookie: function () {
            if (app_env == "local") return;
            Cookies.set(cookies.remarketing_register, true, {path: "/"})
        }, setLoginEventCookie: function () {
            if (app_env == "local") return;
            Cookies.set(cookies.remarketing_login, true, {path: "/"})
        }, getRegisterEventCookie: function () {
            if (app_env == "local") return;
            if (Cookies.get(cookies.remarketing_register)) {
                sendRegisterEvent();
                Cookies.remove(cookies.remarketing_register)
            }
        }, getLoginEventCookie: function () {
            if (app_env == "local") return;
            if (Cookies.get(cookies.remarketing_login)) {
                sendLoginEvent();
                Cookies.remove(cookies.remarketing_login)
            }
        }, sendUsetoolbar: function () {
            if (app_env == "local") return;
            usetoolbar()
        }, sendUsevat: function () {
            if (app_env == "local") return;
            usevat()
        }
    })
});
$(document).ready(function () {
    function openMenuSection(obj) {
        var opened = obj.hasClass("is-active");
        $("#main_nav a, #main_nav .nav-dropdown").removeClass("is-active");
        if (!opened) {
            obj.closest("li").find(".nav-dropdown").addClass("is-active");
            obj.addClass("is-active");
            nav_background.addClass("is-active");
            overlay.show().addClass("is-active");
            phonesCont.hide();
            topPos = ($("#main_nav").height() + $("#main_nav .nav-background").height()) * .8
        } else {
            nav_background.removeClass("is-active");
            overlay.hide().removeClass("is-active");
            phonesCont.show();
            topPos = 0
        }
    }

    function menuFadeOut() {
        nav_background.removeClass("is-active");
        overlay.fadeOut(400, function () {
            overlay.removeClass("is-active")
        });
        $("#main_nav a, #main_nav .nav-dropdown").removeClass("is-active");
        phonesCont.show();
        topPos = 0
    }

    var main_navigation = $("#navigation");
    var overlay = $("#main_nav .overlay");
    var nav_background = $("#main_nav .nav-background");
    var phonesCont = $(".secondary-menu .phone");
    var topPos = 0;
    window.addEventListener("scroll", function (e) {
        if (topPos > 0 && topPos <= window.pageYOffset) menuFadeOut()
    });
    window.addEventListener("resize", function () {
        if ($("#main_nav .primary-menu:visible").length < 1) menuFadeOut()
    });
    main_navigation.find(".container \x3e li \x3e a").on("click", function (e) {
        e.preventDefault()
    });
    $(document).on("click", "#navigation .container \x3e li \x3e a", function () {
        openMenuSection($(this))
    }).on("mouseenter", "#navigation .container \x3e li \x3e a:not(.is-active)", function () {
        if ($("#navigation .container \x3e li \x3e a.is-active").length) openMenuSection($(this))
    });
    $(document).on("click", function (e) {
        if (e.target !=
            main_navigation && main_navigation.has(e.target).length < 1 && !nav_background.is(e.target) && nav_background.has(e.target).length < 1) {
            nav_background.removeClass("is-active");
            overlay.hide().removeClass("is-active");
            main_navigation.find(".is-active").removeClass("is-active");
            phonesCont.show();
            topPos = 0
        } else {
            var activeSub = main_navigation.find(".with-dropdown.is-active");
            if (e.target = activeSub && activeSub.has(e.target).length < 1) activeSub.removeClass("is-active")
        }
    })
});
$(document).ready(function () {
    (function () {
        function addClipboardInputs(selector) {
            $(selector).css("cursor", "pointer").each(function () {
                this.addEventListener("click", function () {
                    clickHandler(this)
                })
            })
        }

        function clickHandler(obj) {
            try {
                clearTimeout(copyTimer)
            } catch (er) {
            }
            copyTimer = setTimeout(function () {
                copy(obj)
            }, 250)
        }

        function slicedClickHandler(obj) {
            try {
                clearTimeout(copyTimer)
            } catch (er) {
            }
            copyTimer = setTimeout(function () {
                copySliced(obj)
            }, 250)
        }

        function copy(obj) {
            var text = obj.innerText;
            if (obj.className.match(/toClipBoard-clearSpecial/) !=
                null) text = text.replace(/\W/g, "");
            if (obj.className.match(/toClipBoard-SplitOn/) != null) text = text.split(obj.attr("data-split"))[obj.attr("data-get")];
            if (obj.className.match(/toClipBoard-email:/) != null) {
                if (text.match(/@/) == null) {
                    var domainName = obj.className.match(/toClipBoard-email:\w+\s?/)[0].trim().split(":")[1];
                    text = text.replace(domainName, domainName + "@")
                }
                text = text.replace(/@+/, "@")
            }
            input.value = text;
            input.select();
            document.execCommand("Copy");
            $.alertHandler("", $.translate("misc.clipboard_copied", 0,
                {"text": input.value}), alert_box_success)
        }

        function copySliced(obj) {
            try {
                var text = obj.innerText.slice(obj.className.match(/toClipBoard-slice[0-9]+/)[0].match(/[0-9]+/))
            } catch (er) {
                text = obj.innerText
            }
            if (obj.className.match(/toClipBoard-clearSpecial/) != null) text = text.replace(/\W/g, "");
            if (obj.className.match(/toClipBoard-SplitOn/) != null) text = text.split(obj.dataset.split)[obj.dataset.get];
            if (obj.className.match(/toClipBoard-email:/) != null) {
                if (text.match(/@/) == null) {
                    var domainName = obj.className.match(/toClipBoard-email:\w+\s?/)[0].trim().split(":")[1];
                    text = text.replace(domainName, domainName + "@")
                }
                text = text.replace(/@+/, "@")
            }
            input.value = text;
            input.select();
            document.execCommand("Copy");
            $.alertHandler("", $.translate("misc.clipboard_copied", 0, {"text": input.value}), alert_box_success)
        }

        var copyTimer;
        var input = document.createElement("input");
        input.type = "text";
        input.id = "copyInput";
        input.style.opacity = 0;
        input.style.position = "absolute";
        input.style.top = "-1000000px";
        input.style.left = "-1000000px";
        document.body.appendChild(input);
        input = document.getElementById("copyInput");
        addClipboardInputs(".toClipBoard");
        $.extend({addClipboardInputs: addClipboardInputs});
        $(document).on("mouseenter", '.myClipBoardContainer .toClipBoard, [class*\x3d"toClipBoard-slice"]', function () {
            this.style.cursor = "pointer"
        }).on("click", ".myClipBoardContainer .toClipBoard", function () {
            clickHandler(this)
        }).on("click", '[class*\x3d"toClipBoard-slice"]', function () {
            slicedClickHandler(this)
        })
    })()
});

$(document).ready(function () {
    valid_elements = new RegExp("^(div|span|p|strong|ul|ol|li|h[1-6]|dl|dd|a|small|form|label|hr|input){");
    my_modal_classes = {
        "modal_init_row": "row collapse",
        "modal_title_p": "lead orange",
        "small_12": "small-12 columns"
    };
    my_modals_config = {
        "test": {
            "id": "test",
            "close_icon": true,
            "disable": {"bg_click_close": true},
            "content": ['["div{id\x3dtestId,class\x3d##modal_init_row##}[]",["div{class\x3d##small_12##}[]",["p{class\x3d##modal_title_p##}[Test]",["strong{id\x3dssl}[test1]","strong{id\x3dtest}[test2]"]],"div{class\x3d##small_12##}[]",["p{class\x3d##modal_title_p##}[Test]",["strong{id\x3dssl}[test1]","strong{id\x3dtest}[test2]"]]]]', '["div{id\x3dtestId,class\x3d##modal_init_row##}[]"]']
        }, "login": {
            "id": "register-forms", "modal_classes": "cart-forms login-forms tiny logins",
            "content": ['["dl{class\x3dtabs row collapse}[]",["dd{class\x3dsmall-6 columns text-center active}[]",["a{href\x3d#panel1,class\x3dtabTrigger}[]",["strong{}[trans(login.tabs.already_user.title)]","small{}[trans(login.tabs.already_user.desc)]"]],"dd{class\x3dsmall-6 columns text-center}[]",["a{href\x3d#panel2,id\x3dgoToRegister}[]",["strong{}[trans(login.tabs.register.title)]","small{}[trans(login.tabs.register.desc)]"]]]]', '["div{class\x3dtabs-content}[]",["div{id\x3dpanel1,class\x3dcontent active}[]",["div{class\x3drow}[]",["div{class\x3dsmall-12 columns}[]",["div{id\x3dlogin-contents}[]",["div{id\x3dlogin-view1}[]",["form{method\x3dPOST,action\x3dhttp:\\/\\/site.dev\\/login,accept-charset\x3dUTF-8,id\x3dform-login-modal}[]",["div{class\x3drow}[]",["div{class\x3dsmall-12 large-4 columns}[]",["label{for\x3demail,data-about\x3demail,class\x3dinline}[trans(common.email.label.required)]"],"div{class\x3dsmall-12 large-8 columns}[]",["input{id\x3demail,placeholder\x3dtrans(common.email.ph),data-validate\x3demail required,autocomplete\x3don,name\x3demail,type\x3demail}[]"]],"div{class\x3drow}[]",["div{class\x3dsmall-12 large-4 columns}[]",["label{for\x3dpassword,data-about\x3dpassword,class\x3dinline}[trans(common.password.label.required)]"],"div{class\x3dsmall-12 large-8 columns}[]",["input{id\x3dpassword,placeholder\x3dtrans(common.password.ph),data-validate\x3drequired,autocomplete\x3doff,name\x3dpassword,type\x3dpassword,value\x3d}[]"]],"div{class\x3drow}[]",["div{class\x3dmedium-6 large-4 right columns}[]",["a{href\x3d#,id\x3dlogin_btn,class\x3dloader_cont submit button expand}[]",["span{class\x3dsubmitText}[trans(common.buttons.connection)]","span{class\x3dloading hide}[]",["div{class\x3dspinner}[]"]]],"div{class\x3dsmall-12 columns show-for-small-only}[]",["a{href\x3d#,class\x3dsecondary button expand modal_cancel}[trans(common.buttons.cancellation)]"]],"div{class\x3drow}[]",["div{class\x3dsmall-12 columns}[]",["hr{}[]","a{href\x3dhttp:\\/\\/my.site.dev\\/reminder,id\x3dforgot-pass}[trans(login.forgot_password)]"]]]]]]]],"div{id\x3dpanel2,class\x3dcontent}[]",["div{class\x3drow}[]",["div{class\x3d##small_12##}[]"]]]]']
        },
        "whois": {
            "id": "whois-results",
            "content": ['["div{class\x3drow collapse}[]",["div{class\x3dsmall-12 columns}[]",["p{class\x3dlead dark-blue}[]"]]]', '["div{class\x3dmodal-content}[]",["div{class\x3drow}[]",["div{class\x3dsmall-12 columns}[]",["div{class\x3dloading hide,style\x3dheight: 4rem; top: 1.5rem; right: 0.5rem; text-align: center;}[]",["span{class\x3dspinner bigger dark}[]"],"p{class\x3dwhois,style\x3dmin-height: 400px; max-height: 400px; overflow-y: auto;}[]"]]]]']
        }
    };
});
$(document).ready(function () {
    function intMenuCreation() {
        hideShowNavItemsBasedOnWidth();
        menuFunction = {
            "getHostingHeader": getHostingHeader,
            "getActionLink": getActionLink,
            "getLogoutLink": getLogoutLink,
            "getAccountName": getAccountName
        };
        debug = true;
        setStaticMenu($siteMenuConfig.common);
        debug = false;
        try {
            setBackendMenu($userMenuConfig[$userGroup])
        } catch (e) {
        }
    }

    function getHostingHeader(choices) {
        if ($jsMenu.has_pbas_account != true) return choices[0]; else return choices[1]
    }

    function getActionLink(choices) {
        if ($jsMenu.has_pbas_account !=
            true) return choices[0]; else return choices[1]
    }

    function getLogoutLink(choices) {
        if ($userGroup == "guest") return false;
        if ($userGroup == "user") return choices[0]; else return choices[1]
    }

    function getAccountName(choices) {
        var link = choices[0];
        link.link.text = $jsMenu.account_name;
        link.link.title = $jsMenu.account_name;
        return link
    }

    function setBackendMenu(config) {
        var container = $("#backend-side-nav");
        container.empty();
        loopLists(container, config);
        var support = $("#sidSupportContainer");
        $.cart.inc();
        var supportContainer =
            $("#supportContainer");
        support.append('\x3cdiv style\x3d"display: none"\x3e\x3c/div\x3e').find("\x3e div").append(supportContainer.is("noscript") ? supportContainer.html() : supportContainer.find("ul").clone());
        support.find("ul").attr({"id": "", "class": "support-wrapper"}).find(".line span").addClass("sidr-support-tel");
        optionCountries = "";
        $.each(countries, function (key, value) {
            optionCountries += '\x3coption class\x3d"sidOptionCountries" value\x3d"' + value["iso_2"] + '" data-name\x3d"' + COMMON_LANG.COUNTRIES[value["iso_2"]] +
                '" data-vat\x3d"' + value["vat_rate"] + '"\x3e' + COMMON_LANG.COUNTRIES[value["iso_2"]] + "\x3c/option\x3e"
        });
        if (vat["country"] != "OTHER") {
            quote = vat["quote"].toString().split(".");
            quote = parseInt(quote[1]);
            if (quote < 10) quote *= 10
        } else quote = "";
        $appendVat = '\x3cul class\x3d"vat-wrapper"\x3e' + "\x3cli\x3e" + '\x3cinput id\x3d"sid-no-Vat" type\x3d"radio" value\x3d"sid-no-Vat" name\x3d"sid-Vat"\x3e' + '\x3clabel for\x3d"sid-no-Vat"\x3e' + COMMON_LANG.SIDE_NAV.VAT_TEMPLATES.WITHOUT.TEXT + "\x3c/label\x3e" + "\x3c/li\x3e" + "\x3cli\x3e" +
            '\x3cinput id\x3d"sid-with-Vat" type\x3d"radio" value\x3d"sid-with-Vat" name\x3d"sid-Vat"\x3e' + '\x3clabel for\x3d"sid-with-Vat"\x3e' + COMMON_LANG.SIDE_NAV.VAT_TEMPLATES.WITH.TEXT + "\x3c/label\x3e" + "\x3c/li\x3e";
        if ($("#countrySelector").length) $appendVat += '\x3cli id\x3d"countriesContainer"\x3e' + '\x3cdiv class\x3d"countries-wrapper"\x3e' + "\x3cul\x3e" + '\x3cli class\x3d"c-header"\x3e' + COMMON_LANG.SIDE_NAV.SELECTED_VAT + " :\x3c/li\x3e" + '\x3cli id\x3d"countrySelected"\x3e\x3cspan class\x3d"flag ' + vat["country"].toLowerCase() +
            '"\x3e\x3c/span\x3e\x3cspan class\x3d"sid-country"\x3e' + COMMON_LANG.COUNTRIES[vat["country"]] + '\x3c/span\x3e \x3cspan class\x3d"sid-percentage"\x3e\x3c/span\x3e\x3c/span\x3e\x3c/li\x3e' + "\x3c/ul\x3e" + '\x3cselect id\x3d"countrySelectorSid"\x3e' + '\x3coption class\x3d"sidOptionPlaceholder placeholder" selected disabled value\x3d""\x3e' + COMMON_LANG.SIDE_NAV.CHANGE_VAT + "\x3c/option\x3e" + optionCountries + '\x3coption class\x3d"sidOptionSeparator" disabled\x3e-------------------------------------\x3c/option\x3e' +
            '\x3coption class\x3d"sidOptionOther" value\x3d"OTHER" data-name\x3d"' + COMMON_LANG.COUNTRIES.OTHER + '"\x3e' + COMMON_LANG.COUNTRIES.OTHER + "\x3c/option\x3e" + "\x3c/select\x3e" + "\x3c/div\x3e" + "\x3c/li\x3e";
        $appendVat += '\x3cli\x3e\x3cbutton id\x3d"cancelVatChangesSidr" class\x3d"button small secondary"\x3eΑκύρωση\x3c/button\x3e\x3cbutton id\x3d"submitVatSidr" class\x3d"button small" style\x3d"display:none;"\x3e\x3cspan class\x3d"submitText"\x3eΥποβολή\x3c/span\x3e\x3cdiv class\x3d"loading hide" style\x3d"display:none;"\x3e\x3cspan class\x3d"spinner smaller"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/button\x3e\x3c/li\x3e';
        $appendVat += "\x3c/ul\x3e";
        $("#sidVatContainer").append('\x3cdiv style\x3d"display: none"\x3e\x3c/div\x3e').find("\x3e div").append($appendVat);
        setTimeout(function () {
            if (!vat["show"]) {
                $("#sid-no-Vat").prop({"checked": true});
                $("#sid-with-Vat").prop({"checked": false});
                $("#countriesContainer").slideUp()
            } else {
                $("#sid-no-Vat").prop({"checked": false});
                $("#sid-with-Vat").prop({"checked": true})
            }
        }, 200);
        if (vat["country"] != "OTHER") $("#countrySelected .sid-percentage").html("\x26lpar; " + quote + "\x26percnt; \x26rpar;");
        $.vat.sort_vat_countries("sidOptionCountries", "countrySelectorSid", "sidOptionOther", "sidOptionSeparator");
        $("#sidNavContainer").append(global_side_nav.find(".sidr-inner")).append('\x3cdiv id\x3d"userNav" class\x3d"sidr-inner"\x3e\x3c/div\x3e');
        $(".side-menu-title").after('\x3ca href\x3d"#" class\x3d"sidr-close" rel\x3d"nofollow"\x3e\x3ci class\x3d"icon-cross2" /\x3e\x3c/a\x3e')
    }

    function setStaticMenu(config) {
        var container = $("#side-nav");
        container.empty();
        loopLists(container, config)
    }

    function loopLists(container,
                       lists, $submenu) {
        if (lists.hasOwnProperty("group")) for (var i in lists["group"]) {
            if (lists["group"].hasOwnProperty(i)) {
                var navList = container.append('\x3cdiv class\x3d"sidr-inner"\x3e\x3c/div\x3e').find("div:last");
                if (lists["group"][i].hasOwnProperty("mobile_text") || lists["group"][i].hasOwnProperty("text")) navList.append('\x3cspan class\x3d"side-menu-title"\x3e' + (lists["group"][i].hasOwnProperty("mobile_text") ? lists["group"][i]["mobile_text"] : lists["group"][i]["text"]) + "\x3c/span\x3e");
                if (lists["group"][i].hasOwnProperty("list")) {
                    if (lists["group"][i]["list"].hasOwnProperty("decoration")) {
                        if (lists["group"][i]["list"]["decoration"].hasOwnProperty("id")) navList.attr("id",
                            lists["group"][i]["list"]["decoration"]["id"]);
                        if (lists["group"][i]["list"]["decoration"].hasOwnProperty("class")) navList.addClass(lists["group"][i]["list"]["decoration"]["class"]);
                        delete lists["group"][i]["list"]["decoration"]
                    }
                    loopLists(navList, lists["group"][i]["list"])
                }
            }
        } else {
            if (typeof $submenu != "undefined") navList = container.append('\x3cdiv style\x3d"display: none"\x3e\x3cul class\x3d"sidr-class-f-dropdown"\x3e\x3c/ul\x3e\x3c/div\x3e').find("ul:last"); else navList = container.append('\x3cul class\x3d"sidr-class-f-dropdown"\x3e\x3c/ul\x3e').find("ul:last");
            for (i in lists) if (lists.hasOwnProperty(i)) {
                if (lists[i].hasOwnProperty("function")) {
                    lists[i] = menuFunction[lists[i]["function"]](lists[i]["choices"]);
                    if (lists[i] === false) continue
                }
                if (lists[i].hasOwnProperty("label")) continue;
                var liId = "";
                var liClass = "";
                if (lists[i].hasOwnProperty("class")) liClass += " " + lists[i]["class"];
                if (lists[i].hasOwnProperty("list")) liClass += " sidr-class-with-dropdown ";
                liClass = liClass.trim().split(" ").filter(function (v, i, a) {
                    return a.indexOf(v) === i
                }).join(" ");
                if (lists[i].hasOwnProperty("decoration")) {
                    if (lists[i]["decoration"].hasOwnProperty("id")) {
                        liId +=
                            " " + lists[i]["decoration"]["id"];
                        liId = liId.trim()
                    }
                    if (lists[i]["decoration"].hasOwnProperty("class")) {
                        liClass += " " + lists[i]["decoration"]["class"];
                        liClass = liClass.trim()
                    }
                }
                var item = navList.append('\x3cli id\x3d"' + liId + '" class\x3d"' + liClass + '"\x3e\x3c/li\x3e').find("\x3e li:last");
                if (lists[i].hasOwnProperty("header")) {
                    if (lists[i]["header"].hasOwnProperty("function")) lists[i]["header"] = menuFunction[lists[i]["header"]["function"]](lists[i]["header"]["choices"]);
                    if (lists[i]["header"] !== false) {
                        var span =
                            "";
                        var text = "";
                        var path = "";
                        var id = "";
                        var $class = "";
                        var control = "";
                        if (lists[i]["header"].hasOwnProperty("span")) span = "\x3cspan\x3e" + lists[i]["header"]["span"] + "\x3c/span\x3e";
                        if (lists[i]["header"].hasOwnProperty("mobile_text") || lists[i]["header"].hasOwnProperty("text")) text = lists[i]["header"].hasOwnProperty("mobile_text") ? lists[i]["header"]["mobile_text"] : lists[i]["header"]["text"];
                        if (lists[i]["header"].hasOwnProperty("link")) {
                            if (lists[i]["header"]["link"] != "#") path = lists[i]["header"]["link"]["path"];
                            else path = lists[i]["header"]["link"];
                            if (text == "" && (lists[i]["header"]["link"].hasOwnProperty("mobile_text") || lists[i]["header"]["link"].hasOwnProperty("text"))) text = lists[i]["header"]["link"].hasOwnProperty("mobile_text") ? lists[i]["header"]["link"]["mobile_text"] : lists[i]["header"]["link"]["text"]
                        }
                        if (lists[i]["header"].hasOwnProperty("id")) id = lists[i]["header"]["id"];
                        if (lists[i].hasOwnProperty("list") || lists[i].hasOwnProperty("pending_list")) {
                            $class = "sidr-class-button sidr-class-dropdown";
                            control =
                                '\x3cspan class\x3d"sidClose arrow"\x3e\x3c/span\x3e'
                        }
                        item.append('\x3ca id\x3d"' + id + '" href\x3d"' + path + '" class\x3d"' + $class + '"\x3e' + span + text + control + "\x3c/a\x3e").find("\x3e a:last")
                    }
                }
                if (lists[i].hasOwnProperty("link")) {
                    span = "";
                    text = "";
                    path = "";
                    id = "";
                    $class = "";
                    var icon = "";
                    control = "";
                    var decoration = "";
                    var title = "";
                    if (lists[i].hasOwnProperty("link")) {
                        path = lists[i]["link"]["path"];
                        if (lists[i]["link"].hasOwnProperty("id")) id = lists[i]["link"]["id"].trim();
                        if (lists[i]["link"].hasOwnProperty("class")) $class =
                            lists[i]["link"]["class"].trim();
                        if (lists[i]["link"].hasOwnProperty("mobile_text") || lists[i]["link"].hasOwnProperty("text")) text = lists[i]["link"].hasOwnProperty("mobile_text") ? lists[i]["link"]["mobile_text"] : lists[i]["link"]["text"];
                        if (lists[i]["link"].hasOwnProperty("icon")) icon = '\x3cicon class\x3d"' + lists[i]["link"]["icon"] + '"\x3e ';
                        if (lists[i]["link"].hasOwnProperty("decoration")) {
                            var $decorations = lists[i]["link"]["decoration"];
                            for (var j in $decorations) {
                                var attributes = "";
                                icon = "";
                                if ($decorations.hasOwnProperty(j)) {
                                    if ($decorations[j].hasOwnProperty("id")) attributes +=
                                        'id\x3d"' + $decorations[j]["id"] + '" ';
                                    if ($decorations[j].hasOwnProperty("class")) attributes += 'class\x3d"' + $decorations[j]["class"] + '"';
                                    if ($decorations[j].hasOwnProperty("icon")) icon = '\x3cicon class\x3d"' + $decorations[j]["icon"] + '" /\x3e';
                                    decoration += "\x3c" + j + " " + attributes + "\x3e" + icon + "\x3c/" + j + "\x3e"
                                }
                            }
                        }
                        if (lists[i]["link"].hasOwnProperty("title")) title = lists[i]["link"]["title"];
                        if (lists[i].hasOwnProperty("list")) {
                            $class += "sidr-class-button sidr-class-dropdown";
                            control = '\x3cspan class\x3d"sidClose arrow"\x3e\x3c/span\x3e'
                        }
                    }
                    item.append('\x3ca id\x3d"' +
                        id + '" class\x3d"' + $class + '" href\x3d"' + path + '" title\x3d"' + title + '"\x3e' + icon + span + text + decoration + control + "\x3c/a\x3e")
                }
                if (lists[i].hasOwnProperty("list")) loopLists(item, lists[i]["list"], true)
            }
        }
    }

    var sidrClose = '\x3cspan class\x3d"sidClose"\x3e\x3ci class\x3d"icon-cross3 hide"\x3e\x3c/i\x3e\x3c/span\x3e';
    var sidrArrow = '\x3cspan class\x3d"sidClose arrow"\x3e\x3c/span\x3e';
    optionCountries = "";
    $.each(countries, function (key, value) {
        optionCountries += '\x3coption class\x3d"sidOptionCountries" value\x3d"' + value["iso_2"] +
            '" data-name\x3d"' + COMMON_LANG.COUNTRIES[value["iso_2"]] + '" data-vat\x3d"' + value["vat_rate"] + '"\x3e' + COMMON_LANG.COUNTRIES[value["iso_2"]] + "\x3c/option\x3e"
    });
    var global_side_nav = $("#side-nav");
    global_side_nav.append('\x3cdiv id\x3d"sidNavContainer"\x3e\x3c/div\x3e');
    var items_in_cart = $.cart.get_items().length;
    var containers = $(".sidr-class-inline-list\x3eli:not(#sidCartContainer)");
    containers.each(function () {
        var obj = $(this);
        var htmlTemp = obj.html();
        obj.html(('\x3cdiv style\x3d"display:none;"\x3e' +
            htmlTemp + "\x3c/div\x3e").replace(/\s+/g, " ").replace(/> </g, "\x3e\r\n\x3c"));
        var mainAnchor = obj.find("a.sidr-class-button");
        mainAnchor.html(mainAnchor.text() + " " + sidrArrow);
        obj.prepend(mainAnchor);
        var telAnchor = obj.find("a.sidr-class-tel");
        obj.prepend(telAnchor)
    });
    $(".sidr-class-with-dropdown").each(function () {
        var obj = $(this);
        obj.append('\x3cdiv style\x3d"display: none"\x3e\x3c/div\x3e');
        obj.find("div").append(obj.find("\x3e ul"));
        var mainAnchor = obj.find("a:first");
        mainAnchor.addClass("sidr-class-button").html(mainAnchor.text() +
            ' \x3cspan class\x3d"sidClose arrow"\x3e\x3c/span\x3e')
    });
    $(document).keypress(function (e) {
        disabled_scroll_with_arrows(e)
    }).on("touchstart  click", function (e) {
        out_of_sidr_click(e)
    }).on("click", "a.sidr-class-button:not(#cartController)", function (e) {
        e.preventDefault();
        var obj = $(this);
        var containingDiv = obj.closest("li").find("div");
        if (($(e.target).is("span") || $(e.target).is("i")) && containingDiv.css("display") != "none") {
            obj.closest("li").find("div:not(#countriesContainer):not(.countries-wrapper)").slideUp(400);
            obj.find(".sidClose").removeClass("active").find("i").toggleClass("hide")
        } else if (containingDiv.css("display") == "none") {
            var closestContainer = obj.closest("li");
            if (!closestContainer.hasClass("sidr-class-with-dropdown")) {
                $(".sidr-class-inline-list \x3e li div:not(#countriesContainer):not(.countries-wrapper)").slideUp(400);
                $(".sidClose").removeClass("active").find("i").addClass("hide")
            } else {
                var closestContainerGrouper = closestContainer.closest("ul");
                closestContainerGrouper.find("div:not(#countriesContainer):not(.countries-wrapper)").slideUp(400);
                closestContainerGrouper.find(".sidClose").removeClass("active").find("i").addClass("hide")
            }
            var closestContainerDiv = obj.closest(".sidr-inner");
            var containerDivs = $("#backend-side-nav .sidr-inner:not(:eq(" + closestContainerDiv.index() + "))");
            containerDivs.find(".sidr-class-with-dropdown div:not(#countriesContainer):not(.countries-wrapper)").slideUp(400);
            containerDivs.find(".sidClose").removeClass("active");
            var div_wrapper = obj.closest("li").find(" \x3e div");
            if (div_wrapper.has(".countries-wrapper") && $('[name\x3d"sid-Vat"]:checked').val() ==
                "sid-Vat") div_wrapper.find("#countriesContainer").show();
            div_wrapper.slideDown(400);
            var arrow = obj.find(".arrow");
            if (arrow.length) arrow.toggleClass("active"); else obj.find("i").toggleClass("hide")
        } else {
            var linkTarget = obj.attr("href");
            window.location.href = linkTarget
        }
    }).on("click", ".sidr-close", function (e) {
        e.preventDefault();
        var obj = $(this).closest(".sidr");
        $.sidr("close", obj.attr("id"));
        obj.find("div:has(\x3e ul):not(.sidr-inner)").slideUp();
        obj.find(".sidClose.arrow.active").removeClass("active")
    });
    $(window).resize(function () {
        if ($(window).width() > 1024) {
            $.sidr("close", "side-nav");
            $.sidr("close", "backend-side-nav")
        }
        if (typeof resizeNavTimer == "undefined" || resizeNavTimer == null) resizeNavTimer = setTimeout(function () {
            hideShowNavItemsBasedOnWidth();
            resizeNavTimer = null
        })
    });
    $.extend({intMenuCreation: intMenuCreation})
});
$(window).on("load", function () {
    $.intMenuCreation()
});

function hideShowNavItemsBasedOnWidth() {
    if ($(".primary-menu:visible").length) {
        $("#user-menu").css("top", "8px");
        $("#site-menu").hide();
        $.sidr("close", "side-nav")
    } else {
        $("#user-menu").css("top", "");
        $("#site-menu").show()
    }
}

function out_of_sidr_click(event) {
    if (!$(event.target).closest(".sidr").length && !$(event.target).closest("#mobile-nav").length) {
        $(".sidClose:visible").click();
        $.sidr("close", "side-nav");
        $.sidr("close", "backend-side-nav")
    }
}

function disabled_scroll_with_arrows(e) {
    if ($("#side-nav").css("display") != "none") if (e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 38 || e.keyCode == 40) e.preventDefault()
};
$(document).ready(function () {
    question = "";
    $("#btn-method-skip").on("click", function () {
        skipReminderStep($(this))
    });
    $("#start_over_trig").on("click", function (e) {
        e.preventDefault();
        $('.step input:not([type\x3d"hidden"])').val("");
        resetPassInitiatives();
        formId = $(".step:visible form").attr("id");
        $("#start_over").hide();
        $(".step:first,#remembered,#tokenReceived,#tokenContainer").show();
        $("#reset-forms").find(".reveal-password:has(.icon-eye)").click()
    });
    $("#remembered_trig_modal").on("click", function (e) {
        e.preventDefault();
        $('#login-contents input:not([type\x3d"hidden"]), #reset-contents input:not([type\x3d"hidden"])').val("");
        resetPassInitiatives();
        formId = $("#panel1 form").attr("id");
        $(".step, #reset-controller").hide();
        $("#login-contents").show();
        $("#start_over").hide();
        $("#remembered").hide()
    });
    $("#btn-remind-submit").on("click", function (e) {
        e.preventDefault();
        var cont = $("#reset-contents, #reset-forms");
        cont.find(".error").removeClass("error");
        cont.find("form:visible:first").submit_form()
    });
    $('#form-login, #form-login-modal, [id*\x3d"form-register"]').each(function () {
        var form =
            $(this);
        if (form.length && !form.hasClass($.getValidationClass())) form.prepare_form_advanced(assignCallbackFunction(form))
    });
    $("#goToRegister").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        redirectToRegister()
    });
    if ($(".reminder-page").length) {
        var form$jscomp$0 = $("#form-remind-options");
        form$jscomp$0.prepare_form_advanced(assignCallbackFunction(form$jscomp$0))
    }
    $(document).on("click", ".btn-login, #icon-loginBtn, #sitemapLogin", function (e) {
        e.preventDefault();
        $.sidr("close", "side-nav");
        openRegisterForms()
    }).on("click", "#sidr-id-registerBtn, #icon-registerBtn, #goToRegister", function (e) {
        e.preventDefault();
        if ($("#register-forms").length) redirectToRegister(); else $('.tabTrigger [href\x3d"#panel2"]').trigger("click")
    }).on("click", "#sidr-id-loginBtn, #sidr-id-registerBtn", function (e) {
        e.preventDefault();
        openRegisterForms();
        $.sidr("close", "backend-side-nav");
        if ($.md.os() == "iOS") $("#register-forms").css({"position": "fixed !important", "z-index": 1E4})
    }).on("click", '.tabTrigger [href\x3d"#panel2"]',
        function (e) {
            e.preventDefault();
            $("#all-forms").find(".reveal-password:has(.icon-eye)").click()
        }).on("change", '[name\x3d"newsletter_dial"]', function () {
        var obj = $(this);
        obj.closest("form").find('[name\x3d"newsletter"]').val(obj.is(":checked") ? "1" : "0")
    });
    $registerSteps = {first: $("#registerStep1")};
    if ($registerSteps.first.length) {
        $("#form-register, #form-register-modal").find("select").each(function () {
            var obj = $(this);
            obj.apply_chosen(obj.val())
        });
        $registerSteps.second = $("#registerStep2");
        step1inputs = $registerSteps.first.find("input:not(.chosen-container input), select");
        $("#country").on("change", function () {
            var value = $(this).val();
            var stateSelect = $("#stateSelect");
            var stateInput = $("#stateInput");
            if (value == "GR") {
                stateSelect.show();
                stateInput.hide()
            } else {
                stateSelect.hide();
                stateInput.show()
            }
            stateSelect.find("select").chosen_update("");
            stateInput.find("input").val("")
        });
        $registerSteps.second.find("#previous_btn").on("click", function (e) {
            e.preventDefault();
            $registerSteps.first.show().find("input:first").focus();
            $registerSteps.second.hide()
        })
    }
    var resetStep1 = $("#form-remind-options:visible");
    if (resetStep1.length) resetStep1.prepare_form_advanced(assignCallbackFunction(resetStep1));
    $("#accountSuspendedForm").on("submit", function (e) {
        e.preventDefault()
    });
    if (typeof $loginErrors != "undefined" && $loginErrors != null) {
        openRegisterForms();
        form$jscomp$0 = $("#form-login-modal, #form-login");
        $.each($loginErrors.data.filled, function (name, value) {
            var obj = form$jscomp$0.find('[name\x3d"' + name + '"]');
            obj.val(value)
        });
        globalApplicationErrors({
                "success": false,
                "code": $loginErrors.code,
                "msg": $loginErrors.msg,
                "data": $loginErrors.data.errors
            },
            form$jscomp$0.attr("id"))
    }
});

function redirectToRegister() {
    var target = $("#goToRegister").attr("href");
    if (typeof $flashOffers == "string") {
        $("body").append('\x3cform id\x3d"flashOffersRegisterForm" method\x3d"post" action\x3d"' + target + '"\x3e' + $('[name\x3d"_token"]')[0].outerHTML + '\x3cinput type\x3d"hidden" name\x3d"flashOffer" value\x3d"' + $flashOffers + '"\x3e\x3c/form\x3e');
        $("#flashOffersRegisterForm").submit()
    } else window.location.href = target
}

function openRegisterForms() {
    var register_forms = $("#register-forms");
    register_forms.find(".reveal-password:has(.icon-eye)").click();
    if (register_forms.length) {
        if (!register_forms.hasClass("open")) {
            $("#register-forms").modal_open();
            $("#accountSuspendedNotice").hide();
            account_suspended = false
        }
        if ($(this).is("#loginBtn") || $(this).is("#sidr-id-loginBtn") || $(this).is("#icon-loginBtn")) {
            $("#register-forms .step, #reset-controller,#method-skip-cont").hide();
            $("#btn-remind-submit").hide().find(".submitText").text(COMMON_LANG.BUTTONS.RESET_START);
            $('input[type\x3d"text"],input[type\x3d"password"]').val("");
            $("#login-contents").show();
            $('.tabTrigger[href\x3d"#panel1"]').trigger("click");
            $("#remembered, #start_over").hide()
        }
    } else $('.tabTrigger [href\x3d"#panel1"]').trigger("click")
}

function resetPassInitiatives() {
    $("#failed-auth,.mob_avail,.email.panel, .mobile.panel").hide();
    $(".step").hide().removeClass("available");
    $("#reset-view5").addClass("available");
    $("#btn-method-skip").hide();
    $(".step select").chosen_update("");
    $(".email_rep,.mobile_rep").text("");
    $("#btn-remind-submit").show().find(".submitText").text(COMMON_LANG.BUTTONS.RESET_START)
}

function assignCallbackFunction(form$jscomp$0) {
    var formId = form$jscomp$0.attr("id");
    switch (formId) {
        case "form-login":
        case "form-login-modal": {
            return {
                onSuccess: function () {
                    loginFormValidationCallback(form$jscomp$0)
                }, handlers: "#login_btn", disable: "#login_btn", version_exception: true
            };
            break
        }
        case "form-register-step-1":
        case "form-register-modal-step-1": {
            return {
                onSuccess: function () {
                    registerFormValidationCallback(form$jscomp$0)
                }, handlers: "#continue_btn", disable_exception: true, version_exception: true
            };
            break
        }
        case "form-register-step-2":
        case "form-register-modal-step-2": {
            return {
                onSuccess: function () {
                    registerFormValidationCallback(form$jscomp$0)
                },
                handlers: "#register_btn",
                disable_exception: true,
                version_exception: true,
                callback: {
                    "after:prepare": function (form) {
                        form.find("select").each(function () {
                            var obj = $(this);
                            obj.apply_chosen(obj.val())
                        })
                    }
                },
                "custom_error_handler": function (error) {
                    if ($registerSteps.first.find(error).length) {
                        $registerSteps.first.show();
                        $registerSteps.second.hide()
                    }
                    $("html,body").animate({scrollTop: error.offset().top - 100}, 2E3)
                }
            };
            break
        }
        case "form-remind-options": {
            return {
                onSuccess: function () {
                    reminderOptionsFormValidationCallback(form$jscomp$0)
                },
                version_exception: true
            };
            break
        }
        case "form-question": {
            return {
                onSuccess: function () {
                    questionFormValidationCallback(form$jscomp$0)
                }, version_exception: true
            };
            break
        }
        case "form-email": {
            return {
                onSuccess: function () {
                    emailFormValidationCallback(form$jscomp$0)
                }, version_exception: true
            };
            break
        }
        case "form-mobile": {
            return {
                onSuccess: function () {
                    mobileFormValidationCallback(form$jscomp$0)
                }, version_exception: true
            };
            break
        }
        case "form-reset-pass": {
            return {
                onSuccess: function () {
                    resetPassFormValidationCallback(form$jscomp$0)
                },
                version_exception: true
            };
            break
        }
    }
}

function handleErrors(data, formId) {
    switch (data.code) {
        case error_codes.unauthorised_email: {
            passResetUserNotFound(formId, data.msg, data.data);
            break
        }
        case error_codes.two_factor_fail: {
            resetPassTwoFactorFailed();
            break
        }
        case error_codes.password_mismatch: {
            passwordVerificationErrors(formId, data.msg);
            break
        }
        case error_codes.reset_password_option_not_valid: {
            invalidResetOption(data.msg);
            break
        }
        default:
            globalApplicationErrors(data, formId)
    }
}

function mediumLargeViewLogin(obj) {
    frondEndLogin(obj)
}

function frondEndLogin(obj) {
    var register_forms = $("#register-forms");
    if (!register_forms.hasClass("open")) register_forms.modal_close();
    if (obj.is("#loginBtn") || obj.is("#sidr-id-loginBtn")) {
        $("#register-forms .step, #reset-controller,#method-skip-cont").hide();
        $("#btn-remind-submit").hide().find(".submitText").text(COMMON_LANG.BUTTONS.RESET_START);
        $('input[type\x3d"text"],input[type\x3d"password"]').val("");
        $("#login-contents").show();
        $('.tabTrigger[href\x3d"#panel1"]').trigger("click")
    } else $('.tabTrigger[href\x3d"#panel2"]').trigger("click")
}

function backEndLogin(obj) {
    if ($("#reset-forms").length) location.replace(obj.attr("href")); else if (obj.is("#loginBtn") || obj.is("#sidr-id-loginBtn")) $('.tabTrigger [href\x3d"#panel1"]').trigger("click"); else $('.tabTrigger [href\x3d"#panel2"]').trigger("click")
}

function smallViewLogin(obj) {
    if ($("#register-forms").length || $("#reset-forms").length) location.replace($(this).attr("href")); else if (obj.is("#loginBtn") || obj.is("#sidr-id-loginBtn")) $('.tabTrigger [href\x3d"#panel1"]').trigger("click"); else $('.tabTrigger [href\x3d"#panel2"]').trigger("click")
}

function skipReminderStep(btn) {
    activeStep = $(".step:visible");
    activePos = parseInt(activeStep.attr("id").match(REG.ALL_NUM.REGEX));
    activeStep.find(".error").removeClass("error");
    $(".step.available").each(function () {
        pos = parseInt($(this).attr("id").match(REG.ALL_NUM.REGEX));
        if (pos > activePos) {
            activeStep.hide();
            if ($(this).is(":hidden")) $(this).show();
            if ($(this).is($(".step.available:last"))) btn.hide();
            if ($(this).attr("data-method") == "email" || $(this).attr("data-method") == "mob-reset-pass") {
                $("#btn-method-skip").text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS);
                $("#btn-remind-submit .submitText").text(COMMON_LANG.BUTTONS.RESET_ACCESS)
            } else $("#btn-remind-submit").hide();
            formId = $(".step:visible form").attr("id");
            return false
        }
    });
    activeForm = $("#reset-contents form:visible, #reset-forms form:visible");
    if (activeForm.length && !activeForm.hasClass("under_validation")) activeForm.prepare_form_advanced(assignCallbackFunction(activeForm));
    activeStep = $(".step:visible");
    if (activeStep.attr("id") == "reset-view5" || activeStep.attr("id") == "reset-view6") $("#start_over").removeClass("positioned-bottom");
    else $("#start_over").addClass("positioned-bottom");
    btn.addClass("button expand warning").removeClass("link").blur()
}

function loginFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof login_con != "object") login_con = new $.ajax_prototype({
        "url": form.attr("action"), "success": function (data) {
            loginRequestCallback(data, formID)
        }, "type": "POST", "complete": function () {
            if (typeof keep_progress != "undefined") $.set_cookie("keep_progress", keep_progress, "/"); else if (typeof loginRedirect != "undefined") document.location.href = loginRedirect; else if (typeof loginReload != "undefined") document.location.reload(); else if (typeof account_suspended ==
                "undefined" || account_suspended !== true) {
                $.enable_form_controls(formID);
                $(".submitText").show();
                $(".loading").hide()
            }
            if (gdpr_built) $("#login_btn").addClass("disabled")
        }
    }, formID);
    login_con.data = form.serialize();
    $.ajax(login_con)
}

function registerFormValidationCallback(form) {
    var formID = form.attr("id");
    register_con = new $.ajax_prototype({
        "url": form.attr("action"), "success": function (data) {
            registerRequestCallback(data, formID)
        }, "type": "POST", "complete": function () {
            if (typeof registerReload != "undefined") ; else {
                $.enable_form_controls(formID);
                $(".submitText").show();
                $(".loading").hide()
            }
        }
    }, formID);
    if (formID.indexOf("step-1") != -1) data = {};
    form.find("input:not(.chosen-container input), select").each(function () {
        var obj = $(this);
        if (obj.attr("name") !=
            "state_id") {
            if (obj.val() && (!obj.is('[type\x3d"checkbox"]') || obj.is(":checked"))) data[obj.attr("name")] = obj.val()
        } else if (obj.val()) data[obj.attr("name")] = obj.find("option:selected").attr("data-lang")
    });
    register_con.data = data;
    $.ajax(register_con)
}

function reminderOptionsFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof send_email_con != "object") send_email_con = new $.ajax_prototype({
        "url": form.attr("action"),
        "success": function (data) {
            reminderOptionsRequestCallback(data, formID);
            hide_loader()
        },
        "type": "POST"
    }, formID);
    send_email_con.data = form.serialize();
    $.ajax(send_email_con);
    show_loader()
}

function questionFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof form_question != "object") form_question = new $.ajax_prototype({
        "url": form.attr("action"),
        "success": function (data) {
            questionRequestCallback(data, formID);
            hide_loader()
        },
        "type": "POST"
    }, formID);
    form_question.data = {
        _token: form.find('[name\x3d"_token"]').val(),
        email: form.find('[name\x3d"email"]').val(),
        answer: form.find('[name\x3d"answer"]').val(),
        method: form.find('[name\x3d"method"]').val()
    };
    birth = form.find('[name\x3d"birth_date"]').val().split("/");
    form_question.data["birth_date"] = birth[2] + "/" + birth[1] + "/" + birth[0];
    $.ajax(form_question);
    show_loader()
}

function emailFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof form_email != "object") form_email = new $.ajax_prototype({
        "url": form.attr("action"),
        "success": function (data) {
            emailRequestCallback(data, formID);
            hide_loader()
        },
        "type": "POST"
    }, form.attr("id"));
    form_email.data = form.serialize();
    $.ajax(form_email);
    show_loader()
}

function mobileFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof form_sms != "object") form_sms = new $.ajax_prototype({
        "url": form.attr("action"),
        "success": function (data) {
            mobileRequestCallback(data, formID);
            hide_loader()
        },
        "type": "POST"
    }, formID);
    form_sms.data = form.serialize();
    $.ajax(form_sms);
    show_loader()
}

function resetPassFormValidationCallback(form) {
    var formID = form.attr("id");
    if (typeof form_pass != "object") form_pass = new $.ajax_prototype({
        "url": form.attr("action"),
        "success": function (data) {
            resetPassRequestCallback(data, formID);
            hide_loader()
        },
        "type": "POST"
    }, formID);
    form_pass.data = form.serialize();
    $.ajax(form_pass);
    show_loader()
}

function loginRequestCallback(data, formID) {
    if (data.success == true) if (data.code != error_codes.two_factor_auth) {
        var forms = $("#register-forms");
        if (forms.hasClass("keep_progress")) {
            var progress = {};
            $("#" + forms.attr("data-progress")).find("input:visible, textarea:visible").each(function () {
                var obj = $(this);
                progress[this.name] = this.value
            });
            keep_progress = [JSON.stringify({
                form: forms.attr("data-progress"),
                tab: $(".tab-title.active a").attr("href"),
                values: progress
            })]
        } else {
            if (data.data) loginRedirect = data.data; else loginReload =
                true;
            $.setLoginEventCookie()
        }
    } else $.alertHandler("", data.msg, alert_box_warning); else if (data.success == false) if (data.code == error_codes.account_auto_suspended) {
        account_suspended = true;
        $('[name\x3d"suspendedAccount"]').val($("#email").val());
        $("#passResetLink").on("click", function (e) {
            e.preventDefault()
        });
        $("#accountSuspendedForm").off("submit").submit()
    } else handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function registerRequestCallback(data, formID) {
    if (data.success == true) {
        if (formID.indexOf("step-1") == -1) {
            window.location.href = data.data.url;
            registerReload = true;
            $.setRegisterEventCookie()
        } else {
            $registerSteps.first.hide();
            $registerSteps.second.show().find("input:first").focus();
            $registerSteps.second.find(".error").removeClass("error");
            $registerSteps.second.find(".help-block").remove()
        }
        if (data.data.newsletter_manager.status == true) $(".row.newsletter").hide(); else $(".row.newsletter").show()
    } else if (data.success ==
        false) if (formID.indexOf("step-2") > -1) switch (data.code) {
        case error_codes.validation_error:
            $.each(data.data, function (key, value) {
                firstStepElement = $registerSteps.first.find('[name\x3d"' + key + '"]');
                if (firstStepElement.length) {
                    if ($registerSteps.second.is(":visible")) {
                        $registerSteps.first.show();
                        $registerSteps.second.hide()
                    }
                    firstStepElement.displayIndividualErrors(value)
                } else $registerSteps.second.find('[name\x3d"' + key + '"]').displayIndividualErrors(value)
            });
            break;
        default:
            handleErrors(data, formID)
    } else handleErrors(data,
        formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function reminderOptionsRequestCallback(data, formID) {
    if (data.success == true) {
        if (typeof account_suspended != "undefined" && account_suspended === true) {
            $("#accountSuspendedNotice").show();
            $("#login-contents, #start_over").hide();
            $("#reset-view1,#reset-controller,#remembered,#btn-remind-submit").show()
        }
        $('[name\x3d"method"]:last').val($(".step:visible").attr("data-method"));
        rollBackSteps();
        initializeAvailableSteps(data);
        email = $('#reset-view1 [name\x3d"email"]').val();
        $('#reset-forms [name\x3d"email"], #reset-contents [name\x3d"email"]').val(email);
        $(".email_rep").text(email);
        $("#method-skip-cont").show();
        if (typeof account_suspended != "undefined" && account_suspended === true) $("#btn-method-skip").show(); else $("#start_over, #btn-method-skip").show();
        openNextStep();
        reformFirstVisibleStep(question);
        initializeNextForm()
    } else if (data.success == false) handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function questionRequestCallback(data, formID) {
    if (data.success == true) {
        $('[name\x3d"method"]:last').val($(".step:visible").attr("data-method"));
        $(".step, #btn-method-skip, #tokenReceived").hide();
        $("#reset-view6").show().find("#resetToken").val(data.data.token);
        initializeNextForm()
    } else if (data.success == false) handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function emailRequestCallback(data, formID) {
    if (data.success == true) {
        $('[name\x3d"method"]:last').val($(".step:visible").attr("data-method"));
        $(".step, #btn-method-skip, #tokenReceived").hide();
        $("#reset-view6, .email.panel").show();
        $("#btn-remind-submit .submitText").text(COMMON_LANG.BUTTONS.RESET_SUBMIT);
        initializeNextForm()
    } else if (data.success == false) handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function mobileRequestCallback(data, formID) {
    if (data.success == true) {
        $('[name\x3d"method"]:last').val("mobile");
        $("#tokenReceived, .step, #btn-method-skip").hide();
        $("#reset-view6, .mobile.panel").show();
        $("#btn-remind-submit .submitText").text(COMMON_LANG.BUTTONS.RESET_SUBMIT);
        initializeNextForm()
    } else if (data.success == false) handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function resetPassRequestCallback(data, formID) {
    if (data.success == true) if ($("#remembered_trig").length) $("#resetSuccess").modal_open(); else {
        var success_modal = $("#resetSuccess");
        if (success_modal.length) success_modal.modal_open(); else {
            $.alertHandler(formID, data.msg, alert_box_success);
            $("#remembered_trig_modal").trigger("click");
            $("#accountSuspendedNotice").hide()
        }
        account_suspended = false
    } else if (data.success == false) handleErrors(data, formID); else $.alertHandler(formID, data.msg, alert_box_warning)
}

function rollBackSteps() {
    $(".mob_avail").hide();
    $(".step.available:not(:last)").removeClass("available")
}

function setMobileContents(method, value) {
    if (method.indexOf("mob") > -1) {
        $(".mob_avail").show();
        $(".mobile_rep").text(value.target)
    }
}

function initializeAvailableSteps(data) {
    $(".step[data-method]").each(function () {
        method = $(this).attr("data-method");
        $.each(data.data, function (key, value) {
            if (value.type == method) {
                if ("question" in value) question = value.question;
                $('[data-method\x3d"' + method + '"]').addClass("available");
                setMobileContents(method, value)
            }
        })
    })
}

function openNextStep() {
    $(".step:visible").hide();
    $(".step.available:first").show()
}

function reformFirstVisibleStep(question) {
    $("#remembered").hide();
    $(".step .help-block").remove();
    if ($(".step:visible").is($("#reset-view2"))) {
        var label = $('[for\x3d"answer"]');
        if (label.find("span").length < 1) label.text(question); else label.find("span").text(question);
        $("#btn-method-skip").text(COMMON_LANG.BUTTONS.RESET_ANS_FORGOT).removeClass("button expand warning").addClass("link")
    } else {
        $("#btn-method-skip").text(COMMON_LANG.BUTTONS.RESET_NO_ACCESS);
        $("#btn-remind-submit .submitText").text(COMMON_LANG.BUTTONS.RESET_ACCESS)
    }
}

function initializeNextForm() {
    step = $(".step:visible");
    form = step.find("form");
    if (step.attr("id") == "reset-view6") step.find(".strength-meter").remove();
    if (!form.hasClass("under_validation")) form.prepare_form_advanced(assignCallbackFunction(form));
    if (step.attr("id") == "reset-view5" || step.attr("id") == "reset-view6") $("#start_over").removeClass("positioned-bottom"); else $("#start_over").addClass("positioned-bottom")
}

function hide_loader() {
    $("#btn-remind-submit").find(".submitText").show();
    $("#btn-remind-submit").find(".loading").hide()
}

function show_loader() {
    $("#btn-remind-submit").find(".submitText").hide();
    $("#btn-remind-submit").find(".loading").show()
};
countries = [{"eu": 1, "id": 14, "iso_2": "AT", "name": "Austria", "phone": 43, "vat": "AT", "vat_rate": 1.2}, {
    "eu": 1,
    "id": 21,
    "iso_2": "BE",
    "name": "Belgium",
    "phone": 32,
    "vat": "BE",
    "vat_rate": 1.21
}, {"eu": 1, "id": 32, "iso_2": "BG", "name": "Bulgaria", "phone": 359, "vat": "BG", "vat_rate": 1.2}, {
    "eu": 1,
    "id": 51,
    "iso_2": "HR",
    "name": "Croatia",
    "phone": 385,
    "vat": "HR",
    "vat_rate": 1.25
}, {"eu": 1, "id": 53, "iso_2": "CY", "name": "Cyprus", "phone": 357, "vat": "CY", "vat_rate": 1.19}, {
    "eu": 1, "id": 54, "iso_2": "CZ", "name": "Czech Republic", "phone": 420,
    "vat": "CZ", "vat_rate": 1.21
}, {"eu": 1, "id": 56, "iso_2": "DK", "name": "Denmark", "phone": 45, "vat": "DK", "vat_rate": 1.25}, {
    "eu": 1,
    "id": 65,
    "iso_2": "EE",
    "name": "Estonia",
    "phone": 372,
    "vat": "EE",
    "vat_rate": 1.2
}, {"eu": 1, "id": 70, "iso_2": "FI", "name": "Finland", "phone": 358, "vat": "FI", "vat_rate": 1.24}, {
    "eu": 1,
    "id": 71,
    "iso_2": "FR",
    "name": "France",
    "phone": 33,
    "vat": "FR",
    "vat_rate": 1.2
}, {"eu": 1, "id": 76, "iso_2": "DE", "name": "Germany", "phone": 49, "vat": "DE", "vat_rate": 1.19}, {
    "eu": 1, "id": 79, "iso_2": "GR", "name": "Greece", "phone": 30,
    "vat": "EL", "vat_rate": 1.24
}, {"eu": 1, "id": 91, "iso_2": "HU", "name": "Hungary", "phone": 36, "vat": "HU", "vat_rate": 1.27}, {
    "eu": 1,
    "id": 97,
    "iso_2": "IE",
    "name": "Ireland",
    "phone": 353,
    "vat": "IE",
    "vat_rate": 1.23
}, {"eu": 1, "id": 100, "iso_2": "IT", "name": "Italy", "phone": 39, "vat": "IT", "vat_rate": 1.22}, {
    "eu": 1,
    "id": 111,
    "iso_2": "LV",
    "name": "Latvia",
    "phone": 371,
    "vat": "LV",
    "vat_rate": 1.21
}, {"eu": 1, "id": 117, "iso_2": "LT", "name": "Lithuania", "phone": 370, "vat": "LT", "vat_rate": 1.21}, {
    "eu": 1, "id": 118, "iso_2": "LU", "name": "Luxembourg",
    "phone": 352, "vat": "LU", "vat_rate": 1.17
}, {"eu": 1, "id": 126, "iso_2": "MT", "name": "Malta", "phone": 356, "vat": "MT", "vat_rate": 1.18}, {
    "eu": 1,
    "id": 143,
    "iso_2": "NL",
    "name": "Netherlands",
    "phone": 31,
    "vat": "NL",
    "vat_rate": 1.21
}, {"eu": 1, "id": 164, "iso_2": "PL", "name": "Poland", "phone": 48, "vat": "PL", "vat_rate": 1.23}, {
    "eu": 1,
    "id": 165,
    "iso_2": "PT",
    "name": "Portugal",
    "phone": 351,
    "vat": "PT",
    "vat_rate": 1.23
}, {"eu": 1, "id": 169, "iso_2": "RO", "name": "Romania", "phone": 40, "vat": "RO", "vat_rate": 1.2}, {
    "eu": 1, "id": 188, "iso_2": "SK",
    "name": "Slovakia", "phone": 421, "vat": "SK", "vat_rate": 1.2
}, {"eu": 1, "id": 189, "iso_2": "SI", "name": "Slovenia", "phone": 386, "vat": "SI", "vat_rate": 1.22}, {
    "eu": 1,
    "id": 194,
    "iso_2": "ES",
    "name": "Spain",
    "phone": 34,
    "vat": "ES",
    "vat_rate": 1.21
}, {"eu": 1, "id": 199, "iso_2": "SE", "name": "Sweden", "phone": 46, "vat": "SE", "vat_rate": 1.25}, {
    "eu": 1,
    "id": 219,
    "iso_2": "GB",
    "name": "United Kingdom",
    "phone": 44,
    "vat": "GB",
    "vat_rate": 1.2
}];
