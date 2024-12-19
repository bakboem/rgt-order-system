//routes
export const login_route_name_for_user = '/loginUser';
export const login_route_name_for_biz = '/loginBiz';
export const home_route_name_for_biz = '/homeBiz';
export const home_route_name_for_user = '/homeUser';
export const splashPage = '/';
export const entryPage = '/entry';

export const isDevMode = process.env.NODE_ENV === 'development';
export const isProdMode = process.env.NODE_ENV === 'production';

// events
export const token_expired_event_name = 'tokenExpired';

// Source
