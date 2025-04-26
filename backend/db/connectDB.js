const { Sequelize } = require('sequelize-cockroachdb');

const sequelize = new Sequelize("postgresql://preran:Zx1K904UjJ125wbEdoLHVA@poorer-katydid-10704.j77.aws-ap-south-1.cockroachlabs.cloud:26257/Hoot_and_howl?sslmode=verify-full");



module.exports = sequelize;