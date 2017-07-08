import ClientOAuth2 from 'client-oauth2';
import config from 'config';

const globusAuth = new ClientOAuth2(config.get('auth.globus'));

export default {
    redirectUri,
    handleAuthCallback
};

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