import { NextApiRequest, NextApiResponse } from 'next'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { OPT_TIME_MINUTES } from 'utils/constant'
import { SMTPClient, Message } from 'emailjs'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return createOpt()
    case 'PUT':
      return updateOpt()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function createOpt() {
    const client = new SMTPClient({
      user: 'no_reply@dtp-education.com',
      password: 'Dtponline@2012',
      host: 'smtp.office365.com',
      port: 25,
      tls: true,
    })

    const item: UserDataType = req.body
    const otp_code = Math.floor(100000 + Math.random() * 900000) + ''
    const currentTime = new Date()
    const expired_date = new Date(
      currentTime.getTime() + OPT_TIME_MINUTES * 60000,
    )
    console.log('CreateOTP===', otp_code, expired_date)

    const user = await query<any[]>(
      'SELECT * FROM user_otp WHERE user_name = ? LIMIT 1',
      [item.user_name],
    )

    try {
      const message = new Message({
        text: `Your OTP is: ${otp_code}`,
        from: 'no_reply@dtp-education.com',
        to: item.user_name,
        cc: '',
        subject: 'Confirm OTP',
      })
      client.send(message, (err, message) => {
        console.log('Mail message', err || message)
      })

      if (user.length > 0) {
        const result = await query<any>(
          `UPDATE user_otp SET otp_code = ?, expired_date = ? WHERE user_name = ?`,
          [otp_code, expired_date, item.user_name],
        )
        if (result.affectedRows !== 1) {
          throw Error('insert failed')
        }
        return res.json({
          isSuccess: true,
        })
      } else {
        const result = await query<any>(
          `INSERT INTO user_otp (user_name, otp_code, expired_date)
          VALUES (?,?,?)`,
          [item.user_name, otp_code, expired_date],
        )
        if (result.affectedRows !== 1) {
          throw Error('insert failed')
        }
        return res.json({ isSuccess: true })
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function updateOpt() {
    const item = req.body
    const currentTime = new Date()

    const user = await query<any[]>(
      'SELECT * FROM user_otp WHERE user_name = ? LIMIT 1',
      [item.user_name],
    )

    console.log('USer===', user[0])
    console.log('CreateOTP===', item.otp_code, user[0].otp_code)

    if (user.length > 0 && item.otp_code === user[0].otp_code) {
      if (user[0].expired_date < currentTime) {
        return res.json({
          error: true,
          message: 'Mã OTP hết hiệu lực.',
        })
      } else {
        const deleteOtp = await query<any>(
          'DELETE FROM user_otp WHERE user_name = ?',
          [item.user_name],
        )
        if (deleteOtp.affectedRows !== 1) {
          throw Error('delete failed')
        }
        return res.json({
          isSuccess: true,
        })
      }
    } else {
      return res.json({
        error: true,
        message: 'Mã OTP không đúng.',
      })
    }
  }
}

export default handler
