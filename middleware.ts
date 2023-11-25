export { default } from 'next-auth/middleware'


export const config = {
    matcher: ['/userpage', '/adm/usersform', '/api/auth/signin', '/api/auth/signout', '/api/auth/callback/credential', '/'],
}