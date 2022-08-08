// healthcheck.routes.js: return a 2xx response when your server is healthy, else send a 5xx response

import express from 'express';
import client from 'prom-client';

//Not how it should be done. Ideally, this should be TypeDI service. This is for demo purposes only
const counter = new client.Counter({
  name: 'healthcounter',
  help: 'Counting health',
});

const router = express.Router({});
router.get('/', async (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'App is up and running',
    timestamp: Date.now(),
  };
  try {
    counter.inc(1);
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = (e as Error).message;
    res.status(503).send();
  }
});
// export router with all routes included
export = router;


