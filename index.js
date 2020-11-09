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

const urlSchema = new Schema({
  alias: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\w\-]*$/.test(v);
      },
      message: props => `Alias format incorrect!`
    },
    unique: true
  },
  url: {
    type: String,
    required: [true, 'Please enter URL!!']
  }
});

const Url = mongoose.model('Url', urlSchema);

// app.get('/',  (req, res) => {
//   res.json({ message: 'Welcome to URL shortener' });
// });

app.get('/url/:alias', async (req, res, next) => {
  const alias = req.params.alias.toLowerCase();
  try {
    const {url} = await Url.findOne({ alias });
    console.log(url);
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT | 3000;

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  if (!alias) {
    alias = nanoid(5);
  }
  alias=alias.toLowerCase();
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
    next(err);
  }
});

app.use((req,res,next)=>{
  const error = new Error('Not found');
  res.status(404);
  next(error);
});

app.use((error,req,res,next) => {
  error.status = (error.status == 200)? 500: error.status;
  res.json({
    stack:(process.env.NODE_ENV === 'production')? '⛵': error.stack
  });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
