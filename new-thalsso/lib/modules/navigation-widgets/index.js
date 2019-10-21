module.exports = {        
    extend: 'apostrophe-widgets',        
    label: 'Navigation Bar', 
    skipInitialModal: true,
    addFields: [
      {
        name: 'logoArea',
        type: 'area',
        label: 'Logo Area',
      },
      {
        name: 'menuArea',
        type: 'area',
        label: 'Menu Area',
      },
      {
        name: 'langArea',
        type: 'area',
        label: 'Lang Area',
      }
    ]     
  };