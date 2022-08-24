import MyfilesDAO from "../dao/myfilesDAO.js";

export default class MyfilesController {

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

            const contentResponse = await MyfilesDAO.insertContent(contentId, encryptedSymKey, name, owner);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateContent(req, res, next) {
        try {
            console.log(req.body);
            if (req.body.data.contentId && req.body.data.owner) {
                const contentId = req.body.data.contentId;
                const owner = req.body.data.owner;
                const updateResponse = await MyfilesDAO.updateContentOwner(contentId, owner);
                res.json({ status: "success" });
            } else {
                res.status(500).json({error: "Incorrect Body for updating content"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteContent(req, res, next) {
        try {
            if (req.query.contentId) {
                const contentId = req.query.contentId;
                const deleteResponse = await MyfilesDAO.deleteContent(contentId);
                res.json({ status: "success" });
            } else {
                res.status(500).json({error: "Incorrect Query"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

  }