import { NextApiRequest, NextApiResponse } from 'next'

import { query } from 'lib/db'
import { SMTPClient, Message } from 'emailjs'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return sendMail()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function sendMail() {
    const client = new SMTPClient({
      user: 'phamhaibkit1@gmail.com',
      password: '12345678x@X',
      host: 'smtp.gmail.com',
      port: 465,
      // tls: true,
      ssl: true
    })

    const data = req.body
    const user = await query<any[]>('SELECT * FROM user WHERE id = ? LIMIT 1', [
      data?.teacherId,
    ])
    try {
      if (user.length > 0) {
        const EMAIL_TEMPLATE = `
        <!DOCTYPE html>
        <html>
        
        <head></head>
        
        <body>
          <div style="min-height: 400px;display: flex;justify-content: center;align-items: center;">
            <div style="position: relative;width: 60%;;min-width: 500px;">
              <div
                style="display: flex;border: 1px solid #F5F5F5;background-color: #ffffff;overflow: hidden;border-radius: 1rem;padding-bottom: 1rem;overflow: scroll">
                <div
                  style="display: flex;width: 50%;justify-content: center;align-items: center;background-color: #F3F8FD;padding: 16px 32px;">
                  <p>
                    Kính gửi quý thầy/ cô ${user[0]?.user_name},
                    <br>
                    Kính gửi quý thầy/ cô kết quả bài thi ${data?.testName} của học viên ${data?.name}. Thầy/ cô vui lòng kiểm tra thông tin chi tiết ở bảng bên phải
                  </p>
                </div>
                <div style="display: flex;width: 50%;justify-content: center;align-items: center;padding: 16px 32px;">
                  <div
                    style="border: 1px solid #D1E9FE;padding: 16px 32px;border-radius: 16px;max-width: 300px;min-height: 120px;overflow: auto;">
                    <p>- Bài thi:<span> ${data?.testName}</span></p>
                    <p>- Khối lớp:<span> ${data?.gradeName}</span></p>
                    <p>- Lớp:<span> ${data?.class}</span></p>
                    <p>- Tên học sinh:<span> ${data?.name}</span></p>
                    <p>- Email:<span> ${data?.email}</span></p>
                    <p>- Điểm:<span> ${data?.point}</span></p>
                  </div>
                </div>
              </div>
              <div
                style="width: 100%;height: 1rem;background: linear-gradient(-90deg, #00EDFF, #2692FF);border-radius: 0 0 1rem 1rem;content: '';pointer-events: none;position: absolute;left: 0;bottom: 0;" />
            </div>
          </div>
        </body>
        
        </html>
          `
        const message = new Message({
          text: ``,
          // from: 'no_reply@dtp-education.com',
          from: 'phamhaibkit1@gmail.com',
          to: user[0].email,
          // to: 'phamhaibkit@gmail.com',
          cc: '',
          subject: `${data?.testName} Kết quả bài thi của học viên ${data?.name}`,
          attachment: [{ data: EMAIL_TEMPLATE, alternative: true }],
        })
        client.send(message, (err, message) => {
          console.log('Mail message', err || message)
        })
        return res.json({
          isSuccess: true,
        })
      } else {
        return res.json({
          error: true,
          message: 'Không tìm thấy địa chỉ mail giáo viên',
        })
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
