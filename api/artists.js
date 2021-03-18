const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')

const artistsRouter = express.Router()

// Validate new artist
const validateArtist = (req, res, next) => {
  const artist = req.body.artist
  if (!artist.name || !artist.dateOfBirth || !artist.biography) {
    res.sendStatus(400)
  }
  if (!artist.isCurrentlyEmployed) {
    req.body.artist.isCurrentlyEmployed = 1
  }
  next()
}

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

// Create a new artist
artistsRouter.post('/', validateArtist, (req, res, next) => {
  db.run('INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)' +
        'VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed )', {
    $name: req.body.artist.name,
    $dateOfBirth: req.body.artist.dateOfBirth,
    $biography: req.body.artist.biography,
    $isCurrentlyEmployed: req.body.artist.isCurrentlyEmployed
  },
  function (error) {
    if (error) {
      next(error)
    } else {
      db.get(`SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`, (error, artist) => {
        if (error) {
          next(error)
        }
        res.status(201).json({ artist: artist })
      })
    }
  }
  )
})

// Update an artist
artistsRouter.put('/:artistId', validateArtist, (req, res, next) => {

})
module.exports = artistsRouter
