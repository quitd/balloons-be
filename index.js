const { app } = require('deta');
const fetch = require('cross-fetch');

app.lib.cron(e => {
  fetch('https://api.github.com/repos/quitd/balloons-be/actions/workflows/21097005/dispatches', {
    method: 'post',
    body: JSON.stringify({ref: 'master'}),
    headers: {
      Authorization: 'token '+process.env.GH
    }
  }).then(g => {if(!g.ok) console.log(g)})
})

module.exports = app;
