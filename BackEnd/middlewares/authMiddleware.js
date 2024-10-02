import cookie from 'cookie'

const authMiddleware = async (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  if (typeof cookieHeader !== 'string') {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;