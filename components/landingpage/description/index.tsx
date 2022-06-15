import useTranslation from 'hooks/useTranslation'
import { useState, useEffect } from 'react'
import { DefaultPropsType } from '../../../interfaces/types'

type FormData = {
  email: string
  password: string
}

export const LandingPageDescription = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const { t } = useTranslation()

  return (
    <div className={`l-landing-page-description ${className}`} style={style} data-aos="aos">
      <div className="l-landing-page-description__title">
        <p>{t('free-trial-title')}</p>
        <span>
          {t('are-u-ready')} <br /> {t('experience')}
        </span>
      </div>
    </div>
  )
}
