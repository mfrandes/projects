module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Inner page content',
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
                label: 'Content ' + languages[ idx ],
                type: 'singleton',
                widgetType: 'apostrophe-rich-text',
                options:
                {
                    toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink', 'Anchor', 'Table', 'BulletedList', 'Blockquote', 'Strike', 'Subscript', 'Superscript', 'Split' ]
                }
            };
            fields.push( contentField );
            translation.fields.push( 'content' + languages[ idx ] );
        }

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
        self.beforeSave = function( req, piece, options, callback )
        {
            piece.title = piece.slug;
            return callback();
        };
    }
};