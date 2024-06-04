import React, { useState, useEffect } from 'react';
import { getAllAdmins } from '../../services/firebaseservice'; // Import de la fonction getAllAdmins
import "./contactadmin.scss"

const ContactAdmin = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const adminsList = await getAllAdmins(); // Utilisation de getAllAdmins pour récupérer la liste des administrateurs
                setAdmins(adminsList);
            } catch (error) {
                console.error('Erreur lors de la récupération des administrateurs:', error);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <div className="contact-admin"> {/* Ajout de la classe "contact-admin" */}
            <h2>Liste des administrateurs</h2>
            <ul>
                {admins.map(admin => (
                    <li key={admin.id}>
                        <p>Nom: {admin.username}</p>
                        <p>Email: {admin.email}</p>
                        <p>Téléphone: {admin.phoneNumber}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactAdmin;
