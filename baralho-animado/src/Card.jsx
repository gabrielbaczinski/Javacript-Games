import React, { useState, useEffect } from "react";
import "./Card.css";

const Card = () => {
  const [flipped, setFlipped] = useState(false);
  const [backImage, setBackImage] = useState("");
  const [lastImage, setLastImage] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);

  const backImages = [
    "https://media.tenor.com/O_1yc7Gr4icAAAAM/balatro-jimbo.gif",
    "https://media.tenor.com/kWhV6KmixKEAAAAj/jimbo-balatro-jimbo.gif",
  ];

  const getRandomBackImage = () => {
    let randomImage;
    do {
      randomImage = backImages[Math.floor(Math.random() * backImages.length)];
    } while (randomImage === lastImage);

    setLastImage(randomImage);
    return randomImage;
  };

  useEffect(() => {
    setBackImage(getRandomBackImage());
  }, []);

  const handleFlip = () => {
    setIsFlipping(true);
    setFlipped((prev) => !prev);
  };

  const handleTransitionEnd = () => {
    if (isFlipping && !flipped) {
      setBackImage(getRandomBackImage());
    }
    setIsFlipping(false);
  };

  return (
    <div className="balatro-container">
      <div
        className={`balatro-card ${flipped ? "flipped" : ""}`}
        onClick={handleFlip}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="balatro-front">
          <img
            src="https://image.api.playstation.com/vulcan/ap/rnd/202402/1416/0ed72ad5aab1a7acee6e84fe686ad217c5e8fc3985b06206.png"
            alt="Balatro Logo"
            className="balatro-logo"
          />
        </div>
        <div
          className="balatro-back"
          style={{ backgroundImage: `url(${backImage})` }}
        />
      </div>
    </div>
  );
};

export default Card;
