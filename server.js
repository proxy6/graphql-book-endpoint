const express = require("express");
const {graphqlHTTP} = require("express-graphql")
const schema = require("./controller/schema")
const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

const port = 4100 || process.env.PORT
app.listen(port, ()=>{
    console.log('listening on port ' + 5100)
})