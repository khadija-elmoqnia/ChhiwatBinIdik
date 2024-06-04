// Single.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import Chart from '../../components/chart/chart';
import List from '../../components/table/table';
import Editform from '../../components/chefs/Editer';
import { getUserById } from '../../services/firebaseservice';
import './single.scss';
import Widget from '../../components/widget/widget';
const Single = () => {

  const { chefid } = useParams();
  const [chef, setChef] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchChef = async () => {
      const chefData = await getUserById(chefid);
      setChef(chefData);
    };

    fetchChef();
  }, [chefid]);

  const handleEditButtonClick = () => {
    setShowEditForm(!showEditForm);
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar/>
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleEditButtonClick}>Edit</div>
            <h1 className="title">Information</h1>
            {chef && (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{chef.fullName}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{chef.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{chef.phoneNumber}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{chef.completeAddress}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">CIN:</span>
                    <span className="itemValue">{chef.cinNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
          <div className="widget">
            <Widget type="profit" userId={chefid}/></div>
        </div>
        <div className="bottom">
          <h1 className="title">Plats recement ajoutés </h1>
          <List chefid={chefid}/>
        </div>
      </div>
      {showEditForm && <Editform chefid={chefid} />}
    </div>
  );
};

export default Single;
