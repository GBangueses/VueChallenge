import axios from 'axios'
import $store from '../store'

const store = $store
const api = "http://interview.agileengine.com"
const apiKey  = "23567b218376f79d9415"

axios.interceptors.request.use(
    config => {
        const token = store.state.token;
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

     axios.interceptors.response.use((response) => {
        return response
     }, function (error) {
        const originalRequest = error.config;
     
        if (error.response.status === 401 && originalRequest.url === api + "/auth") {
            return Promise.reject(error);
        }
     
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return axios.post(api + "/auth",
                    {
                    "apiKey": apiKey
                    })
                .then(res => {
                    ('error refresh')
                    if (res.status === 200) {
                        store.commit("setToken", res.data.token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.token;
                        return axios(originalRequest);
                    }
                })
        }
        return Promise.reject(error);
     });
class DaoService {
    getToken() {
        return new Promise(function (resolve, reject) {
            axios.post(api + "/auth",
                {
                  "apiKey": apiKey
                })
            .then(response => {
                resolve(store.commit("setToken", response.data.token));
            })
            .catch(e => {
                reject(e.data);
            })
        })
    }

    getPhotos(pageIndex) {
        return new Promise(function (resolve, reject) {
            axios.get(api + "/images?page=" + pageIndex, {
                headers: {
                    'Authorization': 'Bearer ' + '3c20cef1d8289f2804766f7425e36227f632dee2'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(e => {
                    reject(e.data);
                })
        });
    }

    getIndividualPhoto(photoId) {
        return new Promise(function (resolve, reject) {
            var token = store.state.token;
            axios.get(api + "/images/" + photoId, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(e => {
                    reject(e.data);
                })
            
        });
    }
}

export default new DaoService()