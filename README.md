# Personal Dashboard (Momentum-style)

A calm, focused start page inspired by the Momentum Chrome extension. It shows the time, a greeting, a daily background photo, the local weather and a random inspiring quote. It is built as a normal web page first, and the plan is to turn it into a Chrome new-tab extension.

![Screenshot of the dashboard](/images/screenshot.png)

## Features

- **Live clock** that updates every second
- **Get user name** for the first time and save it inside the localStorge 
- **Greeting** that changes with the time of day (morning, afternoon, evening)
- **Daily background** from the Unsplash API, fetched once per day and cached, so refreshing the page does not use up the API limit
- **Fallback background** that loads when the request fails, so the page always looks good
- **Responsive image size** that requests the photo at the width of the user's screen
- **Weather** for the user's location (Geolocation API + OpenWeatherMap), cached for 30 minutes, with clear messages when location is blocked or the request fails
- **Random quote** on every refresh, picked from a local list of 50 quotes
- **Glass-style UI** for the name input, using `backdrop-filter`

## Built with

- HTML, CSS and JavaScript (ES modules)
- [Unsplash API](https://unsplash.com/developers) for background photos
- [OpenWeatherMap API](https://openweathermap.org/api) for current weather
- Browser Geolocation API
- `localStorage` for caching

## How it works

| Feature    | Data source              | Cache                          |
| ---------- | ------------------------ | ------------------------------ |
| Background | Unsplash `photos/random` | One image per day              |
| Weather    | OpenWeatherMap           | 30 minutes                     |
| Quote      | Local array in `quotes.js` | None, new quote every refresh |

The background and weather are saved in `localStorage` together with a date or timestamp. On each page load the code checks whether the saved data is still fresh. If it is, it uses it right away. If not, it fetches new data, saves it and then shows it.

## Getting started

1. Clone the repository:
   ```
   git clone https://github.com/ziadmohamed1911/my-personal-dashboard
   ```
2. Get your own API keys:
   - Unsplash: create an app at [unsplash.com/developers](https://unsplash.com/developers) and copy the **Access Key**(please don't use my key)
   - OpenWeatherMap: create a free account and copy a key from the API keys page (new keys can take up to two hours to activate, and please don't use my key)
3. Add the keys in `index.js`: the Unsplash key in `getNewBg()` and the OpenWeatherMap key in `getCurrentWeather()`.
4. Serve the folder with a local server, for example the VS Code **Live Server** extension. Opening `index.html` directly from the file system will not work, because the code uses ES modules and the Geolocation API.
5. Allow location access when the browser asks.

> **Never commit your real API keys to a public repository.** Keep them out of the code you push, for example in a separate config file listed in `.gitignore`.

## Project structure

```
├── index.html
├── style.css
├── index.js        # clock, greeting, background, weather, quote
├── quotes.js       # list of quotes (exported array)
└── README.md
```

## What I learned

- Fetching data with `async` / `await` and handling errors with `try` / `catch` and `res.ok`
- Caching API responses in `localStorage` with a date or timestamp to respect rate limits
- Why timing matters: rendering only after asynchronous data has arrived
- Using the Geolocation API and handling denied permission
- Building URLs with query parameters and template literals
- CSS layout with flexbox, plus glass effects with `backdrop-filter`

## Roadmap

- [ ] Daily focus input
- [ ] Photographer credit for the background photo
- [ ] World news headlines
- [ ] Preload the background image so it appears all at once

## Credits

- Photos from [Unsplash](https://unsplash.com) and their photographers
- Weather data from [OpenWeatherMap](https://openweathermap.org)
- Inspired by the [Momentum](https://momentumdash.com) Chrome extension
