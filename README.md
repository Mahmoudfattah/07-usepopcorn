# 🎬 usePopcorn

A modern React movie discovery app where you can search for films, view detailed information, and maintain your own “watched” list with custom ratings – all stored locally in your browser.

Built with **React + Vite** and powered by the **OMDb API**.

---

## 🚀 Features

- 🔎 **Live Movie Search**
  - Search movies by title using the OMDb API.
  - Instant feedback with loading and error states.

- 🎥 **Movie Details View**
  - Click any movie to see:
    - Title, year, runtime, genre
    - Plot summary
    - IMDb rating
    - Cast and director
  - Page title updates dynamically with the selected movie.

- ⭐ **Custom Star Rating**
  - Rate movies from **1–10 stars** using a custom star rating component.
  - Smooth hover interaction: preview rating before you click.
  - Your rating is stored and shown if you revisit the movie.

- 📚 **Watched Movies List**
  - Add movies to a **“Watched”** list with:
    - IMDb rating
    - Your own rating
    - Runtime
  - Remove movies from the watched list with a single click.

- 📊 **Watched Summary**
  - See aggregated stats:
    - Total number of watched movies
    - Average IMDb rating
    - Average user rating
    - Average runtime

- 💾 **Local Storage Persistence**
  - Watched list and previous rating are saved in `localStorage`.
  - Your data survives page reloads and browser restarts.

- ⌨️ **Keyboard Shortcuts**
  - Press **Enter** (while not focused on the input) to:
    - Focus the search field
    - Clear the current query
  - Press **Escape** to close the movie details view.

- 📱 **Responsive UI**
  - Two-column layout on desktop (movies list + watched panel).
  - Single-column stacked layout on smaller screens.
  - Custom styled scrollbar and rating UI.

---

## 🛠 Tech Stack

- **React**
- **Vite**
- **JavaScript (ES6+)**
- **CSS (Custom, responsive)**
- **OMDb API** for movie data
- **localStorage** for client-side persistence

---

## 📂 Main Components & Logic

### `App`
- Manages core state:
  - `movies` – search results
  - `watched` – list of watched movies (persisted in localStorage)
  - `query` – current search text
  - `selectId` – currently selected movie ID
  - `loading` / `error` – request status
- Handles:
  - Fetching movie list by search query
  - Selecting / closing a movie
  - Adding / removing watched movies

### `NavBar`, `Logo`, `Search`, `NumResults`
- Top navigation bar with:
  - App logo
  - Search input (with Enter shortcut & focus logic via `useRef`)
  - Dynamic count or hint text: “Found X results” / “Search for more movies”.

### `Main`, `Box`
- Layout components:
  - `Main` wraps the two main columns.
  - `Box` is a reusable container with a **toggle button** to collapse/expand its content.

### `MovieList`, `Movie`
- Renders the list of results.
- Each `Movie` shows:
  - Poster, title, year
  - Click to open details for that movie.

### `MovieDetails`
- Fetches full data for a single movie by `imdbID`.
- Shows detailed info and a rating section.
- Integrates the `StarRating` component.
- Allows adding to the watched list with the chosen rating.
- Listens for **Escape** key to close.
- Updates `document.title` with the movie name while open.

### `WatchedSummary`, `WatchedMoviesList`, `WatchedMovie`
- Displays summary statistics based on the watched list using an `average` helper.
- Renders watched movies with:
  - IMDb rating, user rating, runtime
  - Delete button to remove from watched.

### `StarRating`, `Star`
- Custom, reusable star rating component:
  - `MaxRating` prop (default 10).
  - Internal state for:
    - `selectedStars` – final chosen rating.
    - `hoverSelectedStars` – temporary hover preview.
  - Calls `onSetRating` callback to pass rating back to parent.
  - Styled stars with hover animations and a badge showing the current value.

---

## 🔑 OMDb API Key

This project uses the **OMDb API**.  
In the code, there is a constant

```js
const KEY = "YOUR_OMDB_API_KEY";
