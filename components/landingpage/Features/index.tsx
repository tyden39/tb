import useTranslation from 'hooks/useTranslation'
import { DefaultPropsType } from 'interfaces/types'
import React, { useEffect, useState } from 'react'
import { LandingCard } from '../Shared/Card'

export const LandingFeatures = ({
  className = '',
  style,
}: DefaultPropsType) => {
  const {t} = useTranslation()

  const [moveDown, setMoveDown] = useState('')
  const [moveLeft, setMoveLeft] = useState('')
  const [moveRight, setMoveRight] = useState('')
  const [moveUp, setMoveUp] = useState('')

  const handleScroll = (e: any) => {
    const featureItems = document.getElementById('feature-items')
    if (featureItems){
      if (window.scrollY > featureItems.offsetTop + window.innerHeight/2) {
          setMoveLeft('move-left');
          setMoveUp('move-up');
          setMoveRight('move-right');
      }
    }

    if (window.scrollY > 10) setMoveDown('move-down')
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  },[])

  return (
    <div
      id="features"
      className={`landing-features ${className} ${moveUp}`}
      style={style}
    >
      <div className="landing-wrapper">
        <div id='features-title' className={`landing-features__title ${moveDown}`}>
          <h1>{t('features-title')}</h1>
          <p>{t('features-description')}</p>
        </div>
        <div id="feature-items" className="landing-features__content">
          <LandingCard
            className={`landing-features__content__card ${moveRight}`}
            imgUrl="/images/landingpage/question.png"
            title={t('feature-1')}
            descriptionText={t('description-1')}
          />
          <LandingCard
            className={`landing-features__content__card ${moveLeft}`}
            imgUrl="/images/landingpage/vocab.png"
            title={t('feature-2')}
            descriptionText={t('description-2')}
          />
          <LandingCard
            className={`landing-features__content__card ${moveRight}`}
            imgUrl="/images/landingpage/ui.png"
            title={t('feature-3')}
            descriptionText={t('description-3')}
          />
          <LandingCard
            className={`landing-features__content__card ${moveLeft}`}
            imgUrl="/images/landingpage/test.png"
            title={t('feature-4')}
            descriptionText={t('description-4')}
          />
        </div>
      </div>
    </div>
  )
}
