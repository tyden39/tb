import { useState } from "react";

export const LandingMenuIcon = ({className = '', style = {}, onClick = (open: boolean) => {}}) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        if (active) {
            setActive(false)
            onClick(false);
        } else {
            setActive(true)
            onClick(true);
        }
    }

    return (
      <div className={`landing-menu-icon ${active && 'active'} ${className}`} onClick={handleClick}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
}