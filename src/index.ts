import { Elysia, t } from "elysia";
import { generate } from "promptparse";
import * as QRCode from "qrcode";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get(
    "/anyId",
    async ({ query, set }) => {
      const { type, target, amount } = query;

      const payload = generate.anyId({
        type,
        target,
        amount,
      });

      set.headers["content-type"] = "image/png";

      return await QRCode.toBuffer(payload, {
        width: 320,
      });
    },
    {
      query: t.Object({
        type: t.Union([
          t.Literal("MSISDN"),
          t.Literal("NATID"),
          t.Literal("EWALLETID"),
        ]),
        target: t.String(),
        amount: t.Optional(t.Numeric({ minimum: 0 })),
      }),
    }
  )
  .get(
    "/truemoney",
    async ({ query, set }) => {
      const { mobileNo, amount, message } = query;

      const payload = generate.truemoney({
        mobileNo,
        amount,
        message,
      });

      set.headers["content-type"] = "image/png";

      return await QRCode.toBuffer(payload, {
        width: 320,
      });
    },
    {
      query: t.Object({
        mobileNo: t.String(),
        amount: t.Optional(t.Numeric({ minimum: 0 })),
        message: t.Optional(t.String()),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
