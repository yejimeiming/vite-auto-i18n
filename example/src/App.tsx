import { useState, useEffect } from 'react'
import i18next from 'i18next'
import { languages } from '@/i18n/init'

export default () => {
  const [lang, setLang] = useState(i18next.language)
  const [text, setText] = useState('state 文案')
  const langs = []

  useEffect(() => {
    i18next.on('languageChanged', lang => setLang(lang))
    return () => {
      i18next.off('languageChanged')
    }
  }, [])

  return (
    <div>
      {text}
      {'jsx 文案'}
      <ul>
        <li><span>前缀</span>第一个列表</li>
        <li>第二个列表<span>尾缀</span></li>
      </ul>
      <hr />
      {/* @ts-ignore */}
      <div>当前语言: {languages[lang]}</div>
      <div>
        {Object.entries(languages).map(([value, label]) => (
          <button
            key={value}
            style={{ color: value === lang ? '#f50' : undefined }}
            onClick={() => { i18next.changeLanguage(value) }}
          >{label}</button>
        ))}
      </div>
    </div>
  )
}
