export default {
  options: {
    session: {
      // Keep sessions stable across Docker container rebuilds. Production and
      // shared environments must provide their own long random value.
      secret: process.env.APOS_SESSION_SECRET || 'local-development-session-secret'
    }
  }
};
