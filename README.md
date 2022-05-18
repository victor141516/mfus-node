# mfus.tk - Link shortener

This is a simple link shortener using an optimized-for-shortness-and-legibility short URL generation algorithm.

## Installation

### Development

There is a convenience script that runs docker-compose so that you can run the app and have hot reload (just for frontend for now) by running:

```sh
./run dev
```

Then you'll need to bootstrap the database. To do so, there is a migrations directory in `backend/migrations`. You'll have to feed the database with those files in order somehow.

### Production

It's the same as development, but the run command is the following:

```sh
./run
```

## Screenshots
<img src="https://i.imgur.com/7lBnqIA.png" alt="webpage" width="400">

## Roadmap

- [ ] Improve migration system
- [ ] Add hot reloading for backend
- [ ] Make a the URL hostname configurable (or dynamic)
- [ ] Add a backoffice for admins
- [ ] Add user registration support and user dashboard like [Pckd](https://github.com/Just-Moh-it/Pckd)
