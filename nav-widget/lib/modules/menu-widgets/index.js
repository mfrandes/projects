module.exports = {
    extend: 'apostrophe-widgets',
    label: 'New menu',
    addFields: [
        {
            name: 'inputEn',
            type: 'string',
            label: 'Set translations for this menu point in EN'
        },
        {
            name: 'inputNl',
            type: 'string',
            label: 'Set translations for this menu point in Nl'
        },
        {
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
    ]
};