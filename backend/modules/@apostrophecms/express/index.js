export default {
  options: {
    // The Astro site proxies Apostrophe API requests from a separate origin.
    // Keep normal CSRF protection everywhere else, while allowing logout to
    // reach Apostrophe's own authenticated-user check through that proxy.
    csrfExceptions: [
      '/api/v1/@apostrophecms/login/logout'
    ],
    session: {
      // Keep session signatures stable across Render deploys and instances.
      // Local development may omit this and accept Apostrophe's warning, but
      // production must provide APOS_SESSION_SECRET.
      secret: process.env.APOS_SESSION_SECRET
    }
  }
};
