const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const helmet = require('helmet');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
require('mongoose-type-url');
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
// app.use(helmet());

// if (process.env.NODE_ENV === 'production') {

// }
app.use(express.static('client/build'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  alias: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[\w\-]*$/.test(v);
      },
      message: (props) => `Alias format incorrect!`,
    },
    unique: true,
  },
  url: {
    type: mongoose.SchemaTypes.Url,
    required: [true, 'Please enter URL!!'],
  },
});

const Url = mongoose.model('Url', urlSchema);

const PORT = process.env.PORT | 1337;

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  if (!alias) {
    alias = nanoid(5);
  }
  alias = alias.toLowerCase();
  try {
    const urlObj = new Url({
      url,
      alias,
    });
    await urlObj.save();
    res.json({
      alias,
      message: 'Successfully generated url',
    });
  } catch (err) {
    next(err);
  }
});

app.get('/:alias', async (req, res, next) => {
  const alias = req.params.alias.toLowerCase();
  try {
    const { url } = await Url.findOne({ alias });
    console.log(url);
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  if (error.name === 'MongoError') {
    res.status(500);
  }
  res.json({
    stack: process.env.NODE_ENV === 'production' ? '🍮' : error.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
