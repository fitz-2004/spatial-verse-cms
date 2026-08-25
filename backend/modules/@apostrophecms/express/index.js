export default {
  options: {
    session: {
      // Keep session signatures stable across Render deploys and instances.
      // Local development may omit this and accept Apostrophe's warning, but
      // production must provide APOS_SESSION_SECRET.
      secret: process.env.APOS_SESSION_SECRET
    }
  }
};
