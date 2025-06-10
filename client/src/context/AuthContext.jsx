import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      setUser({token})
    }
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
