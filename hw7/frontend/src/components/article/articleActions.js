import Action, { resource } from '../../actions'

export function fetchArticles() {
    return (dispatch, getState) => {
        resource('GET', 'articles')
        .then((response) => {
            dispatch({ type:Action.UPDATE_ARTICLES, articles: response.articles})

            const articleAvatars = getState().articles.avatars
            const authors = new Set(response.articles.reduce((o, article) => {
                article.comments.map((c) => c.author).forEach((author) => o.push(author))
                return o
            }, []).filter((author) => !articleAvatars[author]))
            if (authors.size > 0) {
                resource('GET', `avatars/${[...authors].join(',')}`)
                .then((response) => {
                    response.avatars.forEach((s) => {
                        articleAvatars[s.username] = s.avatar
                    })
                    dispatch({ type: Action.UPDATE_AVATARS, avatars: articleAvatars })
                })
            }
        })
    }
}

export function uploadArticle(message, file) {
    return (dispatch) => {
        // since we are upload form data, set false for flag indicating no JASON type
        const fd = new FormData()
        fd.append('text', message)
        fd.append('image', file)
        resource('POST', 'article', fd, false).then((response) => {
            const newArticle = response.articles[0]
            dispatch({type: Action.ADD_ARTICLE, newArticle:newArticle})
        })
    }
    
}

export function uploadTextOnlyArticle(message) {
    return (dispatch) => {
        // since we are upload form data, set false for flag indicating no JASON type
        resource('POST', 'article', {text: message}).then((response) => {
            const newArticle = response.articles[0]
            dispatch({type: Action.ADD_ARTICLE, newArticle:newArticle})
        })
    }
    
}

export function updateArticle(message, id){
    return (dispatch) => {
        resource('PUT', 'articles/'+id, {text: message}).then((response) => {
            const updatedArticle = response.articles[0]
            dispatch({type: Action.UPDATE_SINGLE_ARTICLE, article: updatedArticle})
        })
    }
}

export function addComment(message, id){
    return (dispatch) => {
        resource('PUT', 'articles/'+id, {text: message, commentId: -1}).then((response) => {
            const updatedArticle = response.articles[0]
            dispatch({type: Action.UPDATE_SINGLE_ARTICLE, article: updatedArticle})
        })
    }
}

export function updateComment(message, artId, cmtId){
    return (dispatch) => {
        resource('PUT', 'articles/'+artId, {text: message, commentId: cmtId}).then((response) => {
            const updatedArticle = response.articles[0]
            dispatch({type: Action.UPDATE_SINGLE_ARTICLE, article: updatedArticle})
        })
    }
}

export function searchKeyword(keyword) {
    return { type: Action.SEARCH_KEYWORD, keyword }
}



/** WEBPACK FOOTER **
 ** ./src/components/article/articleActions.js
 **/