require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Anonymous' }
});
const Quote = mongoose.model('Quote', quoteSchema);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/quotes', async (req, res) => {
  const quotes = await Quote.find();
  res.json(quotes);
});

app.get('/api/quotes/random', async (req, res) => {
  const count = await Quote.countDocuments();
  if (count === 0) return res.json({ text: 'No quotes yet — add one!', author: '' });
  const random = Math.floor(Math.random() * count);
  const quote = await Quote.findOne().skip(random);
  res.json(quote);
});

app.post('/api/quotes', async (req, res) => {
  const quote = new Quote(req.body);
  await quote.save();
  res.status(201).json(quote);
});

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`QuoteVault API on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message);
  });

//jjj