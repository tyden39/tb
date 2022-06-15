import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { USER_ROLES } from 'interfaces/constants'
import { UserDataType } from 'interfaces/types'
import { query } from 'lib/db'
// import { paths } from 'api/paths'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      async authorize(credentials: any, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log('credentials.email====', credentials.email)
        const user = await query<UserDataType[]>(
          `SELECT u.*, 
          (SELECT home_url FROM user_role ur WHERE ur.id = u.user_role_id) as redirect,
          (SELECT name FROM user_role ur WHERE ur.id = u.user_role_id) as user_role_name
           FROM user u WHERE (user_name = ? OR email = ?) LIMIT 1`,
          [credentials.email, credentials.email],
        )

        if (user.length > 0) {
          const userInfo = user[0]
          const result = await bcrypt.compare(
            credentials.password,
            userInfo.password,
          )
          if (result) {
            if (userInfo.deleted === 1) {
              throw new Error('Tài khoản chưa được kích hoạt')
            }
            return {
              id: userInfo.id,
              user_name: userInfo.user_name,
              is_admin: userInfo.is_admin,
              user_role_id: userInfo.user_role_id,
              redirect: userInfo.redirect,
              user_role_name: userInfo.user_role_name || '',
            }
          }
        }
        // If you return null or false then the credentials will be rejected
        throw new Error('Tài khoản hoặc mật khẩu không đúng')
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
      },
    }),
    Providers.Facebook({
      clientId: '480966533363245',
      clientSecret: '5311156eb3855ec9194b69b21853462e',
    }),
    Providers.Google({
      clientId: 'process.env.GOOGLE_ID',
      clientSecret: 'process.env.GOOGLE_SECRET',
    }),
  ],
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn(user, account, profile) {
      console.log('profile===', profile)
      if (account?.type === 'oauth') {
        const formData = {
          user_name: profile?.email,
          email: profile?.email,
          user_role_id: USER_ROLES.Teacher,
        }
        // console.log('formData===', formData);
        // createUser(formData);
        // const res = await fetch(paths.api_users_register, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });
        // console.log('REsssssssss====', res)
        // const json = await res.json();
        // console.log('REs======', res, json);
      }
      return true
    },
    // async redirect(url, baseUrl) { return baseUrl },
    async jwt(token, user, accountInfo, profile, isNewUser) {
      // console.log('jwt====', user)
      if (user) {
        token.user = user
      }
      return token
    },
    async session(session, user) {
      session.user = user.user
      return session
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true,
})
