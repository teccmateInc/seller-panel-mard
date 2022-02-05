import { createRef, useEffect, useRef, useState } from 'react'
import CaptchaImg from 'captcha-image'
import Refresh from '@mui/icons-material/Refresh'

const Captcha = ({ getCaptchaValue }) => {
  const captchaImage = new CaptchaImg(
    '35px Arial',
    'center',
    'middle',
    150,
    100,
    '#eee',
    '#111',
    6
  ).createImage()

  function createMarkup(source) {
    return { __html: source }
  }
  let [captcha, setCaptcha] = useState(createMarkup(captchaImage))
  let cRef = createRef()

  useEffect(() => {
    // setCaptcha()
    cRef?.current && getCaptchaValue(captchaValue())
  }, [cRef, captcha])

  const refreshCaptcha = () => setCaptcha(createMarkup(captchaImage))
  const captchaValue = () => {
    let cap = cRef.current.children[0]
    return cap?.dataset.key
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div dangerouslySetInnerHTML={captcha} ref={cRef} />
      <Refresh onClick={refreshCaptcha} />
    </div>
  )
}

export default Captcha
