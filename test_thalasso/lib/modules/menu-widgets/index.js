const request = require( 'request-promise' );

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Menu widget',

    beforeConstruct: function( self, options )
    {
        var fields = [];
        var arrangements = [];
        var homeTranslation =
        {
            name: 'homeTranslation',
            label: 'Home translation',
            fields: []
        };

        var aboutUsTranslation =
        {
            name: 'aboutUsTranslation',
            label: 'About us translation',
            fields: []
        };

        var contactTranslation =
        {
            name: 'contactTranslation',
            label: 'Contact translation',
            fields: []
        };

        var languages = options.apos.i18n.getLocales();

        for( var idx = 0; idx < languages.length; idx++ )
        {
            var homeMenu =
            {
                name: 'home' + languages[ idx ],
                label: 'Home menu ' + languages[ idx ],
                type: 'string'
            };
            fields.push( homeMenu );
            homeTranslation.fields.push( 'home' + languages[ idx ] );

            var aboutUs =
            {
                name: 'aboutUs' + languages[ idx ],
                label: 'About us menu ' + languages[ idx ],
                type: 'string'
            };
            fields.push( aboutUs );
            aboutUsTranslation.fields.push( 'aboutUs' + languages[ idx ] );

            var contact =
            {
                name: 'contact' + languages[ idx ],
                label: 'Contact menu ' + languages[ idx ],
                type: 'string'
            };
            fields.push( contact );
            contactTranslation.fields.push( 'contact' + languages[ idx ] );
        }

        arrangements.push( homeTranslation );
        arrangements.push( aboutUsTranslation );
        arrangements.push( contactTranslation );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        const superLoad = self.load;
        self.load = ( req, widgets, callback ) => superLoad( req, widgets, ( err ) =>
        {
            if( err )
            {
                return callback( err );
            }

            for( const widget of widgets )
            {
                widget.url = req.url.substr( 3 );
            }

            return callback( null );
        } );
    }
};
