import { useState, useEffect, useRef } from 'react';
import { getMetros } from '../utils/jamBaseRequests.js';
import Calendar from '../components/Calendar/Calendar.jsx';
import Genres from '../components/Genres/Genres.jsx';

const Home = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [genreSelections, setGenreSelections] = useState([]);
  const [totalGenres, setTotalGenres] = useState(0);
  const [metroFilter, setMetroFilter] = useState([]);
  const [metroSearch, setMetroSearch] = useState('');
  const [metroSelection, setMetroSelection] = useState({});
  const [searchDisplay, setSearchDisplay] = useState('block');
  const [selectionDisplay, setSelectionDisplay] = useState('hidden');
  const [areGenresVisible, setAreGenresVisible] = useState(false);
  const [selectAllGenres, setSelectAllGenres] = useState(false);
  const [clearAllGenres, setClearAllGenres] = useState(false);
  const metroDataRef = useRef([]);

  useEffect(() => {
    const callMetros = async () => {
      const data = await getMetros();

      const formattedMetros = data.map((metro) => {
        const { identifier, name } = metro;
        const state = metro.addressRegion.split('-')[1];

        const metroObj = {
          identifier: identifier,
          name: `${name}, ${state}`
        };

        return metroObj;
      });

      metroDataRef.current = formattedMetros;
      setMetroFilter(formattedMetros);
    };

    callMetros();
  }, []);


  useEffect(() => {
    if (Object.keys(metroSelection).length > 0) {
      setSelectionDisplay('block');
      setSearchDisplay('hidden');
    } else {
      setSelectionDisplay('hidden');
      setSearchDisplay('block');
    }
  }, [metroSelection]);

  // EVENT HANDLERS
  /////////////////

  // Handle search input change
  const handleSearchInput = (e) => {
    const searchValue = e.target.value; // Correct way to access the input value
    setMetroSearch(searchValue);

    // Filter metro data based on the search value
    if (searchValue === '') {
      setMetroFilter(metroDataRef.current); // Show all metros if search is empty
    } else {
      const filteredMetros = metroDataRef.current.filter((metro) =>
        metro.name.toLowerCase().includes(searchValue.toLowerCase()) // Case-insensitive search
      );
      setMetroFilter(filteredMetros);
    }
  };

  const handleMetroSelection = (metro) => {
    setMetroSelection(metro);
  }

  const handleCancelSelection = () => {
    setMetroSelection({});
  }

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleGenresVisible = () => {
    setAreGenresVisible((prevState) => !prevState);
  };

  const getTotalGenres = (total) => {
    setTotalGenres(total);
  };

  const handleGenreChange = (newGenres) => {
    setGenreSelections(newGenres);

    // Resets boolean trigger for select all genres
    if (newGenres.length < totalGenres) {
      setSelectAllGenres(false);
    }

    // Resets boolean trigger for clear all genres
    if (newGenres.length > 0) {
      setClearAllGenres(false);
    }

    console.group();
    for (let genre of newGenres) {
      console.log(genre.name);
    }
    console.groupEnd();
  };

  const handleSelectAllGenres = () => {
    setSelectAllGenres(true);
    setClearAllGenres(false);
  }

  const handleClearAllGenres = () => {
    setClearAllGenres(true);
    setSelectAllGenres(false);
  }

  // RENDER
  /////////

  return (
    <div>
      <h1 className='underline'>Welcome to Concert Compass</h1>
      <p>Looking for live music on your trip?</p>
      <br />
      <ul className='list-disc pl-5'>
        <li>Select the dates you are visiting</li>
        <li>Select the metro area</li>
        <li>Select the genres you like (optional)</li>
        <li>Then we'll create your playlist</li>
      </ul>

      <br />
      <Calendar dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
      <br />

      <div className={`${selectionDisplay} flex`}>
        <p>{metroSelection.name}</p>
        <button className="btn btn-sm btn-square"
          onClick={handleCancelSelection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={selectionDisplay}>
        <div className='flex text-sm'>
          <p className='m-2' onClick={handleGenresVisible}>{areGenresVisible ? 'Hide Genre Filters' : 'Show Genre Filters'}</p>
          <div className={`${areGenresVisible ? 'block' : 'hidden'} flex`}>
            <p className='m-2' onClick={handleSelectAllGenres}>Select All</p>
            <p className='m-2' onClick={handleClearAllGenres}>Clear All</p>
          </div>
        </div>
        <div className={areGenresVisible ? 'block' : 'hidden'}>
          <Genres
            genreSelections={genreSelections}
            handleGenreChange={handleGenreChange}
            selectAllGenres={selectAllGenres} 
            clearAllGenres={clearAllGenres}
            getTotalGenres={getTotalGenres}
          />
        </div>
      </div>

      <div className={searchDisplay}>
        <label className="input input-bordered flex items-center gap-2 max-w-[500px]">
          <input type="text" className="grow" placeholder="Search metro areas"
            value={metroSearch} onChange={handleSearchInput} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd" />
          </svg>
        </label>

        {metroFilter.map((metro) => (
          <button
            className='btn btn-sm btn-outline m-1 block'
            key={metro.identifier}
            onClick={() => handleMetroSelection(metro)}>
            {metro.name}
          </button>
        ))}
      </div>



    </div>
  );
};

export default Home;