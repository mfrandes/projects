const request = require( 'request-promise' );

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Listing widget',
    addFields: [
        {
            label: 'Country Area',
            name: 'countryArea',
            type: 'select',
            choices: 'getCountryAreaChoices'
        },
        {
            label: 'Category',
            name: 'category',
            type: 'select',
            choices: 'getCategoryChoices'
        },
        {
            label: 'Characteristic',
            name: 'characteristic',
            type: 'select',
            choices: 'getCharacteristicChoices'
        },
        {
            label: 'Start Date',
            name: 'startDate',
            type: 'date',
            pikadayOptions:
            {
                format: 'YYYY-MM-DD'
            }
        },
        {
            label: 'End Date',
            name: 'endDate',
            type: 'date',
            pikadayOptions:
            {
                format: 'YYYY-MM-DD'
            }
        },
        {
            label: 'Listing columns',
            name: 'listingColumns',
            type: 'integer'
        },
        {
            label: 'List length',
            name: 'listLength',
            type: 'integer'
        },
        {
            label: 'Display title',
            name: 'displayTitle',
            type: 'boolean'
        },
    ],
    arrangeFields: [
        {
            name: 'general',
            label: 'General settings',
            fields: [ 'countryArea', 'category', 'characteristic', 'startDate', 'endDate', 'listingColumns', 'listLength' ]
        }
    ],

    beforeConstruct: function( self, options )
    {
        var fields = [];
        var arrangements = [];
        var translation =
        {
            name: 'translation',
            label: 'Translation',
            fields: []
        };

        var languages = options.apos.i18n.getLocales();

        for( var idx = 0; idx < languages.length; idx++ )
        {
            var titleField =
            {
                name: 'title' + languages[ idx ],
                label: 'Title ' + languages[ idx ],
                type: 'string'
            };
            fields.push( titleField );
            translation.fields.push( 'title' + languages[ idx ] );
        }

        translation.fields.push( 'displayTitle' );

        arrangements.push( translation );

        var administrative =
        {
            name: 'admin',
            label: 'Administrative',
            fields: [ 'slug', 'published', 'tags' ]
        };
        arrangements.push( administrative );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        var minisiteURL = self.apos.options.settings.minisiteURL;

        self.getCountryAreaChoices = async function( req )
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
                            "value": "Country_Area",
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

        const superLoad = self.load;
        self.load = ( req, widgets, callback ) => superLoad( req, widgets, async ( err ) =>
        {
            if( err )
            {
                return callback( err );
            }

            for( const widget of widgets )
            {
                const query = {};
                if( widget.countryArea )
                {
                    query.countryArea = widget.countryArea;
                }

                if( widget.characteristic )
                {
                    query.characteristic = widget.characteristic;
                }

                if( widget.category )
                {
                    query.category = widget.category;
                }

                if( widget.startDate && widget.endDate )
                {
                    query.period =
                        {
                            "startDate": widget.startDate,
                            "endDate": widget.endDate
                        };
                }

                query.language = req.data.language;

                let productLimit = 9999;
                if( widget.listLength )
                {
                    productLimit = widget.listLength;
                }

                const products = await request( {
                    method: 'POST',
                    body: query,
                    uri: minisiteURL + "api/v1//web/productlist.json?count=" + productLimit + "&page=1&sort=id:asc",
                    json: true
                } );

                widget.products = products.items;
                console.log('called');
            }

            return callback( null );
        } );
    }
};
