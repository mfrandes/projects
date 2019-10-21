module.exports = {
    extend: 'apostrophe-pieces-widgets',
    limitByAll: 3,
    limitByTag: 3,
    construct: function( self, options )
    {
        for( var idx = 0; idx < options.addFields.length; idx++ )
        {
            if( options.addFields[ idx ].name === 'by' )
            {
                options.addFields[ idx ].label = 'Select... (only the first 3 will be displayed)';
                break;
            }
        }

        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'script', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'script', 'blogslider', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.theme.default.min', { when: 'always' } );
        };
    }
};
