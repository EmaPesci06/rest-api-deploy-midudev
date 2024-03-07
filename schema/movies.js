const z = require('zod')
const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    genre: z.array(z.enum(['Action', 'Comedy', 'Crime', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure', 'Fantasy'],
        {
            invalid_enum_value: 'Genre must be one of action, comedy, drama, horror, romance, thriller , sci-fi, adventure, fantasy',
            required_error: 'Genre is required',
            invalid_type_error: 'Movie genre must be an array of enum Genre values'
        }
    )).min(1, {
        message: 'At least one genre is required'
    }),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().positive().max(10).default(5.5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    })
});

function validateMovies(object) {
    return movieSchema.safeParse(object);
}

function validatePartialMovies(input) {
    return movieSchema.partial().safeParse(input);
}

module.exports = {
    validateMovies,
    validatePartialMovies
}