import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query'); // Get search term from URL

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8`)
        .then(response => {
          setNews(response.data.response.docs);
          setLoading(false);
        })
        .catch(error => {
          setError('Error fetching news!');
          setLoading(false);
        });
    }
  }, [searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-container">
      <h1>Search Results for: {searchTerm}</h1>
      <div className="news-cards">
        {news.map((article) => (
          <div key={article._id} className="news-card">
            <h2>{article.headline.main}</h2>
            <p>{article.abstract}</p>
            <a href={article.web_url} target="_blank" rel="noopener noreferrer">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
