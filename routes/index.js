import UserRouter from './UserRouter.js';
import RefreshTokenRouter from './RefreshTokenRouter.js';
import ConversationRouter from './ConversationRouter.js';
// import MessageRouter from './MessageRouter.js';
import NotificationRouter from './NotificationRouter.js';
import PostRouter from './PostRouter.js';
import CommentRouter from './CommentRoute.js';
import HobbyRouter from './HobbyRoute.js';
import StoryRouter from './StoryRouter.js';

const routes = (app) => {
    // app.use('/api/v1/user', UserRouter)
    app.use('/api/v1/user-token', RefreshTokenRouter)
    app.use('/api/v1/conversation', ConversationRouter)
    // app.use('/api/v1/message', MessageRouter)
    app.use('/api/v1/notification', NotificationRouter)
    app.use('/api/v1/post', PostRouter)
    app.use('/api/v1/comment', CommentRouter)
    app.use('/api/v1/user', HobbyRouter)
    app.use('/api/v1/story', StoryRouter)
}

export default routes;