const express = require("express");

const app = express();
app.use(express.json()); //sadece json verileri alınacaksa kullanılır
app.use('/users', require('./routes/userRoute.js'))
/* app.use(require('./routes/projectRoute.js'))
app.use(require('./routes/taskRoute.js'))
app.use(require('./routes/userRoute.js')) */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
