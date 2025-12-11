import { useEffect, useState, useRef } from "react";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur / arr.length, 0) : 0;


const KEY = "f84fc31d";


export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
     return storedValue ? JSON.parse(storedValue) : [];
  });
  const [query, setQuery] = useState("interstellar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectId, setSelectedId] = useState(null);

  //to open the movie clicked and show details page
  function handleSelectedMovie(id) {
    setSelectedId((selectId) => (selectId === id ? null : id));
  }

  function CloseSelectedFilm() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveWatchedFilm(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));//it will pass
    //  for all movies in array watched 
    // only the movie
    //  that has imdbId === id will remove from array
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched)); //because this is array and
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function getMovies() {
        try {
          if (query < 1) {
            setMovies([]);
            return;
          }
          setLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (error) {
          setLoading(false);
          if (error.name !== "AbortError") {
            console.error("Error fetching movies:", error);
            setError(error.message || "Movie not found");
          }
        } finally {
          setLoading(false);
        }
      }

      getMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {loading ? (
            <Loading />
          ) : (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
          {error && <p className="loader">{error}</p>}
        </Box>

        <Box>
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              setWatched={setWatched}
              CloseSelectedFilm={CloseSelectedFilm}
              handleWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemove={handleRemoveWatchedFilm}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Loading() {
  return <p className="loader">loading...</p>;
}
function Error({ error }) {
  return <p className="loader">{error}</p>;
}

function Search({ query, setQuery }) {

  const inputRef = useRef(null);

  useEffect(function () {
    function callback(e) {
      if (document.activeElement === inputRef.current) return;
      if (e.code === "Enter") {
        inputRef.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
     { movies.length > 1 ? 
     <>
       
     <strong>Found {movies?.length} results </strong>
    
     </>
     
      : 
       <strong>Search for more movies</strong>
       }
    </p>
  );
}

function Main({ children }) {
  return <main className="main">
    {children}
    </main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children }
    </div>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className=" list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedMovie }) {
  return (
    <li onClick={() => handleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectId,
  CloseSelectedFilm,
  handleWatchedMovie,
  watched,
}) {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [rating, setRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);
  const oldRating = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;

  const or = localStorage.getItem('oldRating')

  const {
    Title,
    Year,
    Poster,
    Runtime: runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
    imdbID,
  } = movie || {};

  function setWatchedMovie() {//will add movie to watchsummery
    const movie = {
      Title,
      Year,
      Poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      imdbID,
      userRating: rating,
    };


    handleWatchedMovie(movie); 
    CloseSelectedFilm();
  }

  function getTheUserRating(rating) {
    setRating(rating);
  }

 
  useEffect(
    function () {
      async function getMoviesDetails() {
        setLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
        );

        const data = await res.json();
        

        setMovie(data);

        setLoading(false);
      }
      getMoviesDetails();
    },
    [selectId]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          CloseSelectedFilm();
        }
      }
      document.addEventListener("keydown", callback);
      //this part is function cleanup 
      return () => removeEventListener("keydown", callback);
    },
    [CloseSelectedFilm]
  );

  useEffect(
    function () {
      if (!Title) return;
      document.title = `Movie : ${Title} `;
      return () => (document.title = "usepopcorn");
    },
    [Title]
  );

   useEffect(
    function () {
      localStorage.setItem("oldRating", oldRating);
    },
    [oldRating]
  );


  return (
    <div className="details">
      <button className="btn-back" onClick={CloseSelectedFilm}>
        &larr;
      </button>
      {loading ? (
        <p className="loader">loading...</p>
      ) : (
        <>
          {" "}
          <header>
            <img src={Poster} alt={`${Title} poster`} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {runtime} min{" "}
              </p>
              <p>{Genre}</p>
              <p>⭐️ {imdbRating} IMDb rating</p>
            </div>
          </header>
          <section>
            {/* { !isWatched ? <>
           
           <div className="rating">
              <StarRating MaxRating={10} onSetRating={getTheUserRating} />
            </div>

            {userRating > 0 && (
              <button className="btn-add " onClick={AddToWatchedList}>
                Add to Witched List
              </button>
         
            )} 
              </> 
              :  <p>You related the movie before <strong>{watchedUserRating}</strong>  </p> } */}

            {!isWatched ? (
              <div className="rating">
                <StarRating MaxRating={10} onSetRating={getTheUserRating} />

                {rating > 0 && (
                  <button className="btn-add " onClick={setWatchedMovie}>
                    Add to Witched List
                  </button>
                )}
              </div>
            ) : (
              <p className="rating">
                You related the movie before {or}{" "}
              </p>
            )}

            <p>
              {" "}
              <em> {Plot}</em>{" "}
            </p>
            <p>
              <strong>Starring:</strong> {Actors}
            </p>
            <p>
              <strong>Directed by:</strong> {Director}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onRemove }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onRemove={onRemove} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onRemove }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onRemove(movie.imdbID)}>
        X
      </button>
    </li>
  );
}

function StarRating({ MaxRating = 10, onSetRating }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoverSelectedStars, SetHoverSelectedStars] = useState(0);

  return (
    <div className="star-rating">
      <div className="star-rating__stars">
        {Array.from({ length: MaxRating }, (_, i) => (
          <Star
            key={i}
            role="button"
            selectedStars={selectedStars}
            onRate={() => {
              setSelectedStars(i + 1);
              onSetRating?.(i + 1);
            }}
            full={
              hoverSelectedStars
                ? hoverSelectedStars >= i + 1
                : selectedStars >= i + 1
            }
            onMousein={() => SetHoverSelectedStars(i + 1)}
            onMouseout={() => SetHoverSelectedStars(0)}
          />
        ))}
      </div>

      <p className={` ${hoverSelectedStars || selectedStars ? 'star-rating__value' : '' }  `} >
        {hoverSelectedStars || selectedStars || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onMousein, onMouseout }) {
  return (
    <span
      role="button"
      className={`star ${full ? "star--full" : ""}`}
      onClick={onRate}
      onMouseEnter={onMousein}
      onMouseLeave={onMouseout}
    >
      {full ? "★" : "☆"}
    </span>
  );
}
