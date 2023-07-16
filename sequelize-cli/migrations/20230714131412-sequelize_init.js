'use strict';
/* eslint-disable */
const ComFunc = require('../com-func');
//--------------------------------------
const tableName = 'SequelizeMeta';
//--------------------------------------

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const con = ComFunc.GetConnection(queryInterface);
    const sql = `
      alter table "${tableName}"  enable row level security;
    `;
    await con.query(sql, { raw: false });
  },

  async down(queryInterface, Sequelize) {},
};
