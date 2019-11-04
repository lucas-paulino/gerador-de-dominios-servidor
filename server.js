const {ApolloServer} = require('apollo-server');

const typeDefs=`

    type Item {
        id: Int
        tipo: String
        descricao: String
    }

    type Query {
        itens(tipo:String): [Item]
    }

    input ItemInput{
        tipo: String
        descricao: String
    }

    type Mutation {
        saveItem(item: ItemInput): Item
        deleteItem(id: Int): Boolean
    }

`
const itens = [
    { id: 1, tipo: "prefixo", descricao: "Air"},
    { id: 2, tipo: "prefixo", descricao: "Jet"},
    { id: 3, tipo: "prefixo", descricao: "Flight"},
    { id: 4, tipo: "sufixo", descricao: "Hub"},
    { id: 5, tipo: "sufixo", descricao: "Station"},
    { id: 6, tipo: "sufixo", descricao: "Mart"}
]

const resolvers = {
    Query: {
        itens(_, args){ 
            return itens.filter(item => item.tipo === args.tipo) 
        }
    },
    Mutation: {
        saveItem(_, args){
            const item = args.item;
            item.id = itens.length + 1;
            itens.push(item);
            return item;
        },
        deleteItem(_, args){
            const id = args.id;
            const item = itens.find(item => item.id === id);
            
            if (!item) 
                return false
            
            itens.splice(itens.indexOf(item), 1);
            return true
        }
    }
};

const server = new ApolloServer({typeDefs,resolvers});
server.listen();
console.log(ApolloServer);