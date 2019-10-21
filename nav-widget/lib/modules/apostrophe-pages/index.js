// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
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


    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ]
};
