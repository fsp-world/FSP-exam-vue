import axios from 'axios'


const baseURL = 'http://localhost:5000'

const request = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})


export default request