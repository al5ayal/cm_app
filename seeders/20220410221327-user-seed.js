'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          full_name: 'Gebriel Alkhayal',
          user_name: 'al5',
          email: 'al5@localhost',
          password: '1234567890',
          user_group_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 1,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
