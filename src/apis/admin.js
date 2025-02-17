import request from "@/utils/requers"


export const getWhitelist = () => request.get('/admin/whitelist')
export const getQuestion = () => request.get('/admin/AllQuestion')
export const getResponses = () => request.get('/admin/responses')
export const getUsers = () => request.get('/admin/users')
export const addSurvey = (data) => request.post('/admin/addSurvey', JSON.stringify(data))
export const addQuestion = (data) => request.post('/admin/addQuestion', JSON.stringify(data))
