import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import List from "./pages/list/list";
import Login from "./pages/login/login";
import ContactAdmin from "./pages/Contact/contactadmin";
import Signup from "./pages/signup/signup"; // Importez la page d'inscription
import New from "./pages/new/new";
import Single from "./pages/single/single";
import Singleclient from "./pages/single/singleclient.jsx";
import Edit from "./pages/Editer/editer";
import { TestGetUser, TestUpdateUser,TestGetCommandesForUser,TestGetAvatarForAdmin } from './tests/test.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.scss"
import { TestComponent } from "./tests/test.jsx";
import { AdminProvider } from "./contexts/AdminContext .jsx";
import Singleadmin from "./pages/single/singleadmin.jsx";


function App() {
  return (
    <AdminProvider>
    <div className="App">
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tests">
            <Route path="getuser" element={<TestGetUser />} />
            <Route path="update" element={<TestUpdateUser />} />
            <Route path="commande" element={<TestGetCommandesForUser />} />
            <Route path="avatar" element={<TestGetAvatarForAdmin />} />
            <Route path="profit" element={< TestComponent />} />
          </Route>
          <Route path="/ContactAdmin" element={<ContactAdmin />} />    
          <Route path="/profil" element={<Singleadmin />} />      
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chefs">
            <Route index element={<List page="chefs" />} />
            <Route path="consulter/:chefid" element={<Single />} />
            <Route path="edit/:chefid" element={<Edit />} />
            <Route path="new" element={<New />} />
          </Route>
          <Route path="/clients">
            <Route index element={<List page="clients" />} />
            <Route path="consulter/:clientid" element={<Singleclient />} />
          </Route>
          <Route path="/commandes">
            <Route index element={<List page="commandes" />} />
            <Route path=":comandeid" element={<Single />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
    </AdminProvider>
  );
}

export default App;
