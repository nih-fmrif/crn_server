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

function handleAuthCallback(req, res) {
    console.log(req.originalUrl);
    globusAuth.code.getToken(req.originalUrl)
        .then((user) => {
            console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }

            // Refresh the current users access token.
            user.refresh().then((updatedUser) => {
                console.log(updatedUser !== user); //=> true
                console.log(updatedUser.accessToken);
            });

            // Sign API requests on behalf of the current user.
            user.sign({
                method: 'get',
                url: 'http://example.com'
            });

            // We should store the token into a database.
            return res.send(user.accessToken);
        }).catch(err => {
            console.log(err);
        });
}