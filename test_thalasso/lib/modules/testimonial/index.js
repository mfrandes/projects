module.exports = {
    extend: 'apostrophe-pieces',
    name: 'testimonial',
    label: 'Testimonial',
    pluralLabel: 'Testimonials',
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

            var shortContentField =
            {
                name: 'shortContent' + languages[ idx ],
                label: 'Short Content ' + languages[ idx ],
                type: 'string',
                contextual: true
            };
            fields.push( shortContentField );
            translation.fields.push( 'shortContent' + languages[ idx ] );
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
        var languages = options.apos.i18n.getLocales();

        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'stylesheet', 'testimonial', { when: 'always' } );
        };

        self.beforeSave = function( req, piece, options, callback )
        {
            piece.title = piece.slug;
            for( var idx = 0; idx < languages.length; idx++ )
            {
                if( piece[ 'content' + languages[ idx ] ].items.length === 0 )
                {
                    piece[ 'shortContent' + languages[ idx ] ] = "";
                }
                else
                {
                    var cleanContent = piece[ 'content' + languages[ idx ] ].items[ 0 ].content.replace( /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "" );
                    if( cleanContent.length > 500 )
                    {
                        piece[ 'shortContent' + languages[ idx ] ] = cleanContent.substring( 0, 500 ) + "...";
                    }
                    else
                    {
                        piece[ 'shortContent' + languages[ idx ] ] = cleanContent;
                    }
                }
            }

            return callback();
        };
    }
};