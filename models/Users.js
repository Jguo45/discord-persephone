module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'users',
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.TEXT,
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValues: 0,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  )
}
