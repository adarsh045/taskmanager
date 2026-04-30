const crypto = require("crypto");
const ApiError = require("./ApiError");

const PASSWORD_KEY_LENGTH = 64;
const DEFAULT_JWT_SECRET = "development-jwt-secret-change-me";

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

function parseDuration(value) {
  if (typeof value === "number") {
    return value;
  }

  const match = String(value).trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    throw new ApiError(500, "Invalid JWT expiration format.");
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const unitMap = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24
  };

  return amount * unitMap[unit];
}

function toBase64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value));

  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalizedValue.length % 4)) % 4;

  return Buffer.from(`${normalizedValue}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function signJwt(payload, secret, options = {}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresIn = options.expiresIn ? parseDuration(options.expiresIn) : null;

  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const tokenPayload = {
    ...payload,
    iat: issuedAt
  };

  if (expiresIn) {
    tokenPayload.exp = issuedAt + expiresIn;
  }

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const signature = crypto.createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest();
  const encodedSignature = toBase64Url(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function verifyJwt(token, secret) {
  const parts = String(token || "").split(".");

  if (parts.length !== 3) {
    throw new ApiError(401, "Invalid authentication token.");
  }

  const [encodedHeader, encodedPayload, providedSignature] = parts;
  const expectedSignature = toBase64Url(
    crypto.createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest()
  );

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new ApiError(401, "Invalid authentication token.");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new ApiError(401, "Authentication token has expired.");
  }

  return payload;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, PASSWORD_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }

      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function verifyPassword(password, hashedPassword) {
  const [salt, storedHash] = String(hashedPassword || "").split(":");

  if (!salt || !storedHash) {
    return false;
  }

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, PASSWORD_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }

      const storedBuffer = Buffer.from(storedHash, "hex");

      if (storedBuffer.length !== derivedKey.length) {
        return resolve(false);
      }

      resolve(crypto.timingSafeEqual(storedBuffer, derivedKey));
    });
  });
}

module.exports = {
  getJwtSecret,
  signJwt,
  verifyJwt,
  hashPassword,
  verifyPassword
};

