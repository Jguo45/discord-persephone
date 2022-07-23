const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const Users = require('../models/Users.js')(sequelize, Sequelize.DataTypes)

// Reflect.defineProperty(Users.prototype, 'addItem', {
//   value: async function addItem(item) {

//   }
// })

module.exports = { Users }
