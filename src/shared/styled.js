import styled from 'styled-components';

const H1 = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Button = styled.button`
  border-width: 3px;
  border-color: steelblue;
  background-color: aquamarine;
  color: darkviolet;
  border-radius: 25% 10%;
  margin: 10px;
`;

const P = styled.p`
  font-family: fantasy;
  color: coral;
`;

const Label = styled.label`
  font-family: cursive;
  color: crimson;
`;

const Li = styled.li`
  border-style: dashed;
  background-color: gold;
`;

const Input = styled.input`
  border-width: 5px;
  font-size: 150%;
  width: 100%;
`;

const H2 = styled.h2`
  color: seagreen;
  text-shadow: blueviolet;
`;

export {
  H1,
  Button,
  P,
  Label,
  Li,
  Input,
  H2,
};
