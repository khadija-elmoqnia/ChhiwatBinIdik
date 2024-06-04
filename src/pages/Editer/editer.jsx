// editer.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import Editform from '../../components/chefs/Editer';
import "./editer.scss"

const Edit = () => {
  const { chefid } = useParams();
  return (
    <div className="editer">
      <Sidebar />
      <div className="Container">
        <Navbar />
        <Editform chefid={chefid} />
      </div>
    </div>
  );
};


export default Edit;
