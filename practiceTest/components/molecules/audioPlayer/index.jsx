import { AUDIO_PLAYER_TYPE } from '../../../interfaces/types'
import { CustomImage } from '../../atoms/image'

export const AudioPlayer = ({
  className = '',
  style,
  isPlaying = false,
  setIsPlaying = () => null,
}) => {
  return (
    <div
      className={`pt-m-audio-player ${className} ${isPlaying ? '--play' : ''}`}
      style={style}
      onClick={setIsPlaying ? setIsPlaying : () => null}
    >
      <CustomImage
        className={
          isPlaying ? 'pt-m-audio-player__pause' : 'pt-m-audio-player__play'
        }
        alt={isPlaying ? 'pause' : 'play'}
        src={
          isPlaying
            ? '/pt/images/icons/ic-pause.svg'
            : '/pt/images/icons/ic-play.svg'
        }
        yRate={0}
      />
      <div className="pt-m-audio-player__shadow"></div>
    </div>
  )
}

AudioPlayer.propTypes = AUDIO_PLAYER_TYPE
