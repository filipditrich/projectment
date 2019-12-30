import React, {createContext, useReducer, useContext, useEffect} from "react";
import { IDENTITY_CONFIGURATION, METADATA_OIDC } from '../config';
import { UserManager, WebStorageStateStore, Log } from 'oidc-client';

export const SET_TITLE = "SET_TITLE";
export const ADD_MESSAGE = "ADD_MESSAGE";
export const DISMISS_MESSAGE = "DISMISS_MESSAGE";
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const CLEAR_ACCESS_TOKEN = "CLEAR_ACCESS_TOKEN";
export const SET_ID_TOKEN = "SET_ID_TOKEN";
export const CLEAR_ID_TOKEN = "CLEAR_ID_TOKEN";
export const USER_EXPIRED = "USER_EXPIRED";
export const USER_FOUND = "USER_FOUND";
export const USER_EXPIRING = "USER_EXPIRING";
export const LOADING_USER = "LOADING_USER";
export const SILENT_RENEW_ERROR = "SILENT_RENEW_ERROR";
export const SESSION_TERMINATED = "SESSION_TERMINATED";
export const LOAD_USER_ERROR = "LOAD_USER_ERROR";
export const USER_SIGNED_OUT = "USER_SIGNED_OUT";

const userStore = window.localStorage;
const userManager = new UserManager({
    ...IDENTITY_CONFIGURATION,
    userStore: new WebStorageStateStore({ store: userStore }),
    metadata: {
        ...METADATA_OIDC
    }
});

const initialState = {
    userManager: userManager,
    accessToken: null,
    idToken: null,
    userId: null,
    profile: null,
    isUserLoading: false,
    title: null,
    messages: [],
    messageCounter: 0
};
Log.logger = console;
Log.level = Log.ERROR;//Log.DEBUG;

const parseJwt = (token: any) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
};

const reducer = (state: any, action: any) => {
    const newMessages = [...state.messages];
    switch (action.type) {
        case ADD_MESSAGE: {
            newMessages.push({
                text: (action.text)
            });
            return { ...state,  messages: newMessages, counter: state.counter + 1 };
        }
        case DISMISS_MESSAGE: {
            newMessages.splice(action.id, 1);
            return { ...state,  messages: newMessages };
        }
        case SET_TITLE: {
            return { ...state, title: action.payload };
        }
        case LOADING_USER:
            return { ...state, isUserLoading: true };
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: action.payload };
        case CLEAR_ACCESS_TOKEN:
            return { ...state, accessToken: null };
        case SET_ID_TOKEN:
            return { ...state, idToken: action.payload };
        case CLEAR_ID_TOKEN:
            return { ...state, idToken: null };
        case USER_FOUND:
            return { ...state, idToken: action.idToken, accessToken: action.accessToken, userId: action.userId, profile: action.profile, isUserLoading: false };
        case USER_EXPIRED:
        case LOAD_USER_ERROR:
        case SILENT_RENEW_ERROR:
        case USER_SIGNED_OUT:
        case SESSION_TERMINATED:
            return { ...state, idToken: null, accessToken: null, userId: null, profile: null, isUserLoading: false };
        default : {
            return state;
        }
    }
};

export const ApplicationContext = createContext(initialState);
export const ApplicationConsumer = ApplicationContext.Consumer;
export const ApplicationProvider = (props: any) => {
    const store: any = useReducer(
        reducer,
        initialState
    );
    const [, dispatch] = store;
    useEffect(() => {
        userManager.events.addUserLoaded(user => {
            const tokenData = parseJwt(user.access_token);
            //dispatchMessages({type: ADD_MESSAGE, text: "Uživatel byl příhlášen", kind: "success", dismisable: true, expiration: 3});
            dispatch({
                type: USER_FOUND,
                accessToken: user.access_token,
                idToken: user.id_token,
                userId: tokenData.sub,
                profile: user.profile
            });
        });
        userManager.events.addUserUnloaded(() => {
            //dispatchMessages({type: ADD_MESSAGE, text: "Informace o přihlášení byly zrušeny", kind: "success", dismisable: true, expiration: 3});
            dispatch({
                type: USER_EXPIRED
            });
        });
        userManager.events.addAccessTokenExpiring(() => {
            //dispatchMessages({type: ADD_MESSAGE, text: "Platnost Vašeho přihlášení brzy vyprší", kind: "warning", dismisable: true, expiration: 3});
            dispatch({
                type: USER_EXPIRING
            });
        });
        userManager.events.addAccessTokenExpired(() => {
            //dispatchMessages({type: ADD_MESSAGE, text: "Platnost Vašeho přihlášení vypršela", kind: "info", dismisable: true, expiration: false});
            dispatch({
                type: USER_EXPIRED
            });
        });
        userManager.events.addSilentRenewError(() => {
            //dispatchMessages({type: ADD_MESSAGE, text: "Nepodařilo se obnovit platnost Vašeho přihlášení", kind: "error", dismisable: true, expiration: false});
            dispatch({type: SILENT_RENEW_ERROR});
        });
        userManager.events.addUserSignedOut(() => {
            //dispatchMessages({type: ADD_MESSAGE, text: "Uživatel byl automaticky odhlášen", kind: "warning", dismisable: true, expiration: 3});
            dispatch({
                type: USER_SIGNED_OUT
            });
        });

        userManager.getUser()
            .then((user)=>{
                if (user && !user.expired) {
                    let tokenData = parseJwt(user.access_token);
                    dispatch({
                        type: USER_FOUND,
                        accessToken: user.access_token,
                        idToken: user.id_token,
                        userId: tokenData.sub,
                        profile: user.profile
                    });
                } else if (!user || (user && user.expired)) {
                    dispatch({
                        type: USER_EXPIRED
                    });
                }
            })
            .catch(()=>{
                dispatch({
                    type: LOAD_USER_ERROR
                });
            });
    },[ dispatch ]);
    return (
        <ApplicationContext.Provider value={ store }>
            { props.children }
        </ApplicationContext.Provider>
    );
};

export const useAppContext = (): any => useContext(ApplicationContext);
