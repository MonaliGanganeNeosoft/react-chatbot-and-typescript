type GreetProps = {
  name: String;
  messageCount?: number;
  isLoggedIn: boolean;
};
export default function Greet(props: GreetProps) {
  const { messageCount = 0 } = props;
  return (
    <>
      {props.isLoggedIn
        ? `Greet ${props.name} and ${messageCount}`
        : `Welcome Guest`}
    </>
  );
}
