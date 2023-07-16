'use strict';
/* eslint-disable */
const { DataTypes, QueryTypes } = require('sequelize');
const ComFunc = require('../com-func');
//--------------------------------------
const tableName = 'web_log';
const tableComments = 'ブログ的な';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: 'ID',
        defaultValue: undefined,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'uuid',
      },
      web_log_title: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'たいとる',
      },
      web_log_content: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'コンテンツ',
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'image',
      },
      updated_at: { type: DataTypes.DATE(3), allowNull: false, comment: 'updated_at' },
      created_at: { type: DataTypes.DATE(3), allowNull: false, comment: 'created_at' },
    };
    await queryInterface.createTable(tableName, columns, {
      comment: tableComments,
      collate: 'utf8mb4_general_ci',
    });
    await ComFunc.IndexKey.Add(queryInterface, tableName, [
      //
      ['uuid'],
      ['web_log_title'],
      ['web_log_content'],
      ['updated_at'],
      ['created_at'],
    ]);
    // await ComFunc.UniqueKey.Add(queryInterface, tableName, [
    //   //
    //   // ['uuid'],
    // ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
