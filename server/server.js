const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/rss', async (req, res) => {
  try {
    const response = await axios.get('https://feeds.bbci.co.uk/news/england/rss.xml');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.listen(5175, () => {
  console.log('RSS proxy server listening on port 5175');
});
