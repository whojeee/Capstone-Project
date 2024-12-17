import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/Indonesia.css';
import { setIndonesiaNews, setLoading, setError } from '../redux/actions';
import { FaBookmark } from 'react-icons/fa';

const Indonesia = () => {
  const dispatch = useDispatch();
  const { indonesiaNews, loading, error } = useSelector((state) => state.news);
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    setSavedArticles(saved);
  }, []);

  useEffect(() => {
    if (indonesiaNews.length === 0) {
      dispatch(setLoading(true));
      axios
        .get(
          'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Indonesia&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8'
        )
        .then((response) => {
          dispatch(setIndonesiaNews(response.data.response.docs));
          dispatch(setLoading(false));
        })
        .catch(() => {
          dispatch(setError('Error fetching news!'));
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, indonesiaNews.length]);

  const handleSave = (article) => {
    const isAlreadySaved = savedArticles.some(
      (savedArticle) => savedArticle._id === article._id
    );

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
      <h1>Indonesia News</h1>
      <div className="news-cards">
        {indonesiaNews.map((article) => {
          const imageUrl =
            article.multimedia && article.multimedia.length > 0
              ? `https://www.nytimes.com/${article.multimedia[0].url}`
              : '/images/placeholder.jpeg';

          return (
            <div key={article._id} className="news-card">
              <img
                src={imageUrl}
                alt={article.headline.main || 'Placeholder Image'}
                className="news-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpeg';
                }}
              />

              <h2>{article.headline.main}</h2>
              <p>{article.abstract}</p>
              <div className="card-buttons">
                <a
                  href={article.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More
                </a>
                <button
                  className="bookmark-button"
                  onClick={() => handleSave(article)}
                >
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

export default Indonesia;
