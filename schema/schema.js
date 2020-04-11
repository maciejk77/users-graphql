const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const _ = require('lodash');

const users = [
  { id: '23', firstName: 'Tomasz', age: 35 },
  { id: '44', firstName: 'Maciej', age: 43 },
  { id: '67', firstName: 'Marta', age: 30 }
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
