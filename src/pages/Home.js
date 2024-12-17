import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../styles/Home.css';
import { FaBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topStories, setTopStories] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
      .then((response) => setTopStories(response.data.results))
      .catch(() => console.error('Failed to load top stories'));
  }, []);

  useEffect(() => {
    axios
      .get('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
      .then((response) => setTrendingNews(response.data.results.slice(0, 5)))
      .catch(() => console.error('Failed to load trending news'));
  }, []);

  const handleSearch = () => {
    if (searchTerm) navigate(`/search/${searchTerm}`);
  };

  const handleSave = (article) => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    const isAlreadySaved = saved.some(
      (savedArticle) => savedArticle._id === (article.url || article._id)
    );

    if (!isAlreadySaved) {
      const standardizedArticle = {
        _id: article.url || article._id,
        headline: { main: article.title || article.headline?.main || 'No headline' },
        abstract: article.abstract || 'No abstract available',
        web_url: article.url || article.web_url,
        image_url: article.multimedia?.[0]?.url || '',
      };
      const updatedArticles = [...saved, standardizedArticle];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setSavedArticles(updatedArticles);
    } else {
      const updatedArticles = saved.filter(
        (savedArticle) => savedArticle._id !== (article.url || article._id)
      );
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setSavedArticles(updatedArticles);
    }
  };

  const isSaved = (article) => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    return saved.some(
      (savedArticle) => savedArticle._id === (article.url || article._id)
    );
  };

  const CustomArrow = ({ className, style, onClick, direction }) => (
    <div
      className={`${className} custom-arrow`}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
        zIndex: 2,
      }}
      onClick={onClick}
    >
      {direction === "left" ? "❮" : "❯"}
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  return (
    <div className="home-page">
      <div className="news-container">
        <div className="top-header">
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search news..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <h1 className="page-title">Trending News</h1>

          <Slider {...sliderSettings} className="trending-slider">
            {trendingNews.map((article, index) => {
              const imageUrl =
                article.media &&
                article.media[0] &&
                article.media[0]['media-metadata'] &&
                article.media[0]['media-metadata'][2]?.url
                  ? article.media[0]['media-metadata'][2]?.url
                  : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;
              return (
                <div
                  key={article.id || index}
                  className="trending-card"
                  onClick={() => window.open(article.url || article.link, '_blank')}
                  style={{ cursor: 'pointer' }} 
                >
                  <div className="trending-image-container">
                    <img
                      src={imageUrl}
                      alt={article.title || 'No Title Available'}
                      onError={(e) => {
                        e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;
                      }}
                    />
                    <div className="trending-title">{article.title}</div>
                  </div>
                </div>
              );
            })}
          </Slider>
          <h1 className="page-title">Top News</h1>
        </div>
        <div className="news-cards">
          {topStories.map((article) => {
            const imageUrl = article.multimedia?.[0]?.url
              ? article.multimedia[0].url
              : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;
            return (
              <div key={article.url} className="news-card">
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={article.title || 'Placeholder'}
                    onClick={() => window.open(article.url || article.link, '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <h2
                  onClick={() => window.open(article.url || article.link, '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  {article.title}
                </h2>
                <p>{article.abstract}</p>
                <div className="card-buttons">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More
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
    </div>
  );
};

export default Home;
