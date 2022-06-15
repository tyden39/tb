import { CSSProperties, useState } from 'react'

import { useRouter } from 'next/dist/client/router';
import { Input, Button } from 'rsuite'
import { validateEmail } from 'api/utils';

type PropsType = {
  className?: string
  style?: CSSProperties
  testName?: string
  testTime?: string
  onStart?: (data: any) => void
}

export const StartTestScreen = ({ className = '', style, testName, testTime, onStart }: PropsType) => {
  const router = useRouter();
  const [dataForm, setDataForm] = useState({
    name: '',
    class: '',
    email: ''
  });

  const [errorName, setErrorName] = useState(null);
  const [errorClass, setErrorClass] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);

  const changeData = (type: string, value: string) => {
    const newDataForm: any = {...dataForm};
    newDataForm[type] = value;
    setDataForm(newDataForm);
  }

  const onClickStart = (e: any) => {
    e.preventDefault();
    if (!dataForm.name) {
      setErrorName('Bạn cần nhập thông tin này');
      return;
    } else {
      setErrorName(null);
    }
    if (!dataForm.class) {
      setErrorClass('Bạn cần nhập thông tin này');
      return;
    } else {
      setErrorClass(null);
    }
    if (!dataForm.email) {
      setErrorEmail('Bạn cần nhập thông tin này');
      return;
    } else if (!validateEmail(dataForm.email)) {
      setErrorEmail('Email không hợp lệ');
      return;
    } else {
      setErrorEmail(null);
    }
    onStart && onStart(dataForm);
  }

  return (
    <div
      className={`m-start-test-screen ${className}`}
      style={style}
    >
      <div className="m-start-test-screen__container">
        <div className="header">
          <img src="/images/practice-test/book.png" alt="lession" className="img-book" />
          <div className="test-name">
            <div className="test-title">{testName}</div>
            <div className="test-time">Thời gian làm bài: {testTime} phút</div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="left">
          <img src="/images/practice-test/test-start.png" alt="start-img" className="img-start"/>
        </div>
        <div className="right">
          <form 
            className="form-group"
            onSubmit={onClickStart}
          >
            <p className="instruction">Vui lòng nhập thông tin trước khi làm bài</p>
            <div className="form-field">
              <p className="field-label">Tên</p>
              <Input
                placeholder="Tên của bạn"
                onChange={(val) => {changeData('name', val); setErrorName(null)}}
              />
              { errorName &&<p className="field-error">{errorName}</p>}
            </div>
            <div className="form-field">
              <p className="field-label">Lớp</p>
              <Input
                placeholder="Lớp của bạn"
                onChange={(val) => {changeData('class', val); setErrorClass(null)}}
              />
              { errorClass &&<p className="field-error">{errorClass}</p>}
            </div>
            <div className="form-field">
              <p className="field-label">Email</p>
              <Input
                className="input-field"
                placeholder="địa chỉ email"
                onChange={(val) => {changeData('email', val); setErrorEmail(null)}}
              />
              {errorEmail && <p className="form-error-message">{errorEmail}</p>}
            </div>
            <div className="form-field form-button">
              <Button
                className="submit-btn"
                appearance="primary"
                color="blue"
                // onClick={onClickStart}
                type="submit"
              >
                Bắt đầu
            </Button>
            </div>
            <div className="bottom-gradient"/>
          </form>
        </div>
      </div>

    </div>
  )
}
