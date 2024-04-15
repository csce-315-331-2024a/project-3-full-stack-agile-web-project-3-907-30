import { useEffect, useState } from "react";
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { SelectPicker } from 'rsuite';


declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

const Translate = () => {
  const [languageOptions, setLanguageOptions] = useState<any>([]);
  const [selected, setSelected] = useState<any>(null)

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'auto',
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    },
      'google_translate_element');
  }

  const langChange = (e: any, m: any, evt: any) => {
    if (hasCookie('googtrans')) {
      setCookie('googtrans', decodeURI(e))
      setSelected(e)
    }
    else {
      setCookie('googtrans', e)
      setSelected(e)
    }
    window.location.reload()
  }

  useEffect(() => {
    getLanguageOptions();

    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;

    if (hasCookie('googtrans')) {
      setSelected(getCookie('googtrans'))
    }
    else {
      setSelected('/auto/en')
    }
  }, []);

  const getLanguageOptions = async () => {
    const response = await fetch('/api/languages/get-all');
    const data = await response.json();
    setLanguageOptions(data.supportedLanguages);
  }

  return (
    <div>
      <div id="google_translate_element" className="hidden"></div>
      <SelectPicker
        data={languageOptions}
        style={{ width: 200 }}
        placement="bottomEnd"
        cleanable={false}
        value={selected}
        searchable={false}
        className={'notranslate'}
        menuClassName={'notranslate'}
        onSelect={(e, m, evt) => langChange(e, m, evt)}
        placeholder="Select Language" />
    </div>
  );
}

export default Translate;
