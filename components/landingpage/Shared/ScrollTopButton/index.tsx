import { DefaultPropsType } from "interfaces/types"
import { useEffect, useState } from "react";

export const LandingScrollTopButton = ({ className = '', style } : DefaultPropsType) => {
    const [visible, setVisible] = useState(false)

    const handleScroll = (e: any) => {
        if (window.scrollY >= window.innerHeight/2.5) setVisible(true);
        else setVisible(false);
      }
    
      useEffect(() => {
        document.addEventListener('scroll', handleScroll)
    
        return () => {
          document.removeEventListener('scroll', handleScroll)
        }
      }, [])
    
    return(
        <>
            {visible &&
                <div className={`landing-scrollToTop ${className}`} style={style} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <img src="/images/landingpage/up-arrow.png" alt="Scroll to top" />
                </div>
            }
        </>
    )
}

