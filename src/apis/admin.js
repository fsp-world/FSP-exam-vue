import request from "@/utils/requers"


export const getWhitelist = () => request.get('/admin/whitelist')
