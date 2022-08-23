import express from "express"
import MyfilesController from "./myfiles.controller.js"

const router = express.Router()

router.route("/").get(MyfilesController.apiGetContent)
    .post(MyfilesController.apiInsertContent)
    .put(MyfilesController.apiUpdateContent)
    .delete(MyfilesController.apiDeleteContent)

export default router