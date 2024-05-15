const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
// diff port no conflict
const port = 6000;

// api keys
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/run-java', async (req, res) => {
    const argsString = req.body.argsString;
    const jarPath = path.join(__dirname, 'predict.jar');
    const command = `java -jar ${jarPath} ${argsString}`;

    exec(command, async (error, stdout, stderr) => {
        // catch java error
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `Error executing Java program: ${error.message}` });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: `Java program stderr: ${stderr}` });
        }

        // get java output
        const result = stdout.trim();
        // check if user is addicted
        if (result.includes("YES ADDICTION")) {
            // get user input
            const platform = req.body.platform;
            const interest = req.body.interest;
            const location = req.body.location;

            let platformResources = null;
            let interestResources = null;
            let addictionResources = null;

            // get resources from google api
            try {
                const platformQuery = `${platform} setup usage limits and time limits`;
                const platformResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
                    params: {
                        key: GOOGLE_API_KEY,
                        cx: GOOGLE_CX,
                        q: platformQuery,
                    },
                });
                platformResources = platformResponse.data.items.slice(0, 3); // Limit results to 3

                const interestQuery = `${interest} resources near ${location}`;
                const interestResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
                    params: {
                        key: GOOGLE_API_KEY,
                        cx: GOOGLE_CX,
                        q: interestQuery,
                    },
                });
                interestResources = interestResponse.data.items.slice(0, 3); // Limit results to 3

                const addictionQuery = `social media addiction resources in ${location}`;
                const addictionResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
                    params: {
                        key: GOOGLE_API_KEY,
                        cx: GOOGLE_CX,
                        q: addictionQuery,
                    },
                });
                addictionResources = addictionResponse.data.items.slice(0, 3); // Limit results to 3
            } catch (apiError) {
                console.error(`API error: ${apiError.message}`);
                console.error(apiError.response ? apiError.response.data : apiError);
                return res.status(500).json({ error: `Error fetching resources: ${apiError.message}` });
            }

            res.json({ output: result, platformResources, interestResources, addictionResources });
        } 
        // user is not addicted
        else if (result.includes("NO ADDICTION")) {
            res.json({ output: "Nice Job! From our system's calculations it seems that you're not addicted.\nKeep it up and help others break free from social media addiction :)" });
        } 
        else {
            res.status(500).json({ error: `Unexpected output: ${result}` });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
