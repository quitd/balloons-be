const { App } = require('deta');
const fetch = require('cross-fetch');
const express = require('express');
const app = App(express());

app.all('/', (_, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  f();
  res.end()
})

app.lib.cron(e => {
  f();
})

function f() {
  fetch('https://api.github.com/repos/quitd/balloons-be/actions/workflows/21097005/dispatches', {
    method: 'post',
    body: JSON.stringify({ref: 'master'}),
    headers: {
      Authorization: 'token '+process.env.GH
    }
  }).then(g => {if(!g.ok) console.log(g)})
}

module.exports = app;
