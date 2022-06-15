import { HERO_TYPE } from '../../../interfaces/types'
import { CustomHeading } from '../../atoms/heading'
import { CustomImage } from '../../atoms/image'
import { CustomText } from '../../atoms/text'

export const Hero = ({ data }) => {
  const { title, description } = data

  return (
    <section className="pt-o-hero">
      <div className="pt-o-hero__content">
        <div data-animate="fade-right">
          <CustomHeading tag="h4" className="__heading">
            {title}
          </CustomHeading>
        </div>
        <div data-animate="fade-right" data-animate-delay="200">
          <CustomText tag="p" className="__text">
            {description}
          </CustomText>
        </div>
      </div>
      <div className="pt-o-hero__banner" data-animate="fade-left">
        <CustomImage
          alt="hero banner"
          src="/pt/images/collections/clt-hero.png"
          yRate={78}
        />
      </div>
    </section>
  )
}

Hero.propTypes = HERO_TYPE
