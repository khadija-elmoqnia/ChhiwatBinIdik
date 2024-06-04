import React, { useState, useEffect } from 'react';
import { getCommandesForUser, getNomFournisseurById } from '../../services/firebaseservice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './table.scss';

const ListCommandes = ({ clientid }) => {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState({});

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const commandesData = await getCommandesForUser(clientid);
        setCommandes(commandesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    fetchCommandes();
  }, [clientid]);

  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const fournisseursData = {};
        for (const commande of commandes) {
          for (const item of commande.items) {
            if (!fournisseursData[item.fournisseurId]) {
              fournisseursData[item.fournisseurId] = await getNomFournisseurById(item.fournisseurId);
            }
          }
        }
        setFournisseurs(fournisseursData);
      } catch (error) {
        console.error('Erreur lors de la récupération des noms des fournisseurs:', error);
      }
    };

    fetchFournisseurs();
  }, [commandes]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Statut</TableCell>
            <TableCell className="tableCell">Fournisseur</TableCell>
            <TableCell className="tableCell">Articles</TableCell>
            <TableCell className="tableCell">Date de création</TableCell>
            <TableCell className="tableCell">Adresse</TableCell>
            <TableCell className="tableCell">Prix total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commandes.map((commande) => (
            <TableRow key={commande.id}>
              <TableCell className="tableCell">{commande.statusFournisseur}</TableCell>
              <TableCell className="tableCell">{commande.fournisseur}</TableCell>
              <TableCell className="tableCell" style={{ minWidth: '150px' }}>
               <ul>
                    {commande.items.map((item) => (
                <li key={item.id}>
                 <div>
                <img src={item.imageURL} alt={item.title} className="itemImage" style={{ width: '50px', height: '50px' }} />
                <div>{item.title}</div>
                <div>Prix: {item.price}</div>
                <div>Quantité: {item.quantity}</div>
                <div>Chef: {fournisseurs[item.fournisseurId]}</div>
                </div>
                </li>
                         ))}
                </ul>
                </TableCell>

              <TableCell className="tableCell">{commande.createdAt.toDate().toLocaleString()}</TableCell>
              <TableCell className="tableCell">{commande.address}</TableCell>
              <TableCell className="tableCell">{commande.totalPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListCommandes;
