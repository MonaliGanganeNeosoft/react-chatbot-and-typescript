import { Name } from "../components/Button/Person.types";
type PersonListProps = {
  // names: { first: string; last: string }[];
  names: Name[];
};
export default function PersonList(props: PersonListProps) {
  return (
    <>
      {props.names.map((name) => {
        return (
          <h2 key={name.first}>
            {name.first} {name.last}
          </h2>
        );
      })}
    </>
  );
}
