import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
//생성 버튼 눌렀을 때 fetchCat 사용할 예정
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  //return `${OPEN_API_DOMAIN}/${responseJson.url}`;
  return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`;
};
console.log("야옹");

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length == 0) {
    //조건부 렌더링. 좋아요한 사진이 없을때만 보이기
    return (
      <div>
        <br />
        사진 위 하트를 눌러 고양이 사진을 저장해봐요!
      </div>
    );
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} /> //중괄호 안에 있는 cat은 배열인자에 있는 CAT1, CAT2(요소들)
      ))}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ updateMainCat }) => {
  //props로 함수자체를 넘김
  //const counterState = React.useState(1); //1은 counterState의 초기값. 폼전송후 n번째로 증가하기위해 변수생성.
  //const counter = counterState[0]; //useState의 첫번째 인자는 카운터 그 자체
  //const setCounter = counterState[1]; //useState의 두번째 인자는 카운터를 조작하는 함수. 이걸로 카운터를 바꿈.
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    //console.log(e.target.value.toUpperCase())
    const userValue = e.target.value;
    setErrorMessage(""); //검증전 초기화

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault("ㅁㄴㅁㅇㄹ");
    setErrorMessage(""); //검증전 초기화

    if (value == "") {
      //validation부분.
      setErrorMessage("글씨를 입력해 주세요");
      return;
    }
    updateMainCat(value); //위에 const value가 input값. 이걸 넘겨줌
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};
const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []; // 앞에께 없으면 뒤에꺼를 써라 라는 뜻
  });

  //console.log("카운터 ", counter);
  //console.log("카드카운터 ", mainCat);

  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCat(newCat);
  }

  //setInitialCat()를 함수로 안감싸고 그냥쓰면 무한으로 실행됨
  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites); //cat3 를 기존 favorites 배열에 넣는다.
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter == null ? "" : counter + "번째 ";

  //{} jsx내에서 변수쓸 때 사용
  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
