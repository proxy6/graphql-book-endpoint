const {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQlNonNull,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

const books = require("../model/books");
const authors = require("../model/books")

//Book Schema
const BookType = new GraphQLObjectType({
    name: "Book",
    description: "Book Type",
    fields:()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name:{type: GraphQLNonNull(GraphQLString)},
        authorId:{type: GraphQLNonNull(GraphQLInt)},
        author:{
            type: AuthorType,
            resolve:(book)=>{
                return authors.find(author=>author.id === book.authorId )
            }
        }
    })
})

//Author Schema
const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Author Type",
    fields:()=>({
        id:{type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books:{
            type: new GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(book=> author.id === book.authorId)
            }
        }
    })
})

// Root Query
const RootQueryType = new GraphQLObjectType({
    name: "RootQuery",
    decription: "Root Query Type",
    fields:()=>({
        books:{
            type: new GraphQLList(BookType),
            description: "All Books",
            resolve:()=> books
            
        },
        book:{
            type: BookType,
            description: "A Single Book",
            args:{
                id:{type: GraphQLInt}
            },
            resolve:(parent, args)=>{
                return books.find(book=> book.id === args.id)
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            description: "All Authors",
            resolve:()=> authors
        },
        author:{
            type: AuthorType,
            description: "A Single Author",
            args:{
                id:{type: GraphQLInt}
            },
            resolve:(parent, args)=>{
                return authors.find(author=> author.id === args.id)
            }
        }
    })
})

// Root Mutation
const RootMutationType = new GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation Type",
    fields:()=>({
        addBook:{
            type: BookType,
            description: "Add a Book",
            args:{
                name:{type: GraphQLNonNull(GraphQLString)},
                authorId:{type: GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent, args)=>{
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book);
                return book
            }
        },
        addAuthor:{
            type: AuthorType,
            description: "Add an Author",
            args:{
                name:{type: GraphQLNonNull(GraphQLString)}
            },
            resolve:(parent, args)=>{
                const author = {
                    id: authors.length + 1,
                    name: args.name
                }
                authors.push(author)
                return author
            }
        }
    })
})

// Export QUery as GraphQL Schema
module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})