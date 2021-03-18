const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const issuesRouter = express.Router({ mergeParams: true })

// Get all existing issues
issuesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Issue WHERE Issue.series_id = $seriesId', {
    $seriesId: req.params.seriesId
  },
  (error, issues) => {
    if (error) {
      next(error)
    } else {
      res.status(200).json({ issues: issues })
    }
  })
})

module.exports = issuesRouter
