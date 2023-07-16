/* -------------------------------------------------
マイグレーションで使用する関数群
------------------------------------------------- */
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const ComFunc = {
  GetSupabaseClient: function () {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const envFilePath = path.resolve(__dirname, '../', `.env${NODE_ENV === 'development' ? '' : '.' + NODE_ENV}`);
    // console.info(`Sequelize:[ ENV: ${NODE_ENV} ] :: dotenv >> "${envFilePath}"`);
    const parseOutput = dotenv.parse(fs.readFileSync(envFilePath));
    let url = undefined;
    let roleKey = undefined;
    for (const key in parseOutput) {
      if (/^SUPABASE_URL$/.test(key)) {
        url = parseOutput[key];
      }
      if (/^SUPABASE_SERVICE_KEY$/.test(key)) {
        roleKey = parseOutput[key];
      }
    }
    if (url && roleKey) {
      return createClient(url, roleKey);
    } else {
      console.log('環境変数の取得に失敗 ※Supabase用', 'url', url, ' roleKey', roleKey);
    }
    return null;
  },
  /**
   * マイグレーションファイルから下記のようにして使用する
   * const con = ComFunc.GetConnection(queryInterface);
   * const sql = 'select * from m_code';
   * const ret = await con.query(sql, { raw: false });
   */
  GetConnection: function (queryInterface) {
    const Sequelize = require('sequelize');
    const SequelizeConf = {
      host: queryInterface.sequelize.options.host,
      port: queryInterface.sequelize.options.port,
      dialect: queryInterface.sequelize.options.dialect,
      timezone: '+09:00',
      logging: false, // ← 追記
      dialectOptions: {
        timezone: '+09:00',
        dateStrings: true,
        typeCast: function (field, next) {
          if (field.type === 'DATETIME') {
            return field.string();
          }
          return next();
        },
      },
    };
    return new Sequelize(
      queryInterface.sequelize.config.database,
      queryInterface.sequelize.options.username,
      queryInterface.sequelize.options.password,
      SequelizeConf
    );
  },
  IndexKey: {
    Add: async function (queryInterface, tableName, setIndexList) {
      const setIndexListCount = setIndexList.length;
      for (let i = 0; i < setIndexListCount; i++) {
        if (setIndexList[i].length === 0) continue;
        const indexName = tableName + '__' + setIndexList[i][0] + '_index';
        const indexList = [];
        const setIndexListChildCount = setIndexList[i].length;
        for (let j = 0; j < setIndexListChildCount; j++) {
          if (setIndexList[i][j] !== '') {
            indexList.push(setIndexList[i][j]);
          }
        }
        await queryInterface.addIndex(tableName, indexList, {
          name: indexName,
        });
      }
    },
    Remove: async function (queryInterface, tableName, setIndexList) {
      const setIndexListCount = setIndexList.length;
      for (let i = 0; i < setIndexListCount; i++) {
        if (setIndexList[i].length === 0) continue;
        const indexName = tableName + '__' + setIndexList[i][0] + '_index';
        await queryInterface.removeIndex(tableName, indexName);
      }
    },
  },
  UniqueKey: {
    Add: async function (queryInterface, tableName, setIndexList) {
      const setIndexListCount = setIndexList.length;
      for (let i = 0; i < setIndexListCount; i++) {
        if (setIndexList[i].length === 0) continue;
        const indexName = tableName + '__' + setIndexList[i][0] + '_uq_index';
        const indexList = [];
        const setIndexListChildCount = setIndexList[i].length;
        for (let j = 0; j < setIndexListChildCount; j++) {
          if (setIndexList[i][j] !== '') {
            indexList.push(setIndexList[i][j]);
          }
        }
        await queryInterface.addIndex(tableName, indexList, {
          name: indexName,
          unique: true,
        });
      }
    },
    Remove: async function (queryInterface, tableName, setIndexList) {
      const setIndexListCount = setIndexList.length;
      for (let i = 0; i < setIndexListCount; i++) {
        if (setIndexList[i].length === 0) continue;
        const indexName = tableName + '__' + setIndexList[i][0] + '_uq_index';
        await queryInterface.removeIndex(tableName, indexName);
      }
    },
  },
  Column: {
    Change: async function (queryInterface, tableName, scheme) {
      const keys = Object.keys(scheme);
      for (let i = 0; i < keys.length; i++) {
        await queryInterface.changeColumn(tableName, keys[i], scheme[keys[i]]);
      }
    },
    Add: async function (queryInterface, tableName, scheme) {
      const keys = Object.keys(scheme);
      for (let i = 0; i < keys.length; i++) {
        await queryInterface.addColumn(tableName, keys[i], scheme[keys[i]]);
      }
    },
    Remove: async function (queryInterface, tableName, scheme) {
      const keys = Object.keys(scheme);
      for (let i = 0; i < keys.length; i++) {
        await queryInterface.removeColumn(tableName, keys[i]);
      }
    },
  },
};

module.exports = ComFunc;
