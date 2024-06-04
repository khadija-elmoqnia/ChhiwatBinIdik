import React, { useState, useEffect } from 'react';
import { getUserById } from '../services/firebaseservice';
import { updateUser } from '../services/firebaseservice'; // Importez la fonction updateUser pour le test
import { getCommandesForUser } from '../services/firebaseservice'; // Assurez-vous d'importer correctement la fonction
import { getAvatarForAdmin } from '../services/firebaseservice';
import { getProfitForFournisseur } from '../services/firebaseservice';



const TestUpdateUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Nouvel état pour indiquer si les données sont en cours de chargement
  const userId = "1JSKKogKttW0GkO52PPQAmwXDlB3";  // Remplacez par un ID utilisateur valide pour le test

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserById(userId);
        setUserData(userData);
        setLoading(false); // Définir loading sur false une fois les données récupérées
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Définir loading sur false en cas d'erreur de récupération des données
      }
    };

    fetchData();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      // Mise à jour des données de l'utilisateur avec de nouvelles données fictives
      const updatedUserData = { 
        fullName: "John Doe", 
        email: "john.doe@example.com", 
        phoneNumber: "1234567890", 
        completeAddress: "123 Main St", 
        cinNumber: "123456789" 
      };
      await updateUser(userId, updatedUserData); // Appel de la fonction updateUser avec l'ID utilisateur et les données mises à jour
      console.log("User data updated successfully");
      // Mettre à jour l'état userData avec les nouvelles données mises à jour pour refléter les modifications sur l'interface utilisateur
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <div>
          {userData ? (
            <div>
              <h2>User Data:</h2>
              <p>Full Name: {userData.fullName}</p>
              <p>Email: {userData.email}</p>
              <p>Phone Number: {userData.phoneNumber}</p>
              {/* Add more fields as needed */}
              <button onClick={handleUpdateUser}>Update User Data</button> {/* Bouton pour déclencher la mise à jour des données utilisateur */}
            </div>
          ) : (
            <p>User not found</p>
          )}
        </div>
      )}
    </div>
  );
};



const TestGetUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Nouvel état pour indiquer si les données sont en cours de chargement
  const userId = "1JSKKogKttW0GkO52PPQAmwXDlB3";  // Remplacez par un ID utilisateur valide pour le test

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserById(userId);
        setUserData(userData);
        setLoading(false); // Définir loading sur false une fois les données récupérées
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Définir loading sur false en cas d'erreur de récupération des données
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <div>
          {userData ? (
            <div>
              <h2>User Data:</h2>
              <p>Full Name: {userData.fullName}</p>
              <p>Email: {userData.email}</p>
              <p>Phone Number: {userData.phoneNumber}</p>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <p>User not found</p>
          )}
        </div>
      )}
    </div>
  );
};




const TestComponent = () => {
    const [profit, setProfit] = useState(null);

    useEffect(() => {
        const testGetProfitForFournisseur = async () => {
            try {
                
                const fournisseurId = 'iZtzPYBjB5ZkVbLUDXMqmDMOF3Q2';

                const profit = await getProfitForFournisseur(fournisseurId);
                setProfit(profit);
            } catch (error) {
                console.error('Erreur lors du test de getProfitForFournisseur:', error);
            }
        };

        testGetProfitForFournisseur();
    }, []);

    return (
        <div>
            <h2>Résultat du test</h2>
            <p>Profit pour le fournisseur: {profit !== null ? profit : 'Chargement...'}</p>
        </div>
    );
};





const TestGetCommandesForUser = () => {
  const defaultUserId = "q9YDicwQcqeXVZHzGzWVglMOzkD3"; 
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const userCommandes = await getCommandesForUser(defaultUserId);
        setCommandes(userCommandes);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div>
      <h2>Commandes pour l'utilisateur {defaultUserId}</h2>
      {loading ? (
        <p>Chargement des commandes...</p>
      ) : (
        <div>
          {commandes.map((commande) => (
            <div key={commande.id}>
              <h3>ID de la commande : {commande.id}</h3>
              <ul>
                {commande.items.map((item) => (
                  <li key={item.id}>
                    <strong>Titre de l'item :</strong> {item.title}<br />
                    <strong>Prix de l'item :</strong> {item.price}<br />
                    {/* Ajouter d'autres détails de l'item si nécessaire */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

 // Importez votre fonction de service

 const TestGetAvatarForAdmin = () => {
    const [avatarURL, setAvatarURL] = useState(null);
  
    useEffect(() => {
      const fetchAvatar = async () => {
        try {
          const email = 'khadijamq@gmail.com'; // Remplacez par l'e-mail de l'admin que vous souhaitez tester
          const url = await getAvatarForAdmin(email);
          setAvatarURL(url);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'avatar:', error);
        }
      };
  
      fetchAvatar();
    }, []);
  
    return (
      <div>
        {avatarURL ? (
          <img src={avatarURL} alt="Avatar" />
        ) : (
          <span>Avatar non disponible</span>
        )}
      </div>
    );
  };
  

export  {TestGetUser, TestUpdateUser,TestGetCommandesForUser,TestGetAvatarForAdmin, TestComponent}
