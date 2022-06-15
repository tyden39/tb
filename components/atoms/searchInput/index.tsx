import { CSSProperties } from 'react'

import { Input } from 'rsuite'

type PropsType = {
  className?: string
  style?: CSSProperties
}

export const SearchInput = ({ className = '', style }: PropsType) => {
  return (
    <div className={`a-search-input ${className}`} style={style}>
      <Input
        placeholder="Search for something ..."
        onFocus={() => console.log('go here')}
      />
    </div>
  )
}
