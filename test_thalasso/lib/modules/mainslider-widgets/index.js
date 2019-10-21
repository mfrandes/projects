module.exports = {
    extend: 'apostrophe-pieces-widgets',

    construct: function( self, options )
    {
        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'script', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'script', 'mainslider', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.carousel.min', { when: 'always' } );
            self.pushAsset( 'stylesheet', 'owl.theme.default.min', { when: 'always' } );
        };
    }
};
