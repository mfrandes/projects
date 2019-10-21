module.exports = {
    extend: 'apostrophe-pieces',
    name: 'mainslider',
    label: 'Main slider',
    pluralLabel: 'Main sliders',
    addFields: [
        {
            name: 'title',
            label: 'Title',
            type: 'string',
            required: true,
            contextual: true
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

        var administrative =
        {
            name: 'admin',
            label: 'Administrative',
            fields: [ 'slug', 'published', 'tags' ]
        };

        arrangements.push( administrative );

        var imageField =
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
        };
        fields.push( imageField );

        var image =
        {
            name: 'image',
            label: 'Cover image',
            fields: [ 'image' ]
        };
        arrangements.push( image );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'stylesheet', 'mainslider', { when: 'always' } );
        };

        self.beforeSave = function( req, piece, options, callback )
        {
            piece.title = piece.slug;
            return callback();
        };
    }
};