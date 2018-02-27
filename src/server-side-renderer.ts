import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match, createRoutes } from 'react-router';
import AsyncProps, { loadPropsOnServer } from 'async-props';
import * as httpStatus from 'http-status-codes';

const routes = createRoutes(require('./public/src/Router').default());

function objectAssignPolyfill(target: object, ...args: any[]) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const output = Object(target);

  for (let index = 0; index < args.length; index++) {
    const source = args[index];
    if (source !== undefined && source !== null) {
      for (const nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }

  return output;
}

export default {
  render(req: express.Request, res: express.Response, title?: string, metaDescription?: string, properties?: object) {
    return new Promise((resolve, reject) => {
      match({ routes, location: req.url}, (error: Error, redirectLocation, renderProps) => {
        if (error) {
          reject(error);
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search);
          resolve();
        } else if (renderProps) {
          loadPropsOnServer(renderProps, null, (err, asyncProps, scriptTag) => {
            if (err != null) {
              reject(err);
            } else {
              res.render('app', {
                content: renderToString(React.createElement(AsyncProps, objectAssignPolyfill({}, renderProps, asyncProps))),
                urlName: `${req.protocol}://${req.get('host')}`,
                scriptTag,
                title,
                metaDescription,
                canonical: req['canonical'],
                ...(properties || {})
              });
              resolve();
            }
          });
        } else {
          res.render('app', {
            content: 'The page could not be found',
            urlName: `${req.protocol}://${req.get('host')}`,
            title: 'Page Not Found'
          });
          resolve();
        }
      });
    });
  },

  handle(req: express.Request, res: express.Response, title?: string, metaDescription?: string, properties?: object) {
    this.render(req, res, title, metaDescription, properties).then((data) => {
    }).catch((err) => {
      console.error('Failed to render page:', err);
    });
  }
};