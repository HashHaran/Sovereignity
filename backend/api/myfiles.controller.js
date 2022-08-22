import MyfilesDAO from "../dao/myfilesDAO.js";

export default class MyfilesController {
    // static async apiGetMyfiles(req, res, next) {
    //     try {
    //         console.log(`params: ${req.params}`)
    //         let owner = req.params.owner || {};
    //         console.log(`owner: ${owner}`)
    //         const contents = await MyfilesDAO.getContentsForOwner(owner);
    //             if (!contents) {
    //                 res.status(404).json({ error: "Not found" });
    //             return
    //             }
    //         const response = {
    //             contents: contents,
    //             owner: owner
    //         }
            
    //         res.json(response);
    //     } catch (e) {
    //         console.log(`api, ${e}`);
    //         res.status(500).json({ error: e });
    //     }
    // }

    // static async apiGetFilesByContentId(req, res, next) {
    //   try {
    //       let cid = req.params.cid || {};
    //       let content = await MyfilesDAO.getContentForContentId(cid);
    //     if (!content) {
    //         res.status(404).json({ error: "Not found" });
    //       return
    //     }
    //     const response = {
    //         content: content,
    //         contentId: cid
    //     }
    //       res.json(response);
    //   } catch (e) {
    //       console.log(`api, ${e}`);
    //       res.status(500).json({ error: e });
    //   }
    // }

    static async apiGetContent(req, res, next) {
        try {
            if (req.query.cid) {
                const cid = req.query.cid;
                let content = await MyfilesDAO.getContentForContentId(cid);
                if (!content) {
                    res.status(404).json({ error: "Not found" });
                    return
                }
                const response = {
                    content: content,
                    contentId: cid
                }
                res.json(response);
            } else if (req.query.owner) {
                const owner = req.query.owner;
                const contents = await MyfilesDAO.getContentsForOwner(owner);
                if(!contents) {
                    res.status(404).json({ error: "Not found" });
                    return
                }
                const response = {
                    contents: contents,
                    owner: owner
                }
            
                res.json(response);
            } else {
                res.status(500).json({error: "Incorrect Query"})
            }
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiInsertContent(req, res, next) {
        try {
            const contentId = req.body.contentId;
            const encryptedSymKey = req.body.encryptedSymKey;
            const name = req.body.name;
            const owner = req.body.owner;

            const contentResponse = MyfilesDAO.insertContent(contentId, encryptedSymKey, name, owner);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
  }