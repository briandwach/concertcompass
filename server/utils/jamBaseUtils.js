const BASE_URL = 'https://jambase.com/jb-api/v1';
const API_KEY = process.env.JAMBASE_API_KEY;

const { Metros } = require('../models');

// Utility function to concatenate endpoint with query parameters
const concatEp = (ep, params) => {
    if (!API_KEY) {
        throw new Error("API key is missing.");
    }

    // Returns URL string without params
    if (!params) {
        return `${BASE_URL}${ep}?apikey=${API_KEY}`;
    }

    // Returns URL strings with additional parameters
    return `${BASE_URL}${ep}?${params}&apikey=${API_KEY}`;
};

// Utility function to create options object
const createOptions = (options) => {
    const optionsObj = {
        method: options,
        headers: { Accept: 'application/json' }
    };

    return optionsObj;
}

// Takes metro data and creates an array of the names
const createMetroArr = (data) => {
    if (!data || !Array.isArray(data.metros)) {
        return []; // Return an empty array if the data is not valid
    }

    const metroArr = data.metros.map(metro => ({
        identifier: metro.identifier, 
        name: metro.name,
        addressRegion: metro.address.addressRegion
    }));

    return metroArr;
}

// Save metro data to the database
const saveMetroData = async (arr) => {
    if (!arr || !Array.isArray(arr)) {
        console.error('Could not save metros to db: metro data not present or invalid.');
        return;
    }

    try {
        // First, delete previous metro documents
        const deleteResult = await Metros.deleteMany({});
        console.log(`All previous metros deleted: ${deleteResult.deletedCount} documents removed.`);

        if (arr.length > 0) {
            // Bulk insert valid metro names
            const metroDocuments = arr.map(metro => ({
                identifier: metro.identifier, 
                name: metro.name, 
                addressRegion: metro.addressRegion 
            }));
            const result = await Metros.insertMany(metroDocuments);
            console.log(`Saved ${result.length} metros.`);
            return result.length;
        } else {
            console.log('No valid metro data to save.');
        }

    } catch (error) {
        console.error('Error saving metro data:', error);
    }
}

// Function to get all metro areas
const updateMetroAreas = async () => {
    const url = concatEp('/geographies/metros');
    const options = createOptions('GET');

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('JamBase API error:', errorData);
            return;
        }

        const data = await response.json();

        // Ensure createMetroArr returns a valid array
        const metroArr = createMetroArr(data);

        if (!metroArr || metroArr.length === 0) {
            console.error('No valid metro data to save.');
            return;
        }

        // Save metro data to the database
        const saveMetros = await saveMetroData(metroArr);

        // Check if saving was successful
        if (saveMetros && saveMetros > 0) {
            console.log(`${saveMetros} metros saved to the db successfully!`);
        } else {
            console.error('Failed to save metros to the db.');
        }

        return saveMetros;
    } catch (err) {
        console.error('Error retrieving JamBase Metro Areas:', err);
    }
}

module.exports = { concatEp, createOptions, updateMetroAreas }