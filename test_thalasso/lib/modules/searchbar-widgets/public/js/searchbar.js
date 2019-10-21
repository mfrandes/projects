$( document ).ready( function()
{
    var selectedCountry = null;
    var selectedCategory = null;
    var selectedDate = null;
    var options = $( '.top-search option' );

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

        if( selectedCategory )
        {
            if( visibleProducts )
            {
                visibleProducts = $( visibleProducts ).filter( selectedCategory );
            }
            else
            {
                visibleProducts = selectedCategory;
            }
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

    for( var idx = 0; idx < options.length; idx++ )
    {
        var products = options[ idx ].getAttribute( 'data-products' );
        if( products )
        {
            var productList = products.split( "," );
            options[ idx ].text = options[ idx ].text + " (" + productList.length + ")";
        }
    }

    $( '.top-search .country' ).on( 'change', function()
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

    $( '.top-search .category' ).on( 'change', function()
    {
        var products = $( ".category option:selected" )[ 0 ].getAttribute( 'data-products' );
        if( products )
        {
            selectedCategory = products.split( "," );
        }
        else
        {
            selectedCategory = null;
        }

        setOptionTextAndVisibility();
    } );

    $( '.top-search .date' ).on( 'change', function()
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

    $( '.top-search .search' ).on( 'click', function()
    {
        var redirectURL = this.getAttribute( 'data-url' );
        var language = this.getAttribute( 'data-language' );
        var countryOption = $( ".country option:selected" );
        var categoryOption = $( ".category option:selected" );
        var dateOption = $( ".date option:selected" );

        redirectURL = redirectURL + "#/list/what:" + categoryOption.val() + "/where:" + countryOption.val() + "/when:" + dateOption.val() + "/characteristic:ALL/lang:" + language;
        window.location.href = redirectURL;
    } );
} );

