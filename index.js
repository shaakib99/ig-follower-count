const express = require("express");
const axios = require("axios");

const app = express();

const FACEBOOK_USER_ACCESS_TOKEN = "YOUR_FACEBOOK_ACCESS_TOKEN"; // Must be creator or business account
const GRAPH_API_VERSION = "v12.0";

app.get("/follower-count/:username", async (req, res) => {
  try {
    const username = req.params.username;
    // query.fields should be comma separated list of fields like 'followers_count, follows_count'
    // list of allowed fields can be found here, https://developers.facebook.com/docs/instagram-api/reference/ig-user#requirements
    const fields = req.query.fields || "followers_count";
    const response = await axios.get(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${username}?fields=${fields}&access_token=${FACEBOOK_USER_ACCESS_TOKEN}`,
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    if (response.data && response.data.followers_count !== undefined) {
      const followerCount = response.data.followers_count;
      res.json({ username, followerCount });
    } else {
      res
        .status(404)
        .json({ error: "User not found or follower count not available." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: "Failed to fetch, porbably invalid access token or api version" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
