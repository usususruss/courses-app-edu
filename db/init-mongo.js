// For local development. Creating tech user for app connection.

db.createUser({
    user: 'user',
    pwd: 'user',
    roles: [
        {
            role: 'readWrite',
            db: 'courses-db'
        }
    ]
})
