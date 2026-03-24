const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const USER = "juan123";
const PASS = "123456";

const data = {
  live: [
    {
      name: "Canal 1",
      stream_id: 1,
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    }
  ],
  movies: [
    {
      name: "Película Demo",
      stream_id: 100,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    }
  ],
  series: [
    {
      series_id: 200,
      name: "Serie Demo",
      episodes: [
        {
          episode_num: 1,
          title: "Capítulo 1",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        }
      ]
    }
  ]
};

function auth(req) {
  return req.query.username === USER && req.query.password === PASS;
}

app.get("/player_api.php", (req, res) => {
  const { username, password, action } = req.query;

  if (username !== USER || password !== PASS) {
    return res.json({ user_info: { auth: 0 } });
  }

  // LOGIN
  if (!action) {
    return res.json({
      user_info: {
        username: USER,
        password: PASS,
        auth: 1,
        status: "Active"
      },
      server_info: {
        url: req.hostname,
        port: PORT,
        https_port: PORT,
        server_protocol: "http"
      }
    });
  }

  // TV
  if (action === "get_live_streams") {
    return res.json(data.live);
  }

  // Películas
  if (action === "get_vod_streams") {
    return res.json(data.movies);
  }

  // Series
  if (action === "get_series") {
    return res.json(data.series);
  }

  res.json({});
});

  res.json({
    user_info: {
      username: USER,
      password: PASS,
      auth: 1,
      status: "Active"
    }
  });
});

app.get("/get_live_streams", (req, res) => {
  if (!auth(req)) return res.send([]);
  res.json(data.live);
});

app.get("/get_vod_streams", (req, res) => {
  if (!auth(req)) return res.send([]);
  res.json(data.movies);
});

app.get("/get_series", (req, res) => {
  if (!auth(req)) return res.send([]);
  res.json(data.series);
});

app.get("/live/:user/:pass/:id.m3u8", (req, res) => {
  const stream = data.live.find(s => s.stream_id == req.params.id);
  if (stream) res.redirect(stream.url);
  else res.sendStatus(404);
});

app.get("/movie/:user/:pass/:id.mp4", (req, res) => {
  const movie = data.movies.find(m => m.stream_id == req.params.id);
  if (movie) res.redirect(movie.url);
  else res.sendStatus(404);
});

app.get("/series/:user/:pass/:id.mp4", (req, res) => {
  const ep = data.series[0].episodes[0];
  if (ep) res.redirect(ep.url);
  else res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
