import ClientOAuth2 from 'client-oauth2';
import config from 'config';
import popsicle from 'popsicle';

const globusAuth = new ClientOAuth2(config.get('globus'));

export default {
    redirectUri,
    handleAuthCallback,
    refreshToken
};

async function refreshToken(req, res, next) {
    const {
        accessToken,
        refreshToken
    } = req.body;

    try {
        if (accessToken && refreshToken) {
            const authInstance = globusAuth.createToken(accessToken, refreshToken);
            const updatedUser = await authInstance.refresh();

            const {
                access_token,
                refresh_token,
                expires_in
            } = updatedUser.data;

            res.json({
                access_token,
                refresh_token,
                expires_in
            });

        } else {
            next(new Error('Access token or refresh token is missing'));
        }
    } catch (err) {
        next(err);
    }
}

function redirectUri(req, res) {
    const uri = globusAuth.code.getUri();
    res.redirect(uri);
}

async function handleAuthCallback(req, res, next) {
    try {
        const authInstance = await globusAuth.code.getToken(req.originalUrl);
        const updatedUser = await authInstance.refresh();

        const globusUser = await popsicle(updatedUser.sign({
            method: 'get',
            url: config.get('globus.userInfoUri')
        })).then(res => JSON.parse(res.body));

        res.redirect(`${config.get('url')}?globusOauth=${encodeURIComponent(JSON.stringify(updatedUser.data))}&globusUser=${encodeURIComponent(JSON.stringify(globusUser))}`);

    } catch (err) {
        next(err);
    }
}