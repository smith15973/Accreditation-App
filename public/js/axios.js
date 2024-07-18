// const axios = require('axios');
// const express = require('express');
// const app = express();

function fetchData() {
    axios.get('http://localhost:3000/plant/testing')
        .then(response => {
            console.log('HEY', response);
        })
        .catch(error => {
            console.error('There was an error making the request:', error);
        });
}

