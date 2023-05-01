# News Aggregator API

### Assignment 02

**Problem Statement** -- Build a RESTful API that allows users to fetch news articles from multiple sources based on their preferences.

|           Endpoint | Description                                                    |
| -----------------: | :------------------------------------------------------------- |
|   `POST /register` | Register a new user.                                           |
|      `POST /login` | Log in a user.                                                 |
| `GET /preferences` | Retrieve the news preferences for the logged-in user.          |
| `PUT /preferences` | Update the news preferences for the logged-in user.            |
|        `GET /news` | Fetch news articles based on the logged-in user's preferences. |

#### Tasks

- [x] Use an **in-memory data store** (e.g., an array) to store store user information and their news preferences.
- [x] Use **external news APIs to fetch** news articles from multiple sources. Incorporate async/await and Promises in the process of fetching news data and filtering it based on user preferences.
- [x] Implement proper **error handling** for invalid requests.
- [x] Add **input validation** for user registration and news preference updates.
- [x] **Test** the API using Postman or Curl to ensure it works as expected.

##### Optional Tasks

- [ ] Implement a **caching mechanism** to store news articles and reduce the number of calls to external news APIs. Use async/await and Promises to handle cache updates and retrievals.
- [ ] Allow users to mark articles as "read" or "favorite". Implement endpoints to:
      | Endpoint | Description |
      | ------------------: | :------------------------------------------------------------- |
      | `POST /news/:id/read` |Mark a news article as read. |
      | `POST /news/:id/favorite` | Mark a news article as a favorite. |
      | `GET /news/read` | Retrieve all read news articles. |
      | `GET /news/favorites` | Retrieve all favorite news articles. |
      | `GET /news/search/:keyword` | Search for news articles based on keywords. |
- [x] Implement a mechanism to periodically update the cached news articles in the background, simulating a real-time news aggregator.

### Schema

```js
[
  {
    id: "string",
    username: "string",
    password: "string",
    preferences: { categories: [Array], sources: [Array] },
    // "createdAt": Date.now() // a.k.a Unix epoch // TODO
  },
];
```
