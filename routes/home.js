// module.exports = function (router) {

//     var homeRoute = router.route('/');

//     homeRoute.get(function (req, res) {
//         var connectionString = process.env.TOKEN;
//         res.json({ message: 'My connection string is ' + connectionString });
//     });

//     return router;
// }













// routes/home.js
module.exports = function (router) {
    const homeRoute = router.route('/');
  
    homeRoute.get(function (req, res) {
      const token = process.env.TOKEN || 'OK';
      res.json({ message: 'API alive', data: { token } });
    });
  
    return router;
  };
  