// import { userConstants } from '../_constants/constants';
import { userService } from '../_services/user';
// import { alertActions } from './';
import { history } from '../_helpers/history';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch('Failur');
                }
            );
    };

    function request(user) { return { type: 'USERS_LOGIN_REQUEST', user } }
    function success(user) { return { type: 'USERS_LOGIN_SUCCESS', user } }
    function failure(error) { return { type: 'USERS_LOGIN_FAILURE', error } }
}

function logout() {
    userService.logout();
    return { type: 'USERS_LOGOUT' };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch('Registration successful');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch('Something went wrong please check and try again later..');
                }
            );
    };

    function request(user) { return { type: 'USERS_REGISTER_REQUEST', user } }
    function success(user) { return { type: 'USERS_REGISTER_SUCCESS', user } }
    function failure(error) { return { type: 'USERS_REGISTER_FAILURE', error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: 'USERS_GETALL_REQUEST' } }
    function success(users) { return { type: 'USERS_GETALL_SUCCESS', users } }
    function failure(error) { return { type: 'USERS_GETALL_FAILURE', error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: 'USERS_DELETE_REQUEST', id } }
    function success(id) { return { type: 'USERS_DELETE_SUCCESS', id } }
    function failure(id, error) { return { type: 'USERS_DELETE_FAILURE', id, error } }
}