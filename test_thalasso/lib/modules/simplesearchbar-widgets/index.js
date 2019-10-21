const request = require( 'request-promise' );
const moment = require( 'moment' );
const _ = require( 'lodash' );

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Searchbar widget',

    beforeConstruct: function( self, options )
    {
        var fields = [];
        var arrangements = [];
        var searchButtonTranslation =
        {
            name: 'searchButtonTranslation',
            label: 'Search button translation',
            fields: []
        };
        var destinationSelectorTranslation =
        {
            name: 'destinationSelectorTranslation',
            label: 'Destination selector translation',
            fields: []
        };
        var dateSelectorTranslation =
        {
            name: 'dateSelectorTranslation',
            label: 'Date selector translation',
            fields: []
        };

        var languages = options.apos.i18n.getLocales();

        for( var idx = 0; idx < languages.length; idx++ )
        {
            var searchButton =
            {
                name: 'searchButton' + languages[ idx ],
                label: 'Search button label ' + languages[ idx ],
                type: 'string'
            };
            fields.push( searchButton );
            searchButtonTranslation.fields.push( 'searchButton' + languages[ idx ] );

            var destinationSelect =
            {
                name: 'destinationSelect' + languages[ idx ],
                label: 'Destination selection label ' + languages[ idx ],
                type: 'string'
            };
            fields.push( destinationSelect );
            destinationSelectorTranslation.fields.push( 'destinationSelect' + languages[ idx ] );

            var dateSelect =
            {
                name: 'dateSelect' + languages[ idx ],
                label: 'Date selection label ' + languages[ idx ],
                type: 'string'
            };
            fields.push( dateSelect );
            dateSelectorTranslation.fields.push( 'dateSelect' + languages[ idx ] );
        }

        arrangements.push( searchButtonTranslation );
        arrangements.push( destinationSelectorTranslation );
        arrangements.push( dateSelectorTranslation );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        var minisiteURL = self.apos.options.settings.minisiteURL;

        self.loadCountryAreaChoices = async function( language )
        {
            const countryAreas = await request( {
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
                            "value": language,
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/choicelists/query.json?count=9999&page=1&sort=label:asc",
                json: true
            } );

            return countryAreas.items;
        }

        self.loadProducts = async function()
        {
            const products = await request( {
                method: 'POST',
                body: {
                    "operator": "AND",
                    "criterias": [
                        {
                            "field": "publishOnWeb",
                            "value": "true",
                            "qualifier": "="
                        }
                    ]
                },
                uri: minisiteURL + "api/v1/products/query.json?count=9999&page=1&sort=name:asc",
                json: true
            } );

            return products.items;
        }

        self.loadPrices = async function( products )
        {
            const startDate = moment().add( 1, 'days' ).format( "YYYY-MM-DD" );
            const endDate = moment( startDate ).add( 2, 'year' ).format( "YYYY-MM-DD" );
            const priceQuery =
            {
                operator: "AND",
                subQueries: [
                    {
                        operator: "OR",
                        subQueries: [
                            {
                                operator: "AND",
                                criterias: [
                                    {
                                        field: "seasonBegin",
                                        value: startDate,
                                        qualifier: "<="
                                    },
                                    {
                                        field: "seasonEnd",
                                        value: endDate,
                                        qualifier: ">="
                                    }
                                ]
                            },
                            {
                                operator: "AND",
                                criterias: [
                                    {
                                        field: "seasonBegin",
                                        value: startDate,
                                        qualifier: ">="
                                    },
                                    {
                                        field: "seasonBegin",
                                        value: endDate,
                                        qualifier: "<="
                                    }
                                ]
                            },
                            {
                                operator: "AND",
                                criterias: [
                                    {
                                        field: "seasonEnd",
                                        value: startDate,
                                        qualifier: ">="
                                    },
                                    {
                                        field: "seasonEnd",
                                        value: endDate,
                                        qualifier: "<="
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            const productsCriteria =
            {
                operator: "OR",
                criterias: []
            };

            for( const product of products )
            {
                const productCriteria =
                {
                    field: "product.id",
                    value: product.id,
                    qualifier: "="
                };
                productsCriteria.criterias.push( productCriteria );
            };

            if( productsCriteria.criterias.length > 0 )
            {
                priceQuery.subQueries.push( productsCriteria );
            }

            const prices = await request( {
                method: 'POST',
                body: priceQuery,
                uri: minisiteURL + "api/v1/prices/query.json?count=9999&page=1&sort=seasonBegin:asc",
                json: true
            } );

            return prices.items;
        }

        self.filterProducts = function( products, prices )
        {
            let productIdsArray = [];
            prices.forEach( price =>
            {
                productIdsArray.push( price.productId );
            } );
            productIdsArray = _.uniq( productIdsArray );
            products = products.filter(
                product => product.category && product.category !== "" && product.countryArea && product.countryArea !== ""
            );
            const filteredProducts = products.filter( product => productIdsArray.includes( product.id ) );

            return filteredProducts;
        }

        self.generateCountryAreaList = function( products, countryAreas )
        {
            let countryAreaList = [];
            for( product of products )
            {
                let newCountryArea = countryAreas.find( countryArea => countryArea.code === product.countryArea );
                if( newCountryArea )
                {
                    let existingCountryArea = countryAreaList.find( countryArea => countryArea.id === newCountryArea.id );
                    if( existingCountryArea )
                    {
                        existingCountryArea.products.push( product.id );
                    }
                    else
                    {
                        newCountryArea.products = [ product.id ];
                        countryAreaList.push( newCountryArea );
                    }
                }
            }

            return countryAreaList;
        }

        self.getDateIdentifierFromDate = function( date )
        {
            const currentYear = date.year();
            const currentMonth = date.month() + 1;

            const dateIdentifier = currentYear * 100 + currentMonth;

            return dateIdentifier;
        }

        self.generateDatesList = function( prices )
        {
            let datesList = [];
            const startDate = moment().add( 1, 'days' );
            const currentMonth = moment( startDate );

            const startingDatesMap = new Map();
            for( let month = 0; month < 24; month++ )
            {
                if( month !== 0 )
                {
                    currentMonth.add( 1, "month" );
                }

                startingDatesMap.set( currentMonth.format( "YYYY-MM" ), [] );
            }

            startingDatesMap.forEach( ( v, mm ) =>
            {
                const monthMoment = moment( mm );
                let monthlyPrices = [];
                prices.forEach( price =>
                {
                    if( monthMoment.isBetween( price.seasonBegin, price.seasonEnd, 'day', '[]' ) )
                    {
                        monthlyPrices.push( price );
                    }
                } );

                if( monthlyPrices.length > 0 )
                {
                    monthlyPrices = _.uniq( monthlyPrices );
                    startingDatesMap.set( mm, monthlyPrices );
                }
                else
                {
                    startingDatesMap.delete( mm );
                }
            } );

            startingDatesMap.forEach( ( storedPrices, k ) =>
            {
                let productIds = [];
                storedPrices.forEach( price =>
                {
                    productIds.push( price.productId );
                } );
                productIds = _.uniq( productIds );

                const formatedMonth = moment( ( k.substr( 5, 2 ) ), 'MM' ).format( 'MMMM' ); // September
                const formatedYear = k.substr( 0, 4 );

                let dateOption =
                {
                    label: formatedMonth + " " + formatedYear,
                    products: productIds,
                    code: k
                };

                datesList.push( dateOption );
            } );

            return datesList;
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
                const countryAreas = await self.loadCountryAreaChoices( req.data.language );
                const products = await self.loadProducts();
                const prices = await self.loadPrices( products );
                const filteredProducts = self.filterProducts( products, prices );
                const countryAreaList = self.generateCountryAreaList( filteredProducts, countryAreas );
                const datesList = self.generateDatesList( prices );

                widget.countryAreaList = countryAreaList;
                widget.datesList = datesList;
                widget.url = minisiteURL;
            }

            return callback( null );
        } );

        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'script', 'simplesearchbar', { when: 'always' } );
        };
    }
};
