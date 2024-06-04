// firebaseService.js
import {query, where ,collection, getDocs, doc, getDoc,addDoc,setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { realtimeDatabase } from '../config/firebaseConfig';
import { update , remove,ref,get,push } from "firebase/database";


export const getAdminByEmail = async (email) => {
    try {
        // Créer une requête pour récupérer l'administrateur par son e-mail
        const adminQuery = query(collection(firestore, 'admin'), where('email', '==', email));
        const querySnapshot = await getDocs(adminQuery);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'administrateur par e-mail:', error);
        throw new Error('Erreur lors de la récupération de l\'administrateur par e-mail');
    }
};


// Méthode pour ajouter un nouvel administrateur
export const addAdmin = async (email, password, firstName, lastName,phoneNumber,avatar) => {
    try {
        // Enregistrez les données de l'administrateur dans Firestore
        await addDoc(collection(firestore, 'admin'), {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            avatar
        });
        console.log('Admin added successfully');
    } catch (error) {
        console.error('Error adding admin:', error);
        throw error; // Propagez l'erreur pour une gestion ultérieure
    }
};


// Méthode pour mettre à jour les données d'un administrateur
export const updateAdmin = async (adminId, newData) => {
    try {
        // Mettez à jour les données de l'administrateur dans Firestore
        await setDoc(doc(firestore, 'admin', adminId), newData);
        console.log('Admin updated successfully');
    } catch (error) {
        console.error('Error updating admin:', error);
        throw error; // Propagez l'erreur pour une gestion ultérieure
    }
};

export const addChefToFirebase = async (chefData) => {
  try {
    // Obtenez une référence à la collection "users" dans la base de données en temps réel
    const usersRef = ref(realtimeDatabase, 'users');

    // Ajoutez les données du chef à la collection "users" avec un ID généré automatiquement
    const newChefRef = push(usersRef, {
      ...chefData,
      role: 'fournisseur' // Ajoutez le rôle de fournisseur aux données du chef
    });

    console.log('Chef ajouté avec l\'ID:', newChefRef.key);
    return newChefRef.key; // Retourne l'ID du nouveau chef ajouté
  } catch (error) {
    console.error('Erreur lors de l\'ajout du chef dans la base de données en temps réel:', error);
    throw error; // Lancez l'erreur pour la gérer dans votre composant ou service
  }
};


export const deleteAdminById = async (adminId) => {
    try {
        // Référence de la collection "admin" et suppression du document par son ID
        await firestore.collection('admin').doc(adminId).delete();
        console.log("Admin supprimé avec succès !");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'admin :", error);
        throw error; // Renvoie l'erreur pour la gérer dans le composant ou la fonction appelante
    }
};


// Fonction pour récupérer le nom du fournisseur à partir de son ID
export const getNomFournisseurById = async (fournisseurId) => {
    try {
        // Référence au chemin du nœud "users" contenant les informations sur les fournisseurs
        const fournisseurRef = ref(realtimeDatabase, `users/${fournisseurId}`);

        // Obtenir les données du fournisseur à partir de Realtime Database
        const fournisseurSnapshot = await get(fournisseurRef);

        // Vérifier si le fournisseur existe dans la base de données
        if (fournisseurSnapshot.exists()) {
            // Récupérer les données du fournisseur
            const fournisseurData = fournisseurSnapshot.val();
            // Renvoyer le nom du fournisseur
            return fournisseurData.fullName
            || "Nom du fournisseur non trouvé";
        } else {
            // Si le fournisseur n'existe pas, renvoyer un message d'erreur
            return "Nom du fournisseur introuvable";
        }
    } catch (error) {
        // En cas d'erreur, afficher un message d'erreur dans la console
        console.error('Erreur lors de la récupération du nom du fournisseur:', error);
        // Renvoyer un message d'erreur
        return "Erreur lors de la récupération du nom du fournisseur";
    }
};


export const calculerProfit = async (userId) => {
    try {
        let totalProfit = 0;

        if (!userId) {
            // If userId is null, calculate profit using total price of all items
            const commandesQuery = query(collection(firestore, 'commandes'), where('statusFournisseur', '==', 'livree'));
            const querySnapshot = await getDocs(commandesQuery);

            querySnapshot.forEach((doc) => {
                const commande = doc.data();
                totalProfit += commande.totalPrice; // Assuming each commande has a 'totalPrice' field
            });

            return totalProfit * 0.05; // Multiply the total profit by 0.05 (5%)
        } else {
            // If userId is provided, filter commandes by userId and calculate profit
            const commandesQuery = query(collection(firestore, 'commandes'), where('statusFournisseur', '==', 'livree'));
            const querySnapshot = await getDocs(commandesQuery);

            querySnapshot.forEach((doc) => {
                const commande = doc.data();
                commande.items.forEach((item) => {
                    if (item.fournisseurId === userId) {
                        totalProfit += item.price * item.quantity;
                    }
                });
            });

            return totalProfit * 0.95; // Multiply the total profit by 0.95 (95%)
        }
    } catch (error) {
        console.error('Erreur lors du calcul du profit:', error);
        return 0;
    }
};




export const getNumberOfClients = async () => {
    try {
        const clients = await getUsersByRole('client');
        return clients.length;
    } catch (error) {
        console.error('Erreur lors du calcul du nombre de clients:', error);
        return 0;
    }
};

    
export const getCommandesForUser = async (userId) => {
      try {
        const commandesQuery = query(collection(firestore, 'commandes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(commandesQuery);
    
        const commandes = [];
        querySnapshot.forEach((doc) => {
          const commandeData = doc.data();
          commandeData.id = doc.id;
          commandes.push(commandeData);
        });
    
        return commandes;
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw new Error('Erreur lors de la récupération des commandes pour l\'utilisateur:', error);
      }
    };
    
  
  
  

   
    
    export const calculerNombreTotalDeCommandes = async (userId = null) => {
        try {
            let commandesQuery;
            if (userId) {
                commandesQuery = query(collection(firestore, 'commandes'), where('userId', '==', userId));
            } else {
                commandesQuery = collection(firestore, 'commandes');
            }
            
            const querySnapshot = await getDocs(commandesQuery);
            
            let count = 0;
            querySnapshot.forEach(doc => {
                // Pour chaque document dans le QuerySnapshot, incrémentez le compteur
                count++;
            });
    
            return count;
        } catch (error) {
            console.error('Erreur lors du calcul du nombre total de commandes:', error);
            return 0;
        }
    };
    
    
    
    

  export const getAvatarForAdmin = async (email) => {
    const adminsCollection = collection(firestore, 'admin');
    const q = query(adminsCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    const avatars = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      avatars.push(data.avatar);
    });
  
    return avatars;
  };
  
  


export const getPlatsForChef = async (chefid) => {
  const platsCollection = collection(firestore, 'plats');
  const q = query(platsCollection, where('fournisseurId', '==', chefid));
  const querySnapshot = await getDocs(q);
  
  const plats = [];
  querySnapshot.forEach((doc) => {
    plats.push({ id: doc.id, ...doc.data() });
  });

  return plats;
};

// Fonction pour récupérer tous les utilisateurs où le rôle est égal au rôle spécifié
export const getUsersByRole = async (role) => {
    const usersRef = ref(realtimeDatabase, 'users');
    const snapshot = await get(usersRef);
    const users = [];
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.role === role) {
                // Include the unique ID in the user data object
                const userWithId = { ...userData, id: childSnapshot.key };
                users.push(userWithId);
            }
        });
    }
    return users;
};

export const getUserById = async (userId) => {
    const userRef = ref(realtimeDatabase, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        // Include the unique ID in the user data object
        const userWithId = { ...userData, id: snapshot.key };
        return userWithId;
    } else {
        return null; // Retourner null si l'utilisateur n'est pas trouvé
    }
};



// services/firebaseservice.jsx


export const updateUser = async (userId, updatedUserData) => {
  try {
    const userRef = ref(realtimeDatabase, `users/${userId}`);
    await update(userRef, updatedUserData);
    console.log('User updated successfully');
    return true; // Indiquez que la mise à jour a réussi
  } catch (error) {
    console.error('Error updating user:', error);
    return false; // Indiquez qu'il y a eu une erreur lors de la mise à jour
  }
};

export const getNumberOfChefs = async () => {
    try {
        const chefs = await getUsersByRole('fournisseur');
        return chefs.length;
    } catch (error) {
        console.error('Erreur lors du calcul du nombre de chefs:', error);
        return 0;
    }
};


export const getProfitForFournisseur = async (fournisseurId = null) => {
    try {
        let totalProfit = 0;
        const commandesRef = firestore.collection('commandes');
        let querySnapshot;

        if (fournisseurId) {
            querySnapshot = await commandesRef.where('statusFournisseur', '==', 'livree')
                                                .where('items.fournisseurId', '==', fournisseurId)
                                                .get();
        } else {
            querySnapshot = await commandesRef.where('statusFournisseur', '==', 'livree')
                                                .where('items.fournisseurId', '!=', null)
                                                .get();
        }

        querySnapshot.forEach((doc) => {
            const commande = doc.data();
            commande.items.forEach((item) => {
                totalProfit += item.price * item.quantity;
            });
        });

        return totalProfit;
    } catch (error) {
        console.error('Erreur lors du calcul du profit pour le fournisseur:', error);
        return 0;
    }
};



  

export const deleteUserById = async (userId) => {
    const userRef = ref(realtimeDatabase, `users/${userId}`);
    try {
        await remove(userRef);
        console.log(`Utilisateur avec l'ID ${userId} supprimé du backend.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${userId}:`, error);
        throw error;
    }
};


// Fonction pour mettre à jour un utilisateur par ID
export const updateUserById = async (userId, newData) => {
    try {
        await update(ref(realtimeDatabase, `users/${userId}`), newData);
        console.log("Utilisateur mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    }
};



export const getAllAdmins = async () => {
    const adminsRef = collection(firestore, "admin");
    const querySnapshot = await getDocs(adminsRef);
    const adminsList = querySnapshot.docs.map(doc => doc.data());
    return adminsList;
};


export const getAdminById = async (adminId) => {
    const adminRef = doc(firestore, "admin", adminId);
    const docSnapshot = await getDoc(adminRef);
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    } else {
        throw new Error("Admin not found");
    }
};
export const authenticateUser = async (email, password) => {
    const usersRef = collection(firestore, "admin");
    const q = query(usersRef, where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return "Authentification réussie";
    } else {
        return "Échec de l'authentification";
    }
};


