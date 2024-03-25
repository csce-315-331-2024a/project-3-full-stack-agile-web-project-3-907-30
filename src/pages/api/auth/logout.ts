import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(GoogleLogout, ironOptions);

/**
 * The Google logout function for OAuth2
 *
 * @param {NextApiRequest} req The request object
 * @param {NextApiResponse} res The response object
 */
async function GoogleLogout(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.send({ status: 200, ok: true });
  res.end();
}
