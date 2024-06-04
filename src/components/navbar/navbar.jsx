import { useEffect, useState } from 'react';
import { getAvatarForAdmin } from '../../services/firebaseservice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import "./navbar.scss";


const Navbar = () => {
    const email = localStorage.getItem('adminEmail');
    const [avatarURL, setAvatarURL] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const avatar = await getAvatarForAdmin(email);
                setAvatarURL(avatar);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'avatar:', error);
            }
        };

        if (email) {
            fetchAvatar();
        }
    }, [email]);

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Rechercher..." />
                    <SearchIcon className="icon" />
                </div>
                <div className="items">
                    <div className="item">
                        <NotificationsIcon className="icon" />
                        <div className='counter'>1</div>
                    </div>
                    <div className="item">
                        <SettingsIcon className="icon" />
                        
                    </div>
                    <div className="item avatar-placeholder">
                        {avatarURL ? (
                            <img src={avatarURL} alt="Avatar" className="avatar-preview" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        ) : (
                            <span className="avatar-placeholder-text">Profil</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
