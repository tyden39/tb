import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import { Button, Message, toaster, Checkbox } from 'rsuite'
import { mutate } from 'swr'

import { paths } from 'api/paths'
import { Card } from 'components/atoms/card'
// import { InputField } from 'components/atoms/inputField'
import { SelectField } from 'components/atoms/selectField'
import { Wrapper } from 'components/templates/wrapper'
import { BreadcrumbItemType } from 'interfaces/types'
import { useRoles, useUser } from 'lib/swr-hook'
import { InputWithLabel } from 'components/atoms/inputWithLabel'
import { InputPassword } from 'components/atoms/inputPassword'
import { useEffect, useState } from 'react'
import { validateEmail } from 'api/utils'
import { BreadCrumbNav } from 'components/molecules/breadCrumbNav'

type PropsType = {
  idUser: string
}

export default function UserUpdatePage({ idUser }: PropsType) {
  const router = useRouter()

  const { user } = useUser(idUser)
  const { roles } = useRoles()
  const fullRole = [
    { display: 'Admin', code: '0'}
  ]

  const [formData, setFormData] = useState({
    id: idUser,
    user_name: user?.user_name,
    email: user?.email,
    password: '',
    user_role_id: user?.user_role_id?.toString(),
    deleted: user?.deleted === 0,
    is_admin: user?.is_admin
  })

  const [isPasswordType, setIsPassWordType] = useState(true)
  const [errorUser, setErrorUser] = useState(null)
  const [errorEmail, setErrorEmail] = useState(null)
  const [errorPass, setErrorPass] = useState(null)
  const [errorRole, setErrorRole] = useState(null)

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    { name: 'Quản lý người dùng', url: '/users' },
    {
      name: idUser !== '-1' ? 'Chỉnh sửa người dùng' : 'Tạo người dùng',
      url: null,
    },
  ]

  useEffect(() => {
    const newFormData = { ...formData }
    newFormData.user_name = user?.user_name
    newFormData.email = user?.email
    newFormData.user_role_id = user?.user_role_id?.toString()
    newFormData.deleted = user?.deleted === 0
    newFormData.is_admin = user?.is_admin
    setFormData(newFormData)
  }, [user])

  const onChangeData = (type: string, value: any) => {
    const newData: any = { ...formData }
    if (type === 'user_role_id') {
      newData.is_admin = value === '0';
      newData.user_role_id = value === '0' ? null : value;
    } else {
      newData[type] = typeof value === 'string' ? value.trim() : value;
    }
    console.log('NewDataata===', newData)
    setFormData(newData)
  }

  // const onSubmit = async (formData: FormData) => {
  const onSubmit = async () => {
    try {
      formData.id = idUser
      if (!formData.user_name) {
        setErrorUser('Tài khoản không được để trống')
        return
      } else {
        setErrorUser(null)
      }
      if (!formData.email) {
        setErrorEmail('Email không được để trống')
        return
      } else {
        setErrorEmail(null)
      }
      if (formData.email && !validateEmail(formData.email)) {
        setErrorEmail('Định dạng email không đúng!')
        return
      } else {
        setErrorEmail(null)
      }
      if (!formData.password && idUser === '-1') {
        setErrorPass('Mật khẩu không được để trống')
        return
      } else {
        setErrorPass(null)
      }
      if (!formData.user_role_id && !formData.is_admin) {
        setErrorRole('Vai trò không được để trống')
        return
      } else {
        setErrorRole(null)
        const newForm: any = { ...formData }
        newForm.deleted = formData.deleted ? 0 : 1
        const res = await fetch(paths.api_users, {
          method: idUser === '-1' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newForm),
        })
        const json = await res.json()
        if (!res.ok) throw Error(json.message)
        if (json.error) throw Error(json.message)

        toaster.push(
          <Message showIcon type="success">
            Lưu thành công
          </Message>,
        )
        // setValue('password', '', { shouldValidate: false })
        if (idUser === '-1') {
          router.replace('/users/[userSlug]', `/users/${json.id}`)
        } else {
          mutate(`${paths.api_users}/${idUser}`, json, false)
        }
      }
    } catch (e: any) {
      toaster.push(
        <Message showIcon type="error">
          {e.message}
        </Message>,
      )
    }
  }

  const getFullRole = () => {
    roles.map((m) => {
      fullRole.push({ display: m.name, code: m.id.toString() })
    })
    return fullRole;
  }

  return (
    <Wrapper
      className="p-user-update"
      pageTitle={idUser !== '-1' ? 'Chỉnh sửa người dùng' : 'Tạo người dùng'}
    >
      <div className="p-detail-format__breadcrumb">
        <BreadCrumbNav data={breadcrumbData} />
      </div>
      <Card title={'Thông tin người dùng'} style={{ marginBottom: '2rem' }}>
        {(idUser === '-1' || user) && (
          <div className="p-user-update__container">
            <form autoComplete="new-password">
              <div className="__form-control __form-container">
                {/* <InputField
                  label="Tên người dùng"
                  type="text"
                  register={register('user_name', {
                    required: {
                      value: true,
                      message: 'Tài khoản không được để trống',
                    },
                    maxLength: {
                      value: 45,
                      message: 'Tài khoản không được lớn hơn 45 ký tự',
                    },
                  })}
                  defaultValue={user?.user_name}
                  className="--mb-16"
                /> */}
                <div className="form-row">
                  <InputWithLabel
                    className="info-input"
                    label="Tên người dùng"
                    type="text"
                    onChange={(val) => onChangeData('user_name', val)}
                    autoFocus={true}
                    defaultValue={user?.user_name}
                    isError={errorUser}
                  />
                  {errorUser && (
                    <p className="form-error-message">{errorUser}</p>
                  )}
                </div>
                <div className="form-row">
                  <InputWithLabel
                    className="info-input"
                    label="Email"
                    type="text"
                    onChange={(val) => {
                      onChangeData('email', val)
                      setErrorEmail(null)
                    }}
                    defaultValue={user?.email}
                    isError={errorEmail}
                  />
                  {errorEmail && (
                    <p className="form-error-message">{errorEmail}</p>
                  )}
                </div>
                <div className="contai-pass">
                  <InputPassword
                    className="info-input"
                    label="Mật khẩu"
                    type={isPasswordType ? 'password' : 'text'}
                    onChange={(val) => {
                      onChangeData('password', val)
                      setErrorPass(null)
                    }}
                    defaultValue={formData?.password}
                    speaker={<div />}
                  />
                  <img
                    className="eye-icon"
                    src="/images/authen/show-password.png"
                    onClick={() => setIsPassWordType(!isPasswordType)}
                  />
                </div>
                {errorPass && <p className="form-error-message">{errorPass}</p>}
                {roles && (
                  <div className="form-row">
                    <SelectField
                      label="Vai trò"
                      defaultValue={user?.is_admin ? '0' : user?.user_role_id?.toString()}
                      data={getFullRole()}
                      onChange={(value: any) => {
                        onChangeData('user_role_id', value)
                        setErrorRole(null)
                      }}
                    />
                    {errorRole && (
                      <p className="form-error-message">{errorRole}</p>
                    )}
                  </div>
                )}
                <div className="form-check">
                  <Checkbox
                    // defaultChecked={formData.deleted}
                    checked={formData.deleted}
                    onChange={() => onChangeData('deleted', !formData.deleted)}
                  >
                    {' '}
                    Hoạt động
                  </Checkbox>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    style={{
                      color: '#6262BC',
                      fontSize: 16,
                      backgroundColor: '#F1F1F9',
                      width: 224,
                      padding: 12,
                      marginRight: 12,
                    }}
                    onClick={() => router.back()}
                  >
                    Quay lại
                  </Button>
                  <Button
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                      backgroundColor: '#6262BC',
                      width: 224,
                      padding: 12,
                      marginLeft: 12,
                    }}
                    onClick={() => onSubmit()}
                  >
                    Hoàn tất
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Card>
    </Wrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context

  return { props: { idUser: query.userSlug } }
}
