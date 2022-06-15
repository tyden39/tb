import { useRouter } from 'next/router'

import { LandingPageContact } from 'components/landingpage/contact'
import { LandingPageFreeTrial } from 'components/landingpage/free-trial'

export default function LandingSlug() {
  const router = useRouter()

  switch (router.query.templateSlug) {
    case 'free-trial':
      return <LandingPageFreeTrial />
    case 'contact':
      return <LandingPageContact />
    default:
      return <h1>default</h1>
  }
}
