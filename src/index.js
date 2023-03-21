const express = require('express');
const app = express();
var cors = require("cors");

//agregar cors a esta api
app.use(cors());
//settings
app.set('port', process.env.PORT || 8001);

//midleware
app.use(express.json());

//routes
/* app.use("/api/test/", require("./routes/test")); */

app.use("/", require("./routes/index.js"));

//run
app.listen(app.get('port'), () => {
    console.log("server running on ", app.get('port'));
})