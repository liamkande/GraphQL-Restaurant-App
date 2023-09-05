var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home-cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with a great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

var schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  }
  
  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }
  
  type Dish {
    name: String
    price: Int
  }
  
  input RestaurantInput {
    name: String
    description: String
  }
  
  type DeleteResponse {
    ok: Boolean!
  }
  
  type Mutation {
    setrestaurant(input: RestaurantInput): Restaurant
    deleterestaurant(id: Int!): DeleteResponse
    editrestaurant(id: Int!, input: RestaurantInput): Restaurant
  }
`);

// The root provides resolver functions for each API endpoint
var root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    const newId = restaurants.length + 1;
    const newRestaurant = {
      id: newId,
      name: input.name,
      description: input.description,
      dishes: [], // You can add dishes if needed
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index !== -1) {
      restaurants.splice(index, 1);
      return { ok: true };
    }
    return { ok: false };
  },
  editrestaurant: ({ id, input }) => {
    const restaurantIndex = restaurants.findIndex(restaurant => restaurant.id === id);
    if (restaurantIndex !== -1) {
      restaurants[restaurantIndex] = {
        ...restaurants[restaurantIndex],
        ...input,
      };
      return restaurants[restaurantIndex];
    }
    throw new Error("Restaurant doesn't exist");
  },
};

var app = express();
app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    })
);

var port = 4000;
app.listen(port, () => console.log("Running GraphQL on Port:" + port));
