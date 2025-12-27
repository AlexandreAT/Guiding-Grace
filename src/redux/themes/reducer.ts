const initialState = {
    theme: localStorage.getItem('theme') || 'dark',
}

const themesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'TOGGLE/THEME':
            localStorage.setItem('theme', action.theme)
            return {
                ...state,
                theme: action.theme
            }
        default:
            return state
    }
}

export default themesReducer;