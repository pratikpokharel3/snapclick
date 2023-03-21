import { saveAs } from "file-saver";
import Image from "react-bootstrap/Image";

const ImageGrid = ({ imageInfo }) => {
  return (
    <>
      <Image
        rounded
        loading="lazy"
        className="grid-image"
        alt={imageInfo.title}
        src={`https://live.staticflickr.com/${imageInfo.server}/${imageInfo.id}_${imageInfo.secret}_w.jpg`}
      />

      <div className="middle">
        <div
          className="image-text"
          onClick={() =>
            saveAs(
              `https://live.staticflickr.com/${imageInfo.server}/${imageInfo.id}_${imageInfo.secret}_b.jpg`,
              `${imageInfo.title}.jpg`
            )
          }
        >
          Download
        </div>
      </div>
    </>
  );
};

export default ImageGrid;
