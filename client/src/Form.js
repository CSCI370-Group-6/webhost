import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import './Form.css';

function Form() {
    // variables for inputs
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
    const [platformResources, setPlatformResources] = useState(null);
    const [interestResources, setInterestResources] = useState(null);
    const [addictionResources, setAddictionResources] = useState(null);

    // functions to handle user inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // combine user inputs into one string
        const compiledArgs = Object.values(formData).join(',').replace(/"/g, '\\"');
        const argsStringWithQuotes = `"${compiledArgs}"`;

        setArgsString(argsStringWithQuotes);

        const serializedData = qs.stringify({ 
            argsString: argsStringWithQuotes, 
            platform: formData.platform, 
            interest: formData.interest, 
            location: formData.location 
        });

        // send user inputs to server
        axios.post('/run-java', serializedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            setOutput(response.data.output);
            setPlatformResources(response.data.platformResources || null);
            setInterestResources(response.data.interestResources || null);
            setAddictionResources(response.data.addictionResources || null);
            setError('');
        })
        .catch(error => {
            console.error('There was an error!', error);
            setError(error.response ? error.response.data.error : 'An unknown error occurred');
        });
    };

    // basic html
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
            {output && <div><h3>Program Output:</h3><pre>{output}</pre></div>}
            {platformResources && (
                <div>
                    <h3>Ways to Set Up Time Limits on {formData.platform}:</h3>
                    <ul>
                        {platformResources.map((resource, index) => (
                            <li key={index}>
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                </a>
                                <p>{resource.snippet}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {interestResources && (
                <div>
                    <h3>Resources Near You Related to {formData.interest}:</h3>
                    <ul>
                        {interestResources.map((resource, index) => (
                            <li key={index}>
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                </a>
                                <p>{resource.snippet}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {addictionResources && (
                <div>
                    <h3>Social Media Addiction Resources in {formData.location}:</h3>
                    <ul>
                        {addictionResources.map((resource, index) => (
                            <li key={index}>
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                </a>
                                <p>{resource.snippet}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <div><h3>Error:</h3><pre>{error}</pre></div>}
        </div>
    );
}

export default Form;
