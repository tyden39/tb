type PropsType = {
  style?: any
  styleBold?: boolean
  className?: string
  onClick?: (data: any) => void
  children?: any
}

export const LandingButton = ({
  className = '',
  style = {},
  onClick = () => {},
  children,
}: PropsType) => {
  return (
    <div
      className={`landing-button ${className}`}
      style={style}
      onClick={onClick}
    >
      <p>{children}</p>
    </div>
  )
}
