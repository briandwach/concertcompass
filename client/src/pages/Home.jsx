import { useState, useEffect } from 'react';
import { authorize, getTokens } from './demoAuthorization.js';
import { getDisplayName } from './spotifyRequests.js';


const Home = () => {

  useEffect(() => {
    if (window.location.search !== '' && !window.location.search.includes("error")) {
      getTokens();
    }
  }, []);

  return (
    <div>
      <button type='button' onClick={authorize}>Authorize Spotify Account</button>
      <button type='button' onClick={getDisplayName}>Console Log User Info</button>
    </div>
  );
};

export default Home;