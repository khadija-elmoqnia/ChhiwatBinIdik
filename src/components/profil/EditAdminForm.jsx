// EditAdminForm.jsx
import React, { useState, useEffect } from 'react';
import { getAdminById, updateAdmin } from '../../services/firebaseservice'; // Importez les fonctions pour récupérer et mettre à jour un administrateur

const EditAdminForm = ({ adminId, onFormSubmit }) => {
    const [admin, setAdmin] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        // Chargez les données de l'administrateur à modifier lors du montage du composant
        const fetchAdmin = async () => {
            try {
                const adminData = await getAdminById(adminId);
                setAdmin(adminData);
                setEmail(adminData.email);
                setFirstName(adminData.firstName);
                setLastName(adminData.lastName);
            } catch (error) {
                console.error('Error fetching admin:', error);
            }
        };

        fetchAdmin();
    }, [adminId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Mettez à jour les données de l'administrateur avec les nouvelles valeurs
            await updateAdmin(adminId, { email, firstName, lastName });
            console.log('Admin updated successfully');

            // Appeler la fonction de soumission de formulaire parent pour effectuer des actions supplémentaires si nécessaire
            if (typeof onFormSubmit === 'function') {
                onFormSubmit();
            }
        } catch (error) {
            console.error('Error updating admin:', error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    return (
        <div className="edit-admin-form">
            {admin && (
                <>
                    <h3>Edit Admin</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" value={email} onChange={handleEmailChange} required />
                        </div>
                        <div className="form-group">
                            <label>First Name:</label>
                            <input type="text" value={firstName} onChange={handleFirstNameChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input type="text" value={lastName} onChange={handleLastNameChange} required />
                        </div>
                        <button type="submit">Update Admin</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default EditAdminForm;
