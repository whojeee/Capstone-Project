export const setProgrammingNews = (news) => ({
  type: 'SET_PROGRAMMING_NEWS',
  payload: news,
});

export const setIndonesiaNews = (news) => ({
  type: 'SET_INDONESIA_NEWS',
  payload: news,
});

export const setLoading = (loading) => ({
  type: 'SET_LOADING',
  payload: loading,
});

export const setError = (error) => ({
  type: 'SET_ERROR',
  payload: error,
});
