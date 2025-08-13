# Serverless v4 + Express (One Lambda per Resource)

## Quick start
```bash
npm i
serverless offline
# try:
# curl http://localhost:3000/users
# curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"email":"a@b.com","name":"Alice"}'
```

Each resource has its own Express app & Lambda handler: `users`, `connections`, `data-tables`, `transformations`, `pipelines`.

