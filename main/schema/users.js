const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql');
const User = require('./../models/user');
const Image = require('./../models/image');

const FollowType = new GraphQLObjectType({
    name: 'Follow',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: (user) => user._id,
        },
        nick_name: {
            type: GraphQLString,
            resolve: (user) => user.nick_name
        },
        avatar: {
            type: GraphQLString,
            resolve: (user) => user.avatar
        },
    })
});

const ImageType = new GraphQLObjectType({
    name: 'Image',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: (image) => image._id
        },
        url: {
            type: GraphQLString,
            resolve: (image) => image.url
        },
        date: {
            type: GraphQLString,
            resolve: (image) => image.date
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: (user) => user._id,
        },
        name: {
            type: GraphQLString,
            resolve: (user) => user.name
        },
        nick_name: {
            type: GraphQLString,
            resolve: (user) => user.nick_name
        },
        email: {
            type: GraphQLString,
            resolve:(user) => user.email
        },
        avatar: {
            type: GraphQLString,
            resolve: (user) => user.avatar
        },
        followers: {
            type: new GraphQLList(FollowType),
            resolve: (user) =>
                User.find({ _id: {
                    $in: user.followers
                }})
        },
        following: {
            type: new GraphQLList(FollowType),
            resolve: (user) =>
                User.find({ _id: {
                    $in: user.following
                }})
        },
        images: {
            type: new GraphQLList(ImageType),
            resolve: (user) =>
                Image.find({ user_id: user._id })
        }
    })
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields:() => ({
            user: {
                type: UserType,
                args: {
                    id: { type: GraphQLString }
                },
                resolve: (root, args ) =>
                    User.findOne({ _id: args.id })
            }
        })
    })
});
