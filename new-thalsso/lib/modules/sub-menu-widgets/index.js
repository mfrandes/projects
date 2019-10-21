module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Sub-Menu Point',
    beforeConstruct: function (self, options) {
        let fields = [];
        let arrangements = [];
        let menuPointTranslation =
        {
            name: 'menuPointTranslation',
            label: 'Menu Point',
            fields: []
        };
        let menuPointPage = {
            name: 'menuPointPage',
            label: 'Page selector',
            fields: []
        };
        
        let languages = options.apos.i18n.getLocales();

        for (let idx = 0; idx < languages.length; idx++) {
            let menuPoint =
            {
                name: 'menuPoint' + languages[idx],
                label: 'Set translations for this menu point in ' + languages[idx],
                type: 'string'
            };
            fields.push(menuPoint);
            menuPointTranslation.fields.push('menuPoint' + languages[idx]);
        }

        const link = {
            name: 'link',
            label: 'Link Type',
            type: 'select',
            choices: [
                {
                    label: 'Page',
                    value: 'page',
                    showFields: ['_page']
                },
                {
                    label: 'Custom',
                    value: 'custom',
                    showFields: ['customUrl']
                }
            ]
        };

        fields.push(link);
        menuPointPage.fields.push('link');

        let menuSelectPage = {
            name: '_page',
            type: 'joinByOne',
            withType: 'apostrophe-page',
            label: 'Choose from a select the page the menu links to',
            required: true,
            idField: 'pageId',
            filters: {
                children: true,
                areas: false
            }
        }

        fields.push(menuSelectPage);
        menuPointPage.fields.push('_page');

        const customUrl = {
            name: 'customUrl',
            type: 'url',
            label: 'Link URL',
        };
        fields.push(customUrl);
        menuPointPage.fields.push('customUrl');

       

        arrangements.push(menuPointTranslation);
        arrangements.push(menuPointPage)

        options.addFields = fields.concat(options.addFields || []);
        options.arrangeFields = arrangements.concat(options.arrangeFields || []);
    },
    construct: function (self, options) {
        self.beforeSave = function (req, widget, options, callback) {


            widget.pageSize = 'mobile';
            return callback();
        };
    }
};