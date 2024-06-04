import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AjoutChefForm.scss';
import { addChefToFirebase } from '../../services/firebaseservice'; // Remplacez 'addChef' par la fonction de votre service qui ajoute un chef

const AjoutChefForm = () => {
    const [chef, setChef] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        completeAddress: '',
        cinNumber: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ajoutez ici la logique pour ajouter le chef
            await addChefToFirebase(chef);

            // Affichez une alerte ou effectuez toute autre action de confirmation
            alert('Chef ajouté avec succès');

            // Réinitialisez les champs du formulaire après l'ajout du chef
            setChef({
                fullName: '',
                email: '',
                phoneNumber: '',
                completeAddress: '',
                cinNumber: ''
            });

            // Redirigez vers une autre page ou effectuez toute autre action nécessaire
            navigate(0);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du chef :', error);
            // Affichez une alerte ou effectuez toute autre action pour gérer l'erreur
            alert('Une erreur s\'est produite lors de l\'ajout du chef. Veuillez réessayer plus tard.');
        }
    };

    const handleChange = (e, field) => {
        setChef({ ...chef, [field]: e.target.value });
    };

    return (
        <div className="AjoutChefForm">
            <h2>Ajouter un chef</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom complet:
                    <input type="text" value={chef.fullName} onChange={(e) => handleChange(e, 'fullName')} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={chef.email} onChange={(e) => handleChange(e, 'email')} required />
                </label>
                <label>
                    Téléphone:
                    <input type="tel" value={chef.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} required />
                </label>
                <label>
                    Adresse complète:
                    <input type="text" value={chef.completeAddress} onChange={(e) => handleChange(e, 'completeAddress')} required />
                </label>
                <label>
                    Numéro CIN:
                    <input type="text" value={chef.cinNumber} onChange={(e) => handleChange(e, 'cinNumber')} required />
                </label>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AjoutChefForm;
