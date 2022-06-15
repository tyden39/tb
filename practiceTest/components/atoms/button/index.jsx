import { Button } from 'rsuite'

import { CUSTOM_BUTTON_TYPE } from '../../../interfaces/types'

export const CustomButton = ({
  className,
  children,
  appearance = 'default',
  isDisabled = false,
  isLoading = false,
  style,
  onClick,
}) => {
  return (
    <Button
      className={className}
      appearance={appearance}
      disabled={isDisabled}
      loading={isLoading}
      style={style}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

CustomButton.propTypes = CUSTOM_BUTTON_TYPE
