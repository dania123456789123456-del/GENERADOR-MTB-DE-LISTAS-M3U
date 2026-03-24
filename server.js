const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const USER = "juan123";
const PASS = "123456";

// 📊 DATA
const live_categories = [{ category_id: "1", category_name: "TV" }];
const vod_categories = [{ category_id: "2", category_name: "Películas" }];
const series_categories = [{ category_id: "3", category_name: "Series" }];

const live_streams = [
  {
    name: "Canal 1",
    stream_id: 1,
    category_id: "1",
    stream_type: "live",
    stream_icon: "",
    direct_source: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  }
];

const vod_streams = [
  {
    name: "Película Demo",
    stream_id: 100,
    category_id: "2",
    stream_type: "movie",
    stream_icon: "",
    container_extension: "mp4",
    direct_source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }
];

const series_list = [
  {
    series_id: 200,
    name: "Serie Demo",
    category_id: "3",
    cover: "",
    plot: "",
    genre: "",
    releaseDate: "",
    rating: "5"
  }
];

const series_info = {
  200: {
    info: {
      name: "Serie Demo"
    },
    episodes: {
      "1": [
        {
          id: 1,
          episode_num: 1,
          title: "Capítulo 1",
          container_extension: "mp4",
          direct_source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        }
      ]
    }
  }
};

// 🔐 LOGIN
app.get("/player_api.php", (req, res) => {
  const { username, password, action } = req.query;

  if (username !== USER || password !== PASS) {
    return res.json({ user_info: { auth: 0 } });
  }

  if (!action) {
    return res.json({
      user_info: {
        username: USER,
        password: PASS,
        auth: 1,
        status: "Active"
      }
    });
  }

  if (action === "get_live_categories") return res.json(live_categories);
  if (action === "get_vod_categories") return res.json(vod_categories);
  if (action === "get_series_categories") return res.json(series_categories);

  if (action === "get_live_streams") return res.json(live_streams);
  if (action === "get_vod_streams") return res.json(vod_streams);
  if (action === "get_series") return res.json(series_list);

  if (action === "get_series_info") {
    const id = req.query.series_id;
    return res.json(series_info[id]);
  }

  res.json({});
});

// ▶ STREAMS
app.get("/live/:user/:pass/:id.m3u8", (req, res) => {
  const s = live_streams.find(x => x.stream_id == req.params.id);
  if (s) res.redirect(s.direct_source);
  else res.sendStatus(404);
});

app.get("/movie/:user/:pass/:id.mp4", (req, res) => {
  const m = vod_streams.find(x => x.stream_id == req.params.id);
  if (m) res.redirect(m.direct_source);
  else res.sendStatus(404);
});

app.get("/series/:user/:pass/:id.mp4", (req, res) => {
  const ep = series_info[200].episodes["1"][0];
  if (ep) res.redirect(ep.direct_source);
  else res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log("Xtream FULL corriendo");
});
