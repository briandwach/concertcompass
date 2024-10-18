import { useState, useEffect } from 'react';
import { authorize, getTokens } from '../utils/authRequests.js';
import { getDisplayName } from '../utils/spotifyRequests.js';

const Maintenance = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (window.location.search !== '' && !window.location.search.includes("error")) {
        await getTokens(); // Ensure you await token retrieval
      } else {
        const displayName = await getDisplayName(); // Await the async call
        setName(displayName);
      }
    };

    fetchData();
  }, []);

  const handleDisplayName = async () => {
    const displayName = await getDisplayName(); // Await the async call
    setName(displayName);
  };

  return (
    <div>
      <button type='button' onClick={authorize} className='btn'>Authorize Spotify Account</button>
      <br />
      <br />
      <button type='button' onClick={handleDisplayName} className='btn'>Test User Info</button>
      <p>{name}</p>
    </div>
  );
};

export default Maintenance;