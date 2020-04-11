const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return axios
          .get(`${BASE_URL}/companies/${parent.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parent, args) {
        return axios
          .get(`${BASE_URL}/company/${parent.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios.get(`${BASE_URL}/users/${args.id}`).then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(`${BASE_URL}/company/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parent, { firstName, age }) {
        return axios
          .post(`${BASE_URL}/users`, { firstName, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, { id }) {
        axios.delete(`${BASE_URL}/users/${id}`).then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        id: { type: new GraphQLNonNull(GraphQLString) },
        companyId: { type: GraphQLString }
      },
      resolve(parent, { id, firstName, age, companyId }) {
        return axios
          .patch(`${BASE_URL}/users/${id}`, { firstName, age, companyId })
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
