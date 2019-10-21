var path = require( 'path' );
var utilities = require( './lib/modules/utilities' );

var apos = require( 'apostrophe' )(
    {
        shortName: 'Thalasso',

        settings: {
            alias: 'settings',
            minisiteURL: 'http://thalasso.victoury.net/',
            imageLocation: 'https://thalasso.victoury.eu/files/thalasso/product/'
        },

        modules: {
            'apostrophe-templates': { viewsFolderFallback: path.join( __dirname, 'views' ) },
            'apostrophe-express': {
                middleware: [
                    function( req, res, next )
                    {
                        var languages = apos.i18n.getLocales();
                        var defaultLanguage = apos.i18n.getLocale();

                        languageSet = false;
                        for( var idx = 0; idx < languages.length; idx++ )
                        {
                            if( req.url.startsWith( '/' + languages[ idx ] ) )
                            {
                                req.url = req.url.substr( 3 );
                                req.data.language = languages[ idx ];
                                req.data.defaultLanguage = defaultLanguage;
                                req.data.languages = languages;
                                req.data.utilities = utilities;
                                req.data.url = req.url;
                                languageSet = true;

                                apos.i18n.setLocale( req, req.data.language );
                                apos.i18n.setLocale( res, req.data.language );
                                break;
                            }
                        }

                        if( languageSet )
                        {
                            if( req.url === '' )
                            {
                                req.url = '/';
                            }
                        }
                        else
                        {
                            req.redirect = '/' + defaultLanguage + req.url;
                        }

                        return next();
                    }
                ]
            },
            'apostrophe-i18n': {
                locales: [ 'en', 'fr' ],
                defaultLocale: 'fr',
                queryParameter: 'lang',
                updateFiles: false
            },
            'apostrophe-pages': {
                types: [
                    {
                        name: 'blog-page',
                        label: 'Blog folder (unique)'
                    },
                    {
                        name: 'testimonial-page',
                        label: 'Testimonial folder (unique)'
                    },
                    {
                        name: 'inner',
                        label: 'Inner page'
                    },
                    {
                        name: 'aboutus',
                        label: 'About us page'
                    },
                    {
                        name: 'home',
                        label: 'Home'
                    }
                ]
            },
            'blog': {},
            'blog-pages': {
                extend: 'apostrophe-pieces-pages',
                next: true,
                previous: true
            },
            'blog-widgets': {},
            'testimonial': {},
            'testimonial-pages': {
                extend: 'apostrophe-pieces-pages',
                next: true,
                previous: true
            },
            'testimonial-widgets': {},
            'promobox-widgets': {},
            'productslider-widgets': {},
            'mainslider': {},
            'mainslider-widgets': {},
            'searchbar-widgets': {},
            'simplesearchbar-widgets': {},
            'innerpagecontent-widgets': {},
            'aboutuspagecontent-widgets': {},
            'redirect-widgets': {},
            'followus-widgets': {},
            'contact-widgets': {},
            'menu-widgets': {},
            'listing-widgets': {},
            'apostrophe-site': {
                construct: function( self, options ) { },
                addImageSizes: [
                    {
                        name: 'max',
                        width: 1920,
                        height: 1080
                    }
                ],
            }
        }
    } );
