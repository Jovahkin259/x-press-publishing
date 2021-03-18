const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')

const artistsRouter = express.Router()

// Check artist ID parameter
artistsRouter.param('artistId', (req, res, next, artistId) => {
  db.get('SELECT * FROM artist WHERE id = $artistId',
    { $artistId: artistId },
    (error, artist) => {
      if (error) {
        next(error)
      } else if (artist) {
        req.artist = artist
        next()
      } else {
        res.sendStatus(404)
      }
    })
})

// Get all artists
artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE Artist.is_currently_employed = 1', (error, rows) => {
    if (error) {
      next(error)
    } else {
      res.status(200).json({ artists: rows })
    }
  })
})

// Get artist by ID
artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({ artist: req.artist })
})

module.exports = artistsRouter
