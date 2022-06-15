import { replaceTyphoStr } from 'utils/string'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  data: string
}

const typho = ['%b%', '%i%', '%u%']

export const MultiChoicesQuestion = ({
  className = '',
  data,
  style,
}: PropsType) => {
  let typhoData = data
  typho.forEach((item) => {
    typhoData = replaceTyphoStr(typhoData, item)
  })

  return (
    <div className={`a-multichoicequestion ${className}`} style={style}>
      <div className="a-multichoicequestion__title">
        <span
          dangerouslySetInnerHTML={{
            __html: typhoData.replace(/%s%/g, '__________'),
          }}
        ></span>
      </div>
    </div>
  )
}
