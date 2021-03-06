VALIDATION_MESSAGES = {
    'ERRORS' : {
        'REQUIRED'          : 'Please fill in all required fields',
        'EMAIL'             : 'The email you gave is wrong',
        'LENGTH'            : {
            'MIN'       : 'Your answer is shorter than ##n## characters',
            'MAX'       : 'Your answer is larger than ##n## characters',
            'RANGE'     : 'Your answer must be between ##min## - ##max## characters'
        },
        'INTERNATIONAL'     : 'Your answer must not contain greek characters',
        'ILLEGAL'           : {
            'CHARS' : 'Your answer contains non acceptable characters'
        },
        'PASSWORD'          : 'Your password is not strong enough',
        'NOTCONFIRMED'      : 'It has not been validated',
        'IP'                : {
            //'UNRECOGNISED_IP_VERSION'   : 'The version of the IP you try to submit cannot be identified',
            //'LOCAL_IP'                  : 'The IP cannot be a local network address',
            'INVALID_CHARS'             : 'The IP address you gave contains not acceptable characters',
            'INVALID_SYNTAX'            : 'The syntax of the IP address you gave is not correct',
            'INVALID_FORMAT'            : 'The IP address must have the format 0.0.0.0, with numbers from 0 to 255',
            'INVALID_FORMAT_V6'         : 'The IPv6 address must have the format 0000:0000:0000:0000:0000:0000:0000:0000, with numbers from 0 to 255 and characters from A to F',
            'TOO_BIG_NUMS'              : 'The IP address cannot contain numbers bigger than 255',
            'NO_IP'                     : 'No IP address was found'
        },
        'NAME_SERVERS'      : {
            'INVALID_CHARS'             : 'The nameserver you want to store contains invalid characters.',
            'INVALID_SYNTAX'            : 'The nameserver you want to store contains syntax errors.',
            'HOST_INVALID_FORMAT'       : 'The nameserver you want to store must have the format xxx.##fqdn##.',
            'TOO_BIG_PREFIX'            : 'The prefix of the nameserver you want to store cannot be larger than ##limit## characters',
            'PREFIX_NO_PERIODS'         : 'The prefix of the nameserver you want to store cannot contain dots',
            'INVALID_HOST_ID'           : 'The nameserver you want to store can only contain "-", between two words.',
            'INVALID_NAMESERVER_DOMAIN' : 'The nameserver you want to store must have the format ns1.google.com',
            'UNACCEPTABLE_DOMAIN'       : 'The nameserver you want to store is not acceptable',
        },
        'UNIQUE'            : 'This value is not unique',
        'CONTACT_PROFILES'  : {
            'MISSING' : 'This contact profile has missing information, please fill them in.'
        },
        'NOCHANGES'         : 'No change detected.',
        'ASCII'             : 'You can insert only ΑSCII characters in this field.',
        'NUMERIC'           : 'The value must be a number',
        'VALUES'            : {
            'MIN'   :  'The value can not be smaller than ##min##',
            'MAX'   :  'The value can not be larger than ##max##'
        },
        'CUSTOM'            : {
            'WHOIS' : {
                'POSTKEYWORD' : {
                    'REQUIRED': 'Please insert the domain you want to lookup',
                    'LENGTH': {
                        'MIN': 'A domain can not be shorter than ##n## characters',
                    },
                }
            }
        }
    },
};