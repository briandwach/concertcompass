import { useState, useEffect } from 'react';
import { getMetros } from '../utils/jamBaseRequests.js';

const Home = () => {
  const [metros, setMetros] = useState([]);

  useEffect(() => {
    const callMetros = async () => {
      const data = await getMetros();    

      const formattedMetros = data.map((metro) => {
        const state = metro.addressRegion.split('-')[1];
        return `${metro.name}, ${state}`;
      });

      setMetros(formattedMetros);
    };

    callMetros();
  }, []);

  return (
    <div>
      <h1 className='underline'>Welcome</h1>
      <p>This application is still under development.</p>
      <p>Please come back soon.</p>
      <br />
      <ul>
        {metros.map((metro, index) => (
          <li key={index}>{metro}</li>
        ))}
      </ul>

    </div>
  );
};

export default Home;