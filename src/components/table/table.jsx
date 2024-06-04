import React, { useState, useEffect } from 'react';
import { getPlatsForChef } from '../../services/firebaseservice'; // Assurez-vous d'importer correctement
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './table.scss';

const List = ({ chefid }) => {
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const platsData = await getPlatsForChef(chefid);
        setPlats(platsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des plats:', error);
      }
    };

    fetchPlats();
  }, [chefid]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Title</TableCell>
            <TableCell className="tableCell">Price</TableCell>
            <TableCell className="tableCell">Image</TableCell>
            <TableCell className="tableCell">Description</TableCell>
            <TableCell className="tableCell">Category </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plats.map((plat) => (
            <TableRow key={plat.id}>
              <TableCell className="tableCell">{plat.title}</TableCell>
              <TableCell className="tableCell">{plat.price}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={plat.imageURL} alt={plat.title} className="image" />
                </div>
              </TableCell>
              <TableCell className="tableCell">{plat.description}</TableCell>
              <TableCell className="tableCell">{plat.categoryId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
