import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
import { userInRight } from 'utils'

const handler: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!userInRight([], session)) {
    return res.status(403).end('Forbidden')
  }

  switch (req.method) {
    case 'GET':
      return getUsers()
    case 'POST':
      return createUser()
    case 'PUT':
      return updateUser()
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getUsers() {
    const { page, limit, name, role, status } = req.query
    let hasQuery = false
    const params: any[] = []
    let queryStr = `SELECT u.id, u.user_name, u.email, u.is_admin, u.deleted, ur.name as user_role_name FROM user u
         LEFT JOIN user_role ur on u.user_role_id = ur.id
        `
    let queryCount = 'SELECT COUNT(*) as total FROM user u'
    if (name) {
      queryStr += ' WHERE (user_name LIKE ? OR email LIKE ?)'
      queryCount += ' WHERE (user_name LIKE ? OR email LIKE ?)'
      params.push(`%${name}%`)
      params.push(`%${name}%`)
      hasQuery = true
    }
    if (role) {
      const arrRole = (role as String).split(',');
      if (arrRole.includes('0')) {
        queryStr += ` ${hasQuery ? 'AND' : 'WHERE'} is_admin = true`
        queryCount += ` ${hasQuery ? 'AND' : 'WHERE'} is_admin = true`
        // params.push(true)
        hasQuery = true
        const index = arrRole.indexOf('0');
        if (index > -1) {
          arrRole.splice(index, 1);
          if (arrRole.length > 0) {
            queryStr += ` OR user_role_id IN (?)`
            queryCount += ` OR user_role_id IN (?)`
            params.push(arrRole)
            hasQuery = true
          }
        }
      } else {
        queryStr += ` ${hasQuery ? 'AND' : 'WHERE'} user_role_id IN (?)`
        queryCount += ` ${hasQuery ? 'AND' : 'WHERE'} user_role_id IN (?)`
        params.push(arrRole)
        hasQuery = true
      }
      
    }
    if (status) {
      queryStr += ` ${hasQuery ? 'AND' : 'WHERE'} u.deleted IN (?)`
      queryCount += ` ${hasQuery ? 'AND' : 'WHERE'} u.deleted IN (?)`
      params.push(
        (status as String).split(',').map((m) => (m === 'AC' ? 0 : 1)),
      )
      hasQuery = true
    }

    try {
      const results: any[] = await query<any[]>(
        `${queryStr} ORDER BY u.created_date desc
         LIMIT ${limit} OFFSET ${
          parseInt(page.toString()) * parseInt(limit.toString())
        }`,
        params,
      )

      const totals = await query<any[]>(queryCount, params)
      return res.json({
        data: results,
        totalRecords: totals[0].total,
      })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function createUser() {
    const item: UserDataType = req.body
    try {
      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(item.password, salt)

      const newId = (await query<any[]>('SELECT uuid() as newId'))[0].newId

      const user = await query<any[]>(
        'SELECT 1 FROM user WHERE user_name = ? LIMIT 1',
        [item.user_name],
      )

      if (user.length > 0) {
        return res.json({
          error: true,
          message: 'Tên đang nhập đã được sử dụng',
        })
      }

      const result = await query<any>(
        `INSERT INTO user (id, user_name, email, password, salt, user_role_id, deleted, created_date, is_admin)
                   VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          newId,
          item.user_name,
          item.email,
          password,
          salt,
          item.user_role_id,
          item.deleted,
          new Date(),
          item.is_admin
        ],
      )

      if (result.affectedRows !== 1) {
        throw Error('insert failed')
      }
      return res.json({ id: newId })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }

  async function updateUser() {
    const item: UserDataType = req.body
    try {
      const user = await query<any[]>(
        'SELECT 1 FROM user WHERE user_name = ? AND id != ? LIMIT 1',
        [item.user_name, item.id],
      )

      if (user.length > 0) {
        return res.json({
          error: true,
          message: 'Tên đang nhập đã được sử dụng',
        })
      }

      let queryStr =
        'UPDATE user SET user_name = ?, user_role_id = ?, email = ?, deleted = ?, is_admin = ?'
      const params = [
        item.user_name,
        item.user_role_id,
        item.email,
        item.deleted,
        item.is_admin
      ]
      if (item.password != null && item.password != '') {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(item.password, salt)
        queryStr += ', password = ?, salt = ?'
        params.push(password)
        params.push(salt)
      }
      queryStr += ' WHERE id = ?'
      params.push(item.id.toString())
      const result = await query<any>(queryStr, params)
      if (result.affectedRows !== 1) {
        throw Error('update failed')
      }
      return res.json({ ...item })
    } catch (e: any) {
      res.status(500).json({ message: e.message })
    }
  }
}

export default handler
