$('document').ready(function () {$userMenuConfig = {"user":{"group":[{"text":"ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ"},{"list":[{"small_only":true,"function":"getAccountName","choices":[{"class":"sidr-user-account","link":{"path":"#","text":""}}]},{"class":"sidr-class-dashboard","small_only":true,"link":{"path":"http:\/\/my.laravel.upgrade\/dashboard","text":"ΠΙΝΑΚΑΣ ΕΛΕΓΧΟΥ","attributes":{"title":"ΠΙΝΑΚΑΣ ΕΛΕΓΧΟΥ"}}},{"class":"sidr-class-domains has-dropdown not-click","header":{"link":{"path":"http:\/\/my.laravel.upgrade\/domains"},"icon":"icon-globe","span":"Domains"},"list":[{"link":{"path":"http:\/\/my.laravel.upgrade\/domains","text":"Τα domains μου","attributes":{"title":"Δες και διαχειρίσου όλα τα domains σου"}}},{"label":"ΕΝΕΡΓΕΙΕΣ"},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/search","text":"Κατοχύρωση","attributes":{"title":"Κατοχύρωσε ένα νέο όνομα χώρου"}}},{"class":"has-dropdown not-click","header":{"link":"#","text":"Μεταφορά"},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/domains\/%CE%BC%CE%B5%CF%84%CE%B1%CF%86%CE%BF%CF%81%CE%AC-domain","text":"Αλλαγή καταχωρητή","attributes":{"title":"Μετάφερε domains στο λογαριασμό σου στην DNHOST"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/domains\/move","text":"Εσωτερική μεταφορά","attributes":{"title":"Μετάφερε domains σε άλλο χρήστη της DNHOST"}}}]},{"class":"has-dropdown not-click","header":{"link":"#","text":"Μεταβίβαση"},"list":[{"link":{"path":"http:\/\/my.laravel.upgrade\/domains\/change-registrant\/application","text":"Νέα μεταβίβαση","attributes":{"title":"Μεταβίβασε ένα domain σε νέο κάτοχο"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/domains\/change-registrant","text":"Ιστορικό μεταβιβάσεων","attributes":{"title":"Δες τις μεταβιβάσεις .GR domain που ολοκληρώθηκαν ή εκκρεμούν"}}}]},{"label":"ΕΠΑΦΕΣ"},{"link":{"path":"http:\/\/my.laravel.upgrade\/contacts","text":"Πρόσωπα επαφής","attributes":{"title":"Δες όλα τα πρόσωπα επαφής σου"}}}]},{"class":"sidr-class-hosting has-dropdown not-click","header":{"function":"getHostingHeader","choices":[{"link":{"path":"http:\/\/my.laravel.upgrade\/hosting\/accounts\/new"},"icon":"icon-database2","span":"Hosting"},{"link":{"path":"http:\/\/my.laravel.upgrade\/hosting"},"icon":"icon-database2","span":"Hosting"}]},"list":[{"function":"getActionLink","choices":[{"link":{"path":"http:\/\/my.laravel.upgrade\/hosting\/accounts\/new","text":"Σύνδεση λογαριασμoύ","attributes":{"title":"Συνδέσου στο λογαριασμό σου"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/hosting","text":"Τα πακέτα hosting μου","attributes":{"title":"Δες και διαχειρίσου τα πακέτα φιλοξενίας σου"}}}]},{"link":{"path":"http:\/\/laravel.upgrade\/hosting","text":"Αγορά νέου πακέτου","attributes":{"title":"Αγόρασε ένα νέο πακέτο φιλοξενίας"}}}]},{"class":"sidr-class-security has-dropdown not-click","header":{"link":{"path":"http:\/\/my.laravel.upgrade\/ssl-certificates"},"icon":"icon-shield2","span":"SSL"},"list":[{"link":{"path":"http:\/\/my.laravel.upgrade\/ssl-certificates","text":"Τα SSL μου","attributes":{"title":"Δες πληροφορίες των SSL πιστοποιητικών σου"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates","text":"Αγορά νέου SSL","attributes":{"title":"Αγόρασε ένα SSL πιστοποιητικό "}}}]},{"class":"sidr-class-account has-dropdown not-click","header":{"link":{"path":"http:\/\/my.laravel.upgrade\/account"},"icon":"icon-user2","span":"ΛΟΓΑΡΙΑΣΜΟΣ"},"list":[{"link":{"path":"http:\/\/my.laravel.upgrade\/account","text":"Ρυθμίσεις λογαριασμού","attributes":{"title":"Ρυθμίσεις λογαριασμού"}}},{"label":"ΤΑ ΟΙΚΟΝΟΜΙΚΑ ΜΟΥ"},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/orders","text":"Οι παραγγελίες μου","attributes":{"title":"Δες όλες τις παραγγελίες που έχεις κάνει"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/documents","text":"Ιστορικό κινήσεων","attributes":{"title":"Δες όλες τις πληρωμές, χρεώσεις, πιστώσεις που έγιναν στο λογ\/σμό σου"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/profiles","text":"Προφίλ τιμολόγησης","attributes":{"title":"Έλεγξε τα στοιχεία που θα τιμολογούνται οι παραγγελίες σου"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/add-funds","text":"Πίστωση λογαριασμoύ","attributes":{"title":"Πίστωσε το λογαριασμό σου πληρώνοντας με πιστωτική κάρτα"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/payment-methods","text":"Τρόποι πληρωμής","attributes":{"title":"Δες πως μπορείς να πληρώσεις για τις αγορές σου"}}},{"link":{"path":"http:\/\/my.laravel.upgrade\/billing\/dct\/remittance-codes","text":"Κωδικοί πληρωμής","attributes":{"title":"Κωδικοί πληρωμής"}}}]}]},{"list":{"decoration":{"id":"userNav","class":"sidr-inner"},"0":{"decoration":{"id":"sidCartContainer","class":"sidr-class-m-cart"},"link":{"decoration":{"span":{"id":"cart_badge_sidr","class":"badge hide"}},"id":"cartController","path":"http:\/\/laravel.upgrade\/cart","text":"ΚΑΛΑΘΙ"}},"1":{"decoration":{"id":"sidVatContainer","class":"sidr-class-m-vat sidr-class-with-dropdown "},"header":{"link":"#","id":"sidVatTrigger","class":"sidr-class-button sidr-class-dropdown","span":"ΡΥΘΜΙΣΕΙΣ ΤΙΜΩΝ"},"pending_list":true},"2":{"decoration":{"id":"sidSupportContainer","class":"sidr-class-m-support sidr-class-with-dropdown "},"header":{"link":{"path":"#"},"id":"supportController","class":"sidr-class-button sidr-class-dropdown","span":"ΥΠΟΣΤΗΡΙΞΗ"},"pending_list":true},"3":{"small_only":true,"function":"getLogoutLink","choices":[{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/my.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}},{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/admin.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}}]}}}]},"admin":{"group":[{"text":"ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ"},{"list":[{"small_only":true,"function":"getAccountName","choices":[{"class":"sidr-user-account","link":{"path":"#","text":""}}]},{"class":"sidr-class-dashboard","small_only":true,"link":{"path":"http:\/\/admin.laravel.upgrade\/dashboard","text":"ΠΙΝΑΚΑΣ ΕΛΕΓΧΟΥ","attributes":{"title":"ΠΙΝΑΚΑΣ ΕΛΕΓΧΟΥ"}}},{"class":"sidr-class-domains has-dropdown not-click","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/domains"},"icon":"icon-globe","span":"Domains"},"list":[{"link":{"path":"http:\/\/admin.laravel.upgrade\/contacts","text":"Πρόσωπα επαφής","attributes":{"title":"Πρόσωπα επαφής"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/domains\/change-registrant","text":"Αιτήσεις μεταβίβασης","attributes":{"title":"Αιτήσεις μεταβίβασης"}}}]},{"class":"sidr-class-hosting has-dropdown not-click","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting"},"icon":"icon-database2","span":"Hosting"},"list":[{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting\/accounts","text":"Λογαριασμoί hosting","attributes":{"title":"Λογαριασμoί hosting"}}},{"label":"Dedicated Servers"},{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting\/dedicated","text":"Dedicated Hosting Plans","attributes":{"title":"Dedicated Hosting Plans"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting\/dedicated\/details\/attributes","parameters":{"category":"attributes"},"text":"Attributes","attributes":{"title":"Attributes"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting\/dedicated\/details\/options","parameters":{"category":"options"},"text":"Options","attributes":{"title":"Options"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/hosting\/dedicated\/details\/extensions","parameters":{"category":"extensions"},"text":"Extensions","attributes":{"title":"Extensions"}}}]},{"class":"sidr-class-security has-dropdown not-click","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/ssl-certificates"},"icon":"icon-shield2","span":"SSL"},"list":[{"link":{"path":"http:\/\/admin.laravel.upgrade\/ssl-certificates\/installations","text":"Υπηρεσίες εγκατάστασης","attributes":{"title":"Υπηρεσίες εγκατάστασης"}}}]},{"class":"sidr-class-users","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/users"},"icon":"icon-users","span":"ΧΡΗΣΤΕΣ"}},{"class":"sidr-class-billing has-dropdown not-click","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing"},"icon":"icon-clipboard","span":"ΟΙΚΟΝΟΜΙΚΑ"},"list":[{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/profiles","text":"Προφίλ τιμολόγησης","attributes":{"title":"Προφίλ τιμολόγησης"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/orders","text":"Παραγγελίες","attributes":{"title":"Παραγγελίες"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/documents","text":"Ιστορικό κινήσεων","attributes":{"title":"Ιστορικό κινήσεων"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/dct\/remittance-codes","text":"Κωδικοί πληρωμής","attributes":{"title":"Κωδικοί πληρωμής"}}}]},{"class":"sidr-class-products has-dropdown not-click","header":{"link":{"path":"http:\/\/admin.laravel.upgrade\/products"},"icon":"icon-clipboard","span":"ΠΡΟΪΟΝΤΑ"},"list":[{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/profiles","text":"Ιστορικό προϊόντων","attributes":{"title":"Ιστορικό προϊόντων"}}},{"link":{"path":"http:\/\/admin.laravel.upgrade\/billing\/profiles","text":"Κωδικοι προϊόντων","attributes":{"title":"Κωδικοι προϊόντων"}}}]}]},{"list":{"decoration":{"id":"userNav","class":"sidr-inner"},"0":{"decoration":{"id":"sidCartContainer","class":"sidr-class-m-cart"},"link":{"decoration":{"span":{"id":"cart_badge_sidr","class":"badge hide"}},"id":"cartController","path":"http:\/\/laravel.upgrade\/cart","text":"ΚΑΛΑΘΙ"}},"1":{"decoration":{"id":"sidVatContainer","class":"sidr-class-m-vat sidr-class-with-dropdown "},"header":{"link":"#","id":"sidVatTrigger","class":"sidr-class-button sidr-class-dropdown","span":"ΡΥΘΜΙΣΕΙΣ ΤΙΜΩΝ"},"pending_list":true},"2":{"decoration":{"id":"sidSupportContainer","class":"sidr-class-m-support sidr-class-with-dropdown "},"header":{"link":{"path":"#"},"id":"supportController","class":"sidr-class-button sidr-class-dropdown","span":"ΥΠΟΣΤΗΡΙΞΗ"},"pending_list":true},"3":{"small_only":true,"function":"getLogoutLink","choices":[{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/my.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}},{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/admin.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}}]}}}]},"guest":{"group":[{"text":"ΔΙΑΧΕΙΡΙΣΗ ΥΠΗΡΕΣΙΩΝ"},{"list":[{"link":{"id":"sidr-id-loginBtn","class":"button login-btn","path":"http:\/\/laravel.upgrade\/cart","text":"ΕΙΣΟΔΟΣ\/ΕΓΓΡΑΦΗ"}}]},{"list":{"decoration":{"id":"userNav","class":"sidr-inner"},"0":{"decoration":{"id":"sidCartContainer","class":"sidr-class-m-cart"},"link":{"decoration":{"span":{"id":"cart_badge_sidr","class":"badge hide"}},"id":"cartController","path":"http:\/\/laravel.upgrade\/cart","text":"ΚΑΛΑΘΙ"}},"1":{"decoration":{"id":"sidVatContainer","class":"sidr-class-m-vat sidr-class-with-dropdown "},"header":{"link":"#","id":"sidVatTrigger","class":"sidr-class-button sidr-class-dropdown","span":"ΡΥΘΜΙΣΕΙΣ ΤΙΜΩΝ"},"pending_list":true},"2":{"decoration":{"id":"sidSupportContainer","class":"sidr-class-m-support sidr-class-with-dropdown "},"header":{"link":{"path":"#"},"id":"supportController","class":"sidr-class-button sidr-class-dropdown","span":"ΥΠΟΣΤΗΡΙΞΗ"},"pending_list":true},"3":{"small_only":true,"function":"getLogoutLink","choices":[{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/my.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}},{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/admin.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}}]}}}]},"common":{"group":[{"text":{}},{"list":{"decoration":{"id":"userNav","class":"sidr-inner"},"0":{"decoration":{"id":"sidCartContainer","class":"sidr-class-m-cart"},"link":{"decoration":{"span":{"id":"cart_badge_sidr","class":"badge hide"}},"id":"cartController","path":"http:\/\/laravel.upgrade\/cart","text":"ΚΑΛΑΘΙ"}},"1":{"decoration":{"id":"sidVatContainer","class":"sidr-class-m-vat sidr-class-with-dropdown "},"header":{"link":"#","id":"sidVatTrigger","class":"sidr-class-button sidr-class-dropdown","span":"ΡΥΘΜΙΣΕΙΣ ΤΙΜΩΝ"},"pending_list":true},"2":{"decoration":{"id":"sidSupportContainer","class":"sidr-class-m-support sidr-class-with-dropdown "},"header":{"link":{"path":"#"},"id":"supportController","class":"sidr-class-button sidr-class-dropdown","span":"ΥΠΟΣΤΗΡΙΞΗ"},"pending_list":true},"3":{"small_only":true,"function":"getLogoutLink","choices":[{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/my.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}},{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/admin.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}}]}}},{"list":{"decoration":{"id":"userNav","class":"sidr-inner"},"0":{"decoration":{"id":"sidCartContainer","class":"sidr-class-m-cart"},"link":{"decoration":{"span":{"id":"cart_badge_sidr","class":"badge hide"}},"id":"cartController","path":"http:\/\/laravel.upgrade\/cart","text":"ΚΑΛΑΘΙ"}},"1":{"decoration":{"id":"sidVatContainer","class":"sidr-class-m-vat sidr-class-with-dropdown "},"header":{"link":"#","id":"sidVatTrigger","class":"sidr-class-button sidr-class-dropdown","span":"ΡΥΘΜΙΣΕΙΣ ΤΙΜΩΝ"},"pending_list":true},"2":{"decoration":{"id":"sidSupportContainer","class":"sidr-class-m-support sidr-class-with-dropdown "},"header":{"link":{"path":"#"},"id":"supportController","class":"sidr-class-button sidr-class-dropdown","span":"ΥΠΟΣΤΗΡΙΞΗ"},"pending_list":true},"3":{"small_only":true,"function":"getLogoutLink","choices":[{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/my.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}},{"id":"sidLogoutContainer","class":"sidr-class-m-logout","link":{"path":"http:\/\/admin.laravel.upgrade\/logout","text":"ΑΠΟΣΥΝΔΕΣΗ","attributes":{"title":"ΑΠΟΣΥΝΔΕΣΗ"}}}]}}}]}}; $siteMenuConfig = {"common":{"group":[{"text":"ΜΕΝΟΥ ΠΛΟΗΓΗΣΗΣ"},{"list":[{"class":"sidr-class-domains domains","header":{"link":{"path":"http:\/\/laravel.upgrade\/domain","attributes":{"title":"DOMAIN"},"text":"DOMAIN"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/domains\/%CE%BA%CE%B1%CF%84%CE%BF%CF%87%CF%85%CF%81%CF%89%CF%83%CE%B7-domain","text":"ΚΑΤΟΧΥΡΩΣΗ DOMAIN","mobile_text":"Κατοχύρωση Domain","attributes":{"title":"Κατοχύρωσε Domain σε λιγότερο από 1’"}}},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/%CE%BC%CE%B5%CF%84%CE%B1%CF%86%CE%BF%CF%81%CE%AC-domain","text":"ΜΕΤΑΦΟΡΑ DOMAIN","mobile_text":"Μεταφορά Domain","attributes":{"title":"Μετάφερε εύκολα το Domain σου σε εμάς"}}},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/%CF%84%CE%B9%CE%BC%CE%BF%CE%BA%CE%B1%CF%84%CE%AC%CE%BB%CE%BF%CE%B3%CE%BF%CF%82-domain-names","text":"ΤΙΜΟΚΑΤΑΛΟΓΟΣ DOMAIN","mobile_text":"Τιμοκατάλογος Domain","attributes":{"title":"Δες τις τρέχουσες τιμές των Domain"}}},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/id-protect","text":"ID PROTECT","mobile_text":"ID Protect","attributes":{"title":"Απόκρυψη στοιχείων κατοχύρωσης .com domains"}}},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/whois","text":"WHOIS DOMAIN","mobile_text":"WHOIS Domain","attributes":{"title":"Κάνε αναζήτηση WHOIS Domain"}}},{"link":{"path":"http:\/\/laravel.upgrade\/domains\/%CE%BD%CE%B5%CE%B5%CF%82-%CE%BA%CE%B1%CF%84%CE%B1%CE%BB%CE%B7%CE%BE%CE%B5%CE%B9%CF%82","text":"ΝΕΕΣ ΚΑΤΑΛΗΞΕΙΣ","mobile_text":"Νέες Καταλήξεις","attributes":{"title":"Εκατοντάδες Νέες Καταλήξεις Domain σε περιμένουν"}}}]},{"class":"sidr-class-hosting hosting","header":{"link":{"path":"http:\/\/laravel.upgrade\/hosting","attributes":{"title":"HOSTING"},"text":"HOSTING"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/hosting\/web-hosting","text":"WEB HOSTING","mobile_text":"Web Hosting","attributes":{"title":"Πακέτα για Web Ηosting"}}},{"link":{"path":"http:\/\/laravel.upgrade\/hosting\/reseller-hosting","text":"RESELLER HOSTING","mobile_text":"Reseller Hosting","attributes":{"title":"Πακέτα για Reseller Ηosting"}}},{"link":{"path":"http:\/\/laravel.upgrade\/hosting\/semi-dedicated-hosting","text":"SEMI-DEDICATED HOSTING","mobile_text":"Semi-Dedicated Hosting","attributes":{"title":"Πακέτα για Semi-Dedicated Ηosting"}}},{"link":{"path":"http:\/\/laravel.upgrade\/hosting\/vps-hosting","text":"VPS HOSTING","mobile_text":"VPS Hosting","attributes":{"title":"Πακέτα για VPS Ηosting"}}},{"link":{"path":"http:\/\/laravel.upgrade\/hosting\/dedicated-servers","text":"DEDICATED SERVERS","mobile_text":"Dedicated Servers","attributes":{"title":"Dedicated Servers σε Ελλάδα & Ευρώπη"}}}]},{"class":"sidr-class-security security","header":{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates","attributes":{"title":"SSL CERTIFICATES"},"text":"SSL CERTIFICATES"}},"list":[{"class":"with-dropdown","link":{"path":"#","text":"ΕΤΑΙΡΙΕΣ SSL","mobile_text":"Εταιρίες SSL","attributes":{"title":"Εταιρίες SSL"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/symantec","parameters":{"filterValue":"symantec"},"text":"SYMANTEC","mobile_text":"Symantec","attributes":{"title":"Δες τα SSL της εταιρίας Symantec"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/comodo","parameters":{"filterValue":"comodo"},"text":"COMODO","mobile_text":"Comodo","attributes":{"title":"Δες τα SSL της εταιρίας Comodo"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/geotrust","parameters":{"filterValue":"geotrust"},"text":"GEOTRUST","mobile_text":"GeoTrust","attributes":{"title":"Δες τα SSL της εταιρίας GeoTrust"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/thawte","parameters":{"filterValue":"thawte"},"text":"THAWTE","mobile_text":"Thawte","attributes":{"title":"Δες τα SSL της εταιρίας Thawte"}}}]},{"class":"with-dropdown","link":{"path":"#","text":"ΕΙΔΟΣ ΠΙΣΤΟΠΟΙΗΣΗΣ","mobile_text":"Είδος Πιστοποίησης","attributes":{"title":"Είδος πιστοποίησης"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/dv-ssl","parameters":{"filterValue":"dv-ssl"},"text":"DV SSL <span>&lpar;επικύρωση domain&rpar;<\/span>","attributes":{"title":"Domain Validation SSL"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/ov-ssl","parameters":{"filterValue":"ov-ssl"},"text":"OV SSL <span>&lpar;επικύρωση εταιρίας&rpar;<\/span>","attributes":{"title":"Organization Validation SSL"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/ev-ssl","parameters":{"filterValue":"ev-ssl"},"text":"EV SSL  <span>&lpar;πράσινη μπάρα&rpar;<\/span>","attributes":{"title":"Extended Validation SSL"}}}]},{"class":"with-dropdown","link":{"path":"#","text":"ΑΡΙΘΜΟΣ DOMAINS","mobile_text":"Αριθμός Domains","attributes":{"title":"Αριθμός domains"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/single-domain-ssl","parameters":{"filterValue":"single-domain-ssl"},"text":"SINGLE-DOMAIN SSL <span>&lpar;για ένα domain&rpar;<\/span>","attributes":{"title":"Single-Domain SSL για ένα Domain ή Subdomain"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/multi-domain-ssl","parameters":{"filterValue":"multi-domain-ssl"},"text":"SAN SSL <span>&lpar;Multi-domain SSL&rpar;<\/span>","attributes":{"title":"Multi-Domain SSL για πολλαπλά & διαφορετικά Domain"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/wildcard-ssl","parameters":{"filterValue":"wildcard-ssl"},"text":"WILDCARD SSL <span>&lpar;για subdomains&rpar;<\/span>","attributes":{"title":"Wildcard SSL για όλα τα Subdomain ενός Domain"}}}]},{"class":"with-dropdown","link":{"path":"#","text":"ΕΡΓΑΛΕΙΑ SSL","mobile_text":"Εργαλεία SSL","attributes":{"title":"Εργαλεία SSL"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/ssl-wizard","text":"ΒΟΗΘΟΣ ΕΠΙΛΟΓΗΣ SSL","mobile_text":"Βοηθός Επιλογής SSL","attributes":{"title":"Βοηθός επιλογής SSL"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-tools\/why-no-padlock","text":"WHY NO PADLOCK","mobile_text":"Why No Padlock","attributes":{"title":"Why No Padlock"}}}]},{"small_only":true,"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/what-is-ssl","text":"ΤΙ ΕΙΝΑΙ SSL;","mobile_text":"Τι είναι SSL;","attributes":{"title":"Μάθε τι είναι & γιατί χρειάζεσαι SSL"}}},{"link":{"path":"http:\/\/laravel.upgrade\/ssl-certificates\/pci-compliance","text":"PCI COMPLIANCE","mobile_text":"PCI Compliance","attributes":{"title":"Μάθε ποια είναι τα οφέλη του PCI Compliance"}}}]},{"class":"sidr-class-websites websites","header":{"link":{"path":"http:\/\/laravel.upgrade\/websites","attributes":{"title":"WEBSITES"},"text":"WEBSITES"}},"list":[{"link":{"path":"http:\/\/laravel.upgrade\/websites\/wordpress","text":"WORDPRESS","mobile_text":"Wordpress","attributes":{"title":"Wordpress: η δημοφιλέστερη λύση για κατασκευή site"}}},{"link":{"path":"http:\/\/laravel.upgrade\/websites\/%CE%B4%CF%89%CF%81%CE%B5%CE%AC%CE%BD-web-%CE%B5%CF%86%CE%B1%CF%81%CE%BC%CE%BF%CE%B3%CE%AD%CF%82","text":"ΔΩΡΕΑΝ ΕΦΑΡΜΟΓΕΣ","mobile_text":"Δωρεάν Εφαρμογές","attributes":{"title":"Δεκάδες δωρεάν εφαρμογές για να φτιάξεις ή να προσθέσεις στο site σου"}}},{"link":{"path":"http:\/\/laravel.upgrade\/websites\/eshop","text":"ΚΑΤΑΣΚΕΥΗ E-SHOP","mobile_text":"Κατασκευή E-shop","attributes":{"title":"Κατασκευή E-shop με τα πιο δημοφιλή και δωρεάν εργαλεία"}}},{"link":{"path":"http:\/\/laravel.upgrade\/websites\/spam-filter","text":"SPAM FILTER","mobile_text":"Spam Filter","attributes":{"title":"Για την προστασία του email σου από spam, malware & phishing"}}}]}]}]}};})