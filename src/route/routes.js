const routes = [
    {
        exact:true,
        redirect:'manageUsers',
        path: '/',
        key: 'manageUsers'
    },
    {
        path: '/manageUsers/',
        key: 'manageUsers'
    },
    {
        path: '/tinymce/',
        key: 'tinymce'
    },
    /*{
        path: '/comments/',
        key: 'comments'
    },
    {
        path: '/promotion/',
        key: 'promotion'
    },
    {
        path: '/category/',
        key: 'category'
    },
    {
        path: '/ordergroup/',
        key: 'ordergroup'
    },
    {
        path: '/promotionRecord/',
        key: 'promotionRecord'
    },
    {
        path: '/orderRecord/',
        key: 'orderRecord'
    }*//*,
    {
        path: '/other/',
        key: other,
        routes: [/!*子路由*!/
            {
                exact:true,
                redirect:'other/all',
                path: '/other/'
            },
            {
                path: '/other/all/',
                key: 'AllOrders',
            },
        ]
    }*/
]
export default routes;

