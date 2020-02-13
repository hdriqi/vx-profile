const { MongoClient } = require('mongodb')

class Db {
  constructor() {
    this.profile = null
  }

  async init() {
    const dbCon = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
			useUnifiedTopology: true
    })
    this.profile = dbCon.db('profile')
  }
}

module.exports = Db