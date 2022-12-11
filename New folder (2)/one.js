async function fetchText() {
  let url = "https://ipinfo.io/json?token=d1df2465fd191f";
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
}
fetchText();
