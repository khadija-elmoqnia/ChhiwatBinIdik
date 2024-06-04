import "./sidebar.scss"
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PeopleIcon from '@mui/icons-material/People';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from 'react-router-dom'; // Importez le composant Link depuis react-router-dom

const Sidebar = () => {
    const handleLogout = () => {
        // Vide le localStorage lors de la déconnexion
        localStorage.clear();
    };

    return (
        <div className="sidebar">
            <div className="top">
                <span className="logo">  Chiwatbin idik    Admin page </span>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">Principale</p>
                    <li>
                        <span className="dashbord">
                            <Link to="/home" className="link">
                                <DashboardIcon className="icon"/> Dashbord
                            </Link>
                        </span>
                    </li>
                    <p className="title">Gestion </p>
                    <li>
                        <span className="dashbord">
                            <Link to="/chefs" className="link">
                                <RestaurantIcon className="icon"/> Chefs
                            </Link>
                        </span>
                    </li> 
                    <li>
                        <span className="dashbord">
                            <Link to="/clients" className="link">
                                <PeopleIcon className="icon"/> Clients
                            </Link>
                        </span>
                    </li> 
                    
                    <p className="title">Utilisateur</p>
                    <li>
                        <span className="dashbord">
                            <Link to="/profil" className="link">
                                <AccountBoxIcon className="icon"/> Mon profil
                            </Link>
                        </span>
                    </li>
                    <li>
                        <span className="dashbord">
                            <Link to="/signup" className="link" onClick={handleLogout}>
                                <PowerSettingsNewIcon className="icon"/> Deconnexion
                            </Link>
                        </span>
                    </li>
                </ul>
            </div>
            
            <div className="bottom">
                <div className="coloroption"> </div>
                <div className="coloroption"> </div>
            </div>
        </div>
    );
}

export default Sidebar;

