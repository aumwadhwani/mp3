const User = require('../models/user');
const Task = require('../models/task');

function send(res, code, message, data = {}) {
  return res.status(code).json({ message, data });
}

module.exports = function (router) {


  router.get('/', async (req, res) => {
    try {
      let query = User.find();

      if (req.query.where) {
        try {
          const where = JSON.parse(req.query.where);
          query = query.find(where);
        } catch {
          return res.status(400).json({ message: "bad request where", data: {} });
        }
      }


      if (req.query.sort) {
        try {
          const sort = JSON.parse(req.query.sort);
          query = query.sort(sort);
        } catch {
          return res.status(400).json({ message: "bad request sort", data: {} });
        }
      }


      if (req.query.select) {
        try {
          const selectObj = JSON.parse(req.query.select);
          query = query.select(selectObj);
        } catch {
          return send(res, 400, "bad request select");
        }
      }


      if (req.query.skip) {
        const n = parseInt(req.query.skip, 10);
        if (Number.isNaN(n) || n < 0) {
          return send(res, 400, "bad request skup");
        }
        query = query.skip(n);
      }


      if (req.query.limit !== undefined) {
        const n = parseInt(req.query.limit, 10);
        if (Number.isNaN(n) || n < 0) {
          return send(res, 400, "bad request limit");
        }
        query = query.limit(n);
      }

      if (req.query.count) {
        if (req.query.count.toLowerCase() === 'true') {
          let to_count = {};
          if (req.query.where) {
            try { to_count = JSON.parse(req.query.where); }
            catch { return send(res, 400, "broken like me"); }
          }
          const count = await User.countDocuments(to_count);
          return send(res, 200, 'OK', { count });
        }
        
      }

      const users = await query.exec();
      return send(res, 200, 'OK', users);

    } 
    catch (err) {
      return send(res, 500, 'Server error', {});
    }
  });



  router.post('/', async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      if (!name || !email) {
        return res.status(400).json({ message: "bad request post", data: {} });
      }

      const pendingTasks = Array.isArray(req.body.pendingTasks) ? req.body.pendingTasks : [];
      const payload = {name, email, pendingTasks};
      const user = await User.create(payload);
      return res.status(201).json({ message: "wlecome to the database user", data: user });

    } catch (err) {
      return res.status(400).json({ message: "err post ", data: {} });
    }
  });




  router.get('/:id', async (req, res) => {
    try {
      let query = User.findById(req.params.id);
  
      if (req.query.select) {
        try {
          const selectObj = JSON.parse(req.query.select);
          query = query.select(selectObj);
        } catch {
          return res.status(404).json({ message: "bad request select", data: {} });
        }
      }
  
      const user = await query.exec();
      if (!user) {
        return res.status(404).json({ message: 'user dne', data: {} });
      }
  
      return res.status(200).json({ message: 'OK', data: user });
    } catch (err) {
      return res.status(404).json({ message: 'boooo', data: {} });
    }
  });





  router.put('/:id', async (req, res) => {
    try {
      const existing = await User.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'user dne', data: {} });
      }

      const name = req.body.name;
      const email = req.body.email;
      if (!name || !email) {
        return res.status(404).json({ message: "bad request post", data: {} });
      }


      let pendingTasks = req.body.pendingTasks;
      if (pendingTasks === undefined) pendingTasks = req.body['pendingTasks[]'];
      if (pendingTasks === undefined) pendingTasks = [];
      if (!Array.isArray(pendingTasks)) pendingTasks = [pendingTasks];
      pendingTasks = pendingTasks.filter(Boolean);

      const replacement = {
        _id: req.params.id,
        name,
        email,
        pendingTasks,
        dateCreated: existing.dateCreated,
      };

      await User.replaceOne({ _id: req.params.id }, replacement, { runValidators: true });

      const updated = await User.findById(req.params.id);
      return res.status(200).json({ message: "welcome new guy!", data: updated });

    } catch (err) {
      return res.status(404).json({ message:"boooo failure like me; id put", data: {} });
    }
  });





  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'user dne', data: {} });
      }

      await user.deleteOne();

      return res.status(204).json({ message: 'deleted yay.', data: {} });

    } catch (err) {
      return res.status(404).json({ message: 'this code does not work. just like my brain', data: {} });
    }
  });






  return router;

}