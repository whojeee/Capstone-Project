import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBookmark } from 'react-icons/fa';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(query || '');
  const [loading, setLoading] = useState(false);

  // Mendapatkan data pencarian saat query berubah
  useEffect(() => {
    if (query) {
      setLoading(true);
      axios
        .get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8`)
        .then((response) => {
          console.log(response.data.response.docs); // Debugging: log respons API
          setNews(response.data.response.docs);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load search results');
          setLoading(false);
        });
    }
  }, [query]);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  // Fungsi untuk bookmark artikel
  const handleBookmarkArticle = (article) => {
    const savedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    const isAlreadySaved = savedArticles.some((savedArticle) => savedArticle._id === article._id);

    if (!isAlreadySaved) {
      const updatedArticles = [...savedArticles, article];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setBookmarkedArticles(updatedArticles.map((a) => a._id));
    } else {
      const updatedArticles = savedArticles.filter((savedArticle) => savedArticle._id !== article._id);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setBookmarkedArticles(updatedArticles.map((a) => a._id));
    }
  };

  const getImageUrl = (multimedia) => {
    if (!multimedia || multimedia.length === 0) {
      return '/images/placeholder.jpeg'; // Path ke file placeholder di folder public
    }
    // Pilih gambar dengan resolusi tinggi
    const image = multimedia.find((item) => item.subtype === 'superJumbo' || item.subtype === 'xlarge' || item.subtype === 'large');
    if (image && image.url) {
      return `https://static01.nyt.com/${image.url}`;
    }
    return '/images/placeholder.jpeg'; // Jika tidak ada gambar yang cocok
  };
  
  

  return (
    <div>
      <div className="top-header">
  <h1 className="page-title">Search Results</h1>
  <div className="search-bar">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search news..."
    />
    <button onClick={handleSearch}>Search</button>
  </div>
</div>


      <div className="search-results">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {news.length > 0 && !loading ? (
          news.map((article) => (
            <div key={article._id} className="news-card">
              {/* Menampilkan gambar jika ada */}
              {article.multimedia && (
                <img
                src={getImageUrl(article.multimedia)}
                alt={article.headline.main}
                className="news-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpeg'; // Gambar default
                }}
              />
              
              
              )}
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
                <FaBookmark
                  className="bookmark-icon"
                  onClick={() => handleBookmarkArticle(article)}
                  style={{
                    color: bookmarkedArticles.includes(article._id) ? 'green' : 'black',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
