const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV || 'development';
const getEnv = (env) => {
  const envFilePath = path.resolve(__dirname, '../', `.env${env === '' ? '' : '.' + env}`);
  console.info(`Sequelize:[ ENV: ${NODE_ENV} ] :: dotenv >> "${envFilePath}"`);
  const parseOutput = dotenv.parse(fs.readFileSync(envFilePath));
  const envConfig = {};
  for (const key in parseOutput) {
    // SEQUELIZE_ から始まる変数のみを扱うようにする
    if (/^SEQUELIZE_.+$/.test(key)) {
      envConfig[key] = parseOutput[key];
    }
  }
  return envConfig;
};
const configDefault = getEnv('');
// const configEnv = getEnv(NODE_ENV);
// const envConfig = { ...configDefault, ...configEnv };
const envConfig = configDefault;
const config = {
  host: envConfig.SEQUELIZE_HOST,
  port: envConfig.SEQUELIZE_PORT,
  username: envConfig.SEQUELIZE_USERNAME,
  password: envConfig.SEQUELIZE_PASSWORD,
  database: envConfig.SEQUELIZE_DATABASE,
  dialect: envConfig.SEQUELIZE_DIALECT,
  timezone: '+09:00',
  operatorsAliases: 0,
  logging: false,
};
console.info(`Sequelize:[ ENV: ${NODE_ENV} ] :: config >> ${config.host}:${config.host}/${config.database}`);
module.exports = config;
