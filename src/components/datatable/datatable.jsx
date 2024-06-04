import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";


const Datatable = () => {

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Chef
        <Link to="/chefs/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
     
        // Utilisez la fonction handleDelete lors du clic sur le bouton de suppression
        components={{
          Toolbar: () => (
            <div>
              {/* Vous pouvez ajouter des éléments de la barre d'outils ici */}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default Datatable;
