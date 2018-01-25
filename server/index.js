const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(`${__dirname}/../index.html`))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

const PORT = 3007;

app.listen(PORT, () => console.log(`color blender running on port ${PORT}`))
