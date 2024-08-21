import i18n, { type ResourceLanguage } from 'i18next'
import detector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

export type Lang = 'en-US' | 'zh-CN'

const modules: Record<`./modules/${Lang}.ts`, ResourceLanguage> = import.meta.glob(`./modules/*.ts`, { import: 'default', eager: true })
const resources = Object
  .entries(modules)
  .reduce((memo, [filename, module]) => {
    const name = filename.match(/\.\/modules\/(.*?)\.ts/)?.[1]
    return name ? Object.assign(memo, { [name]: module }) : memo
  }, <Record<Lang, ResourceLanguage>>{})

export const languages: Record<Lang, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: Object.fromEntries(Object.entries(resources).map(([lang, module]) => [lang, { translation: module }])),
    // 如果自动检测不可用，将使用 en
    fallbackLng: 'en-US',
  })
