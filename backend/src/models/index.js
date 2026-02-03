import { Sequelize } from 'sequelize';
import 'dotenv/config';
import dbConfig from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
  }
);

// Import models
import User from './User.js';
import Contact from './Contact.js';
import Company from './Company.js';
import Deal from './Deal.js';
import Task from './Task.js';
import Activity from './Activity.js';
import Email from './Email.js';
import Report from './Report.js';
import Integration from './Integration.js';

// Initialize models
const models = {
  User: User(sequelize),
  Contact: Contact(sequelize),
  Company: Company(sequelize),
  Deal: Deal(sequelize),
  Task: Task(sequelize),
  Activity: Activity(sequelize),
  Email: Email(sequelize),
  Report: Report(sequelize),
  Integration: Integration(sequelize),
};

// Setup associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize };
export default models;
