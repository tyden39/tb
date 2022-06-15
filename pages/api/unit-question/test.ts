import { query } from 'lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const dateNow = new Date()

  await query<any>(
    'UPDATE user_otp SET expired_date = FROM_UNIXTIME(?) WHERE id = ?',
    [dateNow.getTime() / 1000, 51],
  )

  return res.json({
    date: dateNow.toString(),
  })
}

export default handler
