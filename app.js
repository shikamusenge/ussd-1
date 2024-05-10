const express = require("express");
const usersRoute = require("./router/users");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = 3005;
app.use(usersRoute);

app.listen(PORT, () =>
  console.log(`server started on http://localhost:${PORT}`)
);
