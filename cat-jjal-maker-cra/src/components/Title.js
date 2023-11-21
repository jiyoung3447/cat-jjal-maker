//const title = <h1>1번째 고양이 가라사대aaa</h1>;
const Title = (props) => {
  //console.log(props);
  return <h1>{props.children}</h1>;
};

export default Title;
