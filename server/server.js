const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/run-java', (req, res) => {
    const argsString = req.body.argsString; // Get the compiled string from the request body

    const jarPath = path.join(__dirname, 'predict.jar'); // Path to your JAR file
    const command = `java -jar ${jarPath} ${argsString}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `Error executing Java program: ${error.message}` });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: `Java program stderr: ${stderr}` });
        }
        console.log(`stdout: ${stdout}`);
        res.json({ output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
