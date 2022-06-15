import { useRouter } from "next/router"
import { useState } from "react"
import enWords from '../languages/en.json'
import viWords from '../languages/vi.json'

const useTranslation = () => {
    const router = useRouter()

    const [locale, setLocale] = useState(router.locale)

    const translationList: any = router.locale === 'en' ? enWords : viWords

    const t = (key: string) => {
        return translationList && translationList[key] ? translationList[key] : key
    }

    const switchLocale = (localeStr: string) => {
        router.push(router.pathname,router.pathname,{locale: localeStr})
    }
    
    return {locale, t, switchLocale}
}

export default useTranslation