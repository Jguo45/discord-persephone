module.exports = {
  fg_coin_create(db) {
    const query = db.prepare(
      `CREATE TABLE IF NOT EXISTS coin (ownerID INTEGER, ownerName TEXT, amount INTEGER)`
    )
  },

  createTable(db) {
    const query = db.prepare(
      `CREATE TABLE IF NOT EXISTS mailbox (message TEXT , author TEXT);`
    )
    query.run()
  },

  addMessage(db, message, author) {
    const query = db.prepare(
      `INSERT INTO mailbox(message, author) VALUES (?,?);`
    )
    query.run(message, author)
  },

  openMailbox(db) {
    const query = db.prepare('SELECT * FROM mailbox;')

    return query
  },

  getNumMessages(db) {
    const query = db.prepare(`SELECT COUNT(message) FROM mailbox;`)
    const result = query.get()
    return result[Object.keys(result)[0]]
  },

  clearTable(db) {
    const query = db.prepare(`DELETE FROM mailbox;`)
    query.run()
    this.createTable(db)
  },
}
