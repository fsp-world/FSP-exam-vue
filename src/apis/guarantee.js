import request from "@/utils/requers"


export const sendRequest = (data) => request.post('/guarantee/request', JSON.stringify(data))

export const guaranteeQuery = (data) => request.post('/guarantee/query', JSON.stringify(data))
