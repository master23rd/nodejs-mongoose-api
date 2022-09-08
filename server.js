const http = require('http')

const todos = [
  { id: 1, text: 'todo 1' },
  { id: 2, text: 'todo 2' },
  { id: 3, text: 'todo 3' },
]

const server = http.createServer((req, res, next) => {
  // res.setHeader('Content-Type', 'application/json')
  // res.setHeader('X-Powered-By', 'nodejs')
  //   res.write('hello')
  //   res.end()

  const { method, url } = req
  //read header content
  console.log(req.headers.authorization)

  //body parser default nodejs
  //init request
  let body = []
  req
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      console.log(body)
      let status = 404
      const response = {
        success: false,
        data: null,
        error: null,
      }

      if (method === 'GET' && url === '/todos') {
        status = 200
        response.success = true
        response.data = todos
      } else if (method === 'POST' && url === '/todos') {
        const { id, text } = JSON.parse(body)

        if (!id || !text) {
          status = 400
          response.error = 'please add text'
        } else {
          todos.push({ id, text })
          status = 201
          response.success = true
          response.data = todos
        }
      }

      //alternative to write header
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-by': 'nodejs',
      })

      //response end
      res.end(
        JSON.stringify({
          response,
          //true
          // success: true,
          // data: todos,

          //false used to be
          // success: false,
          // error: 'Not Found',
          // data: null,
        })
      )
    })
})

//create port
const PORT = 5000
//make server run
server.listen(PORT, () => console.log(`server running on port ${PORT}`))
