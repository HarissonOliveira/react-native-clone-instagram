import { SET_POSTS, ADD_COMMENT, CREATING_POST, POST_CREATED } from './actionTypes';
import { setMessage } from './message';
import axios from 'axios';

// Action Creator
export const addPost = post => {
    return dispatch => {
        dispatch(creatingPost())
        axios({
            url: 'uploadImage',
            baseURL: 'https://us-central1-lambe-lambe-reactnative.cloudfunctions.net',
            method: 'post',
            data: {
                image: post.image.base64
            }
        })
            .catch(err => console.log(err))
            .then(res => {
                post.image = res.data.imageUrl;
                axios.post('/posts.json', { ...post })
                    .catch(err => {
                        dispatch(setMessage({
                            title: 'Erro',
                            text: err
                        }))
                    })
                    .then(resp => {
                        dispatch(fetchPosts())
                        dispatch(postCreated())
                    })
            })
    }
}

// Action Creator
export const addComment = payload => {
    return dispatch => {
        axios.get(`/posts/${payload.postId}.json`)
            .catch(err => console.log(err))
            .then(res => {
                console.log(res.data.comments);
                const comments = res.data.comments || [];
                comments.push(payload.comment);
                axios.patch(`/posts/${payload.postId}.json`, { comments })
                    .catch(err => console.log(err))
                    .then(res => {
                        dispatchEvent(fetchPosts())
                    })
            })
    }
    // return {
    //     type: ADD_COMMENT,
    //     payload
    // }
}

// Action Creator
export const setPosts = posts => {
    return {
        type: SET_POSTS,
        payload: posts
    }
}

// Action Creator
export const fetchPosts = () => {
    return dispatch => {
        axios.get('/posts.json')
            .catch(err => console.log(err))
            .then(res => {
                console.log('RES DATA :: ', res.data);
                const rawPosts = res.data;
                const posts = [];

                for (let key in rawPosts) {
                    posts.push({
                        ...rawPosts[key],
                        id: key
                    })
                }

                dispatch(setPosts(posts.reverse()))
            })
    }
}

// Actions Creator
export const creatingPost = () => {
    return {
        type: CREATING_POST
    }
}

export const postCreated = () => {
    return {
        type: POST_CREATED
    }
}