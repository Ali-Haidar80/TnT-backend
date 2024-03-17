const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");

const PORT = 5000;

app.use(express.json());
app.use(cors({ origin: true }));

// To server uploaded files
app.use("/public", express.static(path.join(__dirname, "public")));

// routes
app.use("/admin", require("./routes/admin.route"));

app.listen(PORT, () => {
  console.log("server is listening at port", PORT);
});
