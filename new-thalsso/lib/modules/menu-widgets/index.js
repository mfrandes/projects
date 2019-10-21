module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Menu Point',
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
        let subMenu = {
            name: 'subMenu',
            label: 'Sub-Menu Options',
            fields: []
        }

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

        const subMeniuField = {
            name: 'subMenuPoints',
            label: 'Sub-menu Points',
            type: 'area',
            options: {
                widgets: {
                    'sub-menu': {}
                }
            }
        };
        fields.push(subMeniuField);
        subMenu.fields.push('subMenuPoints');

        arrangements.push(menuPointTranslation);
        arrangements.push(menuPointPage)
        arrangements.push(subMenu)

        options.addFields = fields.concat(options.addFields || []);
        options.arrangeFields = arrangements.concat(options.arrangeFields || []);
    },
    construct: function (self, options) {
        self.beforeSave = function (req, widget, options, callback) {


            widget.pageSize = 'mobile';
            return callback();
        };
        var superPushAssets = self.pushAssets;
        self.pushAssets = function()
        {
            superPushAssets();
            self.pushAsset( 'stylesheet', 'always', { when: 'always' } );
        };
    }
};