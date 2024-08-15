const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = 3001;

const GameModel = require('./models/Game')
const CoverModel = require('./models/Cover')
const GenreModel = require('./models/Genre')
const LanguageModel = require('./models/Language')
const LanguageSupportModel = require('./models/LanguageSupport')
const ScreenshotModel = require('./models/Screenshot')
const ThemeModel = require('./models/Theme')

const MAX_PAGE_SIZE = 15;
const MAX_GAME_COUNT = 20;

const app = express()
app.use(cors(
    {
        origin: process.env.ORIGIN,
        methods: ["POST", "GET", "OPTIONS"],
        credentials: true
    }
));
app.use(express.json())

mongoose.connect(process.env.MONGODB_SRV)

app.listen(process.env.PORT || port, () => {
    console.log("Server is running")
})

app.get("/", (req, res) => {
    res.json("OK");
})

app.get("/randomGames", async (req, res) => {
    const games = await GameModel.aggregate([{$match:{"screenshots.0": {"$exists": true}}}]).sample(20);
    res.send(games);
})

app.get('/homeData', async(req, res) => {
    const games = await GameModel.find();

    const mostRecentFilter = [...games.filter((g) => g.screenshots.length > 0 && g.total_rating_count > 200)];
    const userFilter = [...games.filter((g) => g.rating_count > 200)];
    const criticFilter = [...games.filter((g) => g.aggregated_rating_count > 5)];
    const overallFilter = [...games.filter((g) => g.total_rating_count > 200)];

    userFilter.sort((a, b) => {return a.rating - b.rating});
    criticFilter.sort((a, b) => {return b.aggregated_rating - a.aggregated_rating});
    overallFilter.sort((a, b) => {return b.total_rating - a.total_rating});

    res.send({
        mostRecent: mostRecentFilter.slice(0, MAX_GAME_COUNT),
        userFavorites: userFilter.slice(0, MAX_GAME_COUNT),
        criticFavorites: criticFilter.slice(0, MAX_GAME_COUNT),
        overallFavorites: overallFilter.slice(0, MAX_GAME_COUNT)
    })
})

app.get("/screenshot/:id", async (req, res) => {
    const image = await ScreenshotModel.findOne({_id: req.params.id});
    res.send(image);
})

app.get("/coverByGameId/:id", async (req, res) => {
    const image = await CoverModel.findOne({_id: req.params.id});
    res.send(image);
})

app.get("/languagesByGameId/:id", async (req, res) => {
    const languages = [];
    const game = await GameModel.findOne({_id: req.params.id});

    for (let ls of game.language_supports) {
        const language_support = await LanguageSupportModel.findOne({_id: ls});

        if (language_support) {
            const language = await LanguageModel.findOne({_id: language_support.language});

            if (!languages.includes(language.native_name))
                languages.push(language.native_name);
        }
    }

    res.send(languages);
})

app.get("/genres", async (req, res) => {
    const genres = await GenreModel.find()

    for (let [index, g] of genres.entries()) {
        const games = await GameModel.find({genres: {$all: [g._id]}})
        if (!games.length > 0) {
            genres.splice(index, 1);
        }
    }

    res.send(genres)
})

app.get("/themes", async (req, res) => {
    const themes = await ThemeModel.find()

    for (let [index, t] of themes.entries()) {
        const games = await GameModel.find({themes: {$all: [t._id]}})
        if (!games.length > 0) {
            themes.splice(index, 1);
        }
    }

    res.send(themes)
})

app.get("/genre/:field", async (req, res) => {
    let genre = null;
    const isNumber = !(isNaN(req.params.field))

    if (isNumber)
        genre = await GenreModel.findOne({_id: req.params.field});

    else
        genre = await GenreModel.findOne({slug: req.params.field});

    res.send(genre);
})

app.get("/theme/:field", async (req, res) => {
    let theme = null;
    const isNumber = !(isNaN(req.params.field))

    if (isNumber)
        theme = await ThemeModel.findOne({_id: req.params.field});

    else
        theme = await ThemeModel.findOne({slug: req.params.field});

    res.send(theme);
})

app.get("/gamesByGenre/:id/page/:number", async (req, res) => {
    const games = await GameModel.find({genres: {$all: [req.params.id]}, "screenshots.0": {"$exists": true}})

    const initialIndex = (Number(req.params.number) - 1) * MAX_PAGE_SIZE;
    const finalIndex = initialIndex + MAX_PAGE_SIZE;
    
    const totalPages = (games.length % MAX_PAGE_SIZE > 0 ? 1 : 0) + Math.floor(games.length / MAX_PAGE_SIZE);

    games.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const result = games.slice(initialIndex, finalIndex);

    res.send({games: result, totalPages: totalPages})
})

app.get("/gamesByTheme/:id/page/:number", async (req, res) => {
    const games = await GameModel.find({themes: {$all: [req.params.id]}, "screenshots.0": {"$exists": true}})

    const initialIndex = (Number(req.params.number) - 1) * MAX_PAGE_SIZE;
    const finalIndex = initialIndex + MAX_PAGE_SIZE;
    
    const totalPages = (games.length % MAX_PAGE_SIZE > 0 ? 1 : 0) + Math.floor(games.length / MAX_PAGE_SIZE);

    games.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const result = games.slice(initialIndex, finalIndex);

    res.send({games: result, totalPages: totalPages})
})