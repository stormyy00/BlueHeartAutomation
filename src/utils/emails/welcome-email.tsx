import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

type WelcomeEmailProps = {
  userName?: string;
  userEmail?: string;
  dashboardLink?: string;
};

const WelcomeEmail = ({ userName, dashboardLink }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Ttickle - Amplify your social outreach</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                blue: "#006d77",
                lightblue: "#83c5be",
                white: "#edf6f9",
                orange: "#ff9f1c",
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-10 px-5 max-w-2xl">
            <Section className="bg-white rounded-lg p-10 shadow-md">
              <div className="flex items-center gap-2 text-3xl font-bold mb-2 text-ttickles-blue">
                Ttickle
              </div>

              <Heading className="text-2xl font-semibold text-ttickles-blue mb-4 mt-8">
                Welcome to Ttickle! 🎉
              </Heading>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Hi {userName || "there"},
              </Text>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                We'&apos;re thrilled to have you join Ttickle - your AI-powered
                platform to amplify social outreach and create compelling
                content for your cause.
              </Text>

              <Section className="bg-ttickles-lightblue p-6 rounded-md mb-6">
                <Heading className="text-lg font-semibold text-ttickles-blue mb-3 mt-0">
                  What you can do with Ttickle:
                </Heading>
                <Text className="text-base text-gray-700 mb-2">
                  ✨ Create engaging newsletters in minutes
                </Text>
                <Text className="text-base text-gray-700 mb-2">
                  📱 Generate impactful social media posts
                </Text>
                <Text className="text-base text-gray-700 mb-2">
                  🤖 Leverage AI-powered automation
                </Text>
                <Text className="text-base text-gray-700 mb-0">
                  💚 Free forever, built for impact
                </Text>
              </Section>

              <Text className="text-base text-gray-600 mb-6 leading-relaxed">
                Ready to amplify your message? Click below to get started:
              </Text>

              <Section className="mb-6">
                <Link
                  href={dashboardLink}
                  className="inline-block bg-ttickles-blue text-white px-8 py-3 rounded-md font-semibold text-base no-underline"
                >
                  Go to Dashboard
                </Link>
              </Section>

              <Text className="text-base text-gray-600 mb-4 leading-relaxed">
                Need help getting started? Check out our{" "}
                <Link href="#" className="text-ttickles-blue underline">
                  quick start guide
                </Link>{" "}
                or reach out to our support team.
              </Text>

              <Section className="mt-8 pt-6 border-t border-gray-200">
                <Text className="text-sm text-gray-400 leading-relaxed mb-2">
                  <strong className="text-gray-600">Ttickle</strong> -
                  Non-profit for the heart
                </Text>
                <Text className="text-sm text-gray-400 leading-relaxed mb-0">
                  Amplify your social outreach in a few clicks.
                </Text>
              </Section>

              <Text className="text-center text-xs text-gray-400 mt-6 mb-0">
                © 2025 Ttickle. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
