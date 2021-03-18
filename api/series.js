const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const seriesRouter = express.Router()

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
module.exports = seriesRouter
