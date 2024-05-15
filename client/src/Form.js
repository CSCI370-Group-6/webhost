import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs'; // Import qs for query string serialization
import './Form.css'; // Import the CSS file

function Form() {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        hours: '',
        platform: '',
        interest: '',
        location: '',
        demographic: '',
        profession: '',
        income: '',
        debt: '',
        homeowner: '',
        car: ''
    });

    const [argsString, setArgsString] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Compile all inputs into a single comma-separated string
        const compiledArgs = Object.values(formData).join(',').replace(/"/g, '\\"');

        // Escape the entire string with double quotes
        const argsStringWithQuotes = `"${compiledArgs}"`;

        setArgsString(argsStringWithQuotes); // Set the compiled string to be displayed

        // Serialize the compiledArgs to be sent as form data
        const serializedData = qs.stringify({ argsString: argsStringWithQuotes });

        console.log('Sending payload:', serializedData); // Log the payload for debugging

        axios.post('/run-java', serializedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            setOutput(response.data.output);
            setError('');
        })
        .catch(error => {
            console.error('There was an error!', error);
            setError(error.response ? error.response.data.error : 'An unknown error occurred');
        });
    };

    return (
        <div className="form-container">
            <h1>Check Your Social Media Addiction</h1>
            <form onSubmit={handleSubmit}>
                <label>Age: <input type="text" name="age" value={formData.age} onChange={handleChange} /></label>
                <label>Gender: <input type="text" name="gender" value={formData.gender} onChange={handleChange} /></label>
                <label>Hours spent on social media: <input type="text" name="hours" value={formData.hours} onChange={handleChange} /></label>
                <label>Favorite social media platform: <input type="text" name="platform" value={formData.platform} onChange={handleChange} /></label>
                <label>Interest: <input type="text" name="interest" value={formData.interest} onChange={handleChange} /></label>
                <label>Location: <input type="text" name="location" value={formData.location} onChange={handleChange} /></label>
                <label>Demographic: <input type="text" name="demographic" value={formData.demographic} onChange={handleChange} /></label>
                <label>Profession: <input type="text" name="profession" value={formData.profession} onChange={handleChange} /></label>
                <label>Monthly income: <input type="text" name="income" value={formData.income} onChange={handleChange} /></label>
                <label>Are you in debt: <input type="text" name="debt" value={formData.debt} onChange={handleChange} /></label>
                <label>Are you a homeowner: <input type="text" name="homeowner" value={formData.homeowner} onChange={handleChange} /></label>
                <label>Do you own a car: <input type="text" name="car" value={formData.car} onChange={handleChange} /></label>
                <button type="submit">Calculate</button>
            </form>
            {/* {argsString && <div><h3>Compiled Args String:</h3><pre>{argsString}</pre></div>} */}
            {output && <div><h3>Program Output:</h3><pre>{output}</pre></div>}
            {error && <div><h3>Error:</h3><pre>{error}</pre></div>}
        </div>
    );
}

export default Form;
