import useTranslation from "hooks/useTranslation";
import { DefaultPropsType } from "interfaces/types"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const LandingDropdown = ({ className = '', style = {} }: DefaultPropsType) => {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false);
    const {switchLocale} = useTranslation()

    const handleSelectLanguage = (event: any) => {
        setIsVisible(false);
        switchLocale(event.target.innerText==='VN'?'vi':'en');
        
        document.getElementById('landing-header').classList.remove("mobile-menu-visible")
        document.getElementsByClassName('landing-menu-icon')[0].classList.remove('active')
        document.body.classList.remove("stop-scrolling")
        var myDiv = document.getElementById('landing-header');
        myDiv.scrollTop = 0;
    }

    const handleDropdownClick = (event: any) => {
        event.stopPropagation()
        setIsVisible(!isVisible)
    }

    const handleWindowClick = (event: any) => {
        const classNameClicked = event.target.className;
        if (classNameClicked !== 'landing-dropdown__selected' || classNameClicked !== 'landing-dropdown__icon') setIsVisible(false);
    }

    useEffect(() => {
        window.addEventListener('click', handleWindowClick)
        return () => window.removeEventListener('click', handleWindowClick)
    },[])

    return (
        <div className={`landing-dropdown ${className}`} style={style} onClick={handleDropdownClick}>
            <p className="landing-dropdown__selected">{router.locale === 'vi' ? "VN" : "EN" } <img className="landing-dropdown__icon" src="/images/landingpage/dropdown-arrow.png" alt="arrow" /></p>
            { isVisible && 
                <div className={`landing-dropdown__content`}>
                    <p onClick={handleSelectLanguage}>EN</p>
                    <p onClick={handleSelectLanguage}>VN</p>
                </div>
            }
        </div>
    )
}