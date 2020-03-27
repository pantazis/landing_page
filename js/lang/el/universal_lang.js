var APP_LANG    = {
    'MESSAGES'                  : {
        'SOMETHING_GOES_WRONG'      : "Παρουσιάστηκε σφάλμα, ξαναδοκίμασε σε λίγο.",
        'TIMEOUT'                   : "Συνέβη ένα απροσδόκητο σφάλμα στη σύνδεση. Παρακαλώ δοκίμασε πάλι σε λίγο.",
        'TIMEOUT_UNRECOVERABLE'     : {
            'TITLE'     : 'Σφάλμα σύνδεσης',
            'CONTENT'   : 'Υπάρχει μια καθυστέρηση στη σύνδεση του δικτύου. Παρακαλώ <a href="#" id="reloadbtn">πάτησε εδώ</a> για ανανέωση της σελίδας.'
        },
        'HTTP_ERROR'                : {
            400 : 'Σφάλμα Http: <strong>400</strong>',
            404 : 'Δεν αναγνωρίσαμε την ενέργεια που εκτέλεσες',
            429 : 'Εκτέλεσες πάρα πολλά αιτήματα',
            500 : 'Κάτι δεν πήγε καλά. Ξαναδοκίμασε σε λίγο.',
            503 : 'Η υπηρεσία δεν είναι προσωρινά διαθέσιμη.Ξαναδοκίμασε σε λίγο.'
        },
        'ERROR'                     : "Παρουσιάστηκε ένα σφάλμα στην εφαρμογή.",
        'RESPONSIVE_TABLES_ERROR'   : 'Για τεχνικούς λόγους ήταν αδύνατον να πραγματοποιήσουμε την ενέργεια που ζήτησες. Παρακαλώ δοκίμασε αργότερα ή <a href="#" id="reloadbtn">πάτησε εδώ</a> για ανανέωση'
    },
    'STATE_INPUT_PLACEHOLDER'   : "Ο νομός σου",
    'RESULTS_FOUND'             : {
        'result_found'        : 'Βρήκαμε <span>1</span> αποτέλεσμα',
        'results_found'       : 'Βρήκαμε <span>%%results%%</span> αποτελέσματα ',
        'no_results_found'    : 'Βρήκαμε <span>0</span> αποτελέσματα'
    },
    'RESP_TABLE_ACTIONS'        : {
        'actions'           : 'Ενέργειες',
        'edit'              : 'Αλλαγή',
        'delete'            : 'Διαγραφή',
        'manage'            : 'Διαχείριση',
        'set_as_default'    : 'Προεπιλογή',
        'default'           : 'Προεπιλεγμένο'
    },
    'STATUSES'                  : {
        'active'    : 'ΕΝΕΡΓΟ',
        'inactive'  : 'ΑΝΕΝΕΡΓΟ',
        'deleted'   : 'ΔΙΕΓΡΑΜΜΕΝΟ'
    },
    'TOOLTIPS'                  : {
        'default_profile_admin' : 'This is the user`s default profile',
    },
    'MISC'                      : {
        'ERROR'             : 'Σφάλμα',
        'REMOVE'            : 'Αφαίρεση',
        'INTERNATIONAL'     : 'Διεθνές',
        'DOMAIN_EXPIRATION' : 'Ημερομηνία λήξης domain',
        'OFFER'             : 'Προσφορές',
        'SYSTEM'            : 'Ειδοποίηση συστήματος',
    }
};

var COMMON_LANG = {
    LENGTH          : {
        'MONTH': 'μήνα',
        'MONTHS': 'μήνες',
        'YEAR': 'έτος',
        'YEARS': 'έτη'
    },
    COUNTRIES       : {
        'GB': 'Αγγλία',
        'AT': 'Αυστρία',
        'BE': 'Βέλγιο',
        'BG': 'Βουλγαρία',
        'FR': 'Γαλλία',
        'DE': 'Γερμανία',
        'DK': 'Δανία',
        'CH': 'Ελβετία',
        'GR': 'Ελλάδα',
        'EE': 'Εσθονία',
        'IE': 'Ιρλανδία',
        'ES': 'Ισπανία',
        'IT': 'Ιταλία',
        'HR': 'Κροατία',
        'CY': 'Κύπρος',
        'LV': 'Λετονία',
        'LT': 'Λιθουανία',
        'LU': 'Λουξεμβούργο',
        'MT': 'Μάλτα',
        'NL': 'Ολλανδία',
        'HU': 'Ουγγαρία',
        'UA': 'Ουκρανία',
        'PL': 'Πολωνία',
        'PT': 'Πορτογαλία',
        'RO': 'Ρουμανία',
        'SK': 'Σλοβακία',
        'SI': 'Σλοβενία',
        'SE': 'Σουηδία',
        'CZ': 'Τσεχία',
        'FI': 'Φινλανδία',
        'OTHER': 'Άλλες χώρες'
    },
    SIDE_NAV        : {
        'ACCOUNT': 'Λογαριασμός',
        'CART': 'Καλάθι',
        'SUPPORT': 'Υποστήριξη',
        'LANG': 'Γλώσσα',
        'TAB_NAME': 'Ρυθμίσεις Τιμών',
        'VAT_TEMPLATES': {
            'WITHOUT': {
                'TEXT': 'Τιμές χωρίς ΦΠΑ',
                'TITLE': 'Αφαίρεση ΦΠΑ'
            },
            'WITH': {
                'TEXT': 'Τιμές με ΦΠΑ',
                'TITLE': 'Προσθήκη ΦΠΑ'
            }
        },
        'SELECTED_VAT': 'Επιλεγμένος ΦΠΑ',
        'CHANGE_VAT': 'Αλλαγή χώρας ΦΠΑ'
    },
    VAT             : {
        'DISCLAIMER': {
            'VAT_ON': 'Οι τιμές περιέχουν ΦΠΑ ##VAT##%.',
            'VAT_OFF': 'Οι τιμές δεν περιέχουν ΦΠΑ.',
            // Andreas 20/06/2019
            'VAT_ON_2': 'με ΦΠΑ',
            'VAT_OFF_2': '+ ΦΠΑ'
            // Andreas end
        }
    },
    BUTTONS         : {
        CANCEL : 'Ακύρωση',
        RESET_START : 'Προχώρησε',
        RESET_ACCESS : 'Ναι',
        RESET_SUBMIT : 'Υποβολή',
        RESET_CONTINUE : 'Συνέχεια',
        RESET_NO_ACCESS : 'Όχι',
        RESET_ANS_FORGOT : 'Ξέχασα τις απαντήσεις',
        LOGIN : 'Σύνδεση',
        REGISTER : 'Εγγραφή',
    },
    LABEL           : {
        'VERIFIED'      : 'ΕΠΑΛΗΘΕΥΜΕΝΟ',
        'UNVERIFIED'    : 'ΑΝΕΠΑΛΗΘΕΥΤΟ',
    },
    CONFIRMS        : {
        USER_STATUS :{
            ACTIVE : 'Θέλεις σίγουρα να απενεργοποιήσεις το χρήστη %%USERNAME%%?',
            SUSPEND : 'Θέλεις σίγουρα να ενεργοποιήσεις το χρήστη %%USERNAME%%?'
        }
    },
    STATUS          : {
        ENABLE : 'Ενεργοποίηση',
        DISABLE : 'Απενεργοποίηση'
    },
    CONNECTIVITY    : {
        PENDING_RESPONSE : 'Σε αναμονή απάντησης'
    },
    CART            : {
        HARDWARE                    : 'Υλικό',
        SOFTWARE                    : 'Λογισμικό',
        MANAGEMENT                  : 'Management',
        NETWORK                     : 'Δίκτυο',
        HOSTNAME                    : 'Ονομα server (Hostname)',
        CPU                         : 'Επεξεργαστής',
        ADDITIONAL_CPU              : 'Επιπλέον CPU',
        RAM                         : 'Μνήμη RAM',
        ADDITIONAL_RAM              : 'Επιπλέον RAM',
        RAM_SEMIDEDI                : 'Μνήμη RAM',
        HDD                         : 'Δίσκοι',
        BACKUP                      : 'Backup (μέσω FTP)',
        STORAGE_BOX                 : 'Storage Box',
        OS                          : 'Λειτουργικό',
        CP_DEDICATED                : 'Πίνακας ελέγχου',
        CP_VPS                      : 'Πίνακας ελέγχου',
        WEB_SERVER                  : 'Εξυπηρετητής',
        RAID                        : 'Συστοιχία',
        BANDWIDTH                   : 'Κίνηση',
        IPV4                        : 'Ιδιωτική IPv4',
        BANDWIDTH_DEDI              : 'Bandwidth',
        TRAFFIC_DEDI                : 'Traffic',
        MANUFACTURER                : 'Κατασκευαστής',
        GPU                         : 'Κάρτα γραφικών',
        DATACENTER                  : 'Datacenter',
        REMOTE_CONSOLE              : 'Απομακρυσμένη διαχείριση',
        DDOS_PROTECTION             : 'DDOS προστασία',
        SUPPORT                     : 'Υποστήριξη',
        TRAFFIC                     : 'Κίνηση',
        NET_PORTS                   : 'Θύρες δικτύου',
        MISC                        : {
            CHANGE      : 'Αλλαγή',
            ADDITION    : 'Προσθήκη'
        },
        IN_CART                     : 'Στο καλάθι',
        BUY_SERVICE                 : 'Αγορά υπηρεσίας',
        RENEW                       : 'Renew',
        ORDER                       : 'Παραγγελία',
        ORDER_SSL                   : 'Παραγγελία SSL',
        TRAFIC                      : 'Κίνηση',
        IO                          : 'I/O',
        ENTRY_PROCESSES             : 'Entry Processes',
        EXCLUSIVE_IP_SEMIDEDI       : 'Ιδιωτική IP',
        LITEMAGE                    : 'Caching Option',
        DOMAIN_NAME                 : 'Domain name',
    },
    DOMAINS         : {
        TRANSFER                    : {
            UNDER_PROCESS       : 'Το domain είναι υπό επεξεργασία',
            SUCCESSFUL_PROCESS  : 'Το domain μεταφέρθηκε επιτυχώς στη Dnhost'
        },
        RENEW                       : 'Ανανέωση Domain',
        EMPTY_NS                    : 'Θα διαγραφούν όλοι οι εξυπηρετητές από το μητρώο',
        EMPTY_NS_CUSTOM_EXCLUDED    : 'Θα διαγραφούν όλοι οι εξυπηρετητές από το μητρώο, εκτός από τους προσωπικούς',
        WHOIS                       : {
            EXTEND  : 'Επέκταση υπηρεσίας'
        },
        TRADE                       : {
            APPLICATION : {
                BUTTON : {
                    FORTH   : 'Προσθήκη στο καλάθι',
                    OTHERS  : 'Μεταβίβαση domain'

                }
            }
        }
    },
    MISC            : {
        TODAY   : 'Today',
        CANCEL  : 'Ακύρωση',
        RETURN  : 'Επιστροφή'
    },
    RESP_TABLE      : {
        RENEW       : 'Ανανέωση'
    }
};

var TRANS       = {
    LENGTH      : {
        'MONTH': {
            1 : 'μήνα',
            2 : 'μήνες'
        },
        'YEAR': {
            1 : 'έτος',
            2 : 'έτη'
        }
    },
    BILLING     : {
        TYPE    : {
            REC : 'Απόδειξη',
            INV : 'Τιμολόγιο'
        },
        STATUS  : {
            SUCCESS : 'ΕΝΕΡΓΟ',
            ERROR   : 'ΑΝΕΝΕΡΓΟ'
        },
        VAT     : 'ΑΦΜ',
        DOY     : 'ΔΟΥ',
        FROM    : '(από ##price##)'
    },
    CART        : {
        DOMAIN_TRANSFER_SUCCESSFUL  : {
            1 : 'Προστέθηκε στο καλάθι',
            2 : 'Όλα τα domains προστέθηκαν στο καλάθι'
        },
        ATTRIBUTES                  : {
            SSL_INSTALL : {
                DOMAIN_NAME : 'Πρέπει να συμπληρώσεις το Domain name όπου θα γίνει η εγκατάσταση του SSL'
            }
        },
        WARNINGS                    : {
            HOSTING : '<strong>Προσοχή!</strong> Η παραγγελία αφορά αγορά νέου πακέτου φιλοξενίας. Για ανανέωση ή αναβάθμιση δες <a href="https://dnhost.gr/kb/article/AA-00718" target="_blank">εδώ</a>.'
        },
        RGP_SETUP_FEE               : 'Κόστος ενεργοποίησης από RGP',
        BUY_ACTION                  : 'Αγορά',
    },
    DOMAINS     : {
        NAMESERVER                  : {
            1 : 'Nameserver',
            2 : 'Nameservers'
        },
        CONTACT_ROLES               : {
            REGISTRANT  : {
                DISPLAY : 'Δικαιούχος',
                FORM    : {
                    1 : 'Δικαιούχο',
                    2 : 'Δικαιούχου'
                }
            },
            ADMIN       : {
                DISPLAY : 'Διαχειριστής',
                FORM    : {
                    1 : 'Διαχειριστή',
                    2 : 'Διαχειριστή'
                }
            },
            TECH        : {
                DISPLAY : 'Τεχνικός',
                FORM    : {
                    1 : 'Τεχνικό',
                    2 : 'Τεχνικού'
                }
            },
            BILLING     : {
                DISPLAY : 'Οικονομικά',
                FORM    : {
                    1 : 'Οικονομικό',
                    2 : 'Οικονομικών'
                }
            }
        },
        RESPONSIVE_TABLES_PREVIEW   : {
            REGISTERED  : {
                1 : 'ΚΑΤΟΧΥΡΩΜΕΝΟ ΟΝΟΜΑ ΧΩΡΟΥ',
                2 : 'ΚΑΤΟΧΥΡΩΜΕΝΑ ΟΝΟΜΑΤΑ ΧΩΡΟΥ'
            },
            EXPIRES     : {
                1 : 'ΛΗΓΕΙ ΣΥΝΤΟΜΑ',
                2 : 'ΛΗΓΟΥΝ ΣΥΝΤΟΜΑ'
            },
            EXPIRED     : {
                1 : 'ΕΧΕΙ ΛΗΞΕΙ',
                2 : 'ΕΧΟΥΝ ΛΗΞΕΙ'
            },
            ID_PROTECT  : {
                TITLE   : {
                    ON  : 'ID Protect ενεργό',
                    NA  : 'ID Protect not applicable'
                }
            }
        },
        INTERNAL_TRANSFER           : {
            SINGLE_DOMAIN       : 'H μεταφορά <strong>##domain##</strong> στον χρήστη <strong>##user##</strong> ολοκληρώθηκε με επιτυχία.',
            MULTIPLE_DOMAINS    : 'H μεταφορά domains στον χρήστη <strong>##user##</strong> ολοκληρώθηκε με επιτυχία.',
            PASSED_INSPECTION   : 'Το domain είναι έτοιμο για μεταφορά'
        },
        SEARCHBAR                   : {
            MODE    : {
                SEARCH          : 'ΑΝΑΖΗΤΗΣΗ',
                SEARCH_TITLE    : 'Βρες το domain που σου ταιριάζει',
                SEARCH_PH       : 'Βρες το τέλειο domain',
                TRANSFER        : 'ΜΕΤΑΦΟΡΑ',
                TRANSFER_TITLE  : 'Μετέφερε τα domains σου στην Dnhost',
                TRANSFER_PH     : 'Μετάφερε το domain σου στην DNHOST'
            }
        },
        SEARCH                      : {
            FILTERS : {
                ALL : 'Όλα'
            },
            ELNOTIFICATIONS : {
                SINGLEDOMAIN : '<li>Αν <strong>είσαι ο κάτοχος</strong> του ##transfer## και θες να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της <a class="terms-link" href="https://www.eett.gr/opencms/opencms/EETT_EN/index.html">ΕΕΤΤ</a>, θα πρέπει πρώτα να μεταφέρεις το  ##transfer## στην DNHOST. <a href="##route##" target="_blank" title="Μεταφορά Domain στην DNHOST" class="grFamilyTransferInit simple-link more-margin">Μετέφερέ το<i class="icon-arrow-right22"></i></a></li><li>Αν <strong>δεν είσαι ο κάτοχος</strong> του ##transfer## και θες να κατοχυρώσεις το ##domain##, τότε επίλεξε την αυτόματη κατοχύρωση του .ελ, ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν <a class="terms-link" href="##termsRoute##" title="Όροι κατοχύρωσης .ελ domains" target="_blank">όροι και προϋποθέσεις</a>.</li>',
                MULTIDOMAIN : '<li>Αν <strong>είσαι ο κάτοχος</strong> ενός εκ των παρακάτω .gr domains και θέλεις να κατοχυρώσεις το ##domain##, λόγω ειδικών περιορισμών της <a class="terms-link" href="https://www.eett.gr/opencms/opencms/EETT_EN/index.html">ΕΕΤΤ</a>, θα πρέπει πρώτα να μεταφέρεις στην DNHOST κάποιο από τα:<div id="grFamilyTransferSelectableContainer" class="hidden"><div class="for-el-backorder"><div class="row collapse">##domains##</div><div><a id="grFamilyMultiDomainTransferBtn" href="##route##" target="_blank" title="Μεταφορά Domain στην DNHOST" class="grFamilyTransferInit simple-link more-margin" style="visibility: hidden">Μεταφορά<i class="icon-arrow-right22"></i></a></div></div></div></div></li><li>Αν <strong>δεν είσαι ο κάτοχος</strong> κανενός εκ των παραπάνω .gr domains και θέλεις να κατοχυρώσεις το ##domain## τότε μπορείς να επιλέξεις την αυτόματη κατοχύρωση ώστε να το αποκτήσεις σε περίπτωση που είναι ελεύθερο στις 10/10/2018 που λήγουν οι ειδικοί περιορισμοί της ΕΕΤΤ. Ισχύουν <a class="terms-link" href="##termsRoute##" title="Όροι κατοχύρωσης .ελ domains" target="_blank">όροι και προϋποθέσεις</a>.</li>'
            },
            BUTTONS : {
                CHECKING : 'Αναζήτηση'
            }
        },
        WARNINGS                    : {
            ELCOPYRIGHT : 'Για να κατοχυρώσεις αυτό το .ελ domain στην DNHOST, θα πρέπει το αντίστοιχο .gr domain να βρίσκεται στον λογαριασμό σου στην DNHOST.'
        }
    },
    SSL         : {
        BUTTONS         : {
            GET_CERTIFICATE : 'Λήψη Πιστοποιητικού',
            REISSUE         : 'Επανέκδοση',
            RENEW           : 'Ανανέωση',
            CANCEL          : 'Ακύρωση'
        },
        STATUSES        : {
            CANCELLED   : 'Ακυρώθηκε',
            CAPS        : {
                ACTIVE      : 'ΕΝΕΡΓΟ',
                INACTIVE    : 'ΑΝΕΝΕΡΓΟ',
                PENDING     : 'ΕΚΚΡΕΜΕΙ',
                CANCELLED   : 'ΑΚΥΡΩΘΗΚΕ',
                EXPIRED     : 'ΛΗΓΜΕΝΟ'
            }
        },
        ENROLLMENT      : {
            VALIDATION  : {
                INVALID_APPROVER_EMAIL : 'Μη αποδεκτό email',
                MISSING_APPROVER_EMAIL : {
                    1 : 'Δεν έχεις συμπληρώσει email για το domain "##domain##"',
                    2 : 'Δεν έχεις συμπληρώσει emails για τα domains: ##domain##'
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
            INITIAL     : 'Αρχική',
            DISCOUNT    : 'Έκπτωση',
            FINAL       : 'Τελική'
        },
        WHYNOPADLOCK    : {
            DOMAINNAME      : 'Όνομα τομέα:',
            IPADDRESS       : 'IP διεύθυνση:',
            URLTESTED       : 'URL ελέγχου:',
            LINENUMBERS     : 'Αριθμός γραμμής',
            ISSUES          : 'Βρέθηκαν ##count## σφάλματα',
            INSECURELINK    : {
                1 : 'Ανασφαλής σύνδεσμος',
                2 : 'Ανασφαλείς σύνδεσμοι'
            },
            NOERRORS        : 'Όλα τα αντικείμενα της σελίδας καλούνται επιτυχώς σε https!',
            FOUNDIN         : 'Βρέθηκε στο',
        },
        CSRDECODER      : {
            COMMONNAME          : 'Common Name (domain name)',
            ORGANIZATIONNAME    : 'Οργανισμός (η εταιρία σου)',
            ORGANIZATIONUNIT    : 'Τμήμα οργανισμού (τμήμα)',
            LOCALITY            : 'Τοποθεσία (πόλη)',
            STATE               : 'Περιφέρεια',
            COUNTRY             : 'Χώρα',
            EMAIL               : 'Email',
            KEYSIZE             : 'Key Size'
        }
    },
    HOSTING     : {
        MAGENTO : {
            SHOWGRAPHS : {
                OPEN : 'Δες τα συγκριτικά γραφήματα <i class="icon-arrow-down2"></i>',
                CLOSE : 'Κλείσε τα συγκριτικά γραφήματα <i class="icon-arrow-up2"></i>'
            }
        },
        CREATE  : {
            SKUAVAILABILITY                 : 'Τo επιθυμιτό SKU είναι διαθέσιμο.',
            ATTRIBUTES_NAME_AVAILABILITY    : 'Τo επιθυμιτό Attribute Name είναι διαθέσιμο.'
        }
    },
    DOCUMENTS   : {
        CREDITS             : {
            CANCELLED : 'ΑΚΥΡΩΘΗΚΕ'
        },
        DEBITS              : {
            ORDER : {
                EDIT : {
                    SUCCESS : 'Η παραγγελία επεξεργάστηκε με επιτυχία',
                    FAILURE : {
                        EDITS_INVALID_LENGTH    : 'Ζητήθηκε μη έγκυρη διάρκεια',
                        DEL_NOT_FOUND           : 'Το τεμάχιο δεν υπάρχει στην παραγγελία, μπορεί να διαγραφεί'
                    }
                }
            }
        },
        TABS                : {
            PAY_DOCUMENTS   : {
                1 : 'Χρήση πίστωσης (##count##)',
                2 : 'Χρήση πίστωσης (##count##)'
            },
            PAYMENTS        : {
                USED_TO_PAY_DOCUMENT  : {
                    1   : 'Χρησιμοποιήθηκε από (##count##)',
                    2   : 'Χρησιμοποιήθηκε από (##count##)'
                },
                PAID_BY_DOCUMENTS     : {
                    1   : 'Εξοφλήθηκε από (##count##)',
                    2   : 'Εξοφλήθηκε από (##count##)'
                }
            },
            PAY_WITH        : {
                1 : 'Εξόφληση με (##count##)',
                2 : 'Εξόφληση με (##count##)'
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
            OPEN                  : 'ΑΝΟΙΚΤΗ',
            ON_PAYMENT            : 'ΣΕ ΕΞΟΦΛΗΣΗ',
            PAID                  : 'ΕΞΟΦΛΗΜΕΝΗ',
            PENDING               : 'ΕΚΚΡΕΜΕΙ',
            COMPLETED             : 'ΟΛΟΚΛΗΡΩΘΗΚΕ',
            REFUNDED              : 'ΕΠΙΣΤΡΑΦΗΚΕ',
            PARTIALLY_REFUNDED    : 'ΕΠΙΣΤΡΑΦΗΚΕ ΜΕΡΙΚΩΣ',
            CANCELLED             : 'ΑΚΥΡΩΘΗΚΕ',
            ERROR                 : 'ΣΦΑΛΜΑ',
            OVERDUE               : 'EKΠΡΟΘΕΣΜΗ',
            DECLINED              : 'ΑΠΟΡΡΙΦΘΗΚΕ'
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
                DOMAIN_LIST     : 'Ολα τα domains',
                HOSTING_LIST    : 'Ολα τα hosting'
            }
        },
        STATIC  : {
            TITLE : 'ΜΕΝΟΥ ΠΛΟΗΓΗΣΗΣ'
        }
    },
    WHOIS       : {
        MODAL : {
            TITLE : '##domain## - WHOIS DOMAIN'
        }
    },
    COUPONS     : {
        CREATE : {
            ALL_USERS   : 'Όλοι',
            STATUS      : {
                ACTIVE  : 'ΕΝΕΡΓΟ',
                WARNING : 'ΣΕ ΑΝΑΜΟΝΗ'
            },
            USERS       : {
                FILTERS : {
                    REGISTRATION    : {
                        NEW : 'Τις τελευταιές 30 μέρες',
                        OLD : 'Πάνω από 30 μέρες',
                    },
                    ORDERS          : {
                        NEVER : 'Ποτέ'
                    }
                }
            },
            FROM        : 'Από',
            TO          : 'Εώς',
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
            ACCEPT_ALL_ABOVE_LABEL_ERROR        : 'Πρέπει να συμφωνήσεις με τους Όρους Χρήσης',
        },
        NEWSLETTER : {
           DISABLE                  : 'Η διαγραφή σου από το newsletter της DNHOST, πραγματοποιήθηκε επιτυχώς.',
           ENABLE                   : 'Έλεγξε τα εισερχόμενά σου για να επιβεβαιώσεις την εγγραφή του email σου στο newsletter μας.',
           ENABLE_2                 : 'Η εγγραφή σου στο newsletter της DNHOST, πραγματοποιήθηκε επιτυχώς.',
           RESEND                   : 'Το email επιβεβαίωσης εστάλη με επιτυχία.',
            ACCOUNT_CONFIRM_MODAL   : {
                DISABLE : {
                    TITLE   : 'Επιβεβαίωση απεγγράφης',
                    BODY    : 'Θέλεις να απεγγραφείς από την λίστα των newsletter μας; Παρακαλούμε επιβεβαίωσέ το κάνοντας κλικ στο κουμπί υποβολή.'
                },
                ENABLE  : {
                    TITLE   : 'Επιβεβαίωση εγγραφής',
                    BODY    : 'Θέλεις να εγγραφείς στην λίστα των newsletter μας; Παρακαλούμε επιβεβαίωσέ το κάνοντας κλικ στο κουμπί υποβολή.'
                }
            }
        }
    },
    PRICING     : {
        MONTHLY_FEE_TITLE   : 'Μηνιαίο κόστος',
        SETUP_FEE           : 'Κόστος εγκατάστασης',
    },
    MISC        : {
        TABLES                      : {
            NO_RESULTS : 'Δεν υπάρχουν αποτελέσματα'
        },
        SETUP_FEE                   : 'Kόστος εγκατάστασης',
        DASHBOARD                   : 'Πίνακας Ελέγχου',
        SIDR_MENU_TITLE             : 'ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ',
        AMOUNT                      : 'Ποσό',
        PERCENTAGE                  : 'Ποσοστό',
        DATES                       : {
            DAYS    : 'Ημέρες',
            HOURS   : 'Ώρες',
            MINUTES : 'Λεπτά',
            SECONDS : 'Δεύτερα'
        },
        CLIPBOARD_COPIED            : 'Το κείμενο "##text##" έχει αντιγραφεί κάνε επικόλληση όπου επιθυμείς.',
        DOWNLOAD                    : 'Λήψη',
        LOGIN                       : 'Σύνδεση',
        ACCEPTANCE                  : 'Αποδοχή',
        STATUSES                    : {
            ACTIVE          : 'ΕΝΕΡΓΟ',
            ACTIVE_FEMALE   : 'ΕΝΕΡΓΗ',
            INACTIVE        : 'ΑΝΕΝΕΡΓΟ',
            INACTIVE_FEMALE : 'ΑΝΕΝΕΡΓΗ',
            DELETED         : 'ΔΙΕΓΡΑΜΜΕΝΟ',
            DELETE_FEMALE   : 'ΔΙΕΓΡΑΜΜΕΝΗ',
            PENDING         : 'ΕΚΚΡΕΜΕΙ',
            CANCELLED       : 'ΑΚΥΡΩΘΗΚΕ',
            COMPLETED       : 'ΟΛΟΚΛΗΡΩΘΗΚΕ',
            PROCESSING      : 'ΕΚΤΕΛΕΙΤΑΙ'
        },
        UNAVAILABLE_SKU             : 'Το SKU:##sku## δεν είναι διαθέσιμο.',
        UNAVAILABLE_ATTRIBUTE_NAME  : 'Το όνομα:##name## δεν είναι διαθέσιμο.',
        STORAGE_TYPE                : {
            SSD     : 'SSD',
            NVME    : 'NVMe',
            HDD     : 'HDD',
        }
    }
};
