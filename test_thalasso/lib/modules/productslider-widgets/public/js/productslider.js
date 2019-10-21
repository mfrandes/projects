$( '.product-slider' ).owlCarousel( {
    margin: 0,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
            autoWidth: false
        },
        700: {
            items: 1,
            autoWidth: false
        },
        1200: {
            items: 3,
            autoWidth: true,
        }
    }
} )