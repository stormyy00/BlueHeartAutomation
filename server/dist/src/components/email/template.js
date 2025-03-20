"use strict";
// import {
//   Body,
//   Container,
//   Head,
//   Heading,
//   Html,
//   Preview,
//   Text,
//   Button,
//   Tailwind,
// } from '@react-email/components';
// import * as React from 'react';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateTemplate =
  exports.VibrantTemplate =
  exports.MinimalistTemplate =
  exports.ModernBusinessTemplate =
    void 0;
// export const Email = ({ body, name = "user" }) => (
//   <Html>
//     <Head />
//     <Preview>Welcome to our platform!</Preview>
//     <Tailwind>
//       <Body className="bg-gray-100 font-sans py-5 px-5">
//         <Container className="mx-auto bg-white rounded-lg shadow-md p-8 max-w-xl">
//           <Heading className="text-2xl font-bold text-gray-800 mb-4">BlueHearts Monthly, {name}!</Heading>
//           <Text className="text-gray-600 mb-4">
//             We're excited to have you on board. Get started by exploring our platform.
//           </Text>
//           <Text className="text-gray-600 mb-6">
//             {body}
//           </Text>
//           <Button
//             href="https://blue-heart-automation.vercel.app/"
//             className="bg-blue-600 text-white font-medium px-6 py-3 rounded hover:bg-blue-700 transition-colors"
//           >
//             Go to Dashboard
//           </Button>
//         </Container>
//       </Body>
//     </Tailwind>
//   </Html>
// );
// export default Email;
const react_1 = __importDefault(require("react"));
const components_1 = require("@react-email/components");
// Template 1: Modern Business
const ModernBusinessTemplate = ({
  previewText = "Ttickle newsletter is here!",
  headerImage = "https://jezaktl1r2.ufs.sh/f/AdpLMvBHJtoLyy8adLJFMrTXDqJsZ7j1ocgNIG3Hv9fhWKSk",
  date = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  mainHeading = "Monthly Newsletter",
  greeting = "Greets Bluehearts,",
  body = "Welcome to our monthly newsletter where we share the latest updates, articles, and events.",
  mainArticleTitle = "Featured Article",
  mainArticleContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.",
  mainArticleLink = "https://example.com/featured-article",
  footerText = "© 2025 Ttickle. All rights reserved.",
  unsubscribeLink = "https://example.com/unsubscribe",
}) => {
  return react_1.default.createElement(
    components_1.Html,
    null,
    react_1.default.createElement(components_1.Head, null),
    react_1.default.createElement(components_1.Preview, null, previewText),
    react_1.default.createElement(
      components_1.Tailwind,
      null,
      react_1.default.createElement(
        components_1.Body,
        { className: "bg-white font-sans" },
        react_1.default.createElement(
          components_1.Container,
          { className: "mx-auto max-w-600 w-full" },
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-blue-600 text-white p-4 text-center" },
            react_1.default.createElement(
              components_1.Heading,
              { className: "font-bold text-xl text-center" },
              mainHeading,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-blue-100 text-center m-0" },
              date,
            ),
            react_1.default.createElement(components_1.Img, {
              src: headerImage,
              alt: "Header",
              width: "600",
              height: "200",
              className: "absolute inset-0 -z-10",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "p-4 bg-white" },
            react_1.default.createElement(
              components_1.Text,
              { className: "font-medium mb-2" },
              greeting,
            ),
            react_1.default.createElement("div", {
              className: "text-sm text-gray-600 mb-4",
              dangerouslySetInnerHTML: { __html: body },
            }),
            react_1.default.createElement(components_1.Hr, {
              className: "border-t border-gray-200 my-4",
            }),
            react_1.default.createElement(
              components_1.Section,
              { className: "py-4" },
              react_1.default.createElement(
                components_1.Heading,
                { as: "h3", className: "font-bold text-lg mb-2" },
                mainArticleTitle,
              ),
              react_1.default.createElement(
                components_1.Text,
                { className: "text-sm text-gray-700" },
                mainArticleContent.substring(0, 100),
                "...",
              ),
              react_1.default.createElement(
                components_1.Section,
                { className: "mt-3" },
                react_1.default.createElement(
                  components_1.Link,
                  {
                    href: mainArticleLink,
                    className:
                      "bg-blue-600 text-white text-sm px-4 py-2 rounded no-underline",
                  },
                  "Read More",
                ),
              ),
            ),
            react_1.default.createElement(components_1.Hr, {
              className: "border-b border-gray-200 my-4",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-gray-100 p-4 text-center" },
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-500 m-0" },
              footerText,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-400 mt-2 m-0" },
              react_1.default.createElement(
                components_1.Link,
                { href: unsubscribeLink, className: "text-blue-600 underline" },
                "Unsubscribe",
              ),
            ),
          ),
        ),
      ),
    ),
  );
};
exports.ModernBusinessTemplate = ModernBusinessTemplate;
// Template 2: Minimalist
const MinimalistTemplate = ({
  previewText = "Ttickle newsletter is here!",
  headerImage = "https://jezaktl1r2.ufs.sh/f/AdpLMvBHJtoLyy8adLJFMrTXDqJsZ7j1ocgNIG3Hv9fhWKSk",
  date = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  mainHeading = "Monthly Newsletter",
  greeting = "Greets Bluehearts,",
  body = "Welcome to our monthly newsletter where we share the latest updates, articles, and events.",
  mainArticleTitle = "Featured Article",
  mainArticleContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.",
  mainArticleLink = "https://example.com/featured-article",
  footerText = "© 2025 Ttickle. All rights reserved.",
  unsubscribeLink = "https://example.com/unsubscribe",
}) => {
  return react_1.default.createElement(
    components_1.Html,
    null,
    react_1.default.createElement(components_1.Head, null),
    react_1.default.createElement(components_1.Preview, null, previewText),
    react_1.default.createElement(
      components_1.Tailwind,
      null,
      react_1.default.createElement(
        components_1.Body,
        { className: "bg-white font-sans" },
        react_1.default.createElement(
          components_1.Container,
          {
            className:
              "mx-auto max-w-600 w-full border border-gray-100 rounded-lg",
          },
          react_1.default.createElement(
            components_1.Section,
            { className: "p-4 border-b text-center" },
            react_1.default.createElement(
              components_1.Heading,
              { className: "font-light text-xl text-center" },
              mainHeading,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-400 text-center mt-1 m-0" },
              date,
            ),
            react_1.default.createElement(components_1.Img, {
              src: headerImage,
              alt: "Header",
              width: "600",
              height: "200",
              className: "absolute inset-0 -z-10",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "p-6 bg-white" },
            react_1.default.createElement(
              components_1.Text,
              { className: "font-light mb-2" },
              greeting,
            ),
            react_1.default.createElement("div", {
              className: "text-sm text-gray-600 mb-4",
              dangerouslySetInnerHTML: {
                __html: body,
              },
            }),
            react_1.default.createElement(
              components_1.Section,
              { className: "py-4 my-4" },
              react_1.default.createElement(
                components_1.Heading,
                { as: "h3", className: "font-light text-lg mb-2" },
                mainArticleTitle,
              ),
              react_1.default.createElement(
                components_1.Text,
                { className: "text-sm text-gray-700" },
                mainArticleContent.substring(0, 100),
                "...",
              ),
              react_1.default.createElement(
                components_1.Section,
                { className: "mt-3" },
                react_1.default.createElement(
                  components_1.Link,
                  {
                    href: mainArticleLink,
                    className:
                      "border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded no-underline",
                  },
                  "Read More",
                ),
              ),
            ),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "p-4 text-center" },
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-500 m-0" },
              footerText,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-400 mt-2 m-0" },
              react_1.default.createElement(
                components_1.Link,
                { href: unsubscribeLink, className: "text-gray-500 underline" },
                "Unsubscribe",
              ),
            ),
          ),
        ),
      ),
    ),
  );
};
exports.MinimalistTemplate = MinimalistTemplate;
// Template 3: Vibrant
const VibrantTemplate = ({
  previewText = "Ttickle newsletter is here!",
  headerImage = "https://jezaktl1r2.ufs.sh/f/AdpLMvBHJtoLyy8adLJFMrTXDqJsZ7j1ocgNIG3Hv9fhWKSk",
  date = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  mainHeading = "Monthly Newsletter",
  greeting = "Greets Bluehearts,",
  body = "Welcome to our monthly newsletter where we share the latest updates, articles, and events.",
  mainArticleTitle = "Featured Article",
  mainArticleContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.",
  mainArticleLink = "https://example.com/featured-article",
  footerText = "© 2025 Ttickle. All rights reserved.",
  unsubscribeLink = "https://example.com/unsubscribe",
}) => {
  return react_1.default.createElement(
    components_1.Html,
    null,
    react_1.default.createElement(components_1.Head, null),
    react_1.default.createElement(components_1.Preview, null, previewText),
    react_1.default.createElement(
      components_1.Tailwind,
      null,
      react_1.default.createElement(
        components_1.Body,
        { className: "bg-white font-sans" },
        react_1.default.createElement(
          components_1.Container,
          { className: "mx-auto max-w-600 w-full border rounded-lg" },
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-purple-500 text-white p-4 text-center" },
            react_1.default.createElement(
              components_1.Heading,
              { className: "font-bold text-xl text-center" },
              mainHeading,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-white text-center opacity-75 m-0" },
              date,
            ),
            react_1.default.createElement(components_1.Img, {
              src: headerImage,
              alt: "Header",
              width: "600",
              height: "200",
              className: "absolute inset-0 -z-10",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "p-4 bg-white" },
            react_1.default.createElement(
              components_1.Text,
              { className: "font-medium mb-2" },
              greeting,
            ),
            react_1.default.createElement("div", {
              className: "text-sm text-gray-600 mb-4",
              dangerouslySetInnerHTML: {
                __html: body,
              },
            }),
            react_1.default.createElement(
              components_1.Section,
              {
                className:
                  "bg-gradient-to-r from-yellow-50 to-red-50 p-4 rounded-lg my-4",
              },
              react_1.default.createElement(
                components_1.Heading,
                {
                  as: "h3",
                  className: "font-bold text-lg mb-2 text-purple-600",
                },
                mainArticleTitle,
              ),
              react_1.default.createElement(
                components_1.Text,
                { className: "text-sm text-gray-700" },
                mainArticleContent.substring(0, 100),
                "...",
              ),
              react_1.default.createElement(
                components_1.Section,
                { className: "mt-3" },
                react_1.default.createElement(
                  components_1.Link,
                  {
                    href: mainArticleLink,
                    className:
                      "bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded no-underline",
                  },
                  "Read More",
                ),
              ),
            ),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-gray-100 p-4 text-center" },
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-500 m-0" },
              footerText,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-400 mt-2 m-0" },
              react_1.default.createElement(
                components_1.Link,
                {
                  href: unsubscribeLink,
                  className: "text-purple-600 underline",
                },
                "Unsubscribe",
              ),
            ),
          ),
        ),
      ),
    ),
  );
};
exports.VibrantTemplate = VibrantTemplate;
// Template 4: Corporate
const CorporateTemplate = ({
  previewText = "Ttickle newsletter is here!",
  headerImage = "https://jezaktl1r2.ufs.sh/f/AdpLMvBHJtoLyy8adLJFMrTXDqJsZ7j1ocgNIG3Hv9fhWKSk",
  date = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  mainHeading = "Monthly Newsletter",
  greeting = "Greets Bluehearts,",
  body = "Welcome to our monthly newsletter where we share the latest updates, articles, and events.",
  mainArticleTitle = "Featured Article",
  mainArticleContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.",
  mainArticleLink = "https://example.com/featured-article",
  footerText = "© 2025 Ttickle. All rights reserved.",
  unsubscribeLink = "https://example.com/unsubscribe",
}) => {
  return react_1.default.createElement(
    components_1.Html,
    null,
    react_1.default.createElement(components_1.Head, null),
    react_1.default.createElement(components_1.Preview, null, previewText),
    react_1.default.createElement(
      components_1.Tailwind,
      null,
      react_1.default.createElement(
        components_1.Body,
        { className: "bg-white font-sans" },
        react_1.default.createElement(
          components_1.Container,
          { className: "mx-auto max-w-600 w-full border rounded-lg" },
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-gray-800 text-white p-4 text-center" },
            react_1.default.createElement(
              components_1.Heading,
              { className: "font-bold text-xl text-center" },
              mainHeading,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-300 text-center m-0" },
              date,
            ),
            react_1.default.createElement(components_1.Img, {
              src: headerImage,
              alt: "Header",
              width: "600",
              height: "200",
              className: "absolute inset-0 -z-10",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "p-4 bg-white" },
            react_1.default.createElement(
              components_1.Text,
              { className: "font-medium mb-2" },
              greeting,
            ),
            react_1.default.createElement("div", {
              className: "text-sm text-gray-600 mb-4",
              dangerouslySetInnerHTML: {
                __html: body,
              },
            }),
            react_1.default.createElement(components_1.Hr, {
              className: "border-t border-gray-200 my-4",
            }),
            react_1.default.createElement(
              components_1.Section,
              { className: "py-4" },
              react_1.default.createElement(
                components_1.Heading,
                { as: "h3", className: "font-bold text-lg mb-2" },
                mainArticleTitle,
              ),
              react_1.default.createElement(
                components_1.Text,
                { className: "text-sm text-gray-700" },
                mainArticleContent.substring(0, 100),
                "...",
              ),
              react_1.default.createElement(
                components_1.Section,
                { className: "mt-3" },
                react_1.default.createElement(
                  components_1.Link,
                  {
                    href: mainArticleLink,
                    className:
                      "bg-gray-800 text-white text-sm px-4 py-2 rounded no-underline",
                  },
                  "Read More",
                ),
              ),
            ),
            react_1.default.createElement(components_1.Hr, {
              className: "border-b border-gray-200 my-4",
            }),
          ),
          react_1.default.createElement(
            components_1.Section,
            { className: "bg-gray-100 p-4 text-center" },
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-500 m-0" },
              footerText,
            ),
            react_1.default.createElement(
              components_1.Text,
              { className: "text-xs text-gray-400 mt-2 m-0" },
              react_1.default.createElement(
                components_1.Link,
                { href: unsubscribeLink, className: "text-gray-600 underline" },
                "Unsubscribe",
              ),
            ),
          ),
        ),
      ),
    ),
  );
};
exports.CorporateTemplate = CorporateTemplate;
exports.default = exports.ModernBusinessTemplate;
