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

type WelcomeEmailProps = {
  firstName?: string;
  appUrl: string;
};

export default function WelcomeEmail({ firstName, appUrl }: WelcomeEmailProps) {
  const greeting = firstName ? `Hey ${firstName},` : "Hey,";

  return (
    <Html>
      <Head />
      <Preview>I&apos;m glad you&apos;re here. Quick tip before you start.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={brand}>
            <Text style={wordmark}>
              humora<span style={dot}>.</span>
            </Text>
          </Section>

          <Heading style={h1}>{greeting}</Heading>

          <Text style={paragraph}>
            I&apos;m Humora. Glad you&apos;re here.
          </Text>

          <Text style={paragraph}>
            Quick tip before you start: paste your AI draft on the left, hit
            humanize, and read what I send back. If it reads off, hit &ldquo;Run
            again&rdquo; — sometimes I need a second pass to get the rhythm right.
          </Text>

          <Section style={ctaWrap}>
            <Link href={`${appUrl}/app`} style={cta}>
              Open the editor
            </Link>
          </Section>

          <Text style={paragraph}>
            You&apos;ve got 500 free words a month on the house. They reset on
            the 1st. When you outgrow it, Pro is $19 and gives you 50,000.
          </Text>

          <Text style={paragraph}>
            Hit reply if anything breaks or feels weird. A real human reads
            this inbox.
          </Text>

          <Text style={signoff}>— Humora</Text>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re getting this because you signed up at{" "}
              <Link href={appUrl} style={footerLink}>
                humora.ai
              </Link>
              . Made with patience.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#FAFAF9",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  margin: 0,
  padding: 0,
};

const container = {
  margin: "0 auto",
  padding: "48px 24px",
  maxWidth: "560px",
};

const brand = {
  marginBottom: "32px",
};

const wordmark = {
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#171717",
  margin: 0,
};

const dot = {
  color: "#FF6B47",
};

const h1 = {
  fontSize: "28px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#171717",
  margin: "0 0 16px",
  lineHeight: 1.2,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: 1.6,
  color: "#404040",
  margin: "0 0 16px",
};

const ctaWrap = {
  margin: "32px 0",
};

const cta = {
  display: "inline-block",
  backgroundColor: "#FF6B47",
  color: "#FFFFFF",
  fontSize: "15px",
  fontWeight: 500,
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "999px",
};

const signoff = {
  fontSize: "16px",
  color: "#171717",
  margin: "24px 0 0",
};

const footer = {
  marginTop: "48px",
  paddingTop: "24px",
  borderTop: "1px solid #E7E5E1",
};

const footerText = {
  fontSize: "13px",
  color: "#737373",
  lineHeight: 1.5,
  margin: 0,
};

const footerLink = {
  color: "#737373",
  textDecoration: "underline",
};
