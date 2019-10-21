const request = require( 'request-promise' );
const moment = require( 'moment' );

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Product slider widget',
    addFields: [
        {
            label: 'Products',
            name: 'products',
            type: 'checkboxes',
            required: true,
            choices: 'getProductChoices'
        }
    ],
    arrangeFields: [
        {
            name: 'general',
            label: 'General settings',
            fields: [ 'products' ]
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
                type: 'singleton',
                widgetType: 'apostrophe-rich-text',
                options:
                {
                    toolbar: [ 'Bold', 'Italic', 'Strike', 'Subscript', 'Superscript', 'Split' ]
                }
            };
            fields.push( titleField );
            translation.fields.push( 'title' + languages[ idx ] );
        }

        arrangements.push( translation );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        var minisiteURL = self.apos.options.settings.minisiteURL;
        var imageLocation = self.apos.options.settings.imageLocation;

        self.getProductChoices = async function( req )
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

            var choiceList = [];
            for( idx = 0; idx < products.totalRecords; idx++ )
            {
                var option = {
                    label: products.items[ idx ].name,
                    value: products.items[ idx ].id
                };

                choiceList.push( option );
            }
            return choiceList;
        }

        self.loadProductName = async function( product, language )
        {
            const textQuery =
            {
                operator: "OR",
                criterias: [
                    {
                        field: "product.id",
                        value: product.id,
                        qualifier: "="
                    }
                ]
            };

            const productText = await request( {
                method: 'POST',
                body: textQuery,
                uri: minisiteURL + "api/v1/producttexts/query.json?count=9999&page=1&language=" + language,
                json: true
            } );
            const productTextList = productText.items;

            let name = "";
            if( productTextList && productTextList[ 0 ].productName && productTextList[ 0 ].productName.text )
            {
                name = productTextList[ 0 ].productName.text;
            }
            else if( product.name )
            {
                name = product.name;
            }
            else
            {
                name = 'No name';
            }

            name = name.replace( /<(?:.|\n)*?>/gm, '' );

            return name;
        }

        self.loadProducts = async function( productIds )
        {
            var criterias = [];
            for( const productId of productIds )
            {
                const productCriteria =
                {
                    "field": "id",
                    "value": productId,
                    "qualifier": "="
                };
                criterias.push( productCriteria );
            }

            const productList = await request( {
                method: 'POST',
                body: {
                    "operator": "OR",
                    "criterias": criterias
                },
                uri: minisiteURL + "api/v1/products/query.json?count=9999&page=1&sort=id:asc",
                json: true
            } );

            return productList.items;
        }

        self.loadPrices = async function( productIds )
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

            for( const productId of productIds )
            {
                const productCriteria =
                {
                    field: "product.id",
                    value: productId,
                    qualifier: "="
                };
                productsCriteria.criterias.push( productCriteria );
            };

            if( productsCriteria.criterias.length > 0 )
            {
                priceQuery.subQueries.push( productsCriteria );
            }

            const priceList = await request( {
                method: 'POST',
                body: priceQuery,
                uri: minisiteURL + "api/v1/prices/query.json?count=9999&page=1&sort=seasonBegin:asc",
                json: true
            } );

            return priceList.items;
        }

        self.loadAllotmentsAndAvailabilities = async function( product )
        {
            if( product.hasAllotments )
            {
                const allotments = await request( {
                    method: 'GET',
                    uri: minisiteURL + "api/v1/products/" + product.id + "allotments.json?count=9999&page=1&sort=startDate:asc",
                    json: true
                } );
                const allotmentList = allotments.items;
                return allotmentList;
            }

            return [];
        }

        self.getDateIdentifierFromDate = function( date )
        {
            const currentYear = date.year();
            const currentMonth = date.month() + 1;

            const dateIdentifier = currentYear * 100 + currentMonth;

            return dateIdentifier;
        }

        self.initialiseStartingDatesMap = function()
        {
            const startDate = moment().add( 1, 'days' );
            const currentMonth = moment( startDate );

            const startingDatesMap = new Map();
            for( let month = 0; month < 24; month++ )
            {
                if( month !== 0 )
                {
                    currentMonth.add( 1, "month" );
                }
                const dateIdentifier = parseInt( currentMonth.format( "YYYYMM" ) );
                startingDatesMap.set( dateIdentifier, [] );
            }

            return startingDatesMap;
        }

        self.generateStartingDates = function( product, productAllotments, prices )
        {
            if( product.hasAllotments )
            {
                const startingDatesMap = self.initialiseStartingDatesMap();

                productAllotments.forEach( productAllotment =>
                {
                    const startDateIdentifier = this.getDateIdentifierFromDate( productAllotment.startDate );
                    if( startingDatesMap.has( startDateIdentifier ) )
                    {
                        const filteredPrices = prices.filter( price =>
                            moment( price.seasonBegin ) <= productAllotment.startDate && moment( price.seasonEnd ) >= productAllotment.endDate );
                        if( filteredPrices.length !== 0 )
                        {
                            const startingDates = startingDatesMap.get( startDateIdentifier );
                            filteredPrices.forEach( price =>
                            {
                                const newStartingDate =
                                {
                                    startDate: productAllotment.startDate,
                                    price: price
                                }

                                startingDates.push( newStartingDate );
                            } );
                            startingDatesMap.set( startDateIdentifier, startingDates );
                        }
                    }
                } );

                return startingDatesMap;
            }
            else
            {
                return self.initialiseStartingDatesMap();
            }
        }

        self.resolveProductPrice = function( startingDates, prices )
        {
            var discount = null;
            const startDateIdentifier = this.getDateIdentifierFromDate( moment().add( 1, 'day' ) );

            let foundAny = false;
            startingDates.forEach( ( value, key ) =>
            {
                if( !foundAny )
                {
                    if( key >= startDateIdentifier )
                    {
                        if( value.length !== 0 )
                        {
                            if( value[ 0 ].cataloguePrice !== 0 )
                            {
                                discount = Math.floor( ( ( value[ 0 ].cataloguePrice - value[ 0 ].sellTotalPrice ) * 100 ) / value[ 0 ].cataloguePrice );
                            }
                            foundAny = true;
                        }
                    }
                }
            } );

            if( !foundAny )
            {
                if( prices.length > 0 )
                {
                    let lowestPrice = prices[ 0 ];
                    prices.forEach( filteredPrice =>
                    {
                        if( filteredPrice.sellTotalPrice < lowestPrice.sellTotalPrice )
                        {
                            lowestPrice = filteredPrice;
                        }
                    } );

                    if( lowestPrice.cataloguePrice !== 0 )
                    {
                        discount = Math.floor( ( ( lowestPrice.cataloguePrice - lowestPrice.sellTotalPrice ) * 100 ) / lowestPrice.cataloguePrice );
                    }
                }
            }

            return discount;
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
                const productList = await self.loadProducts( widget.products );
                const priceList = await self.loadPrices( widget.products );

                var productBoxes = [];

                for( const product of productList )
                {
                    const productName = await self.loadProductName( product, req.data.language );
                    const allotments = await self.loadAllotmentsAndAvailabilities( product );
                    const prices = priceList.filter( price => price.productId === product.id );
                    const startingDates = self.generateStartingDates( product, allotments, prices );
                    const discount = self.resolveProductPrice( startingDates, prices );

                    var productBox =
                    {
                        productName: productName,
                        image: imageLocation + product.fileName,
                        discount: discount,
                        url: minisiteURL + "/#/details/" + product.id + "/lang:" + req.data.language
                    };

                    productBoxes.push( productBox );
                }

                widget.productBoxes = productBoxes;
            }
            return callback( null );
        } );

        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'script', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'script', 'productslider', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.theme.default.min', { when: 'always' } );
        };
    }
};
