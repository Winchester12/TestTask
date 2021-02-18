import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import ImageScroller from "react-image-scroller";

const api_key = "EbXpJoD6t6QH0aFsRYCGkptaByR4jjoazG8m26qc";
const rovers = [
  { value: "curiosity", label: "Curiosity" }, //except last 2
  { value: "opportunity", label: "Opportunity" }, //1,2,7,8,9
  { value: "spirit", label: "Spirit" }, //1,2,7,8,9
];
const camerasForCuriosity = [
  { value: "fhaz", label: "Front Hazard Avoidance Camera	" },
  { value: "rhaz", label: "Rear Hazard Avoidance Camera	" },
  { value: "mast", label: "Mast Camera	" },
  { value: "chemcam", label: "Chemistry and Camera Complex	" },
  { value: "malhi", label: "Mars Hand Lens Imager	" },
  { value: "mardi", label: "Mars Descent Imager	" },
  { value: "navcam", label: "Navigation Camera	" },
];
const camerasForOpportunityAndSpirit = [
  { value: "fhaz", label: "Front Hazard Avoidance Camera	" },
  { value: "rhaz", label: "Rear Hazard Avoidance Camera	" },
  { value: "navcam", label: "Navigation Camera	" },
  { value: "pancam", label: "Panoramic Camera	" },
  {
    value: "minites",
    label: "Miniature Thermal Emission Spectrometer (Mini-TES)	",
  },
];

export default function App() {
  const [data, setData] = useState();

  const [roverSelect, setRoverSelect] = useState([]); // SELECT ONLY
  const [roverCamerasSelect, setRoverCamerasSelect] = useState([]); // SELECT ONLY
  const [sol, setSol] = useState(0);

  const [dataFromSelected, setDataFromSelected] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);

  const [showedImages, setShowedImages] = useState([]);
  const [loadMoreButtonClickCounter, setLoadMoreButtonClickCounter] = useState(3);

  const getData = async () => {
    console.log(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${dataFromSelected[0]}/photos?sol=${dataFromSelected[2]}&camera=${dataFromSelected[1]}`
    );
    fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${dataFromSelected[0]}/photos?sol=${dataFromSelected[2]}&camera=${dataFromSelected[1]}&api_key=${api_key}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson);
      })
      .then(function (myJson) {
        console.log("Fetch ended!");
      });
  };

  // When this Promise resolves, both values will be available.
  
  // useEffect(()=>{
  //   getData();
  // },[]);

  const handleRoverSelect = (e) => {
    setDataFromSelected([e.value]);

    if (e.value === "curiosity") {
      setRoverCamerasSelect(camerasForCuriosity);
    } else if (e.value === "opportunity" || e.value === "spirit") {
      setRoverCamerasSelect(camerasForOpportunityAndSpirit);
    }
    setRoverSelect(e.label);
  };

  const showSelectedData = () => {
    console.log(dataFromSelected);
  };
  const handleRoverCameraSelect = (e) => {
    setDataFromSelected([dataFromSelected[0], e.value, sol]);
  };
  const changeSol = (e) => {
    setSol(e.target.value);
    setDataFromSelected([
      dataFromSelected[0],
      dataFromSelected[1],
      e.target.value,
    ]);
  };
  const showDataFromServer = () => {
    console.log(data);
    data.photos.map((t) => console.log(t.img_src));
    createImages();
  };
  const createImages = () => {
    const imagesArray_temp = [];
    data.photos.map((t, index) => {
      imagesArray_temp.push(<img key={index} src={t.img_src} alt="img" />);
    });
    setImagesArray(imagesArray_temp);
    setShowedImages(imagesArray_temp.slice(0, 3));
    setLoadMoreButtonClickCounter(3);
  };

  const showMorePhotos = () => {
    const tempArray = [];
    tempArray.push(
      imagesArray.slice(
        loadMoreButtonClickCounter,
        loadMoreButtonClickCounter + 3
      )
    );

    //console.log(tempArray)
    setShowedImages([...showedImages, tempArray]);
    setLoadMoreButtonClickCounter(loadMoreButtonClickCounter + 3);
    //console.log(loadMoreButtonClickCounter, " to ", loadMoreButtonClickCounter + 3)
  };

  return (
    <React.Fragment>
      <div className={"imageContainer"}>{showedImages.map((t) => t)}</div>
      <div className={"loadMoreButtonContainer"}>
        <button onClick={showMorePhotos}>Load more...</button>
      </div>
      <div className={"card"}>
        <Select onChange={handleRoverSelect} options={rovers} />
        <Select
          onChange={handleRoverCameraSelect}
          options={roverCamerasSelect}
        />
        <div className={"sol"}>
          <p>Enter Sol: </p>
          <input onChange={changeSol} type="text" size="40" name="sol" />
        </div>
        <button onClick={getData}>Get data from server</button>
        <button onClick={showSelectedData}>Show selected data</button>
        <button onClick={showDataFromServer}>Show data from server</button>
      </div>
    </React.Fragment>
  );
}

/*
Rover(Curiosity, Opportunity, Spirit), 
Camera(Front, Rear, …),
Sol(Mars day).
*/
