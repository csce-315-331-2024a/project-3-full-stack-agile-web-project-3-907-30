import { google } from "googleapis";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../lib/session";

export default withIronSessionApiRoute(GoogleAuth, ironOptions);

/**
 * The Google authentication function for OAuth2
 *
 * @param {any} req The request object
 * @param {any} res The response object
 */
async function GoogleAuth(req: any, res: any) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  res.status(301).json({ Location: authorizationUrl });
  res.end();
}
