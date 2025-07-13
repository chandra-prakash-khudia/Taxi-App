// Import axios for making HTTP requests
const axios = require('axios')
// Import the captain model for database operations
const captainModel = require('../models/captain.model.js');

// Function to convert address to coordinates using Google Geocoding API
module.exports.getAddressCoordinate = async (address) => {
    // Get Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API;
    // Construct URL for geocoding API request with encoded address
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        // Make GET request to Google Geocoding API
        const response = await axios.get(url);
        // Check if API request was successful
        if (response.data.status === 'OK') {
            // Extract location coordinates from response
            const location = response.data.results[0].geometry.location;
            // Return latitude and longitude
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to calculate distance and time between two locations using Distance Matrix API
module.exports.getDistanceTime = async (origin, destination) => {
    // Validate that both origin and destination are provided
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // Get Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API;

    // Construct URL for distance matrix API request
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        // Make GET request to Distance Matrix API
        const response = await axios.get(url);
        // Check if API request was successful
        if (response.data.status === 'OK') {
            // Check if a route was found between points
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }
            // Return distance and duration information
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to get address suggestions using Places Autocomplete API
module.exports.getAutoCompleteSuggestions = async (input) => {
    // Validate that input query is provided
    if (!input) {
        throw new Error('query is required');
    }

    // Get Google Maps API key from environment variables
    const apiKey = process.env.GOOGLE_MAPS_API;
    // Construct URL for places autocomplete API request
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        // Make GET request to Places Autocomplete API
        const response = await axios.get(url);
        // Check if API request was successful
        if (response.data.status === 'OK') {
            // Extract and filter place descriptions from predictions
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to find captains within a specified radius using MongoDB geospatial queries
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km

    // Find captains within the specified radius using $geoWithin and $centerSphere
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ] // Convert radius to radians
            }
        }
    });

    // Return the list of captains found within the radius
    return captains;
}