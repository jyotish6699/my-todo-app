import { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [customColor, setCustomColor] = useState(localStorage.getItem('customColor') || '');
    
    // Try to sync with User Settings if logged in
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    useEffect(() => {
        if (user?.settings?.dashboardColor !== undefined) {
             setCustomColor(user.settings.dashboardColor);
        }
    }, [user]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('customColor', customColor);
        if (customColor) {
             document.body.style.backgroundColor = customColor;
        } else {
             document.body.style.backgroundColor = '';
        }
    }, [customColor]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, customColor, setCustomColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
