const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const UserTg = sequelize.define('telegram_users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING(191), unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    wrong: {type: DataTypes.INTEGER, defaultValue: 0},
})
const Job = sequelize.define('jobs', {
    id: {type: DataTypes.INTEGER(10), primaryKey: true, unique: true, autoIncrement: true},
    title: {type: DataTypes.TEXT},
    slug: {type: DataTypes.STRING(191)},
    company_id: {type: DataTypes.INTEGER(10)},
    job_description: {type: DataTypes.TEXT('medium')},
    job_requirement: {type: DataTypes.TEXT('medium')},
    total_positions: {type: DataTypes.INTEGER(11)},
    location_id: {type: DataTypes.INTEGER(10)},
    category_id: {type: DataTypes.INTEGER(10)},
    start_date: {type: DataTypes.DATE},
    end_date: {type: DataTypes.DATE},
    status: {type: DataTypes.ENUM('active','inactive')},
    required_columns: {type: DataTypes.TEXT},
    created_at: {type: DataTypes.DATE},
    updated_at: {type: DataTypes.DATE},
    priority: {type: DataTypes.INTEGER(11)},
})
const JobCategories = sequelize.define('job_categories', {
    id: {type: DataTypes.INTEGER(10), primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    created_at: {type: DataTypes.DATE},
    updated_at: {type: DataTypes.DATE},
})
const JobLocations = sequelize.define('job_locations', {
    id: {type: DataTypes.INTEGER(10), primaryKey: true, unique: true, autoIncrement: true},
    location: {type: DataTypes.STRING(191)},
    country_id: {type: DataTypes.INTEGER(10)},
    created_at: {type: DataTypes.DATE},
    updated_at: {type: DataTypes.DATE},
})
module.exports = { UserTg, Job, JobCategories, JobLocations};
