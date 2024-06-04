import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsersByRole } from '../../services/firebaseservice';
import "./clientComponent.scss";

const ClientComponent = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const clientList = await getUsersByRole("client");
            setClients(clientList);
        };
        fetchClients();
    }, []);

    return (
        <div className="clientComponent">
            <h2>Liste des clients</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nom complet</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Adresse complète</th>
                        <th>Numéro CIN</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.fullName}</td>
                            <td>{client.email}</td>
                            <td>{client.phoneNumber}</td>
                            <td>{client.completeAddress}</td>
                            <td>{client.cinNumber}</td>
                            <td>
                                <Link to={`/clients/consulter/${client.id}`}>
                                    <button className="view-button">Consulter</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientComponent;
