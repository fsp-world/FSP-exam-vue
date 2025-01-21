import request from "@/utils/requers"


export const login = (data) => request.post('/auth/login', JSON.stringify(data))

export const register = (data) => request.post('/auth/register', JSON.stringify(data))

export const logout = (data) => request.post('/auth/logout', JSON.stringify(data))
