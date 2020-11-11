import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [status, setStatus] = useState({
    success: false,
    pending: true,
    error: false,
    message: '',
  });

  const setToDefault = () => {
    setStatus({
      success: false,
      pending: true,
      error: false,
      message: '',
    });
  };

  const handleChange = (e) => {
    setToDefault();
    if (e.target.name === 'url') {
      setUrl(e.target.value);
    } else {
      setAlias(e.target.value);
    }
  };
  const webUrl =
    process.env.NODE_ENV === 'production'
      ? 'http://www.hvu.xyz'
      : 'http://localhost:1337';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToDefault();
    try {
      console.log(e.target[0].value);
      const res = await axios.post(`${webUrl}/url`, {
        url: e.target[0].value,
        alias: e.target[1].value,
      });
      if (res.status === 200) {
        console.log(res.data);
        setAlias(res.data.alias);
        setStatus({
          error: false,
          pending: false,
          message: 'URL generated successfully',
          success: true,
        });
      } else {
        console.log(res.data);
        setStatus({
          pending: false,
          success: false,
          error: true,
          message: res.data.stack,
        });
      }
    } catch (error) {
      setStatus({
        pending: false,
        success: false,
        error: true,
        message: error.message,
      });
    }
  };

  return (
    <div className={'container'}>
      <h1> Your custom URL shortener</h1>
      <form onSubmit={handleSubmit} className={'myForm'}>
        <input
          type='text'
          name='url'
          value={url}
          onChange={handleChange}
          placeholder='ENTER URL'
        />
        <input
          type='text'
          name='alias'
          value={alias}
          onChange={handleChange}
          placeholder='Enter alias'
        />
        <button type='submit'>Generate URL</button>
      </form>
      {status.error && (
        <p>
          Error Occured:
          <br />
          {status.message}
        </p>
      )}
      {status.success && <p>Your shortened URL: {`${webUrl}/${alias}`}</p>}
    </div>
  );
}

export default App;
