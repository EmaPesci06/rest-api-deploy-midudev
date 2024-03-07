const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json');
const cors = require('cors')
const { validateMovies, validatePartialMovies } = require('./schema/movies');

const app = express();
app.disable('x-powered-by');
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:8081'];
        
        if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true);

        if (!origin) return callback(null, true);
        
        return callback(new Error('Not allowed by CORS'));
    }}
));
app.use(express.json());

app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    }
    res.json(movies);
});

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    movies.splice(movieIndex, 1);
    res.json({ message: 'Movie deleted' });
});

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    
    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    const result = validateMovies(req.body);

    if (result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    
    movies.push(newMovie);
    console.log(newMovie);
    res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovies(req.body);

    if (!result.success) {
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });
    
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;

    res.json(updateMovie);
});
 
const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})