// type PersonProps = {
//   name: {
//     first: string;
//     last: string;
//   };
// };

import { PersonProps } from "./Button/Person.types";
export default function Person(props: PersonProps) {
  return (
    <>
      {props.name.first} and {props.name.last}
    </>
  );
}
