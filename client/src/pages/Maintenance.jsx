import { useState, useEffect } from 'react';
import { authorize, getTokens } from '../utils/authRequests.js';
import { getDisplayName } from '../utils/spotifyRequests.js';
import { updateMetros } from '../utils/jamBaseRequests.js';

const Maintenance = () => {
  const [name, setName] = useState('');
  const [seedResult, setSeedResult] = useState('');

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

  const seedMetros = async () => {
    const result = await updateMetros(); // Await the async call
    setSeedResult(result);
  };

  return (
    <div>
      <button type='button' onClick={authorize} className='btn'>Authorize Spotify Account</button>
      <br />
      <br />
      <button type='button' onClick={handleDisplayName} className='btn'>Test User Info</button>
      <p>{name}</p>
      <br />
      <br />
      <button type='button' onClick={seedMetros} className='btn'>Update Metros</button>
      <p>{seedResult}</p>
    </div>
  );
};

export default Maintenance;