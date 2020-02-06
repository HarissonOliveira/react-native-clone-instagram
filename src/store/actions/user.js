import { USER_LOGGED_IN, USER_LOGGED_OUT, LOADING_USER, USER_LOADED } from './actionTypes';
import axios from 'axios';

const authBaseURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
const API_KEY = 'AIzaSyCZ7z0eIScBOjfDeIt_qkv3CT-Z9HUfSPk';

export const userLogged = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export const logout = () => {
    return {
        type: USER_LOGGED_OUT
    }
}

export const createUser = user => {
    return dispatch => {
        axios.post(`${authBaseURL}/sigupNewUser?key=${API_KEY}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err => console.log('ERROR :: ', err))
            .then(res => {

                if (res.data.localId) {
                    axios.put(`/users/${res.data.localId}.json`, {
                        name: user.name
                    })
                        .catch(err => console.log(err))
                        .then(() => {
                            delete user.password; // Deleta o atributo
                            user.id = res.data.localId;
                            dispatch(userLogged(user));
                            dispatch(userLoaded());
                        })
                }
            })
    }
}

export const loadingUser = () => {
    return {
        type: LOADING_USER
    }
}

export const userLoaded = () => {
    return {
        type: USER_LOADED
    }
}

export const login = user => {
    return dispatch => {
        dispatch(loadingUser())
        axios.post(`${authBaseURL}/verifyPassword?key=${API_KEY}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err => console.log(err))
            .then(res => {
                if (res.data.localId) {
                    axios.get(`/users/${res.data.localId}.json`)
                        .catch(err => console.log(err))
                        .then(res => {
                            // user.password = null;
                            delete user.password; // Deleta o atributo
                            user.name = res.data.name;
                            dispatch(userLogged(user));
                            dispatch(userLoaded());
                        })
                }
            })
    }
}