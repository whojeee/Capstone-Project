// Indonesia.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/Indonesia.css';
import { setIndonesiaNews, setLoading, setError } from '../redux/actions';

const Indonesia = () => {
  const dispatch = useDispatch();
  const { indonesiaNews, loading, error } = useSelector(state => state.news);

  useEffect(() => {
    // Check if the Indonesia news is already in Redux state to avoid redundant fetch
    if (indonesiaNews.length === 0) {
      dispatch(setLoading(true)); // Set loading to true
      axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Indonesia&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
        .then(response => {
          dispatch(setIndonesiaNews(response.data.response.docs));
          dispatch(setLoading(false)); // Set loading to false after response
        })
        .catch(() => {
          dispatch(setError("Error fetching news!"));
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, indonesiaNews.length]); // Re-fetch only if indonesiaNews is empty

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h1>Berita Indonesia</h1>
      <div className="news-cards">
        {indonesiaNews.map((article) => (
          <div key={article._id} className="news-card">
            <h2>{article.headline.main}</h2>
            <p>{article.abstract}</p>
            <a href={article.web_url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Indonesia;
