import React from 'react'
import Logo from '../../assests/covid-icon.svg'
import './Header.css';


function Header() {
    return (
        <div>
            <div className='header bp3-rtl'>
                <div className='title bp3-rtl'>
                    {/* COVID-19 Manifesto */}
                    كوفيد-19 منيفاست
                </div>
                <div className='logo bp3-rtl'>
                    <img src={Logo} alt='covid-19' className='logo-img'/>
                </div>
               
            </div>
        </div>
    )
}

export default Header
