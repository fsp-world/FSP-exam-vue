import request from "@/utils/requers"


export const getWhitelist = () => request.get('/admin/whitelist')

export const getUsers = () => request.get('/admin/users')
