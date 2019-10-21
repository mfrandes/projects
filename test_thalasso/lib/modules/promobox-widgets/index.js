const request = require( 'request-promise' );

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Promo box widget',
    addFields: [
        {
            label: 'Promo Type',
            name: 'promoType',
            type: 'select',
            required: true,
            choices: [
                {
                    label: 'Category',
                    value: 'category',
                    showFields: [
                        'category'
                    ]
                },
                {
                    label: 'Characteristic',
                    value: 'characteristic',
                    showFields: [
                        'characteristic'
                    ]
                },
                {
                    label: 'Destination',
                    value: 'destination',
                    showFields: [
                        'destination'
                    ]
                }
            ]
        },
        {
            label: 'Category',
            name: 'category',
            type: 'select',
            required: true,
            choices: 'getCategoryChoices'
        },
        {
            label: 'Characteristic',
            name: 'characteristic',
            type: 'select',
            required: true,
            choices: 'getCharacteristicChoices'
        },
        {
            label: 'Destination',
            name: 'destination',
            type: 'select',
            required: true,
            choices: 'getDestinationChoices'
        },
        {
            name: 'image',
            label: 'Cover image',
            type: 'singleton',
            widgetType: 'apostrophe-images',
            options:
            {
                limit: 1
            },
            required: true
        },
        {
            label: 'Link Type',
            name: 'linkType',
            type: 'select',
            required: true,
            choices: [
                {
                    label: 'Minisite',
                    value: 'minisite',
                    showFields: [
                        'url'
                    ]
                },
                {
                    label: 'Local CMS',
                    value: 'localcms',
                    showFields: [
                        'pages'
                    ]
                }
            ]
        },
        {
            name: 'url',
            label: 'Links to (URL)',
            type: 'url',
            required: true,
        },
        {
            label: 'Local CMS pages',
            name: 'pages',
            type: 'select',
            required: true,
            choices: 'getLocalPageChoices'
        },
    ],
    arrangeFields: [
        {
            name: 'general',
            label: 'General settings',
            fields: [ 'promoType', 'category', 'characteristic', 'destination', 'image', 'linkType', 'url', 'pages' ]
        }
    ],

    construct: function( self, options )
    {
        var minisiteURL = self.apos.options.settings.minisiteURL;

        self.getDestinationChoices = async function( req )
        {
            const destinations = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Destination",
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": "EN",
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            var choiceList = [];
            for( idx = 0; idx < destinations.totalRecords; idx++ )
            {
                var option = {
                    label: destinations.items[ idx ].label,
                    value: destinations.items[ idx ].code
                };

                choiceList.push( option );
            }

            return choiceList;
        }

        self.getCharacteristicChoices = async function( req )
        {
            const characteristics = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Product_Characteristics",
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": "EN",
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            var choiceList = [];
            for( idx = 0; idx < characteristics.totalRecords; idx++ )
            {
                var option = {
                    label: characteristics.items[ idx ].label,
                    value: characteristics.items[ idx ].code
                };

                choiceList.push( option );
            }

            return choiceList;
        }

        self.getCategoryChoices = async function( req )
        {
            const categories = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Product_Category",
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": "EN",
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            var choiceList = [];
            for( idx = 0; idx < categories.totalRecords; idx++ )
            {
                var option = {
                    label: categories.items[ idx ].label,
                    value: categories.items[ idx ].code
                };

                choiceList.push( option );
            }

            return choiceList;
        }

        self.getLocalPageChoices = async function()
        {
            var docs = await self.apos.db.collection( 'aposDocs' ).find( { type: 'inner' } ).toArray();

            var choiceList = [];
            for( idx = 0; idx < docs.length; idx++ )
            {
                var option = {
                    label: docs[ idx ].title,
                    value: docs[ idx ].slug
                };

                choiceList.push( option );
            }

            return choiceList;
        }

        self.getDestination = async function( code, language )
        {
            const destinations = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Country_Area",
                            "qualifier": "="
                        },
                        {
                            "field": "code",
                            "value": code,
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": language,
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            if( destinations.totalRecords > 0 )
            {
                return destinations.items[ 0 ];
            }
            else
            {
                return null;
            }
        }

        self.getCharacteristic = async function( code, language )
        {
            const characteristics = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Product_Characteristics",
                            "qualifier": "="
                        },
                        {
                            "field": "code",
                            "value": code,
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": language,
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            if( characteristics.totalRecords > 0 )
            {
                return characteristics.items[ 0 ];
            }
            else
            {
                return null;
            }
        }

        self.getCategory = async function( code, language )
        {
            const categories = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "name",
                            "value": "Product_Category",
                            "qualifier": "="
                        },
                        {
                            "field": "code",
                            "value": code,
                            "qualifier": "="
                        },
                        {
                            "field": "language",
                            "value": language,
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            if( categories.totalRecords > 0 )
            {
                return categories.items[ 0 ];
            }
            else
            {
                return null;
            }
        }

        const superLoad = self.load;
        self.load = ( req, widgets, callback ) => superLoad( req, widgets, async ( err ) =>
        {
            if( err )
            {
                return callback( err );
            }

            for( const widget of widgets )
            {
                let option = null;
                if( widget.promoType === "category" )
                {
                    option = await self.getCategory( widget.category, req.data.language );
                }

                if( widget.promoType === "characteristic" )
                {
                    option = await self.getCharacteristic( widget.characteristic, req.data.language );
                }

                if( widget.promoType === "destination" )
                {
                    option = await self.getDestination( widget.destination, req.data.language );
                }

                if( option )
                {
                    widget.title = option.label;
                }
                else
                {
                    widget.title = "";
                }

                if( widget.linkType === "minisite" )
                {
                    widget.redirectURL = widget.url;
                }
                else
                {
                    widget.redirectURL = "/" + req.data.language + widget.pages;
                    if( option )
                    {
                        widget.redirectURL = widget.redirectURL + "?" + widget.promoType + "=" + option.code;
                    }
                }
            }

            return callback( null );
        } );
    }
};
