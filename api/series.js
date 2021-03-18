const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const seriesRouter = express.Router()
const issuesRouter = require('./issues')

// Mount issues router
seriesRouter.use('/:seriesId/issues', issuesRouter)

const validateSeries = (req, res, next) => {
  if (!req.body.series.name || !req.body.series.description) {
    res.sendStatus(400)
  } else {
    next()
  }
}

// Check seriesId
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get(`SELECT * FROM Series WHERE id = ${seriesId}`, (error, series) => {
    if (error) {
      next(error)
    } else if (series) {
      req.series = series
      next()
    } else {
      res.sendStatus(404)
    }
  })
})

// Get a series by id
seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({ series: req.series })
})
// Get all series
seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (error, series) => {
    if (error) {
      next(error)
    } else {
      res.status(200).json({ series: series })
    }
  })
})
// Create a new series
seriesRouter.post('/', validateSeries, (req, res, next) => {
  db.run('INSERT INTO Series (name, description) VALUES ($name, $description)',
    {
      $name: req.body.series.name,
      $description: req.body.series.description
    },
    function (error) {
      if (error) {
        next(error)
      } else {
        db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (error, series) => {
          if (error) {
            next(error)
          } else {
            res.status(201).json({ series: series })
          }
        })
      }
    })
})

seriesRouter.put('/:seriesId', validateSeries, (req, res, next) => {
  db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id', {
    $name: req.body.series.name,
    $description: req.body.series.description,
    $id: req.params.seriesId
  },
  function (error) {
    if (error) {
      next(error)
    } else {
      db.get(`SELECT * FROM Series WHERE id = ${req.params.seriesId}`, (error, series) => {
        if (error) {
          next(error)
        } else {
          res.status(200).json({ series: series })
        }
      })
    }
  })
})
module.exports = seriesRouter
