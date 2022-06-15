import { CSSProperties } from 'react'

import { Steps } from 'rsuite'

type PropsType = {
  className?: string
  activeIndex: number
  data: string[]
  style?: CSSProperties
}

export const UnitTestStep = ({
  className = '',
  activeIndex,
  data,
  style,
}: PropsType) => {
  return (
    <div className={`m-unit-test ${className}`} style={style}>
      <Steps current={activeIndex}>
        {data.map((item: string, i: number) => (
          <Steps.Item key={i} title={item} />
        ))}
      </Steps>
    </div>
  )
}
