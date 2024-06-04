import "./list.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import Datatable from "../../components/datatable/datatable"
import ChefsComponent from "../../components/chefs/chefsComponent"
import ClientsComponent from "../../components/clients/clientComponent"

const List = ({ page }) => {
  let componentToRender;
  switch (page) {
    case "chefs":
      componentToRender = <ChefsComponent />;
      break;
    case "clients":
      componentToRender = <ClientsComponent />;
      break;
    default:
      componentToRender = <Datatable />;
      break;
  }

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {componentToRender}
      </div>
    </div>
  );
};

export default List;
