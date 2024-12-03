const initialState = {
  programmingNews: [],
  indonesiaNews: [],
  loading: false,
  error: null,
};

const newsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROGRAMMING_NEWS':
      return { ...state, programmingNews: action.payload };
    case 'SET_INDONESIA_NEWS':
      return { ...state, indonesiaNews: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default newsReducer;
