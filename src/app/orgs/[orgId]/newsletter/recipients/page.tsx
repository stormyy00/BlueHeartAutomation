import Index from "./_index";

type Params = {
  params: {
    orgId: string;
  };
};

const Page = ({ params }: Params) => {
  const { orgId } = params;
  return <Index orgId={orgId} />;
};

export default Page;
