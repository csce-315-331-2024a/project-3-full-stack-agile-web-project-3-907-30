import { google } from "googleapis";
import { withIronSessionApiRoute } from "iron-session/next";
import { loginGoogleAccount } from "../../../dbService/account.db";
import { ironOptions } from "../../../lib/session";

export default withIronSessionApiRoute(GoogleCallback, ironOptions);

/**
 * The Google callback function for OAuth2
 *
 * @param {any} req The request object
 * @param {any} res The response object
 */
async function GoogleCallback(req: any, res: any) {
  const code = req.query.code;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  let { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const account = JSON.parse(
    Buffer.from(
      tokens.id_token!.split(".")[1].split(".")[0],
      "base64"
    ).toString("ascii")
  );

  try {
    await loginGoogleAccount(account);
  } catch (error) {
    console.error(error);
  }

  req.session.account = account;
  await req.session.save();

  res.writeHead(302, {
    Location: "/",
  });
  res.end();
}
