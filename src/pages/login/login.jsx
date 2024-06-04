import React, { useState ,useEffect} from 'react';
import './login.scss';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let avatarURL = '';
            if (image) {
                const imageRef = ref(storage, `admin/${v4()}`);
                await uploadBytes(imageRef, image);
                avatarURL = await getDownloadURL(imageRef);
            }

            // Création d'un objet avec les données à enregistrer dans Firestore
            const userData = {
                email,
                password,
                firstName,
                lastName,
                avatar: avatarURL, // URL de l'avatar téléchargé
            };

            // Enregistrez les données dans Firestore
            await addDoc(collection(firestore, 'admin'), userData);
            console.log('Données enregistrées avec succès dans Firestore');
            
            // Réinitialisez les champs après la soumission
            setEmail('');
            setPassword('');
            setImage(null);
            setFirstName('');
            setLastName('');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des données dans Firestore:', error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" id="firstName" value={firstName} onChange={handleFirstNameChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" value={lastName} onChange={handleLastNameChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
