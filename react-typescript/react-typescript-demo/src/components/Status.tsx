type StatusProps = {
  status: "loading" | "success" | "error";
};
export default function Status(props: StatusProps) {
  let message;
  if (props.status === "loading") {
    message = "Loading...";
  } else if (props.status === "success") {
    message = "Data fetched Successfully!";
  } else if (props.status === "error") {
    message = "Error fetching data";
  }

  return (
    <>
      <h2>Status-{message}</h2>
      {/* <h2>Loading</h2>
      <h2>Data fetched succesfully</h2>
      <h2>Error fetching data</h2> */}
    </>
  );
}
