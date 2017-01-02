# redux-scraper
Cheerio based Web scraping middleware for Redux - redux middleware

## Rationale

For complex web scraping operations it is a lot simpler to treat discrete scraping tasks as individual Redux actions

Composability

scraper actions return promises and so scrapes can be chained