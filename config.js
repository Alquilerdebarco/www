/**
 * Created by ernestomr87@gmail.com on 3/21/2016.
 */

global.config =
{
  mongoUrl: !process.env.OPENSHIFT_MONGODB_DB_URL ? "mongodb://127.0.0.1/AlquilerDeBarcos" : process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME,
  port: 3000,
  sessionSecret: "random chars here",
  sessionMaxAge: 3600000,
  production: true,
  server: {
    host: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
  },
  timezone: "+01:00"
};
