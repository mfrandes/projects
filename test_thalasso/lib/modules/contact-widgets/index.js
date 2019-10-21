module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Contact widget',

    beforeConstruct: function( self, options )
    {
        var fields = [];
        var arrangements = [];
        var contactTranslation =
        {
            name: 'contactTranslation',
            label: 'Translation',
            fields: []
        };

        var languages = options.apos.i18n.getLocales();

        for( var idx = 0; idx < languages.length; idx++ )
        {
            var contact =
            {
                name: 'contactTranslation' + languages[ idx ],
                label: 'Contact ' + languages[ idx ],
                type: 'singleton',
                widgetType: 'apostrophe-rich-text',
                options:
                {
                    toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink', 'Anchor', 'Table', 'BulletedList', 'Blockquote', 'Strike', 'Subscript', 'Superscript', 'Split' ]
                }
            };
            fields.push( contact );
            contactTranslation.fields.push( 'contactTranslation' + languages[ idx ] );
        }

        arrangements.push( contactTranslation );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    }
};
