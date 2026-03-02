import React from 'react';
import "./Footer.scss";

const Footer: React.FC = () => {
    return (
        <footer className='footer'>
            <p>&copy; {new Date().getFullYear()} Bradley Hill &mdash; Forum Project</p>
        </footer>
    );
};

export default Footer;