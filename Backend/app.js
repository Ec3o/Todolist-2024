// 1. 使用Express开发一个HTTP服务器，实现5个API：获取todo列表、获取单个todo详情、新增单个todo、删除单个todo、更新单个todo
// 2. 所有接口使用MySQL或者MongoDB实现数据持久化（使用node-mysql或node-mongo连接数据库）
// 3. Postman中添加上述5个API的测试，并添加到一个Collection中

const express = require('express')
const mysql = require('mysql')
const cors = require('cors');

const dbconnect = mysql.createPool({
  connectionLimit: 10,  
  host: 'db',
  port: 3306,
  user: 'todolist',
  password: 'todolist-2024',
  database: 'todolist'
});

const app = express()

app.use(express.json())

app.use(cors());

app.get('/api/ping', (req, res) => {
  res.status(200).json({"message":"pong!"});
})

app.get('/api/todos', (req, res) => {
  const { page = 1, size = 10 } = req.query
  const offset = (page - 1) * size
  const sql = 'SELECT * FROM todos LIMIT ?, ?'
  
  dbconnect.query(sql, [offset, parseInt(size)], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }
    res.json(result)
  })
})

// 获取单个todo详情
app.get('/api/todos/:id', (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ msg: "Invalid parameters" })
  }

  const sql = 'SELECT * FROM todos WHERE id = ?'
  dbconnect.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }

    if (result.length <= 0) {
      return res.status(404).json({ msg: "Todo not found" })
    }

    res.json(result[0])
  })
})

// 新增单个todo
app.post('/api/todos', (req, res) => {
  const { description, status ,aborted } = req.body;
  if (description === undefined || status === undefined || aborted === undefined ||
    !['pending', 'completed', 'in-progress'].includes(status)) {
  return res.status(400).json({ msg: "Invalid parameters" });
}

  const sql = 'INSERT INTO todos (description, status,aborted) VALUES (?, ? ,?)'
  dbconnect.query(sql, [description, status , aborted], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }
    res.status(201).json({ id: result.insertId })
  })
})

// 更新单个todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { description, status, aborted } = req.body;

  // 检查 id 是否有效
  if (!id) {
    return res.status(400).json({ msg: "Invalid ID" });
  }

  // 准备更新的 SQL 语句和参数
  let sql = 'UPDATE todos SET ';
  let args = [];

  // 动态构建更新的 SQL 语句
  if (description !== undefined) {
    sql += 'description = ?, ';
    args.push(description);
  }

  if (status !== undefined && ['pending', 'completed', 'in-progress'].includes(status)) {
    sql += 'status = ?, ';
    args.push(status);
  }

  if (aborted !== undefined) {
    sql += 'aborted = ?, ';
    args.push(aborted);
  }

  // 如果没有任何参数需要更新，返回错误
  if (args.length === 0) {
    return res.status(400).json({ msg: "No valid parameters provided for update" });
  }

  // 移除最后一个多余的逗号和空格
  sql = sql.slice(0, -2);
  sql += ' WHERE id = ?';
  args.push(id);

  // 执行 SQL 查询
  dbconnect.query(sql, args, (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json({ msg: "Todo updated successfully" });
  });
});


// 删除单个todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params
  if (id === undefined) {
  return res.status(400).json({ msg: "Invalid parameters" });
}

  const sql = 'DELETE FROM todos WHERE id = ?'
  dbconnect.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Todo not found" })
    }

    res.status(204).json({ msg: "Todo deleted successfully" })
  })
})

const server = app.listen(3000, '0.0.0.0', () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Running server at http://${host}:${port}`)
})