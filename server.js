let express = require('express');
let app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

app.use('/', (req, res) => {
    res.send('index.html');
});

app.listen(PORT, () => {
    console.log('server start');
});
