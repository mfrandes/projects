module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Follow us widget',
    addFields: [
        {
            type: 'url',
            name: 'facebook',
            label: 'Facebook link'
        },
        {
            type: 'url',
            name: 'google',
            label: 'Google plus link'
        },
        {
            type: 'url',
            name: 'instagram',
            label: 'Instagram link'
        },
        {
            type: 'url',
            name: 'linkedin',
            label: 'LinkedIn link'
        },
        {
            type: 'url',
            name: 'twitter',
            label: 'Twitter link'
        },
    ],

    beforeConstruct: function( self, options )
    {
        var fields = [];
        var arrangements = [];
        var labelTranslation =
        {
            name: 'labelTranslation',
            label: 'Translation',
            fields: []
        };

        var languages = options.apos.i18n.getLocales();

        for( var idx = 0; idx < languages.length; idx++ )
        {
            var label =
            {
                name: 'label' + languages[ idx ],
                label: 'Follow us label ' + languages[ idx ],
                type: 'string'
            };
            fields.push( label );
            labelTranslation.fields.push( 'label' + languages[ idx ] );
        }

        arrangements.push( labelTranslation );

        var links =
        {
            name: 'links',
            label: 'Links',
            fields: [ 'facebook', 'google', 'instagram', 'linkedin', 'twitter' ]
        };
        arrangements.push( links );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    }
};
