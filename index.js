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
        origin: ["https://gamescript-frontend.vercel.app"],
        methods: ["POST", "GET", "OPTIONS"],
        credentials: true
    }
));
app.use(express.json())

mongoose.connect("mongodb+srv://devjosm:Ztg0paFg3SFnc02k@cluster0.6gsx9mv.mongodb.net/gamescript?retryWrites=true&w=majority&appName=Cluster0")

app.listen(process.env.PORT || port, () => {
    console.log("Server is running")
})

app.get("/", (req, res) => {
    res.json("OK");
})

app.get("/randomGames", async (req, res) => {
    const games = await GameModel.aggregate([{$match:{"screenshots.0": {"$exists": true}}}]).sample(20);
    res.json(games);
})

app.get("/mostRecentGames", async (req, res) => {
    const games = await GameModel.find({"screenshots.0": {"$exists": true}, "total_rating_count": {"$gt": 200}}).limit(MAX_GAME_COUNT);
    res.json(games);
})

app.get("/userFavorites", async (req, res) => {
    const games = await GameModel.find({"rating_count": {"$gt": 200}});
    games.sort((a, b) => {return a.rating - b.rating});

    res.send(games.slice(0, MAX_GAME_COUNT));
})

app.get("/criticFavorites", async (req, res) => {
    const games = await GameModel.find({"aggregated_rating_count": {"$gt": 5}});
    games.sort((a, b) => {return b.aggregated_rating - a.aggregated_rating});

    res.send(games.slice(0, MAX_GAME_COUNT));
})

app.get("/overallFavorites", async (req, res) => {
    const games = await GameModel.find({"total_rating_count": {"$gt": 200}});
    games.sort((a, b) => {
        return b.total_rating - a.total_rating
    });

    res.send(games.slice(0, MAX_GAME_COUNT));
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