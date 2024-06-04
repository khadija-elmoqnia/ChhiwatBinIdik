import React, { useState, useEffect } from 'react';
import { getUsersByRole, deleteUserById } from '../../services/firebaseservice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AjoutChefForm from '../../components/chefs/AjoutChefForm';
import Editform from '../../components/chefs/Editer';
import './chefsComponent.scss';
import { Link } from 'react-router-dom';

const ChefsComponent = () => {
    const [chefs, setChefs] = useState([]);
    const [editChefId, setEditChefId] = useState(null);
    const [showAjoutForm, setShowAjoutForm] = useState(false);

    useEffect(() => {
        fetchChefs();
    }, []);

    const fetchChefs = async () => {
        try {
            const fournisseurChefs = await getUsersByRole("fournisseur");
            setChefs(fournisseurChefs);
        } catch (error) {
            console.error('Erreur lors de la récupération des chefs:', error);
        }
    };

    const handleDelete = async (userId) => {
        confirmAlert({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous vraiment supprimer ce chef ?',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        try {
                            await deleteUserById(userId);
                            console.log("Suppression de l'utilisateur avec l'ID:", userId);
                            setChefs(prevChefs => prevChefs.filter(chef => chef.id !== userId));
                        } catch (error) {
                            console.error('Erreur lors de la suppression du chef:', error);
                        }
                    }
                },
                {
                    label: 'Non',
                    onClick: () => {}
                }
            ]
        });
    };

    const handleEdit = (chefid) => {
        setEditChefId(chefid);
    };

    const handleEditFormSubmit = async () => {
        // Fetch the updated list of chefs after the edit
        await fetchChefs();
        // Hide the edit form
        setEditChefId(null);
    };

    return (
        <div className="chefsComponent">
            <h2>Liste des chefs</h2>
            <button className="ajouter-button" onClick={() => setShowAjoutForm(true)}>Ajouter</button>

            {showAjoutForm && <AjoutChefForm />}
            {editChefId ? (
                <Editform chefid={editChefId} onFormSubmit={handleEditFormSubmit} />
            ) : (
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
                        {chefs.map(chef => (
                            <tr key={chef.id}>
                                <td>{chef.fullName}</td>
                                <td>{chef.email}</td>
                                <td>{chef.phoneNumber}</td>
                                <td>{chef.completeAddress}</td>
                                <td>{chef.cinNumber}</td>
                                <td>
                                    <button onClick={(e) => { e.preventDefault(); handleDelete(chef.id); }}>Supprimer</button>
                                    <button className="edit-button" onClick={() => handleEdit(chef.id)}>Modifier</button>
                                    <Link to={`/chefs/consulter/${chef.id}`}>
                                        <button className="consulter-button">Consulter</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ChefsComponent;

