import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import MyfilesDAO from "./dao/myfilesDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.SOVEREIGNITY_DB_URI,
  {
    wtimeout: 2500 }
  )
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
    .then(async client => {
      await MyfilesDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })