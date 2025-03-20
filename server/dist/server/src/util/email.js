"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const render_1 = require("@react-email/render");
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer = __importStar(require("nodemailer"));
const template_1 = require("../../../src/components/email/template");
dotenv_1.default.config({
  path: "../.env",
});
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_SMTP_HOST ?? "",
  port: process.env.NEXT_PUBLIC_SMTP_PORT ?? 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER ?? "",
    pass: process.env.NEXT_PUBLIC_SMTP_PASS ?? "",
  },
});
const sendEmail = async (subject, body, recipients, template) => {
  const fromLine = process.env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply";
  let emailHtml = "";
  switch (template) {
    case "modern":
      emailHtml = await (0, render_1.render)(
        (0, template_1.ModernBusinessTemplate)({ body }),
      );
      break;
    case "minimalist":
      emailHtml = await (0, render_1.render)(
        (0, template_1.MinimalistTemplate)({ body }),
      );
      break;
    case "vibrant":
      emailHtml = await (0, render_1.render)(
        (0, template_1.VibrantTemplate)({ body }),
      );
      break;
    case "classic":
      emailHtml = await (0, render_1.render)(
        (0, template_1.CorporateTemplate)({ body }),
      );
      break;
    default:
      emailHtml = body;
  }
  return await transporter.sendMail({
    from: fromLine,
    to: recipients.join(", "),
    subject: subject,
    text: body,
    html: emailHtml,
  });
};
exports.sendEmail = sendEmail;
