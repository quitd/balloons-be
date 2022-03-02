const { app, Deta } = require('deta');
const fetch = require('cross-fetch');

const deta = Deta(process.env.DETA_PROJECT_KEY)
const db = deta.Base('conf');
const users = deta.Base('amounts');
const trans = deta.Base('transactions');

// define a function to run on a schedule
// the function must take an event as an argument
app.lib.cron(async event => {
  let last = await db.get('last')
  if(!last) last = {value:0};
  const a = await fetch('https://api.allorigins.win/raw?url='+encodeURIComponent('https://forum.gethopscotch.com/t/'+61353+'.json?d='+new Date().getTime()));
  const b = await a.json();
  const e = [];
  for (const [i, v] of b.post_stream.stream.entries()) {
    if(i > last.value) {
      const c = await fetch('https://api.allorigins.win/raw?url='+encodeURIComponent('https://forum.gethopscotch.com/posts/'+v+'.json'));
      const d = await c.json()
      e.push(d)
    }
  }

  db.put(b.post_stream.stream.length-1, 'last')

  for(let f of e) {
    const hhh = await trans.get(f.id+'');
    if(!hhh) {
      for (let v of [...f.raw.toLowerCase().matchAll(/^pay @(\w+) (\d+)(?: balloons?)?$/mg)]) {
        const user = await users.get(f.username.toLowerCase());
        const tUser = await users.get(v[1].toLowerCase());
        const amount = parseInt(v[2]);
        if(user.amount >= amount && tUser && user) {
          users.update({amount: tUser.amount + amount}, v[1].toLowerCase())
          users.update({amount: user.amount - amount}, f.username.toLowerCase())
          trans.insert({
            type: 'pay',
            from: f.username.toLowerCase(),
            to: v[1].toLowerCase(),
            amount,
            time: new Date(f.created_at).getTime(),
            key: f.id+''
          })
        }
      };
    }
  }
});

module.exports = app;
