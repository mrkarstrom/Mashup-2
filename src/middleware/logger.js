import colors from 'colors';

const logger = (req, _, next) => {
  const methodColors = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'orange',
    DELETE: 'red',
  };

  const color = methodColors[req.method] || 'white';

  console.log(
    `${req.method} `[color] +
      `${req.protocol}://${req.get('host')}${req.originalUrl}`
  );

  next();
};

export default logger;
