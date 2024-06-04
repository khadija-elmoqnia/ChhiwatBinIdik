import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.scss';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/admins/authenticate', {
                email: email,
                password: password
            });
    
            setResponseMessage(response.data);
            
            if (response.data === "Authentification réussie") {
                // Si l'authentification réussit, afficher une alerte
                alert('Authentification réussie');
                // Puis naviguer vers la page home
                navigate(`/home?email=${email}`);
            } else {
                console.error('Erreur d\'authentification:', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="signup">
            <h2>Se connecter </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Adresse Email :</label>
                    <input type="email" id="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe :</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <button type="submit">Se Connecter</button>
            </form>
            <p>Vous ne pouvez pas vous connecter ? <Link to="/ContactAdmin">Connectez les admins </Link></p>
            <div>{responseMessage}</div>
            <p>Mot de passe saisi: {password}</p>
        </div>
    );
};

export default Signup;

