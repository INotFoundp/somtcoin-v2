const getTelegramParams = (url: string) => {


    const paramsString = url.split('#tgWebAppData=')[1]?.split('&')[0];
    const fullUrl = new URL(url).searchParams

    const ref = fullUrl.get("tgWebAppStartParam")


    const params = new URLSearchParams(decodeURIComponent(paramsString));


    const user = JSON?.parse?.(decodeURIComponent(params?.get?.('user') ?? ""));
    const chat_instance = params.get('chat_instance');
    const chat_type = params.get('chat_type');
    const auth_date = params.get('auth_date');
    const hash = params.get('hash');

    const data = {user, chat_instance, chat_type, auth_date, hash, ref};

    return data
}

export default getTelegramParams