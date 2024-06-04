import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Editer.scss';
import { getUserById, updateUser } from '../../services/firebaseservice';

const Editform = ({ chefid }) => {
  const [chef, setChef] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    completeAddress: '',
    cinNumber: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChef = async () => {
      const chefData = await getUserById(chefid);
      setChef(chefData);
    };

    fetchChef();
  }, [chefid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUser(chefid, chef);
    if (success) {
      alert('Chef updated successfully');
      navigate(0); // Redirige vers la page précédente
    } else {
      alert('Failed to update chef');
    }
  };

  const handleChange = (e, field) => {
    setChef({ ...chef, [field]: e.target.value });
  };

  return (
    <div className="Container">
      <h2>Modifier le chef</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input type="text" value={chef.fullName} onChange={(e) => handleChange(e, 'fullName')} />
        </label>
        <label>
          Email:
          <input type="email" value={chef.email} onChange={(e) => handleChange(e, 'email')} />
        </label>
        <label>
          Phone Number:
          <input type="tel" value={chef.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} />
        </label>
        <label>
          Complete Address:
          <input type="text" value={chef.completeAddress} onChange={(e) => handleChange(e, 'completeAddress')} />
        </label>
        <label>
          CIN Number:
          <input type="text" value={chef.cinNumber} onChange={(e) => handleChange(e, 'cinNumber')} />
        </label>
        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default Editform;

