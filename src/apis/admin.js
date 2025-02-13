import request from "@/utils/requers"


export const getWhitelist = () => request.get('/admin/whitelist')
export const getResponses = () => request.get('/admin/responses')
export const getUsers = () => request.get('/admin/users')
