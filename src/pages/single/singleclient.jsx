// Single.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import Chart from '../../components/chart/chart';
import { getUserById } from '../../services/firebaseservice';
import './single.scss';
import ListCommandes from '../../components/table/tableclient';
import Widget from '../../components/widget/widget';

const Singleclient = () => {
 

  const { clientid } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getUserById(clientid);
        setClient(clientData);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du client:', error);
      }
    };

    fetchClient();
  }, [clientid]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar  />
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            {client && (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{client.fullName}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{client.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{client.phoneNumber}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{client.completeAddress}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">CIN:</span>
                    <span className="itemValue">{client.cinNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
            
          </div>
          <div><Widget type ="commandes" userId={clientid}/></div>
        </div>
        <div className="bottom">
          <h1 className="title">Commandes</h1>
          {client && <ListCommandes clientid={clientid} />}
        </div>
      </div>
    </div>
  );
};

export default Singleclient;
