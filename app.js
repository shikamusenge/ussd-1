const express = require("express");
const usersRoute = require("./router/users");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = 3005;
app.use(usersRoute);

app.listen(PORT, () =>
  console.log(`server started on http://localhost:${PORT}`)
);
