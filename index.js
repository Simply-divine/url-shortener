const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const urlSchema = new Schema({
  url: String,
  alias: String,
});

const Url = mongoose.model('Url', urlSchema);

app.get('/', (req, res) => {
  //   console.log(req.params);
  res.json({ message: 'Welcome to URL shortener' });
});

//{url, alias}

app.get('/url/:alias', async (req, res) => {
  const alias = req.params.alias;
  try {
    const url = await Url.findOne({ alias });
    console.log(url.url);
    res.redirect(url.url);
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT | 3000;

app.post('/url', async (req, res) => {
  const { alias, url } = req.body;
  if (!alias) {
    alias = nanoid();
  }
  try {
    const urlObj = new Url({
      url,
      alias,
    });
    await urlObj.save();
    res.json({
      message: 'Successfully generated url',
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
