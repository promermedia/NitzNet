export const setFilms = (films) => ({
  type: "SET_FILMS",
  payload: films,
});

export const addFilm = (film) => ({
  type: "ADD_FILM",
  payload: film,
});

export const updateFilm = (film) => ({
  type: "UPDATE_FILM",
  payload: film,
});