const { app } = require('deta');
const fetch = require('cross-fetch');

app.lib.cron(e => {
  fetch('https://api.github.com/repos/quitd/balloons-be/actions/workflows/21097005/dispatches', {
    method: 'post',
    headers: {
      Authorization: 'token '+process.env.GH
    }
  })
})

module.exports = app;
