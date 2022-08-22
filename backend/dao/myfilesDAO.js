import { ObjectId } from "mongodb"

let myfiles

export default class MyfilesDAO {
    static async injectDB(conn) {
        if (myfiles) {
          return
        }
        try {
            myfiles = await conn.db(process.env.SOVEREIGNITY_NS).collection("content")
        } catch (e) {
          console.error(
            `Unable to establish a collection handle in myfilesDAO: ${e}`,
          )
        }
    }
    
    static async getContentsForOwner(owner) {
        let contents, cursor;
        try {
            console.log(`owner: ${owner}`)
            cursor = await myfiles.find({ "owner": {$eq: owner} })
            console.log(`cursor: ${cursor}`)
            contents = await cursor.toArray()
            return contents
        } catch (e) {
            console.error(`Unable to get contents for owner: ${owner}, ERROR: ${e}`)
            return contents
        }
    }

    static async getContentForContentId(contentId) {
        let contents;
        try {
            contents = await myfiles.findOne({ contentId: contentId })
            return contents
        } catch (e) {
            console.error(`Unable to get contents for contentId: ${contentId}, ERROR: ${e}`)
            return contents
        }
    }

    static async insertContent(contentId, encryptedSymKey, name, owner) {
        try {
            return await myfiles.insertOne({ contentId, encryptedSymKey, name, owner })
        } catch (e) {
            console.error(`Unable to insert content for contentId: ${contentId}, encryptedSymKey: ${encryptedSymKey}, name: ${name}, owner: ${owner}, ERROR: ${e}`)
        }
    }
}