export const initialState = null;

export const reducer = (state, action) =>{
    if(action.type=="USER"){
        return action.payload;
    }
    if(action.type=="CLEAR"){
        return null;
    }
    if(action.type=="UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following,
            suggestion:action.payload.suggestion,
        }
    }
    if(action.type=="UPDATEPIC"){
        return {
            ...state,
            pic:action.payload.pic
                }
    }
    if(action.type=="UPDATENAME"){
        return {
            ...state,
            name:action.payload.name
                }
    }
    return state;
}