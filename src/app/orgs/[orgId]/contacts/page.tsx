import Index from "./_index";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { orgId: string };
};

const page = ({ params }: PageProps) => {
  return <Index params={params} />;
};

export default page;
