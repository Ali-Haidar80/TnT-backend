const express = require("express");
const router = express.Router();
const {
  postData,
  getData,
  patchData,
  deleteData,
} = require("../services/admin.service");
const upload = require("../config/multerConfig");

router
  .route("/")
  .post(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
      { name: "giff", maxCount: 1 },
    ]),
    async function (req, res) {
      const data = await postData(req.body, req.files);
      if (data) {
        res.status(201).send("data inserted");
      } else {
        res.status(500).send("Ops something went wrong");
      }
    }
  )
  .patch(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
      { name: "giff", maxCount: 1 },
    ]),
    async function (req, res) {
      const resp = await patchData(req.body, req.files);
      if (resp) {
        res.status(200).send("data updated");
      } else {
        res.status(500).send("Ops something went wrong");
      }
    }
  )
  .delete(async function (req, res) {
    const params = req.query;
    const data = await deleteData(params);
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send("Ops something went wrong");
    }
  })
  .get(async function (req, res) {
    const data = await getData();
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send("Ops something went wrong");
    }
  });

module.exports = router;
