import express from "express"
import MyfilesController from "./myfiles.controller.js"

const router = express.Router()

router.route("/").get(MyfilesController.apiGetContent)
    .post(MyfilesController.apiInsertContent)

export default router