import mysql from 'serverless-mysql'

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT),
  },
})

export async function query<T>(q: string, values: any[] = []) {
  try {
    const results = await db.query<T>(q, values)
    await db.end()
    return results
  } catch (e: any) {
    throw Error(e.message)
  }
}

export async function queryWithTransaction<T>(listQ: any[]) {
  try {
    let tran = db.transaction()
    for (const q of listQ) {
      tran = tran.query(q)
    }
    const result = await tran
      .rollback((e: any) => {
        throw e
      })
      .commit()
    await db.end()
    return result
  } catch (e: any) {
    throw Error(e.message)
  }
}
