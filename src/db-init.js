require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

require('../models/Users.js')(sequelize, Sequelize.DataTypes)

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Database synced')

    sequelize.close()
  })
  .catch(console.error)
