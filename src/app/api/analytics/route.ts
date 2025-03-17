// app/api/analytics/route.ts
export const GET = async () => {
  try {
    const apiKey = process.env.POSTHOG_API_KEY;
    const projectId = process.env.PROJECT_ID;

    if (!apiKey) {
      return Response.json(
        { error: "PostHog API key is not configured" },
        { status: 500 },
      );
    }

    if (!projectId) {
      return Response.json(
        { error: "PostHog project ID is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://us.posthog.com/api/projects/${projectId}/event_definitions/`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("PostHog API status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PostHog API error response:", errorText);
      throw new Error(
        `Failed to fetch PostHog analytics: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("PostHog API error:", error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    } else {
      return Response.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
};
