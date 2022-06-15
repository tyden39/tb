export const LandingFeatureTitle = ({src = '', className = ''}) => {

    return (
        <div className={`landing-feature-title ${className}`}>
            <img src={src} alt="feature" />
        </div>
    );
}