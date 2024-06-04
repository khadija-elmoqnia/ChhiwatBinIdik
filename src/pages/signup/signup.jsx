import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../services/firebaseservice';
import './signup.scss';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authenticateUser(email, password);
            setResponseMessage(response);
            
            if (response === "Authentification réussie") {
                
                navigate(`/home`);
                localStorage.setItem('adminEmail', email);
            } else {
                console.error('Erreur d\'authentification:', response);
                alert('Mot de passe ou email incorrect ');
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
           
        </div>
    );
};

export default Signup;

