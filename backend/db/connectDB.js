const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hoot_and_howl', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql', // Replace with your database dialect (e.g., 'postgres', 'sqlite', etc.)
});



module.exports = sequelize;