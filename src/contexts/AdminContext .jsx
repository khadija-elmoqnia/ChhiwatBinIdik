// AdminContext.js
import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [adminEmail, setAdminEmail] = useState('');

    return (
        <AdminContext.Provider value={{ adminEmail, setAdminEmail }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
