// console.log("before");
// setTimeout(() => {
//   console.log("hello google mosh");
// }, 2000);
// console.log("after");

// console.log("before");
// const user = getUser(1);
// console.log(user);
// console.log("after");
// function getUser(id) {
//   setTimeout(() => {
//     console.log("Reading a user from database");
//     return { id: id, githubUsername: "Moni" };
//   }, 2000);
//   return 1;
// }

//->callback,promises,async/await

/* console.log("before");
getUser(1, function (user) {
  console.log("User", user);
});

console.log("after");
function getUser(id, callback) {
  setTimeout(() => {
    console.log("Reading a user from database");
    callback({ id: id, githubUsername: "Moni" });
  }, 2000);
} */

/* //->result
PS C:\Users\Neosoft\Desktop\New folder\node\mosh\async-demo> node index.js
before
after
Reading a user from database
User { id: 1, githubUsername: 'Moni' } */

/* console.log("before");
getUser(1, (user) => {
  console.log("User", user);
});

console.log("after");
function getUser(id, callback) {
  setTimeout(() => {
    console.log("Reading a user from database");
    callback({ id: id, githubUsername: "Moni" });
  }, 2000);
}
 */

/* console.log("before");
getUser(1, (user) => {
  console.log("User", user);

  //gET THE REPOSITORY
});

console.log("after");
function getUser(id, callback) {
  setTimeout(() => {
    console.log("Reading a user from database");
    callback({ id: id, githubUsername: "Moni" });
  }, 2000);
}

function getRepositories(username) {
  return ["repo1", "repo2", "repo3"];
}
 */

/* //->result
PS C:\Users\Neosoft\Desktop\New folder\node\mosh\async-demo> node index.js
before
after
Reading a user from database
User { id: 1, githubUsername: 'Moni' }
Calling Github Api...
Repos repo3
PS C:\Users\Neosoft\Desktop\New folder\node\mosh\async-demo>


 */

//Asynchronous
/* console.log("before");
getUser(1, (user) => {
  getRepositories(user.githubUsername, (repos) => {
    getCommits(repo, (commits) => {
      //callback hrll
    });
  });
});

console.log("after");

//Synchronous
console.log("Before");
const user = getUser(1);
const repos = getRepositories(user.githubUsername);
const commits = getCommits(repos[0]);
console.log("After");

function getUser(id, callback) {
  setTimeout(() => {
    console.log("Reading a user from database");
    callback({ id: id, githubUsername: "Moni" });
  }, 2000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log("Calling Github Api...");
    callback(("repo1", "repo2", "repo3"));
  }, 2000);
}
 */

/* console.log("before");
getUser(1, getRepositories);
console.log("after");
function getRepositories(user) {
  getRepositories(user.githubUsername, getCommits);
}
function getCommits(repos) {
  getCommits(repos, displayCommits);
}
function displayCommits(commits) {
  console.log(commits);
}
function getUser(id, callback) {
  setTimeout(() => {
    console.log("Reading a user from database");
    callback({ id: id, githubUsername: "Moni" });
  }, 2000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log("Calling Github Api...");
    callback(["repo1", "repo2", "repo3"]);
  }, 2000);
}
 */
