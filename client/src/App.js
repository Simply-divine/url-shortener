import React, { useState } from 'react';
import { setUrlEntry } from './API';
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
  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://hvu.xyz'
      : 'http://localhost:1337';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToDefault();
    try {
      const res = await setUrlEntry(
        API_URL,
        e.target[0].value,
        e.target[1].value
      );
      console.log(res);
      if (res.status === 200) {
        setAlias(res.data.alias);
        setStatus({
          error: false,
          pending: false,
          message: 'URL generated successfully',
          success: true,
        });
      } else {
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
      {status.success && (
        <a href={`${API_URL}/${alias}`}>
          Your shortened URL: {`${API_URL}/${alias}`}
        </a>
      )}
    </div>
  );
}

export default App;
