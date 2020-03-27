$(document).ready(function () {
    defaultButtonHandler = function(data){
        $.commonDefaultRequestHandler(data, []);
    };

    channel.contacts.bind('App\\Events\\Contacts\\ContactWasCreated', function(data) {
        if(data.msg.unique_id == unique_page_identifier)
            return ;

        $.responsive_tables.initiate({'disable_search' : true});
    });


    channel.domain.bind('App\\Events\\Domains\\DomainWasTransferredIn', function() {
        $.responsive_tables.initiate({'disable_search' : true});
    });
});