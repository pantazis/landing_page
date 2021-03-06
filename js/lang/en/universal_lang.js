var APP_LANG    = {
    'MESSAGES'                  : {
        'SOMETHING_GOES_WRONG'      : "Something went wrong. Please try again later.",
        'TIMEOUT'                   : "There was no response from the server. Please try again.",
        'TIMEOUT_UNRECOVERABLE'     : {
            'TITLE'     : 'No server response',
            'CONTENT'   : 'There seems to be a network connection issue. Please click <a href="#" id="reloadbtn">here</a> to reload the page.'
        },
        'HTTP_ERROR'                : {
            400 : 'Http error: <strong>400</strong>',
            404 : 'We could not recognise the action you performed',
            429 : 'You performed too many requests',
            500 : 'Something went wrong. Please try again later.',
            503 : 'This service is temporally unavailable. Please try again later.'
        },
        'ERROR'                     : "There was an application error.",
        'RESPONSIVE_TABLES_ERROR'   : 'Due to technical reasons it was impossible to complete the action you requested. Please <a href="#" id="reloadbtn">click here</a> to refresh or try later'
    },
    'STATE_INPUT_PLACEHOLDER'   : "Your state",
    'RESULTS_FOUND'             : {
        'result_found'        : '<span>1</span> result found',
        'results_found'       : '<span>%%results%%</span> results found.',
        'no_results_found'    : '<span>0</span> results found.'
    },
    'RESP_TABLE_ACTIONS'        : {
        'actions'           : 'ACTIONS',
        'edit'              : 'Edit',
        'delete'            : 'Delete',
        'manage'            : 'Manage',
        'set_as_default'    : 'Set as default',
        'default'           : 'Default'
    },
    'STATUSES'                  : {
        'active'    : 'ACTIVE',
        'inactive'  : 'INACTIVE',
        'deleted'   : 'DELETED'
    },
    'TOOLTIPS'                  : {
        'default_profile_admin' : 'This is the default profile of this user',
    },
    'MISC'                      : {
        'ERROR'             : 'Error',
        'REMOVE'            : 'Remove',
        'INTERNATIONAL'     : 'International',
        'DOMAIN_EXPIRATION' : 'Domain Expiration',
        'OFFER'             : 'Offers',
        'SYSTEM'            : 'System Notification',
    }
};

var COMMON_LANG = {
    LENGTH          : {
        'MONTH': 'month',
        'MONTHS': 'months',
        'YEAR': 'year',
        'YEARS': 'years'
    },
    COUNTRIES       : {
        'GB': 'United Kingdom',
        'AT': 'Austria',
        'BE': 'Belgium',
        'BG': 'Bulgaria',
        'FR': 'France',
        'DE': 'Germany',
        'DK': 'Denmark',
        'CH': 'Switzerland',
        'GR': 'Greece',
        'EE': 'Esthonia',
        'IE': 'Ireland',
        'ES': 'Spain',
        'IT': 'Italy',
        'HR': 'Croatia',
        'CY': 'Cyprus',
        'LV': 'Latvia',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'MT': 'Malta',
        'NL': 'Netherlands',
        'HU': 'Hungary',
        'UA': 'Ukraine',
        'PL': 'Poland',
        'PT': 'Portugal',
        'RO': 'Romania',
        'SK': 'Slovakia',
        'SI': 'Slovenia',
        'SE': 'Sweden',
        'CZ': 'Czech Republic',
        'FI': 'Finland',
        'OTHER': 'Other country'
    },
    SIDE_NAV        : {
        'ACCOUNT': 'Account',
        'CART': 'Cart',
        'SUPPORT': 'Support',
        'LANG': 'Language',
        'TAB_NAME': 'Price settings',
        'VAT_TEMPLATES': {
            'WITHOUT': {
                'TEXT': 'Prices without VAT',
                'TITLE': 'Remove VAT'
            },
            'WITH': {
                'TEXT': 'Prices with VAT',
                'TITLE': 'Add VAT'
            }
        },
        'SELECTED_VAT': 'Selected VAT',
        'CHANGE_VAT': 'Change country VAT'
    },
    VAT             : {
        'DISCLAIMER': {
            'VAT_ON'    : 'Prices include VAT ##VAT##%.',
            'VAT_OFF'   : 'Prices do not include VAT.',
            // Andreas 03/07/2019
            'VAT_ON_2': 'w. VAT',
            'VAT_OFF_2': '+ VAT'
            // Andreas end
        }
    },
    BUTTONS         : {
        CANCEL : 'cancel',
        RESET_START : 'Proceed',
        RESET_ACCESS : 'Yes',
        RESET_SUBMIT : 'Submit',
        RESET_CONTINUE : 'Continue',
        RESET_NO_ACCESS : 'No',
        RESET_ANS_FORGOT : 'Forgot my answers',
        LOGIN : 'Login',
        REGISTER : 'Register',
    },
    LABEL           : {
        'VERIFIED'      : 'VERIFIED',
        'UNVERIFIED'    : 'UNVERIFIED',
    },
    CONFIRMS        : {
        USER_STATUS :{
            ACTIVE : 'Are you sure you want to suspend %%USERNAME%%?',
            SUSPEND : 'Are you sure you want to activate %%USERNAME%%?'
        }
    },
    STATUS          : {
        ENABLE : 'Enable',
        DISABLE : 'Disable'
    },
    CONNECTIVITY    : {
        PENDING_RESPONSE : 'Pending response'
    },
    CART            : {
        HARDWARE                    : 'Hardware',
        SOFTWARE                    : 'Software',
        MANAGEMENT                  : 'Management',
        NETWORK                     : 'Network',
        HOSTNAME                    : 'Host name',
        CPU                         : 'Επεξεργαστής',
        ADDITIONAL_CPU              : 'Additional CPU',
        RAM                         : 'RAM',
        ADDITIONAL_RAM              : 'Additional RAM',
        RAM_SEMIDEDI                : 'RAM',
        HDD                         : 'Δίσκοι',
        BACKUP                      : 'Backup (μέσω FTP)',
        STORAGE_BOX                 : 'Storage Box',
        OS                          : 'Λειτουργικό',
        CP_DEDICATED                : 'Πίνακας ελέγχου',
        CP_VPS                      : 'Πίνακας ελέγχου',
        WEB_SERVER                  : 'Εξυπηρετητής',
        RAID                        : 'RAID',
        BANDWIDTH                   : 'Bandwidth',
        IPV4                        : 'Ιδιωτική IPv4',
        MANUFACTURER                : 'Manufacturer',
        GPU                         : 'GPU',
        DATACENTER                  : 'Datacenter',
        REMOTE_CONSOLE              : 'Remote console',
        DDOS_PROTECTION             : 'DDOS protection',
        SUPPORT                     : 'Support',
        TRAFFIC                     : 'Traffic',
        BANDWIDTH_DEDI              : 'Bandwidth',
        TRAFFIC_DEDI                : 'Traffic',
        NET_PORTS                   : 'Network Ports',
        MISC                        : {
            CHANGE      : 'Αλλαγή',
            ADDITION    : 'Προσθήκη'
        },
        IN_CART                     : 'In cart',
        BUY_SERVICE                 : 'Add to cart',
        RENEW                       : 'Renew',
        ORDER                       : 'Add to cart',
        ORDER_SSL                   : 'Order a new SSL',
        TRAFIC                      : 'Traffic',
        IO                          : 'I/O',
        ENTRY_PROCESSES             : 'Entry Processes',
        EXCLUSIVE_IP_SEMIDEDI       : 'Dedicated IP',
        LITEMAGE                    : 'Caching Option',
        DOMAIN_NAME                 : 'Domain name',
    },
    DOMAINS         : {
        TRANSFER                    : {
            UNDER_PROCESS       : 'Domain is under process',
            SUCCESSFUL_PROCESS  : 'Domain was transferred successfully to Dnhost'
        },
        RENEW                       : 'Renew Domain',
        EMPTY_NS                    : 'All servers will be deleted from registry',
        EMPTY_NS_CUSTOM_EXCLUDED    : 'All servers will be deleted from registry, except of custom nameservers',
        WHOIS                       : {
            EXTEND  : 'Add more years to ID Protect'
        },
        TRADE                       : {
            APPLICATION : {
                BUTTON : {
                    FORTH   : 'Add to cart',
                    OTHERS  : 'Domain owner change'
                }
            }
        }
    },
    MISC            : {
        TODAY   : 'Today',
        CANCEL  : 'Cancel',
        RETURN  : 'Go back'
    },
    RESP_TABLE      : {
        RENEW       : 'Renew'
    }
};

var TRANS       = {
    LENGTH      : {
        'MONTH': {
            1 : 'month',
            2 : 'months'
        },
        'YEAR': {
            1 : 'year',
            2 : 'years'
        }
    },
    BILLING     : {
        TYPE    : {
            REC : 'Receipt',
            INV : 'Invoice'
        },
        STATUS  : {
            SUCCESS : 'ACTIVE',
            ERROR   : 'INACTIVE'
        },
        VAT     : 'VAT',
        DOY     : 'Tax office',
        FROM    : '(from ##price##)'
    },
    CART        : {
        DOMAIN_TRANSFER_SUCCESSFUL  : {
            1 : 'Added to cart',
            2 : 'All domains added to cart'
        },
        ATTRIBUTES                  : {
            SSL_INSTALL : {
                DOMAIN_NAME : 'You must fill in the Domain name where the SSL will be installed'
            }
        },
        WARNINGS                    : {
            HOSTING : '<strong>Attention!</strong> This order is only for a new hosting plan. For renewal or upgrade please see <a href="https://dnhost.gr/kb/article/AA-00718" target="_blank">here</a>.'
        },
        RGP_SETUP_FEE               : 'RGP fee',
        BUY_ACTION                  : 'Add to cart'
    },
    DOMAINS     : {
        NAMESERVER                  : {
            1 : 'Nameserver',
            2 : 'Nameservers'
        },
        CONTACT_ROLES               : {
            REGISTRANT  : {
                DISPLAY : 'Owner',
                FORM    : {
                    1 : 'Owner',
                    2 : 'Owner'
                }
            },
            ADMIN       : {
                DISPLAY : 'Administrator',
                FORM    : {
                    1 : 'Administrator',
                    2 : 'Administrator'
                }
            },
            TECH        : {
                DISPLAY : 'Technical',
                FORM    : {
                    1 : 'Technical',
                    2 : 'Technical'
                }
            },
            BILLING     : {
                DISPLAY : 'Billing',
                FORM    : {
                    1 : 'Billing',
                    2 : 'Billing'
                }
            }
        },
        RESPONSIVE_TABLES_PREVIEW   : {
            REGISTERED  : {
                1 : 'REGISTERED DOMAIN',
                2 : 'REGISTERED DOMAINS'
            },
            EXPIRES     : {
                1 : 'EXPIRES SOON',
                2 : 'EXPIRING SOON'
            },
            EXPIRED     : {
                1 : 'HAS EXPIRED',
                2 : 'HAVE EXPIRED'
            },
            ID_PROTECT  : {
                TITLE   : {
                    ON  : 'Domain is ID Protected',
                    NA  : 'ID Protect not applicable'
                }
            }
        },
        INTERNAL_TRANSFER           : {
            SINGLE_DOMAIN       : 'The transfer of <strong>##domain##</strong> to user <strong>##user##</strong> completed successfully.',
            MULTIPLE_DOMAINS    : 'The transfer of domains to user <strong>##user##</strong> completed successfully.',
            PASSED_INSPECTION   : 'Domain is ready for transfer'
        },
        SEARCHBAR                   : {
            MODE    : {
                SEARCH          : 'SEARCH',
                SEARCH_TITLE    : 'Find your perfect domain',
                SEARCH_PH       : 'Find your perfect domain',
                TRANSFER        : 'TRANSFER',
                TRANSFER_TITLE  : 'Transfer your domains to Dnhost',
                TRANSFER_PH     : 'Transfer your domain to DNHOST'
            }
        },
        SEARCH                      : {
            FILTERS : {
                ALL : 'All'
            },
            ELNOTIFICATIONS : {
                SINGLEDOMAIN : '<li>Αν <strong>είσαι ο κάτοχος</strong> του ##transfer## και θες να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της <a class="terms-link" href="https://www.eett.gr/opencms/opencms/EETT_EN/index.html">ΕΕΤΤ</a>, θα πρέπει πρώτα να μεταφέρεις το  ##transfer## στην DNHOST. <a href="##route##" target="_blank" title="Μεταφορά Domain στην DNHOST" class="grFamilyTransferInit simple-link more-margin">Μετέφερέ το<i class="icon-arrow-right22"></i></a></li><li>Αν <strong>δεν είσαι ο κάτοχος</strong> του ##transfer## και θες να κατοχυρώσεις το ##domain##, τότε επίλεξε την αυτόματη κατοχύρωση του .ελ, ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν <a class="terms-link" href="##termsRoute##" title="Όροι κατοχύρωσης .ελ domains" target="_blank">όροι και προϋποθέσεις</a>.</li>',
                MULTIDOMAIN : '<li>Αν <strong>είσαι ο κάτοχος</strong> ενός εκ των παρακάτω .gr domains και θέλεις να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της <a class="terms-link" href="https://www.eett.gr/opencms/opencms/EETT_EN/index.html">ΕΕΤΤ</a>, θα πρέπει πρώτα να μεταφέρεις στην DNHOST κάποιο από τα:<div id="grFamilyTransferSelectableContainer" class="hidden"><div class="for-el-backorder"><div class="row collapse">##domains##</div><div><a id="grFamilyMultiDomainTransferBtn" href="##route##" target="_blank" title="Μεταφορά Domain στην DNHOST" class="grFamilyTransferInit simple-link more-margin" style="visibility: hidden">Μεταφορά<i class="icon-arrow-right22"></i></a></div></div></div></div></li><li>Αν <strong>δεν είσαι ο κάτοχος</strong> κανενός εκ των παραπάνω .gr domains και θέλεις να κατοχυρώσεις το ##domain## τότε μπορείς να επιλέξεις την αυτόματη κατοχύρωση ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν <a class="terms-link" href="##termsRoute##" title="Όροι κατοχύρωσης .ελ domains" target="_blank">όροι και προϋποθέσεις</a>.</li>'
            },
            BUTTONS : {
                CHECKING : 'Checking'
            }
        },
        WARNINGS                    : {
            ELCOPYRIGHT : 'To register this .ελ domain in DNHOST, the corresponding .gr domain must be in your DNHOST account.\n'
        }
    },
    SSL         : {
        BUTTONS         : {
            GET_CERTIFICATE : 'Get Certificate',
            REISSUE         : 'Reissue',
            RENEW           : 'Renew',
            CANCEL          : 'Cancel'
        },
        STATUSES        : {
            CANCELLED   : 'Cancelled',
            CAPS        : {
                ACTIVE      : 'ACTIVE',
                INACTIVE    : 'INACTIVE',
                PENDING     : 'PENDING',
                CANCELLED   : 'CANCELLED',
                EXPIRED     : 'EXPIRED'
            }
        },
        ENROLLMENT      : {
            VALIDATION  : {
                INVALID_APPROVER_EMAIL : 'Invalid email',
                MISSING_APPROVER_EMAIL : {
                    1 : 'You have to set email for domain "##domain##"',
                    2 : 'You have to set emails for domains: ##domain##'
                }
            }
        },
        DETAILS         : {
            REFUND  : {
                SUCCESS   : 'REFUNDED',
                FAILED    : 'REFUND REJECTED',
                PENDING   : 'REFUND PROCESSING'
            }
        },
        ORDER_SSL_MODAL : {
            INITIAL     : 'Initial',
            DISCOUNT    : 'Discount',
            FINAL       : 'Final'
        },
        WHYNOPADLOCK    : {
            DOMAINNAME      : 'Όνομα τομέα:',
            IPADDRESS       : 'IP διεύθυνση:',
            URLTESTED       : 'URL ελέγχου:',
            LINENUMBERS     : 'Αριθμός γραμμής',
            ISSUES          : 'Βρέθηκαν ##count## σφάλματα',
            INSECURELINK    : {
                1 : 'Ανασφαλείς σύνδεσμος',
                2 : 'Ανασφαλείς σύνδεσμοι'
            },
            NOERRORS        : 'Όλα τα αντικείμενα της σελίδας καλούνται επιτυχώς σε https!',
            FOUNDIN         : 'Βρέθηκε στο',
        },
        CSRDECODER      : {
            COMMONNAME          : 'Common Name',
            ORGANIZATIONNAME    : 'Organization Name',
            ORGANIZATIONUNIT    : 'Organization Unit',
            LOCALITY            : 'Locality',
            STATE               : 'State',
            COUNTRY             : 'Country',
            EMAIL               : 'Email',
            KEYSIZE             : 'Key Size'
        }
    },
    HOSTING     : {
        MAGENTO : {
            SHOWGRAPHS : {
                OPEN : 'See the comparative graphs <i class="icon-arrow-down2"></i>',
                CLOSE : 'Close the comparative graphs <i class="icon-arrow-up2"></i>'
            }
        },
        CREATE  : {
            SKUAVAILABILITY                 : 'Τo επιθυμιτό SKU είναι διαθέσιμο.',
            ATTRIBUTES_NAME_AVAILABILITY    : 'Τo επιθυμιτό Attribute Name είναι διαθέσιμο.'
        }
    },
    DOCUMENTS   : {
        CREDITS             : {
            CANCELLED : 'CANCELLED'
        },
        DEBITS              : {
            ORDER : {
                EDIT : {
                    SUCCESS : 'Order edit was successful',
                    FAILURE : {
                        EDITS_INVALID_LENGTH    : 'Invalid requested length',
                        DEL_NOT_FOUND           : 'Item does not exist in order, can be deleted'
                    }
                }
            }
        },
        TABS                : {
            PAY_DOCUMENTS   : {
                1 : 'Pay Document (##count##)',
                2 : 'Pay Documents (##count##)'
            },
            PAYMENTS        : {
                USED_TO_PAY_DOCUMENT  : {
                    1   : 'Used by (##count##)',
                    2   : 'Used by (##count##)'
                },
                PAID_BY_DOCUMENTS     : {
                    1   : 'Paid By (##count##)',
                    2   : 'Paid By (##count##)'
                }
            },
            PAY_WITH        : {
                1 : 'Pay With Document (:count)',
                2 : 'Pay With Documents (:count)'
            },
            ASSOCIATED      : {
                1 : 'Συσχετισμένη κίνηση (##count##)',
                2 : 'Συσχετισμένες κινήσεις (##count##)'
            }
        },
        PAYMENTS            : {
            STATUS_HEADER   : {
                BANK    : 'Πληρωμή μέσω τράπεζας'
            },
            STATUS          : {
                PENDING : 'Σε αναμονή εξόφλησης'
            },
            MSG             : {
                PENDING : 'ΠΕΡΙΜΕΝΟΥΜΕ ΤΗΝ ΠΛΗΡΩΜΗ ΣΟΥ'
            },
            BANK_NOTICE     : {
                PENDING     : 'Μπορείς να πληρώσεις εδώ'
            }
        },
        STATUSES            : {
            OPEN                  : 'OPEN',
            ON_PAYMENT            : 'ON PAYMENT',
            PAID                  : 'PAID',
            PENDING               : 'PENDING',
            COMPLETED             : 'COMPLETED',
            REFUNDED              : 'REFUNDED',
            PARTIALLY_REFUNDED    : 'PARTIALLY REFUNDED',
            CANCELLED             : 'CANCELLED',
            ERROR                 : 'ERROR',
            OVERDUE               : 'OVERDUE',
            DECLINED              : 'DECLINED'
        },
        LEGAL_DOCUMENTS     : {
            TITLE   : {
                1 : 'Legal Document (##count##)',
                2 : 'Legal Documents (##count##)'
            },
            TYPES   : {
                INVOICE : 'Invoice',
                RECEIPT : 'Receipt'
            }
        }
    },
    FILE_MANAGE : {
        REMOVE      : 'Remove file',
        DOWNLOAD    : 'Download file'
    },
    MENU        : {
        MAIN    : {
            ADMIN   : {
                DOMAIN_LIST     : 'All domains',
                HOSTING_LIST    : 'All hosting'
            }
        },
        STATIC  : {
            TITLE : 'SITE NAVIGATION'
        }
    },
    WHOIS       : {
        MODAL : {
            TITLE : '##domain## - WHOIS DOMAIN'
        }
    },
    COUPONS     : {
        CREATE : {
            ALL_USERS : 'All',
            STATUS  : {
                ACTIVE  : 'ΕΝΕΡΓΟ',
                WARNING : 'ΣΕ ΑΝΑΜΟΝΗ'
            }
        }
    },
    GDPR        : {
        REQUEST_ARCHIVE         : 'Ζήτησε μας τις πληροφορίες σου',
        ARCHIVE_READY           : 'Το αρχείο με τις πληροφορίες σου είναι έτοιμο',
        ARCHIVE_BUTTONS         : {
            STEP_2 : 'Επαλήθευση κωδικού',
            STEP_3 : 'Λήψη αρχείου'
        },
        VALIDATE_AND_DOWNLOAD   : 'Βάλε τον κωδικό σου και κατεβασε',
        LOGIN   : {
            EXPLANATION_TITLE               : 'Στα πλαίσια της συμμόρφωσης μας με τον Γενικό Κανονισμό Προστασίας Προσωπικών Δεδομένων θα χρειαστεί να αποδεχθείς τους παρακάτω όρους προκειμένου να χρησιμοποιείς τις υπηρεσίες μας.',
            EXPLANATION                     : '<p class="smaller small-font no-margin-bottom"><strong>Ποια προσωπικά δεδομένα ζητάμε;</strong></p>' +
            '<p class="smaller small-font">Ονοματεπώνυμο, οργανισμός, τηλέφωνο, διεύθυνση, χώρα, email, επάγγελμα, ΑΦΜ, ΔΟΥ, IP διεύθυνση σύνδεσης.</p>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Γιατί θέλουμε τα προσωπικά σου δεδομένα;</strong></p>' +
            '<p class="smaller small-font">Είναι απαραίτητα για να σου παρέχουμε τις υπηρεσίες κατοχύρωσης ονομάτων χώρου, φιλοξενίας ιστοσελίδων & email, έκδοσης πιστοποιητικών SSL και για την παροχή τεχνικής υποστήριξης, την εξυπηρέτηση και την τιμολόγηση σου.</p>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Τι κάνουμε με τα προσωπικά σου δεδομένα</strong></p>' +
            '<p class="smaller small-font">Τα αποθηκεύουμε στην κεντρική βάση δεδομένων πελατών μας, προστατεύοντάς τα με υψηλά μέτρα ασφαλείας και περιορισμού πρόσβασης σε αυτά μόνο από εξουσιοδημένα πρόσωπα.</p>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Με ποιους και γιατί θέλουμε να μοιραστούμε τα προσωπικά σου δεδομένα;</strong></p>' +
            '<p class="smaller small-font">Κοινοποιούμε τα προσωπικά δεδομένα μόνο με όσους τρίτους Οργανισμούς είναι απολύτως απαραίτητο για την παροχή της υπηρεσίας που θα αποκτήσεις: </p>' +
            '<ul class="small-font" style="font-size: 0.925rem">' +
            '<li>Κατοχύρωση domain names: Στα Μητρώα Ονομάτων Χώρου για την τήρηση της βάσης δεδομένων τους (εντός και εκτός Ε.Ε.).</li>' +
            '<li>Φιλοξενία ιστοσελίδων: Σε κανένα τρίτο οργανισμό, εξαιρετικά σπάνια ενδέχεται κάποιος τρίτος τεχνικός να έχει περιορισμένη κι ελεγχόμενη πρόσβαση για την επίλυση προβλημάτων με λογισμικό τρίτων κατασκευαστών (πχ Plesk).</li>' +
            '<li>Έκδοση SSL: Στις αρχές έκδοσης SSL για την τήρηση της βάσης δεδομένων τους και τη διενέργεια των απαιτούμενων ελέγχων επικύρωσης στοιχείων (εντός και εκτός Ε.Ε.).</li>' +
            '<li>Στο λογιστικό μας γραφείο (εφόσον έχουμε εκδόσει ονομαστικό παραστατικό σε ιδιώτη ή ελεύθερο επαγγελματία) για την τήρηση των βιβλίων μας και τις καταχωρήσεις των σχετικών λογιστικών εγγραφών.</li>' +
            '</ul>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Γιατί θέλουμε να μεταδώσουμε τα προσωπικά σου δεδομένα εκτός Ελλάδας και ΕΕ</strong></p>' +
            '<p class="smaller small-font">Διότι είναι απολύτως απαραίτητο για την παροχή των υπηρεσιών κατοχύρωσης ονομάτων χώρου (για συγκεκριμένες καταλήξεις/gTLDs: .com, .net κτλ) και έκδοσης ψηφιακών πιστοποιητικών ασφαλείας (SSL).</p>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Μπορείς να αποσύρεις την άδειά σου</strong></p>' +
            '<p class="smaller small-font">Όλα τα δεδομένα σου είναι προγραμματισμένα να διαγράφονται αυτόματα από τα συστήματά μας, όταν η αντίστοιχη υπηρεσία σου μαζί μας λήξει ή έχει μεταφερθεί σε άλλο πάροχο. </p>' +
            '<p class="smaller small-font no-margin-bottom"><strong>Για πόσο χρόνο διατηρούμε τα προσωπικά σου δεδομένα</strong></p>' +
            '<p class="smaller small-font">Μόνο για το χρόνο που είναι απολύτως απαραίτητος για την παροχή των υπηρεσιών μας. Τα δεδομένα διαγράφονται από τα συστήματα της DNHOST και των τρίτων, μετά την οριστική διακοπή της υπηρεσίας.</p>'+
            '<hr><br>',
            PROCESSING_APPROVAL_LABEL           : 'Δίνω τη ρητή συγκατάθεσή μου στην DNHOST να χρησιμοποιήσει τα προσωπικά δεδομένα μου (και τυχόν δεδομένα τρίτων, για λογαριασμό των οποίων ενεργώ), σύμφωνα με τα παραπάνω.',
            PROCESSING_APPROVAL_LABEL_ERROR     : 'Για τη συνέχιση χρήσης των υπηρεσιών μας πρέπει να συμφωνήσεις στη νόμιμη επεξεργασία των δεδομένων σου',
            DATA_VALIDITY_LABEL                 : 'Δηλώνω υπευθύνως σύμφωνα με το νόμο 1599/86, ότι τα στοιχεία που δηλώνω είναι αληθή και ακριβή και δεν παραβιάζω εν γνώσει μου δικαιώματα τρίτων.',
            DATA_VALIDITY_LABEL_ERROR           : 'Για τη συνέχιση χρήσης των υπηρεσιών μας πρέπει να να επιβεβαιώσεις την ορθότητα των στοχείων σου.',
            COMMUNICATION_AGREEMENT_LABEL       : 'Συμφωνώ στη λήψη email και τηλεφωνικών κλήσεων για τεχνική υποστήριξη και σημαντικές ενημερώσεις σχετικά με τις υπηρεσίες που χρησιμοποιώ.',
            COMMUNICATION_AGREEMENT_LABEL_ERROR : '',
            NEWSLETTER_LABEL                    : 'Θέλω να λαμβάνω email σχετικά με τα εταιρικά νέα, τα προϊόντα και ειδικές προσφορές σας.',
            ACCEPT_ALL_ABOVE_LABEL              : 'Αποδέχομαι τα παραπάνω',
            ACCEPT_ALL_ABOVE_LABEL_ERROR        : 'You should agree with the terms'
        },
        NEWSLETTER : {
            DISABLE                 : 'You were successfully unsubscribed from our newsletter.',
            ENABLE                  : 'Check your inbox to confirm your email subscription to our newsletter.',
            ENABLE_2                : 'Your subscription to our newsletter was successful.',
            RESEND                  : 'Confirmation email was sent successfully.',
            ACCOUNT_CONFIRM_MODAL   : {
                DISABLE : {
                    TITLE   : 'Unsubscribe Confirmation',
                    BODY    : 'Do you want to unsubscribe from our newsletter? Please confirm your unsubscription by clicking submit.'
                },
                ENABLE  : {
                    TITLE   : 'Confirm subscription',
                    BODY    : 'Do you want to subscribe to our newsletter? Please confirm your subscription by clicking submit button.'
                }
            }
        }
    },
    PRICING     : {
        MONTHLY_FEE_TITLE   : 'Monthly fee',
        SETUP_FEE           : 'Setup fee',
    },
    MISC        : {
        TABLES                      : {
            NO_RESULTS : 'No results'
        },
        SETUP_FEE                   : 'Setup fee',
        DASHBOARD                   : 'Dashboard',
        SIDR_MENU_TITLE             : 'MANAGE SERVICES',
        AMOUNT                      : 'Amount',
        PERCENTAGE                  : 'Percentage',
        DATES                       : {
            DAYS    : 'Days',
            HOURS   : 'Hours',
            MINUTES : 'Minutes',
            SECONDS : 'Seconds'
        },
        CLIPBOARD_COPIED            : 'This "##text##" was added to your clipboard.',
        DOWNLOAD                    : 'Download',
        LOGIN                       : 'Login',
        ACCEPTANCE                  : 'Accept',
        STATUSES                    : {
            ACTIVE          : 'ACTIVE',
            ACTIVE_FEMALE   : 'ACTIVE',
            INACTIVE        : 'INACTIVE',
            INACTIVE_FEMALE : 'INACTIVE',
            DELETED         : 'DELETED',
            DELETE_FEMALE   : 'DELETED',
            PENDING         : 'PENDING',
            CANCELLED       : 'CANCELLED',
            COMPLETED       : 'COMPLETED',
            PROCESSING      : 'PROCESSING'
        },
        UNAVAILABLE_SKU             : 'The SKU:##sku## is not available.',
        UNAVAILABLE_ATTRIBUTE_NAME  : 'The name:##name## is not available.',
        STORAGE_TYPE                : {
            SSD     : 'SSD',
            NVME    : 'NVMe',
            HDD     : 'HDD',
        }
    }
};