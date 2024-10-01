import { useState, useEffect } from 'react';
import { authorize, getTokens } from './authorization.js';


const Home = () => {

  useEffect(() => {
    if (window.location.search !== '' && !window.location.search.includes("error")) {
      getTokens();
    }
  }, []);

  return (
    <div>
      <button type='button' onClick={authorize}>Authorize Spotify Account</button>
    </div>
  );
};

export default Home;