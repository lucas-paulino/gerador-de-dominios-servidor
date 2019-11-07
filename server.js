const {ApolloServer} = require('apollo-server');
const dns = require('dns');

const typeDefs=`
    type Item {
        id: Int
        tipo: String
        descricao: String
    }

    type Dominio {
        nome: String
        checkout: String
        disponivel: Boolean
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
        gerarDominios: [Dominio]
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

const dominioEstaDisponivel = function (url){
    return new Promise(function(resolve,reject){
        dns.resolve(url, function (error){
            if(error){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    })
}

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
        },
        async gerarDominios(){
            const dominios = [];
			for(const prefixo of itens.filter(item => item.tipo === "prefixo")){
				for(const sufixo of itens.filter(item => item.tipo === "sufixo")){
					const nome = prefixo.descricao+sufixo.descricao;
					const link = nome.toLowerCase();
                    const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${link}&tld=.com.br`;
                    const disponivel = await dominioEstaDisponivel(`${link}.com.br`);
                    dominios.push({nome, checkout, disponivel});
				}
            }
            return dominios;
        }
    }
};

const server = new ApolloServer({typeDefs,resolvers});
server.listen();
console.log(ApolloServer);