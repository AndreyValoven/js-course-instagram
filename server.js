let express = require('express');
let app = express();
const PORT = process.env.PORT || 5000;

app.use('/', (req, res) => {
    res.send('Server start');
});

app.listen(PORT, () => {
    console.log('server start');
});
