module.exports = {        
    extend: 'apostrophe-widgets',        
    label: 'Two Column', 
    skipInitialModal: true,
    addFields: [
      {
        name: 'areaLeft',
        type: 'area',
        label: 'Left Area',
      }
    ],
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
}