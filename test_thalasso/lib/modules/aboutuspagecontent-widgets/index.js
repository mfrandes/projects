module.exports = {
    extend: 'apostrophe-widgets',
    label: 'About us page content',
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
                type: 'string'
            };
            fields.push( titleField );
            translation.fields.push( 'title' + languages[ idx ] );

            var contentField =
            {
                name: 'content' + languages[ idx ],
                label: 'First paragraph ' + languages[ idx ],
                type: 'singleton',
                widgetType: 'apostrophe-rich-text',
                options:
                {
                    toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink', 'Anchor', 'Table', 'BulletedList', 'Blockquote', 'Strike', 'Subscript', 'Superscript', 'Split' ]
                }
            };
            fields.push( contentField );
            translation.fields.push( 'content' + languages[ idx ] );

            var contentTwoField =
            {
                name: 'contentTwo' + languages[ idx ],
                label: 'Second paragraph ' + languages[ idx ],
                type: 'singleton',
                widgetType: 'apostrophe-rich-text',
                options:
                {
                    toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink', 'Anchor', 'Table', 'BulletedList', 'Blockquote', 'Strike', 'Subscript', 'Superscript', 'Split' ]
                }
            };
            fields.push( contentTwoField );
            translation.fields.push( 'contentTwo' + languages[ idx ] );
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
            label: 'About us image',
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
            label: 'About us image',
            fields: [ 'image' ]
        };
        arrangements.push( image );

        options.addFields = fields.concat( options.addFields || [] );
        options.arrangeFields = arrangements.concat( options.arrangeFields || [] );
    },

    construct: function( self, options )
    {
        self.beforeSave = function( req, piece, options, callback )
        {
            piece.title = piece.slug;
            return callback();
        };
    }
};