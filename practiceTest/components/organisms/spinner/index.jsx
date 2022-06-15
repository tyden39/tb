import { Loader } from 'rsuite'

import { SPINNER_TYPE } from '../../../interfaces/types'

export const Spinner = ({ className }) => {
  return (
    <Loader
      className={className}
      backdrop={true}
      content="Loading"
      size="lg"
      speed="slow"
      vertical={true}
    />
  )
}

Spinner.propTypes = SPINNER_TYPE
