import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./contactadmin.scss"

const ContactAdmin = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admins/getAll');
                setAdmins(response.data);
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

