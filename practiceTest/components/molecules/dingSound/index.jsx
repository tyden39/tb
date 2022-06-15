import { useContext, useEffect, useRef, useState } from 'react'

import { PageTestContext } from '../../../interfaces/contexts'

export const DingSound = () => {
  const { currentQuestion } = useContext(PageTestContext)

  const [isFirstPlay, setIsFirstPlay] = useState(true)

  const audio = useRef(null)

  useEffect(() => {
    if (isFirstPlay) setIsFirstPlay(false)
    else {
      if (audio?.current) {
        audio.current.currentTime = 0
        audio.current.play()
      }
    }
  }, [audio, currentQuestion.index])

  return (
    <audio ref={audio} style={{ display: 'none' }}>
      <source src="/pt/audio/page-flip-01a.wav" />
    </audio>
  )
}
