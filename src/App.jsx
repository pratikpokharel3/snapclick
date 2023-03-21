import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

import Appbar from "./components/Appbar";
import Searchbar from "./components/Searchbar";
import ImageGrid from "./components/ImageGrid";
import Footer from "./components/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photosInfo, setPhotosInfo] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("mountain");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreState, setLoadMoreState] = useState(false);
  const [isImageAllLoaded, setIsImageAllLoaded] = useState(false);

  useEffect(() => {
    getImages();
  }, [currentPage, searchKeyword]);

  function getImages() {
    let keyword = "";

    if (searchKeyword === "") {
      keyword = "mountain";
    } else {
      keyword = searchKeyword;
    }

    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
      import.meta.env.VITE_API_KEY
    }&text=${keyword}&page=${currentPage}&per_page=30&format=json&nojsoncallback=1`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        setPhotosInfo(prev => {
          let photos = [];

          if (prev !== null) {
            if (res.photos.photo.length === 0) {
              setIsImageAllLoaded(true);
            }
            photos = [...prev.photo, ...res.photos.photo];
          } else {
            photos = res.photos.photo;
          }

          return {
            page: res.photos.page,
            pages: res.photos.pages,
            perpage: res.photos.perpage,
            total: res.photos.total,
            photo: photos
          };
        });
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
        setLoadMoreState(false);
      });
  }

  function handleSubmit(e, keyword) {
    e.preventDefault();

    setLoading(true);
    setCurrentPage(1);
    setIsImageAllLoaded(false);
    setPhotosInfo(null);
    setSearchKeyword(keyword);
  }

  function loadMoreImages() {
    setLoadMoreState(true);
    setCurrentPage(prevPage => prevPage + 1);
  }

  return (
    <>
      <Appbar />

      <Container>
        <Row className="g-0 justify-content-center mt-5">
          <Col xs="11" sm="9" lg="7" xl="5">
            <Searchbar handleSubmit={handleSubmit} />
          </Col>

          {loading && (
            <Col xs="12" className="text-center mt-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          )}
        </Row>

        {!loading && photosInfo.photo.length === 0 && (
          <div className="text-center mt-4">No image found. Try again!</div>
        )}

        {!loading && (
          <Row className="g-0 mt-3 mb-4">
            {photosInfo.photo.map(imageInfo => (
              <Col
                xs="12"
                sm="6"
                lg="4"
                xl="3"
                className="p-2 image-container"
                key={uuidv4()}
              >
                <ImageGrid imageInfo={imageInfo} />
              </Col>
            ))}

            {loadMoreState && (
              <Col xs="12" className="text-center mt-3">
                <Spinner size="sm" animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            )}

            {!loadMoreState &&
              !isImageAllLoaded &&
              photosInfo.photo.length !== 0 && (
                <Col xs="12" className="load-more mt-3">
                  <span onClick={loadMoreImages}>Load more</span>
                </Col>
              )}
          </Row>
        )}
      </Container>

      {!loading && <Footer />}
    </>
  );
}

export default App;
