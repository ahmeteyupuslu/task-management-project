const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json()); //sadece json verileri alınacaksa kullanılır
app.use(cors());

app.use('/users', require('./routes/userRoute.js'))
app.use('/project', require('./routes/projectRoute.js'))
app.use('/projectuser', require('./routes/projectUsersRoute.js'))
app.use('/task', require('./routes/taskRoute.js'))
app.use('/comment', require('./routes/commentRoute.js'))
app.use('/auth', require('./routes/authRoute.js'))



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
