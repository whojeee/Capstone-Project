// Programming.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/Programming.css';
import { setProgrammingNews, setLoading, setError } from '../redux/actions';

const Programming = () => {
  const dispatch = useDispatch();
  const { programmingNews, loading, error } = useSelector(state => state.news);

  useEffect(() => {
    // Check if the programming news is already in Redux state to avoid redundant fetch
    if (programmingNews.length === 0) {
      dispatch(setLoading(true)); // Set loading to true
      axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=programming&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
        .then(response => {
          dispatch(setProgrammingNews(response.data.response.docs));
          dispatch(setLoading(false)); // Set loading to false after response
        })
        .catch(() => {
          dispatch(setError("Error fetching news!"));
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, programmingNews.length]); // Re-fetch only if programmingNews is empty

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h1>Berita Programming</h1>
      <div className="news-cards">
        {programmingNews.map((article) => (
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

export default Programming;
