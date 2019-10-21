module.exports = {
    addFields: [
        {
            label: 'Default language',
            name: 'defaultLanguage',
            type: 'select',
            required: true,
            choices: [
                {
                    label: 'English',
                    value: 'en'
                },
                {
                    label: 'French',
                    value: 'fr'
                }
            ]
        }
    ]
};