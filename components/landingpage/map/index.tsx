import { DefaultPropsType } from '../../../interfaces/types'

export const MapGoolge = ({ className = '', style }: DefaultPropsType) => {
  return (
    <div className={`l-map-goolge ${className}`} style={style}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1959.6037148091982!2d106.6785536!3d10.7954191!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752929ffaa45e7%3A0xeacba3ee960d23a0!2sDAI%20TRUONG%20PHAT%20EDUCATION%20JSC!5e0!3m2!1sen!2s!4v1641433661908!5m2!1sen!2s"
        width={600}
        height={450}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        className="l-map-goolge__iframe-style"
      />
    </div>
  )
}
