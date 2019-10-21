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
    }
};
