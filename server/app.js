const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  const clientUrl = process.env.CLIENT_URL;
  const isPlaceholderClientUrl = (url) =>
    !url || url.includes('your-render-service') || url.includes('localhost');

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (clientUrl && origin === clientUrl) {
          return callback(null, true);
        }

        if (!clientUrl || isPlaceholderClientUrl(clientUrl)) {
          console.warn(
            `CLIENT_URL is unset or placeholder (${clientUrl}). Allowing request origin for same-origin deployments.`
          );
          return callback(null, true);
        }

        return callback(new Error(`CORS policy: origin ${origin} not allowed`));
      },
      credentials: true
    })
  );

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);

  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');

    app.use(express.static(clientBuildPath));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }

      return res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
