import { gql } from '@apollo/client';

export const typeDefs = gql`
  enum Permission {
    ADMIN
    USER
    ITEMCREATE
    ITEMUPDATE
    ITEMDELETE
    PREMISSIONUPDATE
  }

  scalar DateTime

  # An object with an ID
  interface Node {
    # The id of the object.
    id: ID!
  }

  type User implements Node {
    id: ID!
    name: String!
    email: String!
    permissions: [Permission!]!
    resetToken: String
    resetTokenExpiry: Float
    # cart: [CartItem!]!
    # orders: [OrderItem]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Item implements Node {
    id: ID!
    title: String!
    description: String!
    image: String
    largeImage: String
    price: Int!
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem implements Node {
    id: ID!
    title: String!
    description: String!
    image: String!
    largeImage: String!
    price: Int!
    quantity: Int!
    user: User
  }

  type CartItem implements Node {
    id: ID!
    quantity: Int!
    item: Item
    user: User!
  }

  # Information about pagination in a connection.
  type PageInfo {
    # When paginating forwards, are there more items?
    hasNextPage: Boolean!

    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean!

    # When paginating backwards, the cursor to continue.
    startCursor: String

    # When paginating forwards, the cursor to continue.
    endCursor: String
  }

  type AggregateItem {
    count: Int!
  }

  # A connection to a list of items.
  type ItemConnection {
    # Information to aid in pagination.
    pageInfo: PageInfo!

    # A list of edges.
    edges: [ItemEdge]!
    aggregate: AggregateItem!
  }

  # An edge in a connection.
  type ItemEdge {
    # The item at the end of the edge.
    node: Item!

    # A cursor for use in pagination.
    cursor: String!
  }

  enum ItemOrderByInput {
    id_ASC
    id_DESC
    title_ASC
    title_DESC
    description_ASC
    description_DESC
    image_ASC
    image_DESC
    largeImage_ASC
    largeImage_DESC
    price_ASC
    price_DESC
    createdAt_ASC
    createdAt_DESC
    updatedAt_ASC
    updatedAt_DESC
  }

  input StringFilter {
    equals: String
    not: StringFilter
    in: String
    notIn: String
    lt: String
    lte: String
    gt: String
    gte: String
    contains: String
    startsWith: String
    endsWith: String
    mode: String
  }

  input FloatFilter {
    equals: Float
    not: FloatFilter
    in: Float
    notIn: Float
    lt: Float
    lte: Float
    gt: Float
    gte: Float
    contains: Float
    startsWith: Float
    endsWith: Float
    mode: Float
  }

  input UserWhereInput {
    # Logical AND on all given filters.
    AND: [UserWhereInput!]

    # Logical OR on all given filters.
    OR: [UserWhereInput!]

    # Logical NOT on all given filters combined by AND.
    NOT: [UserWhereInput!]

    #
    id: ID

    # All values that are not equal to given value.
    id_not: ID

    # All values that are contained in given list.
    id_in: [ID!]

    # All values that are not contained in given list.
    id_not_in: [ID!]

    # All values less than the given value.
    id_lt: ID

    # All values less than or equal the given value.
    id_lte: ID

    # All values greater than the given value.
    id_gt: ID

    # All values greater than or equal the given value.
    id_gte: ID

    # All values containing the given string.
    id_contains: ID

    # All values not containing the given string.
    id_not_contains: ID

    # All values starting with the given string.
    id_starts_with: ID

    # All values not starting with the given string.
    id_not_starts_with: ID

    # All values ending with the given string.
    id_ends_with: ID

    # All values not ending with the given string.
    id_not_ends_with: ID

    #
    name: String

    # All values that are not equal to given value.
    name_not: String

    # All values that are contained in given list.
    name_in: [String!]

    # All values that are not contained in given list.
    name_not_in: [String!]

    # All values less than the given value.
    name_lt: String

    # All values less than or equal the given value.
    name_lte: String

    # All values greater than the given value.
    name_gt: String

    # All values greater than or equal the given value.
    name_gte: String

    # All values containing the given string.
    name_contains: String

    # All values not containing the given string.
    name_not_contains: String

    # All values starting with the given string.
    name_starts_with: String

    # All values not starting with the given string.
    name_not_starts_with: String

    # All values ending with the given string.
    name_ends_with: String

    # All values not ending with the given string.
    name_not_ends_with: String

    #
    email: String

    # All values that are not equal to given value.
    email_not: String

    # All values that are contained in given list.
    email_in: [String!]

    # All values that are not contained in given list.
    email_not_in: [String!]

    # All values less than the given value.
    email_lt: String

    # All values less than or equal the given value.
    email_lte: String

    # All values greater than the given value.
    email_gt: String

    # All values greater than or equal the given value.
    email_gte: String

    # All values containing the given string.
    email_contains: String

    # All values not containing the given string.
    email_not_contains: String

    # All values starting with the given string.
    email_starts_with: String

    # All values not starting with the given string.
    email_not_starts_with: String

    # All values ending with the given string.
    email_ends_with: String

    # All values not ending with the given string.
    email_not_ends_with: String

    #
    password: String

    # All values that are not equal to given value.
    password_not: String

    # All values that are contained in given list.
    password_in: [String!]

    # All values that are not contained in given list.
    password_not_in: [String!]

    # All values less than the given value.
    password_lt: String

    # All values less than or equal the given value.
    password_lte: String

    # All values greater than the given value.
    password_gt: String

    # All values greater than or equal the given value.
    password_gte: String

    # All values containing the given string.
    password_contains: String

    # All values not containing the given string.
    password_not_contains: String

    # All values starting with the given string.
    password_starts_with: String

    # All values not starting with the given string.
    password_not_starts_with: String

    # All values ending with the given string.
    password_ends_with: String

    # All values not ending with the given string.
    password_not_ends_with: String

    #
    resetToken: StringFilter

    # All values that are not equal to given value.
    resetToken_not: String

    # All values that are contained in given list.
    resetToken_in: [String!]

    # All values that are not contained in given list.
    resetToken_not_in: [String!]

    # All values less than the given value.
    resetToken_lt: String

    # All values less than or equal the given value.
    resetToken_lte: String

    # All values greater than the given value.
    resetToken_gt: String

    # All values greater than or equal the given value.
    resetToken_gte: String

    # All values containing the given string.
    resetToken_contains: String

    # All values not containing the given string.
    resetToken_not_contains: String

    # All values starting with the given string.
    resetToken_starts_with: String

    # All values not starting with the given string.
    resetToken_not_starts_with: String

    # All values ending with the given string.
    resetToken_ends_with: String

    # All values not ending with the given string.
    resetToken_not_ends_with: String

    #
    resetTokenExpiry: FloatFilter

    # All values that are not equal to given value.
    resetTokenExpiry_not: Float

    # All values that are contained in given list.
    resetTokenExpiry_in: [Float!]

    # All values that are not contained in given list.
    resetTokenExpiry_not_in: [Float!]

    # All values less than the given value.
    resetTokenExpiry_lt: Float

    # All values less than or equal the given value.
    resetTokenExpiry_lte: Float

    # All values greater than the given value.
    resetTokenExpiry_gt: Float

    # All values greater than or equal the given value.
    resetTokenExpiry_gte: Float

    #
    createdAt: DateTime

    # All values that are not equal to given value.
    createdAt_not: DateTime

    # All values that are contained in given list.
    createdAt_in: [DateTime!]

    # All values that are not contained in given list.
    createdAt_not_in: [DateTime!]

    # All values less than the given value.
    createdAt_lt: DateTime

    # All values less than or equal the given value.
    createdAt_lte: DateTime

    # All values greater than the given value.
    createdAt_gt: DateTime

    # All values greater than or equal the given value.
    createdAt_gte: DateTime

    #
    updatedAt: DateTime

    # All values that are not equal to given value.
    updatedAt_not: DateTime

    # All values that are contained in given list.
    updatedAt_in: [DateTime!]

    # All values that are not contained in given list.
    updatedAt_not_in: [DateTime!]

    # All values less than the given value.
    updatedAt_lt: DateTime

    # All values less than or equal the given value.
    updatedAt_lte: DateTime

    # All values greater than the given value.
    updatedAt_gt: DateTime

    # All values greater than or equal the given value.
    updatedAt_gte: DateTime
    # cart_every: CartItemWhereInput
    # cart_some: CartItemWhereInput
    # cart_none: CartItemWhereInput
  }

  input ItemWhereInput {
    # Logical AND on all given filters.
    AND: [ItemWhereInput!]

    # Logical OR on all given filters.
    OR: [ItemWhereInput!]

    # Logical NOT on all given filters combined by AND.
    NOT: [ItemWhereInput!]

    #
    id: ID

    # All values that are not equal to given value.
    id_not: ID

    # All values that are contained in given list.
    id_in: [ID!]

    # All values that are not contained in given list.
    id_not_in: [ID!]

    # All values less than the given value.
    id_lt: ID

    # All values less than or equal the given value.
    id_lte: ID

    # All values greater than the given value.
    id_gt: ID

    # All values greater than or equal the given value.
    id_gte: ID

    # All values containing the given string.
    id_contains: ID

    # All values not containing the given string.
    id_not_contains: ID

    # All values starting with the given string.
    id_starts_with: ID

    # All values not starting with the given string.
    id_not_starts_with: ID

    # All values ending with the given string.
    id_ends_with: ID

    # All values not ending with the given string.
    id_not_ends_with: ID

    #
    title: String

    # All values that are not equal to given value.
    title_not: String

    # All values that are contained in given list.
    title_in: [String!]

    # All values that are not contained in given list.
    title_not_in: [String!]

    # All values less than the given value.
    title_lt: String

    # All values less than or equal the given value.
    title_lte: String

    # All values greater than the given value.
    title_gt: String

    # All values greater than or equal the given value.
    title_gte: String

    # All values containing the given string.
    title_contains: String

    # All values not containing the given string.
    title_not_contains: String

    # All values starting with the given string.
    title_starts_with: String

    # All values not starting with the given string.
    title_not_starts_with: String

    # All values ending with the given string.
    title_ends_with: String

    # All values not ending with the given string.
    title_not_ends_with: String

    #
    description: String

    # All values that are not equal to given value.
    description_not: String

    # All values that are contained in given list.
    description_in: [String!]

    # All values that are not contained in given list.
    description_not_in: [String!]

    # All values less than the given value.
    description_lt: String

    # All values less than or equal the given value.
    description_lte: String

    # All values greater than the given value.
    description_gt: String

    # All values greater than or equal the given value.
    description_gte: String

    # All values containing the given string.
    description_contains: String

    # All values not containing the given string.
    description_not_contains: String

    # All values starting with the given string.
    description_starts_with: String

    # All values not starting with the given string.
    description_not_starts_with: String

    # All values ending with the given string.
    description_ends_with: String

    # All values not ending with the given string.
    description_not_ends_with: String

    #
    image: String

    # All values that are not equal to given value.
    image_not: String

    # All values that are contained in given list.
    image_in: [String!]

    # All values that are not contained in given list.
    image_not_in: [String!]

    # All values less than the given value.
    image_lt: String

    # All values less than or equal the given value.
    image_lte: String

    # All values greater than the given value.
    image_gt: String

    # All values greater than or equal the given value.
    image_gte: String

    # All values containing the given string.
    image_contains: String

    # All values not containing the given string.
    image_not_contains: String

    # All values starting with the given string.
    image_starts_with: String

    # All values not starting with the given string.
    image_not_starts_with: String

    # All values ending with the given string.
    image_ends_with: String

    # All values not ending with the given string.
    image_not_ends_with: String

    #
    largeImage: String

    # All values that are not equal to given value.
    largeImage_not: String

    # All values that are contained in given list.
    largeImage_in: [String!]

    # All values that are not contained in given list.
    largeImage_not_in: [String!]

    # All values less than the given value.
    largeImage_lt: String

    # All values less than or equal the given value.
    largeImage_lte: String

    # All values greater than the given value.
    largeImage_gt: String

    # All values greater than or equal the given value.
    largeImage_gte: String

    # All values containing the given string.
    largeImage_contains: String

    # All values not containing the given string.
    largeImage_not_contains: String

    # All values starting with the given string.
    largeImage_starts_with: String

    # All values not starting with the given string.
    largeImage_not_starts_with: String

    # All values ending with the given string.
    largeImage_ends_with: String

    # All values not ending with the given string.
    largeImage_not_ends_with: String

    #
    price: Int

    # All values that are not equal to given value.
    price_not: Int

    # All values that are contained in given list.
    price_in: [Int!]

    # All values that are not contained in given list.
    price_not_in: [Int!]

    # All values less than the given value.
    price_lt: Int

    # All values less than or equal the given value.
    price_lte: Int

    # All values greater than the given value.
    price_gt: Int

    # All values greater than or equal the given value.
    price_gte: Int

    #
    createdAt: DateTime

    # All values that are not equal to given value.
    createdAt_not: DateTime

    # All values that are contained in given list.
    createdAt_in: [DateTime!]

    # All values that are not contained in given list.
    createdAt_not_in: [DateTime!]

    # All values less than the given value.
    createdAt_lt: DateTime

    # All values less than or equal the given value.
    createdAt_lte: DateTime

    # All values greater than the given value.
    createdAt_gt: DateTime

    # All values greater than or equal the given value.
    createdAt_gte: DateTime

    #
    updatedAt: DateTime

    # All values that are not equal to given value.
    updatedAt_not: DateTime

    # All values that are contained in given list.
    updatedAt_in: [DateTime!]

    # All values that are not contained in given list.
    updatedAt_not_in: [DateTime!]

    # All values less than the given value.
    updatedAt_lt: DateTime

    # All values less than or equal the given value.
    updatedAt_lte: DateTime

    # All values greater than the given value.
    updatedAt_gt: DateTime

    # All values greater than or equal the given value.
    updatedAt_gte: DateTime
    user: UserWhereInput
  }

  type SuccesMessage {
    message: String
  }

  type Mutation {
    # createItem(
    #   title: String
    #   description: String
    #   price: Int
    #   image: String
    #   largeImage: String
    # ): Item!
    # updateItem(id: ID!, title: String, description: String, price: Int): Item!
    # deleteItem(id: ID!): Item
    signup(email: String!, password: String!, name: String!): User!
    signin(email: String!, password: String!): User!
    signout: SuccesMessage!
    requestReset(email: String!): SuccesMessage
    resetPassword(
      resetToken: String!
      password: String!
      confirmPassword: String!
    ): SuccesMessage!
    # updateUser(id: String!, name: String!): User!
    # updatePermissions(permissions: [Permission], userId: ID!): User
    # addToCart(id: ID!): CartItem
    # removeFromCart(id: ID!): CartItem
    # createOrder(token: String!): Order!
  }

  type Query {
    items(
      where: ItemWhereInput
      orderBy: ItemOrderByInput
      skip: Int
      first: Int
    ): [Item]!
    #item(where: ItemWhereUniqueInput!): Item
    itemsConnection(where: ItemWhereInput): ItemConnection
    me: User
    users: [User]!
    #order(id: ID!): Order
    #orders(orderBy: OrderOrderByInput): [Order]!
  }
`;
