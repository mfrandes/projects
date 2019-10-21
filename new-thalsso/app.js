var path = require('path');
var utilities = require('./lib/modules/utilities');

var apos = require('apostrophe')({
  shortName: 'new-thalsso',

  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {

    // Apostrophe module configuration

    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.
    
    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    // If a template is not found somewhere else, serve it from the top-level
    // `views/` folder of the project

    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
    
    
    //Language and locals
    'apostrophe-express': {
      middleware: [
        function (req, res, next) {
          var languages = apos.i18n.getLocales();
          var defaultLanguage = apos.i18n.getLocale();

          languageSet = false;
          for (var idx = 0; idx < languages.length; idx++) {
            if (req.url.startsWith('/' + languages[idx])) {
              req.url = req.url.substr(3);
              req.data.language = languages[idx];
              req.data.defaultLanguage = defaultLanguage;
              req.data.languages = languages;
              req.data.utilities = utilities;
              req.data.url = req.url;
              languageSet = true;

              apos.i18n.setLocale(req, req.data.language);
              apos.i18n.setLocale(res, req.data.language);
              break;
            }
          }

          if (languageSet) {
            if (req.url === '') {
              req.url = '/';
            }
          }
          else {
            req.redirect = '/' + defaultLanguage + req.url;
          }

          return next();
        }
      ]
    },
    'apostrophe-i18n': {
      locales: ['en', 'de', 'fr', 'nl'],
      defaultLocale: 'en',
      queryParameter: 'lang',
      updateFiles: false
    },

    //Navigation
    'navigation-widgets':{},
    'menu-widgets':{},
    'langselector-widgets':{},
    'sub-menu-widgets': {}
  }
});
