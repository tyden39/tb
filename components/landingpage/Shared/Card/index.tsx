import { DefaultPropsType } from "interfaces/types"
import { useEffect, useState } from "react"
import { LandingFeatureTitle } from "../FeatureTitle";

type PropsType = {
    className?: string, 
    style?: any, 
    children?: any,
    descriptionText: string,
    title: string,
    imgUrl: string
}

export const LandingCard = ({ className = '', style, title, descriptionText, imgUrl}: PropsType) => {
    const [pause, setPause] = useState('');
    const [visibleDescription, setVisibleDescription] = useState(false);

    const handleMouseEnter = () => {
        setVisibleDescription(true);
        setPause('pause-rotate')
    }

    const handleMouseLeave = () => {
        if (window.innerWidth <= 767) 
            setVisibleDescription(true);
        else setVisibleDescription(false);
        setPause('')
    }

    const handleWidthChange = () => {
        if (window.innerWidth <= 767)
            setVisibleDescription(true)
        else
            setVisibleDescription(false)
    }

    useEffect(() => {
        if (window.innerWidth <= 768) setVisibleDescription(true)
        window.addEventListener('resize', handleWidthChange)

        return () => window.removeEventListener('resize', handleWidthChange)
    })

    return (
        <div className={`landing-card ${className}`} style={style} data-aos="aos">
            <div className={`rotate ${pause}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{borderRadius: '2.4rem', background: 'white'}}>
                <div className={`landing-card__title`}>
                    <LandingFeatureTitle src={imgUrl} className={``}/>
                    <p>{title}</p>
                </div> 
            </div>
            {visibleDescription &&
                <div className={`landing-card__description ${visibleDescription}`} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
                    <p>{descriptionText}</p>
                </div>
            }
        </div>
    )
}
