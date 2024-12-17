import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/Programming.css';
import { setProgrammingNews, setLoading, setError } from '../redux/actions';
import { FaBookmark } from 'react-icons/fa';

const Programming = () => {
  const dispatch = useDispatch();
  const { programmingNews, loading, error } = useSelector((state) => state.news);
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    setSavedArticles(saved);
  }, []);

  useEffect(() => {
    if (programmingNews.length === 0) {
      dispatch(setLoading(true));
      axios
        .get('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=programming&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
        .then((response) => {
          console.log(response.data.response.docs);
          dispatch(setProgrammingNews(response.data.response.docs));
          dispatch(setLoading(false));
        })
        .catch(() => {
          dispatch(setError('Error fetching news!'));
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, programmingNews.length]);

  const handleSave = (article) => {
    const isAlreadySaved = savedArticles.some((savedArticle) => savedArticle._id === article._id);

    if (!isAlreadySaved) {
      const updatedArticles = [...savedArticles, article];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setSavedArticles(updatedArticles);
    } else {
      const updatedArticles = savedArticles.filter(
        (savedArticle) => savedArticle._id !== article._id
      );
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setSavedArticles(updatedArticles);
    }
  };

  const isSaved = (article) => {
    return savedArticles.some((savedArticle) => savedArticle._id === article._id);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h1>Programming News</h1>
      <div className="news-cards">
        {programmingNews.map((article) => {
          const imageUrl = article.multimedia && article.multimedia.length > 0
            ? `https://static01.nyt.com/${article.multimedia[0].url}`
            : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;

          return (
            <div key={article._id} className="news-card">
              <div className="card-image">
                <img
                  src={imageUrl}
                  alt={article.headline.main || 'Placeholder Image'}
                  onError={(e) => {
                    e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;
                  }}
                />
              </div>
              <h2>{article.headline.main}</h2>
              <p>{article.abstract}</p>
              <div className="card-buttons">
                <a href={article.web_url} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read more
                </a>
                <button className="save-article" onClick={() => handleSave(article)}>
                  <FaBookmark
                    style={{
                      color: isSaved(article) ? 'black' : 'black', 
                      fill: isSaved(article) ? 'black' : 'none', 
                      stroke: 'black', 
                      strokeWidth: '25px', 
                      fontSize: '20px', 
                    }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Programming;
