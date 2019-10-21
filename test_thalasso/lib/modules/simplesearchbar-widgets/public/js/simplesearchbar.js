$( document ).ready( function()
{
    var selectedCountry = null;
    var selectedDate = null;
    var options = $( '.simple-top-search option' );

    function cleanOption( option )
    {
        var position = option.text.lastIndexOf( '(' );
        if( position !== -1 )
        {
            option.text = option.text.substring( 0, position - 1 );
        }
    }

    function setOptionTextAndVisibility()
    {
        var visibleProducts = null;
        if( selectedCountry )
        {
            visibleProducts = selectedCountry;
        }

        if( selectedDate )
        {
            if( visibleProducts )
            {
                visibleProducts = $( visibleProducts ).filter( selectedDate );
            }
            else
            {
                visibleProducts = selectedDate;
            }
        }

        for( var idx = 0; idx < options.length; idx++ )
        {
            cleanOption( options[ idx ] );
            var products = options[ idx ].getAttribute( 'data-products' );
            if( products )
            {
                var productList = products.split( "," );
                if( visibleProducts )
                {
                    var matchingProducts = $( visibleProducts ).filter( productList );
                    if( matchingProducts.length > 0 )
                    {
                        options[ idx ].text = options[ idx ].text + " (" + matchingProducts.length + ")";
                        options[ idx ].hidden = false;
                    }
                    else
                    {
                        options[ idx ].hidden = true;
                    }
                }
                else
                {
                    options[ idx ].text = options[ idx ].text + " (" + productList.length + ")";
                    options[ idx ].hidden = false;
                }
            }
        }
    }

    function getUrlParameters()
    {
        var paramters = [];
        var hash;
        var hashes = window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ).split( '&' );
        for( var i = 0; i < hashes.length; i++ )
        {
            hash = hashes[ i ].split( '=' );
            paramters.push( hash[ 0 ] );
            paramters[ hash[ 0 ] ] = hash[ 1 ];
        }
        return paramters;
    }

    for( var idx = 0; idx < options.length; idx++ )
    {
        var products = options[ idx ].getAttribute( 'data-products' );
        if( products )
        {
            var productList = products.split( "," );
            options[ idx ].text = options[ idx ].text + " (" + productList.length + ")";
        }
    }

    $( '.simple-top-search .country' ).on( 'change', function()
    {
        var products = $( ".country option:selected" )[ 0 ].getAttribute( 'data-products' );
        if( products )
        {
            selectedCountry = products.split( "," );
        }
        else
        {
            selectedCountry = null;
        }

        setOptionTextAndVisibility();
    } );

    $( '.simple-top-search .date' ).on( 'change', function()
    {
        var products = $( ".date option:selected" )[ 0 ].getAttribute( 'data-products' );
        if( products )
        {
            selectedDate = products.split( "," );
        }
        else
        {
            selectedDate = null;
        }

        setOptionTextAndVisibility();
    } );

    $( '.simple-top-search .search' ).on( 'click', function()
    {
        var redirectURL = this.getAttribute( 'data-url' );
        var language = this.getAttribute( 'data-language' );
        var countryOption = $( ".country option:selected" );
        var dateOption = $( ".date option:selected" );

        var category = "ALL";
        var characteristic = "ALL";
        var parameters = getUrlParameters();
        for( var i = 0; i < parameters.length; i++ )
        {
            if( parameters[ i ] === "category" )
            {
                category = parameters[ parameters[ i ] ];
            }
            if( parameters[ i ] === "characteristic" )
            {
                characteristic = parameters[ parameters[ i ] ];
            }
        }

        redirectURL = redirectURL + "#/list/what:" + category + "/where:" + countryOption.val() + "/when:" + dateOption.val() + "/characteristic:"
            + characteristic + "/lang:" + language;
        window.location.href = redirectURL;
    } );
} );