const Task = require('../models/task');
const User = require('../models/user');

function send(res, code, message, data = {}) {
  return res.status(code).json({ message, data });
}

module.exports = function (router) {

  router.get('/', async (req, res) => {
    try {
      let query = Task.find();

      if (req.query.where) {
        try {
          const where = JSON.parse(req.query.where);
          query = query.find(where);
        } catch {
          return send(res, 400, "bad request where", {});
        }
      }

      if (req.query.sort) {
        try {
          const sort = JSON.parse(req.query.sort);
          query = query.sort(sort);
        } catch {
          return send(res, 400, "bad request sort", {});
        }
      }

      if (req.query.select) {
        try {
          const selectObj = JSON.parse(req.query.select);
          query = query.select(selectObj);
        } catch {
          return send(res, 400, "bad request select", {});
        }
      }

      if (req.query.skip) {
        const n = parseInt(req.query.skip, 10);
        if (Number.isNaN(n) || n < 0) {
          return send(res, 400, "bad request skip", {});
        }
        query = query.skip(n);
      }


      let limit = 100;
      if (req.query.limit !== undefined) {
        const n = parseInt(req.query.limit, 10);
        if (Number.isNaN(n) || n < 0) {
          return send(res, 400, "bad request limit", {});
        }
        limit = n;
      }
      query = query.limit(limit);


      if (String(req.query.count || '').toLowerCase() === 'true') {
        let to_count = {};
        if (req.query.where) {
          try { to_count = JSON.parse(req.query.where); }
          catch { return send(res, 400, "boooo failure", {}); }
        }
        const count = await Task.countDocuments(to_count);
        return send(res, 200, 'OK', { count });
      }

      const tasks = await query.exec();
      return send(res, 200, 'OK', tasks);

    } catch (err) {
      return send(res, 500, 'boo failll', {});
    }
  });





  router.post('/', async (req, res) => {
    try {
      const name = req.body.name;
      const deadline_ms = req.body.deadline;

      if (!name || deadline_ms === undefined) {
        return res.status(400).json({ message: "get good buddy", data: {} });
      }

      const deadline = new Date(Number(deadline_ms));
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ message: "bad request: invalid deadline", data: {} });
      }

      const description = req.body.description || '';
      const completed = String(req.body.completed).toLowerCase() === 'true';
      const assignedUser = req.body.assignedUser || '';
      const assignedUserName = req.body.assignedUserName || (assignedUser ? '' : 'unassigned');

      const payload = { name, description, deadline, completed, assignedUser, assignedUserName };

      const task = await Task.create(payload);
      return res.status(201).json({ message: "task created yay", data: task });

    } catch (err) {
      return res.status(400).json({ message: err.message || "bad request", data: {} });
    }
  });



  router.get('/:id', async (req, res) => {
    try {
      let query = Task.findById(req.params.id);

      if (req.query.select) {
        try {
          const selectObj = JSON.parse(req.query.select);
          query = query.select(selectObj);
        } catch {
          return res.status(400).json({ message: "bad request select", data: {} });
        }
      }

      const task = await query.exec();
      if (!task) {
        return res.status(404).json({ message: 'task dne', data: {} });
      }
      return res.status(200).json({ message: 'OK', data: task });

    } catch (err) {
      return res.status(500).json({ message: 'boooo failure', data: {} });
    }
  });



  router.put('/:id', async (req, res) => {
    try {
      const existing = await Task.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'task dne', data: {} });
      }

      const name = req.body.name;
      const deadline_ms = req.body.deadline;

      if (!name || deadline_ms === undefined) {
        return res.status(400).json({ message: "booo failure", data: {} });
        }

      const deadline = new Date(Number(deadline_ms));
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ message: "fix deadline homie", data: {} });
      }

      const description = req.body.description || '';
      const completed = String(req.body.completed).toLowerCase() === 'true';
      const assignedUser = req.body.assignedUser || '';
      const assignedUserName = req.body.assignedUserName || (assignedUser ? '' : 'unassigned');

      const replacement = {
        _id: req.params.id,
        name,
        description,
        deadline,
        completed,
        assignedUser,
        assignedUserName,
        dateCreated: existing.dateCreated,
      };

      await Task.replaceOne({ _id: req.params.id }, replacement, { runValidators: true });

      const updated = await Task.findById(req.params.id);
      return res.status(200).json({ message: "task updated yay", data: updated });

    } catch (err) {
      return res.status(400).json({ message: err.message || "bad request", data: {} });
    }
  });



  router.delete('/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'task dne', data: {} });
      }

      await task.deleteOne();
      return res.status(204).json({ message: 'deleteeeed', data: {} });

    } catch (err) {
      return res.status(500).json({ message: 'booo failure', data: {} });
    }
  });

  return router;
};
