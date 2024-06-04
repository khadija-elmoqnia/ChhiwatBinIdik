import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAdmin } from '../../services/firebaseservice';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import './AddAdminForm.scss';

const AddAdminForm = () => {
    const [admin, setAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        completeAddress: '',
        password: '',
        avatar: null
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let avatarURL = '';
            if (admin.avatar) {
                const avatarRef = ref(storage, `admin/${uuidv4()}`);
                await uploadBytes(avatarRef, admin.avatar);
                avatarURL = await getDownloadURL(avatarRef);
            }

            const adminData = { ...admin, avatar: avatarURL };
            await addAdmin(adminData);

            alert('Administrateur ajouté avec succès');
            setAdmin({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                completeAddress: '',
                password: '',
                avatar: null
            });

            navigate(-1);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'administrateur :', error);
            alert('Une erreur s\'est produite lors de l\'ajout de l\'administrateur. Veuillez réessayer plus tard.');
        }
    };

    const handleChange = (e, field) => {
        if (field === 'avatar') {
            setAdmin({ ...admin, [field]: e.target.files[0] });
        } else {
            setAdmin({ ...admin, [field]: e.target.value });
        }
    };

    return (
        <div className="AddAdminForm">
            <h2>Ajouter un administrateur</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Prénom:
                    <input type="text" value={admin.firstName} onChange={(e) => handleChange(e, 'firstName')} required />
                </label>
                <label>
                    Nom:
                    <input type="text" value={admin.lastName} onChange={(e) => handleChange(e, 'lastName')} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={admin.email} onChange={(e) => handleChange(e, 'email')} required />
                </label>
                <label>
                    Téléphone:
                    <input type="tel" value={admin.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} required />
                </label>
                <label>
                    Adresse complète:
                    <input type="text" value={admin.completeAddress} onChange={(e) => handleChange(e, 'completeAddress')} required />
                </label>
                <label>
                    Mot de passe:
                    <input type="password" value={admin.password} onChange={(e) => handleChange(e, 'password')} required />
                </label>
                <label>
                    Avatar:
                    <input type="file" onChange={(e) => handleChange(e, 'avatar')} accept="image/*" required />
                </label>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AddAdminForm;
