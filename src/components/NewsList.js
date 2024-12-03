// NewsList.js
const NewsList = ({ news }) => {
  return (
    <div>
      {news.map((article, index) => (
        <div key={index}>
          <h3>{article.headline.main}</h3>
          <p>{article.abstract}</p>
          <a href={article.web_url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
