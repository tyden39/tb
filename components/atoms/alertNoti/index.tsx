import { Message } from 'rsuite'

interface PropsType {
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
}

export const AlertNoti = ({ message, type }: PropsType) => {
  return (
    <Message
      className="a-alert-noti"
      duration={2000}
      showIcon
      type={type}
      style={{ minWidth: 320, padding: 10 }}
    >
      {message}
    </Message>
  )
}
