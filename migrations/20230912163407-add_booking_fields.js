'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('booking', 'pickupDate', {
      type: Sequelize.DATE,
    
    }).then(() => {
      return queryInterface.addColumn('booking', 'dropOffDate', {
        type: Sequelize.DATE,
       
      });
    }).then(() => {
      return queryInterface.addColumn('booking', 'location', {
        type: Sequelize.STRING,
      }); 
    }).then(() => {
      return queryInterface.addColumn('booking', 'licenseNumber', {
        type: Sequelize.STRING,
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('booking', 'pickupDate')
      .then(() => queryInterface.removeColumn('booking', 'dropOffDate'))
      .then(() => queryInterface.removeColumn('booking', 'location'))
      .then(() => queryInterface.removeColumn('booking', 'licenseNumber'));
  }
};
