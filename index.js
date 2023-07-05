import jsonServer from 'json-server'
import queryString from 'query-string'
import { v4 as uuid } from 'uuid'
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
	res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
	switch (req.method) {
		case 'POST':
			req.body.id = uuid()
			req.body.createdAt = Date.now()
			req.body.updatedAt = Date.now()
			break
		case 'PUT':
		case 'PATCH':
			req.body.updatedAt = Date.now()
			break
	}
	// Continue to JSON Server router
	next()
})

router.render = (req, res) => {
	const headers = res.getHeaders()
	if (req.method === 'GET' && headers['x-total-count']) {
		const { query } = req._parsedUrl
		const pagination = queryString.parse(query, {
			parseNumbers: true,
		})
		const _totalRows = Number.parseInt(headers['x-total-count'])

		return res.jsonp({
			data: res.locals.data,
			pagination: {
				_page: pagination._page,
				_limit: pagination._limit || 10,
				_totalRows,
			},
		})
	}
	res.jsonp(res.locals.data)
}

// Use default router
const port = process.env.PORT || 4000
server.use('/api', router)
server.listen(port, () => {
	console.log('JSON Server is running')
})
