import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import AddAdminForm from '../../components/profil/AddAdminForm';
import EditAdminForm from '../../components/profil/EditAdminForm';
import { getAdminByEmail, getAllAdmins, deleteAdminById } from '../../services/firebaseservice';
import './singleadmin.scss';

const Singleadmin = () => {
  const [admin, setAdmin] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [adminToEdit, setAdminToEdit] = useState(null);

  // Définir l'ordre des champs pour les informations de l'administrateur
  const adminFieldOrder = [ 'avatar','firstName', 'lastName', 'email', 'phoneNumber', 'password'];

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      const fetchAdmin = async () => {
        try {
          const adminData = await getAdminByEmail(email);
          setAdmin(adminData);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'administrateur:', error);
        }
      };

      fetchAdmin();
    }
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminUsers = await getAllAdmins();
        setAdmins(adminUsers);
      } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleEditButtonClick = (admin) => {
    setAdminToEdit(admin);
    setShowEditForm(true);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteAdminById(userId);
      console.log("Utilisateur supprimé avec l'ID:", userId);
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== userId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur:', error);
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={() => setShowEditForm(!showEditForm)}>Edit</div>
            <h1 className="title">Information</h1>
            {admin && (
              <div className="item">
                <div className="details">
                  <ul>
                    {adminFieldOrder.map((key) => (
                      admin[key] && (
                        <li className="detailItem" key={key}>
                          <span className="itemKey">{key}:</span>
                          <span className="itemValue">
                            {key === 'avatar' ? (
                              <img src={admin[key]} alt="Avatar" className="itemImg" />
                            ) : (
                              admin[key]
                            )}
                          </span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        {showEditForm && <EditAdminForm admin={adminToEdit} />}
        {showAddForm && <AddAdminForm />}
        <div className="bottom">
          <button className="addButton" onClick={() => setShowAddForm(true)}>Ajouter</button>
          <h2>Liste des admins</h2>
          <table>
            <thead>
              <tr>
                {adminFieldOrder.map(key => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  {adminFieldOrder.map((key, index) => (
                    <td key={index}>
                      {key === 'avatar' ? (
                        <img src={admin[key]} alt="Avatar" className="itemImg" />
                      ) : (
                        admin[key]
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="addButton" onClick={() => handleDelete(admin.id)}>Supprimer</button>
                    <button className="addButton"onClick={() => handleEditButtonClick(admin)}>Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Singleadmin;
