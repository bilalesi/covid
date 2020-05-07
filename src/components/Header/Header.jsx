import React from 'react'
import Logo from '../../assests/covid-icon.svg'
import './Header.css';


function Header() {
    return (
        <div>
            <div className='header'>
                <div className='logo'>
                    <img src={Logo} alt='covid-19' className='logo-img'/>
                </div>
                <div className='title'>
                    COVID-19 Manifesto
                </div>
            </div>
        </div>
    )
}

export default Header
