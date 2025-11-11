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
} from "@react-email/components";
import * as React from "react";

interface OrganizationInvitationEmailProps {
  userEmail: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

export const OrganizationInvitationEmail = ({
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: OrganizationInvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You{"'"}re invited to join {teamName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>BlueHeart Automation</Text>
          </Section>

          <Heading style={h1}>
            You{"'"}re invited to join {teamName}
          </Heading>

          <Text style={text}>
            <strong>{invitedByUsername}</strong> ({invitedByEmail}) has invited
            you to join their organization <strong>{teamName}</strong>.
          </Text>

          <Text style={text}>
            Click the button below to accept the invitation and get started:
          </Text>

          <Section style={buttonContainer}>
            <Link style={button} href={inviteLink}>
              Accept Invitation
            </Link>
          </Section>

          <Text style={text}>
            If the button doesn{"'"}t work, you can copy and paste this link
            into your browser:
          </Text>

          <Text style={link}>{inviteLink}</Text>

          <Text style={text}>
            This invitation will expire in 7 days. If you don{"'"}t want to join
            this organization, you can safely ignore this email.
          </Text>

          <Text style={footer}>
            If you have any questions, please contact {invitedByEmail}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrganizationInvitationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logoContainer = {
  margin: "32px 0",
};

const logo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  textAlign: "center" as const,
  margin: "0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
};

const link = {
  color: "#3b82f6",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  margin: "16px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0",
  textAlign: "center" as const,
};
