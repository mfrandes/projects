const request = require('request-promise');

module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Language',
    contextualOnly: true,
    
    

    construct: function (self, options) {
        const superLoad = self.load;
        self.load = (req, widgets, callback) => superLoad(req, widgets, (err) => {
            if (err) {
                return callback(err);
            }

            for (const widget of widgets) {
                widget.url = req.url.substr(3);
            }

            return callback(null);
        });
    }
};